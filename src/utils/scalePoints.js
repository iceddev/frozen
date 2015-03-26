define([
  'lodash/collections/map'
], function(map){

  'use strict';

  function scalePoints(points, scale){
    if(Array.isArray(points)){
      points = map(points, function(point){
        return scalePoints(point, scale);
      });
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
