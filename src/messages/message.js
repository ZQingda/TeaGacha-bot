var pad = require('pad-left');
var icons = require("../icons/unitIcons");
var iconscurr = require("../icons/currencyIcons");
var config = require("../config");
var getLvl = require("../unit/template").getLvl;
var templ = require("../unit/template");
var cat = require("../unit/catalogue").characters;
var conv = require("../currency/weeklyconversions");

const Discord = require("discord.js");

function unitsEmbed(msgEmbed, units, pageNum) {
  var newEmbed = msgEmbed;
  for (var i = 0; i < units.length; i++) {
    var curUnit = units[i];
    var details = icons.getRankIcon(curUnit.rank) + "\n**Lv " + getLvl(curUnit) + "** " + curUnit.class
      + "\n" + icons.getCombatIcon(curUnit.combat_type) + "     " + icons.getArmorIcon(curUnit.armor_class);

    newEmbed.addField(curUnit.inv_index + ". " + curUnit.unit_name, details + "\n---------------------------------------------", true);
  }
  return newEmbed;
}

function newUnitsEmbed(msgEmbed, units, pageNum) {
  var newEmbed = msgEmbed;
  for (var i = 0; i < units.length; i++) {
    var curUnit = units[i];
    var details = icons.getRankIcon(curUnit.rank) + " - Rarity: " + templ.rankInfo.name[cat[curUnit.unit_name].pull_group]+ "\n**Lv "
      + getLvl(curUnit) + "** " + curUnit.class + "\n" + icons.getCombatIcon(curUnit.combat_type) + "     " + icons.getArmorIcon(curUnit.armor_class);

    newEmbed.addField(curUnit.unit_name, details + "\n---------------------------------------------", true);
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
  return message.channel.send(msg);
}

module.exports.printSingleNormal = function (message, text) {
  var msg = {
    embed: {
      color: parseInt(config.colours.normal),
      description: text
    }
  }
  return message.channel.send(msg);
}

module.exports.printSingleConfirmation = function (message, text) {
  var msg = {
    embed: {
      color: parseInt(config.colours.confirm),
      description: text
    }
  }
  return message.channel.send(msg);
}

module.exports.printUser = function (message, colour, user) {
  let msg = new Discord.RichEmbed();
  msg.setColor(colour);
  msg.setTitle("**__" + message.guild.member(message.author).displayName + "__**");
  msg.addField('Clovers', user.clovers, false);
  msg.addField('Gems', user.gems, false);
  msg.addField('Energy', user.energy + "/" + user.energy_max, false);
  msg.addField('Units', user.unit_count + "/" + user.unit_capacity, false);
  message.channel.send(msg);
}
module.exports.printUnit = function(message, colour, unit){
  console.log("**ATK** " + unit.atk + " / **DEF** " + unit.def + " / **HP** " + unit.hp + " / **SPD** " + unit.spd);
  let msg = new Discord.RichEmbed();
  msg.setColor(colour);
  msg.setTitle("__" + unit.unit_name + "__");
  msg.addField("Current Rank", icons.getRankIcon(unit.rank) + " " + unit.rank, true);
  msg.addField("Max Rank", icons.getRankIcon(cat[unit.unit_name].max_rank) + " " + cat[unit.unit_name].max_rank, true);
  msg.addField("Rarity", templ.rankInfo.name[cat[unit.unit_name].pull_group], true);
  var expLeft = ((unit.lvl - getLvl(unit))*100).toFixed(2);
  msg.addField("Level","**" + getLvl(unit) + "** / EXP: " + expLeft + "%",true);
  msg.addField("Types",icons.getCombatIcon(unit.combat_type) + "  " + icons.getArmorIcon(unit.armor_class),true);
  msg.addField("Class", unit.class, true)
  msg.addField("Stats", "**ATK** " + unit.atk + " / **DEF** " + unit.def + " / **HP** " + unit.hp + " / **SPD** " + unit.spd);
  msg.addField("Character of", cat[unit.unit_name].owner);
  message.channel.send(msg);
}
module.exports.printNewUnit = function (message, colour, unit) {
  var msg = {
    embed: {
      color: colour,
      title: message.guild.member(message.author).displayName + ": NEW " + unit.unit_name,
      description: '**Rank:** ' + icons.getRankIcon(unit.rank) + ' ' + unit.rank + ' / **Max Rank:** '
        +  icons.getRankIcon(cat[unit.unit_name].max_rank) + ' ' + cat[unit.unit_name].max_rank + '\n'
        + '**Rarity:** ' + templ.rankInfo.name[cat[unit.unit_name].pull_group] + '\n'
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
      description: message.author.username + ' has ' + curValue + ' ' + iconscurr.getCurrencyIcon(currency)
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

module.exports.printUnitPage = async function (message, colour, units, p1, p2, newunits) { //TODO: clear reactions on timer end
  var curPage = parseInt(p1);
  var maxPage = p2;
  var pl = config.pageLength;
  console.log(curPage, '     ', maxPage);
  var pageUnits = units.slice((pl * (curPage - 1)), (pl * curPage));
  var msgEmbed = new Discord.RichEmbed();
  msgEmbed.setColor(colour);
  if (newunits) {
    msgEmbed.setTitle("**__" + message.guild.member(message.author).displayName + "'s New Units, page " + curPage + " of " + maxPage + "__**");
  }
  msgEmbed.setTitle("**__" + message.guild.member(message.author).displayName + "'s Units, page " + curPage + " of " + maxPage + "__**");
  if (newunits) {
    msgEmbed = newUnitsEmbed(msgEmbed, pageUnits, curPage);
  } else {
    msgEmbed = unitsEmbed(msgEmbed, pageUnits, curPage);
  }

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
      if (newunits) {
        msgEmbed.setTitle("**__" + message.guild.member(message.author).displayName + "'s New Units, page " + curPage + " of " + maxPage + "__**");
      }
      newMsg.setTitle("**__" + message.guild.member(message.author).displayName + "'s Units, page " + curPage + " of " + maxPage + "__**");
      pageUnits = units.slice((pl * (curPage - 1)), (pl * curPage));
      if (newunits) {
        newMsg = newUnitsEmbed(newMsg, pageUnits, curPage);
      } else {
        newMsg = unitsEmbed(newMsg, pageUnits, curPage);
      }
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
      if (newunits) {
        msgEmbed.setTitle("**__" + message.guild.member(message.author).displayName + "'s New Units, page " + curPage + " of " + maxPage + "__**");
      }
      newMsg.setTitle("**__" + message.guild.member(message.author).displayName + "'s Units, page " + curPage + " of " + maxPage + "__**");
      pageUnits = units.slice((pl * (curPage - 1)), (pl * curPage));
      if (newunits) {
        newMsg = newUnitsEmbed(newMsg, pageUnits, curPage);
      } else {
        newMsg = unitsEmbed(newMsg, pageUnits, curPage);
      }
      response.edit(newMsg)
    });
  }
}

module.exports.confirmationMessageYN = async function (message, text) {
  const yes = "✅";
  const no = "❎";
  //var msgEmbed = new Discord.RichEmbed();
  //message.channel.send("Are you sure?\n:white_check_mark: for yes, :negative_squared_cross_mark: for no");
  var response = await module.exports.printSingleConfirmation(message, text + "\n\n:white_check_mark: for yes, :negative_squared_cross_mark: for no");

  var filterReact = (reaction, user) => { return ((reaction.emoji.name === '✅' || reaction.emoji.name === '❎') && user.id === message.author.id) };

  await response.react(yes);
  await response.react(no);

  const reactions = await response.awaitReactions(filterReact, { max: 1, time: 7000 });
  response.delete();

  if (reactions.has(yes) && reactions.get(yes).count >= 1) {
    return true;
  } else if (reactions.has(no) && reactions.get(no).count >= 1) {
    return false;
  } else {
    var errResponse = await module.exports.printSingleError(message, "No response was received. Cancelling action.");
    errResponse.delete(5000);
  }
}

module.exports.printUnitRanks = function (message) {
  var legend = "";
  for (var i = templ.getRankCount(); i > 0; i--) {
    legend += icons.getRankIcon(i) + "\n";
  }
  printSingle(message, parseInt(config.colours.normal), legend);
}
