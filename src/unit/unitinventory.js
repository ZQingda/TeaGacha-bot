var chars = require("./catalogue").characters;
var charLvl = require("./template");
var dbGetChars = require("../db/getUnits");
var icons = require("../icons/unitIcons");
const config = require('../config.json');
const Discord = require("discord.js");

function listUnits(userid, name) {

  var promise = dbGetChars.dbGetOwnedUnits(userid)
    .then(function (units) {
      console.log("Num of units: " + units.length);
      var msgEmbed = new Discord.RichEmbed();
      msgEmbed.setColor(Number(config.colours.normal));
      msgEmbed.setTitle("**__" + name + "'s Units__**");
      for (var i = 0; i < units.length; i++) {
        var curUnit = units[i];
        var details =  "**Lv " + charLvl.getLvl(curUnit) + "** " + curUnit.class
          + "\n" + icons.getRankIcon(curUnit.rank) + "    " + icons.getCombatIcon(curUnit.combat_type) + "     " + icons.getArmorIcon(curUnit.armor_class);
        if (i % 2 == 1) {
          msgEmbed.addBlankField(true);
        }
        msgEmbed.addField(i + ". " + curUnit.unit_name, details + "\n---------------------------", true);
      }
      return msgEmbed;
    });
  return promise;
}

function showUnit(id) {
  var promise = dbGetChars.dbGetUnitByID(id)
  .then(function (unit) {
    var msgEmbed = new Discord.RichEmbed();
    if (unit == null) {
      msgEmbed.setColor(Number(config.colours.error));
      msgEmbed.setDescription("The unit could not be found.");
    } else {
      msgEmbed.setColor(Number(config.colours.normal));
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
