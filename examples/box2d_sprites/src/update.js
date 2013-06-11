define(function(){

  'use strict';

  return function(millis){
    for (var i = 0; i < this.drawables.length; i++) {
      if(this.drawables[i].updateAnimations){
        this.drawables[i].updateAnimations(millis);
      }
    }
  };

});