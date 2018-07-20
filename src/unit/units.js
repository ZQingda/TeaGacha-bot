var char = require("./template").char;
var dbUnit = require("../db/unit");


function genOne(userId){
  let c = new char(3, 7, userId);
  return dbUnit.insertUnit(c);
}

function genShit(userId){
  let c = new char(5, 7, userId);
  return dbUnit.insertUnit(c);
}

function genGood(userId){
  let c = new char(1, 3, userId);
  return dbUnit.insertUnit(c);
}

module.exports = {
  genOne: genOne,
  genShit: genShit,
  genGood: genGood
}
