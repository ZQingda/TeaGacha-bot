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

module.exports.printUser = function(message, colour, unit) {
  let msg = new Discord.RichEmbed();
  msg.setColor(colour);
  msg.setTitle("**__" + message.guild.member(message.author).displayName + "__**");
  msg.addField('Flowers', unit.flowers, false);
  msg.addField('Clovers', unit.clovers, false);
  msg.addField('Energy', unit.energy, false);
  message.channel.send(msg);
}
module.exports.printNewUnit = function(message, colour, unit) {
  var msg = {
    embed : {
      color: colour,
      title: message.guild.member(message.author).displayName + " just got a new "+ unit.unit_name,
      description : '[============]\n'
        + 'Rank: ' + unit.rank + '\n'
        + 'Armor: ' + unit.armor_class + '\n'
        + 'Combat: ' + unit.combat_type + '\n'
        + 'Attack: ' + unit.atk + '\n'
        + 'Defence: ' + unit.def + '\n'
        + 'Speed: ' + unit.spd + '\n'
        + 'Health: ' + unit.hp + '\n\n'
        + '[============]'
    }
  };
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
