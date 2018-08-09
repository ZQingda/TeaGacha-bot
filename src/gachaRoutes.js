const Discord = require("discord.js");
var colours = require('./config').colours;
var cur = require("./currency/currency");
var databcurr = require("./db/currency");
var databunit = require("./db/getUnits");
var databuser = require("./db/user");
var units = require("./unit/units");
var embeds = require("./messages/message");
const config = require('./config');
var char = require("./unit/template").char;
var inv = require("./unit/unitinventory");
var user = require("./user/user");
var modU = require("./unit/unitexpupgrade");
var roster = require("./unit/unitroster");
var iconscurr = require("./icons/currencyIcons");
var iconsunit = require("./icons/unitIcons");
var unitFilters = require("./filters/unitFilters");
var conv = require("./currency/weeklyconversions");
var admin = require("./user/admin").admins;

module.exports = function (message) {
  msg = message.content.split(' ');
  //console.log(msg);
  switch (msg[1]) {
    case "resetcurrencyexchange":
      resetCurrencyExchange(message);
      break;
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
      buyCurrency(message, 'flowers', 'gems', 5);
      break;
    case "sellunit":
      sellUnit(message);
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
 * Returns all the arguments (space delimited) passed into the message (excluding the 1st which splits the gacha route)
 * Ex: message "gacha showunit 1" will return [1]
 * @param {*} message 
 */
function getArgs(message){
  let args = message.content.split(/\s+/);
  args = args.slice(2);
  return args;
}
function resetCurrencyExchange(message){
  if(admin[message.author.id]){
    return databuser.modAllWeeklyConversions(0)
    .then(function(){
      embeds.printSingleNormal(message, "All user's currency exchanges have been reset.");
    })
    .catch((err) => {
      embeds.printSingleError(message, err);
      console.error('Error : ' + err + " - " + err.stack);
    })
  }else{
    embeds.printSingleError(message, "You don't have access to this command.");
  }
}

/**
 * Promise rejection if the user is over their unit capacity or if the user doesn't exist.
 * @param {*} message
 */
function routeCheckOverUnitCapacity(message){
  return user.getUser(message.author.id)
  .then(user => {
    let remainingCap = user.unit_capacity - user.unit_count;
    if(remainingCap<0){
      return Promise.reject("You are currently " + Math.abs(remainingCap) + " units over your capacity!  You need to reduce your unit count before using this comand.");
    }else{
      return Promise.resolve(remainingCap);
    }
  })
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
  user.getUser(message.author.id)
  .then(function(){return roster.listRoster(message)})
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.log("listRoster err " + err.stack);
  });
}

function modCurrencyWrap(message, currency) {
  user.getUser(message.author.id)
  .then(function(){return cur.modCurrency(message, currency)})
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.error('routes error : ' + err);
  });
}

function buyCurrency(message, from, to, rate) {
  var amountTo = parseInt(message.content.split(' ')[2]);
  var amountFrom = amountTo * rate;

  let canConvert = conv.getWeeklyConversions(message.author.id)
    .then(function(result) {
      if (result >= conv.maxPerWeek) {
        embeds.printSingleError(message, "Hit max conversions (" + conv.maxPerWeek + ") for the week.");
      } else if (isNaN(amountTo) || amountTo<=0) {
        embeds.printSingleError(message, "Please provide a positive number of " + iconscurr.getCurrencyIcon(to) + " you want.");
      } else {
        if(result + amountTo > conv.maxPerWeek){
          embeds.printSingleError(message, "You will go over your weekly conversions (" + conv.maxPerWeek +").");
        } else {
          user.getUser(message.author.id)
          .then(function() {
            return databcurr.getFlowers(message.author.id)
            .catch((err) => {
              console.error('From conversion error : ' + err);
              throw err;
            })
          })
          .then(function(flowers){
            console.log("Flowers: " + flowers)
            if ((flowers - amountFrom) < 0) {
              embeds.printSingleError(message, "You need " + amountFrom + " " + iconscurr.getCurrencyIcon("flowers"));
              return 0;
            } else {
              console.log("Starting Flower Stealing...")
              return databcurr.modifyFlowers(message.author.id, flowers, (amountFrom * -1))
              .catch((err) => {
                console.error('From conversion error : ' + err);
                throw err;
              })
            }
          })
          .then(function(result){
            console.log("Result: " + result);
            if (result) {
              console.log("Converting to Gems attempt..");
              return cur.modCurrency(message, to, amountTo)
              .catch((err) => {
                console.error('To conversion error : ' + err);
                throw err;
              })
            } else {
              return 0;
            }
          })
          .catch((err) => {
            embeds.printSingleError(message, err);
            console.error('Buy currency error : ' + err + " - " + err.stack);
          })
          .then(function(result) {
            if (result) {
              embeds.printSingleNormal(message, "You traded " + amountFrom + " " + iconscurr.getCurrencyIcon(from)
                + " for " + amountTo + " " + iconscurr.getCurrencyIcon(to) + ".");
              return conv.addWeeklyConversion(message.author.id,amountTo);
            } else {
              return 0;
            }
          });
        }
      }
    });
}

async function sellUnit(message) {
  let forCurrency = "clovers"

  var args = getArgs(message);
  try{
    var unitToSell = args[0];
    let currentUser = await user.getUser(message.author.id);
    let sellUnit = await units.getUnit(message.author.id, unitToSell);
    
    let confirmText = message.guild.member(message.author).displayName + " are you sure you want to sell "
    + "Lv" + Math.floor(sellUnit.lvl) + " " + iconsunit.getRankIcon(sellUnit.rank) + " " + sellUnit.unit_name + " for "+ sellUnit.getCloverValue() + iconscurr.getCurrencyIcon(forCurrency) + "?"

    if(await embeds.confirmationMessageYN(message, confirmText)){
      let sellValue = sellUnit.getCloverValue();
      if(await units.deleteUnit(sellUnit)){
        cur.modCurrency(message, forCurrency, sellValue);
      }
    }
  }catch(err){
    console.error('Sell Unit Error : ' + err + " - " + err.stack);
    embeds.printSingleError(message, err.message?err.message:err);
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
    embeds.printUnitPage(message, parseInt(colours.normal), units, 1, 1, true);
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
  var arguments = getArgs(message);

  var page = isNaN(arguments[0]) ? 1 : arguments[0];
  var filters = unitFilters.parseIntoFilters(arguments);

  console.log(page);
  if (!page || page < 1) {
    embeds.printSingle(message, parseInt(colours.error), "Invalid page number!")
  } else {
    user.getUser(message.author.id)
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

  user.getUser(message.author.id)
  .then(function(){return inv.showUnit(message, index);})
  .catch((err) => {
    embeds.printSingleError(message, err);
    console.error('getUnit routes error : ' + err + " - " + err.stack);
  });
}

function getUser(message){
  console.log("getUser");

  user.getUser(message.author.id)
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

  user.getUser(message.author.id)
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
  var targID;

  user.getUser(message.author.id)
  .then(function (usr) {
    if (usr.user_id) {
      console.log("found usr");
      console.log("unit count: " + usr.unit_count);
      if ((indexTarg > 0 && indexTarg <= usr.unit_count) && (indexSac > 0 && indexSac <= usr.unit_count)) {
        return databunit.dbGetUnitByIndexMulti(message.author.id, [indexSac, indexTarg]);
      }
    } else { return false; }
  })
  .then(function(units) {
    console.log(units);
    if (units) {
      var sac;
      var targ;
      if (units[0].inv_index == indexSac) {
        console.log("sac is" + units[0].inv_index);
        sac = units[0];
        targ = units[1];
        return [sac, targ];
      } else {
        sac = units[1];
        targ = units[0];
        return [sac, targ];
      }
    }
  })
  .then(function(units) {
    var sac = units[0];
    var targ = units[1];
    targID = targ.unit_id;
    console.log("sac is " + sac.inv_index);
    console.log("targ is" + targ.inv_index);
    return embeds.confirmationMessageYN(message, "Are you sure you want to use " +
    "Lv" + Math.floor(sac.lvl) + " " + iconsunit.getRankIcon(sac.rank) + " " + sac.unit_name + " to upgrade " +
    "Lv" + Math.floor(targ.lvl) + " " + iconsunit.getRankIcon(targ.rank) + " " + targ.unit_name + "?");
  })
  .then(function(result){
    console.log(result);
    if (result) {
      return modU.feedUnit(message.author.id, indexTarg, indexSac);
    } else {
      return false;
    }
  })
  .then((names) => {
    if (names != false) {
      message.channel.send(names[0] + " was used to strengthen the level " + names[2] + " " + names[1]);
      console.log("id: " + targID);
      inv.showUnitById(message, targID);
    } else {
      return false;
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
  user.getUser(message.author.id)
  .then(function() {
    return embeds.confirmationMessage(message);
  })
  .then(function(result){
    if (result) {
      return modU.upgradeUnit(message.author.id, indexTarg, indexSac[0], indexSac[1], indexSac[2]);
    } else {
      return false;
    }
  })
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
