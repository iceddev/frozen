define([
  'dojo/_base/lang'
], function(lang){

  'use strict';

  var scalePoints = function(points, scale){
    if(lang.isArray(points)){
      var newPoints = [];
      points.forEach(function(point){
        newPoints.push(scalePoints(point, scale));
      });
      points = newPoints;
    }else{
      if (typeof scale === 'object'){
        points = {x: points.x * scale.x, y: points.y * scale.y};
      }else{
        points = {x: points.x * scale, y: points.y * scale};
      }
    }
    return points;
  };

  return scalePoints;

});