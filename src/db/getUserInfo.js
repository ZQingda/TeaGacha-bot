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
   userCreate += 'username TEXT UNIQUE,';
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

var userInsert = 'INSERT INTO users (user_id, flower, clovers, energy) VALUES (78615507703439360, 10000, 100, 100);'
var unitInsert = 'INSERT INTO units (owner_id, original_owner, atk, def, spd, exp, exp_remaining, lvl, rarity, armor_class, combat_type) VALUES (78615507703439360, "Billy", 3, 40, 6, 20, 60, 45, 4, 2, 1);'

module.exports.initDB = function () {
  //db.run(create);
  console.log(unitCreate);
  db.run(userCreate);
  db.run(unitInsert);
  db.run(unitCreate);
  db.run(userInsert);
  db.close();
}