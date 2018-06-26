var pad = require('pad-left');
var icons = require("../icons/unitIcons");
const Discord = require("discord.js");

function unitsEmbed(msgEmbed, units) {
  var newEmbed = msgEmbed
  for (var i = 0; i < units.length; i++) {
    var curUnit = units[i];
    var details = icons.getRankIcon(curUnit.rank) + "\n**Lv " + curUnit.lvl + "** " + curUnit.class
      + "\n" + icons.getCombatIcon(curUnit.combat_type) + "     " + icons.getArmorIcon(curUnit.armor_class);
    if (i % 2 == 1) {
      newEmbed.addBlankField(true);
    }
    newEmbed.addField(i + ". " + curUnit.unit_name, details + "\n---------------------------", true);
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

module.exports.printCurrency = function (message, colour, currency, curValue) {
  var msg = {
    embed: {
      color: colour,
      description: message.author.username + ' has ' + curValue + ' ' + currency
    }
  }
  message.channel.send(msg);
}

module.exports.printUnitPage = async function (message, colour, units, p1, p2) {
  var curPage = parseInt(p1);
  var maxPage = p2;
  console.log(curPage, '     ', maxPage);
  var pageUnits = units.slice((4 * (curPage - 1)), (4 * curPage));
  var msgEmbed = new Discord.RichEmbed();
  msgEmbed.setColor(0x2eb8b8);
  msgEmbed.setTitle("**__" + message.guild.member(message.author).displayName + "'s Units, page " + curPage + " of " + maxPage + "__**");
  msgEmbed = unitsEmbed(msgEmbed, pageUnits);

  var filterPrev = (reaction, user) => { return (reaction.emoji.name === '◀' && user.id === message.author.id) };
  var filterNext = (reaction, user) => { return (reaction.emoji.name === '▶' && user.id === message.author.id) };

  var response = await message.channel.send(msgEmbed);
  console.log("curPage initially " + curPage);


  if (curPage != maxPage) {
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
      newMsg.setColor(0x2eb8b8);
      newMsg.setTitle("**__" + message.guild.member(message.author).displayName + "'s Units, page " + curPage + " of " + maxPage + "__**");
      pageUnits = units.slice((4 * (curPage - 1)), (4 * curPage));
      newMsg = unitsEmbed(newMsg, pageUnits);
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
      newMsg.setColor(0x2eb8b8);
      newMsg.setTitle("**__" + message.guild.member(message.author).displayName + "'s Units, page " + curPage + " of " + maxPage + "__**");
      pageUnits = units.slice((4 * (curPage - 1)), (4 * curPage));
      newMsg = unitsEmbed(newMsg, pageUnits);
      response.edit(newMsg)
    });
  }
}