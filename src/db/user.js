const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

function insertUser(user) {
  return new Promise(function(resolve, reject) {
    let db = new sqlite3.Database(config.connection, (err) => {if (err) {reject(err);}});
    let sqlInsertUser = 'INSERT INTO users (user_id, flower, clovers, energy, energy_max) VALUES( ?, ?, ?, ?, ?)';
    
    db.run(sqlInsertUser, [user.user_id, user.flower, user.clovers, user.energy, user.energy_max], (err) => {
      if (err) {reject (err);}
      resolve(user);
    });
    db.close();
  });
}

module.exports = {
  insertUser : insertUser
}