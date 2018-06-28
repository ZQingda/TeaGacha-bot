const sqlite3 = require('sqlite3').verbose();
const config = require('../config.json');

// gets all owned units of a specified user
// returns: Promise (array of units)
function dbGetUserById(userid) {
  let db = new sqlite3.Database(config.connection, sqlite3.OPEN_READ, (err) => {if (err) {reject(err);}});

  let sqlquery = "SELECT * FROM users WHERE user_id = ?";
  let promise = new Promise(function(resolve, reject) {
    db.get(sqlquery, [userid], (err, row) => {
      if (err) {
        console.log(err);
      }
      if (row !== null) {
        console.log("Found user.");
        resolve(row);
      } else {
        console.log("User doesn't exist with that Id.");
        resolve(null);
      }
    });
    db.close();
  });
  return promise;
}

module.exports = {
  dbGetUserById : dbGetUserById
}
