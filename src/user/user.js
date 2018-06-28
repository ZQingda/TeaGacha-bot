var dbUser = require('../db/user');
var dbGetUser = require('../db/getUser');

var units = require("../unit/units");
var embeds = require("../messages/message");
var colours = require('../config').colours;

/**
 * Adds the user to the database and gives them 5 initial units.
 * Prints message of the user stats and the initial units setup.
 * Returns a promise after all units have been created.
 */
function setupUser(message) {
  const u = new User({user_id:message.author.id, flowers:1000, energy:100});
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

function getUser(message){
  return dbGetUser.dbGetUserById(message.author.id)
  .then(data => {
    return new User(data);
  });
}

module.exports = {
  setupUser: setupUser,
  getUser: getUser
}

/**
 * User Object to be used in DB calls 
 * @param {object} [defaults] - Defaults to 0
 */
var User = class {
  constructor(defaults={}) {
    this.user_id = defaults.user_id? defaults.user_id : null;
    this.flower = defaults.flower? defaults.flower : 0;
    this.clovers = defaults.clovers? defaults.clovers : 0;
    this.energy = defaults.energy? defaults.energy : 0;
  }
}
