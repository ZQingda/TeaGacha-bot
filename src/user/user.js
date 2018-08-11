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
  const u = new User({
    user_id:message.author.id,
      clovers: 50,
      energy:20,
      energy_max:20,
      unit_capacity: 20,
      roster_point_capacity: 25
  });
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


/**
 * Addes the given ammount to the given users current unit capacity.
 * @param {*} user_id
 * @param {*} addAmount
 */
function addUnitCapacity(user_id,addAmount) {
  return getUser(user_id)
  .then(function (user) {
    newCapacity = parseInt(user.unit_capacity) + parseInt(addAmount);
    return dbUser.modUnitCapacity(user_id,newCapacity);
  });
}


function getUser(user_id){
  return dbGetUser.dbGetUserById(user_id)
  .then(data => {
    if(data && data.user_id==user_id){
      return new User(data);
    }else{
      return Promise.reject("You are not registered for Gacha!");
    }
  });
}

function exists(user_id){
  return dbGetUser.dbGetUserById(user_id)
  .then(data => {
    if(data && data.user_id==user_id){
      return Promise.resolve(true);
    }else{
      return Promise.resolve(false);
    }
  });
}

// returns a promise that returns true or false depending on
// whether the unit indices are valid
function checkValidUnitIndexes(message, indexes) {
  console.log("id: " + message.author.id);
  var promise = new Promise(function(resolve) {
    resolve(getUser(message.author.id));
  })
  .then(function (usr) {
    console.log("id: " + usr.user_id);
    if (usr.user_id) {
      console.log("found usr");
      console.log("unit count: " + usr.unit_count);
      for (var i = 0; i < indexes.length; i++) {
        if (indexes[0] < 1 || indexes[0] > usr.unit_count) {
          embeds.printSingleError(message, "Invalid unit IDs (out of range).");
          return false;
        }
      }
    } else {
      embeds.printSingleError(message, "Cannot find user.");
      return false;
    }
    return true;
  });

  return promise;
}

module.exports = {
  setupUser: setupUser,
  getUser: getUser,
  exists: exists,
  addUnitCapacity: addUnitCapacity,
  checkValidUnitIndexes: checkValidUnitIndexes
}

/**
 * User Object to be used in DB calls
 * @param {object} [defaults] - values to assign to the instance
 */
var User = class {
  constructor(defaults={}) {
    this.user_id = defaults.hasOwnProperty('user_id')? defaults.user_id : null;
    this.gems = defaults.hasOwnProperty('gems')? defaults.gems : 0;
    this.clovers = defaults.hasOwnProperty('clovers')? defaults.clovers : 0;
    this.energy = defaults.hasOwnProperty('energy')? defaults.energy : 0;
    this.energy_max = defaults.hasOwnProperty('energy_max')? defaults.energy_max : 0;
    this.unit_capacity = defaults.hasOwnProperty('unit_capacity')? defaults.unit_capacity : 0;
    this.roster_point_capacity = defaults.hasOwnProperty('roster_point_capacity')? defaults.roster_point_capacity : 0;
    this.unit_count = defaults.hasOwnProperty('unit_count')? defaults.unit_count : this.unit_capacity; //Defaults unit count to unit capacity
  }
}
