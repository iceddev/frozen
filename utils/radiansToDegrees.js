'use strict';

const degConst = 180.0 / Math.PI;

function radiansToDegrees(radians){
  return radians * degConst;
}

module.exports = radiansToDegrees;
