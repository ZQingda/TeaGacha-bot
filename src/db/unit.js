const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

function insertUnit(unit) {
  return new Promise(function(resolve, reject) {
    let db = new sqlite3.Database(config.connection, sqlite3.OPEN_READWRITE, (err) => {if (err) {reject(err);}});
    let sqlInsertUnit = 'INSERT INTO units (unit_name, owner_id, original_owner, rank, lvl, atk, def, spd, hp, armor_class, combat_type, class, specialization, roster) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    let parms = [
      unit.unit_name,
      unit.owner_id,
      unit.original_owner,
      unit.rank,
      unit.lvl,
      unit.atk,
      unit.def,
      unit.spd,
      unit.hp,
      unit.armor_class,
      unit.combat_type,
      unit.class,
      unit.specialization,
      -1
    ];
    db.run(sqlInsertUnit, parms, (err) => {
      if (err) {reject (err);}
      resolve(unit);
    });
    db.close();
  });
}


module.exports = {
  insertUnit : insertUnit
}