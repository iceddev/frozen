/**
 * The InputManager handles DOM events for use in games.
 * @name InputManager
 * @constructor InputManager
 */

'use strict';

const _ = require('lodash');
const Hammer = require('hammerjs');

const GameAction = require('./GameAction');
const TouchAction = require('./TouchAction');
const MouseAction = require('./MouseAction');
const insideCanvas = require('./utils/insideCanvas');

const on = require('frozen-on');

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

class InputManager {
  constructor(options){
    options = options || {};

    /**
     * Object of keyActions being listened for
     * @type {Array}
     * @memberOf InputManager#
     * @default
     */
    this.keyActions = null;

    /**
     * The MouseAction to keep track of the mouse's state
     * @type {MouseAction}
     * @memberOf InputManager#
     * @default
     */
    this.mouseAction = null;

    /**
     * The TouchAction to keep track of touch events
     * @type {TouchAction}
     * @memberOf InputManager#
     * @default
     */
    this.touchAction = null;

    /**
     * The HTML5 canvas on which to listen for events
     * @type {Canvas}
     * @memberOf InputManager#
     * @default
     */
    this.canvas = null;

    /**
     * Whether or not to listen for mouse events
     * @type {Boolean}
     * @memberOf InputManager#
     * @default
     * @deprecated Mouse is always handled, use emulateMouse to specify how to handle it
     */
    this.handleMouse = true;

    /**
     * Whether or not to listen for touch events
     * @type {Boolean}
     * @memberOf InputManager#
     * @default
     * @deprecated Touch is always handled, use emulateMouse to specify how to handle it
     */
    this.handleTouch = true;

    /**
     * Whether or not to listen for keyboard events
     * @type {Boolean}
     * @memberOf InputManager#
     * @default
     */
    this.handleKeys = true;

    /**
     * The DOM element that contains the game's canvas
     * @type {Element}
     * @memberOf InputManager#
     * @default
     */
    this.gameArea = null;

    /**
     * The percentage (0 to 1.0) of the height and width the canvas should use to fill in its container DOM element
     * @type {Number}
     * @memberOf InputManager#
     * @default
     */
    this.canvasPercentage = null;

    /**
     * Emulate mouse events when using touch
     * @type {Boolean}
     * @memberOf InputManager#
     * @default
     */
    this.emulateMouse = true;

    /**
     * Instance of Hammer.js - You can pass in a Hammer() constructor with options to customize your Hammer instance
     * @type {Object}
     * @memberOf InputManager#
     * @default Hammer instance, bound to document, with prevent_default: true, drag_max_touches: 0, and hold: false
     */
    this.hammer = null;

    _.assign(this, options);

    if(!this.hammer){
      this.hammer = new Hammer(document.body, {
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
      this.pushCleanup(on(document, 'keydown', this.keydown.bind(this)), cleanup);
      this.pushCleanup(on(document, 'keyup', this.keyup.bind(this)), cleanup);
    }

    if('ontouchstart' in document){
      this.pushCleanup(on(document, 'touchstart', this.touchstart.bind(this)), cleanup);
      this.pushCleanup(on(document, 'touchmove', this.touchmove.bind(this)), cleanup);
      this.pushCleanup(on(document, 'touchend', this.touchend.bind(this)), cleanup);

    }
    else{
      this.pushCleanup(on(document, 'mousedown', this.mousedown.bind(this)), cleanup);
      this.pushCleanup(on(document, 'mousemove', this.mousemove.bind(this)), cleanup);
      this.pushCleanup(on(document, 'mouseup', this.mouseup.bind(this)), cleanup);
    }


    if(!this.mouseAction){
      this.mouseAction = new MouseAction();
    }

    if(!this.touchAction){
      this.touchAction = new TouchAction();
    }

    if(this.emulateMouse){

      //da hell hammer, gotta do this oursevles now?

      // this.on('touch', this.mousedown.bind(this));
      // this.on('drag', this.mousemove.bind(this));
      // this.on('release', this.mouseup.bind(this));

    } else {

      //da hell hammer, gotta do this oursevles now?
      // this.on('touch', this.touchstart.bind(this));
      // this.on('drag', this.touchmove.bind(this));
      // this.on('release', this.touchend.bind(this));

    }

    if(this.gameArea && this.canvasPercentage){
      var handler = this.resize.bind(this);

      // Listen for resize changes

      this.pushCleanup(on(window, 'resize', handler), cleanup);
      this.pushCleanup(on(window, 'orientationchange', handler), cleanup);
    }

    //this.normalizePoint = this.normalizePoint.bind(this);
  }

  /**
   * Allows you to bind other Hammer.js events (such as Swipe or Doubletap);
   * Warning: Only set flags or variables in this handler, otherwise your game might become slow
   * @function
   * @memberOf InputManager#
   * @param  {String} gesture The gesture to bind
   * @param  {Function} handler Event handler callback
   * @return {Object} Object containing the remove function for removing the event.
   */
  on(gesture, handler){
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
  }

  /**
   * Determine whether a point is within the InputManager's canvas
   * @function
   * @memberOf InputManager#
   * @param  {Point} point Point to test
   * @return {Boolean} Whether or not the point is inside this InputManager's canvas
   */
  insideCanvas(point){
    return insideCanvas(point, this.canvas);
  }

  /**
   * Maps a GameAction to a specific key. The key codes are defined in dojo.keys.
   * If the key already has a GameAction mapped to it, the new GameAction overwrites it.
   * @function
   * @memberOf InputManager#
   * @param {GameAction} gameAction the GameAction to map
   * @param {Object} keyCode dojo.keys key code, or character
   */
  mapToKey(gameAction, keyCode){
    this.keyActions[keyCode] = gameAction;
  }

  /**
   * Adds a GameAction to a key
   * @function
   * @memberOf InputManager#
   * @param {Object} keyCode Key character or dojo/keys key code
   * @param {Boolean=} initialPressOnly Do only one fire of the action per keypress
   * @return {GameAction} GameAction that is mapped to keyCode
   */
  addKeyAction(keyCode, initialPressOnly){
    var ga = new GameAction();
    if(initialPressOnly){
      ga.behavior = ga.detectInitialPressOnly;
    }
    this.mapToKey(ga,keyCode);

    return ga;
  }

  /**
   * Called upon mouseup event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   * @deprecated Use the lowercase name instead - same syntax as normal event handling
   */
  mouseUp(e) {
    this.mouseup(e);
  }

  /**
   * Called upon mouseup event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   */
  mouseup(e){
    this.mouseAction.release(this.normalizePoint(e));
  }

  /**
   * Called upon mousedown event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   * @deprecated Use the lowercase name instead - same syntax as normal event handling
   */
  mouseDown(e){
    this.mousedown(e);
  }

  /**
   * Called upon mousedown event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   */
  mousedown(e){
    // Ensure mouse has been released
    this.mouseAction.release(null);
    var currentPoint = this.normalizePoint(e);
    this.mouseAction.insideCanvas = this.insideCanvas(currentPoint);
    this.mouseAction.press(currentPoint);
  }


  /**
   * Called upon mousemove event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   * @deprecated Use the lowercase name instead - same syntax as normal event handling
   */
  mouseMove(e){
    this.mousemove(e);
  }

  /**
   * Called upon mousemove event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   */
  mousemove(e){
    this.mouseAction.position = this.normalizePoint(e);
  }

  /**
   * Called upon touchstart event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   * @deprecated Use the lowercase name instead - same syntax as normal event handling
   */
  touchStart(e){
    this.touchstart(e);
  }

  /**
   * Called upon touchstart event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   */
  touchstart(e){
    // Ensure touch has been released
    this.touchAction.release(null);
    var currentPoints = _.map(e.touches, this.normalizePoint, this);
    this.touchAction.insideCanvas = _.some(currentPoints, this.insideCanvas, this);
    this.touchAction.press(currentPoints);
    if(this.emulateMouse){
      this.mousedown(e.touches[0]);
    }
  }

  /**
   * Called upon touchend event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   * @deprecated Use the lowercase name instead - same syntax as normal event handling
   */
  touchEnd(e){
    this.touchend(e);
  }

  /**
   * Called upon touchend event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   */
  touchend(e){
    var currentPoints = _.map(e.touches, this.normalizePoint, this);
    this.touchAction.release(currentPoints);
    if(this.emulateMouse){
      this.mouseUp(e.touches[0]);
    }
  }

  /**
   * Called upon touchmove event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   * @deprecated Use the lowercase name instead - same syntax as normal event handling
   */
  touchMove(e){
    this.touchmove(e);
  }

  /**
   * Called upon touchmove event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   */
  touchmove(e){
    var currentPoints = _.map(e.touches, this.normalizePoint, this);
    this.touchAction.positions = currentPoints;
    if(this.touchAction.startPositions){
      e.preventDefault();
    }
    if(this.emulateMouse){
      this.mousemove(e.touches[0]);
    }
  }

  /**
   * Retrieves the GameAction associated with the keyCode on the event object
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   * @return {GameAction|null} The GameAction associated with the keyCode else null
   */
  getKeyAction(e) {
    if (this.keyActions) {
      return this.keyActions[e.keyCode] || this.keyActions[String.fromCharCode(e.keyCode)];
    } else {
      return null;
    }
  }

  /**
   * Called upon keypress event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   * @deprecated Use keydown instead - same syntax as normal event handling
   */
  keyPressed(e) {
    this.keydown(e);
  }

  /**
   * Called upon keydown event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   * @deprecated Use the lowercase name instead - same syntax as normal event handling
   */
  keyDown(e){
    this.keydown(e);
  }

  /**
   * Called upon keydown event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   */
  keydown(e) {
    var gameAction = this.getKeyAction(e);
    if (gameAction && !gameAction.isPressed()) {
      gameAction.press();
    }
  }

  /**
   * Called upon keyup event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   * @deprecated Use keyup instead - same syntax as normal event handling
   */
  keyReleased(e){
    this.keyup(e);
  }

  /**
   * Called upon keyup event
   * @function
   * @memberOf InputManager#
   * @param  {Event} e Event object
   */
  keyup(e) {
    var gameAction = this.getKeyAction(e);
    if (gameAction) {
      gameAction.release();
    }
  }

  /**
   * Used to get a normalized point out of an Event object
   * @function
   * @memberOf InputManager#
   * @param  {Event} evt Event object
   * @return {Point} Normalized point
   * @deprecated Deprecated in favor of normalizePoint function (Same functionality, different name)
   */
  getMouseLoc(evt){
    return this.normalizePoint(evt);
  }

  /**
   * Used to get a normalized point out of an Event object
   * @function
   * @memberOf InputManager#
   * @param  {Event} evt Event object
   * @return {Point} Normalized point
   */
  normalizePoint(evt){
    if(evt){
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
    }
  }

  /**
   * Used to resize the canvas
   * @function
   * @memberOf InputManager#
   */
  resize(){
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

  pushCleanup(a, b){
    console.log('pushCleanup', a, b);
  }

}

module.exports = InputManager;
