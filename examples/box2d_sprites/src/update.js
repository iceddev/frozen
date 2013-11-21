define([
  'lodash/collections/forEach',
], function(forEach){

  'use strict';

  return function(millis){
    forEach(this.drawables, function(drawable){
      if(drawable.updateAnimations){
        drawable.updateAnimations(millis);
      }
    });
  };

});
