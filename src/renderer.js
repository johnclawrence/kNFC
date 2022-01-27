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
  ipcRenderer.on('send-playerDB-list', (event, message) => {
    var rowStart='<div class="email-item pure-g" onclick="getPlayerDetailed('
    var rowVar=')"><div class="pure-u-3-4"><h5 class="email-name">'
    var rowInner='</h5><h4 class="email-subject">'
    var rowEnd='</h4></div></div>'
    let htmlOut = message.message.map((elem)=>{
      return rowStart+elem.pID+rowVar+elem.fName+elem.lName+rowInner+elem.pID+rowEnd;
    }).join("");
    
    const deviceOut = document.getElementById('list-body')
    deviceOut.innerHTML = htmlOut
  }) 
  ipcRenderer.on('send-specific-player', (event, message) => {
    const deviceOut = document.getElementById('playerDB-main')
    deviceOut.innerText = message.message
  }) 
})()
