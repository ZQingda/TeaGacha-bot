const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./database/gachiGacha.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the gachi database.');
});

var create = 'CREATE TABLE IF NOT EXISTS test (id INTEGER);'

var userCreate = 'CREATE TABLE IF NOT EXISTS users (';
   userCreate += 'user_id INTEGER PRIMARY KEY NOT NULL,';
   userCreate += 'flower INTEGER,';
   userCreate += 'clovers INTEGER,';
   userCreate += 'energy INTEGER';
   userCreate += ');';

var unitCreate = 'CREATE TABLE IF NOT EXISTS units (';
   unitCreate += 'unit_id INTEGER PRIMARY KEY NOT NULL,';
   unitCreate += 'owner_id INTEGER NOT NULL,';
   unitCreate += 'original_owner TEXT,';
   unitCreate += 'atk INTEGER,';
   unitCreate += 'def INTEGER,';
   unitCreate += 'spd INTEGER,';
   unitCreate += 'exp INTEGER,';
   unitCreate += 'exp_remaining INTEGER,';
   unitCreate += 'lvl INTEGER,'
   unitCreate += 'rarity INTEGER,';
   unitCreate += 'armor_class INTEGER,';
   unitCreate += 'combat_type INTEGER,';
   unitCreate += 'FOREIGN KEY (owner_id) REFERENCES users (user_id)';
   unitCreate += ');';

module.exports.initDB = function () {
  //db.run(create);
  console.log(unitCreate);
  db.run(userCreate);
  db.run(unitCreate);
  db.close();
}