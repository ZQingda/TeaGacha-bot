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
    var newatk = stats.getATK(unit.unit_name,stats.getLvl(unit),unit.rank,unit.specialization);
    var newdef = stats.getDEF(unit.unit_name,stats.getLvl(unit),unit.rank,unit.specialization);
    var newhp = stats.getHP(unit.unit_name,stats.getLvl(unit),unit.rank,unit.specialization);
    var newspd = stats.getSPD(unit.unit_name,stats.getLvl(unit),unit.rank,unit.specialization);
    return dbModChars.modUnitMulti(id,["atk","def","hp","spd"],[newatk,newdef,newhp,newspd]);
  });
  return promise;
}

function addModdedEXP(id, level, rank, exp) {
  var expToAdd = getModdedEXP(id, level, rank, exp);
  console.log("Actual EXP gained: " + expToAdd + ", Original:" + exp);
  return addExp(id, expToAdd);
}

function getModdedEXP(level, rank, exp) {
  var moddedEXP = exp;
  var effectivelvl = level;
  var levelmod = -(((level^1.5)/(100*10)) - 1);
  var rankmod = -(((rank^1.5)/(10*10)) - 1);
  moddedEXP = exp * levelmod * rankmod;
  while (moddedEXP >= 1) {
    effectivelvl += 1;
    levelmod = -(((effectivelvl^1.5)/(100*10)) - 1);
    moddedEXP = (moddedEXP - 1) * levelmod * rankmod;
    //console.log("modded exp: " + moddedEXP);
    //console.log("added lvls: " + (effectivelvl - level));
    //console.log("lvl mod: " + levelmod + " / rankmod: " + rankmod);
  }
  var expToAdd = (effectivelvl - level) + moddedEXP;
  return expToAdd;
}

function getFeedEXPValue(sacLevel,sacRank,targArmor,targCombat,sacArmor,sacCombat) {
  var expVal = Number(sacLevel / 5);
  const rankMultiplier = ((sacRank^2)/50)+1;
  var armorMultiplier = 1;
  var combatMultiplier = 1;
  if (targArmor == sacArmor) {
    armorMultiplier = 1.25;
  }
  if (targCombat == sacCombat) {
    combatMultiplier = 1.25;
  }
  //console.log("rank multiplier: " + rankMultiplier);
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

// returns: a promise returning the id of indexTarg if successfull
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
    } else if (charTarg.rank == chars[charTarg.unit_name].max_rank) {
      return "Target unit cannot be upgraded any further.";
    } else {
      return dbRemoveChars.dbDeleteUnitMulti([charSacs[0].unit_id, charSacs[1].unit_id, charSacs[2].unit_id]);
    }

  })
  .then(function (success) {
    console.log(success);
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
  })
  .then(function(success){
    if(success == true){
      return charTarg.unit_id;
    } else {
      return success;
    }
  });
  return promise;
}

function getEXPGain(userid, indexTarg, indexSac) {
  var targ;
  var sac;
  var exp;
  var promise = new Promise(function(resolve) {
    resolve(dbGetChars.dbGetUnitByIndexMulti(userid, [indexTarg, indexSac]));
  }).then(function(units) {
    console.log("units: " + units);
    if (units) {
      if (units[0].inv_index == indexTarg) {
        targ = units[0];
        sac = units[1];
      } else {
        targ = units[1];
        sac = units[0];
      }
      exp = getFeedEXPValue(sac.lvl,sac.rank,targ.armor_class,targ.combat_type,sac.armor_class,sac.combat_type);
      console.log("exp1: " + exp);
      exp = getModdedEXP(targ.lvl, targ.rank, exp);
      console.log("exp2: " + exp);
      return exp;
    } else {
      console.log("...");
      return -1;
    }
  });
  return promise;
}

module.exports = {
  addExp : addExp,
  adjustStats : adjustStats,
  feedUnit : feedUnit,
  upgradeUnit : upgradeUnit,
  getEXPGain : getEXPGain
}
