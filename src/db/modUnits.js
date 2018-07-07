const sqlite3 = require('sqlite3').verbose();
const config = require('../config.json');

function modUnit(id,field,newval) {
  var db = new sqlite3.Database(config.connection, sqlite3.OPEN_READ, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected for char modification.');
  });

  let sqlquery = "UPDATE units SET "+field+" = ? WHERE unit_id = ?;"
  let promise = new Promise(function(resolve, reject) {
    db.run(sqlquery, [newval,id], (err) => {
          if (err) {
              return console.error(err.message);
          }
          console.log("Unit " + id + " updated.");
      });
      db.close();
      resolve(true);
    });
    return promise;
}

function modUnitMulti(id,fields,newvals) {
  var db = new sqlite3.Database(config.connection, sqlite3.OPEN_READ, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected for char modification.');
  });

  let sqlquery = "UPDATE units SET ";
  for (var i = 0; i < fields.length-1; i++) {
    sqlquery += fields[i] + " = ?, ";
  }
  sqlquery += fields[fields.length-1] + " = ? ";
  sqlquery += "WHERE unit_id = ?;"
  console.log(sqlquery);
  newvals.push(id);
  let promise = new Promise(function(resolve, reject) {
    db.run(sqlquery, newvals, (err) => {
          if (err) {
              return console.error(err.message);
          }
          console.log("Unit " + id + " updated ((multi)).");
      });
      db.close();
      resolve(true);
    });
    return promise;
}

module.exports = {
  modUnit : modUnit,
  modUnitMulti : modUnitMulti
}
