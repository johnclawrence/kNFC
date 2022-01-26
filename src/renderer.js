(() => {
  const {ipcRenderer} = require('electron')
  ipcRenderer.on('attach-device', (event, message) => {
    const readerStatus = document.getElementById('readerStatus')
    readerStatus.innerText = message.message
  })
  ipcRenderer.on('remove-device', (event, message) => {
    const readerStatus = document.getElementById('readerStatus')
    readerStatus.innerText = message.message
  })
  ipcRenderer.on('card', (event, message) => {
    const messageSpan = document.getElementById('message')
    const cardSpan = document.getElementById('card')
    cardSpan.innerText = message.card.uid
  })
  ipcRenderer.on('cardType', (event, message) => {
    const cardType = document.getElementById('cardType')
    cardType.innerText = message.message
  })
  ipcRenderer.on('cardUID', (event, message) => {
    const cardUID = document.getElementById('cardUID')
    cardUID.innerText = message.message
  })    
  ipcRenderer.on('deviceOut', (event, message) => {
    const deviceOut = document.getElementById('deviceOut')
    deviceOut.innerText = message.message
  })  
  ipcRenderer.on('resPlayerList', (event, message) => {
    const deviceOut = document.getElementById('PD2')
    deviceOut.innerText = message.message
  }) 
})()
