define([
  './radiansToDegrees',
  './radiansFromCenter'
], function(radiansToDegrees, radiansFromCenter){

  'use strict';

  return function(center, pt){
    return radiansToDegrees(radiansFromCenter(center, pt));
  };

});