define(function(){

  'use strict';

  return function(im){
    im.gestureAction = {
      swiped: false,
      degrees: 0
    };
    im.on('swipe', function(e){
      im.gestureAction.swiped = true;
      im.gestureAction.degrees = e.gesture.angle + 90;
    });
  };

});