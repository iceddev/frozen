define([
  'frozen/shims/GetGamepads'
], function(){

  'use strict';
  var speed = 0.4;
  var turnAngle = Math.PI / 180 * 6;

  return function handleInput(im, millis){

    if(navigator.getGamepads){

      //poll the gamepage for values
      var gamePad = navigator.getGamepads()[0] || navigator.getGamepads()[1];

      if(gamePad){

        this.message = "Using: " + gamePad.id;

        if(gamePad.axes[0] > 0.5){
          //turn right
          this.box.setAngle('car', this.entities.car.angle + turnAngle);
        }else if(gamePad.axes[0] < -0.5){
          //turn left
          this.box.setAngle('car', this.entities.car.angle - turnAngle);
        }

        if(gamePad.buttons[0] > 0.5){
          //move foreward
          this.box.applyImpulse('car', this.entities.car.angle, speed);
        }else if(gamePad.buttons[1] > 0.5){
          //move in reverse
          this.box.applyImpulse('car', this.entities.car.angle - Math.PI, speed);
        }

      }else{
        this.message = "No gamepads detected";
      }
    }else{
      this.message = "Browser does not support game pads. Use arrow keys.";
    }
  };

});