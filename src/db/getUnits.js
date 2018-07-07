const sqlite3 = require('sqlite3').verbose();
const config = require('../config.json');


function dbGetRoster(userid) {
  var db = new sqlite3.Database(config.connection, sqlite3.OPEN_READ, (err) => {
    if (err) {
      console.error(err.message);
      console.log("dbGetUnitRoster BEEP BOOP OH NO");
    }
    console.log('Connected for roster retrieval.');
  });

  let sqlquery = "SELECT * FROM units WHERE owner_id = ? AND roster != -1;"
  let promise = new Promise(function(resolve, reject) {
    db.all(sqlquery, [userid], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      console.log(rows);
      resolve(rows);
    });
    db.close();
  });
  return promise;
}

function dbSetUnitRoster(userid, roster, unitIndex, rosterPos) {

  let promise = new Promise(function(resolve, reject) {

  });
}

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

  let sqlquery ="SELECT * FROM units WHERE owner_id = ? ORDER BY inv_index ASC;";
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

// gets at least 2 units from the DB. AT LEAST 2.
// returns: promise
function dbGetUnitByIDMulti(ids) {
  var db = new sqlite3.Database(config.connection, sqlite3.OPEN_READ, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected for char retrieval.');
  });

  let sqlquery = "SELECT * FROM units WHERE ";
  for (var i = 0; i < ids.length-1; i++) {
    sqlquery += "unit_id = ? or ";
  }
  sqlquery += "unit_id = ?;";
  let promise = new Promise(function(resolve, reject) {
    db.all(sqlquery, ids, (err, rows) => {
      if (err) {
        console.log(err);
      }
      if (rows !== null) {
        console.log("Got " + rows.length + " units.");
        resolve(rows);
      } else {
        console.log("No user found with that ID.");
        resolve(rows);
      }
    });

    db.close();
  });
  return promise;
}

/**
 * Get a single units by its userId & Inventory Index.
 * @param {Number} userid
 * @param {Number} index
 * @returns Promise ({Object} unit) unit will be null if it doesn't exist.
 */
function dbGetUnitByIndex(userid, index) {
  var db = new sqlite3.Database(config.connection, sqlite3.OPEN_READ, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected for char retrieval.');
  });
  let sqlquery = "SELECT * FROM units WHERE owner_id = ? AND inv_index = ?;";
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


/**
 * gets at least 2 units from the DB. AT LEAST 2.
 * @param {Number} userid
 * @param {Array} indexes
 * @returns promise DB Rows
 */
function dbGetUnitByIndexMulti(userid, indexes) {
  var db = new sqlite3.Database(config.connection, sqlite3.OPEN_READ, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected for char retrieval.');
  });
  let sqlquery = "SELECT * FROM units WHERE owner_id = ? AND (";
  for (var i = 0; i < indexes.length-1; i++) {
    sqlquery += "inv_index = ? or ";
  }
  sqlquery += "inv_index = ?);";

  var parms = [userid]
  parms = parms.concat(indexes);

  let promise = new Promise(function(resolve, reject) {
    db.all(sqlquery, parms, (err, rows) => {
      if (err) {
        console.log(err);
      }

      if(indexes.length==rows.length){
        console.log("Got all " + rows.length + " requested units.");
        resolve(rows);
      }else{
        var invalidIndexes = indexes.filter(findIndex => {
          let filter = rows.filter(unit => {
            return unit.inv_index==findIndex;
          });
          return filter.length==0;
        });
        console.log("Query for indexes "+ indexes + " unable to find indexes" + invalidIndexes);
        reject("No units found for user at the following locations: " + invalidIndexes.join(", "));
      }
    });
    db.close();
  });
  return promise;
}

/**
 * Get a single units DB Id by its userId & Inventory Index.
 * @param {Number} userid
 * @param {Number} index
 * @returns Promise ({Number} unit_id)
 */
function dbGetUnitIdByIndex(userid, index) {
  return dbGetUnitByIndex(userid, index)
  .then(unit =>{
    if(!unit.unit_id){
      return Promise.reject("User does not have unit "+ index);
    }else{
      return unit.unit_id;
    }
  });
}
/**
 * Get a single units DB Id by its userId & Inventory Index.
 * @param {Number} userid
 * @param {Number} index
 * @returns Promise ({Number} unit_id)
 */
function dbGetUnitIdByIndexMulti(userid, index) {
  return dbGetUnitByIndexMulti(userid, index)
  .then(units =>{
      return units.map(unit => unit.unit_id);
  });
}

module.exports = {
  dbGetOwnedUnits : dbGetOwnedUnits,
  dbGetUnitByID : dbGetUnitByID,
  dbGetUnitByIDMulti : dbGetUnitByIDMulti,

  dbGetUnitByIndex : dbGetUnitByIndex,
  dbGetUnitByIndexMulti: dbGetUnitByIndexMulti,

  dbGetUnitIdByIndex : dbGetUnitIdByIndex,
  dbGetUnitIdByIndexMulti : dbGetUnitIdByIndexMulti,

  dbGetRoster : dbGetRoster
}
