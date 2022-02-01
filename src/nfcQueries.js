const { app, BrowserWindow, ipcMain } = require('electron');
const {NFC, AG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B} = require('nfc-pcsc');
var readerOn = true
let readerG
var key = 'FFFFFFFFFFFF';
var keyType = KEY_TYPE_A;
var Sector = 0
var cardG, atr, sectorMax
const nfc = new NFC()

nfc.on('reader', async reader => {
    readerG=reader
    reader.on('card', async card => {
        cardG=card
    })
})


ipcMain.on('nfc-on', (event, arg) => {
    var window=event.sender
    if (readerG){
        var readerDevice=readerG.reader.name
    }else{var readerDevice="Reader Not Detected"}
    if (cardG){
        var uid=cardG.uid
        atr=cardG.atr
        if(atr.toString('hex')=='3b8f8001804f0ca000000306030001000000006a'){
        var cardType='MiFare Classic 1k'
        sectorMax=64
        }else{
        var uid='no card'
        var cardType='Unknown Card Type'
        sectorMax=64
        }
    }
    res = [readerDevice,cardType,uid]
    if(window){window.send('nfc-init', {message: res})}
})

ipcMain.on('nfc-readall', (event, arg) => {
    keyType = arg[1]
    key = arg[0]
    Sector=1
    window=event.sender
    var key = 'FFFFFFFFFFFF';
    var keyType = KEY_TYPE_A;
  var toView = readNFCSector(readerG,Sector,keyType, key, window)
})



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
      if(mainWindow){mainWindow.send('nfc-raw', {message: out})}
    }


//ipcMain.on('key', (event, arg) => {
//  console.log(arg)
//})
//ipcMain.on('ab', (event, arg) => {
//  console.log(arg)
//})
//ipcMain.on('sector', (event, arg) => {
//  Sector = arg
//  var toView = readNFCSector(readerG,Sector,keyType, key, mainWindow)
//})
//ipcMain.on('asynchronous-message', (event, arg) => {
//  console.log( arg );
//  readerOn = arg
//  if(mainWindow){mainWindow.send('attach-device', {message: `NFC (${readerG.reader.name}): device attached`})}
//})