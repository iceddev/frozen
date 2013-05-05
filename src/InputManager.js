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
    /**
     * Emulate mouse events when using touch
     * @type {Boolean}
     * @memberOf InputManager#
     * @default
     */
    emulateMouse: true,

    constructor: function(){
      _.bindAll(this);

      insideCanvas = _.partialRight(insideCanvas, this.canvas);

      var pushCleanup = this.pushCleanup;
      var h = hammer(document, {
        prevent_default: true,
        drag_max_touches: 0,
        // hold_timeout: 0
        hold: false
      });

      function cleanup(handler){
        handler.remove();
      }

      function hammerOff(args){
        h.off.apply(h, args);
      }

      function hammerOn(gesture, handler){
        var args = [gesture, handler];
        h.on.apply(h, args);
        pushCleanup(args, hammerOff);
      }

      if(this.handleKeys){
        this.pushCleanup(on(document, 'keydown', this.keyDown), cleanup);
        this.pushCleanup(on(document, 'keyup', this.keyReleased), cleanup);
      }

      if(this.emulateMouse){
        hammerOn('touch', this.mouseDown);
        hammerOn('drag', this.mouseMove);
        hammerOn('release', this.mouseUp);
        if(!this.mouseAction){
          this.mouseAction = new MouseAction();
        }
      } else {
        hammerOn('touch', this.touchStart);
        hammerOn('drag', this.touchMove);
        hammerOn('release', this.touchEnd);
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
      this.mouseAction.release(this.normalizePoint(e.gesture.touches[0]));
    },

    /**
     * Called upon mousedown event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    mouseDown: function(e){
      // Ensure mouse has been released
      this.mouseAction.release(null);
      var currentPoint = this.normalizePoint(e.gesture.touches[0]);
      this.mouseAction.insideCanvas = insideCanvas(currentPoint);
      // TODO: Not sure if we should be making this decision - investigate in regards to pool or minigolf
      // if(this.mouseAction.insideCanvas){
      //   this.mouseAction.press(currentPoint);
      // } else {
      //   this.mouseAction.startPosition = null;
      // }
      this.mouseAction.press(currentPoint);
    },

    /**
     * Called upon mousemove event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    mouseMove: function(e){
      this.mouseAction.position = this.normalizePoint(e.gesture.touches[0]);
    },

    /**
     * Called upon touchstart event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    touchStart: function(e){
      // Ensure touch has been released
      this.touchAction.release(null);
      var currentPoints = _.map(e.gesture.touches, this.normalizePoint);
      this.touchAction.insideCanvas = _.some(currentPoints, insideCanvas);
      // TODO: Not sure if we should be making this decision - investigate in regards to pool or minigolf
      // this.touchAction.insideCanvas = insideCanvas(currentPoint, this.canvas);
      // if(this.touchAction.insideCanvas){
      //   this.touchAction.press();
      //   this.touchAction.startPosition = currentPoint;
      //   this.touchAction.position = currentPoint;
      // } else {
      //   this.touchAction.startPosition = null;
      // }
      this.touchAction.press(currentPoints);
    },

    /**
     * Called upon touchend event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    touchEnd: function(e){
      var currentPoints = _.map(e.gesture.touches, this.normalizePoint);
      this.touchAction.release(currentPoints);
    },

    /**
     * Called upon touchmove event
     * @function
     * @memberOf InputManager#
     * @param  {Event} e Event object
     */
    touchMove: function(e){
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
