var chars = require("./catalogue").characters;
var dbGetChars = require("../db/getUnits");
var dbModChars = require("../db/modUnits");
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

function adjustStats(id) {
  var promise = dbGetChars.dbGetUnitByID(id)
  .then(function (unit) {
    console.log(unit.unit_name);
    // OK GUYS I KNOW THIS IS LITERALLY CANCER BUT ILL FIX IT LATER
    var newatk = stats.getATK(unit.unit_name,stats.getLvl(unit),unit.rank,unit.specialization);
    var newdef = stats.getDEF(unit.unit_name,stats.getLvl(unit),unit.rank,unit.specialization);
    var newhp = stats.getHP(unit.unit_name,stats.getLvl(unit),unit.rank,unit.specialization);
    var newspd = stats.getSPD(unit.unit_name,stats.getLvl(unit),unit.rank,unit.specialization);
    return dbModChars.modUnitMulti(id,["atk","def","hp","spd"],[newatk,newdef,newhp,newspd]);
  });
  return promise;
}

module.exports = {
  addExp : addExp,
  adjustStats : adjustStats
}
