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
define(['./GameAction', './MouseAction', 'dojo/_base/declare', 'dojo/on', 'dojo/dom-geometry', 'dojo/_base/lang', 'dojo/domReady!'],
  function(GameAction, MouseAction, declare, on, domGeom, lang){

  return declare(null, {
    keyActions: [],
    mouseAction: null,
    touchAction: null,
    canvas: null,
    handleMouse: true,
    handleTouch: true,
    handleKeys: true,
    constructor: function(args){
      declare.safeMixin(this, args);
      
      if(this.handleKeys){
        on(document, 'keydown', lang.hitch(this, "keyDown"));
        //on(document, 'keypress', lang.hitch(this, "keyPressed"));
        on(document, 'keyup', lang.hitch(this, "keyReleased"));
      }

      if(this.handleMouse){
        on(this.canvas, 'mousedown', lang.hitch(this, "mouseDown"));
        on(document, 'mouseup', lang.hitch(this, "mouseUp"));
        on(this.canvas, 'mousemove', lang.hitch(this, "mouseMove"));
      }

      if(this.handleTouch){
        on(document, 'touchend', lang.hitch(this, "touchEnd"));
        on(this.canvas, 'touchstart', lang.hitch(this, "touchStart"));
        on(this.canvas, 'touchmove', lang.hitch(this, "touchMove"));
      }

      if(!this.mouseAction){
        this.mouseAction = new MouseAction();
      }
      
      if(!this.touchAction){
        this.touchAction = new MouseAction();
      }
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

      return ga;
    },
    setMouseAction: function(gameAction){
      this.mouseAction = gameAction;
    },
    setTouchAction: function(gameAction){
      this.touchAction = gameAction;
    },
    mouseUp: function(e) {
      this.mouseAction.release();
      this.mouseAction.endPosition = this.getMouseLoc(e);
    },
    mouseDown: function(e){
      this.mouseAction.press();
      this.mouseAction.startPosition = this.getMouseLoc(e);
      this.mouseAction.position = this.mouseAction.startPosition;
    },
    mouseMove: function(e){
      this.mouseAction.position = this.getMouseLoc(e);
    },
    touchStart: function(e){
      this.touchAction.press();
      this.touchAction.startPosition = this.getMouseLoc(e.changedTouches[0]);
      this.touchAction.position = this.touchAction.startPosition;
    },
    touchEnd: function(e){
      this.touchAction.release();
      this.mouseAction.endPosition = this.getMouseLoc(e);
    },
    touchMove: function(e){
      this.touchAction.position = this.getMouseLoc(e.changedTouches[0]);
    },
    getKeyAction: function(e) {
      if (this.keyActions.length) {
        return this.keyActions[e.keyCode] || this.keyActions[String.fromCharCode(e.keyCode)];
      } else {
        return null;
      }
    },
    keyPressed: function(e) {
      var gameAction = this.getKeyAction(e);
      if (gameAction && !gameAction.isPressed()) {
        gameAction.press();
      }
    },
    keyDown: function(e) {
      var gameAction = this.getKeyAction(e);
      if (gameAction && !gameAction.isPressed()) {
        gameAction.press();
      }
    },
    keyReleased : function(e) {
      var gameAction = this.getKeyAction(e);
      if (gameAction) {
        gameAction.release();
      }
    },
    /**
      Get the mouse pointer location within the canvas' coordinates, not the page's
    */
    getMouseLoc: function(evt){
      var coordsM = domGeom.position(this.canvas);
      return {
        x: Math.round(evt.clientX - coordsM.x),
        y: Math.round(evt.clientY - coordsM.y)
      };
    }
  });

});
