const listHeader = document.getElementById('list-header')
const listBody = document.getElementById('list-body')
//universal code
function closeAllLists(){
    closeAllMains()
    listHeader.innerHTML = ""
    listBody.innerHTML = ""
  }
  function resetListButtons(){
    b1=document.getElementById("list-playerDB-button")
    b2=document.getElementById("list-regnewplayer-button")
    b3=document.getElementById("list-characterDB-button")
    b4=document.getElementById("list-regnewcharacter-button")
    b5=document.getElementById("list-readNFC-button")
    if (b1){
    b1.classList.remove("pure-button-active")
    b2.classList.remove("pure-button-active")}
    if (b3){
    b3.classList.remove("pure-button-active")
    b4.classList.remove("pure-button-active")}
    if (b5){
    b5.classList.remove("pure-button-active")
    }
}
//Player Level Code
function playerDBHeader(){
    var pdbHeader=
    `<div class="pure-u-1-2" id=playerDB-header>
    <button class="pure-button" id="list-playerDB-button" onclick="openPlayerDB('list-playerDB-button')">View Player Database</button>
    <button class="pure-button" id="list-regnewplayer-button" onclick="openRegNewPlayer('list-regnewplayer-button')">Register New Player</button>
    </div>`
    listHeader.innerHTML=pdbHeader
}


function openPlayerDB(buttonID){
    closeAllMains()
    const {ipcRenderer} = require('electron')
    ipcRenderer.send('get-player-list')
    resetListButtons()
    toggleButton(buttonID)
}

function openRegNewPlayer(buttonID){
    var regnewplayerform=
    `<form class="pure-form pure-form-aligned"id="new-player-reg-list">
        <fieldset>
            <span><h2>Required Information</h2></span>
            </br>
            <span class="pure-controls">Player Name</span></br></br>
            <div class="pure-control-group">
                <label for="login-id">Login ID</label>
                <input type="text" id="login-id" placeholder="Login ID" />
            </div>
            <div class="pure-control-group">
                <label for="first-name">First Name</label>
                <input type="text" id="first-name" placeholder="First Name" />
            </div>
            <div class="pure-control-group">
                <label for="last-name">Last Name</label>
                <input type="text" id="last-name" placeholder="Last Name" />
            </div>
            </br>
            <span class="pure-controls">Player Details</span></br></br>
            <div class="pure-control-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Email@gmail.com" />
            </div>
            <div class="pure-control-group">
                <label for="phone">Phone</label>
                <input type="tel" id="ptel" placeholder="614-123-4567" />
            </div>
            <div class="pure-controls">
                <label for="pref-email" class="pure-checkbox">
                <input type="checkbox" id="pref-email" value="" /> Prefer Email
                </label>
                <label for="pref-text" class="pure-checkbox">
                <input type="checkbox" id="pref-text" value="" /> Prefer Text
                </label>
            </div>
            <div class="pure-control-group">
                <label for="dob">Date of Birth</label>
                <input type="text" id="dob" placeholder="MM/DD/YYYY" />
            </div>
            </br><span class="pure-controls">Emergency Contact</span></br></br>
            <div class="pure-control-group">
                <label for="e-name">Emergency Name</label>
                <input type="text" id="ename" placeholder="Emergency Contact" />
            </div>
            <div class="pure-control-group">
                <label for="e-phone">Emergency Phone</label>
                <input type="tel" id="etel" placeholder="614-123-4567" />
            </div>
            </br>
            <span class="pure-controls">Legal Stuff</span></br>
            <div class="pure-controls">
                <label for="checkbox-legal" class="pure-checkbox">
                <input type="checkbox" id="checkbox-legal" value="" /> I&#x27;ve read the terms and conditions
                </label>
                <button type="submit" class="pure-button pure-button-primary" onclick="createNewPlayer()">Submit</button>
            </div>
        </fieldset>
    </form>`
    listBody.innerHTML = regnewplayerform
    resetListButtons()
    toggleButton(buttonID)
    closeAllMains()
    RegisterNewPlayerOptional()
}


function createNewPlayer(){
    const {ipcRenderer} = require('electron')
    try {
    var v1=document.getElementById('login-id').value
    var v2=document.getElementById('first-name').value
    var v3=document.getElementById('last-name').value
    var v4=document.getElementById('email').value
    var v5=document.getElementById('ptel').value
    if (document.getElementById('pref-email').checked){
      v6=1
    }else{v6=0}
    if (document.getElementById('pref-text').checked){
      v7=1
    }else{v7=0}
    var v8=document.getElementById('dob').value
    var v9=document.getElementById('ename').value
    var v10=document.getElementById('etel').value
    if (document.getElementById('checkbox-legal').checked){
      v11=1
    }else{v11=0}
    var arrayout = [v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11]
    ipcRenderer.send('make-new-player',arrayout)}
    catch (error){
    ipcRenderer.send('make-new-player',error)}
    }
  
  function getPlayerDetailed(pID){
    const {ipcRenderer} = require('electron')
    ipcRenderer.send('get-specific-player',pID)}


    //
function characterDBHeader(){
    var pdbHeader=
    `<div class="pure-u-1-2" id=characterDB-header>
    <button class="pure-button" id="list-characterDB-button" onclick="openCharacterDB('list-characterDB-button')">View Character Database</button>
    <button class="pure-button" id="list-regnewcharacter-button" onclick="openRegNewCharacter('list-regnewcharacter-button')">Register New Character</button>
    </div>`
    listHeader.innerHTML=pdbHeader
}

function openCharacterDB(buttonID){    
    closeAllMains()
    const {ipcRenderer} = require('electron')
    ipcRenderer.send('get-character-list')
    resetListButtons()
    toggleButton(buttonID)
}
function openRegNewCharacter(buttonID){
    var regnewcharacterform=
    `<form class="pure-form pure-form-aligned"id="new-character-reg-list">
        <fieldset>
            <span><h2>Required Information</h2></span>
            </br>
            <span class="pure-controls">Character Information</span></br></br>
            <div class="pure-control-group">
                <label for="cid">Character Name</label>
                <input type="text" id="cid" placeholder="Character Name" />
            </div>
            <div class="pure-control-group">
                <label for="primary-pid">Primary Player ID</label>
                <input type="text" id="primary-pid" placeholder="pID" />
            </div>
            <div class="pure-controls">
                <button type="submit" class="pure-button pure-button-primary" onclick="createNewCharacter()">Submit</button>
            </div>
        </fieldset>
    </form>`
    listBody.innerHTML = regnewcharacterform
    resetListButtons()
    toggleButton(buttonID)
    closeAllMains()
    //RegisterNewCharacterOptional()
}

function createNewCharacter(){
    const {ipcRenderer} = require('electron')
    try {
    var v1=document.getElementById('cid').value
    var v2=document.getElementById('primary-pid').value
    var arrayout = [v1,v2]
    ipcRenderer.send('make-new-character',arrayout)}
    catch (error){
    ipcRenderer.send('make-new-character',error)}
}

function getCharacterDetailed(cID){
    const {ipcRenderer} = require('electron')
    ipcRenderer.send('get-specific-character',cID)}

//NFC Stuff
function nfcDBHeader(){
    var pdbHeader=
    `<div class="pure-u-1-2" id=nfc-header>
    <button class="pure-button" id="list-readNFC-button" onclick="readNFC('list-readNFC-button')">readNFC</button>
    </div>`
    listHeader.innerHTML=pdbHeader
}

function readNFC(buttonID){
    resetListButtons()
    toggleButton(buttonID)
    closeAllMains()
    ipcRenderer.send('nfc-on')    
}

function listReadNFCAll(){
    var v1=document.getElementById('stacked-key').value
    var v2=document.getElementById('stacked-keyType').value
    var arrayout = [v1,v2]
    ipcRenderer.send('nfc-readall',arrayout)  
}