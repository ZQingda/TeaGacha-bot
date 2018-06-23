const sqlite3 = require('sqlite3').verbose();

module.exports.dbGetOwnedUnits = function(connection, userid) {
  var db = new sqlite3.Database(connection, sqlite3.OPEN_READ, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected for char insertion.');
  });

  let sqlquery = "SELECT * FROM units WHERE owner_id = ?;";
  var units = [];
  let promise = new Promise(function(resolve, reject) {
    db.all(sqlquery, [userid], (err, rows) => {
      if (err) {
        console.log(err);
      }
      if (rows !== null) {
        console.log("Got " + rows.length + " units.");
        units = rows;
        resolve(rows);
      } else {
        console.log("No user found with that ID.");
      }
    });

    db.close();
  });
  return promise;
}
