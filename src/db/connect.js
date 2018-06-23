const sqlite3 = require('sqlite3').verbose();

var userInsert = 'INSERT INTO users (user_id, flower, clovers, energy) VALUES (78615507703439360, 10000, 100, 100);'
var unitInsert = 'INSERT INTO units (owner_id, original_owner, atk, def, spd, exp, exp_remaining, lvl, rarity, armor_class, combat_type) VALUES (78615507703439360, "Billy", 3, 40, 6, 20, 60, 45, 4, 2, 1);'

module.exports.newDB = function (connection) {
  var db = new sqlite3.Database(connection, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the gachi database.');
  });
  return db;
}

module.exports.initDB = function (db) {
  var userCreate = 'CREATE TABLE IF NOT EXISTS users (';
  userCreate += 'user_id INTEGER PRIMARY KEY NOT NULL,';
  userCreate += 'username TEXT UNIQUE,';
  userCreate += 'flower INTEGER,';
  userCreate += 'clovers INTEGER,';
  userCreate += 'energy INTEGER';
  userCreate += ');';

  var unitCreate = 'CREATE TABLE IF NOT EXISTS units (';
  unitCreate += 'unit_id INTEGER PRIMARY KEY NOT NULL,';
  unitCreate += 'unit_name TEXT,';
  unitCreate += 'owner_id INTEGER NOT NULL,';
  unitCreate += 'original_owner TEXT,';
  unitCreate += 'atk INTEGER,';
  unitCreate += 'def INTEGER,';
  unitCreate += 'spd INTEGER,';
  unitCreate += 'hp INTEGER,';
  unitCreate += 'lvl INTEGER,'
  unitCreate += 'rarity INTEGER,';
  unitCreate += 'armor_class TEXT,';
  unitCreate += 'combat_type TEXT,';
  unitCreate += 'class TEXT,';
  unitCreate += 'specialization TEXT,';
  unitCreate += 'FOREIGN KEY (owner_id) REFERENCES users (user_id)';
  unitCreate += ');';

  var charsCreate = 'CREATE TABLE IF NOT EXISTS characters (';
  charsCreate += 'char_id ';
  //db.run(create);
  //console.log(unitCreate);
  db.run(userCreate);
  db.run(unitCreate);
  console.log("user/units created");
}

module.exports.insertUser = function (db) {
  var userInsert = 'INSERT OR IGNORE INTO users (user_id, flower, clovers, energy) VALUES (135473868553846784, 10000, 100, 100);'
  var unitInsert = 'INSERT OR IGNORE INTO units (unit_id, unit_name, owner_id, original_owner, atk, def, spd, lvl, rarity, armor_class, combat_type, class, specialization) VALUES (3, "Jeoff", 135473868553846784, "Johnny", 3, 40, 6, 20, 60, 45, 4, 2, 1);'
  console.log("Inserting...");
  db.run(unitInsert);
  db.run(userInsert);

}

module.exports.closeDB = function (db) {
  db.close();
  console.log('Database connection closed');
}
