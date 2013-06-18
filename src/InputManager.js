/**
 * The InputManager handles DOM events for use in games.
 * @name InputManager
 * @constructor InputManager
 */

define([
  './GameAction',
  './MouseAction',
  './TouchAction',
  './utils/insideCanvas',
  'dcl',
  'dcl/bases/Mixer',
  'dcl/mixins/Cleanup',
  'dojo/has',
  'dojo/on',
  'lodash',
  'hammer',
  'dojo/domReady!'
], function(GameAction, MouseAction, TouchAction, insideCanvas, dcl, Mixer, Cleanup, has, on, _, hammer){

  'use strict';

  function position(node){
    var boundingRect = node.getBoundingClientRect();
    return {
      x: boundingRect.left,
      y: boundingRect.top
    };
  }

  function getComputedStyle(node){
    return window.getComputedStyle(node, null) || {};
  }

  function toPixel(value){
    return parseFloat(value) || 0;
  }

  function getMarginExtents(node){
    var style = getComputedStyle(node);
    var l = toPixel(style.marginLeft);
    var t = toPixel(style.marginTop);
    var r = toPixel(style.marginRight);
    var b = toPixel(style.marginBottom);
    return {
      w: l + r,
      h: t + b
    };
  }

  return dcl([Mixer, Cleanup], {
    /**
     * Object of keyActions being listened for
     * @type {Array}
     * @memberOf InputManager#
     * @default
     */
    keyActions: null,
    /**
     * The MouseAction to keep track of the mouse's state
     * @type {MouseAction}
     * @memberOf InputManager#
     * @default
     */
    mouseAction: null,
    /**
     * The TouchAction to keep track of touch events
     * @type {TouchAction}
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
     * @deprecated Mouse is always handled, use emulateMouse to specify how to handle it
     */
    handleMouse: true,
    /**
     * Whether or not to listen for touch events
     * @type {Boolean}
     * @memberOf InputManager#
     * @default
     * @deprecated Touch is always handled, use emulateMouse to specify how to handle it
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
    /**
     * Emulate mouse events when using touch
     * @type {Boolean}
     * @memberOf InputManager#
     * @default
     */
    emulateMouse: true,

    /**
     * Instance of Hammer.js - You can pass in a Hammer() constructor with options to customize your Hammer instance
     * @type {Object}
     * @memberOf InputManager#
     * @default Hammer instance, bound to document, with prevent_default: true, drag_max_touches: 0, and hold: false
     */
    hammer: null,

    /**
     * Allows you to bind other Hammer.js events (such as Swipe or Doubletap);
     * Warning: Only set flags or variables in this handler, otherwise your game might become slow
     * @function
     * @memberOf InputManager#
     * @param  {String} gesture The gesture to bind
     * @param  {Function} handler Event handler callback
     * @return {Object} Object containing the remove function for removing the event.
     */
    on: function(gesture, handler){
      var hammer = this.hammer;
      var removeCleanup = this.removeCleanup;

      hammer.on(gesture, handler);
      var cleanup = this.pushCleanup([gesture, handler], function(args){
        hammer.off.apply(hammer, args);
      });

      return {
        remove: function(){
          removeCleanup(cleanup);
          cleanup();
        }
      };
    },

    constructor: function(){
      _.bindAll(this);

      if(!this.hammer){
        this.hammer = hammer(document, {
          prevent_default: true,
          drag_max_touches: 0,
          // Hold uses setTimeout which is very bad for performance
          // TODO: Do we want to allow this to be overridden?
          hold: false
        });
      }

      if(!this.keyActions){
        this.keyActions = {};
      }

      function cleanup(handler){
        handler.remove();
      }

      if(this.handleKeys){
        this.pushCleanup(on(document, 'keydown', this.keydown), cleanup);
        this.pushCleanup(on(document, 'keyup', this.keyup), cleanup);
      }

      if(this.emulateMouse){
        this.on('touch', this.mousedown);
        this.on('drag', this.mousemove);
        this.on('release', this.mouseup);
        if(!this.mouseAction){
          this.mouseAction = new MouseAction();
        }
      } else {
        this.on('touch', this.touchstart);
        this.on('drag', this.touchmove);
        this.on('release', this.touchend);
        if(!this.touchAction){
          this.touchAction = new TouchAction();
        }
      }

      if(this.gameArea && this.canvasPercentage){
        this.pushCleanup(on(window, 'resize', this.resize), cleanup);
        this.pushCleanup(on(window, 'orientationchange', this.resize), cleanup);
      }
    },

    /**
     * Determine whether a point is within the InputManager's canvas
     * @function
     * @memberOf InputManager#
     * @param  {Point} point Point to test
     * @return {Boolean} Whether or not the point is inside this InputManager's canvas
     */
    insideCanvas: function(point){
      return insideCanvas(point, this.canvas);
    },

    /**
     * Maps a GameAction to a specific key. The key codes are defined in dojo.keys.
     * If the key already has a GameAction mapped to it, the new GameAction overwrites it.
     * @function
     * @memberOf InputManager#
     * @param {GameAction} gameAction the GameAction to map
     * @param {Object} keyCode dojo.keys key code, or character
     */
    mapToKey: function(gameAction, keyCode){
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
     * @deprecated Use the lowercase name instead - same syntax as normal event handling
     */
    mouseUp: function(e) {
      this.mouseup(e);
    },

    /**
     * Called upon mouseup event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    mouseup: function(e){
      this.mouseAction.release(this.normalizePoint(e.gesture.touches[0]));
    },

    /**
     * Called upon mousedown event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     * @deprecated Use the lowercase name instead - same syntax as normal event handling
     */
    mouseDown: function(e){
      this.mousedown(e);
    },

    /**
     * Called upon mousedown event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    mousedown: function(e){
      // Ensure mouse has been released
      this.mouseAction.release(null);
      var currentPoint = this.normalizePoint(e.gesture.touches[0]);
      this.mouseAction.insideCanvas = this.insideCanvas(currentPoint);
      this.mouseAction.press(currentPoint);
    },

    /**
     * Called upon mousemove event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     * @deprecated Use the lowercase name instead - same syntax as normal event handling
     */
    mouseMove: function(e){
      this.mousemove(e);
    },

    /**
     * Called upon mousemove event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    mousemove: function(e){
      var evt = e.gesture ? e.gesture.touches[0] : e;
      this.mouseAction.position = this.normalizePoint(evt);
    },

    /**
     * Called upon touchstart event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     * @deprecated Use the lowercase name instead - same syntax as normal event handling
     */
    touchStart: function(e){
      this.touchstart(e);
    },

    /**
     * Called upon touchstart event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    touchstart: function(e){
      // Ensure touch has been released
      this.touchAction.release(null);
      var currentPoints = _.map(e.gesture.touches, this.normalizePoint);
      this.touchAction.insideCanvas = _.some(currentPoints, this.insideCanvas);
      this.touchAction.press(currentPoints);
    },

    /**
     * Called upon touchend event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     * @deprecated Use the lowercase name instead - same syntax as normal event handling
     */
    touchEnd: function(e){
      this.touchend(e);
    },

    /**
     * Called upon touchend event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    touchend: function(e){
      var currentPoints = _.map(e.gesture.touches, this.normalizePoint);
      this.touchAction.release(currentPoints);
    },

    /**
     * Called upon touchmove event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     * @deprecated Use the lowercase name instead - same syntax as normal event handling
     */
    touchMove: function(e){
      this.touchmove(e);
    },

    /**
     * Called upon touchmove event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    touchmove: function(e){
      var currentPoints = _.map(e.gesture.touches, this.normalizePoint);
      this.touchAction.positions = currentPoints;
      if(this.touchAction.startPositions){
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
      if (this.keyActions) {
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
     * @deprecated Use keydown instead - same syntax as normal event handling
     */
    keyPressed: function(e) {
      this.keydown(e);
    },

    /**
     * Called upon keydown event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     * @deprecated Use the lowercase name instead - same syntax as normal event handling
     */
    keyDown: function(e){
      this.keydown(e);
    },

    /**
     * Called upon keydown event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    keydown: function(e) {
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
     * @deprecated Use keyup instead - same syntax as normal event handling
     */
    keyReleased: function(e){
      this.keyup(e);
    },

    /**
     * Called upon keyup event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    keyup: function(e) {
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
     * @deprecated Deprecated in favor of normalizePoint function (Same functionality, different name)
     */
    getMouseLoc: function(evt){
      return this.normalizePoint(evt);
    },

    /**
     * Used to get a normalized point out of an Event object
     * @function
     * @memberOf InputManager#
     * @param  {Event} evt Event object
     * @return {Point} Normalized point
     */
    normalizePoint: function(evt){
      var coordsM = position(this.canvas);
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

        var bodyMargins = getMarginExtents(document.body);

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

        this.gameArea.style.width = newWidthStyle;
        this.gameArea.style.height = newHeightStyle;

        var canvasPercentageStyle = Math.floor(this.canvasPercentage * 100) + '%';
        this.canvas.style.width = canvasPercentageStyle;
        this.canvas.style.height = canvasPercentageStyle;
        this.canvas.style.display = 'block';
        this.canvas.style.marginLeft = 'auto';
        this.canvas.style.marginRight = 'auto';
      }
    }
  });

});
