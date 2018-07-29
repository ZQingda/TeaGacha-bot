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
    case "modgems":
    case "mg":
      modCurrencyWrap(message, 'gems');
      break;
    case "getclovers":
    case "gc":
      cur.getCurrency(message, 'clovers');
      break;
    case "getgems":
    case "gg":
      cur.getCurrency(message, 'gems');
      break;
    case "buyclovers":
    case "bc":
      buyCurrency(message, 'gems', 'clovers', 100);
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

/**
 * Promise rejection if the user is over their unit capacity or if the user doesn't exist.
 * @param {*} message 
 */
function routeCheckOverUnitCapacity(message){
  return user.getRemainingUnitCapacity(message.author.id)
    .then(remainingCap =>{
      if(remainingCap<0){
        return Promise.reject("You are currently " + Math.abs(remainingCap) + " units over your capacity!  You need to reduce your unit count before using this comand.");
      }else{
        return Promise.resolve(remainingCap);
      }
    });
}
/**
 * Promise rejection if the user doesn't exist.
 * @param {*} message 
 */
function  routeCheckExists(message){
  return user.exists(message.author.id)
    .then(exists =>{
      if(exists){
        return Promise.resolve(true);
      }else{
        return Promise.reject("You are not registered for Gacha!");
      }
    });
}


function register(message){
  user.exists(message.author.id)
  .then(exists =>{
    if(exists){
      return embeds.printSingle(message, parseInt(colours.error), "You already have a Gacha account!");
    }else{
      return user.setupUser(message)
        .then(function(){return inv.listUnits(message,1)})
    }
  })
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.error( err.stack);
  });
}

function showRoster(message) {
  routeCheckExists(message)
  .then(function(){return roster.listRoster(message)})
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.log("listRoster err " + err.stack);
  });
}

function modCurrencyWrap(message, currency) {
  routeCheckExists(message)
  .then(function(){return cur.modCurrency(message, currency)})
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.error('routes error : ' + err);
  });
}

function buyCurrency(message, from, to, rate) {
  var amountTo = parseInt(message.content.split(' ')[2]);
  var amountFrom = amountTo * rate;

  if(isNaN(amountTo) || amountTo<=0){
    embeds.printSingleError(message, "Please provide a positive amount of " + to + " you want.");
  }else{
    routeCheckExists(message)
    .then(function(){
      return cur.modCurrency(message, from, (amountFrom * -1))
      .catch((err) => {
        console.error('From conversion error : ' + err);
        throw err;
      })
    })
    .then(function(){
      return cur.modCurrency(message, to, amountTo)
      .catch((err) => {
        console.error('To conversion error : ' + err);
        throw err;
      })
    })
    .catch((err) => {
      embeds.printSingleError(message, err);
      console.error('Buy currency error : ' + err + " - " + err.stack);
    });
  }
}

function rollOne(message) {
  routeCheckOverUnitCapacity(message)
  .then(function(){return cur.modCurrency(message, 'clovers', -5)})
  .then(function(){return units.genOne(message.author.id)})
  .then((u)=>{embeds.printNewUnit(message, parseInt(colours.normal), u)})
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.error('rollOne routes error : ' + err + " - " + err.stack);
  });
}

function rollOneShit(message) {
  routeCheckOverUnitCapacity(message)
  .then(function(){return cur.modCurrency(message, 'clovers', -5)})
  .then(function(){return units.genShit(message.author.id)})
  .then((u)=>{embeds.printNewUnit(message, parseInt(colours.normal), u)})
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.error('rollOneShit routes error : ' + err.stack);
  });
}

function rollOneGood(message) {
  routeCheckOverUnitCapacity(message)
  .then(function(){return cur.modCurrency(message, 'clovers', -5)})
  .then(function(){return units.genGood(message.author.id)})
  .then((u)=>{embeds.printNewUnit(message, parseInt(colours.normal), u)})
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.error('rollOneGood routes error : ' + err.stack);
  });
}

function rollFive(message) {
  routeCheckOverUnitCapacity(message)
  .then(function(){return cur.modCurrency(message, 'clovers', -25);})
  .then(function(){
    var unitPromises =[];
    //Generate 4 Random Units
    for (var i = 0; i < 4; i++) {
      unitPromises.push( units.genOne(message.author.id) );
    }
    //.then((u)=>{embeds.printNewUnit(message, parseInt(colours.normal), u)})
    //Generate 1 Good Unit
    unitPromises.push( units.genGood(message.author.id) );

    return Promise.all(unitPromises);
  })
  //.then(function(){return inv.listUnits(message,1)})
  .then((units)=>{
    embeds.printUnitPage(message, parseInt(colours.normal), units, 1, 1);
    //for(var i=0; i<units.length; i++){
    //  embeds.printNewUnit(message, parseInt(colours.normal), units[i]);
    //}
  })
  .catch((err)=>{
    embeds.printSingleError(message, err);
    console.error('rollFive routes error : ' + err.stack);
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
    routeCheckExists(message)
    .then(function(){return inv.listUnits(message, page, filters);})
    .catch((err) => {
      embeds.printSingleError(message, err);
      console.error('getChars routes error : ' + err.stack);
    });
  }
}

function getUnit(message) {
  console.log("getUnit");
  var index = message.content.split(" ")[2];
  
  routeCheckExists(message)
  .then(function(){return inv.showUnit(message, index);})
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.error('getUnit routes error : ' + err.stack);
  });
}

function getUser(message){
  console.log("getUser");

  routeCheckExists(message)
  .then(function(){return user.getUser(message.author.id);})
  .then((user)=>{embeds.printUser(message, parseInt(colours.normal), user);})
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.error('getUser routes error : ' + err.stack);
  });
}


function addXp(message) {
  console.log("Add EXP");
  var unit_id = message.content.split(" ")[2];
  var exp = message.content.split(" ")[3];

  routeCheckExists(message)
  .then(function(){return modU.addExp(unit_id,exp);})
  .then((success)=>{
    if (success) {
      message.channel.send("EXP added");
    } else {
      message.channel.send("EXP Add Failed.");
    }
  })
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.error('addXp routes error : ' + err.stack);
  });
}


function sacUnit(message) {
  var indexTarg = message.content.split(" ")[2];
  var indexSac = message.content.split(" ")[3];
  console.log("Feeding unit " + indexSac + " to " + indexTarg);

  routeCheckExists(message)
  .then(function(){return modU.feedUnit(message.author.id, indexTarg, indexSac);})
  .then((names) => {
    if (names != false) {
      message.channel.send(names[0] + " was used to strengthen the level " + names[2] + " " + names[1]);
      inv.showUnit(message, indexTarg);
    }
  })
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.error('sacUnit routes error : ' + err.stack);
  });
}

function upgrUnit(message) {
  var indexTarg = message.content.split(" ")[2];
  var indexSac = [0,0,0];
  indexSac[0] = message.content.split(" ")[3];
  indexSac[1] = message.content.split(" ")[4];
  indexSac[2] = message.content.split(" ")[5];
  console.log("Upgrading unit " + indexTarg + " with units " + indexSac[0] + ", " + indexSac[1] + ", " + indexSac[2]);
  routeCheckExists(message)
  .then(function(){return modU.upgradeUnit(message.author.id, indexTarg, indexSac[0], indexSac[1], indexSac[2]);})
  .then((target_id) => {
    if (target_id) {
      embeds.printSingle(message, parseInt(colours.normal), "Character was upgraded!");
      return inv.showUnitById(message, target_id);
    } else {
      embeds.printSingleError(message, "Target Id not Returned after Upgrade Unit");
      return false;
    }
  })
  .then((success) => {
    if (success) {
      console.log("successful sacrifice");
    } else {
      console.log("failed sacrifice");
    }
  })
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.error('upgrUnit routes error : ' + err.stack);
  });
}

function showRankLegend(message) {
  embeds.printUnitRanks(message);
}
