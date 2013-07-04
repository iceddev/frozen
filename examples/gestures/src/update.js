define([
  'lodash'
], function(_){

  'use strict';

  return function(millis){
    _.forEach(this.drawables, function(drawable){
      if(drawable.updateAnimations){
        drawable.updateAnimations(millis);
      }
    });
  };

});