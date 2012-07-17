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

/*********************** mwe.InputManager ********************************************/
define(['./GameAction', 'dojo/_base/declare', 'dojo/_base/connect', 'dojo/dom-geometry', 'dojo/domReady!'], function(GameAction, declare, connect, domGeom){

  return declare(null, {
    keyActions: [],
    mouseAction: null,
    touchAction: null,
    canvas: null,
    constructor: function(args){
      declare.safeMixin(this, args);
      // TODO: switch to dojo/on
      connect(document, 'onkeydown', this, this.keyPressed);
      connect(document, 'onkeyup', this, this.keyReleased);
      connect(this.canvas, 'onmousedown', this, this.mouseDown);
      connect(document, 'onmouseup', this, this.mouseUp);
      connect(this.canvas, 'onmousemove', this, this.mouseMove);

      connect(document, 'ontouchend', this, this.touchEnd);
      connect(this.canvas, 'ontouchstart', this, this.touchStart);
      connect(this.canvas, 'ontouchmove', this, this.touchMove);
    },
    /**
      Maps a GameAction to a specific key. The key codes are defined in java.awt.KeyEvent.
      If the key already has a GameAction mapped to it, the new GameAction overwrites it.
    */
    mapToKey: function(gameAction, keyCode) {
      if(!this.keyActions){
        this.keyActions = [];
      }
      this.keyActions[keyCode] = gameAction;
    },
    addKeyAction: function(keyCode, initialPressOnly){
      // TODO: Remove dependency on GameAction
      var ga = new GameAction();
      if(initialPressOnly){
        ga.behavior = ga.statics.DETECT_INITAL_PRESS_ONLY;
      }
      this.mapToKey(ga,keyCode);
    },
    setMouseAction: function(gameAction){
      this.mouseAction = gameAction;
    },
    setTouchAction: function(gameAction){
      this.touchAction = gameAction;
    },
    mouseUp: function(e) {
      this.mouseAction.release();
    },
    mouseDown: function(e){
      this.mouseAction.press();
    },
    mouseMove: function(e){
      this.mouseAction.move(e.clientX, e.clientY);
    },
    touchStart: function(e){
      this.touchAction.press();
    },
    touchEnd: function(e){
      this.touchAction.release();
    },
    touchMove: function(e){
      this.touchAction.move(e.clientX, e.clientY);
    },
    getKeyAction: function(e) {
      if (this.keyActions.length) {
        return this.keyActions[e.keyCode];
      } else {
        return null;
      }
    },
    keyPressed: function(e) {
      var gameAction = this.getKeyAction(e);
      if (gameAction && !gameAction.isPressed()) {
        gameAction.press();
      }
      // TODO: make sure the key isn't processed for anything else
    },
    keyReleased : function(e) {
      var gameAction = this.getKeyAction(e);
      if (gameAction !== null) {
        gameAction.release();
      }
      // TODO: make sure the key isn't processed for anything else
    },
    keyTyped: function(e) {
      // TODO: make sure the key isn't processed for anything else
    },
    /**
      Get the mouse pointer location within the canvas' coordinates, not the page's
    */
    getMouseLoc: function(evt){
      var coordsM = domGeom.getContentBox(this.canvas);
      return {
        x: Math.round(evt.clientX - coordsM.x),
        y: Math.round(evt.clientY - coordsM.y)
      };
    }
  });

});