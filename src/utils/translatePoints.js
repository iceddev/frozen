define([
  'dojo/_base/lang'
], function(lang){

  'use strict';

  var translatePoints = function(points, translation){
    if(lang.isArray(points)){
      var newPoints = [];
      points.forEach(function(point){
        newPoints.push(translatePoints(point, translation));
      });
      points = newPoints;
    }else{
      points = {x: points.x, y: points.y};

      if(translation.hasOwnProperty('x')){
        points.x+= translation.x;
      }

      if(translation.hasOwnProperty('y')){
        points.y+= translation.y;
      }

    }
    return points;
  };

  return translatePoints;

});