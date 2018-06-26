const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

function insertUser(user) {
  return new Promise(function(resolve, reject) {
    let db = new sqlite3.Database(config.connection, (err) => {if (err) {reject(err);}});
    let sqlInsertUser = 'INSERT INTO users (user_id, flower, clovers, energy) VALUES( ?, ?, ?, ?)';
    
    db.run(sqlInsertUser, [user.id, user.flowers, user.clovers, user.energy], (err) => {
      if (err) {reject (err);}
      resolve(user);
    });
    db.close();
  });
}

module.exports = {
  insertUser : insertUser
}