const radiansToDegrees = require('./radiansToDegrees');
const radiansFromCenter = require('./radiansFromCenter');

function degreesFromCenter(center, pt){
  return radiansToDegrees(radiansFromCenter(center, pt));
}

module.exports = degreesFromCenter;
