var chars = require("./catalogue").characters;

function pickOne(chars) {
  var keys = Object.keys(chars)
  return chars[keys[ keys.length * Math.random() << 0]];
};

const baseStats = {
  "hp" : {
    heavy : 70,
    medium : 50,
    light : 30,
  },
  "spd" : {
    heavy : 10,
    medium : 20,
    light : 30
  },
  "atk" : {
    melee : 10,
    ranged : 20,
    magic : 30
  },
  "def" : {
    melee : 30,
    ranged : 20,
    magic : 10
  }
}

const modifiers = {
  "hp" : {
    melee : 10,
    ranged : 0,
    magic: -10
  },
  "spd" : {
    melee : -5,
    ranged : 0,
    magic : 5
  },
  "atk" : {
    heavy : -5,
    medium : 0,
    light : 5,
  },
  "def" : {
    heavy: 5,
    medium: 0,
    light: -5
  }
}

module.exports.char = class {
  constructor(rateUps = [], ownerId) {
    //Implement rate up chances somehow
    var char = pickOne(chars);

    this.owner_id = ownerId;
    this.unit_name = char.name;
    this.original_owner = char.owner;
    this.armor_class = char.armor;
    this.combat_type = char.combat;

    //console.log(baseStats.atk);
    //console.log(baseStats.atk["magic"]);
    //console.log(baseStats.atk[char.combat]);
    // Rarity between 1 and 7
    // Basic / fine / masterwork / rare / exotic / ascended / legendary
    // Some function for modifying stats based on rarity
    var rarity = Math.floor((Math.random() * 7) + 1);
    var rarityModifier = rarity;
    this.rarity = rarity;
    this.lvl = 0;
    this.exp = 0;
    this.exp_remaining = 20 * Math.ceil(rarity / 25);
    this.atk = rarityModifier * (baseStats.atk[char.combat] + modifiers.atk[char.armor]);
    this.def = rarityModifier * (baseStats.def[char.combat] + modifiers.def[char.armor]);
    this.hp = rarityModifier * (baseStats.hp[char.armor] + modifiers.hp[char.combat]);
    this.spd = rarityModifier * (baseStats.spd[char.armor] + modifiers.spd[char.combat]);
  }
}