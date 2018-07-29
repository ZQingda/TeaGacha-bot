const sqlite3 = require('sqlite3').verbose();
const config = require('../config.json');

// gets all owned units of a specified user
// returns: Promise (array of units)
function dbGetUserById(userid) {
  let db = new sqlite3.Database(config.connection, sqlite3.OPEN_READ, (err) => {if (err) {reject(err);}});

  let sqlquery = "SELECT users.*, count(units.unit_id) AS unit_count FROM users LEFT JOIN units ON units.owner_id=users.user_id WHERE user_id = ? GROUP BY users.user_id"
  let promise = new Promise(function(resolve, reject) {
    db.get(sqlquery, [userid], (err, row) => {
      if (err) {
        console.log(err);
      }
      if (row !== null) {
        console.log("Found user.");
        resolve(row);
      } else {
        reject("User isn't registered for Gacha!");
      }
    });
    db.close();
  });
  return promise;
}

module.exports = {
  dbGetUserById : dbGetUserById
}
