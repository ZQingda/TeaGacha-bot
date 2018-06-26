var pad = require('pad-left');
const Discord = require("discord.js");

module.exports.printSingle = function(message, colour, text) {
  var msg = {
    embed : {
      color : colour,
      description : text
    }
  }
  message.channel.send(msg);
}

module.exports.printUser = function(message, unit) {
  let msg = new Discord.RichEmbed();
  msg.setColor(0x2eb8b8);
  msg.setTitle("**__" + message.guild.member(message.author).displayName + "__**");
  msg.addField('Flowers', unit.flowers, false);
  msg.addField('Clovers', unit.clovers, false);
  msg.addField('Energy', unit.energy, false);
  message.channel.send(msg);
}
module.exports.printNewUnit = function(message, unit) {
  var msg = {
    embed : {
      color: 0x2eb8b8,
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

module.exports.printUnits = function(message, colour, units, curPage, totalPages) {
  var msg = {
    embed : {
      color: colour,
      title: message.author.username + "'s units, page " + curPage + " of " + totalPages

    }
  }
}

module.exports.printCurrency = function(message, colour, currency, curValue) {
  var msg = {
    embed : {
      color : colour,
      description : message.author.username + ' has ' + curValue + ' ' + currency
    }
  }
  message.channel.send(msg);
}