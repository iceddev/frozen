define([
  'dojo/_base/array',
  'dojo/_base/lang'
], function(array, lang){

  'use strict';

  var translatePoints = function(points, translation){
    if(lang.isArray(points)){
      array.forEach(points, function(point){
        translatePoints(point, translation);
      });
    }else{
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