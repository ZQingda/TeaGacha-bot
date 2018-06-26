const Discord = require("discord.js");

var cur = require("./currency/currency");
var units = require("./unit/units");
var embeds = require("./messages/message");
var colours = require("./config").colours;
var char = require("./unit/template").char;
var inv = require("./unit/unitinventory");
var user = require("./user/user");

module.exports = function (message) {
  msg = message.content.split(' ');
  //console.log(msg);
  switch (msg[1]) {
    case "register":
      register(message);
      break;
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

function register(message){
  var msgEmbedUser;
  let u;
  user.setupUser(message.author.id)
    .then((retUser)=>{
      u = retUser;
      var unitPromises =[];
      for (var i = 0; i < 5; i++) {
        var curUnit = units[i];
        unitPromises.push(units.genOne(message.author.id));
      }
      return Promise.all(unitPromises);
    })
    .then(function(){return inv.listUnits(message.author.id,message.guild.member(message.author).displayName)})
    .then( function(msgEmbedUnits) {
      embeds.printSingle(message, 0x2eb8b8, 'You have been registered and your initial units have been setup.')
      embeds.printUser(message, u)
      message.channel.send(msgEmbedUnits);
    }).catch((err) => {
      console.error('Register error : ' + err.message);
      console.error( err.stack);
    })
}

function rollOne(message) {
  Promise
  cur.modCurrency(message, 'clovers', -1)
    .then((ret)=>{return units.genOne(message.author.id)})
    .then((u)=>{embeds.printNewUnit(message, u)})
    .catch((err) => {
      console.error('rollOne routes error : ' + err);
      console.error( err.stack);
    });
}

function getChars(message) {
  console.log("GetChars");
  inv.listUnits(message.author.id,message.guild.member(message.author).displayName)
    .then(function(msgEmbed) {
      message.channel.send(msgEmbed);
    });
}
