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
    if (success) {
      if (newlvl == 80) {
        return true;
      }
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

function feedUnit(idTarg,idSacrifice) {
  var sacName;
  var targName;
  var prevLvl;
  var promise = dbGetChars.dbGetUnitByIDMulti([idTarg,idSacrifice])
  .then(function (units) {
    var charTarg;
    var charSac;

    if (units[0].unit_id == idTarg) {
      charTarg = units[0];
      charSac = units[1];
    } else {
      charTarg = units[1];
      charSac = units[0];
    }
    sacName = charSac.unit_name;
    targName = charTarg.unit_name;
    prevLvl = stats.getLvl(charTarg.lvl);
    console.log("Targ: " + targName + " , Sac: " + sacName);
    var exp = getFeedEXPValue(charSac.lvl,charSac.rank,charTarg.armor_class,charTarg.combat_type,charSac.armor_class,charSac.combat_type);
    return addModdedEXP(idTarg,charTarg.lvl,charTarg.rank,exp);
  })
  .then(function (success) {
    if (success) {
      return dbRemoveChars.dbDeleteUnit(idSacrifice);
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


module.exports = {
  addExp : addExp,
  adjustStats : adjustStats,
  feedUnit : feedUnit
}
