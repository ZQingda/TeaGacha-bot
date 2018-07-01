const sqlite3 = require('sqlite3').verbose();
const config = require('../config.json');


// gets all owned units of a specified user
// returns: Promise (array of units)
function dbGetOwnedUnits(userid) {
  var db = new sqlite3.Database(config.connection, sqlite3.OPEN_READ, (err) => {
    if (err) {
      console.error(err.message);
      console.log("BEEP BOOP OH NO");
    }
    console.log('Connected for char retrieval.');
  });

  let sqlquery ="SELECT * FROM units WHERE owner_id = ? ORDER BY unit_index ASC;";
  let promise = new Promise(function(resolve, reject) {
    db.all(sqlquery, [userid], (err, rows) => {
      if (err) {
        console.log(err);
      }
      if (rows != null) {
        console.log("UserID:" + userid);
        console.log("Got " + rows.length + " units.");
        resolve(rows);
      } else {
        console.log("No user found with that ID.");
      }
    });

    db.close();
  });
  return promise;
}

// gets a single unit by its unit id
// returns: Promise (unit)
function dbGetUnitByID(id) {
  var db = new sqlite3.Database(config.connection, sqlite3.OPEN_READ, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected for char retrieval.');
  });

  let sqlquery = "SELECT * FROM units WHERE unit_id = ?;";
  let promise = new Promise(function(resolve, reject) {
    db.get(sqlquery, [id], (err, row) => {
      if (err) {
        console.log(err);
      }
      if (row !== null) {
        console.log("Got a unit.");
        resolve(row);
      } else {
        console.log("No user found with that ID.");
        resolve(row);
      }
    });

    db.close();
  });
  return promise;
}

// gets a single unit by its userId and unit index
// returns: Promise (unit)
function dbGetUnitByUserIndex(userid, index) {
  var db = new sqlite3.Database(config.connection, sqlite3.OPEN_READ, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected for char retrieval.');
  });

  let sqlquery = "SELECT * FROM units WHERE owner_id = ? AND unit_index= ?;";
  let promise = new Promise(function(resolve, reject) {
    db.get(sqlquery, [userid, index], (err, row) => {
      if (err) {
        console.log(err);
      }
      if (row !== null) {
        console.log("Got a unit.");
        resolve(row);
      } else {
        console.log("No user found with that ID.");
        resolve(row);
      }
    });

    db.close();
  });
  return promise;
}

module.exports = {
  dbGetOwnedUnits : dbGetOwnedUnits,
  dbGetUnitByID : dbGetUnitByID,
  dbGetUnitByUserIndex : dbGetUnitByUserIndex
}
