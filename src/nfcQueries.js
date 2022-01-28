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