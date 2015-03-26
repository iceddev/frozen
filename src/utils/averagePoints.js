define([
  'lodash/collections/forEach'
], function(forEach){

  'use strict';

  function averagePoints(points){
    var retVal = {x: 0, y: 0};
    forEach(points, function(point){
      retVal.x+= point.x;
      retVal.y+= point.y;
    });
    retVal.x = retVal.x / points.length;
    retVal.y = retVal.y / points.length;
    return retVal;
  }

  return averagePoints;

});
