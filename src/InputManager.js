/**
 * The InputManager handles DOM events for use in games.
 * @name InputManager
 * @class InputManager
 */

define([
  './GameAction',
  './MouseAction',
  './utils/insideCanvas',
  'dcl',
  'dcl/bases/Mixer',
  'dojo/has',
  'dojo/on',
  'dojo/dom-style',
  'dojo/dom-geometry',
  'dojo/_base/lang',
  'dojo/domReady!'
], function(GameAction, MouseAction, insideCanvas, dcl, Mixer, has, on, domStyle, domGeom, lang){

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

      if(this.handleMouse && !has('touch')){
        on(document, 'mousedown', lang.hitch(this, "mouseDown"));
        on(document, 'mousemove', lang.hitch(this, "mouseMove"));
        on(document, 'mouseup', lang.hitch(this, "mouseUp"));
      }

      if(this.handleTouch && has('touch')){
        on(document, 'touchstart', lang.hitch(this, "touchStart"));
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
      var currentPoint = this.getMouseLoc(e);
      this.mouseAction.endPosition = null;
      this.mouseAction.insideCanvas = insideCanvas(currentPoint, this.canvas);
      if(this.mouseAction.insideCanvas){
        this.mouseAction.press();
        this.mouseAction.startPosition = currentPoint;
        this.mouseAction.position = currentPoint;
      } else {
        this.mouseAction.startPosition = null;
      }
    },
    mouseMove: function(e){
      this.mouseAction.position = this.getMouseLoc(e);
    },
    touchStart: function(e){
      var currentPoint = this.getMouseLoc(e.changedTouches[0]);
      this.touchAction.endPosition = null;
      this.touchAction.insideCanvas = insideCanvas(currentPoint, this.canvas);
      if(this.touchAction.insideCanvas){
        this.touchAction.press();
        this.touchAction.startPosition = currentPoint;
        this.touchAction.position = currentPoint;
      } else {
        this.touchAction.startPosition = null;
      }
    },
    touchEnd: function(e){
      this.touchAction.release();
      this.touchAction.endPosition = this.getMouseLoc(e.changedTouches[0]);
    },
    touchMove: function(e){
      this.touchAction.position = this.getMouseLoc(e.changedTouches[0]);
      if(this.touchAction.startPosition){
        e.preventDefault();
      }
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
