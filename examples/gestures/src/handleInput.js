define([
  'lodash/collections/forEach',
  'frozen/utils/degreesFromCenter',
  'frozen/utils/scalePoints'
], function(forEach, degreesFromCenter, scalePoints){

  'use strict';

  var speed = 10;
  var swipeSpeed = 100000;

  return function(im, millis){
    var box = this.box;
    if(im.mouseAction.isPressed()){
      var scaledPosition = scalePoints(im.mouseAction.position, 1 / box.scale);
      if(scaledPosition){
        forEach(this.creatures, function(creature){
          if(!creature.girl){
            box.applyForceDegrees(creature.id, degreesFromCenter(creature, scaledPosition), speed * millis / 100);
          }
        });
      }
    }

    if(im.gestureAction.swiped){
      forEach(this.creatures, function(creature){
        if(!creature.girl){
          box.applyForceDegrees(creature.id, im.gestureAction.degrees, swipeSpeed * millis / 100);
        }
      });
      im.gestureAction.swiped = false;
    }
  };

});
