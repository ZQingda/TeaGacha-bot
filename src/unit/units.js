var char = require("./template").char;
var dbUnit = require("../db/unit");
var dbGetUnit = require("../db/getUnits");
var dbRemoveChars = require("../db/removeUnits");

function genOne(userId){
  let c = char.generate(3, 7, userId);
  return dbUnit.insertUnit(c);
}

function genShit(userId){
  let c = char.generate(5, 7, userId);
  return dbUnit.insertUnit(c);
}

function genGood(userId){
  let c = char.generate(3, 4, userId);
  return dbUnit.insertUnit(c);
}

function getUnit(userId, unitIndex){
  return dbGetUnit.dbGetUnitByIndex(userId, unitIndex)
  .then(function (unit) {
    if (unit == null) {
      return Promise.reject("You do not have unit at position " + unitIndex);
    } else {
      return new char(unit);
    }
  });
}
function getUnits(userId, unitIndexes){
  return dbGetUnit.dbGetUnitByIndexMulti(userId, unitIndexes)
  .then(function (units) {
    if (units == null) {
      return Promise.reject("You do not have unit at all of the given positions: " + unitIndex);
    } else {
      let returnUnits = [];
      units.forEach(unit => 
        returnUnits.push( new char(unit))
      );
      return returnUnits;
    }
  });
}

function getUnits(userId, unitIndexes){
  return dbGetUnit.dbGetUnitByIndexMulti(userId, unitIndexes)
  .then(function (units) {
    if (units == null) {
      return Promise.reject("You do not have unit at all of the given roster slots : " + unitIndexes);
    } else {
      let returnUnits = [];
      units.forEach(unit => 
        returnUnits.push( new char(unit))
      );
      return returnUnits;
    }
  });
}

function getRosterUnit(userId, rosterSlot){
  return dbGetUnit.dbGetUnitByRoster(userId, rosterSlot)
  .then(function (unit) {
    if (unit == null) {
      return Promise.reject("You do not have unit at roster slot " + rosterSlot);
    } else {
      return new char(unit);
    }
  });
}
function getRosterUnits(userId, rosterSlot){
  return dbGetUnit.dbGetUnitByRosterMulti(userId, rosterSlot)
  .then(function (units) {
    if (units == null) {
      return Promise.reject("You do not have units at all of the given roster slots: " + rosterSlot);
    } else {
      let returnUnits = [];
      units.forEach(unit => 
        returnUnits.push( new char(unit))
      );
      return returnUnits;
    }
  });
}


function getRoster(userId){
  return dbGetUnit.dbGetRoster(userId)
  .then(function (results) {
    let units = [];
    if(results!=null){
      results.forEach(unit => 
        units.push(new char(unit))
      );
    }
    return units;
  });
}

function deleteUnit(unit){
  if(!unit.unit_id || unit.unit_id==null){
    return Promise.reject("Not valid unit to delete.");
  }else{
    return dbRemoveChars.dbDeleteUnit(unit.unit_id);
  }
}

module.exports = {
  genOne: genOne,
  genShit: genShit,
  genGood: genGood,
  getUnit: getUnit,
  getUnits: getUnits,
  getRosterUnit: getRosterUnit,
  getRosterUnits: getRosterUnits,
  getRoster: getRoster,
  deleteUnit: deleteUnit
}
