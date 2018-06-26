var char = require("./template").char;
var dbUnit = require("../db/unit");


function genOne(userId){
  let c = new char([], userId);
  return dbUnit.insertUnit(c);
}

module.exports = {
  genOne: genOne
}
