const Discord = require("discord.js");
var dbAddChar = require("./db/addChars").dbAddChar;
var cur = require("./currency/currency");
var units = require("./unit/units");
var embeds = require("./messages/message");
var colours = require("./config").colours;
var char = require("./unit/template").char;
var inv = require("./unit/unitinventory");

module.exports = function (message) {
  msg = message.content.split(' ');
  //console.log(msg);
  switch (msg[1]) {
    case "rollOne":
    case "ro":
      rollOne(message);
      break;
    case "listchars":
    case "lc":
      getChars(message);
      break;
    case "modclovers":
    case "mc":
      modCurrencyWrap(message, 'clovers');
      break;
    case "modflowers":
    case "mf":
      modCurrencyWrap(message, 'flower');
      break;
    case "getclovers":
    case "gc":
      cur.getCurrency(message, 'clovers');
      break;
    case "getflowers":
    case "gf":
      cur.getCurrency(message, 'flower');
      break;
    case "buyclovers":
    case "bc":
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
      console.error('routes error : ' + err);
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
  var page = message.content.split(' ')[2] ? message.content.split(' ')[2] : 1;
  console.log(page);
  if (!page || page < 1) {
    embeds.printSingle(message, colours.error, "Invalid page number!")
  };
  inv.listUnits(message, page/*message.author.id,message.guild.member(message.author).displayName*/)
    .catch((err) => {console.error(err);})
}
