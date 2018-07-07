const Discord = require("discord.js");
const db = require("./db/connect")
const dbEnergy = require("./db/energy");

var replenishInterval;
module.exports = function (message) {
  var gachaDB = db.newDB('./database/gachiGacha.db');
  db.initDB(gachaDB);
  db.closeDB(gachaDB);

  module.exports.startEnergyReplenishment(1);
}


module.exports.stopEnergyReplenishment = function () {
  clearInterval(replenishInterval);
}
/**
 * Create an interval to automatically replenish energy to all users. (Will not create multiple intervals)
 * @param {Integer} energyAmount Amount of energy to replenish each interval
 * @param {Integer} intervalTimeMS Time in MS between each energy replenishment (default 5 minutes)
 */
module.exports.startEnergyReplenishment = function (energyAmount, intervalTimeMS=5*60*1000) {
  if(replenishInterval){
    console.error("Energy Replenishment Interval is already running. It must be stopped first.");
  }else{
    replenishInterval = setInterval(function(){
      dbEnergy.updateAllUserEnergy(energyAmount)
      .catch((err) => {
        console.error("Error replenishing All User Energy:" + err.stack);
      });
    }, intervalTimeMS);
  }
}