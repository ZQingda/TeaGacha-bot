var chars = require("./catalogue").characters;
var pullgroups = [1,2,3,4,5,6,7];
var rarities = [1,2,3,4,5,6,7];



// for everything but levelling/exp, the actual level being used
// is the floor
function getLvl(char) {
  console.log("Level: " + char.lvl);
  return Math.floor(parseFloat(char.lvl));
}

// returns the number of ranks
function getRankCount() {
  return rarities.length;
}

// returns the point cost of a unit
function getPointCost(char) {
  var ptc = chars[char.unit_name].pull_group/2;
  ptc *= char.rank;
}

// these getSTAT functions use the unit and other properties to
// determine the correct stat value
function getATK(name, level, rank, specialization) {
  var template_char = chars[name];
  var val = baseStats.atk[template_char.class];
  val += (rank/2) * baseStats.atk[template_char.class];
  val += statsPerLevel.atk[rank] * level;
  val *= template_char.atk_modifier;
  return Math.ceil(val);
}

// def is a bit of a special case because it scales off
// armor type rather than class
function getDEF(name, level, rank, specialization) {
  var template_char = chars[name];
  var val = baseStats.def[template_char.armor];
  val += (rank/2) * baseStats.def[template_char.armor];
  val += statsPerLevel.def[rank] * level;
  val *= template_char.def_modifier;
  return Math.ceil(val);
}

function getHP(name, level, rank, specialization) {
  var template_char = chars[name];
  var val = baseStats.hp[template_char.class];
  val += (rank/2) * baseStats.hp[template_char.class];
  val += statsPerLevel.hp[rank] * level;
  val *= template_char.hp_modifier;
  return Math.ceil(val);
}

function getSPD(name, level, rank, specialization) {
  var template_char = chars[name];
  var val = baseStats.spd[template_char.class];
  val += (rank/2) * baseStats.spd[template_char.class];
  val += statsPerLevel.spd[rank] * level;
  val *= template_char.spd_modifier;
  return Math.ceil(val);
}

function pickOne(groupnum) { // CJ's basic fcn for random dude
var filteredUnits = [];
var keys = Object.keys(chars)
for (var i = 0; i < keys.length; i++) {
  if (chars[keys[i]].pull_group == groupnum) {
    console.log(chars[keys[i]].name);
    filteredUnits.push(chars[keys[i]]);
  }
}
  var rng = Math.random();
  return filteredUnits[filteredUnits.length * Math.random() << 0];
}

// so to get the % chance within a range, we total
// the chance rates for each rank within range and use that
// as total chance. the % chance is then currentchance/totalchance
function getPullGroupChance(min, max, pg) {
  var total_chance = 0;
  if (pg >= min && pg <= max) {
    for (var i = max; i >= min; i--) {
      total_chance = Number(Number(total_chance) + Number(chanceRates.unit[i]));
    }
    console.log("Total chance: " + total_chance);
    console.log("INDIV rare: " + pg + " with min " + min + " and max " + max + " is " + Number(chanceRates.unit[pg]/total_chance));
    return Number(chanceRates.unit[pg]/total_chance);
  }
  return 0;
}

// follows similar logic to the pull rate shit go read that
function getPullGroupChanceNum(min, max, pg) {
  var val = 0;
  for (var i = 1; i <= pg; i++) {
    val += getPullGroupChance(min, max, i);
  }
  console.log("Pull rate for " + pg + " with min " + min + " and max " + max + " is " + val);
  return val;
}

function pullOneByPullGroup(min,max,chars) {
  var keys = Object.keys(chars);
  var rng = Math.random();
  for (var i = 1; i <= pullgroups.length; i++) {
    if (rng < getPullGroupChanceNum(min,max,i)) {
      console.log("Rolled a " + i + " pull group dude.");
      return pickOne(i);
    }
  }
   console.log("Impossibru. But we'll pretend it's a roll 1.");
   return pickOne(chars);
}

// need to sum up the chance of the current rarity with the`
// chances of the rarer rarities to get the actual
// RNG number for rolling this rarity
function getPullRateNum(num) {
  if (num > pullgroups[pullgroups.length]) {
    console.log("ERROR: Invalid Pullgroup Number");
    return 0;
  }
  var val = 0;
  for (var i = 1; i <= num; i++) {
   val = Number(val) + Number(chanceRates.unit[pullgroups[i-1]]);
  }
  return val;
}

// right now this just tells you what pull group it
// would've pulled from, should be the main pull in the future
function pullOne(chars) {
  var keys = Object.keys(chars);
  var rng = Math.random();
  for (var i = 1; i <= pullgroups.length; i++) {
    if (rng < getPullRateNum(i)) {
      console.log("Rolled a " + i + " pull group dude.");
      return pickOne(i);
    }
  }
   console.log("Impossibru. But we'll pretend it's a roll 1.");
   return pickOne(chars);
}

// so to get the % chance within a range, we total
// the chance rates for each rank within range and use that
// as total chance. the % chance is then currentchance/totalchance
function getRankChance(min, max, rank) {
  var total_chance = 0;
  if (rank >= min && rank <= max) {
    for (var i = max; i >= min; i--) {
      total_chance = Number(Number(total_chance) + Number(chanceRates.rarity[i]));
    }
    console.log("Total chance: " + total_chance);
    console.log("INDIV rare: " + rank + " with min " + min + " and max " + max + " is " + Number(chanceRates.rarity[rank]/total_chance));
    return Number(chanceRates.rarity[rank]/total_chance);
  }
  return 0;
}

// follows similar logic to the pull rate shit go read that
function getRankChanceNum(min, max, rank) {
  var val = 0;
  for (var i = 1; i <= rank; i++) {
    val += getRankChance(min, max, i);
  }
  console.log("Pull rate for " + rank + " with min " + min + " and max " + max + " is " + val);
  return val;
}

// given a unit, pulls a rank based on chanceRates
function getRank(name) {
  var min_rank = chars[name].min_rank;
  var max_rank = chars[name].max_rank;
  var rng = Math.random();
  console.log("RNG: " + rng)
  for (var i = 0; i < rarities.length; i++) {
    if (rng < getRankChanceNum(min_rank,max_rank,rarities[i])) {
      return i+1;
    }
  }
}

const rankInfo = {
  "name" : {
    1 : "Exclusive",
    2 : "Ultra Rare",
    3 : "Rare",
    4 : "Uncommon",
    5 : "Common",
    6 : "Very Common",
    7 : "Mule"
  }
}

const baseStats = {
  "hp" : {
    warrior : 1000,
    necromancer : 1000,
    revenant : 700,
    engineer : 700,
    ranger : 700,
    mesmer : 700,
    guardian : 500,
    thief : 500,
    elementalist : 500
  },
  "spd" : {
    warrior : 200,
    necromancer : 200,
    revenant : 400,
    engineer : 200,
    ranger : 300,
    mesmer : 500,
    guardian : 300,
    thief : 500,
    elementalist : 200
  },
  "atk" : {
    warrior : 250,
    necromancer : 200,
    revenant : 200,
    engineer : 225,
    ranger : 200,
    mesmer : 200,
    guardian : 250,
    thief : 300,
    elementalist : 350
  },
  "def" : {
    heavy : 30,
    medium : 20,
    light : 10
  }
}

const statsPerLevel = {
  "hp" : {
    1 : 50,
    2 : 60,
    3 : 70,
    4 : 80,
    5 : 90,
    6 : 100,
    7 : 125
  },
  "spd" : {
    1 : 20,
    2 : 25,
    3 : 30,
    4 : 35,
    5 : 40,
    6 : 45,
    7 : 55
  },
  "atk" : {
    1 : 20,
    2 : 25,
    3 : 30,
    4 : 35,
    5 : 40,
    6 : 45,
    7 : 55
  },
  "def" : {
    1 : 2,
    2 : 3,
    3 : 4,
    4 : 5,
    5 : 6,
    6 : 8,
    7 : 10
  }
}

const chanceRates = {
  "unit" : {
    1 : 0.005,
    2 : 0.015,
    3 : 0.03,
    4 : 0.1,
    5 : 0.2,
    6 : 0.3,
    7 : 0.35
  },
  "rarity" : {
    7 : 0.0,
    6 : 0.0,
    5 : 0.05,
    4 : 0.25,
    3 : 0.55,
    2 : 0.1,
    1 : 0.05
  }
}

class char {
  constructor(min_pg, max_pg, ownerId) {
    //Implement rate up chances somehow
    var char = pullOneByPullGroup(min_pg,max_pg,chars);

    this.owner_id = ownerId;
    this.unit_name = char.name;
    this.original_owner = char.owner;
    this.armor_class = char.armor;
    this.combat_type = char.combat;
    this.class = char.class;
    this.specialization = char.specialization;
    this.min_rank = char.min_rank;
    this.max_rank = char.max_rank;
    this.hp_modifier = char.hp_modifier;
    this.spd_modifier = char.spd_modifier;
    this.atk_modifier = char.atk_modifier;
    this.def_modifier = char.def_modifier;
    this.pull_group = char.pull_group;

    //console.log(baseStats.atk);
    //console.log(baseStats.atk["magic"]);
    //console.log(baseStats.atk[char.combat]);
    // Rarity between 1 and 7
    // Basic / fine / masterwork / rare / exotic / ascended / legendary
    // Some function for modifying stats based on rarity
    var rank = getRank(this.unit_name);
    this.rank = rank;
    this.lvl = 1;
    this.atk = getATK(this.unit_name,this.lvl,this.rank,this.specialization);
    this.def = getDEF(this.unit_name,this.lvl,this.rank,this.specialization);
    this.hp = getHP(this.unit_name,this.lvl,this.rank,this.specialization);
    this.spd = getSPD(this.unit_name,this.lvl,this.rank,this.specialization);
  }
}

module.exports = {
  getLvl : getLvl,
  getATK : getATK,
  getDEF : getDEF,
  getHP : getHP,
  getSPD : getSPD,
  char : char,
  getRankCount : getRankCount,
  rankInfo : rankInfo
}
