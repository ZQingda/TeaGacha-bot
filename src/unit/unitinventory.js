var chars = require("./catalogue").characters;
var dbGetOwnedUnits = require("../db/getUnits").dbGetOwnedUnits;
var icons = require("../icons/unitIcons");
const Discord = require("discord.js");

function listUnits(userid, name) {

  var promise = dbGetOwnedUnits('./database/gachiGacha.db', userid)
    .then(function (units) {
      console.log("Num of units: " + units.length);
      //console.log(units[0]);
      var msgEmbed = new Discord.RichEmbed();
      msgEmbed.setColor(0x2eb8b8);
      msgEmbed.setTitle("**__" + name + "'s Units__**");
      for (var i = 0; i < units.length; i++) {
        var curUnit = units[i];
        var details = icons.getRankIcon(curUnit.rank) + "\n**Lv " + curUnit.lvl + "** " + curUnit.class
          + "\n" + icons.getCombatIcon(curUnit.combat_type) + "     " + icons.getArmorIcon(curUnit.armor_class);
        if (i % 2 == 1) {
          msgEmbed.addBlankField(true);
        }
        msgEmbed.addField(i + ". " + curUnit.unit_name, details + "\n---------------------------", true);
      }
      return msgEmbed;
    });
  return promise;
}

module.exports = {
  listUnits: listUnits
}
