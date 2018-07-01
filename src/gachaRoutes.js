const Discord = require("discord.js");
var colours = require('./config').colours;
var cur = require("./currency/currency");
var units = require("./unit/units");
var embeds = require("./messages/message");
const config = require('./config');
var char = require("./unit/template").char;
var inv = require("./unit/unitinventory");
var user = require("./user/user");
var modU = require("./unit/unitexpupgrade");


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
    case "showunit":
    case "su":
      getUnit(message);
      break;
    case "ae":
      addXp(message);
      break;
    default:
      console.log(msg);
      embeds.printSingle(message, Number(config.colours.error), "That's not a gacha command!");
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
  user.getUser(message)
    .then(u =>{
      if(u.user_id==message.author.id){
        return embeds.printSingle(message, parseInt(colours.error), "You already have a Gacha account!");
      }
      else{
        return user.setupUser(message)
        .then(function(){return inv.listUnits(message,1)})
      }
    })
    .catch((err) => {
      console.error('Register error : ' + err.message);
      console.error( err.stack);
    });
}

function rollOne(message) {
  Promise
  cur.modCurrency(message, 'clovers', -1)
    .then((ret)=>{return units.genOne(message.author.id)})
    .then((u)=>{embeds.printNewUnit(message, parseInt(colours.normal), u)})
    .catch((err) => {
      console.error('rollOne routes error : ' + err.stack);
    })
}

function getChars(message) {
  console.log("GetChars");
  var page = message.content.split(' ')[2] ? message.content.split(' ')[2] : 1;
  console.log(page);
  if (!page || page < 1) {
    embeds.printSingle(message, parseInt(colours.error), "Invalid page number!")
  } else {
  inv.listUnits(message, page/*message.author.id,message.guild.member(message.author).displayName*/)
    .catch((err) => {console.error(err);})
  }
}

function getUnit(message) {
  console.log("getUnit");
  var unit_index = message.content.split(" ")[2];
  inv.showUnit(message.author.id, unit_index)
  .then(function(msgEmbed) {
    message.channel.send(msgEmbed);
  });
}

function addXp(message) {
  console.log("Add EXP");
  var unit_id = message.content.split(" ")[2];
  var exp = message.content.split(" ")[3];
  modU.addExp(unit_id,exp)
  .then(function(success) {
    if (success) {
      message.channel.send("EXP added");
    } else {
      message.channel.send("EXP Add Failed.");
    }
  });
}
