const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

function setCurrencyAsync(params) {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(config.connection, (err) => { if (err) { reject(err); } });

    let sql = "UPDATE users SET "+params.currency + " = ? WHERE user_id = ?;"
    //console.log(setCur);
    db.run(sql, [params.setValue, params.userId], (err) => {
      if (err) { reject(err); }
      //console.log(params.setValue + ' Value in db func')
      resolve(params.setValue);
      return getCurrencyAsync(params.userId, params.currency);
    });
    db.close();
  });
}

function getCurrencyAsync(userId, currency) {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(config.connection, (err) => { if (err) { reject(err); } });
    
    let sql = "SELECT DISTINCT "+currency + " FROM users WHERE user_id = ?;"
    //console.log('Query : ' + sql);
    db.get(sql, [userId], (err, row) => {
      if (err) { reject(err); }
      if (row) {
        resolve(row[currency] ? row[currency] : 0);
      } else {
        reject("User doesn't exist");
      }
    });
    db.close();
  })
}

module.exports = {
  getCurrencyAsync: getCurrencyAsync,
  setCurrencyAsync: setCurrencyAsync
}