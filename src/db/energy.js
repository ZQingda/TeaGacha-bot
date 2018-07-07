const sqlite3 = require('sqlite3').verbose();
const config = require('../config');


function updateAllUserEnergy(modifier){
  let sqlquery = "UPDATE users SET energy = max(0, min( energy+?, energy_max));"
  let db = new sqlite3.Database(config.connection, sqlite3.OPEN_READWRITE, (err) => {if (err) {reject(err);}});
  return new Promise(function(resolve, reject) {
    db.run(sqlquery, [modifier], (err) => {
      if (err) {
          return console.error(err.stack);
      }
    });
    db.close();
    resolve(true);
  });
}


function updateMaxEnergy(userId, modifier){
  let sqlquery = "UPDATE users SET energy_max = energy_max + ?;"
  let db = new sqlite3.Database(config.connection, sqlite3.OPEN_READWRITE, (err) => {if (err) {reject(err);}});
  return new Promise(function(resolve, reject) {
    db.run(sqlquery, [modifier], (err) => {
      if (err) {
          return console.error(err.stack);
      }
    });
    db.close();
    resolve(true);
  });
}

module.exports = {
  updateAllUserEnergy: updateAllUserEnergy,
  updateMaxEnergy: updateMaxEnergy
}