const listHeader = document.getElementById('list-header')
const listBody = document.getElementById('list-body')

function closeAllLists(){
    listHeader.innerHTML = ""
    listBody.innerHTML = ""
  }

function playerDBHeader(){
    var pdbHeader=
    `<div class="email-content-controls pure-u-1-2" id=playerDB-header>
    <button class="pure-button" id="list-characterDB-button" onclick="openPlayerDB('list-characterDB-button')">View Player Database</button>
    <button class="pure-button" id="list-regnewplayer-button" onclick="openRegNewPlayer('list-regnewplayer-button')">Register New Player</button>
    </div>`
    listHeader.innerHTML=pdbHeader
}
function resetListButtons(){
    b1=document.getElementById("list-characterDB-button")
    b2=document.getElementById("list-regnewplayer-button")
    b1.classList.remove("pure-button-active")
    b2.classList.remove("pure-button-active")
}

function openPlayerDB(buttonID){
    const {ipcRenderer} = require('electron')
    ipcRenderer.send('get-player-list')
    resetListButtons()
    toggleButton(buttonID)
}

function openRegNewPlayer(buttonID){
    var regnewplayerform=
    `<form class="pure-form pure-form-aligned"id="new-player-reg-list">
        <fieldset>
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