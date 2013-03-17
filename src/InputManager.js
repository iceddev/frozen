/**
 * The InputManager handles DOM events for use in games.
 * @name InputManager
 * @constructor InputManager
 */

define([
  './GameAction',
  './MouseAction',
  './utils/insideCanvas',
  'dcl',
  'dcl/bases/Mixer',
  'dcl/mixins/Cleanup',
  'dojo/has',
  'dojo/on',
  'dojo/dom-style',
  'dojo/dom-geometry',
  'dojo/_base/lang',
  'dojo/domReady!'
], function(GameAction, MouseAction, insideCanvas, dcl, Mixer, Cleanup, has, on, domStyle, domGeom, lang){

  'use strict';

  return dcl([Mixer, Cleanup], {
    /**
     * An array of keyActions being listened for
     * @type {Array}
     * @memberOf InputManager#
     * @default
     */
    keyActions: [],
    /**
     * The MouseAction to keep track of the mouse's state
     * @type {MouseAction}
     * @memberOf InputManager#
     * @default
     */
    mouseAction: null,
    /**
     * The MouseAction to keep track of touch events
     * @type {MouseAction}
     * @memberOf InputManager#
     * @default
     */
    touchAction: null,
    /**
     * The HTML5 canvas on which to listen for events
     * @type {Canvas}
     * @memberOf InputManager#
     * @default
     */
    canvas: null,
    /**
     * Whether or not to listen for mouse events
     * @type {Boolean}
     * @memberOf InputManager#
     * @default
     */
    handleMouse: true,
    /**
     * Whether or not to listen for touch events
     * @type {Boolean}
     * @memberOf InputManager#
     * @default
     */
    handleTouch: true,
    /**
     * Whether or not to listen for keyboard events
     * @type {Boolean}
     * @memberOf InputManager#
     * @default
     */
    handleKeys: true,
    /**
     * The DOM element that contains the game's canvas
     * @type {Element}
     * @memberOf InputManager#
     * @default
     */
    gameArea: null,
    /**
     * The percentage (0 to 1.0) of the height and width the canvas should use to fill in its container DOM element
     * @type {Number}
     * @memberOf InputManager#
     * @default
     */
    canvasPercentage: null,

    constructor: function(){
      function cleanup(handler){
        handler.remove();
      }

      if(this.handleKeys){
        this.pushCleanup(on(document, 'keydown', lang.hitch(this, "keyDown")), cleanup);
        this.pushCleanup(on(document, 'keyup', lang.hitch(this, "keyReleased")), cleanup);
      }

      if(this.handleMouse && !has('touch')){
        this.pushCleanup(on(document, 'mousedown', lang.hitch(this, "mouseDown")), cleanup);
        this.pushCleanup(on(document, 'mousemove', lang.hitch(this, "mouseMove")), cleanup);
        this.pushCleanup(on(document, 'mouseup', lang.hitch(this, "mouseUp")), cleanup);
      }

      if(this.handleTouch && has('touch')){
        this.pushCleanup(on(document, 'touchstart', lang.hitch(this, "touchStart")), cleanup);
        this.pushCleanup(on(document, 'touchmove', lang.hitch(this, "touchMove")), cleanup);
        this.pushCleanup(on(document, 'touchend', lang.hitch(this, "touchEnd")), cleanup);
      }

      if(!this.mouseAction){
        this.mouseAction = new MouseAction();
      }

      if(!this.touchAction){
        this.touchAction = new MouseAction();
      }

      if(this.gameArea && this.canvasPercentage){
        this.pushCleanup(on(window, 'resize', lang.hitch(this, "resize")), cleanup);
        this.pushCleanup(on(window, 'orientationchange', lang.hitch(this, "resize")), cleanup);
      }
    },

    /**
     * Maps a GameAction to a specific key. The key codes are defined in dojo.keys.
     * If the key already has a GameAction mapped to it, the new GameAction overwrites it.
     * @function
     * @memberOf InputManager#
     * @param {GameAction} gameAction the GameAction to map
     * @param {Object} keyCode dojo.keys key code, or character
     */
    mapToKey: function(gameAction, keyCode) {
      if(!this.keyActions){
        this.keyActions = [];
      }
      this.keyActions[keyCode] = gameAction;
    },

    /**
     * Adds a GameAction to a key
     * @function
     * @memberOf InputManager#
     * @param {Object} keyCode Key character or dojo/keys key code
     * @param {Boolean=} initialPressOnly Do only one fire of the action per keypress
     * @return {GameAction} GameAction that is mapped to keyCode
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

    /**
     * Called upon mouseup event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    mouseUp: function(e) {
      this.mouseAction.release();
      this.mouseAction.endPosition = this.getMouseLoc(e);
    },

    /**
     * Called upon mousedown event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
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

    /**
     * Called upon mousemove event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    mouseMove: function(e){
      this.mouseAction.position = this.getMouseLoc(e);
    },

    /**
     * Called upon touchstart event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
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

    /**
     * Called upon touchend event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    touchEnd: function(e){
      this.touchAction.release();
      this.touchAction.endPosition = this.getMouseLoc(e.changedTouches[0]);
    },

    /**
     * Called upon touchmove event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    touchMove: function(e){
      this.touchAction.position = this.getMouseLoc(e.changedTouches[0]);
      if(this.touchAction.startPosition){
        e.preventDefault();
      }
    },

    /**
     * Retrieves the GameAction associated with the keyCode on the event object
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     * @return {GameAction|null} The GameAction associated with the keyCode else null
     */
    getKeyAction: function(e) {
      if (this.keyActions.length) {
        return this.keyActions[e.keyCode] || this.keyActions[String.fromCharCode(e.keyCode)];
      } else {
        return null;
      }
    },

    /**
     * Called upon keypress event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    keyPressed: function(e) {
      var gameAction = this.getKeyAction(e);
      if (gameAction && !gameAction.isPressed()) {
        gameAction.press();
      }
    },

    /**
     * Called upon keydown event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    keyDown: function(e) {
      var gameAction = this.getKeyAction(e);
      if (gameAction && !gameAction.isPressed()) {
        gameAction.press();
      }
    },

    /**
     * Called upon keyup event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    keyReleased : function(e) {
      var gameAction = this.getKeyAction(e);
      if (gameAction) {
        gameAction.release();
      }
    },

    /**
     * Used to get a normalized point out of an Event object
     * @function
     * @memberOf InputManager#
     * @param  {Event} evt Event object
     * @return {Point} Normalized point
     */
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

    /**
     * Used to resize the canvas
     * @function
     * @memberOf InputManager#
     */
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
          newHeightStyle = newHeight + 'px';
        } else {
          newWidthStyle = newWidth + 'px';
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
