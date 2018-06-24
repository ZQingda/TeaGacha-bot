

function getCombatIcon(type) {
  if (type == "ranged") {
    return "`🏹`";
  } else if (type == "melee") {
    return "`🔪`";
  } else {
    return "`✨`";
  }
}

function getArmorIcon(type) {
  if (type == "light") { // replace with case switch later lol
    return "`🛡`";
  } else if (type == "medium") {
    return "`🛡🛡`";
  } else {
    return "`🛡🛡🛡`";
  }
}

function getRankIcon(rank) {
  switch(rank) {
    case 1:
      return ":purple_heart:";
    case 2:
      return ":blue_heart:";
    case 3:
      return ":green_heart:";
    case 4:
      return ":yellow_heart:";
    case 5:
      return ":heart:";
    case 6:
      return ":heartpulse:";
    case 7:
      return "⭐";
  }
}

module.exports = {
  getCombatIcon : getCombatIcon,
  getArmorIcon : getArmorIcon,
  getRankIcon : getRankIcon
}
