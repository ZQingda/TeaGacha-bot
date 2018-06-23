

function getCombatIcon(type) {
  if (type == "ranged") {
    return "🏹";
  } else if (type == "melee") {
    return "🔪";
  } else {
    return "✨";
  }
}

function getArmorIcon(type) {
  if (type == "light") { // replace with case switch later lol
    return "🛡️";
  } else if (type == "medium") {
    return "🛡️🛡️";
  } else {
    return "🛡️🛡️🛡️";
  }
}

function getRankIcon(rank) {
  switch(rank) {
    case 1:
      return "🔸";
    case 2:
      return "🔸🔸";
    case 3:
      return "🔸🔸🔸";
    case 4:
      return "🔸🔸🔸🔸";
    case 5:
      return "🔸🔸🔸🔸🔸";
    case 6:
      return "⭐";
    case 7:
      return "⭐⭐";
  }
}

module.exports = {
  getCombatIcon : getCombatIcon,
  getArmorIcon : getArmorIcon,
  getRankIcon : getRankIcon
}
