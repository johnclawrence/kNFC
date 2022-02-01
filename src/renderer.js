(() => {
  //NFC Functions
  const {ipcRenderer} = require('electron')
  ipcRenderer.on('nfc-iCard', (event, message) => {
    console.log(message.message)

  })
  ipcRenderer.on('nfc-iReader', (event, message) => {
    console.log(message.message)
 
  })
  ipcRenderer.on('nfc-init', (event, message) => {
    const listbody = document.getElementById('list-body')
    var reader=message.message[0]
    var cardType=message.message[1]
    var uid=message.message[2]
    outhtml=
    `
    <form class="pure-form pure-form-stacked">
    <fieldset>
        <legend>Reader ${reader} <br />
        cardType ${cardType} <br />
        cardUID ${uid}</legend>
        <label for="stacked-key">Key</label>
        <input type="password" id="stacked-key" placeholder="Password" />
        <label for="stacked-keyType">Key Type</label>
        <select id="stacked-keyType">
            <option>Key A</option>
            <option>Key B</option>
        </select><br />
        <button class="pure-button pure-button-primary" type='button' onclick="listReadNFCAll()" >Access</button>
      </fieldset>
      </form>`
    listbody.innerHTML = outhtml
  })  
  ipcRenderer.on('nfc-raw', (event, message) => {
    const deviceOut = document.getElementById('main-body')
    deviceOut.innerText = message.message
  })  
  //SQL Functions
    //Player SQL Functions
  ipcRenderer.on('send-playerDB-list', (event, message) => {
    var searchbar=
    `<form class="pure-form">
      <input type="text" class="pure-input-rounded" />
      <button class="pure-button">Search</button>
    </form>`
    var rowStart='<div class="email-item pure-g" onclick="getPlayerDetailed('
    var rowVar=')"><div class="pure-u-3-4"><h5 class="email-name">'
    var rowInner='</h5><h4 class="email-subject">'
    var rowEnd='</h4></div></div>'
    let htmlOut = message.message.map((elem)=>{
      return rowStart+elem.pID+rowVar+elem.fName+elem.lName+rowInner+elem.pID+rowEnd;
    }).join("");
    const deviceOut = document.getElementById('list-body')
    deviceOut.innerHTML = searchbar+htmlOut
  }) 
  ipcRenderer.on('send-specific-player', (event, message) => {
    const deviceOut = document.getElementById('main-body')
    let htmlOut = message.message.map((elem)=>{
      return (
        '<br />DoB: '+elem.dob+
        '<br />Emergency Name: '+elem.eName+
        '<br />Emergency Tel: '+elem.eTel+
        '<br />Email: '+elem.email+
        '<br />First Name: '+elem.fName+
        '<br />Last Name: '+elem.lName+
        '<br />Legal: '+elem.legalYN+
        '<br />LoginID: '+elem.loginID+
        '<br />pID: '+elem.pID+
        '<br />prefEmail: '+elem.prefEmail+
        '<br />prefText: '+elem.prefText+
        '<br />tel: '+elem.ptel
      )
    }).join("");
    deviceOut.innerHTML = htmlOut
  }) 
      //Character SQL Functions
  ipcRenderer.on('send-characterDB-list', (event, message) => {
    var searchbar=
    `<form class="pure-form">
      <input type="text" class="pure-input-rounded" />
      <button class="pure-button">Search</button>
    </form>`
    var rowStart='<div class="email-item pure-g" onclick="getCharacterDetailed('
    var rowVar=')"><div class="pure-u-3-4"><h5 class="email-name">'
    var rowInner='</h5><h4 class="email-subject">'
    var rowEnd='</h4></div></div>'
    let htmlOut = message.message.map((elem)=>{
      return rowStart+elem.cID+rowVar+elem.cName+rowInner+elem.cID+rowEnd;
    }).join("");
    const deviceOut = document.getElementById('list-body')
    deviceOut.innerHTML = searchbar+htmlOut
  }) 
  ipcRenderer.on('send-specific-character', (event, message) => {
    const deviceOut = document.getElementById('main-body')
    let htmlOut = message.message.map((elem)=>{
      return (
        '<br />Character ID: '+elem.cID+
        '<br />Primary Player Name: '+elem.primarypID+
        '<br />Character Name: '+elem.cName
      )
    }).join("");
    deviceOut.innerHTML = htmlOut
  }) 
    
})()
