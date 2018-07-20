var pad = require('pad-left');
var icons = require("../icons/unitIcons");
var config = require("../config");
var getLvl = require("../unit/template").getLvl;
var templ = require("../unit/template");

const Discord = require("discord.js");

function unitsEmbed(msgEmbed, units, pageNum) {
  var newEmbed = msgEmbed
  for (var i = 0; i < units.length; i++) {
    var curUnit = units[i];
    var details = icons.getRankIcon(curUnit.rank) + "\n**Lv " + getLvl(curUnit) + "** " + curUnit.class
      + "\n" + icons.getCombatIcon(curUnit.combat_type) + "     " + icons.getArmorIcon(curUnit.armor_class);
      
    newEmbed.addField(curUnit.inv_index + ". " + curUnit.unit_name, details + "\n---------------------------------------------", true);
  }
  return newEmbed;
}

module.exports.printSingle = function (message, colour, text) {
  var msg = {
    embed: {
      color: colour,
      description: text
    }
  }
  message.channel.send(msg);
}

module.exports.printSingleError = function (message, text) {
  var msg = {
    embed: {
      color: parseInt(config.colours.error),
      description: text
    }
  }
  message.channel.send(msg);
}

module.exports.printUser = function (message, colour, user) {
  let msg = new Discord.RichEmbed();
  msg.setColor(colour);
  msg.setTitle("**__" + message.guild.member(message.author).displayName + "__**");
  msg.addField('Flowers', user.flower, false);
  msg.addField('Clovers', user.clovers, false);
  msg.addField('Energy', user.energy + "/" + user.energy_max, false);
  message.channel.send(msg);
}
module.exports.printUnit = function(message, colour, unit){
  console.log("**ATK** " + unit.atk + " / **DEF** " + unit.def + " / **HP** " + unit.hp + " / **SPD** " + unit.spd);
  let msg = new Discord.RichEmbed();
  msg.setColor(colour);
  msg.setTitle(icons.getRankIcon(unit.rank) + " " + unit.unit_name);
  var expLeft = ((unit.lvl - getLvl(unit))*100).toFixed(2);
  msg.addField("Level","**" + getLvl(unit) + "** / EXP: " + expLeft + "%",true);
  msg.addField("Types",icons.getCombatIcon(unit.combat_type) + "  " + icons.getArmorIcon(unit.armor_class),true);
  msg.addField("Class", unit.class, true)
  msg.addField("Stats", "**ATK** " + unit.atk + " / **DEF** " + unit.def + " / **HP** " + unit.hp + " / **SPD** " + unit.spd);
  message.channel.send(msg);
}
module.exports.printNewUnit = function (message, colour, unit) {
  var msg = {
    embed: {
      color: colour,
      title: message.guild.member(message.author).displayName + ": NEW " + unit.unit_name,
      description: '**Rank:** ' + unit.rank + '\n'
        + '**Armor:** ' + icons.getArmorIcon(unit.armor_class) + " " + unit.armor_class + '\n'
        + '**Combat:** ' + icons.getCombatIcon(unit.combat_type) + " " + unit.combat_type + '\n'
        + '**Attack:** ' + unit.atk + '\n'
        + '**Defence:** ' + unit.def + '\n'
        + '**Speed:** ' + unit.spd + '\n'
        + '**Health:** ' + unit.hp + '\n\n'
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

module.exports.printRoster = async function (message, colour, units) {
  var msgEmbed = new Discord.RichEmbed();
  console.log("ROSTER : " + units);
  msgEmbed.setColor(colour);
  msgEmbed.setTitle("**__" + message.guild.member(message.author).displayName + "'s roster__**");
  for (var i = 0; i < 5; i++) {
    let found = false;
    for (var j = 0; j < units.length; j++) {
      if (units[j].roster == (i + 1)) {
        found = true;
        var curUnit = units[j];
        var details = icons.getRankIcon(curUnit.rank) + "\n**Lv " + curUnit.lvl + "** " + curUnit.class
          + "\n" + icons.getCombatIcon(curUnit.combat_type) + "     " + icons.getArmorIcon(curUnit.armor_class);

        msgEmbed.addField((i + 1) + ". " + curUnit.unit_name + " [" + curUnit.unit_id + "]", details + "\n---------------------------", true);
      }
    }
    //if (!found) {
    //  msgEmbed.addField((i + 1) + ".", "\n\n\n\n---------------------------", true);
    //}
    if (i % 2 == 1) {
      msgEmbed.addBlankField(true);
    }
  }
  message.channel.send(msgEmbed);
}

module.exports.printUnitPage = async function (message, colour, units, p1, p2) {
  var curPage = parseInt(p1);
  var maxPage = p2;
  var pl = config.pageLength;
  console.log(curPage, '     ', maxPage);
  var pageUnits = units.slice((pl * (curPage - 1)), (pl * curPage));
  var msgEmbed = new Discord.RichEmbed();
  msgEmbed.setColor(colour);
  msgEmbed.setTitle("**__" + message.guild.member(message.author).displayName + "'s Units, page " + curPage + " of " + maxPage + "__**");
  msgEmbed = unitsEmbed(msgEmbed, pageUnits, curPage);

  var filterPrev = (reaction, user) => { return (reaction.emoji.name === '◀' && user.id === message.author.id) };
  var filterNext = (reaction, user) => { return (reaction.emoji.name === '▶' && user.id === message.author.id) };

  var response = await message.channel.send(msgEmbed);
  console.log("curPage initially " + curPage);


  if (maxPage != 1) {
    await response.react("◀");
    await response.react("▶");

    const collectPrev = response.createReactionCollector(filterPrev, { time: 15000 });
    collectPrev.on('collect', async (r1) => {
      console.log('CATCH PREV : ' + r1);
      if (curPage > 1) {
        curPage -= 1;
        console.log("CurPage down to " + curPage);
      }
      var newMsg = new Discord.RichEmbed();
      newMsg.setColor(colour);
      newMsg.setTitle("**__" + message.guild.member(message.author).displayName + "'s Units, page " + curPage + " of " + maxPage + "__**");
      pageUnits = units.slice((pl * (curPage - 1)), (pl * curPage));
      newMsg = unitsEmbed(newMsg, pageUnits, curPage);
      response.edit(newMsg);
    });
    const collectNext = response.createReactionCollector(filterNext, { time: 15000 });
    collectNext.on('collect', async (r2) => {
      console.log('CATCH NEXT : ' + r2);
      if (curPage < maxPage) {
        curPage += 1;
        console.log("CurPage up to " + curPage);
      }
      var newMsg = new Discord.RichEmbed();
      newMsg.setColor(colour);
      newMsg.setTitle("**__" + message.guild.member(message.author).displayName + "'s Units, page " + curPage + " of " + maxPage + "__**");
      pageUnits = units.slice((pl * (curPage - 1)), (pl * curPage));
      newMsg = unitsEmbed(newMsg, pageUnits, curPage);
      response.edit(newMsg)
    });
  }
}

module.exports.printUnitRanks = function (message) {
  var legend = "";
  for (var i = templ.getRankCount(); i > 0; i--) {
    legend += icons.getRankIcon(i) + "\n";
  }
  module.exports.printSingle(message, parseInt(config.colours.normal), legend);
}
