const sqlite3 = require('sqlite3').verbose();

module.exports.dbAddChar = function(connection, c) {
  var db = new sqlite3.Database(connection, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected for char insertion.');
  });

  var charInsert = 'INSERT INTO units (unit_name, owner_id, original_owner, atk, def, spd, hp, lvl, rarity, armor_class, combat_type, class, specialization) VALUES('
  charInsert += '"' + c.unit_name + '", ';
  charInsert += c.owner_id + ', ';
  charInsert += '"' + c.original_owner + '", ';
  charInsert += c.atk + ', ';
  charInsert += c.def + ', ';
  charInsert += c.spd + ', ';
  charInsert += c.hp + ', ';
  charInsert += c.lvl + ', ';
  charInsert += c.rarity + ', ';
  charInsert += '"' + c.armor_class + '", ';
  charInsert += '"' + c.combat_type + '", ';
  charInsert += '"' + c.class + '", ';
  charInsert += '"' + c.specialization + '")';
  console.log(charInsert);
  db.run(charInsert);

  db.close();
}
