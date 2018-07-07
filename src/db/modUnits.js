const sqlite3 = require('sqlite3').verbose();
const config = require('../config.json');

function modUnit(id,field,newval) {
  let db = new sqlite3.Database(config.connection, sqlite3.OPEN_READWRITE, (err) => {if (err) {reject(err);}});

  let sqlquery = "UPDATE units SET "+field+" = ? WHERE unit_id = ?;"
  return new Promise(function(resolve, reject) {
    db.run(sqlquery, [newval,id], (err) => {
          if (err) {
            reject(err);
          }else{
            resolve(true);
          }
          console.log("Unit " + id + " updated.");
      });
      db.close();
    });
}

function modUnitMulti(id,fields,newvals) {
  let db = new sqlite3.Database(config.connection, sqlite3.OPEN_READWRITE, (err) => {if (err) {reject(err);}});

  let sqlquery = "UPDATE units SET ";
  for (var i = 0; i < fields.length-1; i++) {
    sqlquery += fields[i] + " = ?, ";
  }
  sqlquery += fields[fields.length-1] + " = ? ";
  sqlquery += "WHERE unit_id = ?;"
  console.log(sqlquery);
  newvals.push(id);
  console.log(newvals);
  return new Promise(function(resolve, reject) {
    db.run(sqlquery, newvals, (err) => {
          if (err) {
            reject(err);
          }else{
            resolve(true);
          }
          console.log("Unit " + id + " updated ((multi)): " + sqlquery);
      });
      db.close();
    });
}

module.exports = {
  modUnit : modUnit,
  modUnitMulti : modUnitMulti
}
