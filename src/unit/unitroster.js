const config = require('../config');
var Units = require("./units");
var dbModUnit = require("../db/modUnits");

/**
 * Return true if the given Roster Slot # is valid
 */
function rosterSlotValid(number){
  if(isNaN(number) || number<=0 || number> config.rosterLength){
    return false;
  }
  return true;
}

/**
 * Remove the given unit from the roster.
 */
function removeRosterUnit(unitId){
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

  let currentRoster = await Units.getRoster(user.user_id);
  currentRoster.forEach(currentUnit => {
    let addingNewUnit = addUnits.filter(addItem=> addItem.unit_id==currentUnit.unit_id).length==0;
    if(rosterAdditionIndexes[currentUnit.roster]){
      removeUnits.push(currentUnit);
    }else if(addingNewUnit){
      unchangedUnits.push(currentUnit);
    }
  });
  
  let addedPoints = addUnits.reduce((total, u) => total + u.getPointValue(), 0 )
  let currentStaticPoints = unchangedUnits.reduce((total, u) => total + u.getPointValue(), 0 )
  let newRosterPoints = addedPoints + currentStaticPoints;

  
  if( newRosterPoints > user.roster_point_capacity){
    throw Error("Adding (these) units to your roster will exceed your max unit points by  " + (newRosterPoints - user.roster_point_capacity));
  }
  let removePromises =[];
  removeUnits.forEach(unitToRemove => 
    removePromises.push( removeRosterUnit(unitToRemove.unit_id) )
  );
  let output = await Promise.all(removePromises);

  let addPromises = []

  for(let [rosterSlot, unitToAdd] of Object.entries(rosterAdditionIndexes)){
    if(rosterSlotValid(rosterSlot)){
      await dbModUnit.modUnit(unitToAdd.unit_id, "roster", rosterSlot);
      unitToAdd.roster = rosterSlot; //Update the unit so we can return the accurate roster.
    }else{
      throw Error("Roster slot " + newRosterSlot + " is invalid. Must be a number between 1 and " + config.rosterLength);
    }
  }

  let newRoster = unchangedUnits.concat(addUnits);
  newRoster.sort((a,b) => a.roster-b.roster)
  return newRoster;
}


module.exports = {
  removeRosterUnit: removeRosterUnit,
  addToRoster: addToRoster,
  rosterSlotValid: rosterSlotValid
}