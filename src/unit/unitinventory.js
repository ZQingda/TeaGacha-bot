var chars = require("./catalogue").characters;
var colours = require('../config').colours;
var dbGetOwnedUnits = require("../db/getUnits").dbGetOwnedUnits;
var embeds = require("../messages/message");

function listUnits(message, page) {
  return dbGetOwnedUnits('./database/gachiGacha.db', message.author.id)
    .then(function (units) {
      console.log("Num of units: " + units.length);
      var pages = Math.ceil(units.length / 4);
      if (page > pages) {
        embeds.printSingle(message, colours.error, "You only have " + pages + " pages of units!");
      }
      else {
        var pageUnits = units.splice((4 * (page - 1)), (4 * page));
        embeds.printUnitPage(message, colours.normal, pageUnits, page, pages);
      }
    })
    .catch((err) => {console.error(err);})
}

module.exports = {
  listUnits: listUnits
}
