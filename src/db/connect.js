const sqlite3 = require('sqlite3').verbose();

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
  unitCreate += 'lvl REAL,'
  unitCreate += 'rank INTEGER,';
  unitCreate += 'armor_class TEXT,';
  unitCreate += 'combat_type TEXT,';
  unitCreate += 'class TEXT,';
  unitCreate += 'specialization TEXT,';
  unitCreate += 'FOREIGN KEY (owner_id) REFERENCES users (user_id) on update cascade on delete cascade';
  unitCreate += ');';

  var charsCreate = 'CREATE TABLE IF NOT EXISTS characters (';
  charsCreate += 'char_id ';
  //db.run(create);
  //console.log(unitCreate);
  db.run(userCreate);
  db.run(unitCreate);
  console.log("user/units created");
}

module.exports.closeDB = function (db) {
  db.close();
  console.log('Database connection closed');
}
