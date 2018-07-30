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
        reject("User isn't registered for Gacha!");
      }
    });
    db.close();
  })
}

function getFlowers (dUser) {
  const sqlite3 = require('sqlite3');
  let userFlowers = 0;
  let db = new sqlite3.Database('C:/Program Files/NadekoBot/system/data/NadekoBot.db'); // dis mine
  let sqlquery = "SELECT CurrencyAmount FROM DiscordUser WHERE UserID = ?;";
  let promise = new Promise(function(resolve, reject) {
      db.get(sqlquery, [dUser], (err, row) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          if (row.CurrencyAmount !== null) {
              console.log("Amount: " + row.CurrencyAmount);
              userFlowers = parseInt(row.CurrencyAmount);
              resolve(row.CurrencyAmount);
          } else {
              console.log("No user found with that ID.");
          }
      })
      db.close();
  });

  return promise;
}

function modifyFlowers(dUser, dCurFlowers, dChange) {
  let promise = new Promise(function(resolve, reject) {
      let flowerMod = 0;

      if (dCurFlowers + dChange < 0) {
        return 0;
      }
      else {
        flowerMod = dChange;
      }

      let db = new sqlite3.Database('C:/Program Files/NadekoBot/system/data/NadekoBot.db');
      let sqlquery = "UPDATE DiscordUser SET CurrencyAmount = ? WHERE UserId = ?;";
      let updateData = [dCurFlowers + flowerMod, dUser];

      db.run(sqlquery, updateData, (err) => {
          if (err) {
              return console.error(err.message);
          }
          console.log("Row updated.");
          resolve(true);
      });
      db.close();
  },
  function(err) {
      console.log(err);
      reject(err);
  });
  return promise;
}

module.exports = {
  getCurrencyAsync: getCurrencyAsync,
  setCurrencyAsync: setCurrencyAsync,
  getFlowers: getFlowers,
  modifyFlowers: modifyFlowers
}
