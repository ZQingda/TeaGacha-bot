

function getCombatIcon(type) {
  if (type == "ranged") {
    return "`🏹`";
  } else if (type == "melee") {
    return "`🔪`";
  } else {
    return "`✨`";
  }
}
function getIconCombatType(icon) {
  if (icon == "`🏹`" || icon == "🏹") {
    return  "ranged";
  } else if (icon == "`🔪`" || icon == "🗡️" || icon == "🗡") {
    return "melee";
  } else if (icon == "`✨`" || icon == "✨"){
    return "magic";
  } else {
    return undefined;
  }
}


function getArmorIcon(type) {
  if (type == "light") {
    return "🔸";
  } else if (type == "medium") {
    return "🔸🔸";
  } else {
    return "🔸🔸🔸";
  }
}
function getIconArmorType(icon) {
  if (icon == "🔸🔸🔸") {
    return "heavy";
  } else if (icon == "🔸🔸") {
    return "medium";
  } else if (icon == "🔸") {
    return "light";
  } else {
    return undefined;
  }
}

function getRankIcon(rank) {
  switch(rank) {
    case 1:
      return "💜";
    case 2:
      return "💙";
    case 3:
      return "💚";
    case 4:
      return "💛";
    case 5:
      return "❤️";
    case 6:
      return "💗";
    case 7:
      return "⭐";
  }
}
function getIconRankType(icon) {
  switch(icon) {
    case "💜":
      return 1;
    case "💙":
      return 2;
    case "💚":
      return 3;
    case "💛":
      return 4;
    case "❤️":
    case "❤":
      return 5;
    case "💗":
      return 6;
    case "⭐":
      return 7;
    default:
      return undefined;
  }
}

module.exports = {
  getCombatIcon : getCombatIcon,
  getIconCombatType : getIconCombatType,
  getArmorIcon : getArmorIcon,
  getIconArmorType : getIconArmorType,
  getRankIcon : getRankIcon,
  getIconRankType : getIconRankType
}
