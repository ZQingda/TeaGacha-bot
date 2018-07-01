const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

function getCurQuery(userId, currency) {
  return 'SELECT DISTINCT ' + currency + ' ' + currency + ' FROM users WHERE user_id = ' + userId + ';';
}

function setCurQuery(userId, currency, amount) {
  return 'UPDATE users SET ' + currency + ' = ' + amount + ' WHERE user_id = ' + userId + ';';
}

function setCurrencyAsync(params) {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(config.connection, (err) => { if (err) { reject(err); } });
    let setCur = setCurQuery(params.userId, params.currency, params.setValue);
    //console.log(setCur);
    db.run(setCur, [], (err) => {
      if (err) { reject(err); }
      //console.log(params.setValue + ' Value in db func')
      resolve(params.setValue);
    });
    db.close();
  })
}

function getCurrencyAsync(userId, currency) {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(config.connection, (err) => { if (err) { reject(err); } });
    let getCur = getCurQuery(userId, currency);
    console.log('Query : ' + getCur);
    db.get(getCur, [], (err, row) => {
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