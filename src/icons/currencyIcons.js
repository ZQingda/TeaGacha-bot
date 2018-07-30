function getCurrencyIcon(currency) {
  var icon = "";
  switch (currency) {
    case "gems":
      icon = "💎";
      break;
    case "flowers":
      icon = "🌸";
      break;
    case "clovers":
      icon = "🍀";
      break;
  }
  return icon;
}

module.exports = {
  getCurrencyIcon: getCurrencyIcon
}
