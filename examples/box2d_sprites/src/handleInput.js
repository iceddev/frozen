define([
  'frozen/utils/degreesFromCenter',
  'frozen/utils/scalePoints'
], function(degreesFromCenter, scalePoints){

  'use strict';

  var i;
  var speed = 10;

  return function(im, millis){
    if(im.mouseAction.isPressed()){
      var scaledPosition = scalePoints(im.mouseAction.position, 1 / this.box.scale);
      if(scaledPosition){
        for (i = 0; i < this.creatures.length; i++) {
          if(this.creatures[i].id === 'girl'){
            this.box.applyForceDegrees(this.creatures[i].id, degreesFromCenter(scaledPosition, this.creatures[i]), speed * millis / 50);
          } else {
            this.box.applyForceDegrees(this.creatures[i].id, degreesFromCenter(this.creatures[i], scaledPosition), speed * millis / 100);
          }
        }
      }
    }
  };

});