var usr = require("../db/getUser");
var usrcurr = require("../db/user");
const maxPerWeek = 5; // max conversions per week

function getWeeklyConversions (userid) {
  let promise = usr.dbGetUserById(userid)
  .then(function(result) {
    return result.weeklyconversions;
  });
  return promise;
}

function addWeeklyConversion (userid, amount) {
  let weeklyConversions = getWeeklyConversions(userid)
  .then(function(convs) {
    return usrcurr.modWeeklyConversions(userid, convs + amount)
  });
  return weeklyConversions;
}

function resetWeeklyConversion(){
  return usrcurr.modAllWeeklyConversions(0);
}

module.exports = {
  getWeeklyConversions: getWeeklyConversions,
  addWeeklyConversion: addWeeklyConversion,
  maxPerWeek: maxPerWeek,
  resetWeeklyConversion: resetWeeklyConversion
}
