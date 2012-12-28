define([
  'dojo/_base/array',
  'dojo/_base/lang'
], function(array, lang){

  'use strict';

  var scalePoints = function(points, scale){
    if(lang.isArray(points)){
      array.forEach(points, function(point){
        scalePoints(point, scale);
      });
    }else{
      points.x = points.x * scale;
      points.y = points.y * scale;
    }
    return points;
  };

  return scalePoints;

});