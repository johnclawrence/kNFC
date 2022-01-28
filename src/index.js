
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { emit } = require('process');
const { readFileSync } = require('fs');
const {NFC} = require('nfc-pcsc');
const nfc = new NFC()
var readerG


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
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  //This is where database functions live
  require(path.join(__dirname, './dbQueries.js'))
  //This is where NFC functions live
  require(path.join(__dirname, './nfcQueries.js'))
  nfc.on('reader', async reader => {
    reader.on('error', err => {console.log(`NFC (${reader.reader.name}): an error occurred`, err)})
    reader.on('end', () => {console.log(`NFC (${reader.reader.name}): device removed`)})
    var readerDevice=reader.reader.name
    if (mainWindow){mainWindow.send('nfc-iReader', reader)}
    reader.on('card', async card => {
      var uid=card.uid
      var cardType='Unknown Card Type'
      if (await uid){
        atr=card.atr
        if(atr.toString('hex')=='3b8f8001804f0ca000000306030001000000006a'){
            var cardType='MiFare Classic 1k'
          }
        res = [readerDevice,cardType,uid]
        if(mainWindow){mainWindow.send('nfc-init', {message: res})}
        if(mainWindow){mainWindow.send('nfc-iCard', {message: card})}
        }
      })
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


