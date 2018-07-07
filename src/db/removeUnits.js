const sqlite3 = require('sqlite3').verbose();
const config = require('../config.json');

function dbDeleteUnit(id) {
  let db = new sqlite3.Database(config.connection, sqlite3.OPEN_READWRITE, (err) => {if (err) {reject(err);}});

  let sqlquery = "DELETE FROM units WHERE unit_id = ?;"
  let promise = new Promise(function(resolve, reject) {
    db.run(sqlquery, [id], (err) => {
          if (err) {
            reject(err);
          }else{
            resolve(true);
            console.log("Unit " + id + " deleted.");
          }
      });
      db.close();
    });
    return promise;
}

// requires AT LEAST 2 UNITS
function dbDeleteUnitMulti(ids) {
  let db = new sqlite3.Database(config.connection, sqlite3.OPEN_READWRITE, (err) => {if (err) {reject(err);}});

  let sqlquery = "DELETE FROM units WHERE";
  for (var i = 0; i < ids.length - 1; i++) {
    sqlquery += " unit_id = ? or";
  }
  sqlquery += " unit_id = ?;";
  console.log(sqlquery);
  let promise = new Promise(function(resolve, reject) {
    db.run(sqlquery, ids, (err) => {
          if (err) {
            reject(err)
          } else{
            resolve(true);
            console.log("Units deleted.");
          }
      });
      db.close();
    });
    return promise;
}

module.exports = {
  dbDeleteUnit : dbDeleteUnit,
  dbDeleteUnitMulti : dbDeleteUnitMulti
}
