var char = require("./template").char;

function genOne(message) {
  const c = new char([], message.author.id);
  var r = '[==========] CONGRATULATIONS [==========]\n\n';
  r += 'You got a: ' + c.unit_name + '\n';
  r += 'Rarity: ' + c.rarity + '\n'
  r += 'Armor: ' + c.armor_class + '\n'
  r += 'Combat: ' + c.combat_type + '\n'
  r += 'Attack: ' + c.atk + '\n'
  r += 'Defence: ' + c.def + '\n'
  r += 'Speed: ' + c.spd + '\n'
  r += 'Health: ' + c.hp + '\n\n'
  r += '[=======================================]';
  message.channel.send(r);
  return c;
}

module.exports = {
  genOne: genOne
}