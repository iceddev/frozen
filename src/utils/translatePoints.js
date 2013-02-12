/*jshint eqnull:true */
define(function(){

  'use strict';

  function translatePoints(points, translation){
    if(Array.isArray(points)){
      var newPoints = [];
      // TODO: move this to a faster forEach, possibly lo-dash's
      points.forEach(function(point){
        newPoints.push(translatePoints(point, translation));
      });
      points = newPoints;
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