define(function(){

  'use strict';

  function scalePoints(points, scale){
    if(Array.isArray(points)){
      var newPoints = [];
      // TODO: move this to a faster forEach, possibly lo-dash's
      points.forEach(function(point){
        newPoints.push(scalePoints(point, scale));
      });
      points = newPoints;
    } else if(typeof scale === 'object'){
      points = {
        x: points.x * scale.x,
        y: points.y * scale.y
      };
    } else {
      points = {
        x: points.x * scale,
        y: points.y * scale
      };
    }
    return points;
  }

  return scalePoints;

});