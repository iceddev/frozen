'use strict';

var radConst = Math.PI / 180.0;

function degreesToRadians(degrees){
  return degrees * radConst;
}

module.exports = degreesToRadians;
