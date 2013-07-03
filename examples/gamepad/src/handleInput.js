define([
  'dojo/keys'
], function(keys){

  'use strict';
  var speed = 0.4;
  var turnAngle = Math.PI / 180 * 6;

  return function handleInput(im, millis){


    if(this.gamepadSupport){

      //poll the gamepage for values
      var gamePad = navigator.webkitGetGamepads()[0] || navigator.webkitGetGamepads()[1];


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



    // handle input using arrow keys

    if(im.keyActions[keys.LEFT_ARROW].isPressed()){
      this.box.setAngle('car', this.entities.car.angle - turnAngle);
    } else if(im.keyActions[keys.RIGHT_ARROW].isPressed()){
      this.box.setAngle('car', this.entities.car.angle + turnAngle);
    }

    if(im.keyActions[keys.UP_ARROW].isPressed()){
      this.box.applyImpulse('car', this.entities.car.angle, speed);
    }else if(im.keyActions[keys.DOWN_ARROW].isPressed()){
      this.box.applyImpulse('car', this.entities.car.angle - Math.PI, speed);
    }
  };

});