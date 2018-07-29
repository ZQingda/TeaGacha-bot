const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

function insertUser(user) {
  return new Promise(function(resolve, reject) {
    let db = new sqlite3.Database(config.connection, (err) => {if (err) {reject(err);}});
    let sqlInsertUser = 'INSERT INTO users (user_id, gems, clovers, energy, energy_max, unit_capacity) VALUES( ?, ?, ?, ?, ?, ?)';
    
    db.run(sqlInsertUser, [user.user_id, user.gems, user.clovers, user.energy, user.energy_max, user.unit_capacity], (err) => {
      if (err) {reject (err);}
      resolve(user);
    });
    db.close();
  });
}

function modUnitCapacity(userId, unit_capacity){
  let sqlquery = "UPDATE users SET unit_capacity = ? where user_id = ?;"
  let db = new sqlite3.Database(config.connection, sqlite3.OPEN_READWRITE, (err) => {if (err) {reject(err);}});
  return new Promise(function(resolve, reject) {
    db.run(sqlquery, [unit_capacity, userId], (err) => {
      if (err) {
        reject(err);
      }else{
        resolve(true);
      }
    });
    db.close();
  });
}

module.exports = {
  insertUser : insertUser,
  modUnitCapacity: modUnitCapacity
}