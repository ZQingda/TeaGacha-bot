var chars = require("./catalogue").characters;
var colours = require('../config').colours;
var pageLength = require('../config').pageLength;
var dbGetUnitByID = require("../db/getUnits").dbGetUnitByID;
var dbGetOwnedUnits = require("../db/getUnits").dbGetOwnedUnits;
var dbGetUnitByIndex = require("../db/getUnits").dbGetUnitByIndex;
var dbGetUnitByUserIndex = require("../db/getUnits").dbGetUnitByUserIndex;
var dbGetUnitByUserIndexMulti = require("../db/getUnits").dbGetUnitByUserIndexMulti
var embeds = require("../messages/message");

async function listUnits(message, page, filters) {
  return dbGetOwnedUnits(message.author.id, filters)

    .then(function (units) {
      console.log("Num of units: " + units.length);
      var pages = Math.ceil(units.length / pageLength);
      console.log('PAGES : ' + pages);
      if (page > pages) {
        embeds.printSingle(message, parseInt(colours.error), "You only have " + pages + " pages of units!")
      }
      else {
        embeds.printUnitPage(message, parseInt(colours.normal), units, page, pages, false);
      }
    })
    .catch((err) => {console.error(err);})
}

function showUnit(message, index) {
  return dbGetUnitByIndex(message.author.id, index)
  .then(function (unit) {
    if (unit == null) {
      embeds.printSingle(message, parseInt(colours.error), "The unit could not be found.")
      return false;
    } else {
      embeds.printUnit(message, parseInt(colours.normal), unit);
      return true;
    }
  })
  .catch((err) => {console.error(err.stack);});
}

function showUnitById(message, id) {
  return dbGetUnitByID(id)
  .then(function (unit) {
    if (unit == null) {
      embeds.printSingle(message, parseInt(colours.error), "The unit could not be found.")
      return false;
    } else {
      embeds.printUnit(message, parseInt(colours.normal), unit);
      return true;
    }
  })
  .catch((err) => {console.error(err.stack);});
}

function getUnits(user_id, indexes){
  return dbGetUnitByUserIndexMulti(user_id, indexes)
}

module.exports = {
  listUnits: listUnits,
  showUnit: showUnit,
  showUnitById: showUnitById
}
