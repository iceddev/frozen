define([
  'lodash'
], function(_){

  'use strict';

  function scalePoints(points, scale){
    if(Array.isArray(points)){
      points = _.map(points, function(point){
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