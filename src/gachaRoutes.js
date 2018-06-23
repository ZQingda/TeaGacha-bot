var dbAddChar = require("./db/units").dbAddChar;
var cur = require("./currency/currency");
var units = require("./unit/units");
var embeds = require("./messages/message");
var colours = require("./config").colours;

module.exports = function (message) {
  msg = message.content.split(' ');
  //console.log(msg);
  switch (msg[1]) {
    case "rollOne":
      rollOne(message);
      break;
    case "getChars":
      getChars(message);
      break;
    case "modClovers":
      modCurrencyWrap(message, 'clovers');
      break;
    case "modFlowers":
      modCurrencyWrap(message, 'flower');
      break;
    case "getClovers":
      cur.getCurrency(message, 'clovers');
      break;
    case "getFlowers":
      cur.getCurrency(message, 'flower');
      break;
    case "buyClovers":
      buyCurrency(message, 'flower', 'clovers', 100);
      break;
    default:
      console.log(msg);
      embeds.printSingle(message, colours.error, "That's not a gacha command!");
  }
}

function modCurrencyWrap(message, currency) {
  cur.modCurrency(message, currency)
    .catch((err) => {
      console.error('routes error : ' + err.msg);
    });
}

function buyCurrency(message, from, to, rate) {
  var amountTo = parseInt(message.content.split(' ')[2]);
  var amountFrom = amountTo * rate;
  cur.modCurrency(message, from, (amountFrom * -1))
    .then((params) => {
      cur.modCurrency(message, to, amountTo)
        .catch((err) => {
          console.error('To conversion error : ' + err);
        })
    })
    .catch((err) => {
      console.error('From conversion error : ' + err);
    })
}

function rollOne(message) {
  cur.modCurrency(message, 'clovers', -10)
    .then((params) => {
      return new Promise((resolve) => {
        var char = units.genOne(message);
        resolve({char : char});
      })
    })
    .then(dbAddChar)
    .catch((err) => {
      console.error('rollOne routes error : ' + err);
    })
}

function getChars(message) {
  console.log("GetChars");
}
