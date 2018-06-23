const Discord = require("discord.js");
var dbAddChar = require("./db/addChars").dbAddChar;
var dbGetOwnedUnits = require("./db/getUnits").dbGetOwnedUnits;
var char = require("./unit/template").char;
var inv = require("./unit/unitinventory");


module.exports = function(message) {
  msg = message.content.slice(7);
  //console.log(msg);
  switch (msg) {
    case "rollOne":
      rollOne(message);
      break;
    case "myChars":
      getChars(message);
      break;
    default:
      message.channel.send("That's not a gacha command");
  }
}

function rollOne(message) {
  console.log("RollOne");
  const c = new char([], message.author.id);
  console.log(c);
  dbAddChar('./database/gachiGacha.db', c);

  var r = '[==========] CONGRATULATIONS [==========]\n\n';
  r += 'You got a: ' + c.unit_name + '\n';
  r += 'Rank: ' + c.rank  + '\n'
  r += 'Armor: ' + c.armor_class + '\n'
  r += 'Combat: ' + c.combat_type + '\n'
  r += 'Attack: ' + c.atk + '\n'
  r += 'Defence: ' + c.def + '\n'
  r += 'Speed: ' + c.spd + '\n'
  r += 'Health: ' + c.hp + '\n\n'
  r +=    '[=======================================]';
  message.channel.send(r);
}

function getChars(message) {
  console.log("GetChars");
  inv.listUnits(message.author.id,message.guild.member(message.author).displayName).then(function(msgEmbed) {
    message.channel.send(msgEmbed);
  });

}
