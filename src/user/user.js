var dbUser = require('../db/user');

/**
 * Adds the 
 * @param {number} userId 
 */
function setupUser(userId) {
  const u = new User(userId, {flowers:1000, energy:100});
  var promise = dbUser.insertUser(u);
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
