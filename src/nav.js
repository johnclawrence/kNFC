//This doc contains all javascript for the nav panel and javascript that manipualtes the nav pannel.
const {ipcRenderer} = require('electron')
const navOut = document.getElementById('nav')
const initialNav=
`<div class="nav-inner" id=navigator>
    <button class="pure-button button-xlarge" id="nav-playerDB-button" onclick="navPlayerDB('nav-playerDB-button')">Player Database</button></br></br>
    <button class="pure-button button-xlarge" id="nav-characterDB-button" onclick="navCharacterDB('nav-characterDB-button')">Character Database</button></br></br>
    <button class="pure-button button-xlarge" id="nav-nfc-button" onclick="navNFC('nav-nfc-button')">NFC</button></br></br>
</div>`
document.addEventListener('DOMContentLoaded', ()=> {
    navOut.innerHTML = initialNav
})

function resetNavButtons(){
    b1=document.getElementById("nav-playerDB-button")
    b2=document.getElementById("nav-characterDB-button")
    b3=document.getElementById("nav-nfc-button")
    b1.classList.remove("pure-button-active")
    b2.classList.remove("pure-button-active")
    b3.classList.remove("pure-button-active")
}

function toggleButton(buttonID){
    var buttonEID = document.getElementById(buttonID)
    buttonEID.classList.add("pure-button-active")
}


function navPlayerDB(buttonID){
    resetNavButtons()
    toggleButton(buttonID)
    closeAllLists()
    playerDBHeader()
    openPlayerDB('list-playerDB-button')
}

  function navCharacterDB(buttonID){
    resetNavButtons()
    toggleButton(buttonID)
    closeAllLists()
    characterDBHeader()
    openCharacterDB('list-characterDB-button')
  }

  function navNFC(buttonID){
    resetNavButtons()
    toggleButton(buttonID)
    closeAllLists()
    nfcDBHeader()
  }