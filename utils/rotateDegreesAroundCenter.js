const rotateRadiansAroundCenter = require('./rotateRadiansAroundCenter');
const degreesToRadians = require('./degreesToRadians'); 

function rotateDegreesAroundCenter(center, pt, angle) {
  return rotateRadiansAroundCenter(center, pt, degreesToRadians(angle));
}

module.exports = rotateDegreesAroundCenter;