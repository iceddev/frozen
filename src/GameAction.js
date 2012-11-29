/**

 Copyright 2011 Luis Montes

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

**/

/*********************** mwe.GameAction ********************************************/
define(['dojo/_base/declare'], function(declare){

  return declare(null, {
    name: null,
    behavior: 0,
    amount:  0,
    state: 0,
    statics: {
      /**
        Normal behavior. The isPressed() method returns true as long as the key is held down.
      */
      NORMAL: 0,
      /**
        Initial press behavior. The isPressed() method returns true only after the key is first pressed,
        and not again until the key is released and pressed again.
      */
      DETECT_INITAL_PRESS_ONLY: 1,

      STATE_RELEASED: 0,
      STATE_PRESSED: 1,
      STATE_WAITING_FOR_RELEASE: 2,
      STATE_MOVED: 3
    },
    /**
      Creates new game action.
    */
    constructor: function(args){
      declare.safeMixin(this, args);
      this.reset();
    },
    /**
      Gets the name of this GameAction.
    */
    getName: function() {
      return this.name;
    },
    /**
      Resets this GameAction so that it appears like it hasn't been pressed.
    */
    reset : function() {
      this.state = this.statics.STATE_RELEASED;
      this.amount = 0;
    },
    /**
      Taps this GameAction. Same as calling press() followed by release().
    */
    tap: function() {
      this.press();
      this.release();
    },
    /**
      Signals that the key was pressed.
    */
    press: function() {
      this.state = this.statics.STATE_PRESSED;
      if(this.behavior === this.statics.DETECT_INITAL_PRESS_ONLY){
        this.pressAmt(1);
      }
    },
    /**
      Signals that the key was pressed a specified number of times, or that the mouse move a specified distance.
    */
    pressAmt: function(amount) {
      if (this.state !== this.statics.STATE_WAITING_FOR_RELEASE) {
        this.amount += amount;
        this.state = this.statics.STATE_WAITING_FOR_RELEASE;
      }
    },
    /**
      Signals that the key was released
    */
    release: function() {
      this.state = this.statics.STATE_RELEASED;
    },

    /**
      Returns whether the key was pressed or not since last checked.
    */
    isPressed: function() {
      if(this.state === this.statics.STATE_PRESSED){
        return true;
      } else {
        return false;
      }
    },
    /**
      For keys, this is the number of times the key was pressed since it was last checked.
      For mouse movement, this is the distance moved.
    */
    getAmount: function() {
      var retVal = this.amount;
      if (retVal !== 0) {
        if (this.state === this.statics.STATE_RELEASED) {
          this.amount = 0;
        } else if (this.behavior === this.statics.DETECT_INITAL_PRESS_ONLY) {
          this.state = this.statics.STATE_WAITING_FOR_RELEASE;
          this.amount = 0;
        }
      }
      return retVal;
    }
  });

});