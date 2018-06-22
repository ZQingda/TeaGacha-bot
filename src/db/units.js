const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

module.exports.dbAddChar = function (params) {
  return new Promise((resolve, reject) => {
    var db = new sqlite3.Database(config.connection, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected for char insertion.');
    });

    var c = params.char;

    var charInsert = 'INSERT INTO units (unit_name, owner_id, original_owner, atk, def, spd, hp, exp, exp_remaining, lvl, rarity, armor_class, combat_type) VALUES('
    charInsert += '"' + c.unit_name + '", ';
    charInsert += c.owner_id + ', ';
    charInsert += '"' + c.original_owner + '", ';
    charInsert += c.atk + ', ';
    charInsert += c.def + ', ';
    charInsert += c.spd + ', ';
    charInsert += c.hp + ', ';
    charInsert += c.exp + ', ';
    charInsert += c.exp_remaining + ', ';
    charInsert += c.lvl + ', ';
    charInsert += c.rarity + ', ';
    charInsert += '"' + c.armor_class + '", ';
    charInsert += '"' + c.combat_type + '")';
    console.log(charInsert);
    db.run(charInsert, [], (err) => {
      if (err) { reject(err); }
      resolve();
    });

    db.close();
  });
}




