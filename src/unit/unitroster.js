const config = require('../config');
var char = require("./template").char;
var dbGetUnit = require("../db/getUnits");
var dbModUnit = require("../db/modUnits");

function getRoster(userId){
  return dbGetUnit.dbGetRoster(userId)
  .then(function (results) {
    let units = [];
    if(results!=null){
      results.forEach(unit => 
        units.push(new char(unit))
      );
    }
    return units;
  });
}

function removeFromRoster(unitId){
  return dbModUnit.modUnit(unitId, "roster", -1);
}

/**
 * returns the new Roster after all changes are saved.
 * @param {*} user 
 * @param {int, unit} rosterAdditionIndexes  -  roster position and the unit which needs to be added ot that position.
 */
async function addToRoster(user, rosterAdditionIndexes){
  const addUnits = Object.values(rosterAdditionIndexes);
  let removeUnits = [];
  let unchangedUnits = [];

  let currentRoster = await getRoster(user.user_id);
  currentRoster.forEach(currentUnit => {
    let addingNewUnit = addUnits.filter(addItem=> addItem.unit_id==currentUnit.unit_id).length==0;
    if(rosterAdditionIndexes[currentUnit.roster]){
      removeUnits.push(currentUnit);
    }else if(addingNewUnit){
      unchangedUnits.push(currentUnit);
    }
  });
  
  let addedPoints = addUnits.reduce((total, unit) => total + unit.getPointValue(), 0 )
  let currentStaticPoints = unchangedUnits.reduce((total, unit) => total + unit.getPointValue(), 0 )
  let newRosterPoints = addedPoints + currentStaticPoints;

  
  if( newRosterPoints > user.roster_point_capacity){
    throw Error("Adding (these) units to your roster will exceed your max unit points by  " + (newRosterPoints - user.roster_point_capacity));
  }
  let removePromises =[];
  removeUnits.forEach(unitToRemove => 
    removePromises.push( removeFromRoster(unitToRemove.unit_id) )
  );
  let output = await Promise.all(removePromises);

  let addPromises = []

  for(let [rosterNumber, unitToAdd] of Object.entries(rosterAdditionIndexes)){
    await dbModUnit.modUnit(unitToAdd.unit_id, "roster", rosterNumber);
    unitToAdd.roster = rosterNumber; //Update the unit so we can return the accurate roster.
  }

  let newRoster = unchangedUnits.concat(addUnits);
  newRoster.sort((a,b) => a.roster-b.roster)
  return newRoster;
}


module.exports = {
  getRoster: getRoster,
  removeFromRoster: removeFromRoster,
  addToRoster: addToRoster,
}