var embeds = require("./messages/message");
const config = require('./config');
var user = require("./user/user");
var Units = require("./unit/units");
var roster = require("./unit/unitroster");
var iconsunit = require("./icons/unitIcons");
var colours = require('./config').colours;
var util = require("./util/argUtil");

/**
 * Routing all messages which start with "gacha roster "
 * @param {*} message 
 */
module.exports = function (message, args) {
  console.log("Test:"+ args[0]+":")
  switch (args[0]) {
    case "removeUnit":
    case "removeunit":
    case "ru":
      removeRosterUnitWrapper(message, args.slice(1));
      break;
    case "removeSlot":
    case "removeslot":
    case "rs":
      removeRosterSlotWrapper(message, args.slice(1));
        break;
    case "set":
      setRosterUnit(message, args.slice(1));
      break;
    case "setAll":
    case "setall":
    case "sa":
      setAllRosterUnit(message, args.slice(1));
      break;
    case "list":
    case undefined:
      //undefined = Show Roster as default if no additional route action was given
      showRoster(message);
      break;
    default:
      console.log("Roster Args: "+ args);
      embeds.printSingleError(message, "That's not a gacha roster command!");
  }
}
async function removeRosterSlotWrapper(message, args){
  try{
    let currentUser = await user.getUser(message.author.id);
    if (!util.getUnique(args)) {
      throw Error("Roster slots must be unique.");
    }
    let unitsToRemove = await Units.getRosterUnits(currentUser.user_id, args);
    unitsToRemove = unitsToRemove.filter(unit=> unit.roster>0);
    if(unitsToRemove.length==0){
      throw Error("None of the given roster slots are currently filled.");
    }
    await commonRemoveUnits(message, currentUser, unitsToRemove);

  }catch(err){
    console.error('setRosterUnit Error : ' + err + " - " + err.stack);
    embeds.printSingleError(message, err.message?err.message:err);
  }
}

async function removeRosterUnitWrapper(message, args){
  try{
    let currentUser = await user.getUser(message.author.id);
    if (!util.getUnique(args)) {
      throw Error("Unit IDs must be unique.");
    }
    let unitsToRemove = await Units.getUnits(currentUser.user_id, args);
    unitsToRemove = unitsToRemove.filter(unit=> unit.roster>0);
    if(unitsToRemove.length==0){
      throw Error("None of the given units are currently in your roster.");
    }
    await commonRemoveUnits(message, currentUser, unitsToRemove);

  }catch(err){
    console.error('setRosterUnit Error : ' + err + " - " + err.stack);
    embeds.printSingleError(message, err.message?err.message:err);
  }
}

async function commonRemoveUnits(message, user, removeUnits){
  let confirmMsg = "Are you sure you want to remove:\n";
  removeUnits.forEach(unit => 
    confirmMsg += "**Lv" + Math.floor(unit.lvl) + " " + iconsunit.getRankIcon(unit.rank) + " " + unit.unit_name + "**\n\n"
  );
  confirmMsg+="from your roster?";

  if(await embeds.confirmationMessageYN(message, confirmMsg)){
    await roster.removeRosterUnit()  
    let promises = [];
    removeUnits.forEach(unitToRemove => 
      promises.push( roster.removeRosterUnit(unitToRemove.unit_id) )
    );
    let output = await Promise.all(promises);

    let currentRoster = await Units.getRoster(user.user_id);
    let unitpoints = currentRoster.reduce((total, unit) => total + unit.getPointValue(), 0 )
    let title = message.guild.member(message.author).displayName + "'s roster (" + unitpoints + "/" + user.roster_point_capacity+ " UP)";
    
    embeds.printSingleNormal(message, "Roster has been updated.");
    embeds.printRoster(message, parseInt(colours.normal), title, currentRoster)
  }
}

async function setAllRosterUnit(message, args){
  try{
    let currentUser = await user.getUser(message.author.id);
    if (!util.getUnique(args)) {
      throw Error("Unit IDs must be unique.");
    }

    let rosterAdditions = {};
    for(let argIdx=0; argIdx<Math.min(args.length, config.rosterLength); argIdx++){
      let unitNumber = args[argIdx];
      let newRosterUnit = await Units.getUnit(message.author.id, unitNumber);

      rosterAdditions[argIdx+1]= newRosterUnit;
    }

    let newRoster = await roster.addToRoster(currentUser, rosterAdditions);
    let unitpoints = newRoster.reduce((total, unit) => total + unit.getPointValue(), 0 )

    let title = message.guild.member(message.author).displayName + "'s roster (" + unitpoints + "/" + currentUser.roster_point_capacity+ " UP)";
    embeds.printRoster(message, parseInt(colours.normal), title, newRoster)
  }catch(err){
    console.error('setRosterUnit Error : ' + err + " - " + err.stack);
    embeds.printSingleError(message, err.message?err.message:err);
  }
}

async function setRosterUnit(message, args){
  if(args.length<2){
    embeds.printSingleError(message, "Not enough arguments. Valid format: {Roster Position} {Unit Number}");
    return;
  }
  try{
    let currentUser = await user.getUser(message.author.id);
    let newRosterSlot = args[0];
    if(!roster.rosterSlotValid(newRosterSlot)){
      throw Error("Roster slot " + newRosterSlot + " is invalid. Must be a number between 1 and " + config.rosterLength);
    }
    
    let newRosterUnit = await Units.getUnit(message.author.id, args[1]);

    let rosterAdditions = {};
    rosterAdditions[newRosterSlot]= newRosterUnit;
    console.log(rosterAdditions);
    let newRoster = await roster.addToRoster(currentUser, rosterAdditions);
    let unitpoints = newRoster.reduce((total, unit) => total + unit.getPointValue(), 0 )

    let title = message.guild.member(message.author).displayName + "'s roster (" + unitpoints + "/" + currentUser.roster_point_capacity+ " UP)";
    embeds.printRoster(message, parseInt(colours.normal), title, newRoster)
  }catch(err){
    console.error('setRosterUnit Error : ' + err + " - " + err.stack);
    embeds.printSingleError(message, err.message?err.message:err);
  }
}

async function showRoster(message) {
  try{
    let currentUser = await user.getUser(message.author.id); // Make sure User Exists
    let currentRoster = await Units.getRoster(message.author.id);
    let unitpoints = currentRoster.reduce((total, unit) => total + unit.getPointValue(), 0 )
    let title = message.guild.member(message.author).displayName + "'s roster (" + unitpoints + "/" + currentUser.roster_point_capacity+ " UP)";
    embeds.printRoster(message, parseInt(colours.normal), title, currentRoster)
  }catch(err){
    console.error('showRoster Error : ' + err + " - " + err.stack);
    embeds.printSingleError(message, err.message?err.message:err);
  }
}