define([
  'frozen/utils/degreesFromCenter',
  'frozen/utils/scalePoints'
], function(degreesFromCenter, scalePoints){

  'use strict';

  var i;
  var speed = 100;
  var swipeSpeed = 100000;

  return function(im, millis){
    if(im.mouseAction.isPressed()){
      var scaledPosition = scalePoints(im.mouseAction.position, 1 / this.box.scale);
      if(scaledPosition){
        for (i = 0; i < this.creatures.length; i++) {
          if(!this.creatures[i].girl){
            this.box.applyForceDegrees(this.creatures[i].id, degreesFromCenter(this.creatures[i], scaledPosition), speed * millis / 100);
          }
        }
      }
    }

    if(im.gestureAction.swiped){
      for (i = 0; i < this.creatures.length; i++) {
        if(!this.creatures[i].girl){
          this.box.applyForceDegrees(this.creatures[i].id, im.gestureAction.degrees, swipeSpeed * millis / 100);
        }
      }
      im.gestureAction.swiped = false;
    }
  };

});