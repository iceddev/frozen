define(function(){

  'use strict';

  var radConst = Math.PI / 180.0;

  return function(degrees){
    return degrees * radConst;
  };

});