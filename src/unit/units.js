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
      return Promise.reject("You do not have unit at index " + unitIndex);
    } else {
      return new char(unit);
    }
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
  deleteUnit: deleteUnit
}
