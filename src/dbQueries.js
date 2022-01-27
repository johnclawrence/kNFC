const { app, BrowserWindow, ipcMain } = require('electron');
const sqlite3 = require('better-sqlite3-with-prebuilds')
const db = new sqlite3('./src/localdb.db');
ipcMain.on('get-player-list', (event, arg) => {
  var window=event.sender
  const sql = "SELECT * FROM factPlayer"
  let stmt = db.prepare(sql);
  let res = stmt.all();
  if(window){window.send('send-playerDB-list', {message: res}
  )}
})
ipcMain.on('get-specific-player', (event, arg) => {
  var window=event.sender
  const sql = "SELECT * FROM  factPlayer WHERE pID="+arg
  let stmt = db.prepare(sql);
  let res = stmt.all();
  if(window){window.send('send-specific-player', {message: res}
  )}
})
ipcMain.on('make-new-player', (event, arg) => {
  let stmt =  db.prepare("INSERT INTO factPlayer(loginID, fName, lName, email, ptel, prefEmail, prefText, dob, eName, eTel, legalYN)  VALUES (?,?,?,?,?,?,?,?,?,?,?)")
  stmt.run(arg[0],arg[1],arg[2],arg[3],arg[4],arg[5],arg[6],arg[7],arg[8],arg[9],arg[10] )
})