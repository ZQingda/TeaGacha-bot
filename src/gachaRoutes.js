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
var roster = require("./unit/unitroster");

var unitFilters = require("./filters/unitFilters");


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
    case "rollBad":
      rollOneShit(message);
      break;
    case "rollGood":
      rollOneGood(message);
      break;
    case "roll5":
      rollFive(message);
      break;
    case "listunits":
    case "lu":
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
    case "showuser":
        getUser(message);
      break;
    case "ae":
      addXp(message);
      break;
    case "feedunit":
    case "fu":
      sacUnit(message);
      break;
    case "listroster":
    case "lr":
      showRoster(message);
      break;
    case "upgradeunit":
    case "uu":
      upgrUnit(message);
      break;
    case "iconlegend":
      showRankLegend(message);
      break;
    default:
      console.log(msg);
      embeds.printSingle(message, Number(config.colours.error), "That's not a gacha command!");
  }
}

function showRoster(message) {
  roster.listRoster(message)
    .catch((err) => {
      console.log("listRoster err " + err.stack);
    })
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
  cur.modCurrency(message, 'clovers', -5)
    .then((ret)=>{return units.genOne(message.author.id)})
    .then((u)=>{embeds.printNewUnit(message, parseInt(colours.normal), u)})
    .catch((err) => {
      console.error('rollOne routes error : ' + err.stack);
    })
}

function rollOneShit(message) {
  Promise
  cur.modCurrency(message, 'clovers', -5)
    .then((ret)=>{return units.genShit(message.author.id)})
    .then((u)=>{embeds.printNewUnit(message, parseInt(colours.normal), u)})
    .catch((err) => {
      console.error('rollOne routes error : ' + err.stack);
    })
}

function rollOneGood(message) {
  Promise
  cur.modCurrency(message, 'clovers', -5)
    .then((ret)=>{return units.genGood(message.author.id)})
    .then((u)=>{embeds.printNewUnit(message, parseInt(colours.normal), u)})
    .catch((err) => {
      console.error('rollOne routes error : ' + err.stack);
    })
}

function rollFive(message) {
  Promise
  cur.modCurrency(message, 'clovers', -25)
    .then((ret)=>{return units.genGood(message.author.id)})
    .then((u)=>{embeds.printNewUnit(message, parseInt(colours.normal), u)})
    .catch((err) => {
      console.error('rollOne routes error : ' + err.stack);
    })
      .then((ret)=>{return units.genOne(message.author.id)})
      .then((u)=>{embeds.printNewUnit(message, parseInt(colours.normal), u)})
      .catch((err) => {
        console.error('rollOne routes error : ' + err.stack);
      })
        .then((ret)=>{return units.genOne(message.author.id)})
        .then((u)=>{embeds.printNewUnit(message, parseInt(colours.normal), u)})
        .catch((err) => {
          console.error('rollOne routes error : ' + err.stack);
        })
          .then((ret)=>{return units.genOne(message.author.id)})
          .then((u)=>{embeds.printNewUnit(message, parseInt(colours.normal), u)})
          .catch((err) => {
            console.error('rollOne routes error : ' + err.stack);
          })
            .then((ret)=>{return units.genOne(message.author.id)})
            .then((u)=>{embeds.printNewUnit(message, parseInt(colours.normal), u)})
            .catch((err) => {
              console.error('rollOne routes error : ' + err.stack);
            });
}

function getChars(message) {
  console.log("GetChars");
  var arguments = message.content.split(/\s+/);
  
  var arguments = arguments.slice(2);
  var page = isNaN(arguments[0]) ? 1 : arguments[0];
  var filters = unitFilters.parseIntoFilters(arguments);

  console.log(page);
  if (!page || page < 1) {
    embeds.printSingle(message, parseInt(colours.error), "Invalid page number!")
  } else {
  inv.listUnits(message, filters, page/*message.author.id,message.guild.member(message.author).displayName*/)
    .catch((err) => {console.error(err.stack);})
  }
}

function getUnit(message) {
  console.log("getUnit");
  var index = message.content.split(" ")[2];
  inv.showUnit(message, index)
  .catch((err) => {console.error(err.stack);});
}

function getUser(message){
  console.log("getUser");
  user.getUser(message)
  .then((retUser)=>embeds.printUser(message, parseInt(colours.normal), retUser))
  .catch((err) => {console.error(err.stack);});
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


function sacUnit(message) {
  var indexTarg = message.content.split(" ")[2];
  var indexSac = message.content.split(" ")[3];
  console.log("Feeding unit " + indexSac + " to " + indexTarg);
  modU.feedUnit(message.author.id, indexTarg, indexSac)
  .then(function(names) {
    if (names != false) {
      message.channel.send(names[0] + " was used to strengthen the level " + names[2] + " " + names[1]);
      inv.showUnit(message, indexTarg);
    }
  })
  .catch((err) => {
    embeds.printSingle(message, parseInt(colours.error), err)
    console.error(err.stack);}
  );
}

function upgrUnit(message) {
  var indexTarg = message.content.split(" ")[2];
  var indexSac = [0,0,0];
  indexSac[0] = message.content.split(" ")[3];
  indexSac[1] = message.content.split(" ")[4];
  indexSac[2] = message.content.split(" ")[5];
  console.log("Upgrading unit " + indexTarg + " with units " + indexSac[0] + ", " + indexSac[1] + ", " + indexSac[2]);
  modU.upgradeUnit(message.author.id, indexTarg, indexSac[0], indexSac[1], indexSac[2])
  .then(function(target_id) {
    if (target_id) {
      embeds.printSingle(message, parseInt(colours.normal), "Character was upgraded!");

      return inv.showUnitById(message, target_id);
    } else {
      embeds.printSingleError(message, "Target Id not Returned after Upgrade Unit");
      return false;
    }
  })
  .then(function(success) {
    if (success) {
      console.log("successful sacrifice");
    } else {
      console.log("failed sacrifice");
    }
  })
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.error(err.stack);}
  );
}

function showRankLegend(message) {
  embeds.printUnitRanks(message);
}
