const Cron = require("node-cron");
const Discord = require("discord.js");
const db = require("./db/connect")
const dbEnergy = require("./db/energy");
const dbUser = require("./db/user");

var jobEnergyReplenish;
var jobCurrencyPurchaseReplenish;
module.exports = function (message) {
  var gachaDB = db.newDB('./database/gachiGacha.db');
  db.initDB(gachaDB);
  db.closeDB(gachaDB);

  module.exports.startEnergyReplenishment(1, "*/5 * * * *"); //Every 5 Minutes
  module.exports.startCurrencyPurchaseReplenishment("0 10 * * 0"); //Every Sunday at 10:00 AM
}

/**
 * Stop the Energy Replenishment Job
 */
module.exports.stopEnergyReplenishment = function () {
  if(jobEnergyReplenish && jobEnergyReplenish.destroy){
    console.error("Removing Replenish Energy Job.");
    jobEnergyReplenish.stop();
    jobEnergyReplenish.destroy();
  }
}
/**
 * Create an interval to automatically replenish energy to all users. (Will not create multiple intervals)
 * @param {Integer} energyAmount Amount of energy to replenish each interval
 * @param {String} cronTime Cron Formated schedule string
 */
module.exports.startEnergyReplenishment = function (energyAmount, cronTime) {
  module.exports.stopEnergyReplenishment();
  jobEnergyReplenish = Cron.schedule(cronTime, function(){
    dbEnergy.updateAllUserEnergy(energyAmount)
    .catch((err) => {
      console.error("Error replenishing All User Energy:" + err.stack);
    });
  }, true );
}

/**
 * Stop the Currency Purchase Replenishment Job
 */
module.exports.stopCurrencyPurchaseReplenishment = function () {
  if(jobCurrencyPurchaseReplenish && jobCurrencyPurchaseReplenish.destroy){
    console.error("Removing Replenish Currency Purchase Job.");
    jobCurrencyPurchaseReplenish.stop();
    jobCurrencyPurchaseReplenish.destroy();
  }
}
/**
 * Create an interval to automatically reset weekly conversion on all users. (Will not create multiple intervals)
 * @param {String} cronTime Cron Formated schedule string
 */
module.exports.startCurrencyPurchaseReplenishment = function (cronTime) {
  module.exports.stopCurrencyPurchaseReplenishment();

  jobCurrencyPurchaseReplenish = Cron.schedule(cronTime, function(){
    console.log("Reseting Currency Conversions: " + new Date());
    dbUser.modAllWeeklyConversions(0)
    .catch((err) => {
      console.error("Error replenishing All User Energy:" + err.stack);
    });
  }, true );
}