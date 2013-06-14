define([
  'lodash',
  'frozen/utils/degreesFromCenter',
  'frozen/utils/scalePoints'
], function(_, degreesFromCenter, scalePoints){

  'use strict';

  var speed = 10;

  return function(im, millis){
    var box = this.box;
    if(im.mouseAction.isPressed()){
      var scaledPosition = scalePoints(im.mouseAction.position, 1 / box.scale);
      if(scaledPosition){
        _.forEach(this.creatures, function(creature){
          if(creature.girl){
            box.applyForceDegrees(creature.id, degreesFromCenter(scaledPosition, creature), speed * millis / 50);
          } else {
            box.applyForceDegrees(creature.id, degreesFromCenter(creature, scaledPosition), speed * millis / 100);
          }
        });
      }
    }
  };

});