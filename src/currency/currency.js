var dbCurrency = require('../db/currency');
var colours = require('../config').colours;
var embeds = require('../messages/message');

module.exports.modCurrency = function (message, currency, cost) {
  var modValue = cost ? cost : parseInt(message.content.split(' ')[2]);
  console.log(modValue + ' MOD VALUE IN CURR');
  var userId = message.author.id;

  return dbCurrency.getCurrencyAsync(userId, currency)
    .then((curAmount) => {
      if ((curAmount + modValue) < 0) {
        embeds.printSingle(message, colours.error, "You don't have enough " + currency + "!");
        return Promise.reject("Not enough " + currency);
      }
      var setValue = curAmount + modValue;
      return Promise.resolve({ userId: userId, currency: currency, setValue: setValue });
    })
    .then(dbCurrency.setCurrencyAsync)
    .then((curValue) => {
      embeds.printCurrency(message, colours.normal, currency, curValue);
      return Promise.resolve({ status: "success", curValue: curValue })
    })
    .catch((err) => {
      console.error('[!] modCurrency() : ' + err);
      return Promise.reject("modCurrency errored");
    })
}

module.exports.getCurrency = function (message, currency) {
  var userId = message.author.id;
  return dbCurrency.getCurrencyAsync(userId, currency)
    .then((curValue) => {
      embeds.printCurrency(message, colours.normal, currency, curValue);
    })
    .catch((err) => {
      console.error('[!] getCurrency() : ' + err);
    })
}