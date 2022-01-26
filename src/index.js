
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const {NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B} = require('nfc-pcsc');
const { emit } = require('process');
const { readFileSync } = require('fs');
const nfc = new NFC()
var readerOn = true



// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      contextIsolation: false, 
      preload: path.join(__dirname, './preload.js')
    }
  });
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  //local Node.js server
  let server = require('../server/server')
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  var key = 'FFFFFFFFFFFF';
  var keyType = KEY_TYPE_A;
  var Sector = 0
  var readerG, uid, atr, sectorMax


  nfc.on('reader', async reader => {
    readerG=reader
    if(mainWindow){mainWindow.send('attach-device', {message: `NFC (${reader.reader.name}): device attached`})}
    //console.log(`NFC (${reader.reader.name}): device attached`)
    reader.on('card', async card => {
      uid=card.uid
      if (await uid){
        if(mainWindow){mainWindow.send('cardUID', {message: uid})}
      }
      atr=card.atr
      if(await atr.toString('hex')=='3b8f8001804f0ca000000306030001000000006a'){
        if(mainWindow){mainWindow.send('cardType', {message: 'MiFare Classic 1k'})}
        sectorMax=64
      }
      if(await atr.toString('hex')!='3b8f8001804f0ca000000306030001000000006a'){
        if(mainWindow){mainWindow.send('cardType', {message: 'Unknown Card Type'})}
        sectorMax=64
      }
      console.log(`NFC (${reader.reader.name}): card detected`, card.uid)
      if(mainWindow){mainWindow.send('card', {message: `NFC (${reader.reader.name}): card detected`, card})}
    })
    reader.on('error', err => {console.log(`NFC (${reader.reader.name}): an error occurred`, err)})
    reader.on('end', () => {
        console.log(`NFC (${reader.reader.name}): device removed`)
        if(mainWindow){mainWindow.send('remove-device', {message: `NFC (${reader.reader.name}): device removed`})}
    })
  })

  ipcMain.on('key', (event, arg) => {
    console.log(arg)
  })
  ipcMain.on('ab', (event, arg) => {
    console.log(arg)
  })
  ipcMain.on('sector', (event, arg) => {
    Sector = arg
    var toView = readNFCSector(readerG,Sector,keyType, key, mainWindow)
  })
  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log( arg );
    readerOn = arg
    if(mainWindow){mainWindow.send('attach-device', {message: `NFC (${readerG.reader.name}): device attached`})}
  })

  nfc.on('error', err => {console.log('NFC: an error occurred', err)})


  const sqlite3 = require('better-sqlite3-with-prebuilds')
  const db = new sqlite3('./src/localdb.db');
  ipcMain.on('getPlayerList', (event, arg) => {
    const sql = "select * from testtable"
    console.log(sql)
    let stmt = db.prepare(sql);
    let res = stmt.all();
    if(mainWindow){mainWindow.send('resPlayerList', {message: res}
    )}
  })
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
async function authNFC(reader,Sector,keyType, key){
  try {
    await reader.authenticate(Sector, keyType, key);
    console.log(`sector ${Sector} successfully authenticated`);

  } catch (err) {
    console.log(`error when authenticating`, reader, err);
    return;
  }
}
async function readNFCBlock(reader,Block,keyType, key){
  try {
    await reader.authenticate(Block, keyType, key);
  } catch (err) {
    console.log(`error when authenticating`, reader, err);
    return;
  }
  try {
    const data = await reader.read(Block, 16, 16); // blockSize=16 must specified for MIFARE Classic cards
    console.log(`data read`, data);
    const payload = data.readInt32BE(0);
    console.log(`data converted`, payload);
    return(data);
  } catch (err) {
    console.log(`error when reading data`, reader, err);
  }
}
async function readNFCSector(reader,Sector,keyType, key,mainWindow){
  try {
    await reader.authenticate(Sector, keyType, key);
  } catch (err) {
    console.log(`error when authenticating`, reader, err);
    return;
  }
  var blo = Sector % 4
  var sec = (Sector - blo)/4
  var out =[]
  for await (const i of [0,1,2,3]){
    try {
      const data = await reader.read(Sector-blo+i, 16, 16); // blockSize=16 must specified for MIFARE Classic cards
      out[i]= (data.toString('hex'))

    } catch (err) {
      console.log(`error when reading data`, reader, err);
      }
    }
    if(mainWindow){mainWindow.send('deviceOut', {message: out})}
  }


