var embeds = require("./messages/message");
const config = require('./config');
var conv = require("./currency/weeklyconversions");

/**
 * Routing all messages which start with "gacha admin "
 * @param {*} message 
 */
module.exports = function (message, args) {
  switch (args[0]) {
    case "resetCurrencyExchange":
      resetCurrencyExchange(message, args.slice(1));
      break;
    default:
      console.log("Admin Args:"+ args);
      embeds.printSingle(message, Number(config.colours.error), "That's not a gacha Admin command!");
  }
}


function resetCurrencyExchange(message, args){
  if(config.admins[message.author.id]){
    return conv.resetWeeklyConversion()
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