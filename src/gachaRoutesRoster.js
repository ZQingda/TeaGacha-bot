var embeds = require("./messages/message");
const config = require('./config');
var user = require("./user/user");
var units = require("./unit/units");
var roster = require("./unit/unitroster");
var iconsunit = require("./icons/unitIcons");
var colours = require('./config').colours;

/**
 * Routing all messages which start with "gacha roster "
 * @param {*} message 
 */
module.exports = function (message, args) {
  console.log("Test:"+ args[0]+":")
  switch (args[0]) {
    case "set":
      setRosterUnit(message, args.slice(1));
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


async function setRosterUnit(message, args){
  if(args.length<2){
    embeds.printSingleError(message, "Not enough arguments. Valid format: {Roster Position} {Unit Number}");
    return;
  }
  try{
    let currentUser = await user.getUser(message.author.id);
    let newRosterSlot = args[0];
    let newRosterUnit = await units.getUnit(message.author.id, args[1]);

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
    let currentRoster = await roster.getRoster(message.author.id);
    let unitpoints = currentRoster.reduce((total, unit) => total + unit.getPointValue(), 0 )
    let title = message.guild.member(message.author).displayName + "'s roster (" + unitpoints + "/" + currentUser.roster_point_capacity+ " UP)";
    embeds.printRoster(message, parseInt(colours.normal), title, currentRoster)
  }catch(err){
    console.error('showRoster Error : ' + err + " - " + err.stack);
    embeds.printSingleError(message, err.message?err.message:err);
  }
}