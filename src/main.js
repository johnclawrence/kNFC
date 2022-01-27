const mainHeadery = document.getElementById('main-header')
const mainBody = document.getElementById('main-body')

function closeAllMains(){
    mainHeadery.innerHTML = ""
    mainBody.innerHTML = ""
  }
function RegisterNewPlayerOptional(){
    mainBody.innerHTML = "<h2>Optional Information</h2>"
}