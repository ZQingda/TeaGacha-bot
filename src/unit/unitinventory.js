var chars = require("./catalogue").characters;
var colours = require('../config').colours;
var dbGetUnitByID = require("../db/getUnits").dbGetUnitByID;
var dbGetOwnedUnits = require("../db/getUnits").dbGetOwnedUnits;
var dbGetUnitByUserIndex = require("../db/getUnits").dbGetUnitByUserIndex;
var embeds = require("../messages/message");

async function listUnits(message, page) {
  return dbGetOwnedUnits(message.author.id)

    .then(function (units) {
      console.log("Num of units: " + units.length);
      var pages = Math.ceil(units.length / 4);
      if (page > pages) {
        embeds.printSingle(message, parseInt(colours.error), "You only have " + pages + " pages of units!")
      }
      else {
        embeds.printUnitPage(message, parseInt(colours.normal), units, page, pages);
      }
    })
    .catch((err) => {console.error(err);})
}

function showUnit(user_id, unit_index) {
  var promise = dbGetOwnedUnits(user_id, unit_index)
  .then(function (unit) {
    var msgEmbed = new Discord.RichEmbed();
    if (unit == null) {
      msgEmbed.setColor(Number(colours.error));
      msgEmbed.setDescription("The unit could not be found.");
    } else {
      msgEmbed.setColor(parseInt(colours.normal));
      msgEmbed.setTitle(icons.getRankIcon(unit.rank) + " " + unit.unit_name);
      var expLeft = ((unit.lvl - charLvl.getLvl(unit))*100).toFixed(2);
      msgEmbed.addField("Level","**" + charLvl.getLvl(unit) + "** / EXP: " + expLeft + "%",true);
      msgEmbed.addField("Types",icons.getCombatIcon(unit.combat_type) + "  " + icons.getArmorIcon(unit.armor_class),true);
      msgEmbed.addField("Class", unit.class, true)
      msgEmbed.addField("Stats", "**ATK** " + unit.atk + " / **DEF** " + unit.def + " / **HP** " + unit.hp + " / **SPD** " + unit.spd);
    }
    return msgEmbed;
  });
  return promise;
}

module.exports = {
  listUnits: listUnits,
  showUnit: showUnit
}
