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
  userCreate += 'user_id TEXT PRIMARY KEY NOT NULL,';
  userCreate += 'username TEXT UNIQUE,';
  userCreate += 'gems  INTEGER NOT NULL DEFAULT 0,';
  userCreate += 'clovers INTEGER NOT NULL DEFAULT 0,';
  userCreate += 'energy	INTEGER NOT NULL DEFAULT 0,';
  userCreate += 'energy_max	INTEGER NOT NULL DEFAULT 0,';
  userCreate += 'unit_capacity	INTEGER NOT NULL DEFAULT 0,';
  userCreate += 'roster_point_capacity	INTEGER NOT NULL DEFAULT 0,';
  userCreate += 'weeklyconversions INTEGER';
  userCreate += ');';

  var unitCreate = 'CREATE TABLE IF NOT EXISTS units (';
  unitCreate += 'unit_id INTEGER PRIMARY KEY NOT NULL,';
  unitCreate += 'unit_name TEXT,';
  unitCreate += 'owner_id TEXT NOT NULL,';
  unitCreate += 'original_owner TEXT,';
  unitCreate += 'inv_index INTEGER,';
  unitCreate += 'rank INTEGER NOT NULL DEFAULT 1,';
  unitCreate += 'lvl REAL NOT NULL DEFAULT 0,';
  unitCreate += 'atk INTEGER,';
  unitCreate += 'def INTEGER,';
  unitCreate += 'spd INTEGER,';
  unitCreate += 'hp INTEGER,';
  unitCreate += 'armor_class TEXT,';
  unitCreate += 'combat_type TEXT,';
  unitCreate += 'class TEXT,';
  unitCreate += 'specialization TEXT,';
  unitCreate += 'roster INTEGER,';
  unitCreate += 'FOREIGN KEY (owner_id) REFERENCES users (user_id) on update cascade on delete cascade';
  unitCreate += ');';

//DROP TRIGGER IF EXISTS unit_SetIndexOnInsert;
  var triggercreate_unitInsert = '';
  triggercreate_unitInsert += 'CREATE TRIGGER IF NOT EXISTS unit_SetIndexOnInsert';
  triggercreate_unitInsert += ' AFTER INSERT ON units FOR EACH ROW';
  triggercreate_unitInsert += ' BEGIN ';
  triggercreate_unitInsert += '  UPDATE units set inv_index= (select count(*)';
  triggercreate_unitInsert += '    from units';
  triggercreate_unitInsert += '    where owner_id=New.owner_id';
  triggercreate_unitInsert += '      AND ( rank>NEW.rank';
	triggercreate_unitInsert += '	       OR (rank=NEW.rank AND lvl>NEW.lvl)';
	triggercreate_unitInsert += '	       OR (rank=NEW.rank AND lvl=NEW.lvl AND unit_id<=NEW.unit_id)';
	triggercreate_unitInsert += '	     )';
  triggercreate_unitInsert += '  )';
  triggercreate_unitInsert += '  WHERE unit_id=NEW.unit_id;';
  triggercreate_unitInsert += '  ';
  triggercreate_unitInsert += '  UPDATE units set inv_index = inv_index+1';
  triggercreate_unitInsert += '  WHERE owner_id=New.owner_id';
  triggercreate_unitInsert += '    AND unit_id<>NEW.unit_id';
  triggercreate_unitInsert += '    AND inv_index>=(Select inv_index from units where unit_id=NEW.unit_id);';
  triggercreate_unitInsert += ' END;';

//DROP TRIGGER IF EXISTS unit_SetIndexOnUpdate;
  var triggercreate_unitUpdate = '';
  triggercreate_unitUpdate += 'CREATE TRIGGER IF NOT EXISTS unit_SetIndexOnUpdate';
  triggercreate_unitUpdate += ' BEFORE UPDATE OF lvl,rank ON units FOR EACH ROW';
  triggercreate_unitUpdate += ' BEGIN ';
  triggercreate_unitUpdate += '  /*Update This Units index (this and the follow up queyr only work if rank and lvl are increasing only)*/';
  triggercreate_unitUpdate += '  UPDATE units set inv_index= (select count(*)+1';
  triggercreate_unitUpdate += '    from units';
  triggercreate_unitUpdate += '    where owner_id=New.owner_id';
  triggercreate_unitUpdate += '      AND ( rank>NEW.rank';
	triggercreate_unitUpdate += '	       OR (rank=NEW.rank AND lvl>NEW.lvl)';
	triggercreate_unitUpdate += '	       OR (rank=NEW.rank AND lvl=NEW.lvl AND unit_id<=NEW.unit_id)';
	triggercreate_unitUpdate += '	     )';
  triggercreate_unitUpdate += '  )';
	triggercreate_unitUpdate += ' WHERE unit_id=NEW.unit_id;';
	triggercreate_unitUpdate += '';
	triggercreate_unitUpdate += ' /*Update all other unit Indexes >= this units new index (shifting them up 1)*/';
  triggercreate_unitUpdate += '  UPDATE units set inv_index = inv_index+1';
  triggercreate_unitUpdate += '  WHERE owner_id=New.owner_id';
  triggercreate_unitUpdate += '      AND unit_id<>NEW.unit_id';
  triggercreate_unitUpdate += '      AND inv_index>=(Select inv_index from units where unit_id=NEW.unit_id)';
	triggercreate_unitUpdate += '	AND inv_index<OLD.inv_index;';
  triggercreate_unitUpdate += ' END;';

  //DROP TRIGGER IF EXISTS unit_SetIndexOnDelete;
  var triggercreate_unitDelete = '';
  triggercreate_unitDelete += 'CREATE TRIGGER IF NOT EXISTS unit_SetIndexOnDelete';
  triggercreate_unitDelete += ' BEFORE DELETE ON units FOR EACH ROW';
  triggercreate_unitDelete += ' BEGIN ';
	triggercreate_unitDelete += '  /*Update all other unit Indexes >= this units index (shifting them down 1)*/';
  triggercreate_unitDelete += '  UPDATE units set inv_index = inv_index-1';
  triggercreate_unitDelete += '    WHERE owner_id=OLD.owner_id';
  triggercreate_unitDelete += '      AND unit_id<>OLD.unit_id';
  triggercreate_unitDelete += '      AND inv_index>=OLD.inv_index;';
  triggercreate_unitDelete += ' END;';




  var charsCreate = 'CREATE TABLE IF NOT EXISTS characters (';
  charsCreate += 'char_id ';
  //db.run(create);
  //console.log(unitCreate);
  db.run(userCreate);
  db.run(unitCreate, [], function(err){
    db.run(triggercreate_unitInsert);
    db.run(triggercreate_unitUpdate);
    db.run(triggercreate_unitDelete);
  });



  console.log("user/units created");
}

module.exports.closeDB = function (db) {
  db.close();
  console.log('Database connection closed');
}
