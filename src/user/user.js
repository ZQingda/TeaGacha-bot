var dbUser = require('../db/user');
var units = require("../unit/units");
var embeds = require("../messages/message");
var colours = require('../config').colours;

/**
 * Adds the user to the database and gives them 5 initial units.
 * Prints message of the user stats and the initial units setup.
 * Returns a promise after all units have been created.
 */
function setupUser(message) {
  const u = new User(message.author.id, {flowers:1000, energy:100});
  var promise = dbUser.insertUser(u)
  .then((retUser)=>embeds.printUser(message, parseInt(colours.normal), retUser))
  .then((retUser)=>{
    var unitPromises =[];
    for (var i = 0; i < 5; i++) {
      var curUnit = units[i];
      unitPromises.push(units.genOne(message.author.id));
    }
    return Promise.all(unitPromises);
  })
  .then(embeds.printSingle(message, parseInt(colours.normal), 'You have been registered and your initial units have been setup.'));

  return promise;
}

module.exports = {
  setupUser: setupUser
}

/**
 * User Object to be used in DB calls 
 * @param {number} userId 
 * @param {object} [defaults] - Defaults to 0
 */
var User = class {
  constructor(userId, defaults={}) {
    this.id = userId;
    this.flowers = defaults.flowers? defaults.flowers : 0;
    this.clovers = defaults.clovers? defaults.clovers : 0;
    this.energy = defaults.energy? defaults.energy : 0;
  }
}
