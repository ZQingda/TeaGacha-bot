var chars = require("./catalogue").characters;
var dbGetChars = require("../db/getUnits");
var dbModChars = require("../db/modUnits");
var dbRemoveChars = require("../db/removeUnits");
var icons = require("../icons/unitIcons");
var stats = require("./template");
const config = require('../config.json');
const Discord = require("discord.js");

// adds EXP to a unit, capping them at 80 if it were to
// bring the unit over 80.
// returns: Promise
function addExp(id,exp) {
  var newlvl;
  var promise = dbGetChars.dbGetUnitByID(id)
  .then(function (unit) {
    newlvl = parseFloat(unit.lvl) + parseFloat(exp);
    if (newlvl >= 80) {
      newlvl = 80;
    }
    return dbModChars.modUnit(id,"lvl",newlvl);
  })
  .then(function (success) {
    if (success == true) {
      return adjustStats(id);
    } else {
      return false;
    }
  });
  return promise;
}

// fixes the stats to be what they're supposed to be
function adjustStats(id) {
  var promise = dbGetChars.dbGetUnitByID(id)
  .then(function (unit) {
    console.log(unit.unit_name);
    var newatk = stats.getATK(unit.unit_name,stats.getLvl(unit),unit.rank,unit.specialization);
    var newdef = stats.getDEF(unit.unit_name,stats.getLvl(unit),unit.rank,unit.specialization);
    var newhp = stats.getHP(unit.unit_name,stats.getLvl(unit),unit.rank,unit.specialization);
    var newspd = stats.getSPD(unit.unit_name,stats.getLvl(unit),unit.rank,unit.specialization);
    return dbModChars.modUnitMulti(id,["atk","def","hp","spd"],[newatk,newdef,newhp,newspd]);
  });
  return promise;
}

function addModdedEXP(id, level, rank, exp) {
  var moddedEXP = exp;
  var levelmod = -(((level^1.5)/(100*10)) - 1);
  var rankmod = -(((level^1.5)/(10*10)) - 1);
  moddedEXP = exp * levelmod * rankmod;
  console.log("Actual EXP gained: " + moddedEXP + ", LVLMod:" + levelmod + ", RANKMOD:" + rankmod);
  return addExp(id, moddedEXP);
}

function getFeedEXPValue(sacLevel,sacRank,targArmor,targCombat,sacArmor,sacCombat) {
  var expVal = Number(sacLevel / 20);
  const rankMultiplier = ((sacRank^2)/50);
  var armorMultiplier = 1;
  var combatMultiplier = 1;
  if (targArmor == sacArmor) {
    armorMultiplier = 1.25;
  }
  if (targCombat == sacCombat) {
    combatMultiplier = 1.25;
  }
  expVal = expVal * rankMultiplier * armorMultiplier * combatMultiplier;
  console.log("Feed EXP Value: " + expVal);
  return expVal;
}

function feedUnit(userid, indexTarg, indexSacrifice) {
  var sacName;
  var targName;
  var prevLvl;
  var sacId;

  var promise = dbGetChars.dbGetUnitByIndexMulti(userid, [indexTarg,indexSacrifice])
  .then(function (units) {
    var charTarg;
    var charSac;

    if (units[0].inv_index == indexTarg) {
      charTarg = units[0];
      charSac = units[1];
    } else {
      charTarg = units[1];
      charSac = units[0];
    }

    sacId = charSac.unit_id;
    sacName = charSac.unit_name;
    targName = charTarg.unit_name;
    prevLvl = stats.getLvl(charTarg);
    console.log("Targ: " + targName + " , Sac: " + sacName);
    var exp = getFeedEXPValue(charSac.lvl,charSac.rank,charTarg.armor_class,charTarg.combat_type,charSac.armor_class,charSac.combat_type);
    return addModdedEXP(charTarg.unit_id,charTarg.lvl,charTarg.rank,exp);
  })
  .then(function (success) {
    if (success) {
      return dbRemoveChars.dbDeleteUnit(sacId);
    } else {
      return false;
    }
  })
  .then(function (success) {
    if (success) {
      return [sacName, targName, prevLvl];
    } else {
      return false;
    }
  });
  return promise;
}

// returns: a promise returning a string
function upgradeUnit(userid, indexTarg, sac1, sac2, sac3) {
  const min_sac_level = 20;
  const num_of_sac = 3;
  var charTarg;
  var charSacs;
  var promise = dbGetChars.dbGetUnitByIndex(userid, indexTarg)
  .then(function (unit) {
    charTarg = unit;
    return charTarg;
  })
  .then(function (unit) {
    return dbGetChars.dbGetUnitByIndexMulti(userid, [sac1,sac2,sac3]);
  })
  .then(function (units) {
    charSacs = units;
    console.log("First sac: " + charSacs[0].unit_id);
    console.log("Second sac: " + charSacs[1].unit_id);
    console.log("Third sac: " + charSacs[2].unit_id);
    for (var i = 0; i < num_of_sac; i++) { // check if sacs are up to snuff
      if (stats.getLvl(charSacs[i]) < min_sac_level || charSacs[i].rank != charTarg.rank) {
        return "Sacrificial units levels too low or ranks don't match up.";
      }
    }

    if (stats.getLvl(charTarg) != 80) { // check if char is lv80
      return "Target unit is not max level.";
    }

    if (charTarg.rank == chars[charTarg.unit_name].max_rank) {
      return "Target unit cannot be upgraded any further.";
    }

    return dbRemoveChars.dbDeleteUnitMulti([charSacs[0].unit_id, charSacs[1].unit_id, charSacs[2].unit_id]);

  })
  .then(function (success) {
    if (success == true) {
      return dbModChars.modUnitMulti(charTarg.unit_id,["lvl", "rank"],[1,Number(charTarg.rank + 1)]);
    } else {
      return success;
    }
  })
  .then(function (success) {
    if (success == true) {
      return adjustStats(charTarg.unit_id);
    } else {
      return success;
    }
  });
  return promise;
}


module.exports = {
  addExp : addExp,
  adjustStats : adjustStats,
  feedUnit : feedUnit,
  upgradeUnit : upgradeUnit
}
