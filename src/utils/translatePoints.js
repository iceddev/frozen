/*jshint eqnull:true */
define([
  'lodash'
], function(_){

  'use strict';

  function translatePoints(points, translation){
    if(Array.isArray(points)){
      points = _.map(points, function(point){
        return translatePoints(point, translation);
      });
    } else {
      points = {
        x: points.x,
        y: points.y
      };

      if(translation.x != null){
        points.x += translation.x;
      }

      if(translation.y != null){
        points.y += translation.y;
      }
    }
    return points;
  }

  return translatePoints;

});