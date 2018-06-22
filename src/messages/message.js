var pad = require('pad-left');

module.exports.printSingle = function(message, colour, text) {
  var msg = {
    embed : {
      color : colour,
      description : text
    }
  }
  message.channel.send(msg);
}

module.exports.printUnits = function(message, colour, units, curPage, totalPages) {
  var msg = {
    embed : {
      color: colour,
      title: message.author.username + "'s units, page " + curPage + " of " + totalPages

    }
  }
}

module.exports.printCurrency = function(message, colour, currency, curValue) {
  var msg = {
    embed : {
      color : colour,
      description : message.author.username + ' has ' + curValue + ' ' + currency
    }
  }
  message.channel.send(msg);
}