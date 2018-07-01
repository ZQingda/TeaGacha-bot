const sqlite3 = require('sqlite3').verbose();
const config = require('../config.json');

function dbDeleteUnit(id) {
  var db = new sqlite3.Database(config.connection, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected for char deletion.');
  });

  let sqlquery = "DELETE FROM units WHERE unit_id = ?;"
  let promise = new Promise(function(resolve, reject) {
    db.run(sqlquery, [id], (err) => {
          if (err) {
              return console.error(err.stack);
          }
          console.log("Unit " + id + " deleted.");
      });
      db.close();
      resolve(true);
    });
    return promise;
}

module.exports = {
  dbDeleteUnit : dbDeleteUnit
}
