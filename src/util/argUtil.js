
/**
 * takes in an array of stuff, then uses an n^2
 * loopdeeloop to check if they're all unique.
 * returns a boolean.
 * @param {*} numbers 
 */
function getUnique(numbers) {
  for (var i = 0; i < numbers.length; i++) { // really inefficient way
    for (var j = 0; j < numbers.length; j++) { // of checking for unique vals
      if (i == j) {
        continue;
      } else {
        if (numbers[i] == numbers[j]) {
          return false;
        }
      }
    }
  }
  return true;
}

module.exports = {
  getUnique: getUnique
}