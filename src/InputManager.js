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

 /**
 * The InputManager handles DOM events for use in games.
 * @name InputManager
 * @class InputManager
 */
define([
  './GameAction',
  './MouseAction',
  'dcl',
  'dcl/bases/Mixer',
  'dojo/on',
  'dojo/dom-style',
  'dojo/dom-geometry',
  'dojo/_base/lang',
  'dojo/domReady!'
], function(GameAction, MouseAction, dcl, Mixer, on, domStyle, domGeom, lang){

  'use strict';

  return dcl(Mixer, {
    keyActions: [],
    mouseAction: null,
    touchAction: null,
    canvas: null,
    handleMouse: true,
    handleTouch: true,
    handleKeys: true,
    gameArea: null,
    canvasPercentage: null,
    constructor: function(){
      if(this.handleKeys){
        on(document, 'keydown', lang.hitch(this, "keyDown"));
        on(document, 'keyup', lang.hitch(this, "keyReleased"));
      }

      if(this.handleMouse){
        on(this.canvas, 'mousedown', lang.hitch(this, "mouseDown"));
        on(document, 'mousemove', lang.hitch(this, "mouseMove"));
        on(document, 'mouseup', lang.hitch(this, "mouseUp"));
      }

      if(this.handleTouch){
        on(this.canvas, 'touchstart', lang.hitch(this, "touchStart"));
        on(document, 'touchmove', lang.hitch(this, "touchMove"));
        on(document, 'touchend', lang.hitch(this, "touchEnd"));
      }

      if(!this.mouseAction){
        this.mouseAction = new MouseAction();
      }

      if(!this.touchAction){
        this.touchAction = new MouseAction();
      }

      if(this.gameArea && this.canvasPercentage){
        on(window, 'resize', lang.hitch(this, "resize"));
        on(window, 'orientationchange', lang.hitch(this, "resize"));
      }
    },

    /**
      * Maps a GameAction to a specific key. The key codes are defined in dojo.keys.
      * If the key already has a GameAction mapped to it, the new GameAction overwrites it.
      * @name InputManager#mapToKey
      * @function
      * @param {GameAction} gameAction the GameAction to map
      * @param {Object} keyCode dojo.keys key code, or character
      *
    */
    mapToKey: function(gameAction, keyCode) {
      if(!this.keyActions){
        this.keyActions = [];
      }
      this.keyActions[keyCode] = gameAction;
    },

    /**
      * Adds a GameAction to a key
      * @name InputManager#addKeyAction
      * @function
      * @param {Object} keyCode dojo.keys key code, or character
      * @param {Boolean=} initialPressOnly do only one fire of the action per keypress
      *
    */
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
      e.preventDefault();
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

    getMouseLoc: function(evt){
      var coordsM = domGeom.position(this.canvas);
      if(this.zoomRatio){
        return {
          x: Math.round((evt.clientX - coordsM.x) / this.zoomRatio),
          y: Math.round((evt.clientY - coordsM.y) / this.zoomRatio)
        };
      }else{
        return {
          x: Math.round(evt.clientX - coordsM.x),
          y: Math.round(evt.clientY - coordsM.y)
        };
      }
    },

    resize: function(){
      if(this.gameArea && this.canvasPercentage && this.canvas){
        var canvasWidth = this.canvas.width;
        var canvasHeight = this.canvas.height;

        var bodyMargins = domGeom.getMarginExtents(document.body);

        var newWidth = window.innerWidth - bodyMargins.w;
        var newHeight = window.innerHeight - bodyMargins.h;

        var widthToHeight = canvasWidth / canvasHeight;
        var newWidthToHeight = newWidth / newHeight;

        var newWidthStyle = '';
        var newHeightStyle = '';
        if (newWidthToHeight > widthToHeight) {
          newWidth = newHeight * widthToHeight;
          newWidthStyle = newWidth + 'px';
        } else {
          newHeightStyle = Math.round(newWidth / widthToHeight) + 'px';
        }

        this.zoomRatio = newWidth / canvasWidth * this.canvasPercentage;

        domStyle.set(this.gameArea, {
          width: newWidthStyle,
          height: newHeightStyle
        });

        var canvasPercentageStyle = Math.floor(this.canvasPercentage * 100) + '%';
        domStyle.set(this.canvas, {
          width: canvasPercentageStyle,
          height: canvasPercentageStyle,
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto'
        });
      }
    }
  });

});
