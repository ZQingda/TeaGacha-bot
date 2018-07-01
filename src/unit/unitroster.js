var colours = require('../config').colours;
var embeds = require("../messages/message");
var dbGetRoster = require("../db/getUnits").dbGetRoster;

async function listRoster(message) {
  return dbGetRoster(message.author.id)
    .then((roster) => {
      embeds.printRoster(message, parseInt(colours.normal), roster);
    })
    .catch((err) => {
      console.log("listRoster Err ", err.stack);
    })
}

module.exports = {
  listRoster : listRoster
}
