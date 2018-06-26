var pad = require('pad-left');
var icons = require("../icons/unitIcons");
var config = require("../config");
var getLvl = require("../unit/template").getLvl;
const Discord = require("discord.js");

module.exports.printSingle = function (message, colour, text) {
  var msg = {
    embed: {
      color: colour,
      description: text
    }
  }
  message.channel.send(msg);
}

module.exports.printCurrency = function (message, colour, currency, curValue) {
  var msg = {
    embed: {
      color: colour,
      description: message.author.username + ' has ' + curValue + ' ' + currency
    }
  }
  message.channel.send(msg);
}

module.exports.printUnitPage = function (message, colour, units, curPage, maxPage) {
  var msgEmbed = new Discord.RichEmbed();
  msgEmbed.setColor(parseInt(config.colours.normal));
  msgEmbed.setTitle("**__" + message.guild.member(message.author).displayName + "'s Units, page " + curPage + " of " + maxPage + "__**");
  for (var i = 0; i < units.length; i++) {
    var curUnit = units[i];
    var details = icons.getRankIcon(curUnit.rank) + "\n**Lv " + getLvl(curUnit) + "** " + curUnit.class
      + "\n" + icons.getCombatIcon(curUnit.combat_type) + "     " + icons.getArmorIcon(curUnit.armor_class);
    if (i % 2 == 1) {
      msgEmbed.addBlankField(true);
    }
    msgEmbed.addField(i + ". " + curUnit.unit_name, details + "\n---------------------------", true);
  }
  message.channel.send(msgEmbed);
}
