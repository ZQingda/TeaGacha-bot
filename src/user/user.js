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
      unit_capacity: 20
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
    return new User(data);
  });
}


function exists(user_id){
  return getUser(user_id)
  .catch((err)=>{
    return Promise.resolve(false);
  })
  .then(user =>{
    if(user.user_id==user_id){
      return Promise.resolve(true);
    }else{
      return Promise.resolve(false);
    }
  });
}

function getRemainingUnitCapacity(user_id){
  return getUser(user_id)
  .then(user =>{
    let remainingCap = user.unit_capacity - user.unit_count;
    return Promise.resolve(remainingCap);
  });
}

module.exports = {
  setupUser: setupUser,
  getUser: getUser,
  exists: exists,
  getRemainingUnitCapacity: getRemainingUnitCapacity,
  addUnitCapacity: addUnitCapacity
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
    this.unit_count = defaults.hasOwnProperty('unit_count')? defaults.unit_count : this.unit_capacity; //Defaults unit count to unit capacity
  }
}
