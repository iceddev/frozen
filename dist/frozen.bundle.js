/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	
	window.frozenjs = {
	  GameCore : __webpack_require__(1),
	  InputManager : __webpack_require__(2),
	  ResourceManager : __webpack_require__(9),
	  MouseAction : __webpack_require__(6),
	  TouchAction : __webpack_require__(5),
	  keys : __webpack_require__(8),
	  Animation: __webpack_require__(15),
	  AnimFrame: __webpack_require__(16),
	  utils : __webpack_require__(17),
	  Sprite : __webpack_require__(27),
	  reiner : {
	    Creature : __webpack_require__(28)
	  },
	  sounds : {
	    WebAudio : __webpack_require__(13)
	  },
	  box2d : {
	    entities : __webpack_require__(29),
	    joints: __webpack_require__(35),
	    Box : __webpack_require__(40),
	    BoxGame : __webpack_require__(42)
	  }
	};
	
	module.exports = window.frozenjs;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * The GameCore class provides the base to build games on.
	 * @name GameCore
	 * @constructor GameCore
	 * @example
	 * var myGame = new GameCore({
	 *   canvasId: 'myCanvas',
	 *   update: function(millis){
	 *     // do updating of game state
	 *   },
	 *   draw: function(context){
	 *     // do drawing of the game
	 *   }
	 * });
	 *
	 * //start the game
	 * myGame.run();
	 */
	
	const InputManager = __webpack_require__(2);
	const ResourceManager = __webpack_require__(9);
	
	class GameCore {
	
	  constructor(options = {}){
	
	    /**
	     * Whether or not the game should be running its loop
	     * @type {Boolean}
	     * @memberOf GameCore#
	     * @default
	     */
	    this.isRunning = false;
	
	    /**
	     * The id of the canvas element to use render the game on
	     * @type {String}
	     * @memberOf GameCore#
	     * @default
	     */
	    this.canvasId = null;
	
	    /**
	     * Max number of milliseconds between updates. (in case user switches tabs and requestAnimationFrame pauses)
	     * @type {Number}
	     * @memberOf GameCore#
	     * @default
	     */
	    this.maxStep = 40;
	
	    /**
	     * The type of context to request from the canvas.  2d or 3d
	     * @type {String}
	     * @memberOf GameCore#
	     * @default
	     */
	    this.contextType = '2d';
	
	    /**
	     * The height of the Game and canvas
	     * @type {Number}
	     * @memberOf GameCore#
	     * @default
	     */
	    this.height = 0;
	
	    /**
	     * The width of the Game and canvas
	     * @type {Number}
	     * @memberOf GameCore#
	     * @default
	     */
	    this.width = 0;
	
	    /**
	     * The ResourceManager to be used for game
	     * @type {ResourceManager}
	     * @memberOf GameCore#
	     * @default
	     */
	    this.resourceManager = null;
	
	    /**
	     * The InputManager to be used for game
	     * @type {InputManager}
	     * @memberOf GameCore#
	     * @default
	     */
	    this.inputManager = null;
	
	    /**
	     * The style to be used for the foreground while game resources are loading
	     * @type {String}
	     * @memberOf GameCore#
	     * @default
	     */
	    this.loadingForeground = '#00F';
	
	    /**
	     * The style to be used for the background while game resources are loading
	     * @type {String}
	     * @memberOf GameCore#
	     * @default
	     */
	    this.loadingBackground = '#FFF';
	
	    /**
	     * The ID of a DOM element that contains the game's canvas
	     * @type {String}
	     * @memberOf GameCore#
	     * @default
	     */
	    this.gameAreaId = null;
	
	    /**
	     * The percentage (0 to 1.0) of the height and width the canvas should use to fill in its container DOM element
	     * @type {Number}
	     * @memberOf GameCore#
	     * @default
	     */
	    this.canvasPercentage = 0;
	
	    Object.assign(this, options);
	
	    if(!this.resourceManager){
	      this.resourceManager = new ResourceManager();
	    }
	  }
	
	  /**
	   * Sets the height on your GameCore instance and on your canvas reference
	   * @function
	   * @memberOf GameCore#
	   * @param {Number} newHeight The new height desired
	   */
	  setHeight(newHeight){
	    this.height = newHeight;
	    this.canvas.height = newHeight;
	  }
	
	  /**
	   * Sets the width on your GameCore instance and on your canvas reference
	   * @function
	   * @memberOf GameCore#
	   * @param {Number} newWidth The new width desired
	   */
	  setWidth(newWidth){
	    this.width = newWidth;
	    this.canvas.width = newWidth;
	  }
	
	  /**
	   * Signals the game loop that it's time to quit
	   * @function
	   * @memberOf GameCore#
	   */
	  stop() {
	    this.isRunning = false;
	  }
	
	  /**
	   * Launches the game.
	   * @function
	   * @memberOf GameCore#
	   */
	  run() {
	    if(!this.isRunning){
	      this.init();
	      this.loadResources(this.resourceManager);
	      this.initInput(this.inputManager);
	      this.launchLoop();
	    }
	  }
	
	  /**
	   * Can be overidden in GameCore subclasses to load images and sounds
	   * @function
	   * @memberOf GameCore#
	   * @param {ResourceManager} resourceManager
	   */
	  loadResources(resourceManager){
	
	  }
	
	  /**
	   * Sets the screen mode and initiates and objects.
	   * @function
	   * @memberOf GameCore#
	   */
	  init() {
	    if(!this.canvas){
	      this.canvas = document.getElementById(this.canvasId);
	    }
	    if(!this.canvas){
	      
	      alert('Sorry, your browser does not support canvas.  I recommend any browser but Internet Explorer');
	      return;
	    }
	    if(!this.context){
	      this.context = this.canvas.getContext(this.contextType);
	    }
	    if(!this.context){
	      alert('Sorry, your browser does not support a ' + this.contextType + ' drawing surface on canvas.  I recommend any browser but Internet Explorer');
	      return;
	    }
	
	    this.setHeight(this.height || this.canvas.height);
	    this.setWidth(this.width || this.canvas.width);
	
	    if(!this.inputManager){
	      //handle resizing if gameArea and canvasPercentage are specified
	      if(this.gameAreaId && this.canvasPercentage){
	        this.inputManager = new InputManager({
	          canvas: this.canvas,
	          gameArea: document.getElementById(this.gameAreaId),
	          canvasPercentage: this.canvasPercentage
	        });
	      }else{
	        this.inputManager = new InputManager({
	          canvas: this.canvas
	        });
	      }
	    }
	
	    this.inputManager.resize();
	
	    this.isRunning = true;
	  }
	
	  /**
	   * Can be overidden in the subclasses to map user input to actions
	   * @function
	   * @memberOf GameCore#
	   * @param {InputManager} inputManager
	   */
	  initInput(inputManager) {
	
	  }
	
	  /**
	   * Can be overidden in the subclasses to deal with user input before updating the game state
	   * @function
	   * @memberOf GameCore#
	   * @param {InputManager} inputManager
	   * @param {Number} elapsedTime Elapsed time in milliseconds
	   */
	  handleInput(inputManager,elapsedTime) {
	
	  }
	
	  /**
	   * Runs through the game loop until stop() is called.
	   * @function
	   * @memberOf GameCore#
	   */
	  gameLoop() {
	    this.currTime = new Date().getTime();
	    this.elapsedTime = Math.min(this.currTime - this.prevTime, this.maxStep);
	    this.prevTime = this.currTime;
	
	    //it's using a resource manager, but resources haven't finished
	    if(this.resourceManager && !this.resourceManager.resourcesReady()){
	      this.updateLoadingScreen(this.elapsedTime);
	      this.drawLoadingScreen(this.context);
	    } else {
	      this.handleInput(this.inputManager,this.elapsedTime);
	      if(!this.paused){
	        // update
	        this.update(this.elapsedTime);
	      }
	      // draw the screen
	      this.context.save();
	      this.draw(this.context);
	      this.context.restore();
	    }
	  }
	
	  /**
	   * Launches the game loop.
	   * @function
	   * @memberOf GameCore#
	   */
	  launchLoop(){
	    this.elapsedTime = 0;
	    var startTime = Date.now();
	    this.currTime = startTime;
	    this.prevTime = startTime;
	
	    //need to keep the context defined here so the game loop has access to it
	    this.loopRunner = this.loopRunner.bind(this);
	    window.requestAnimationFrame(this.loopRunner);
	  }
	
	  loopRunner(){
	    this.gameLoop();
	    window.requestAnimationFrame(this.loopRunner);
	  }
	
	  /**
	   * Should be overridden to update the state of the game/animation based on the amount of elapsed time that has passed.
	   * @function
	   * @memberOf GameCore#
	   * @param {Number} elapsedTime Elapsed time in milliseconds
	   */
	  update(elapsedTime) {
	
	
	  }
	
	  /**
	   * Can be overridden to update the state of the game/animation while a custom loading screen is displayed.
	   * @function
	   * @memberOf GameCore#
	   * @param {Number} elapsedTime Elapsed time in milliseconds
	   */
	  updateLoadingScreen(elapsedTime) {
	
	  }
	
	  /**
	   * Draws to the screen. Subclasses or instances must override this method to paint items to the screen.
	   * @function
	   * @memberOf GameCore#
	   * @param {Context} context An HTML5 canvas drawing context.
	   */
	  draw(context){
	    if(this.contextType === '2d'){
	      context.font = "14px sans-serif";
	      context.fillText("This game does not have its own draw function!", 10, 50);
	    }
	  }
	
	  /**
	   * Draws the progress of the resource manger to the screen while loading.
	   * Subclasses or instances may override for custom loading animations.
	   * @function
	   * @memberOf GameCore#
	   * @param {Context} context An HTML5 canvas drawing context.
	   */
	  drawLoadingScreen(context){
	    if(this.resourceManager && (this.contextType === '2d')){
	      context.fillStyle = this.loadingBackground;
	      context.fillRect(0,0, this.width,this.height);
	
	      context.fillStyle = this.loadingForeground;
	      context.strokeStyle = this.loadingForeground;
	
	      var textPxSize = Math.floor(this.height/12);
	
	      context.font = "bold " + textPxSize + "px sans-serif";
	
	      context.fillText("Loading... " + this.resourceManager.getPercentComplete() + "%", this.width * 0.1, this.height * 0.55);
	
	      context.strokeRect(this.width * 0.1, this.height * 0.7, this.width * 0.8, this.height * 0.1);
	      context.fillRect(this.width * 0.1, this.height * 0.7, (this.width * 0.8) * this.resourceManager.getPercentComplete()/100, this.height * 0.1);
	
	      context.lineWidth = 4;
	    }
	  }
	
	}
	
	module.exports = GameCore;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * The InputManager handles DOM events for use in games.
	 * @name InputManager
	 * @constructor InputManager
	 */
	
	const Hammer = __webpack_require__(3);
	
	const GameAction = __webpack_require__(4);
	const TouchAction = __webpack_require__(5);
	const MouseAction = __webpack_require__(6);
	const insideCanvas = __webpack_require__(7);
	const keys = __webpack_require__(8);
	
	function on (element, name, handler) {
	  element.addEventListener(name, handler);
	  return function remove() {
	    element.removeEventListener(name, handler);
	  }
	}
	
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
	  constructor(options = {}){
	
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
	
	    Object.assign(this, options);
	
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
	
	    this.normalizePoint = this.normalizePoint.bind(this);
	    this.insideCanvas = this.insideCanvas.bind(this);
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
	   * Adds arrow key GameActions
	   * @function
	   * @memberOf InputManager#
	   */
	  addArrowKeyActions(){
	    this.addKeyAction(keys.UP);
	    this.addKeyAction(keys.DOWN);
	    this.addKeyAction(keys.LEFT);
	    this.addKeyAction(keys.RIGHT);
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
	    console.log(e.touches, e);
	    //TouchList doesn't implement .map()
	    const currentPoints = [];
	    for (let i = 0; i < e.touches.length; i++) {
	      currentPoints.push(this.normalizePoint(e.touches[i]));
	    }
	    this.touchAction.insideCanvas = currentPoints.some(this.insideCanvas);
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
	    //TouchList doesn't implement .map()
	    const currentPoints = [];
	    for (let i = 0; i < e.touches.length; i++) {
	      currentPoints.push(this.normalizePoint(e.touches[i]));
	    }
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
	    //TouchList doesn't implement .map()
	    const currentPoints = [];
	    for (let i = 0; i < e.touches.length; i++) {
	      currentPoints.push(this.normalizePoint(e.touches[i]));
	    }
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
	    // console.log('pushCleanup', a, b);
	  }
	
	}
	
	module.exports = InputManager;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.7 - 2016-04-22
	 * http://hammerjs.github.io/
	 *
	 * Copyright (c) 2016 Jorik Tangelder;
	 * Licensed under the MIT license */
	(function(window, document, exportName, undefined) {
	  'use strict';
	
	var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
	var TEST_ELEMENT = document.createElement('div');
	
	var TYPE_FUNCTION = 'function';
	
	var round = Math.round;
	var abs = Math.abs;
	var now = Date.now;
	
	/**
	 * set a timeout with a given scope
	 * @param {Function} fn
	 * @param {Number} timeout
	 * @param {Object} context
	 * @returns {number}
	 */
	function setTimeoutContext(fn, timeout, context) {
	    return setTimeout(bindFn(fn, context), timeout);
	}
	
	/**
	 * if the argument is an array, we want to execute the fn on each entry
	 * if it aint an array we don't want to do a thing.
	 * this is used by all the methods that accept a single and array argument.
	 * @param {*|Array} arg
	 * @param {String} fn
	 * @param {Object} [context]
	 * @returns {Boolean}
	 */
	function invokeArrayArg(arg, fn, context) {
	    if (Array.isArray(arg)) {
	        each(arg, context[fn], context);
	        return true;
	    }
	    return false;
	}
	
	/**
	 * walk objects and arrays
	 * @param {Object} obj
	 * @param {Function} iterator
	 * @param {Object} context
	 */
	function each(obj, iterator, context) {
	    var i;
	
	    if (!obj) {
	        return;
	    }
	
	    if (obj.forEach) {
	        obj.forEach(iterator, context);
	    } else if (obj.length !== undefined) {
	        i = 0;
	        while (i < obj.length) {
	            iterator.call(context, obj[i], i, obj);
	            i++;
	        }
	    } else {
	        for (i in obj) {
	            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
	        }
	    }
	}
	
	/**
	 * wrap a method with a deprecation warning and stack trace
	 * @param {Function} method
	 * @param {String} name
	 * @param {String} message
	 * @returns {Function} A new function wrapping the supplied method.
	 */
	function deprecate(method, name, message) {
	    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
	    return function() {
	        var e = new Error('get-stack-trace');
	        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
	            .replace(/^\s+at\s+/gm, '')
	            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';
	
	        var log = window.console && (window.console.warn || window.console.log);
	        if (log) {
	            log.call(window.console, deprecationMessage, stack);
	        }
	        return method.apply(this, arguments);
	    };
	}
	
	/**
	 * extend object.
	 * means that properties in dest will be overwritten by the ones in src.
	 * @param {Object} target
	 * @param {...Object} objects_to_assign
	 * @returns {Object} target
	 */
	var assign;
	if (typeof Object.assign !== 'function') {
	    assign = function assign(target) {
	        if (target === undefined || target === null) {
	            throw new TypeError('Cannot convert undefined or null to object');
	        }
	
	        var output = Object(target);
	        for (var index = 1; index < arguments.length; index++) {
	            var source = arguments[index];
	            if (source !== undefined && source !== null) {
	                for (var nextKey in source) {
	                    if (source.hasOwnProperty(nextKey)) {
	                        output[nextKey] = source[nextKey];
	                    }
	                }
	            }
	        }
	        return output;
	    };
	} else {
	    assign = Object.assign;
	}
	
	/**
	 * extend object.
	 * means that properties in dest will be overwritten by the ones in src.
	 * @param {Object} dest
	 * @param {Object} src
	 * @param {Boolean} [merge=false]
	 * @returns {Object} dest
	 */
	var extend = deprecate(function extend(dest, src, merge) {
	    var keys = Object.keys(src);
	    var i = 0;
	    while (i < keys.length) {
	        if (!merge || (merge && dest[keys[i]] === undefined)) {
	            dest[keys[i]] = src[keys[i]];
	        }
	        i++;
	    }
	    return dest;
	}, 'extend', 'Use `assign`.');
	
	/**
	 * merge the values from src in the dest.
	 * means that properties that exist in dest will not be overwritten by src
	 * @param {Object} dest
	 * @param {Object} src
	 * @returns {Object} dest
	 */
	var merge = deprecate(function merge(dest, src) {
	    return extend(dest, src, true);
	}, 'merge', 'Use `assign`.');
	
	/**
	 * simple class inheritance
	 * @param {Function} child
	 * @param {Function} base
	 * @param {Object} [properties]
	 */
	function inherit(child, base, properties) {
	    var baseP = base.prototype,
	        childP;
	
	    childP = child.prototype = Object.create(baseP);
	    childP.constructor = child;
	    childP._super = baseP;
	
	    if (properties) {
	        assign(childP, properties);
	    }
	}
	
	/**
	 * simple function bind
	 * @param {Function} fn
	 * @param {Object} context
	 * @returns {Function}
	 */
	function bindFn(fn, context) {
	    return function boundFn() {
	        return fn.apply(context, arguments);
	    };
	}
	
	/**
	 * let a boolean value also be a function that must return a boolean
	 * this first item in args will be used as the context
	 * @param {Boolean|Function} val
	 * @param {Array} [args]
	 * @returns {Boolean}
	 */
	function boolOrFn(val, args) {
	    if (typeof val == TYPE_FUNCTION) {
	        return val.apply(args ? args[0] || undefined : undefined, args);
	    }
	    return val;
	}
	
	/**
	 * use the val2 when val1 is undefined
	 * @param {*} val1
	 * @param {*} val2
	 * @returns {*}
	 */
	function ifUndefined(val1, val2) {
	    return (val1 === undefined) ? val2 : val1;
	}
	
	/**
	 * addEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function addEventListeners(target, types, handler) {
	    each(splitStr(types), function(type) {
	        target.addEventListener(type, handler, false);
	    });
	}
	
	/**
	 * removeEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function removeEventListeners(target, types, handler) {
	    each(splitStr(types), function(type) {
	        target.removeEventListener(type, handler, false);
	    });
	}
	
	/**
	 * find if a node is in the given parent
	 * @method hasParent
	 * @param {HTMLElement} node
	 * @param {HTMLElement} parent
	 * @return {Boolean} found
	 */
	function hasParent(node, parent) {
	    while (node) {
	        if (node == parent) {
	            return true;
	        }
	        node = node.parentNode;
	    }
	    return false;
	}
	
	/**
	 * small indexOf wrapper
	 * @param {String} str
	 * @param {String} find
	 * @returns {Boolean} found
	 */
	function inStr(str, find) {
	    return str.indexOf(find) > -1;
	}
	
	/**
	 * split string on whitespace
	 * @param {String} str
	 * @returns {Array} words
	 */
	function splitStr(str) {
	    return str.trim().split(/\s+/g);
	}
	
	/**
	 * find if a array contains the object using indexOf or a simple polyFill
	 * @param {Array} src
	 * @param {String} find
	 * @param {String} [findByKey]
	 * @return {Boolean|Number} false when not found, or the index
	 */
	function inArray(src, find, findByKey) {
	    if (src.indexOf && !findByKey) {
	        return src.indexOf(find);
	    } else {
	        var i = 0;
	        while (i < src.length) {
	            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
	                return i;
	            }
	            i++;
	        }
	        return -1;
	    }
	}
	
	/**
	 * convert array-like objects to real arrays
	 * @param {Object} obj
	 * @returns {Array}
	 */
	function toArray(obj) {
	    return Array.prototype.slice.call(obj, 0);
	}
	
	/**
	 * unique array with objects based on a key (like 'id') or just by the array's value
	 * @param {Array} src [{id:1},{id:2},{id:1}]
	 * @param {String} [key]
	 * @param {Boolean} [sort=False]
	 * @returns {Array} [{id:1},{id:2}]
	 */
	function uniqueArray(src, key, sort) {
	    var results = [];
	    var values = [];
	    var i = 0;
	
	    while (i < src.length) {
	        var val = key ? src[i][key] : src[i];
	        if (inArray(values, val) < 0) {
	            results.push(src[i]);
	        }
	        values[i] = val;
	        i++;
	    }
	
	    if (sort) {
	        if (!key) {
	            results = results.sort();
	        } else {
	            results = results.sort(function sortUniqueArray(a, b) {
	                return a[key] > b[key];
	            });
	        }
	    }
	
	    return results;
	}
	
	/**
	 * get the prefixed property
	 * @param {Object} obj
	 * @param {String} property
	 * @returns {String|Undefined} prefixed
	 */
	function prefixed(obj, property) {
	    var prefix, prop;
	    var camelProp = property[0].toUpperCase() + property.slice(1);
	
	    var i = 0;
	    while (i < VENDOR_PREFIXES.length) {
	        prefix = VENDOR_PREFIXES[i];
	        prop = (prefix) ? prefix + camelProp : property;
	
	        if (prop in obj) {
	            return prop;
	        }
	        i++;
	    }
	    return undefined;
	}
	
	/**
	 * get a unique id
	 * @returns {number} uniqueId
	 */
	var _uniqueId = 1;
	function uniqueId() {
	    return _uniqueId++;
	}
	
	/**
	 * get the window object of an element
	 * @param {HTMLElement} element
	 * @returns {DocumentView|Window}
	 */
	function getWindowForElement(element) {
	    var doc = element.ownerDocument || element;
	    return (doc.defaultView || doc.parentWindow || window);
	}
	
	var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
	
	var SUPPORT_TOUCH = ('ontouchstart' in window);
	var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
	var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
	
	var INPUT_TYPE_TOUCH = 'touch';
	var INPUT_TYPE_PEN = 'pen';
	var INPUT_TYPE_MOUSE = 'mouse';
	var INPUT_TYPE_KINECT = 'kinect';
	
	var COMPUTE_INTERVAL = 25;
	
	var INPUT_START = 1;
	var INPUT_MOVE = 2;
	var INPUT_END = 4;
	var INPUT_CANCEL = 8;
	
	var DIRECTION_NONE = 1;
	var DIRECTION_LEFT = 2;
	var DIRECTION_RIGHT = 4;
	var DIRECTION_UP = 8;
	var DIRECTION_DOWN = 16;
	
	var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
	var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
	var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;
	
	var PROPS_XY = ['x', 'y'];
	var PROPS_CLIENT_XY = ['clientX', 'clientY'];
	
	/**
	 * create new input type manager
	 * @param {Manager} manager
	 * @param {Function} callback
	 * @returns {Input}
	 * @constructor
	 */
	function Input(manager, callback) {
	    var self = this;
	    this.manager = manager;
	    this.callback = callback;
	    this.element = manager.element;
	    this.target = manager.options.inputTarget;
	
	    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
	    // so when disabled the input events are completely bypassed.
	    this.domHandler = function(ev) {
	        if (boolOrFn(manager.options.enable, [manager])) {
	            self.handler(ev);
	        }
	    };
	
	    this.init();
	
	}
	
	Input.prototype = {
	    /**
	     * should handle the inputEvent data and trigger the callback
	     * @virtual
	     */
	    handler: function() { },
	
	    /**
	     * bind the events
	     */
	    init: function() {
	        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
	        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
	        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	    },
	
	    /**
	     * unbind the events
	     */
	    destroy: function() {
	        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
	        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
	        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	    }
	};
	
	/**
	 * create new input type manager
	 * called by the Manager constructor
	 * @param {Hammer} manager
	 * @returns {Input}
	 */
	function createInputInstance(manager) {
	    var Type;
	    var inputClass = manager.options.inputClass;
	
	    if (inputClass) {
	        Type = inputClass;
	    } else if (SUPPORT_POINTER_EVENTS) {
	        Type = PointerEventInput;
	    } else if (SUPPORT_ONLY_TOUCH) {
	        Type = TouchInput;
	    } else if (!SUPPORT_TOUCH) {
	        Type = MouseInput;
	    } else {
	        Type = TouchMouseInput;
	    }
	    return new (Type)(manager, inputHandler);
	}
	
	/**
	 * handle input events
	 * @param {Manager} manager
	 * @param {String} eventType
	 * @param {Object} input
	 */
	function inputHandler(manager, eventType, input) {
	    var pointersLen = input.pointers.length;
	    var changedPointersLen = input.changedPointers.length;
	    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
	    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));
	
	    input.isFirst = !!isFirst;
	    input.isFinal = !!isFinal;
	
	    if (isFirst) {
	        manager.session = {};
	    }
	
	    // source event is the normalized value of the domEvents
	    // like 'touchstart, mouseup, pointerdown'
	    input.eventType = eventType;
	
	    // compute scale, rotation etc
	    computeInputData(manager, input);
	
	    // emit secret event
	    manager.emit('hammer.input', input);
	
	    manager.recognize(input);
	    manager.session.prevInput = input;
	}
	
	/**
	 * extend the data with some usable properties like scale, rotate, velocity etc
	 * @param {Object} manager
	 * @param {Object} input
	 */
	function computeInputData(manager, input) {
	    var session = manager.session;
	    var pointers = input.pointers;
	    var pointersLength = pointers.length;
	
	    // store the first input to calculate the distance and direction
	    if (!session.firstInput) {
	        session.firstInput = simpleCloneInputData(input);
	    }
	
	    // to compute scale and rotation we need to store the multiple touches
	    if (pointersLength > 1 && !session.firstMultiple) {
	        session.firstMultiple = simpleCloneInputData(input);
	    } else if (pointersLength === 1) {
	        session.firstMultiple = false;
	    }
	
	    var firstInput = session.firstInput;
	    var firstMultiple = session.firstMultiple;
	    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
	
	    var center = input.center = getCenter(pointers);
	    input.timeStamp = now();
	    input.deltaTime = input.timeStamp - firstInput.timeStamp;
	
	    input.angle = getAngle(offsetCenter, center);
	    input.distance = getDistance(offsetCenter, center);
	
	    computeDeltaXY(session, input);
	    input.offsetDirection = getDirection(input.deltaX, input.deltaY);
	
	    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
	    input.overallVelocityX = overallVelocity.x;
	    input.overallVelocityY = overallVelocity.y;
	    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;
	
	    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
	    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
	
	    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
	        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);
	
	    computeIntervalInputData(session, input);
	
	    // find the correct target
	    var target = manager.element;
	    if (hasParent(input.srcEvent.target, target)) {
	        target = input.srcEvent.target;
	    }
	    input.target = target;
	}
	
	function computeDeltaXY(session, input) {
	    var center = input.center;
	    var offset = session.offsetDelta || {};
	    var prevDelta = session.prevDelta || {};
	    var prevInput = session.prevInput || {};
	
	    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
	        prevDelta = session.prevDelta = {
	            x: prevInput.deltaX || 0,
	            y: prevInput.deltaY || 0
	        };
	
	        offset = session.offsetDelta = {
	            x: center.x,
	            y: center.y
	        };
	    }
	
	    input.deltaX = prevDelta.x + (center.x - offset.x);
	    input.deltaY = prevDelta.y + (center.y - offset.y);
	}
	
	/**
	 * velocity is calculated every x ms
	 * @param {Object} session
	 * @param {Object} input
	 */
	function computeIntervalInputData(session, input) {
	    var last = session.lastInterval || input,
	        deltaTime = input.timeStamp - last.timeStamp,
	        velocity, velocityX, velocityY, direction;
	
	    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
	        var deltaX = input.deltaX - last.deltaX;
	        var deltaY = input.deltaY - last.deltaY;
	
	        var v = getVelocity(deltaTime, deltaX, deltaY);
	        velocityX = v.x;
	        velocityY = v.y;
	        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
	        direction = getDirection(deltaX, deltaY);
	
	        session.lastInterval = input;
	    } else {
	        // use latest velocity info if it doesn't overtake a minimum period
	        velocity = last.velocity;
	        velocityX = last.velocityX;
	        velocityY = last.velocityY;
	        direction = last.direction;
	    }
	
	    input.velocity = velocity;
	    input.velocityX = velocityX;
	    input.velocityY = velocityY;
	    input.direction = direction;
	}
	
	/**
	 * create a simple clone from the input used for storage of firstInput and firstMultiple
	 * @param {Object} input
	 * @returns {Object} clonedInputData
	 */
	function simpleCloneInputData(input) {
	    // make a simple copy of the pointers because we will get a reference if we don't
	    // we only need clientXY for the calculations
	    var pointers = [];
	    var i = 0;
	    while (i < input.pointers.length) {
	        pointers[i] = {
	            clientX: round(input.pointers[i].clientX),
	            clientY: round(input.pointers[i].clientY)
	        };
	        i++;
	    }
	
	    return {
	        timeStamp: now(),
	        pointers: pointers,
	        center: getCenter(pointers),
	        deltaX: input.deltaX,
	        deltaY: input.deltaY
	    };
	}
	
	/**
	 * get the center of all the pointers
	 * @param {Array} pointers
	 * @return {Object} center contains `x` and `y` properties
	 */
	function getCenter(pointers) {
	    var pointersLength = pointers.length;
	
	    // no need to loop when only one touch
	    if (pointersLength === 1) {
	        return {
	            x: round(pointers[0].clientX),
	            y: round(pointers[0].clientY)
	        };
	    }
	
	    var x = 0, y = 0, i = 0;
	    while (i < pointersLength) {
	        x += pointers[i].clientX;
	        y += pointers[i].clientY;
	        i++;
	    }
	
	    return {
	        x: round(x / pointersLength),
	        y: round(y / pointersLength)
	    };
	}
	
	/**
	 * calculate the velocity between two points. unit is in px per ms.
	 * @param {Number} deltaTime
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Object} velocity `x` and `y`
	 */
	function getVelocity(deltaTime, x, y) {
	    return {
	        x: x / deltaTime || 0,
	        y: y / deltaTime || 0
	    };
	}
	
	/**
	 * get the direction between two points
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Number} direction
	 */
	function getDirection(x, y) {
	    if (x === y) {
	        return DIRECTION_NONE;
	    }
	
	    if (abs(x) >= abs(y)) {
	        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
	    }
	    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
	}
	
	/**
	 * calculate the absolute distance between two points
	 * @param {Object} p1 {x, y}
	 * @param {Object} p2 {x, y}
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} distance
	 */
	function getDistance(p1, p2, props) {
	    if (!props) {
	        props = PROPS_XY;
	    }
	    var x = p2[props[0]] - p1[props[0]],
	        y = p2[props[1]] - p1[props[1]];
	
	    return Math.sqrt((x * x) + (y * y));
	}
	
	/**
	 * calculate the angle between two coordinates
	 * @param {Object} p1
	 * @param {Object} p2
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} angle
	 */
	function getAngle(p1, p2, props) {
	    if (!props) {
	        props = PROPS_XY;
	    }
	    var x = p2[props[0]] - p1[props[0]],
	        y = p2[props[1]] - p1[props[1]];
	    return Math.atan2(y, x) * 180 / Math.PI;
	}
	
	/**
	 * calculate the rotation degrees between two pointersets
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} rotation
	 */
	function getRotation(start, end) {
	    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
	}
	
	/**
	 * calculate the scale factor between two pointersets
	 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} scale
	 */
	function getScale(start, end) {
	    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
	}
	
	var MOUSE_INPUT_MAP = {
	    mousedown: INPUT_START,
	    mousemove: INPUT_MOVE,
	    mouseup: INPUT_END
	};
	
	var MOUSE_ELEMENT_EVENTS = 'mousedown';
	var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';
	
	/**
	 * Mouse events input
	 * @constructor
	 * @extends Input
	 */
	function MouseInput() {
	    this.evEl = MOUSE_ELEMENT_EVENTS;
	    this.evWin = MOUSE_WINDOW_EVENTS;
	
	    this.pressed = false; // mousedown state
	
	    Input.apply(this, arguments);
	}
	
	inherit(MouseInput, Input, {
	    /**
	     * handle mouse events
	     * @param {Object} ev
	     */
	    handler: function MEhandler(ev) {
	        var eventType = MOUSE_INPUT_MAP[ev.type];
	
	        // on start we want to have the left mouse button down
	        if (eventType & INPUT_START && ev.button === 0) {
	            this.pressed = true;
	        }
	
	        if (eventType & INPUT_MOVE && ev.which !== 1) {
	            eventType = INPUT_END;
	        }
	
	        // mouse must be down
	        if (!this.pressed) {
	            return;
	        }
	
	        if (eventType & INPUT_END) {
	            this.pressed = false;
	        }
	
	        this.callback(this.manager, eventType, {
	            pointers: [ev],
	            changedPointers: [ev],
	            pointerType: INPUT_TYPE_MOUSE,
	            srcEvent: ev
	        });
	    }
	});
	
	var POINTER_INPUT_MAP = {
	    pointerdown: INPUT_START,
	    pointermove: INPUT_MOVE,
	    pointerup: INPUT_END,
	    pointercancel: INPUT_CANCEL,
	    pointerout: INPUT_CANCEL
	};
	
	// in IE10 the pointer types is defined as an enum
	var IE10_POINTER_TYPE_ENUM = {
	    2: INPUT_TYPE_TOUCH,
	    3: INPUT_TYPE_PEN,
	    4: INPUT_TYPE_MOUSE,
	    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
	};
	
	var POINTER_ELEMENT_EVENTS = 'pointerdown';
	var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';
	
	// IE10 has prefixed support, and case-sensitive
	if (window.MSPointerEvent && !window.PointerEvent) {
	    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
	    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
	}
	
	/**
	 * Pointer events input
	 * @constructor
	 * @extends Input
	 */
	function PointerEventInput() {
	    this.evEl = POINTER_ELEMENT_EVENTS;
	    this.evWin = POINTER_WINDOW_EVENTS;
	
	    Input.apply(this, arguments);
	
	    this.store = (this.manager.session.pointerEvents = []);
	}
	
	inherit(PointerEventInput, Input, {
	    /**
	     * handle mouse events
	     * @param {Object} ev
	     */
	    handler: function PEhandler(ev) {
	        var store = this.store;
	        var removePointer = false;
	
	        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
	        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
	        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
	
	        var isTouch = (pointerType == INPUT_TYPE_TOUCH);
	
	        // get index of the event in the store
	        var storeIndex = inArray(store, ev.pointerId, 'pointerId');
	
	        // start and mouse must be down
	        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
	            if (storeIndex < 0) {
	                store.push(ev);
	                storeIndex = store.length - 1;
	            }
	        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	            removePointer = true;
	        }
	
	        // it not found, so the pointer hasn't been down (so it's probably a hover)
	        if (storeIndex < 0) {
	            return;
	        }
	
	        // update the event in the store
	        store[storeIndex] = ev;
	
	        this.callback(this.manager, eventType, {
	            pointers: store,
	            changedPointers: [ev],
	            pointerType: pointerType,
	            srcEvent: ev
	        });
	
	        if (removePointer) {
	            // remove from the store
	            store.splice(storeIndex, 1);
	        }
	    }
	});
	
	var SINGLE_TOUCH_INPUT_MAP = {
	    touchstart: INPUT_START,
	    touchmove: INPUT_MOVE,
	    touchend: INPUT_END,
	    touchcancel: INPUT_CANCEL
	};
	
	var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
	var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';
	
	/**
	 * Touch events input
	 * @constructor
	 * @extends Input
	 */
	function SingleTouchInput() {
	    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
	    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
	    this.started = false;
	
	    Input.apply(this, arguments);
	}
	
	inherit(SingleTouchInput, Input, {
	    handler: function TEhandler(ev) {
	        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];
	
	        // should we handle the touch events?
	        if (type === INPUT_START) {
	            this.started = true;
	        }
	
	        if (!this.started) {
	            return;
	        }
	
	        var touches = normalizeSingleTouches.call(this, ev, type);
	
	        // when done, reset the started state
	        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
	            this.started = false;
	        }
	
	        this.callback(this.manager, type, {
	            pointers: touches[0],
	            changedPointers: touches[1],
	            pointerType: INPUT_TYPE_TOUCH,
	            srcEvent: ev
	        });
	    }
	});
	
	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function normalizeSingleTouches(ev, type) {
	    var all = toArray(ev.touches);
	    var changed = toArray(ev.changedTouches);
	
	    if (type & (INPUT_END | INPUT_CANCEL)) {
	        all = uniqueArray(all.concat(changed), 'identifier', true);
	    }
	
	    return [all, changed];
	}
	
	var TOUCH_INPUT_MAP = {
	    touchstart: INPUT_START,
	    touchmove: INPUT_MOVE,
	    touchend: INPUT_END,
	    touchcancel: INPUT_CANCEL
	};
	
	var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';
	
	/**
	 * Multi-user touch events input
	 * @constructor
	 * @extends Input
	 */
	function TouchInput() {
	    this.evTarget = TOUCH_TARGET_EVENTS;
	    this.targetIds = {};
	
	    Input.apply(this, arguments);
	}
	
	inherit(TouchInput, Input, {
	    handler: function MTEhandler(ev) {
	        var type = TOUCH_INPUT_MAP[ev.type];
	        var touches = getTouches.call(this, ev, type);
	        if (!touches) {
	            return;
	        }
	
	        this.callback(this.manager, type, {
	            pointers: touches[0],
	            changedPointers: touches[1],
	            pointerType: INPUT_TYPE_TOUCH,
	            srcEvent: ev
	        });
	    }
	});
	
	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function getTouches(ev, type) {
	    var allTouches = toArray(ev.touches);
	    var targetIds = this.targetIds;
	
	    // when there is only one touch, the process can be simplified
	    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
	        targetIds[allTouches[0].identifier] = true;
	        return [allTouches, allTouches];
	    }
	
	    var i,
	        targetTouches,
	        changedTouches = toArray(ev.changedTouches),
	        changedTargetTouches = [],
	        target = this.target;
	
	    // get target touches from touches
	    targetTouches = allTouches.filter(function(touch) {
	        return hasParent(touch.target, target);
	    });
	
	    // collect touches
	    if (type === INPUT_START) {
	        i = 0;
	        while (i < targetTouches.length) {
	            targetIds[targetTouches[i].identifier] = true;
	            i++;
	        }
	    }
	
	    // filter changed touches to only contain touches that exist in the collected target ids
	    i = 0;
	    while (i < changedTouches.length) {
	        if (targetIds[changedTouches[i].identifier]) {
	            changedTargetTouches.push(changedTouches[i]);
	        }
	
	        // cleanup removed touches
	        if (type & (INPUT_END | INPUT_CANCEL)) {
	            delete targetIds[changedTouches[i].identifier];
	        }
	        i++;
	    }
	
	    if (!changedTargetTouches.length) {
	        return;
	    }
	
	    return [
	        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
	        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
	        changedTargetTouches
	    ];
	}
	
	/**
	 * Combined touch and mouse input
	 *
	 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
	 * This because touch devices also emit mouse events while doing a touch.
	 *
	 * @constructor
	 * @extends Input
	 */
	
	var DEDUP_TIMEOUT = 2500;
	var DEDUP_DISTANCE = 25;
	
	function TouchMouseInput() {
	    Input.apply(this, arguments);
	
	    var handler = bindFn(this.handler, this);
	    this.touch = new TouchInput(this.manager, handler);
	    this.mouse = new MouseInput(this.manager, handler);
	
	    this.primaryTouch = null;
	    this.lastTouches = [];
	}
	
	inherit(TouchMouseInput, Input, {
	    /**
	     * handle mouse and touch events
	     * @param {Hammer} manager
	     * @param {String} inputEvent
	     * @param {Object} inputData
	     */
	    handler: function TMEhandler(manager, inputEvent, inputData) {
	        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
	            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);
	
	        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
	            return;
	        }
	
	        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
	        if (isTouch) {
	            recordTouches.call(this, inputEvent, inputData);
	        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
	            return;
	        }
	
	        this.callback(manager, inputEvent, inputData);
	    },
	
	    /**
	     * remove the event listeners
	     */
	    destroy: function destroy() {
	        this.touch.destroy();
	        this.mouse.destroy();
	    }
	});
	
	function recordTouches(eventType, eventData) {
	    if (eventType & INPUT_START) {
	        this.primaryTouch = eventData.changedPointers[0].identifier;
	        setLastTouch.call(this, eventData);
	    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	        setLastTouch.call(this, eventData);
	    }
	}
	
	function setLastTouch(eventData) {
	    var touch = eventData.changedPointers[0];
	
	    if (touch.identifier === this.primaryTouch) {
	        var lastTouch = {x: touch.clientX, y: touch.clientY};
	        this.lastTouches.push(lastTouch);
	        var lts = this.lastTouches;
	        var removeLastTouch = function() {
	            var i = lts.indexOf(lastTouch);
	            if (i > -1) {
	                lts.splice(i, 1);
	            }
	        };
	        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
	    }
	}
	
	function isSyntheticEvent(eventData) {
	    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
	    for (var i = 0; i < this.lastTouches.length; i++) {
	        var t = this.lastTouches[i];
	        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
	        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
	            return true;
	        }
	    }
	    return false;
	}
	
	var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
	var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;
	
	// magical touchAction value
	var TOUCH_ACTION_COMPUTE = 'compute';
	var TOUCH_ACTION_AUTO = 'auto';
	var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
	var TOUCH_ACTION_NONE = 'none';
	var TOUCH_ACTION_PAN_X = 'pan-x';
	var TOUCH_ACTION_PAN_Y = 'pan-y';
	var TOUCH_ACTION_MAP = getTouchActionProps();
	
	/**
	 * Touch Action
	 * sets the touchAction property or uses the js alternative
	 * @param {Manager} manager
	 * @param {String} value
	 * @constructor
	 */
	function TouchAction(manager, value) {
	    this.manager = manager;
	    this.set(value);
	}
	
	TouchAction.prototype = {
	    /**
	     * set the touchAction value on the element or enable the polyfill
	     * @param {String} value
	     */
	    set: function(value) {
	        // find out the touch-action by the event handlers
	        if (value == TOUCH_ACTION_COMPUTE) {
	            value = this.compute();
	        }
	
	        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
	            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
	        }
	        this.actions = value.toLowerCase().trim();
	    },
	
	    /**
	     * just re-set the touchAction value
	     */
	    update: function() {
	        this.set(this.manager.options.touchAction);
	    },
	
	    /**
	     * compute the value for the touchAction property based on the recognizer's settings
	     * @returns {String} value
	     */
	    compute: function() {
	        var actions = [];
	        each(this.manager.recognizers, function(recognizer) {
	            if (boolOrFn(recognizer.options.enable, [recognizer])) {
	                actions = actions.concat(recognizer.getTouchAction());
	            }
	        });
	        return cleanTouchActions(actions.join(' '));
	    },
	
	    /**
	     * this method is called on each input cycle and provides the preventing of the browser behavior
	     * @param {Object} input
	     */
	    preventDefaults: function(input) {
	        var srcEvent = input.srcEvent;
	        var direction = input.offsetDirection;
	
	        // if the touch action did prevented once this session
	        if (this.manager.session.prevented) {
	            srcEvent.preventDefault();
	            return;
	        }
	
	        var actions = this.actions;
	        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
	        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
	        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];
	
	        if (hasNone) {
	            //do not prevent defaults if this is a tap gesture
	
	            var isTapPointer = input.pointers.length === 1;
	            var isTapMovement = input.distance < 2;
	            var isTapTouchTime = input.deltaTime < 250;
	
	            if (isTapPointer && isTapMovement && isTapTouchTime) {
	                return;
	            }
	        }
	
	        if (hasPanX && hasPanY) {
	            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
	            return;
	        }
	
	        if (hasNone ||
	            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
	            (hasPanX && direction & DIRECTION_VERTICAL)) {
	            return this.preventSrc(srcEvent);
	        }
	    },
	
	    /**
	     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
	     * @param {Object} srcEvent
	     */
	    preventSrc: function(srcEvent) {
	        this.manager.session.prevented = true;
	        srcEvent.preventDefault();
	    }
	};
	
	/**
	 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
	 * @param {String} actions
	 * @returns {*}
	 */
	function cleanTouchActions(actions) {
	    // none
	    if (inStr(actions, TOUCH_ACTION_NONE)) {
	        return TOUCH_ACTION_NONE;
	    }
	
	    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
	    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
	
	    // if both pan-x and pan-y are set (different recognizers
	    // for different directions, e.g. horizontal pan but vertical swipe?)
	    // we need none (as otherwise with pan-x pan-y combined none of these
	    // recognizers will work, since the browser would handle all panning
	    if (hasPanX && hasPanY) {
	        return TOUCH_ACTION_NONE;
	    }
	
	    // pan-x OR pan-y
	    if (hasPanX || hasPanY) {
	        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
	    }
	
	    // manipulation
	    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
	        return TOUCH_ACTION_MANIPULATION;
	    }
	
	    return TOUCH_ACTION_AUTO;
	}
	
	function getTouchActionProps() {
	    if (!NATIVE_TOUCH_ACTION) {
	        return false;
	    }
	    var touchMap = {};
	    var cssSupports = window.CSS && window.CSS.supports;
	    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {
	
	        // If css.supports is not supported but there is native touch-action assume it supports
	        // all values. This is the case for IE 10 and 11.
	        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
	    });
	    return touchMap;
	}
	
	/**
	 * Recognizer flow explained; *
	 * All recognizers have the initial state of POSSIBLE when a input session starts.
	 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
	 * Example session for mouse-input: mousedown -> mousemove -> mouseup
	 *
	 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
	 * which determines with state it should be.
	 *
	 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
	 * POSSIBLE to give it another change on the next cycle.
	 *
	 *               Possible
	 *                  |
	 *            +-----+---------------+
	 *            |                     |
	 *      +-----+-----+               |
	 *      |           |               |
	 *   Failed      Cancelled          |
	 *                          +-------+------+
	 *                          |              |
	 *                      Recognized       Began
	 *                                         |
	 *                                      Changed
	 *                                         |
	 *                                  Ended/Recognized
	 */
	var STATE_POSSIBLE = 1;
	var STATE_BEGAN = 2;
	var STATE_CHANGED = 4;
	var STATE_ENDED = 8;
	var STATE_RECOGNIZED = STATE_ENDED;
	var STATE_CANCELLED = 16;
	var STATE_FAILED = 32;
	
	/**
	 * Recognizer
	 * Every recognizer needs to extend from this class.
	 * @constructor
	 * @param {Object} options
	 */
	function Recognizer(options) {
	    this.options = assign({}, this.defaults, options || {});
	
	    this.id = uniqueId();
	
	    this.manager = null;
	
	    // default is enable true
	    this.options.enable = ifUndefined(this.options.enable, true);
	
	    this.state = STATE_POSSIBLE;
	
	    this.simultaneous = {};
	    this.requireFail = [];
	}
	
	Recognizer.prototype = {
	    /**
	     * @virtual
	     * @type {Object}
	     */
	    defaults: {},
	
	    /**
	     * set options
	     * @param {Object} options
	     * @return {Recognizer}
	     */
	    set: function(options) {
	        assign(this.options, options);
	
	        // also update the touchAction, in case something changed about the directions/enabled state
	        this.manager && this.manager.touchAction.update();
	        return this;
	    },
	
	    /**
	     * recognize simultaneous with an other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    recognizeWith: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
	            return this;
	        }
	
	        var simultaneous = this.simultaneous;
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        if (!simultaneous[otherRecognizer.id]) {
	            simultaneous[otherRecognizer.id] = otherRecognizer;
	            otherRecognizer.recognizeWith(this);
	        }
	        return this;
	    },
	
	    /**
	     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    dropRecognizeWith: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
	            return this;
	        }
	
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        delete this.simultaneous[otherRecognizer.id];
	        return this;
	    },
	
	    /**
	     * recognizer can only run when an other is failing
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    requireFailure: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
	            return this;
	        }
	
	        var requireFail = this.requireFail;
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        if (inArray(requireFail, otherRecognizer) === -1) {
	            requireFail.push(otherRecognizer);
	            otherRecognizer.requireFailure(this);
	        }
	        return this;
	    },
	
	    /**
	     * drop the requireFailure link. it does not remove the link on the other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    dropRequireFailure: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
	            return this;
	        }
	
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        var index = inArray(this.requireFail, otherRecognizer);
	        if (index > -1) {
	            this.requireFail.splice(index, 1);
	        }
	        return this;
	    },
	
	    /**
	     * has require failures boolean
	     * @returns {boolean}
	     */
	    hasRequireFailures: function() {
	        return this.requireFail.length > 0;
	    },
	
	    /**
	     * if the recognizer can recognize simultaneous with an other recognizer
	     * @param {Recognizer} otherRecognizer
	     * @returns {Boolean}
	     */
	    canRecognizeWith: function(otherRecognizer) {
	        return !!this.simultaneous[otherRecognizer.id];
	    },
	
	    /**
	     * You should use `tryEmit` instead of `emit` directly to check
	     * that all the needed recognizers has failed before emitting.
	     * @param {Object} input
	     */
	    emit: function(input) {
	        var self = this;
	        var state = this.state;
	
	        function emit(event) {
	            self.manager.emit(event, input);
	        }
	
	        // 'panstart' and 'panmove'
	        if (state < STATE_ENDED) {
	            emit(self.options.event + stateStr(state));
	        }
	
	        emit(self.options.event); // simple 'eventName' events
	
	        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
	            emit(input.additionalEvent);
	        }
	
	        // panend and pancancel
	        if (state >= STATE_ENDED) {
	            emit(self.options.event + stateStr(state));
	        }
	    },
	
	    /**
	     * Check that all the require failure recognizers has failed,
	     * if true, it emits a gesture event,
	     * otherwise, setup the state to FAILED.
	     * @param {Object} input
	     */
	    tryEmit: function(input) {
	        if (this.canEmit()) {
	            return this.emit(input);
	        }
	        // it's failing anyway
	        this.state = STATE_FAILED;
	    },
	
	    /**
	     * can we emit?
	     * @returns {boolean}
	     */
	    canEmit: function() {
	        var i = 0;
	        while (i < this.requireFail.length) {
	            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
	                return false;
	            }
	            i++;
	        }
	        return true;
	    },
	
	    /**
	     * update the recognizer
	     * @param {Object} inputData
	     */
	    recognize: function(inputData) {
	        // make a new copy of the inputData
	        // so we can change the inputData without messing up the other recognizers
	        var inputDataClone = assign({}, inputData);
	
	        // is is enabled and allow recognizing?
	        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
	            this.reset();
	            this.state = STATE_FAILED;
	            return;
	        }
	
	        // reset when we've reached the end
	        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
	            this.state = STATE_POSSIBLE;
	        }
	
	        this.state = this.process(inputDataClone);
	
	        // the recognizer has recognized a gesture
	        // so trigger an event
	        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
	            this.tryEmit(inputDataClone);
	        }
	    },
	
	    /**
	     * return the state of the recognizer
	     * the actual recognizing happens in this method
	     * @virtual
	     * @param {Object} inputData
	     * @returns {Const} STATE
	     */
	    process: function(inputData) { }, // jshint ignore:line
	
	    /**
	     * return the preferred touch-action
	     * @virtual
	     * @returns {Array}
	     */
	    getTouchAction: function() { },
	
	    /**
	     * called when the gesture isn't allowed to recognize
	     * like when another is being recognized or it is disabled
	     * @virtual
	     */
	    reset: function() { }
	};
	
	/**
	 * get a usable string, used as event postfix
	 * @param {Const} state
	 * @returns {String} state
	 */
	function stateStr(state) {
	    if (state & STATE_CANCELLED) {
	        return 'cancel';
	    } else if (state & STATE_ENDED) {
	        return 'end';
	    } else if (state & STATE_CHANGED) {
	        return 'move';
	    } else if (state & STATE_BEGAN) {
	        return 'start';
	    }
	    return '';
	}
	
	/**
	 * direction cons to string
	 * @param {Const} direction
	 * @returns {String}
	 */
	function directionStr(direction) {
	    if (direction == DIRECTION_DOWN) {
	        return 'down';
	    } else if (direction == DIRECTION_UP) {
	        return 'up';
	    } else if (direction == DIRECTION_LEFT) {
	        return 'left';
	    } else if (direction == DIRECTION_RIGHT) {
	        return 'right';
	    }
	    return '';
	}
	
	/**
	 * get a recognizer by name if it is bound to a manager
	 * @param {Recognizer|String} otherRecognizer
	 * @param {Recognizer} recognizer
	 * @returns {Recognizer}
	 */
	function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
	    var manager = recognizer.manager;
	    if (manager) {
	        return manager.get(otherRecognizer);
	    }
	    return otherRecognizer;
	}
	
	/**
	 * This recognizer is just used as a base for the simple attribute recognizers.
	 * @constructor
	 * @extends Recognizer
	 */
	function AttrRecognizer() {
	    Recognizer.apply(this, arguments);
	}
	
	inherit(AttrRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof AttrRecognizer
	     */
	    defaults: {
	        /**
	         * @type {Number}
	         * @default 1
	         */
	        pointers: 1
	    },
	
	    /**
	     * Used to check if it the recognizer receives valid input, like input.distance > 10.
	     * @memberof AttrRecognizer
	     * @param {Object} input
	     * @returns {Boolean} recognized
	     */
	    attrTest: function(input) {
	        var optionPointers = this.options.pointers;
	        return optionPointers === 0 || input.pointers.length === optionPointers;
	    },
	
	    /**
	     * Process the input and return the state for the recognizer
	     * @memberof AttrRecognizer
	     * @param {Object} input
	     * @returns {*} State
	     */
	    process: function(input) {
	        var state = this.state;
	        var eventType = input.eventType;
	
	        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
	        var isValid = this.attrTest(input);
	
	        // on cancel input and we've recognized before, return STATE_CANCELLED
	        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
	            return state | STATE_CANCELLED;
	        } else if (isRecognized || isValid) {
	            if (eventType & INPUT_END) {
	                return state | STATE_ENDED;
	            } else if (!(state & STATE_BEGAN)) {
	                return STATE_BEGAN;
	            }
	            return state | STATE_CHANGED;
	        }
	        return STATE_FAILED;
	    }
	});
	
	/**
	 * Pan
	 * Recognized when the pointer is down and moved in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PanRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	
	    this.pX = null;
	    this.pY = null;
	}
	
	inherit(PanRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof PanRecognizer
	     */
	    defaults: {
	        event: 'pan',
	        threshold: 10,
	        pointers: 1,
	        direction: DIRECTION_ALL
	    },
	
	    getTouchAction: function() {
	        var direction = this.options.direction;
	        var actions = [];
	        if (direction & DIRECTION_HORIZONTAL) {
	            actions.push(TOUCH_ACTION_PAN_Y);
	        }
	        if (direction & DIRECTION_VERTICAL) {
	            actions.push(TOUCH_ACTION_PAN_X);
	        }
	        return actions;
	    },
	
	    directionTest: function(input) {
	        var options = this.options;
	        var hasMoved = true;
	        var distance = input.distance;
	        var direction = input.direction;
	        var x = input.deltaX;
	        var y = input.deltaY;
	
	        // lock to axis?
	        if (!(direction & options.direction)) {
	            if (options.direction & DIRECTION_HORIZONTAL) {
	                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
	                hasMoved = x != this.pX;
	                distance = Math.abs(input.deltaX);
	            } else {
	                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
	                hasMoved = y != this.pY;
	                distance = Math.abs(input.deltaY);
	            }
	        }
	        input.direction = direction;
	        return hasMoved && distance > options.threshold && direction & options.direction;
	    },
	
	    attrTest: function(input) {
	        return AttrRecognizer.prototype.attrTest.call(this, input) &&
	            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
	    },
	
	    emit: function(input) {
	
	        this.pX = input.deltaX;
	        this.pY = input.deltaY;
	
	        var direction = directionStr(input.direction);
	
	        if (direction) {
	            input.additionalEvent = this.options.event + direction;
	        }
	        this._super.emit.call(this, input);
	    }
	});
	
	/**
	 * Pinch
	 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PinchRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}
	
	inherit(PinchRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof PinchRecognizer
	     */
	    defaults: {
	        event: 'pinch',
	        threshold: 0,
	        pointers: 2
	    },
	
	    getTouchAction: function() {
	        return [TOUCH_ACTION_NONE];
	    },
	
	    attrTest: function(input) {
	        return this._super.attrTest.call(this, input) &&
	            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
	    },
	
	    emit: function(input) {
	        if (input.scale !== 1) {
	            var inOut = input.scale < 1 ? 'in' : 'out';
	            input.additionalEvent = this.options.event + inOut;
	        }
	        this._super.emit.call(this, input);
	    }
	});
	
	/**
	 * Press
	 * Recognized when the pointer is down for x ms without any movement.
	 * @constructor
	 * @extends Recognizer
	 */
	function PressRecognizer() {
	    Recognizer.apply(this, arguments);
	
	    this._timer = null;
	    this._input = null;
	}
	
	inherit(PressRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof PressRecognizer
	     */
	    defaults: {
	        event: 'press',
	        pointers: 1,
	        time: 251, // minimal time of the pointer to be pressed
	        threshold: 9 // a minimal movement is ok, but keep it low
	    },
	
	    getTouchAction: function() {
	        return [TOUCH_ACTION_AUTO];
	    },
	
	    process: function(input) {
	        var options = this.options;
	        var validPointers = input.pointers.length === options.pointers;
	        var validMovement = input.distance < options.threshold;
	        var validTime = input.deltaTime > options.time;
	
	        this._input = input;
	
	        // we only allow little movement
	        // and we've reached an end event, so a tap is possible
	        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
	            this.reset();
	        } else if (input.eventType & INPUT_START) {
	            this.reset();
	            this._timer = setTimeoutContext(function() {
	                this.state = STATE_RECOGNIZED;
	                this.tryEmit();
	            }, options.time, this);
	        } else if (input.eventType & INPUT_END) {
	            return STATE_RECOGNIZED;
	        }
	        return STATE_FAILED;
	    },
	
	    reset: function() {
	        clearTimeout(this._timer);
	    },
	
	    emit: function(input) {
	        if (this.state !== STATE_RECOGNIZED) {
	            return;
	        }
	
	        if (input && (input.eventType & INPUT_END)) {
	            this.manager.emit(this.options.event + 'up', input);
	        } else {
	            this._input.timeStamp = now();
	            this.manager.emit(this.options.event, this._input);
	        }
	    }
	});
	
	/**
	 * Rotate
	 * Recognized when two or more pointer are moving in a circular motion.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function RotateRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}
	
	inherit(RotateRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof RotateRecognizer
	     */
	    defaults: {
	        event: 'rotate',
	        threshold: 0,
	        pointers: 2
	    },
	
	    getTouchAction: function() {
	        return [TOUCH_ACTION_NONE];
	    },
	
	    attrTest: function(input) {
	        return this._super.attrTest.call(this, input) &&
	            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
	    }
	});
	
	/**
	 * Swipe
	 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function SwipeRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}
	
	inherit(SwipeRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof SwipeRecognizer
	     */
	    defaults: {
	        event: 'swipe',
	        threshold: 10,
	        velocity: 0.3,
	        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
	        pointers: 1
	    },
	
	    getTouchAction: function() {
	        return PanRecognizer.prototype.getTouchAction.call(this);
	    },
	
	    attrTest: function(input) {
	        var direction = this.options.direction;
	        var velocity;
	
	        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
	            velocity = input.overallVelocity;
	        } else if (direction & DIRECTION_HORIZONTAL) {
	            velocity = input.overallVelocityX;
	        } else if (direction & DIRECTION_VERTICAL) {
	            velocity = input.overallVelocityY;
	        }
	
	        return this._super.attrTest.call(this, input) &&
	            direction & input.offsetDirection &&
	            input.distance > this.options.threshold &&
	            input.maxPointers == this.options.pointers &&
	            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
	    },
	
	    emit: function(input) {
	        var direction = directionStr(input.offsetDirection);
	        if (direction) {
	            this.manager.emit(this.options.event + direction, input);
	        }
	
	        this.manager.emit(this.options.event, input);
	    }
	});
	
	/**
	 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
	 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
	 * a single tap.
	 *
	 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
	 * multi-taps being recognized.
	 * @constructor
	 * @extends Recognizer
	 */
	function TapRecognizer() {
	    Recognizer.apply(this, arguments);
	
	    // previous time and center,
	    // used for tap counting
	    this.pTime = false;
	    this.pCenter = false;
	
	    this._timer = null;
	    this._input = null;
	    this.count = 0;
	}
	
	inherit(TapRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof PinchRecognizer
	     */
	    defaults: {
	        event: 'tap',
	        pointers: 1,
	        taps: 1,
	        interval: 300, // max time between the multi-tap taps
	        time: 250, // max time of the pointer to be down (like finger on the screen)
	        threshold: 9, // a minimal movement is ok, but keep it low
	        posThreshold: 10 // a multi-tap can be a bit off the initial position
	    },
	
	    getTouchAction: function() {
	        return [TOUCH_ACTION_MANIPULATION];
	    },
	
	    process: function(input) {
	        var options = this.options;
	
	        var validPointers = input.pointers.length === options.pointers;
	        var validMovement = input.distance < options.threshold;
	        var validTouchTime = input.deltaTime < options.time;
	
	        this.reset();
	
	        if ((input.eventType & INPUT_START) && (this.count === 0)) {
	            return this.failTimeout();
	        }
	
	        // we only allow little movement
	        // and we've reached an end event, so a tap is possible
	        if (validMovement && validTouchTime && validPointers) {
	            if (input.eventType != INPUT_END) {
	                return this.failTimeout();
	            }
	
	            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
	            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
	
	            this.pTime = input.timeStamp;
	            this.pCenter = input.center;
	
	            if (!validMultiTap || !validInterval) {
	                this.count = 1;
	            } else {
	                this.count += 1;
	            }
	
	            this._input = input;
	
	            // if tap count matches we have recognized it,
	            // else it has began recognizing...
	            var tapCount = this.count % options.taps;
	            if (tapCount === 0) {
	                // no failing requirements, immediately trigger the tap event
	                // or wait as long as the multitap interval to trigger
	                if (!this.hasRequireFailures()) {
	                    return STATE_RECOGNIZED;
	                } else {
	                    this._timer = setTimeoutContext(function() {
	                        this.state = STATE_RECOGNIZED;
	                        this.tryEmit();
	                    }, options.interval, this);
	                    return STATE_BEGAN;
	                }
	            }
	        }
	        return STATE_FAILED;
	    },
	
	    failTimeout: function() {
	        this._timer = setTimeoutContext(function() {
	            this.state = STATE_FAILED;
	        }, this.options.interval, this);
	        return STATE_FAILED;
	    },
	
	    reset: function() {
	        clearTimeout(this._timer);
	    },
	
	    emit: function() {
	        if (this.state == STATE_RECOGNIZED) {
	            this._input.tapCount = this.count;
	            this.manager.emit(this.options.event, this._input);
	        }
	    }
	});
	
	/**
	 * Simple way to create a manager with a default set of recognizers.
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Hammer(element, options) {
	    options = options || {};
	    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
	    return new Manager(element, options);
	}
	
	/**
	 * @const {string}
	 */
	Hammer.VERSION = '2.0.7';
	
	/**
	 * default settings
	 * @namespace
	 */
	Hammer.defaults = {
	    /**
	     * set if DOM events are being triggered.
	     * But this is slower and unused by simple implementations, so disabled by default.
	     * @type {Boolean}
	     * @default false
	     */
	    domEvents: false,
	
	    /**
	     * The value for the touchAction property/fallback.
	     * When set to `compute` it will magically set the correct value based on the added recognizers.
	     * @type {String}
	     * @default compute
	     */
	    touchAction: TOUCH_ACTION_COMPUTE,
	
	    /**
	     * @type {Boolean}
	     * @default true
	     */
	    enable: true,
	
	    /**
	     * EXPERIMENTAL FEATURE -- can be removed/changed
	     * Change the parent input target element.
	     * If Null, then it is being set the to main element.
	     * @type {Null|EventTarget}
	     * @default null
	     */
	    inputTarget: null,
	
	    /**
	     * force an input class
	     * @type {Null|Function}
	     * @default null
	     */
	    inputClass: null,
	
	    /**
	     * Default recognizer setup when calling `Hammer()`
	     * When creating a new Manager these will be skipped.
	     * @type {Array}
	     */
	    preset: [
	        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
	        [RotateRecognizer, {enable: false}],
	        [PinchRecognizer, {enable: false}, ['rotate']],
	        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
	        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
	        [TapRecognizer],
	        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
	        [PressRecognizer]
	    ],
	
	    /**
	     * Some CSS properties can be used to improve the working of Hammer.
	     * Add them to this method and they will be set when creating a new Manager.
	     * @namespace
	     */
	    cssProps: {
	        /**
	         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
	         * @type {String}
	         * @default 'none'
	         */
	        userSelect: 'none',
	
	        /**
	         * Disable the Windows Phone grippers when pressing an element.
	         * @type {String}
	         * @default 'none'
	         */
	        touchSelect: 'none',
	
	        /**
	         * Disables the default callout shown when you touch and hold a touch target.
	         * On iOS, when you touch and hold a touch target such as a link, Safari displays
	         * a callout containing information about the link. This property allows you to disable that callout.
	         * @type {String}
	         * @default 'none'
	         */
	        touchCallout: 'none',
	
	        /**
	         * Specifies whether zooming is enabled. Used by IE10>
	         * @type {String}
	         * @default 'none'
	         */
	        contentZooming: 'none',
	
	        /**
	         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
	         * @type {String}
	         * @default 'none'
	         */
	        userDrag: 'none',
	
	        /**
	         * Overrides the highlight color shown when the user taps a link or a JavaScript
	         * clickable element in iOS. This property obeys the alpha value, if specified.
	         * @type {String}
	         * @default 'rgba(0,0,0,0)'
	         */
	        tapHighlightColor: 'rgba(0,0,0,0)'
	    }
	};
	
	var STOP = 1;
	var FORCED_STOP = 2;
	
	/**
	 * Manager
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Manager(element, options) {
	    this.options = assign({}, Hammer.defaults, options || {});
	
	    this.options.inputTarget = this.options.inputTarget || element;
	
	    this.handlers = {};
	    this.session = {};
	    this.recognizers = [];
	    this.oldCssProps = {};
	
	    this.element = element;
	    this.input = createInputInstance(this);
	    this.touchAction = new TouchAction(this, this.options.touchAction);
	
	    toggleCssProps(this, true);
	
	    each(this.options.recognizers, function(item) {
	        var recognizer = this.add(new (item[0])(item[1]));
	        item[2] && recognizer.recognizeWith(item[2]);
	        item[3] && recognizer.requireFailure(item[3]);
	    }, this);
	}
	
	Manager.prototype = {
	    /**
	     * set options
	     * @param {Object} options
	     * @returns {Manager}
	     */
	    set: function(options) {
	        assign(this.options, options);
	
	        // Options that need a little more setup
	        if (options.touchAction) {
	            this.touchAction.update();
	        }
	        if (options.inputTarget) {
	            // Clean up existing event listeners and reinitialize
	            this.input.destroy();
	            this.input.target = options.inputTarget;
	            this.input.init();
	        }
	        return this;
	    },
	
	    /**
	     * stop recognizing for this session.
	     * This session will be discarded, when a new [input]start event is fired.
	     * When forced, the recognizer cycle is stopped immediately.
	     * @param {Boolean} [force]
	     */
	    stop: function(force) {
	        this.session.stopped = force ? FORCED_STOP : STOP;
	    },
	
	    /**
	     * run the recognizers!
	     * called by the inputHandler function on every movement of the pointers (touches)
	     * it walks through all the recognizers and tries to detect the gesture that is being made
	     * @param {Object} inputData
	     */
	    recognize: function(inputData) {
	        var session = this.session;
	        if (session.stopped) {
	            return;
	        }
	
	        // run the touch-action polyfill
	        this.touchAction.preventDefaults(inputData);
	
	        var recognizer;
	        var recognizers = this.recognizers;
	
	        // this holds the recognizer that is being recognized.
	        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
	        // if no recognizer is detecting a thing, it is set to `null`
	        var curRecognizer = session.curRecognizer;
	
	        // reset when the last recognizer is recognized
	        // or when we're in a new session
	        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
	            curRecognizer = session.curRecognizer = null;
	        }
	
	        var i = 0;
	        while (i < recognizers.length) {
	            recognizer = recognizers[i];
	
	            // find out if we are allowed try to recognize the input for this one.
	            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
	            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
	            //      that is being recognized.
	            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
	            //      this can be setup with the `recognizeWith()` method on the recognizer.
	            if (session.stopped !== FORCED_STOP && ( // 1
	                    !curRecognizer || recognizer == curRecognizer || // 2
	                    recognizer.canRecognizeWith(curRecognizer))) { // 3
	                recognizer.recognize(inputData);
	            } else {
	                recognizer.reset();
	            }
	
	            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
	            // current active recognizer. but only if we don't already have an active recognizer
	            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
	                curRecognizer = session.curRecognizer = recognizer;
	            }
	            i++;
	        }
	    },
	
	    /**
	     * get a recognizer by its event name.
	     * @param {Recognizer|String} recognizer
	     * @returns {Recognizer|Null}
	     */
	    get: function(recognizer) {
	        if (recognizer instanceof Recognizer) {
	            return recognizer;
	        }
	
	        var recognizers = this.recognizers;
	        for (var i = 0; i < recognizers.length; i++) {
	            if (recognizers[i].options.event == recognizer) {
	                return recognizers[i];
	            }
	        }
	        return null;
	    },
	
	    /**
	     * add a recognizer to the manager
	     * existing recognizers with the same event name will be removed
	     * @param {Recognizer} recognizer
	     * @returns {Recognizer|Manager}
	     */
	    add: function(recognizer) {
	        if (invokeArrayArg(recognizer, 'add', this)) {
	            return this;
	        }
	
	        // remove existing
	        var existing = this.get(recognizer.options.event);
	        if (existing) {
	            this.remove(existing);
	        }
	
	        this.recognizers.push(recognizer);
	        recognizer.manager = this;
	
	        this.touchAction.update();
	        return recognizer;
	    },
	
	    /**
	     * remove a recognizer by name or instance
	     * @param {Recognizer|String} recognizer
	     * @returns {Manager}
	     */
	    remove: function(recognizer) {
	        if (invokeArrayArg(recognizer, 'remove', this)) {
	            return this;
	        }
	
	        recognizer = this.get(recognizer);
	
	        // let's make sure this recognizer exists
	        if (recognizer) {
	            var recognizers = this.recognizers;
	            var index = inArray(recognizers, recognizer);
	
	            if (index !== -1) {
	                recognizers.splice(index, 1);
	                this.touchAction.update();
	            }
	        }
	
	        return this;
	    },
	
	    /**
	     * bind event
	     * @param {String} events
	     * @param {Function} handler
	     * @returns {EventEmitter} this
	     */
	    on: function(events, handler) {
	        if (events === undefined) {
	            return;
	        }
	        if (handler === undefined) {
	            return;
	        }
	
	        var handlers = this.handlers;
	        each(splitStr(events), function(event) {
	            handlers[event] = handlers[event] || [];
	            handlers[event].push(handler);
	        });
	        return this;
	    },
	
	    /**
	     * unbind event, leave emit blank to remove all handlers
	     * @param {String} events
	     * @param {Function} [handler]
	     * @returns {EventEmitter} this
	     */
	    off: function(events, handler) {
	        if (events === undefined) {
	            return;
	        }
	
	        var handlers = this.handlers;
	        each(splitStr(events), function(event) {
	            if (!handler) {
	                delete handlers[event];
	            } else {
	                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
	            }
	        });
	        return this;
	    },
	
	    /**
	     * emit event to the listeners
	     * @param {String} event
	     * @param {Object} data
	     */
	    emit: function(event, data) {
	        // we also want to trigger dom events
	        if (this.options.domEvents) {
	            triggerDomEvent(event, data);
	        }
	
	        // no handlers, so skip it all
	        var handlers = this.handlers[event] && this.handlers[event].slice();
	        if (!handlers || !handlers.length) {
	            return;
	        }
	
	        data.type = event;
	        data.preventDefault = function() {
	            data.srcEvent.preventDefault();
	        };
	
	        var i = 0;
	        while (i < handlers.length) {
	            handlers[i](data);
	            i++;
	        }
	    },
	
	    /**
	     * destroy the manager and unbinds all events
	     * it doesn't unbind dom events, that is the user own responsibility
	     */
	    destroy: function() {
	        this.element && toggleCssProps(this, false);
	
	        this.handlers = {};
	        this.session = {};
	        this.input.destroy();
	        this.element = null;
	    }
	};
	
	/**
	 * add/remove the css properties as defined in manager.options.cssProps
	 * @param {Manager} manager
	 * @param {Boolean} add
	 */
	function toggleCssProps(manager, add) {
	    var element = manager.element;
	    if (!element.style) {
	        return;
	    }
	    var prop;
	    each(manager.options.cssProps, function(value, name) {
	        prop = prefixed(element.style, name);
	        if (add) {
	            manager.oldCssProps[prop] = element.style[prop];
	            element.style[prop] = value;
	        } else {
	            element.style[prop] = manager.oldCssProps[prop] || '';
	        }
	    });
	    if (!add) {
	        manager.oldCssProps = {};
	    }
	}
	
	/**
	 * trigger dom event
	 * @param {String} event
	 * @param {Object} data
	 */
	function triggerDomEvent(event, data) {
	    var gestureEvent = document.createEvent('Event');
	    gestureEvent.initEvent(event, true, true);
	    gestureEvent.gesture = data;
	    data.target.dispatchEvent(gestureEvent);
	}
	
	assign(Hammer, {
	    INPUT_START: INPUT_START,
	    INPUT_MOVE: INPUT_MOVE,
	    INPUT_END: INPUT_END,
	    INPUT_CANCEL: INPUT_CANCEL,
	
	    STATE_POSSIBLE: STATE_POSSIBLE,
	    STATE_BEGAN: STATE_BEGAN,
	    STATE_CHANGED: STATE_CHANGED,
	    STATE_ENDED: STATE_ENDED,
	    STATE_RECOGNIZED: STATE_RECOGNIZED,
	    STATE_CANCELLED: STATE_CANCELLED,
	    STATE_FAILED: STATE_FAILED,
	
	    DIRECTION_NONE: DIRECTION_NONE,
	    DIRECTION_LEFT: DIRECTION_LEFT,
	    DIRECTION_RIGHT: DIRECTION_RIGHT,
	    DIRECTION_UP: DIRECTION_UP,
	    DIRECTION_DOWN: DIRECTION_DOWN,
	    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
	    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
	    DIRECTION_ALL: DIRECTION_ALL,
	
	    Manager: Manager,
	    Input: Input,
	    TouchAction: TouchAction,
	
	    TouchInput: TouchInput,
	    MouseInput: MouseInput,
	    PointerEventInput: PointerEventInput,
	    TouchMouseInput: TouchMouseInput,
	    SingleTouchInput: SingleTouchInput,
	
	    Recognizer: Recognizer,
	    AttrRecognizer: AttrRecognizer,
	    Tap: TapRecognizer,
	    Pan: PanRecognizer,
	    Swipe: SwipeRecognizer,
	    Pinch: PinchRecognizer,
	    Rotate: RotateRecognizer,
	    Press: PressRecognizer,
	
	    on: addEventListeners,
	    off: removeEventListeners,
	    each: each,
	    merge: merge,
	    extend: extend,
	    assign: assign,
	    inherit: inherit,
	    bindFn: bindFn,
	    prefixed: prefixed
	});
	
	// this prevents errors when Hammer is loaded in the presence of an AMD
	//  style loader but by script tag, not by the loader.
	var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
	freeGlobal.Hammer = Hammer;
	
	if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	        return Hammer;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module != 'undefined' && module.exports) {
	    module.exports = Hammer;
	} else {
	    window[exportName] = Hammer;
	}
	
	})(window, document, 'Hammer');


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/**
	 * The GameAction handles DOM events for use in games.
	 * @name GameAction
	 * @constructor GameAction
	 */
	
	/**
	 * A map of static constants for internal use
	 * @type {Object}
	 * @memberOf GameAction#
	 * @property {Number} NORMAL Normal behavior. The isPressed() method returns true as long as the key is held down.
	 * @property {Number} DETECT_INITAL_PRESS_ONLY Initial press behavior. The isPressed() method returns true only after the key is first pressed, and not again until the key is released and pressed again.
	 * @property {Number} STATE_RELEASED Value for released state
	 * @property {Number} STATE_PRESSED Value for pressed state
	 * @property {Number} STATE_WAITING_FOR_RELEASE Value for waiting for release state
	 * @property {Number} STATE_MOVED Value for moved state
	 */
	const statics = {
	  NORMAL: 0,
	  DETECT_INITAL_PRESS_ONLY: 1,
	  STATE_RELEASED: 0,
	  STATE_PRESSED: 1,
	  STATE_WAITING_FOR_RELEASE: 2,
	  STATE_MOVED: 3
	};
	
	class GameAction {
	  constructor(options = {}){
	    /**
	     * A name to reference the GameAction with
	     * @type {String}
	     * @memberOf GameAction#
	     * @default
	     */
	    this.name = null;
	
	    /**
	     * Whether or not to detect only the intial press of the game action
	     * @type {Number}
	     * @memberOf GameAction#
	     * @default
	     */
	    this.behavior = 0;
	
	    /**
	     * How many times the GameAction has been pressed
	     * @type {Number}
	     * @memberOf GameAction#
	     * @default
	     */
	    this.amount = 0;
	
	    /**
	     * The current state of the GameAction
	     * @type {Number}
	     * @memberOf GameAction#
	     * @default
	     */
	    this.state = 0;
	
	    this.statics = statics;
	
	    Object.assign(this, options);
	
	    this.reset();
	  }
	
	  /**
	   * Resets this GameAction so that it appears like it hasn't been pressed.
	   * @function
	   * @memberOf GameAction#
	   */
	  reset() {
	    this.state = statics.STATE_RELEASED;
	    this.amount = 0;
	  }
	
	  /**
	   * Taps this GameAction. Same as calling press() followed by release().
	   * @function
	   * @memberOf GameAction#
	   */
	  tap() {
	    this.press();
	    this.release();
	  }
	
	  /**
	   * Signals that the key was pressed.
	   * @function
	   * @memberOf GameAction#
	   */
	  press() {
	    this.state = statics.STATE_PRESSED;
	    if(this.behavior === statics.DETECT_INITAL_PRESS_ONLY){
	      this.pressAmt(1);
	    }
	  }
	
	  /**
	   * Signals that the key was pressed a specified number of times, or that the mouse move a specified distance.
	   * @function
	   * @memberOf GameAction#
	   * @param {Number} amount the number of times the key is pressed
	   */
	  pressAmt(amount) {
	    if (this.state !== statics.STATE_WAITING_FOR_RELEASE) {
	      this.amount += amount;
	      this.state = statics.STATE_WAITING_FOR_RELEASE;
	    }
	  }
	
	  /**
	   * Signals that the key was released
	   * @function
	   * @memberOf GameAction#
	   */
	  release() {
	    this.state = statics.STATE_RELEASED;
	  }
	
	  /**
	   * Returns whether the key was pressed or not since last checked.
	   * @function
	   * @memberOf GameAction#
	   * @return {Boolean} True if the key is pressed, else false
	   */
	  isPressed() {
	    if(this.state === statics.STATE_PRESSED){
	      return true;
	    } else {
	      return false;
	    }
	  }
	
	  /**
	   * For keys, this is the number of times the key was pressed since it was last checked.
	   * For mouse movement, this is the distance moved.
	   *
	   * This Resets the amount to zero after being checked!
	   *
	   * @function
	   * @memberOf GameAction#
	   * @return {Number} Number of times the key was pressed or distance mouse was moved
	   */
	  getAmount() {
	    var retVal = this.amount;
	    if (retVal !== 0) {
	      if (this.state === statics.STATE_RELEASED) {
	        this.amount = 0;
	      } else if (this.behavior === statics.DETECT_INITAL_PRESS_ONLY) {
	        this.state = statics.STATE_WAITING_FOR_RELEASE;
	        this.amount = 0;
	      }
	    }
	    return retVal;
	  }
	}
	
	module.exports = GameAction;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * A GameAction that handles Touch events
	 * @name TouchAction
	 * @constructor TouchAction
	 * @extends {GameAction}
	 */
	
	const GameAction = __webpack_require__(4);
	
	class TouchAction extends GameAction {
	  constructor(options = {}){
	    super(options);
	
	    /**
	     * Array of positions where touchstart happened
	     * @type {Array}
	     * @memberOf TouchAction#
	     * @default
	     */
	    this.startPositions = null;
	
	    /**
	     * Array of positions where touchend happened
	     * @type {Array}
	     * @memberOf TouchAction#
	     * @default
	     */
	    this.endPositions = null;
	
	    /**
	     * Array of positions where touchmove happened
	     * @type {Array}
	     * @memberOf TouchAction#
	     * @default
	     */
	    this.positions = null;
	
	    /**
	     * Wether any of the touch actions originated inside the canvas
	     * @type {Boolean}
	     * @memberOf TouchAction#
	     * @default
	     */
	    this.insideCanvas = null;
	
	    Object.assign(this, options);
	
	  }
	
	  /**
	   * Signals that the touch was initiated.
	   * @function
	   * @memberOf TouchAction#
	   * @param {Array} startPositions Array of points where touch was pressed
	   */
	  press(startPositions){
	    this.startPositions = startPositions;
	    this.positions = startPositions;
	    super.press(startPositions);
	  }
	
	  /**
	   * Signals that the touch was released
	   * @function
	   * @memberOf TouchAction#
	   * @param {Array} endPositions Array of points where touch was released
	   */
	  release(endPositions){
	    this.endPositions = endPositions;
	    super.release(endPositions);
	  }
	}
	
	module.exports = TouchAction;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * A GameAction that handles Mouse events
	 * @name MouseAction
	 * @constructor MouseAction
	 * @extends {GameAction}
	 */
	
	const GameAction = __webpack_require__(4);
	
	class MouseAction extends GameAction {
	  constructor(options = {}){
	    super(options);
	
	    /**
	     * Position where mousedown happened
	     * @type {Point}
	     * @memberOf MouseAction#
	     * @default
	     */
	    this.startPosition = null;
	
	    /**
	     * Position where mouseup happened
	     * @type {Point}
	     * @memberOf MouseAction#
	     * @default
	     */
	    this.endPosition = null;
	
	    /**
	     * Position where mousemove happened
	     * @type {Point}
	     * @memberOf MouseAction#
	     * @default
	     */
	    this.position = null;
	
	    /**
	     * Wether the mouse action originated inside the canvas
	     * @type {Boolean}
	     * @memberOf MouseAction#
	     * @default
	     */
	    this.insideCanvas = null;
	
	    Object.assign(this, options);
	
	  }
	
	  /**
	   * Signals that the mouse was pressed.
	   * @function
	   * @memberOf GameAction#
	   */
	  press(startPosition){
	    this.startPosition = startPosition;
	    this.position = startPosition;
	    super.press(startPosition);
	  }
	
	  /**
	   * Signals that the mouse was released
	   * @function
	   * @memberOf MouseAction#
	   * @param  {Point} endPosition The point where mouse was released
	   */
	  release(endPosition){
	    this.endPosition = endPosition || this.position;
	    super.release(endPosition);
	  }
	}
	
	module.exports = MouseAction;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	function insideCanvas(pt, canvas){
	  if((pt.x < 0) || (pt.x >  canvas.width) || (pt.y < 0) || (pt.y > canvas.height)){
	    return false;
	  } else {
	    return true;
	  }
	}
	
	module.exports = insideCanvas;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = {
	  CANCEL: 3,
	  HELP: 6,
	  BACK_SPACE: 8,
	  TAB: 9,
	  CLEAR: 12,
	  RETURN: 13,
	  ENTER: 14,
	  SHIFT: 16,
	  CONTROL: 17,
	  ALT: 18,
	  PAUSE: 19,
	  CAPS_LOCK: 20,
	  ESCAPE: 27,
	  SPACE: 32,
	  PAGE_UP: 33,
	  PAGE_DOWN: 34,
	  END: 35,
	  HOME: 36,
	  LEFT: 37,
	  UP: 38,
	  RIGHT: 39,
	  DOWN: 40,
	  PRINTSCREEN: 44,
	  INSERT: 45,
	  DELETE: 46,
	  NUM0: 48,
	  NUM1: 49,
	  NUM2: 50,
	  NUM3: 51,
	  NUM4: 52,
	  NUM5: 53,
	  NUM6: 54,
	  NUM7: 55,
	  NUM8: 56,
	  NUM9: 57,
	  SEMICOLON: 59,
	  EQUALS: 61,
	  A: 65,
	  B: 66,
	  C: 67,
	  D: 68,
	  E: 69,
	  F: 70,
	  G: 71,
	  H: 72,
	  I: 73,
	  J: 74,
	  K: 75,
	  L: 76,
	  M: 77,
	  N: 78,
	  O: 79,
	  P: 80,
	  Q: 81,
	  R: 82,
	  S: 83,
	  T: 84,
	  U: 85,
	  V: 86,
	  W: 87,
	  X: 88,
	  Y: 89,
	  Z: 90,
	  CONTEXT_MENU: 93,
	  NUMPAD0: 96,
	  NUMPAD1: 97,
	  NUMPAD2: 98,
	  NUMPAD3: 99,
	  NUMPAD4: 100,
	  NUMPAD5: 101,
	  NUMPAD6: 102,
	  NUMPAD7: 103,
	  NUMPAD8: 104,
	  NUMPAD9: 105,
	  MULTIPLY: 106,
	  ADD: 107,
	  SEPARATOR: 108,
	  SUBTRACT: 109,
	  DECIMAL: 110,
	  DIVIDE: 111,
	  F1: 112,
	  F2: 113,
	  F3: 114,
	  F4: 115,
	  F5: 116,
	  F6: 117,
	  F7: 118,
	  F8: 119,
	  F9: 120,
	  F10: 121,
	  F11: 122,
	  F12: 123,
	  F13: 124,
	  F14: 125,
	  F15: 126,
	  F16: 127,
	  F17: 128,
	  F18: 129,
	  F19: 130,
	  F20: 131,
	  F21: 132,
	  F22: 133,
	  F23: 134,
	  F24: 135,
	  NUM_LOCK: 144,
	  SCROLL_LOCK: 145,
	  UP_DPAD: 175,
	  DOWN_DPAD: 176,
	  LEFT_DPAD: 177,
	  RIGHT_DPAD: 178,
	  COMMA: 188,
	  PERIOD: 190,
	  SLASH: 191,
	  BACK_QUOTE: 192,
	  OPEN_BRACKET: 219,
	  BACK_SLASH: 220,
	  CLOSE_BRACKET: 221,
	  QUOTE: 222,
	  META: 224
	};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * The ResourceManager handles loading images and sounds for use in games.
	 * @name ResourceManager
	 * @constructor ResourceManager
	 */
	
	 'use strict';
	
	const has = __webpack_require__(10);
	const Sound = __webpack_require__(12);
	const WebAudio = __webpack_require__(13);
	
	var resourceList = {};
	
	//TODO: move these to its own module for unit testing?
	function normalizePath(baseDir, path){
	  var joinedPath = path;
	  if(baseDir){
	    joinedPath = [baseDir, path].join('/');
	  }
	  return joinedPath.replace(/\/{2,}/g, '/');
	}
	
	function flipX(image){
	  var offscreenCanvas = document.createElement('canvas');
	  offscreenCanvas.height = image.height;
	  offscreenCanvas.width = image.width;
	  var ctx = offscreenCanvas.getContext('2d');
	
	  ctx.translate(offscreenCanvas.width, 0);
	  ctx.scale(-1, 1);
	  ctx.drawImage(image, 0, 0);
	  return offscreenCanvas.toDataURL();
	}
	
	function flipY(image){
	  var offscreenCanvas = document.createElement('canvas');
	  offscreenCanvas.height = image.height;
	  offscreenCanvas.width = image.width;
	  var ctx = offscreenCanvas.getContext('2d');
	
	  ctx.translate(0, offscreenCanvas.height);
	  ctx.scale(1, -1);
	  ctx.drawImage(image, 0, 0);
	  return offscreenCanvas.toDataURL();
	}
	
	class ImageWrapper {
	  constructor(filename){
	    var self = this;
	    self.name = filename;
	    self.complete = false;
	    self.img = new Image();
	    self.img.addEventListener('load', function() {
	      self.complete = true;
	    }, false);
	  }
	
	  load(){
	    this.img.src = this.name;
	  }
	}
	
	
	class ResourceManager {
	
	  constructor(options = {}){
	
	    /**
	     * Whether all the resources have been loaded
	     * @type {Boolean}
	     * @memberOf ResourceManager#
	     * @default
	     */
	    this.allLoaded = false;
	
	    /**
	     * The base directory to load images from
	     * @type {String}
	     * @memberOf ResourceManager#
	     * @default
	     */
	    this.imageDir = null;
	
	    /**
	     * The base directory to load sounds from
	     * @type {String}
	     * @memberOf ResourceManager#
	     * @default
	     */
	    this.soundDir = null;
	
	    /**
	     * A map of all the resources by their URLs
	     * @type {Object}
	     * @memberOf ResourceManager#
	     * @default
	     */
	    this.resourceList = resourceList;
	
	    Object.assign(this, options);
	
	    // TODO not sure a better way
	    if(!this.Sound){
	      if(has('WebAudio')){
	        this.Sound = WebAudio;
	      }
	      else{
	        this.Sound = Sound;
	      }
	    }
	  }
	
	  /**
	   * Loads an image (or a collection of images), and tracks if it has finished loading
	   * @function
	   * @memberOf ResourceManager#
	   * @param {String|Array} files Filename of the image relative the Game's HTML page.
	   * @returns {Image|Array} Return type based on argument: Image if String or Array of Images if Array
	   */
	  loadImage(files){
	    let singleFile = false;
	    if(!Array.isArray(files)) {
	      singleFile = true;
	      files = [files];
	    }
	
	    const fileList = files.map((file) => {
	      const filename = normalizePath(this.imageDir, file);
	      //if we already have the image, just return it
	      if(this.resourceList[filename]){
	        return this.resourceList[filename].img;
	      }
	      this.allLoaded = false;
	
	      const wrapper = new ImageWrapper(filename);
	      // Need to explicitly call load because flipImage also uses this object
	      // which is probably a bad idea and should change in future
	      // TODO: different objects for flipped image and regular image
	      wrapper.load();
	      this.resourceList[filename] = wrapper;
	      return wrapper.img;
	    });
	
	    return singleFile ? fileList[0] : fileList;
	  }
	
	  /**
	   * Loads a sound file (or a collection of sound files), and tracks if it has finished loading
	   * @function
	   * @memberOf ResourceManager#
	   * @param {String|Array} filename Filename of the sound relative the Game's HTML page.
	   * @returns {Sound|Array} Return type based on argument: Sound Object if String or Array of Sound Objects if Array
	   */
	  loadSound(files){
	    let singleFile = false;
	    if(!Array.isArray(files)) {
	      singleFile = true;
	      files = [files];
	    }
	
	    const fileList = files.map((file) => {
	      const filename = normalizePath(this.soundDir, file);
	      //if we already have the sound, just return it
	      if(this.resourceList[filename]){
	        return this.resourceList[filename];
	      }
	      this.allLoaded = false;
	
	      const sound = new this.Sound(filename);
	      this.resourceList[filename] = sound;
	      return sound;
	    });
	
	    return singleFile ? fileList[0] : fileList;
	  }
	
	  /**
	   * Flips an image using the logic in a flip function passed and attaches to resource manager with name
	   * @function
	   * @memberOf ResourceManager#
	   * @param  {String|Number} name Name for caching flipped image
	   * @param  {Image} image Image to be flipped
	   * @param  {Function} flipFn Function containing logic to flip image
	   * @return {Image} Flipped image
	   */
	  flipImage(name, image, flipFn){
	    this.allLoaded = false;
	
	    const wrapper = new ImageWrapper(name);
	    this.resourceList[name] = wrapper;
	    const img2 = new Image();
	    function doFlip() {
	      wrapper.img.src = flipFn(img2);
	      img2.removeEventListener('load', doFlip);
	    }
	    img2.addEventListener('load', doFlip);
	    img2.src = image.src;
	
	    return wrapper.img;
	  }
	
	  /**
	   * Flip image along x-axis using default flip logic
	   * @function
	   * @memberOf ResourceManager#
	   * @param  {String|Number} name Name for caching flipped image
	   * @param  {Image} image Image to be flipped
	   * @return {Image} Flipped image
	   */
	  flipImageX(name, image){
	    return this.flipImage(name, image, flipX);
	  }
	
	  /**
	   * Flip image along the y-axis using default flip logic
	   * @function
	   * @memberOf ResourceManager#
	   * @param  {String|Number} name Name for caching flipped image
	   * @param  {Image} image Image to be flipped
	   * @return {Image} Flipped image
	   */
	  flipImageY(name, image){
	    return this.flipImage(name, image, flipY);
	  }
	
	  /**
	   * Checks whether the resources have finished loading
	   * @function
	   * @memberOf ResourceManager#
	   */
	  resourcesReady(){
	    if(this.allLoaded){
	      return true;
	    } else {
	      for(var filename in this.resourceList){
	        var resource = this.resourceList[filename];
	        if(!resource.complete){
	          return false;
	        }
	      }
	      this.allLoaded = true;
	      return true;
	    }
	  }
	
	  /**
	   * Gets the percent of resources loaded.
	   * @function
	   * @memberOf ResourceManager#
	   * @return {Number} The percent of resources loaded
	   */
	  getPercentComplete(){
	    var numComplete = 0.0;
	    var length = 0;
	    for(var filename in this.resourceList){
	      var resource = this.resourceList[filename];
	      length++;
	      if(resource.complete){
	        numComplete = numComplete + 1.0;
	      }
	    }
	    if(length === 0){
	      return 0;
	    } else {
	      return Math.round((numComplete / length) * 100.0);
	    }
	  }
	
	}
	
	module.exports = ResourceManager;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	// hacky simple implementation of has
	
	const globalAudioContext = __webpack_require__(11);
	
	
	function has(check){
	
	  if(check == 'shittySound'){
	    return !!((has('android') || has('ios')) && has('webkit'));
	  }
	  else if(check == 'android'){
	    return (parseFloat(navigator.userAgent.split("Android ")[1]) || undefined);
	  }
	  else if(check == 'ios'){
	    //TODO need something for this
	    return false;
	  }
	  else if(check == 'webkit'){
	    return (parseFloat(navigator.userAgent.split("WebKit/")[1]) || undefined);
	  }
	  else if(check == 'WebAudio'){
	    return !!global.AudioContext;
	  }
	  else if (check === 'touch') {
	    return 'ontouchstart' in document.documentElement;
	  }
	
	  return false;
	}
	
	module.exports = has;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	'use strict';
	
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	
	for(var x = 0; x < vendors.length && !window.AudioContext; ++x) {
	  window.AudioContext = window[vendors[x]+'AudioContext'];
	}
	
	module.exports = window.AudioContext;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	/**
	 * An Audio object that implements a generic API
	 * @name Sound
	 * @constructor Sound
	 */
	
	
	/**
	 * Map of audio types and codecs used in fallback loading of sounds <br>
	 * Reference: https://developer.mozilla.org/en-US/docs/HTML/Supported_media_formats
	 * @type {Object}
	 * @memberOf Sound#
	 * @property {String} 'audio/mpeg' '.mp3'
	 * @property {String} 'audio/webm' '.webm'
	 * @property {String} 'audio/ogg' '.ogg'
	 * @property {String} 'audio/wav' '.wav'
	 * @property {String} 'audio/aac' '.aac'
	 * @property {String} 'audio/x-m4a' '.m4a'
	 * @example
	 * // To override the default formats:
	 * // Do this before loading any sounds
	 * require([
	 *   'frozen/sounds/Sound'
	 * ], function(Sound){
	 *   Sound.prototype.formats = {
	 *     'audio/mpeg': '.mp3',
	 *     'audio/webm': '.webm'
	 *   };
	 * });
	 */
	const formats = {
	  'audio/mpeg': '.mp3',
	  'audio/webm': '.webm',
	  'audio/ogg': '.ogg',
	  'audio/wav': '.wav',
	  'audio/aac': '.aac',
	  'audio/x-m4a': '.m4a'
	};
	
	
	
	class Sound {
	  constructor(options = {}){
	
	    /**
	     * The name of the Audio object - typically the filename
	     * @type {String}
	     * @memberOf Sound#
	     * @default
	     */
	    this.name = null;
	
	    /**
	     * Signals if the Audio object has completed loading
	     * @type {Boolean}
	     * @memberOf Sound#
	     * @default
	     */
	    this.complete = false;
	
	    /**
	     * An array of extensions the browser "probably" can play
	     * @type {Array}
	     * @memberOf Sound#
	     * @default
	     */
	    this.probably = [];
	
	    /**
	     * An array of extensions the browser "maybe" can play
	     * @type {Array}
	     * @memberOf Sound#
	     * @default
	     */
	    this.maybe = [];
	
	    Object.assign(this, options);
	
	    this.formats = formats;
	
	    if(typeof options === 'string'){
	      this.load(options);
	    }
	  }
	
	  /**
	   * Load the sound by filename
	   * @function
	   * @memberOf Sound#
	   * @param  {String} filename The filename of the file to load
	   */
	  load(filename){
	    this.name = filename;
	    this.complete = true;
	  }
	
	  /**
	   * Loop the sound at a certain volume
	   * @function
	   * @memberOf Sound#
	   * @param  {Number} volume Value of volume - between 0 and 1
	   */
	  loop(volume){}
	
	  /**
	   * Play the sound at a certain volume and start time
	   * @function
	   * @memberOf Sound#
	   * @param  {Number} volume    Value of volume - between 0 and 1
	   * @param  {Number} startTime Value of milliseconds into the track to start
	   */
	  play(volume, startTime){}
	
	  /**
	   * Method used to construct Audio objects internally
	   * @function
	   * @memberOf Sound#
	   * @private
	   * @param  {Number} volume Value of volume - between 0 and 1
	   * @param  {Boolean} loop Whether or not to loop audio
	   * @return {Audio} Audio object that was constructed
	   */
	  _initAudio(volume, loop){}
	
	  /**
	   * Method used to generate a cache of extensions (probably/maybe arrays) to try loading
	   * @function
	   * @memberOf Sound#
	   * @private
	   * @return {String} First extension to try loading
	   */
	  _chooseFormat(){
	    if(!this.probably.length && !this.maybe.length){
	      // Figure out the best extension if we have no cache
	      var audio = new Audio();
	      var codec;
	      var result;
	      for(codec in this.formats){
	        result = audio.canPlayType(codec);
	        if(result === 'probably'){
	          this.probably.push(this.formats[codec]);
	          continue;
	        }
	
	        if(result === 'maybe'){
	          this.maybe.push(this.formats[codec]);
	          continue;
	        }
	      }
	    }
	
	    if(this.probably.length){
	      return this.probably[0];
	    }
	
	    if(this.maybe.length){
	      return this.maybe[0];
	    }
	
	    return '';
	  }
	
	  /**
	   * Method used to remove a extension that didn't work and return the next viable extension
	   * @function
	   * @memberOf Sound#
	   * @private
	   * @return {String} Next extension to try loading
	   */
	  _nextFormat(){
	    if(this.probably.length > 1){
	      this.probably.shift();
	      return this.probably[0];
	    }
	
	    if(this.probably.length === 1){
	      this.probably.length = 0;
	      if(this.maybe.length){
	        return this.maybe[0];
	      }
	    }
	
	    if(this.maybe.length > 1){
	      this.maybe.shift();
	      return this.maybe[0];
	    }
	
	    if(this.maybe.length === 1){
	      this.maybe.length = 0;
	    }
	
	    return '';
	  }
	
	}
	
	module.exports = Sound;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * An Audio object that implements WebAudio into a generic API
	 * @name WebAudio
	 * @constructor WebAudio
	 * @extends Sound
	 */
	
	const Sound = __webpack_require__(12);
	const removeExtension = __webpack_require__(14);
	const has = __webpack_require__(10);
	
	var audioContext = null;
	
	
	if(has('WebAudio')){
	  audioContext = new window.AudioContext();
	}
	
	if(has('shittySound')){
	  // Similar strategy to https://github.com/CreateJS/SoundJS
	  function handleShitty() {
	    const source = audioContext.createBufferSource();
	    source.buffer = audioContext.createBuffer(1, 1, 22050);
	    source.connect(audioContext.destination);
	    source.start(0);
	    document.removeEventListener('touchstart', handleShitty);
	  }
	  document.addEventListener('touchstart', handleShitty);
	}
	
	class WebAudio extends Sound {
	  constructor(options = {}){
	    super(options);
	
	    /**
	     * The WebAudio AudioContext - used to perform operations on a sound
	     * @type {AudioContext}
	     * @memberOf WebAudio#
	     * @default
	     */
	    this.audioContext = audioContext;
	
	    /**
	     * The sound buffer
	     * @type {Buffer}
	     * @memberOf WebAudio#
	     * @default
	     */
	    this.buffer = null;
	
	    Object.assign(this, options);
	  }
	
	  load(filename){
	    var self = this;
	
	    this.name = filename;
	
	    var basename = removeExtension(filename);
	    if(basename === filename){
	      filename = basename + this._chooseFormat();
	    }
	    // filename = req.toUrl(filename);
	
	    function decodeAudioData(e){
	      // Decode asynchronously
	      self.audioContext.decodeAudioData(e.target.response,
	        function(buffer){
	          self.buffer = buffer;
	          self.complete = true;
	        },
	        function(err){
	          var format = self._nextFormat();
	          if(format){
	            self.load(self.name);
	          } else {
	            self.complete = true;
	          }
	        }
	      );
	    }
	
	    // If the browser has AudioContext, it's new enough for XMLHttpRequest
	    var request = new XMLHttpRequest();
	    request.open('GET', filename, true);
	    request.responseType = 'arraybuffer';
	
	    request.onload = decodeAudioData;
	    request.send();
	  }
	
	  loop(volume){
	    // Return early if we don't have a buffer to protect from unloaded resources
	    if(!this.buffer){
	      return;
	    }
	
	    var audio = this._initAudio(volume, true);
	    audio.start(0);
	  }
	
	  play(volume, startTime){
	    // Return early if we don't have a buffer to protect from unloaded resources
	    if(!this.buffer){
	      return;
	    }
	
	    startTime = startTime || 0;
	
	    var audio = this._initAudio(volume, false);
	    audio.start(startTime);
	  }
	
	  _initAudio(volume, loop){
	    loop = typeof loop === 'boolean' ? loop : false;
	
	    var source = this.audioContext.createBufferSource();
	    source.buffer = this.buffer;
	    source.loop = loop;
	    if(volume){
	      var gainNode = this.audioContext.createGain();
	      gainNode.gain.value = volume;
	      source.connect(gainNode);
	      gainNode.connect(this.audioContext.destination);
	    } else {
	      source.connect(this.audioContext.destination);
	    }
	    return source;
	  }
	}
	
	module.exports = WebAudio;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	'use strict';
	
	function removeExtension(path){
	  // only strips off extensions that have length of 4 or less
	  // regex from http://stackoverflow.com/questions/1818310/regular-expression-to-remove-a-files-extension
	  return path.replace(/(.*)\.[^.]{1,4}$/, '');
	}
	
	module.exports = removeExtension;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Represents a series of frames that can be rendered as an animation.
	 * @name Animation
	 * @constructor Animation
	 */
	
	const AnimFrame = __webpack_require__(16);
	
	
	class Animation {
	  constructor(options = {}){
	
	    /**
	     * The index of the current frame being used to render this Animation
	     * @type {Number}
	     * @memberOf Animation#
	     * @default
	     */
	    this.currFrameIndex = 0;
	
	    /**
	     * The current number of milliseconds that this animation has been running
	     * @type {Number}
	     * @memberOf Animation#
	     * @default
	     */
	    this.animTime = 0;
	
	    /**
	     * The total number of milliseconds for a complete cycle
	     * @type {Number}
	     * @memberOf Animation#
	     * @default
	     */
	    this.totalDuration = 0;
	
	    /**
	     * The height in pixels
	     * @type {Number}
	     * @memberOf Animation#
	     * @default
	     */
	    this.height = 64;
	
	    /**
	     * The width in pixels
	     * @type {Number}
	     * @memberOf Animation#
	     * @default
	     */
	    this.width = 64;
	
	    /**
	     * The image to render
	     * @type {Image}
	     * @memberOf Animation#
	     * @default
	     */
	    this.image = null;
	
	    /**
	     * The offset of the of pixels in the x slot from the source image
	     * @type {Number}
	     * @memberOf Animation#
	     * @default
	     */
	    this.offsetX = 0;
	
	    /**
	     * The offset of the of pixels in the y slot from the source image
	     * @type {Number}
	     * @memberOf Animation#
	     * @default
	     */
	    this.offsetY = 0;
	
	    this.frames = undefined;
	
	
	    Object.assign(this, options);
	
	    this.start();
	  }
	
	  /**
	   * Used to create an animation from a sheet of tiles
	   * @function
	   * @memberOf Animation#
	   * @param  {Number} frameCount Number of frames in the animation
	   * @param  {Number|Array} frameTimes Value or array of values corresponding to amount of time per frame
	   * @param  {Image} img Image sheet to create animation from
	   * @param  {Number} w Width of each tile in pixels
	   * @param  {Number} h Height of each tile in pixels
	   * @param  {Number} ySlot Slot on Y axis to start creating tiles
	   * @return {Animation} Animation generated using parameters
	   */
	  createFromSheet(frameCount, frameTimes, img, w, h, ySlot){
	    var anim = new Animation({
	      image: img,
	      height: h,
	      width: w
	    });
	
	    var isFTArray = Array.isArray(frameTimes);
	
	    var currentFrameTime = 1;
	    if(!ySlot){
	      ySlot = 0;
	    }
	    for(var j = 0; j < frameCount; j++){
	      if(isFTArray){
	        currentFrameTime = frameTimes[j];
	      } else {
	        currentFrameTime = frameTimes;
	      }
	      anim.addFrame(currentFrameTime, j, ySlot);
	    }
	    return anim;
	  }
	
	  /**
	   * Creates a duplicate of this animation. The list of frames
	   * are shared between the two Animations, but each Animation
	   * can be animated independently.
	   * @function
	   * @memberOf Animation#
	   */
	  clone(){
	    return new Animation({
	      image: this.image,
	      frames: this.frames,
	      totalDuration: this.totalDuration
	    });
	  }
	
	  /**
	   * Adds an image to the animation with the specified duration (time to display the image).
	   * @function
	   * @memberOf Animation#
	   * @param {Number} duration Duration of the frame
	   * @param {Number} imageSlotX Slot on the X axis for the frame
	   * @param {Number} imageSlotY Slot on the Y axis for the frame
	   */
	  addFrame(duration, imageSlotX, imageSlotY){
	    if(!this.frames){
	      this.frames = [];
	    }
	    this.totalDuration += duration;
	    this.frames.push(new AnimFrame({
	      endTime: this.totalDuration,
	      image: this.image,
	      imgSlotX: imageSlotX,
	      imgSlotY: imageSlotY
	    }));
	  }
	
	  /**
	   * Starts this animation over from the beginning.
	   * @function
	   * @memberOf Animation#
	   */
	  start(){
	    this.animTime = 0;
	    this.currFrameIndex = 0;
	  }
	
	  /**
	   * Updates this animation's current image (frame), if neccesary.
	   * @function
	   * @memberOf Animation#
	   * @param {Number} elapsedTime Elapsed time in milliseconds
	   */
	  update(elapsedTime){
	    if (this.frames.length > 1) {
	      this.animTime += elapsedTime;
	
	      if (this.animTime >= this.totalDuration) {
	        this.animTime = this.animTime % this.totalDuration;
	        this.currFrameIndex = 0;
	      }
	
	      while (this.animTime > this.frames[this.currFrameIndex].endTime) {
	        this.currFrameIndex++;
	      }
	    }
	  }
	
	  /**
	   * Gets this Animation's current animation frame. Returns null if this animation has no frames.
	   * @function
	   * @memberOf Animation#
	   * @return {AnimationFrame|null} The animation frame at the current frame index or null if no frames are available
	   */
	  getCurrentFrame(){
	    if (this.frames.length === 0) {
	      return null;
	    } else {
	      return this.frames[this.currFrameIndex];
	    }
	  }
	
	  /**
	   * Draws the current frame into a 2d context.
	   * @function
	   * @memberOf Animation#
	   * @param {Context} context The HTML5 drawing canvas
	   * @param {Number} x The x coordinate in the graphics context
	   * @param {Number} y The y coordinate in the graphics context
	   */
	  draw(context, x, y){
	    var cf = this.getCurrentFrame();
	    context.drawImage(this.image, cf.imgSlotX * this.width + this.offsetX, cf.imgSlotY * this.height + this.offsetY, this.width, this.height, x, y, this.width, this.height);
	  }
	}
	
	module.exports = Animation;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	/**
	 * Represents a a single frame in an animation.
	 * @name AnimationFrame
	 * @constructor AnimationFrame
	 * @param {Object} mixin Object containing properties to mixin
	 */
	
	class AnimFrame {
	  constructor(options = {}){
	
	    /**
	     * The ending time in milliseconds of this frame relative to its Animation
	     * @type {Number}
	     * @memberOf AnimationFrame#
	     * @default
	     */
	    this.endTime = 0;
	
	    /**
	     * The horizontal position of the group of frames contained in a single image
	     * @type {Number}
	     * @memberOf AnimationFrame#
	     * @default
	     */
	    this.imgSlotX = 0;
	
	    /**
	     * The vertical position of the group of frames contained in a single image
	     * @type {Number}
	     * @memberOf AnimationFrame#
	     * @default
	     */
	    this.imgSlotY = 0;
	
	    /**
	     * The image to render
	     * @type {Image}
	     * @memberOf AnimationFrame#
	     * @default
	     */
	    this.image = null;
	
	    Object.assign(this, options);
	  }
	
	}
	
	module.exports = AnimFrame;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	const averagePoints = __webpack_require__(18);
	const degreesToRadians = __webpack_require__(19);
	const radiansToDegrees = __webpack_require__(20);
	const pointInPolygon = __webpack_require__(21);
	const distance = __webpack_require__(22);
	const degreesFromCenter = __webpack_require__(23);
	const radiansFromCenter = __webpack_require__(24);
	const scalePoints = __webpack_require__(25);
	const translatePoints = __webpack_require__(26);
	const insideCanvas = __webpack_require__(7);
	
	
	/**
	 * Math utility libraries
	 * @exports utils
	 */
	const utils = {
	  /**
	   * Gets the average point value in an array of points.
	   * @function
	   * @param {Array} points
	   * @return {Object} An object with x and y values
	   */
	  averagePoints,
	
	  /**
	   * Convert degrees to raidans
	   * @function
	   * @param {Number} degrees
	   * @return {Number} A value in radians
	   */
	  degreesToRadians,
	
	  /**
	   * Convert radians to degrees
	   * @function
	   * @param {Number} radians
	   * @return {Number} A value in degrees
	   */
	  radiansToDegrees,
	
	  /**
	   * Checks if a point is in a polygon
	   * @function
	   * @param {Object} point Object with an x and y value
	   * @param {Array} polygon Array of points
	   * @return {Boolean} True if the point is inside the polygon
	   */
	  pointInPolygon,
	
	  /**
	   * Returns the distance between 2 points
	   * @function
	   * @param {Object} point1 Object with an x and y value
	   * @param {Object} point2 Object with an x and y value
	   * @return {Number} The distance
	   */
	  distance,
	
	  /**
	   * Degrees a point is offset from a center point
	   * @function
	   * @param {Object} center Object with an x and y value
	   * @param {Object} point Object with an x and y value
	   * @return {Number} A value in degrees
	   */
	  degreesFromCenter,
	
	  /**
	   * Radians a point is offset from a center point
	   * @function
	   * @param {Object} center Object with an x and y value
	   * @param {Object} point Object with an x and y value
	   * @return {Number} A value in radians
	   */
	  radiansFromCenter,
	
	  /**
	   * Scale a point or array of points.
	   * @function
	   * @param {Object|Array} points A point or array of points
	   * @param {Object} scale Object with an x and y value
	   * @return {Object|Array} A scaled point or array of points
	   */
	  scalePoints,
	
	  /**
	   * Translate a point or array of points
	   * @function
	   * @param {Object|Array} points A point or array of points
	   * @param {Object} offset Object with an x and y value
	   * @return {Object|Array} A translated point or array of points
	   */
	  translatePoints,
	
	  /**
	   * Check whether a point is inside a canvas
	   * @function
	   * @param {Object} point A point to test
	   * @param {Object} canvas Object with height and width properties
	   * @return {Boolean} True if inside canvas else false
	   */
	  insideCanvas
	};
	
	module.exports = utils;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	
	function averagePoints(points){
	  var retVal = {x: 0, y: 0};
	  points.forEach(points, function(point){
	    retVal.x+= point.x;
	    retVal.y+= point.y;
	  });
	  retVal.x = retVal.x / points.length;
	  retVal.y = retVal.y / points.length;
	  return retVal;
	}
	
	module.exports = averagePoints;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	const radConst = Math.PI / 180.0;
	
	function degreesToRadians(degrees){
	  return degrees * radConst;
	}
	
	module.exports = degreesToRadians;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	'use strict';
	
	const degConst = 180.0 / Math.PI;
	
	function radiansToDegrees(radians){
	  return radians * degConst;
	}
	
	module.exports = radiansToDegrees;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

	'use strict';
	
	// Using Ray-Casting formula based on
	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	// and https://github.com/substack/point-in-polygon/
	// Re-written for most readability and for use with point objects instead of arrays
	
	function pointInPoly(point, polygon){
	  if(!point || !polygon){
	    return false;
	  }
	
	  var poly = polygon.points || polygon;
	
	  var insidePoly = false;
	  var j = poly.length - 1;
	
	  for(var i = 0; i < poly.length; j = i++){
	    var xi = poly[i].x;
	    var yi = poly[i].y;
	    var xj = poly[j].x;
	    var yj = poly[j].y;
	
	    if(yi > point.y !== yj > point.y){
	      if(point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi){
	        insidePoly = !insidePoly;
	      }
	    }
	  }
	
	  return insidePoly;
	}
	
	module.exports = pointInPoly;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

	function distance(p1, p2){
	  return Math.sqrt( ((p2.x - p1.x) * (p2.x - p1.x)) + ((p2.y - p1.y) * (p2.y - p1.y)) );
	}
	
	module.exports = distance;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	const radiansToDegrees = __webpack_require__(20);
	const radiansFromCenter = __webpack_require__(24);
	
	function degreesFromCenter(center, pt){
	  return radiansToDegrees(radiansFromCenter(center, pt));
	}
	
	module.exports = degreesFromCenter;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	'use strict';
	
	const origin = {x: 0.0, y: 0.0};
	
	function radiansFromCenter(center, pt){
	
	  //if null or zero is passed in for center, we'll use the origin
	  center = center || origin;
	
	  //same point
	  if((center.x === pt.x) && (center.y === pt.y)){
	    return 0;
	  }else if(center.x === pt.x){
	    if(center.y > pt.y){
	      return 0;
	    }else{
	      return Math.PI;
	    }
	  }else if(center.y === pt.y){
	    if(center.x > pt.x){
	      return 1.5 * Math.PI;
	    }else{
	      return Math.PI / 2;
	    }
	  }else if((center.x < pt.x) && (center.y > pt.y)){
	    //quadrant 1
	    //console.log('quad1',center.x,center.y,pt.x,pt.y,'o',pt.x - center.x,'a',pt.y - center.y);
	    return Math.atan((pt.x - center.x)/(center.y - pt.y));
	  }
	  else if((center.x < pt.x) && (center.y < pt.y)){
	    //quadrant 2
	    //console.log('quad2',center.x,center.y,pt.x,pt.y);
	    return Math.PI / 2 + Math.atan((pt.y - center.y)/(pt.x - center.x));
	  }
	  else if((center.x > pt.x) && (center.y < pt.y)){
	    //quadrant 3
	    //console.log('quad3',center.x,center.y,pt.x,pt.y);
	    return Math.PI + Math.atan((center.x - pt.x)/(pt.y - center.y));
	  }
	  else{
	    //quadrant 4
	    //console.log('quad4',center.x,center.y,pt.x,pt.y);
	    return 1.5 * Math.PI + Math.atan((center.y - pt.y)/(center.x - pt.x));
	  }
	
	}
	
	module.exports = radiansFromCenter;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

	
	function scalePoints(points, scale){
	  if(Array.isArray(points)){
	    points = points.map(function(point){
	      return scalePoints(point, scale);
	    });
	  } else if(typeof scale === 'object'){
	    points = {
	      x: points.x * scale.x,
	      y: points.y * scale.y
	    };
	  } else {
	    points = {
	      x: points.x * scale,
	      y: points.y * scale
	    };
	  }
	  return points;
	}
	
	module.exports = scalePoints;


/***/ }),
/* 26 */
/***/ (function(module, exports) {

	
	function translatePoints(points, translation){
	  if(Array.isArray(points)){
	    points = points.map(function(point){
	      return translatePoints(point, translation);
	    });
	  } else {
	    points = {
	      x: points.x,
	      y: points.y
	    };
	
	    if(translation.x != null){
	      points.x += translation.x;
	    }
	
	    if(translation.y != null){
	      points.y += translation.y;
	    }
	  }
	  return points;
	}
	
	module.exports = translatePoints;


/***/ }),
/* 27 */
/***/ (function(module, exports) {

	/**
	 * The Sprite class represents a simple animated character for a game
	 * @name Sprite
	 * @constructor Sprite
	 */
	
	class Sprite {
	  constructor(options = {}){
	
	    /**
	     * The x position of the sprite in pixels
	     * @type {Number}
	     * @memberOf Sprite#
	     * @default
	     */
	    this.x = 0.0;
	
	    /**
	     * The y position of the sprite in pixels
	     * @type {Number}
	     * @memberOf Sprite#
	     * @default
	     */
	    this.y = 0.0;
	
	    /**
	     * The x component of the velocity in pixels per second
	     * @type {Number}
	     * @memberOf Sprite#
	     * @default
	     */
	    this.dx = 0.0;
	
	    /**
	     * The y component of the velocity in pixels per second
	     * @type {Number}
	     * @memberOf Sprite#
	     * @default
	     */
	    this.dy = 0.0;
	
	    /**
	     * The max speed a sprite can move in either direction
	     * @type {Number}
	     * @memberOf Sprite#
	     * @default
	     */
	    this.maxSpeed = 0.0;
	
	    /**
	     * The name of this Sprite
	     * @type {String}
	     * @memberOf Sprite#
	     * @default
	     */
	    this.name = null;
	
	    /**
	     * The radius of this sprite in pixels for simple collision detection
	     * @type {Number}
	     * @memberOf Sprite#
	     * @default
	     */
	    this.collisionRadius = 40;
	
	    Object.assign(this, options);
	  }
	
	  /**
	   * Updates this Sprite's Animation and its position based on the velocity.
	   * @function
	   * @memberOf Sprite#
	   * @param {Number} elapsedTime The elapsed time in milliseconds since the previous update
	   */
	  update(elapsedTime){
	    this.x += this.dx * elapsedTime;
	    this.y += this.dy * elapsedTime;
	    this.anim.update(elapsedTime);
	  }
	
	  /**
	   * Returns the maxSpeed up to the speed limit
	   * @function
	   * @memberOf Sprite#
	   * @param {Number} v Speed limit
	   * @return {Number} maxSpeed up to speed limit
	   */
	  limitSpeed(v){
	    if(this.maxSpeed){
	      if(Math.abs(v) > this.maxSpeed){
	        if(v > 0){
	          return this.maxSpeed;
	        }else if(v < 0){
	          return this.maxSpeed;
	        }else{
	          return  0;
	        }
	      }else{
	        return v;
	      }
	    }else{
	      return v;
	    }
	  }
	
	  /**
	   * Gets this Sprite's current animation frame.
	   * @function
	   * @memberOf Sprite#
	   * @return {AnimationFrame} The current frame of the Animation
	   */
	  getCurrentFrame(){
	    if(this.anim){
	      return this.anim.getCurrentFrame();
	    }
	  }
	
	  /**
	   * Draws the sprite
	   * @function
	   * @memberOf Sprite#
	   * @param {Context} context The HTML5 drawing context
	   */
	  draw(context){
	    if(this.anim){
	      this.anim.draw(context, this.x, this.y);
	    }
	  }
	
	  /**
	   * Clones the instance of Sprite it is called upon
	   * @function
	   * @memberOf Sprite#
	   * @return {Sprite} A clone of the Sprite
	   */
	  clone() {
	    return new Sprite({
	      anim: this.anim.clone()
	    });
	  }
	}
	
	module.exports = Sprite;
	


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This type of sprite is based off of the excellent images from Reiner's tilesets: http://www.reinerstilesets.de/
	 * <br>
	 * creatures have walking, idle, and dying animations in 8 isometric directions
	 * The animations directions are in E,N,NE,NW,S,SE,SW,W (alphabetical) order simply because that's
	 * how they were stitched together using ImageMagick.
	 *
	 * @name Creature
	 * @constructor Creature
	 * @extends Sprite
	 */
	
	const Sprite = __webpack_require__(27);
	const Animation = __webpack_require__(15);
	
	
	/**
	* A map of static constants for internal use
	* @type {Object}
	* @memberOf Creature#
	* @property {Number} EAST a direction the creature can face
	* @property {Number} NORTH a direction the creature can face
	* @property {Number} NORTHEAST a direction the creature can face
	* @property {Number} NORTHWEST a direction the creature can face
	* @property {Number} SOUTH a direction the creature can face
	* @property {Number} SOUTHEAST a direction the creature can face
	* @property {Number} SOUTHWEST a direction the creature can face
	* @property {Number} WEST a direction the creature can face
	* @property {Number} STATE_WALKING a state the creature can be in
	* @property {Number} STATE_DYING a state the creature can be in
	* @property {Number} STATE_IDLE a state the creature can be in
	*/
	const EAST = 0;
	const NORTH = 1;
	const NORTHEAST = 2;
	const NORTHWEST = 3;
	const SOUTH = 4;
	const SOUTHEAST = 5;
	const SOUTHWEST = 6;
	const WEST = 7;
	const STATE_WALKING = 0;
	const STATE_DYING = 1;
	const STATE_IDLE = 2;
	
	
	class Creature extends Sprite {
	  constructor(options = {}){
	    super(options);
	
	    /**
	    * The current state of the creature. Will be a value from the static constants.
	    * @type {Number}
	    * @memberOf Creature#
	    * @default
	    */
	    this.state = STATE_IDLE;
	
	    /**
	    * An array of Animation objects (one for each direction) to display the creature in a walking state
	    * @type {Array}
	    * @memberOf Creature#
	    * @default
	    */
	    this.walkingAnims = [];
	
	    /**
	    * An array of Animation objects (one for each direction) to display the creature in a dying state
	    * @type {Array}
	    * @memberOf Creature#
	    * @default
	    */
	    this.dyingAnims = [];
	
	    /**
	    * An array of Animation objects (one for each direction) to display the creature in an idle state
	    * @type {Array}
	    * @memberOf Creature#
	    * @default
	    */
	    this.idleAnims = [];
	
	    /**
	    * The current direction that the creature is pointed. Will be a value from the static constansts.
	    * @type {Number}
	    * @memberOf Creature#
	    * @default
	    */
	    this.direction = EAST;
	
	    Object.assign(this, options);
	  }
	
	  /**
	   * Updates this creature's current direction (frame), and changes which animation it should be using if neccesary.
	   * @function
	   * @memberOf Creature#
	   * @param {Number} elapsedTime Elapsed time in milliseconds
	   */
	  updateDirection(elapsedTime){
	    this.x += this.dx * elapsedTime;
	    this.y += this.dy * elapsedTime;
	
	    if(this.state !== this.statics.STATE_DYING){
	      if(this.dx > 0 && this.dy === 0){
	        this.direction = this.statics.EAST;
	      } else if(this.dx === 0 && this.dy < 0){
	        this.direction = this.statics.NORTH;
	      } else if(this.dx > 0 && this.dy < 0){
	        this.direction = this.statics.NORTHEAST;
	      } else if(this.dx < 0 && this.dy < 0){
	        this.direction = this.statics.NORTHWEST;
	      } else if(this.dx === 0 && this.dy > 0){
	        this.direction = this.statics.SOUTH;
	      } else if(this.dx > 0 && this.dy > 0){
	        this.direction = this.statics.SOUTHEAST;
	      } else if(this.dx < 0 && this.dy > 0){
	        this.direction = this.statics.SOUTHWEST;
	      } else if(this.dx < 0 && this.dy === 0){
	        this.direction = this.statics.WEST;
	      }
	
	      if(this.dx === 0 && this.dy === 0){
	        this.state = this.statics.STATE_IDLE;
	      } else {
	        this.state = this.statics.STATE_WALKING;
	      }
	    }
	  }
	
	  /**
	   * Updates this creature's current animation.
	   * @function
	   * @memberOf Creature#
	   * @param {Number} elapsedTime Elapsed time in milliseconds
	   */
	  updateAnimations(elapsedTime){
	    if(this.state === this.statics.STATE_WALKING){
	      this.anim = this.walkingAnims[this.direction];
	    } else if(this.state === this.statics.STATE_DYING){
	      this.anim = this.dyingAnims[this.direction];
	    } else {
	      this.anim = this.idleAnims[this.direction];
	    }
	    this.anim.update(elapsedTime);
	  }
	
	  /**
	   * Used to create animations from a sheet of tiles
	   * @function
	   * @memberOf Creature#
	   * @param  {Number} frameCount Number of frames in the animation
	   * @param  {Number|Array} frameTimes Value or array of values corresponding to amount of time per frame
	   * @param  {Image} img Image sheet to create animation from
	   * @param  {Number} w Width of each tile in pixels
	   * @param  {Number} h Height of each tile in pixels
	   * @param  {Number} ySlot Slot on Y axis to start creating tiles
	   * @return {Array} Array of Animations generated using parameters
	   */
	  createAnimations(frameCount, frameTimes, img, h, w, ySlot){
	    var anims = [];
	    var isFTArray = Array.isArray(frameTimes);
	    var currentFrameTime = 1;
	    if(!ySlot){
	      ySlot = 0;
	    }
	    for(var i = 0; i < 8; i++){
	      anims[i] = new Animation({
	        height: h,
	        width: w,
	        image: img
	      });
	      for(var j = 0; j < frameCount; j++){
	        if(isFTArray){
	          currentFrameTime = frameTimes[j];
	        } else {
	          currentFrameTime = frameTimes;
	        }
	        anims[i].addFrame(currentFrameTime, j + frameCount * i, ySlot);
	      }
	    }
	    return anims;
	  }
	}
	
	module.exports = Creature;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	const Circle = __webpack_require__(30);
	const MultiPolygon = __webpack_require__(32);
	const Polygon = __webpack_require__(33);
	const Rectangle = __webpack_require__(34);
	
	var entities = {
	  Circle,
	  MultiPolygon,
	  Polygon,
	  Rectangle
	};
	
	module.exports = entities;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This represents a Circle body and shape in a Box2d world
	 * @name Circle
	 * @constructor Circle
	 * @extends Entity
	 */
	
	const Entity = __webpack_require__(31);
	const distance = __webpack_require__(22);
	
	class Circle extends Entity{
	  constructor(options = {}){
	    super(options);
	
	    /**
	     * The radius of this circle.
	     * @type {Number}
	     * @memberOf Circle#
	     * @default
	     */
	    this.radius = 1;
	
	    Object.assign(this, options);
	  }
	
	  /**
	   * Draws the Circle at a given scale
	   * @function
	   * @memberOf Circle#
	   * @param {Context} ctx The drawing context
	   * @param {Number} scale The scale at which to draw
	   */
	  draw(ctx, scale){
	    scale = scale || this.scale || 1;
	    var ogLineWidth = ctx.lineWidth;
	    ctx.lineWidth = this.lineWidth;
	    ctx.fillStyle = this.fillStyle;
	    ctx.strokeStyle = this.strokeStyle;
	    ctx.beginPath();
	    ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, true);
	    ctx.closePath();
	    ctx.fill();
	    ctx.stroke();
	
	    if(!this.staticBody){
	      ctx.save();
	      ctx.translate(this.x * scale, this.y * scale);
	      ctx.rotate(this.angle);
	      ctx.translate(-(this.x) * scale, -(this.y) * scale);
	      ctx.beginPath();
	      ctx.moveTo(this.x * scale, this.y * scale);
	      ctx.lineTo(this.x * scale, (this.y * scale) - (this.radius * scale));
	      ctx.closePath();
	      ctx.stroke();
	      ctx.restore();
	    }
	    ctx.lineWidth = ogLineWidth;
	
	    super.draw(ctx, scale);
	  }
	
	  /**
	   * Scale this shape
	   * @function
	   * @memberOf Circle#
	   * @param {Number} scale The amount the shape should scale
	   */
	  scaleShape(scale){
	    this.radius = this.radius * scale;
	    super.scaleShape(scale);
	  }
	
	
	  /**
	   * Checks if a given point is contained within this Circle.
	   * @function
	   * @memberOf Circle#
	   * @param {Object} point An object with x and y values.
	   * @return {Boolean} True if point is in shape else false
	   */
	  pointInShape(point){
	    return (distance(point, this) <= this.radius);
	  }
	
	}
	
	module.exports = Circle;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

	function genId() {
	  return Math.random() + '_' + Date.now();
	}
	
	/**
	 * This represents a body and shape in a Box2d world using positions and sizes relative to the Box2d world instance.
	 * @name Entity
	 * @constructor Entity
	 */
	
	class Entity {
	  constructor(options = {}){
	
	    /**
	     * The id in which to reference this object. Also the userData property for box2d bodies.
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.id = options.id || genId();
	
	    /**
	     * The x component of the entity's location
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.x = 0;
	
	    /**
	     * The y component of the entity's location
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.y = 0;
	
	    /**
	     * The scale in pixels per meter in which to represent this Entity in the box2d world
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.scale = null;
	
	    /**
	     * The current angle that this entity is rotated at
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.angle = 0;
	
	    /**
	     * The x and y locations of what box2d considers the enity's center of mass
	     * @type {Point}
	     * @memberOf Entity#
	     * @default
	     */
	     this.center = null;
	
	    /**
	     * Whether to draw the center point of an entity
	     * @type {Boolean}
	     * @memberOf Entity#
	     * @default true
	     */
	     this.drawCenter = true;
	
	    /**
	     * The percentage of force in which the entity will bounce back from another based on its force pre-collision
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.restitution = 0.3;
	
	    /**
	     * The two-dimensional density of the entity.  Mass / area.
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.density = 1.0;
	
	    /**
	     * The amount of friction on th surface of this entity
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.friction = 0.9;
	
	    /**
	     * The amount of linear velocity the entity should lose over time
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.linearDamping = 0;
	
	    /**
	     * The velocity in meters/second given to this entity by box2d calculations
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.linearVelocity = null;
	
	    /**
	     * The angular velocity in radians/second given to this entity by box2d calculations
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.angularVelocity = 0;
	
	    /**
	     * The of amount of angular velocity an entity should lose over time
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.angularDamping = 0;
	
	    /**
	     * If true, the entity does change its position and angle as the result of box2d calculations
	     * @type {Boolean}
	     * @memberOf Entity#
	     * @default
	     */
	     this.staticBody = false;
	
	    /**
	     * The fillStyle to use for the entity's default renderer
	     * @type {String}
	     * @memberOf Entity#
	     * @default
	     */
	     this.fillStyle = 'rgba(128,128,128,0.5)';
	
	    /**
	     * The strokeStyle to use for the entity's default renderer
	     * @type {String}
	     * @memberOf Entity#
	     * @default
	     */
	     this.strokeStyle = '#000';
	
	    /**
	     * The line width to use for the entity's default renderer
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.lineWidth = 1;
	
	    /**
	     * The 16 bit integer used in determining which other types of entities this body will collide with.
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.maskBits = null;
	
	    /**
	     * The 16 bit integer used in describing the type that this enitity is for collisions.
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.categoryBits = null;
	
	    /**
	     * The 16 bit integer used in overiding maskBits and categoryBits for collision detection.
	     * @type {Number}
	     * @memberOf Entity#
	     * @default
	     */
	     this.groupIndex = null;
	
	    Object.assign(this, options);
	  }
	
	  /**
	   * Update this entity with the state passed in
	   * @function
	   * @memberOf Entity#
	   * @param {Object} state State to merge with this object
	   */
	  update(state){
	    Object.assign(this, state);
	  }
	
	  /**
	   * Draws the Entity at a given scale
	   * @function
	   * @memberOf Entity#
	   * @param {Context} ctx The HTML5 2d drawing context
	   * @param {Number} scale The scale to draw the entity at
	   */
	  draw(ctx, scale){
	    scale = scale || this.scale || 1;
	    var ogLineWidth = ctx.lineWidth;
	    ctx.lineWidth = this.lineWidth;
	    // black circle in entity's location
	    ctx.fillStyle = this.strokeStyle;
	    ctx.beginPath();
	    ctx.arc(this.x * scale, this.y * scale, 4, 0, Math.PI * 2, true);
	    ctx.closePath();
	    ctx.fill();
	
	    // yellow circle in entity's geometric center
	    if(this.center && this.drawCenter){
	      ctx.fillStyle = this.centerStyle || 'yellow';
	      ctx.beginPath();
	      ctx.arc(this.center.x * scale, this.center.y * scale, 2, 0, Math.PI * 2, true);
	      ctx.closePath();
	      ctx.fill();
	    }
	
	    ctx.lineWidth = ogLineWidth;
	  }
	
	  /**
	   * Scales the position and dimensions of this shape.
	   * @function
	   * @memberOf Entity#
	   * @param {Number} scale The scale to multiply the dimentions by
	   */
	  scaleShape(scale){
	    this.x = this.x * scale;
	    this.y = this.y * scale;
	    this.alreadyScaled = true;
	  }
	}
	
	module.exports = Entity;
	


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This Entity is for building complex and possibly concave shapes
	 * @name MultiPolygon
	 * @constructor MultiPolygon
	 * @extends Entity
	 */
	
	const Entity = __webpack_require__(31);
	const scalePoints = __webpack_require__(25);
	const pointInPolygon = __webpack_require__(21);
	const translatePoints = __webpack_require__(26);
	
	class MultiPolygon extends Entity {
	  constructor(options = {}){
	    super(options);
	
	    /**
	     * An array of polygons
	     * @type {Array}
	     * @memberOf MultiPolygon#
	     * @default
	     */
	    this.polys = [];
	
	    Object.assign(this, options);
	  }
	
	  /**
	   * Draws each polygon in the entity
	   * @function
	   * @memberOf MultiPolygon#
	   * @param {Context} ctx the HTML5 2d drawing context
	   * @param {Number} scale the scale to draw the entity at
	   */
	  draw(ctx, scale){
	    scale = scale || this.scale || 1;
	    var ogLineWidth = ctx.lineWidth;
	    ctx.lineWidth = this.lineWidth;
	    ctx.save();
	    ctx.translate(this.x * scale, this.y * scale);
	    ctx.rotate(this.angle);
	    ctx.translate(-(this.x) * scale, -(this.y) * scale);
	    ctx.fillStyle = this.fillStyle;
	    ctx.strokeStyle = this.strokeStyle;
	
	    for(var j = 0; j < this.polys.length; j++){
	      ctx.beginPath();
	      ctx.moveTo((this.x + this.polys[j][0].x) * scale, (this.y + this.polys[j][0].y) * scale);
	      for (var i = 1; i < this.polys[j].length; i++) {
	         ctx.lineTo((this.polys[j][i].x + this.x) * scale, (this.polys[j][i].y + this.y) * scale);
	      }
	      ctx.lineTo((this.x + this.polys[j][0].x) * scale, (this.y + this.polys[j][0].y) * scale);
	      ctx.closePath();
	      ctx.fill();
	      ctx.stroke();
	    }
	
	    ctx.restore();
	    ctx.lineWidth = ogLineWidth;
	    super.draw(ctx, scale);
	  }
	
	  /**
	   * Scale this shape
	   * @function
	   * @memberOf MultiPolygon#
	   * @param {Number} scale The amount the shape should scale
	   */
	  scaleShape(scale){
	    this.polys = scalePoints(this.polys, scale);
	    sup.scaleShape(scale);
	  }
	
	  /**
	   * Checks if a given point is contained within this MultiPolygon.
	   * @function
	   * @memberOf MultiPolygon#
	   * @param {Object} point An object with x and y values.
	   * @return {Boolean} True if point is in shape else false
	   */
	  pointInShape(point){
	    for(var j = 0; j < this.polys.length; j++){
	      if(pointInPolygon(point, translatePoints(this.polys[j], this))){
	        return true;
	      }
	    }
	    return false;
	  }
	}
	
	
	module.exports = MultiPolygon;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This Entity represents a polygon which is build from an array of points.
	 * @name Polygon
	 * @constructor Polygon
	 * @extends Entity
	 */
	
	const Entity = __webpack_require__(31);
	const scalePoints = __webpack_require__(25);
	const pointInPolygon = __webpack_require__(21);
	const translatePoints = __webpack_require__(26);
	
	class Polygon extends Entity {
	  constructor(options = {}){
	    super(options);
	
	    /**
	     * An array of objects that have x and y values.
	     * @type {Array}
	     * @memberOf Polygon#
	     * @default
	     */
	    this.points = [];
	
	    Object.assign(this, options);
	  }
	
	  /**
	   * Draws the Polygon at a given scale
	   * @function
	   * @memberOf Polygon#
	   * @param {Context} ctx The drawing context
	   * @param {Number} scale The scale at which to draw
	   */
	  draw(ctx, scale){
	    scale = scale || this.scale || 1;
	    var ogLineWidth = ctx.lineWidth;
	    ctx.lineWidth = this.lineWidth;
	    ctx.save();
	    ctx.translate(this.x * scale, this.y * scale);
	    ctx.rotate(this.angle);
	    ctx.translate(-(this.x) * scale, -(this.y) * scale);
	    ctx.fillStyle = this.fillStyle;
	    ctx.strokeStyle = this.strokeStyle;
	
	    ctx.beginPath();
	    ctx.moveTo((this.x + this.points[0].x) * scale, (this.y + this.points[0].y) * scale);
	    for (var i = 1; i < this.points.length; i++) {
	       ctx.lineTo((this.points[i].x + this.x) * scale, (this.points[i].y + this.y) * scale);
	    }
	    ctx.lineTo((this.x + this.points[0].x) * scale, (this.y + this.points[0].y) * scale);
	    ctx.closePath();
	    ctx.fill();
	    ctx.stroke();
	
	    ctx.restore();
	    ctx.lineWidth = ogLineWidth;
	    super.draw(ctx, scale);
	  }
	
	  /**
	   * Scale this shape
	   * @function
	   * @memberOf Polygon#
	   * @param {Number} scale The amount the shape should scale
	   */
	  scaleShape(scale){
	    this.points = scalePoints(this.points, scale);
	    super.scaleShape(scale);
	  }
	
	  /**
	   * Checks if a given point is contained within this Polygon.
	   * @function
	   * @memberOf Polygon#
	   * @param {Object} point An object with x and y values.
	   * @return {Boolean} True if point is in shape else false
	   */
	  pointInShape(point){
	    return pointInPolygon(point, translatePoints(this.points, this));
	  }
	}
	
	module.exports = Polygon;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This Entity represents a Rectangle
	 * @name Rectangle
	 * @constructor Rectangle
	 * @extends Entity
	 */
	
	const Entity = __webpack_require__(31);
	
	class Rectangle extends Entity {
	  constructor(options = {}){
	    super(options);
	
	    /**
	     * Half of the Rectangle's total width
	     * @type {Number}
	     * @memberOf Rectangle#
	     * @default
	     */
	    this.halfWidth = 1;
	    /**
	     * Half of the Rectangle's total width
	     * @type {Number}
	     * @memberOf Rectangle#
	     * @default
	     */
	    this.halfHeight = 1;
	
	    Object.assign(this, options);
	  }
	
	  /**
	   * Draws the Rectangle at a given scale
	   * @function
	   * @memberOf Rectangle#
	   * @param {Context} ctx The drawing context
	   * @param {Number} scale The scale at which to draw
	   */
	  draw(ctx, scale){
	    scale = scale || this.scale || 1;
	    var ogLineWidth = ctx.lineWidth;
	    ctx.lineWidth = this.lineWidth;
	    ctx.save();
	    ctx.translate(this.x * scale, this.y * scale);
	    ctx.rotate(this.angle);
	    ctx.translate(-(this.x) * scale, -(this.y) * scale);
	    ctx.fillStyle = this.fillStyle;
	    ctx.strokeStyle = this.strokeStyle;
	    ctx.fillRect(
	      (this.x-this.halfWidth) * scale,
	      (this.y-this.halfHeight) * scale,
	      (this.halfWidth*2) * scale,
	      (this.halfHeight*2) * scale
	    );
	    ctx.strokeRect(
	      (this.x-this.halfWidth) * scale,
	      (this.y-this.halfHeight) * scale,
	      (this.halfWidth*2) * scale,
	      (this.halfHeight*2) * scale
	    );
	    ctx.restore();
	    ctx.lineWidth = ogLineWidth;
	    super.draw(ctx, scale);
	  }
	
	  /**
	   * Scale this shape
	   * @function
	   * @memberOf Rectangle#
	   * @param {Number} scale The amount the shape should scale
	   */
	  scaleShape(scale){
	    this.halfHeight = this.halfHeight * scale;
	    this.halfWidth = this.halfWidth * scale;
	    super.scaleShape(scale);
	  }
	
	  /**
	   * Checks if a given point is contained within this Rectangle.
	   * @function
	   * @memberOf Rectangle#
	   * @param {Object} point An object with x and y values.
	   * @return {Boolean} True if point is in shape else false
	   */
	  pointInShape(point){
	    return ((point.x >= (this.x - this.halfWidth)) && (point.x <= (this.x + this.halfWidth)) && (point.y >= (this.y - this.halfHeight)) && (point.y <= (this.y + this.halfHeight)));
	  }
	}
	
	module.exports = Rectangle;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	const Distance = __webpack_require__(36);
	const Prismatic = __webpack_require__(38);
	const Revolute = __webpack_require__(39);
	
	var joints = {
	  Distance,
	  Prismatic,
	  Revolute
	};
	
	module.exports = joints;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This represents a distance joint between two bodies.
	 * This type of joint forces two bodies to keep a constant distance for each other.
	 * @name Distance
	 * @constructor Distance
	 * @extends Joint
	 */
	
	const Joint = __webpack_require__(37);
	
	
	// box2d globals
	const B2Vec2 = Box2D.Common.Math.b2Vec2;
	const B2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
	
	class Distance extends Joint {
	  constructor(options = {}){
	    super(options);
	
	    /**
	     * A point on the second entity where the joint will be attached. If no point is specified, the second body will be attached at its center point.
	     * @type {Object}
	     * @memberOf Distance#
	     * @default
	     */
	    this.bodyPoint2 = null;
	
	    Object.assign(this, options);
	  }
	
	  /**
	   * Scales the positions bodies that the joint are connected at.
	   * @function
	   * @memberOf Distance#
	   * @param {Number} scale the scale to multiply the dimentions by
	   */
	  scaleJointLocation(scale){
	    if(scale && this.bodyPoint2){
	      this.bodyPoint2.x = this.bodyPoint2.x * scale;
	      this.bodyPoint2.y = this.bodyPoint2.y * scale;
	      this.alreadyScaled = true;
	    }
	    super.scaleJointLocation(scale);
	  }
	
	  /**
	   * Creates and adds this joint in the Box2d world.
	   * @function
	   * @memberOf Distance#
	   * @param {Box} the box in which to create the joint.
	   * @return {b2Joint} Joint created by box2d
	   */
	  createB2Joint(box){
	    if(box && box.bodiesMap && box.b2World && box.jointsMap && !box.jointsMap[this.id]){
	      const body1 = box.bodiesMap[this.bodyId1];
	      const body2 = box.bodiesMap[this.bodyId2];
	      if(body1 && body2){
	        let vec1, vec2;
	        if(this.bodyPoint1){
	          vec1 = new B2Vec2(this.bodyPoint1.x, this.bodyPoint1.y);
	        }
	        if(this.bodyPoint2){
	          vec2 = new B2Vec2(this.bodyPoint2.x, this.bodyPoint2.y);
	        }
	        vec1 = vec1 || body1.GetWorldCenter();
	        vec2 = vec2 || body2.GetWorldCenter();
	        const joint = new B2DistanceJointDef();
	        joint.Initialize(body1, body2, vec1, vec2);
	
	        if (this.jointAttributes) {
	          Object.assign(joint, this.jointAttributes);
	        }
	        return box.b2World.CreateJoint(joint);
	      }
	    }
	  }
	}
	
	module.exports = Distance;


/***/ }),
/* 37 */
/***/ (function(module, exports) {

	/**
	 * This represents a joint between two bodies.
	 * @name Joint
	 * @constructor Joint
	 */
	
	
	class Joint {
	  constructor(options = {}){
	
	    /**
	     * The id of the first entity that will be attached to this joint
	     * @type {String}
	     * @memberOf Joint#
	     * @default
	     */
	    this.bodyId1 = null;
	
	    /**
	     * The id of the second entity that will be attached to this joint
	     * @type {String}
	     * @memberOf Joint#
	     * @default
	     */
	    this.bodyId2 = null;
	
	    /**
	     * A point on the first entity where be attached to the second body. If no point is specified, the first body will be attached at its center point.
	     * @type {Object}
	     * @memberOf Joint#
	     * @default
	     */
	    this.bodyPoint1 = null;
	
	    /**
	     * An object with any other properties that should be mixed into the box2d joint definition.
	     * @type {Object}
	     * @memberOf Joint#
	     * @default
	     */
	    this.jointAttributes = null;
	
	    Object.assign(this, options);
	  }
	
	  /**
	   * Scales the position that on the first body that the joint is connected at.
	   * @function
	   * @memberOf Joint#
	   * @param {Number} scale the scale to multiply the dimentions by
	   */
	  scaleJointLocation(scale){
	    if(scale && this.bodyPoint1){
	      this.bodyPoint1.x = this.bodyPoint1.x * scale;
	      this.bodyPoint1.y = this.bodyPoint1.y * scale;
	      this.alreadyScaled = true;
	    }
	  }
	}
	
	module.exports = Joint;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This represents a prismatic joint between two bodies.
	 * This type of joint forces a body to keep its angle rotation consitent with another body
	 * @name Prismatic
	 * @constructor Prismatic
	 * @extends Joint
	 */
	
	const Joint = __webpack_require__(37);
	
	// box2d globals
	const B2Vec2 = Box2D.Common.Math.b2Vec2;
	const B2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;
	
	class Prismatic extends Joint {
	  constructor(options = {}){
	    super(options);
	
	    /**
	     * An object with x and y numeric components representing the line in which the entities can move relative to each other
	     * @type {Object}
	     * @memberOf Prismatic#
	     * @default
	     */
	    this.axisScale = null;
	
	    Object.assign(this, options);
	  }
	
	  /**
	   * Creates and adds this joint in the Box2d world.
	   * @function
	   * @memberOf Prismatic#
	   * @param {Box} the box in which to create the joint.
	   * @return {b2Joint} Joint created by box2d
	   */
	  createB2Joint(box){
	    if(box && box.bodiesMap && box.b2World && box.jointsMap && !box.jointsMap[this.id]){
	      const body1 = box.bodiesMap[this.bodyId1];
	      const body2 = box.bodiesMap[this.bodyId2];
	      if(body1 && body2){
	        let vec1;
	        if(this.bodyPoint1){
	          vec1 = new B2Vec2(this.bodyPoint1.x, this.bodyPoint1.y);
	        }
	        vec1 = vec1 || body1.GetWorldCenter();
	        var joint = new B2PrismaticJointDef();
	        var axis;
	        if(this.axisScale){
	          axis = new B2Vec2(this.axisScale.x, this.axisScale.y);
	        }else{
	          axis = new B2Vec2(1, 0);
	        }
	        joint.Initialize(body1, body2, vec1, axis);
	
	        if (this.jointAttributes) {
	          Object.assign(joint, this.jointAttributes);
	        }
	        return box.b2World.CreateJoint(joint);
	      }
	    }
	  }
	}
	
	module.exports = Prismatic;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This represents a revolute joint between two bodies.
	 * This allow for rotation of one body around a point of another.
	 * @name Revolute
	 * @constructor Revolute
	 * @extends Joint
	 */
	
	const Joint = __webpack_require__(37);
	
	// box2d globals
	const B2Vec2 = Box2D.Common.Math.b2Vec2;
	const B2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
	
	
	class Revolute extends Joint {
	  constructor(options = {}){
	    super(options);
	
	    Object.assign(this, options);
	  }
	
	  /**
	   * Creates and adds this joint in the Box2d world.
	   * @function
	   * @memberOf Revolute#
	   * @param {Box} the box in which to create the joint.
	   * @return {b2Joint} Joint created by box2d
	   */
	  createB2Joint(box){
	    if(box && box.bodiesMap && box.b2World && box.jointsMap && !box.jointsMap[this.id]){
	        var body1 = box.bodiesMap[this.bodyId1];
	        var body2 = box.bodiesMap[this.bodyId2];
	        if(body1 && body2){
	          var vec1;
	          if(this.bodyPoint1){
	            vec1 = new B2Vec2(this.bodyPoint1.x, this.bodyPoint1.y);
	          }
	          vec1 = vec1 || body1.GetWorldCenter();
	          var joint = new B2RevoluteJointDef();
	          var axis;
	          joint.Initialize(body1, body2, vec1, axis);
	
	          if (this.jointAttributes) {
	            Object.assign(joint, this.jointAttributes);
	          }
	          return box.b2World.CreateJoint(joint);
	        }
	      }
	    }
	}
	
	module.exports = Revolute;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * This wraps the box2d world that contains bodies, shapes, and performs the physics calculations.
	 * @name Box
	 * @constructor Box
	 */
	
	const Contact = __webpack_require__(41);
	
	
	console.log(Box2D, 'Box2D', global, window);
	
	// box2d globals
	const B2Vec2 = Box2D.Common.Math.b2Vec2;
	const B2BodyDef = Box2D.Dynamics.b2BodyDef;
	const B2Body = Box2D.Dynamics.b2Body;
	const B2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	const B2Fixture = Box2D.Dynamics.b2Fixture;
	const B2World = Box2D.Dynamics.b2World;
	const B2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	const B2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	
	class Box {
	  constructor(options = {}){
	
	    /**
	     * The number of cycles per second expected in update calcuations
	     * @type {Number}
	     * @memberOf Box#
	     * @default
	     */
	    this.intervalRate = 60;
	
	    /**
	     * Whether or not to try to compensate calculations based on performance
	     * @type {Boolean}
	     * @memberOf Box#
	     * @default
	     */
	    this.adaptive = false;
	
	    /**
	     * A map of the bodies in the box2d world referenced by their given userData
	     * @type {Object}
	     * @memberOf Box#
	     * @default
	     */
	    this.bodiesMap = null;
	
	    /**
	     * A map of the fixtures in the box2d world referenced by their given userData
	     * @type {Object}
	     * @memberOf Box#
	     * @default
	     */
	    this.fixturesMap = null;
	
	    /**
	     * A map of the joints in the box2d world referenced by their given userData
	     * @type {Object}
	     * @memberOf Box#
	     * @default
	     */
	    this.jointsMap = null;
	
	    /**
	     * The instance of the Box2D.Dynamics.b2World world class that the bodies, fixtures, and joints are used in.
	     * @type {B2World}
	     * @memberOf Box#
	     * @default
	     */
	    this.b2World = null;
	
	    /**
	     * The x component of the b2World's gravity in meters/second squared
	     * @type {Number}
	     * @memberOf Box#
	     * @default
	     */
	    this.gravityX = 0;
	
	    /**
	     * The y component of the b2World's gravity in meters/second squared
	     * @type {Number}
	     * @memberOf Box#
	     * @default
	     */
	    this.gravityY = 9.8;
	
	    /**
	     * Allow box2d to skip physics calculations on bodies at rest for performance
	     * @type {Boolean}
	     * @memberOf Box#
	     * @default
	     */
	    this.allowSleep = true;
	
	    /**
	     * Whether to add a listener to collision events. Default behavior adds collision data to entities on update cycle
	     * @type {Boolean}
	     * @memberOf Box#
	     * @default
	     */
	    this.resolveCollisions = false;
	
	    /**
	     * A contact listener for callbacks on collision events. Default is this box itself.
	     * @type {Object}
	     * @memberOf Box#
	     * @default
	     */
	    this.contactListener = null;
	
	    /**
	     * Map of collisions. Instantiated in update if resolveCollisions is true
	     * @type {Object}
	     * @memberOf Box#
	     * @default
	     */
	    this.collisions = null;
	
	    /**
	     * The number of pixels that represnt one meter in the box2d world. (30 pixels ~ 1 meter in box2d)
	     * @type {Number}
	     * @memberOf Box#
	     * @default
	     */
	    this.scale = 30;
	
	    this.bodiesMap = {};
	    this.fixturesMap = {};
	    this.jointsMap = {};
	    Object.assign(this, options);
	
	    this.b2World = new B2World(new B2Vec2(this.gravityX, this.gravityY), this.allowSleep);
	
	    if(this.intervalRate){
	      this.intervalRate = parseInt(this.intervalRate, 10);
	    }
	
	
	    if(this.resolveCollisions){
	      this.contactListener = new Contact();
	    }
	
	    if(this.contactListener){
	      this.addContactListener(this.contactListener);
	    }
	
	  }
	
	  /**
	   * Update the box2d physics calculations
	   * @function
	   * @memberOf Box#
	   * @param  {Number} millis The milliseconds used to determine framerate for box2d step
	   * @return {Number} The amount of milliseconds the update took
	   */
	  update(millis) {
	    // console.log('update millis', millis);
	
	    if(this.contactListener && this.contactListener.reset){
	      this.contactListener.reset();
	    }
	
	    var start = Date.now();
	    if(millis){
	      this.b2World.Step(millis / 1000 /* frame-rate */, 10 /* velocity iterations */, 10 /*position iterations*/);
	      this.b2World.ClearForces();
	    }else{
	      var stepRate = (this.adaptive) ? (start - this.lastTimestamp) / 1000 : (1 / this.intervalRate);
	      this.b2World.Step(stepRate /* frame-rate */, 10 /* velocity iterations */, 10 /*position iterations*/);
	      this.b2World.ClearForces();
	    }
	
	    return (Date.now() - start);
	  }
	
	  /**
	   * Gets the current state of the objects in the box2d world.
	   * @function
	   * @memberOf Box#
	   * @return {Object} The state of the box2d world
	   */
	  getState() {
	    var state = {};
	      for (var b = this.b2World.GetBodyList(); b; b = b.m_next) {
	        if (b.IsActive() && typeof b.GetUserData() !== 'undefined' && b.GetUserData() !== null) {
	          state[b.GetUserData()] = {
	            x: b.GetPosition().x,
	            y: b.GetPosition().y,
	            angle: b.GetAngle(),
	            center: {
	              x: b.GetWorldCenter().x,
	              y: b.GetWorldCenter().y
	            },
	            linearVelocity: b.m_linearVelocity,
	            angularVelocity: b.m_angularVelocity
	          };
	          if(this.contactListener && this.contactListener.collisions){
	            state[b.GetUserData()].collisions = this.contactListener.collisions[b.GetUserData()] || null;
	          }
	        }
	      }
	      return state;
	  }
	
	  /**
	   * Updates the state in the Entity objects that are modified by box2d calculations.
	   * @function
	   * @memberOf Box#
	   * @param {Object|Array} entities An array or map of Entity objects
	   */
	  updateExternalState(entities){
	    //update the dyanmic shapes with box2d calculations
	    var bodiesState = this.getState();
	    for (var id in bodiesState) {
	      var entity = entities[id];
	      //update any dynamic bodies
	      if (entity && !entity.staticBody){
	        entity.update(bodiesState[id]);
	      }
	    }
	  }
	
	  /**
	   * Add a map of entities to the Box
	   * @function
	   * @memberOf Box#
	   * @param {Object} bodyEntities Map of entities
	   */
	  setBodies(bodyEntities) {
	    for(var id in bodyEntities) {
	      var entity = bodyEntities[id];
	      this.addBody(entity);
	    }
	    this.ready = true;
	  }
	
	  /**
	   * Add an Entity to the box2d world which will internally be converted to a box2d body and fixture (auto scaled with Box's scale property if the entity hasn't been scaled yet)
	   * @function
	   * @memberOf Box#
	   * @param {Entity} entity Any Entity object
	   */
	  addBody(entity) {
	    /*jshint eqnull:true */
	
	    if(!entity.alreadyScaled){
	      entity.scaleShape(1 / this.scale);
	      entity.scale = this.scale;
	    }
	
	    var bodyDef = new B2BodyDef();
	    var fixDef = new B2FixtureDef();
	    var i,j,points,vec,vecs;
	    fixDef.restitution = entity.restitution;
	    fixDef.density = entity.density;
	    fixDef.friction = entity.friction;
	
	
	    //these three props are for custom collision filtering
	    if(entity.maskBits != null){
	      fixDef.filter.maskBits = entity.maskBits;
	    }
	    if(entity.categoryBits != null){
	      fixDef.filter.categoryBits = entity.categoryBits;
	    }
	    if(entity.groupIndex != null){
	      fixDef.filter.groupIndex = entity.groupIndex;
	    }
	
	    if(entity.staticBody){
	      bodyDef.type =  B2Body.b2_staticBody;
	    } else {
	      bodyDef.type = B2Body.b2_dynamicBody;
	    }
	
	    bodyDef.position.x = entity.x;
	    bodyDef.position.y = entity.y;
	    bodyDef.userData = entity.id;
	    bodyDef.angle = entity.angle;
	    bodyDef.linearDamping = entity.linearDamping;
	    bodyDef.angularDamping = entity.angularDamping;
	    var body = this.b2World.CreateBody(bodyDef);
	
	
	    if (entity.radius) { //circle
	      fixDef.shape = new B2CircleShape(entity.radius);
	      body.CreateFixture(fixDef);
	    } else if (entity.points) { //polygon
	      points = [];
	      for (i = 0; i < entity.points.length; i++) {
	        vec = new B2Vec2();
	        vec.Set(entity.points[i].x, entity.points[i].y);
	        points[i] = vec;
	      }
	      fixDef.shape = new B2PolygonShape();
	      fixDef.shape.SetAsArray(points, points.length);
	      body.CreateFixture(fixDef);
	    } else if(entity.polys) { //complex object
	        for (j = 0; j < entity.polys.length; j++) {
	            points = entity.polys[j];
	            vecs = [];
	            for (i = 0; i < points.length; i++) {
	                vec = new B2Vec2();
	                vec.Set(points[i].x, points[i].y);
	                vecs[i] = vec;
	            }
	            fixDef.shape = new B2PolygonShape();
	            fixDef.shape.SetAsArray(vecs, vecs.length);
	            body.CreateFixture(fixDef);
	        }
	    } else { //rectangle
	      fixDef.shape = new B2PolygonShape();
	      fixDef.shape.SetAsBox(entity.halfWidth, entity.halfHeight);
	      body.CreateFixture(fixDef);
	    }
	
	
	    this.bodiesMap[entity.id] = body;
	  }
	
	  /**
	   * Set the position of an entity.
	   *
	   * This must be done outside of the update() iteration!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Number} bodyId The id of the Entity/Body
	   * @param {Number} x The new x coordinate in box2d space
	   * @param {Number} y The new y coordinate in box2d space
	   */
	  setPosition(bodyId, x, y){
	    var body = this.bodiesMap[bodyId];
	    body.SetPosition(new B2Vec2(x, y));
	  }
	
	  /**
	   * Set the angle of an entity.
	   *
	   * This must be done outside of the update() iteration!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Number} bodyId The id of the Entity/Body
	   * @param {Number} angle The new angle of the body in radians
	   */
	  setAngle(bodyId, angle){
	    var body = this.bodiesMap[bodyId];
	    console.log('set angle', body.setAngle, body);
	    body.setAngle(angle);
	  }
	
	  /**
	   * Set the linear velocity of an entity.
	   *
	   * This must be done outside of the update() iteration!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Number} bodyId The id of the Entity/Body
	   * @param {Number} x The new x component of the velocity
	   * @param {Number} y The new y component of the velocity
	   */
	  setLinearVelocity(bodyId, x, y){
	    var body = this.bodiesMap[bodyId];
	    body.SetLinearVelocity(new B2Vec2(x, y));
	  }
	
	  /**
	   * Set the angular velocity of an entity.
	   *
	   * This must be done outside of the update() iteration!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Number} bodyId The id of the Entity/Body
	   * @param {Number} velocity The angular velocity for the body
	   */
	  setAngularVelocity(bodyId, velocity){
	    var body = this.bodiesMap[bodyId];
	    body.SetAngularVelocity(velocity);
	  }
	
	  /**
	   * Apply an impulse to a body at an angle in degrees
	   *
	   * This must be done outside of the update() iteration!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Number} bodyId The id of the Entity/Body
	   * @param {Number} degrees The angle in which to apply the impulse.
	   * @param {Number} power The impulse power.
	   */
	  applyImpulseDegrees(bodyId, degrees, power) {
	    var body = this.bodiesMap[bodyId];
	    body.ApplyImpulse(
	      new B2Vec2(Math.sin(degrees * (Math.PI / 180)) * power,
	      Math.cos(degrees * (Math.PI / 180)) * power * -1),
	      body.GetWorldCenter()
	    );
	  }
	
	  /**
	   * Apply a force to a body at an angle in degrees
	   *
	   * This must be done outside of the update() iteration!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Number} bodyId The id of the Entity/Body
	   * @param {Number} degrees The angle in which to apply the force.
	   * @param {Number} power The power of the force. (The ability to destroy a planet is insignificant next to this)
	   */
	  applyForceDegrees(bodyId, degrees, power) {
	    var body = this.bodiesMap[bodyId];
	    body.ApplyForce(
	      new B2Vec2(Math.sin(degrees * (Math.PI / 180)) * power,
	      Math.cos(degrees * (Math.PI / 180)) * power * -1),
	      body.GetWorldCenter()
	    );
	  }
	
	  /**
	   * Apply an impulse to a body at an angle in radians
	   *
	   * This must be done outside of the update() iteration!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Number} bodyId The id of the Entity/Body
	   * @param {Number} radians The angle in which to apply the impulse.
	   * @param {Number} power The impulse power.
	   */
	  applyImpulse(bodyId, radians, power) {
	    var body = this.bodiesMap[bodyId];
	    body.ApplyImpulse(
	      new B2Vec2(Math.sin(radians) * power,
	      Math.cos(radians) * power * -1),
	      body.GetWorldCenter()
	    );
	  }
	
	  /**
	   * Apply a force to a body at an angle in radians
	   *
	   * This must be done outside of the update() iteration!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Number} bodyId The id of the Entity/Body
	   * @param {Number} radians The angle in which to apply the force.
	   * @param {Number} power The power of the force. (The ability to destroy a planet is insignificant next to this)
	   */
	  applyForce(bodyId, radians, power) {
	    var body = this.bodiesMap[bodyId];
	    body.ApplyForce(
	      new B2Vec2(Math.sin(radians) * power,
	      Math.cos(radians) * power * -1),
	      body.GetWorldCenter()
	    );
	  }
	
	  /**
	   * Apply torque (rotation force) to a body.
	   * Positive values are clockwise, negative values are counter-clockwise.
	   *
	   * This must be done outside of the update() iteration!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Number} bodyId The id of the Entity/Body
	   * @param {Number} power The power of the torque.
	   */
	  applyTorque(bodyId, power) {
	    var body = this.bodiesMap[bodyId];
	    body.ApplyTorque(power);
	  }
	
	  /**
	   * Sets the world's gravity
	   *
	   * This must be done outside of the update() iteration!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Object} vector An object with x and y values in meters per second squared.
	   */
	  setGravity(vector) {
	    this.b2World.SetGravity(new B2Vec2(vector.x, vector.y));
	  }
	
	  /**
	   * Remove a body from the box2d world
	   *
	   * This must be done outside of the update() iteration!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Number} bodyId The id of the Entity/Body
	   */
	  removeBody(id) {
	    if(this.bodiesMap[id]){
	      if(this.fixturesMap[id]){
	        this.bodiesMap[id].DestroyFixture(this.fixturesMap[id]);
	      }
	      this.b2World.DestroyBody(this.bodiesMap[id]);
	      //delete this.fixturesMap[id];
	      delete this.bodiesMap[id];
	    }
	  }
	
	  /**
	   * Wake up a body in the box2d world so that box2d will continue to run calculations on it.
	   *
	   * This must be done outside of the update() iteration!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Number} bodyId The id of the Entity/Body
	   */
	  wakeUpBody(id) {
	    if(this.bodiesMap[id]){
	      this.bodiesMap[id].SetAwake(true);
	    }
	  }
	
	  /**
	   * Add a contactListener to the b2World
	   * @function
	   * @memberOf Box#
	   * @param {Object} callbacks Object containing a beginContant, endContact and/or preSolve/postSolve keys and callbacks
	   */
	  addContactListener(contactListener){
	    var listener = new Box2D.Dynamics.b2ContactListener();
	    if(contactListener.beginContact){
	      listener.BeginContact = function(contact){
	        contactListener.beginContact(contact.m_fixtureA.m_body.m_userData, contact.m_fixtureB.m_body.m_userData, contact);
	      };
	    }
	    if(contactListener.endContact){
	      listener.EndContact = function(contact){
	        contactListener.endContact(contact.m_fixtureA.m_body.m_userData, contact.m_fixtureB.m_body.m_userData, contact);
	      };
	    }
	    if(contactListener.preSolve){
	      listener.PreSolve = function(contact, oldManifold){
	        contactListener.preSolve(contact.m_fixtureA.m_body.m_userData, contact.m_fixtureB.m_body.m_userData, oldManifold, contact);
	      };
	    }
	    if (contactListener.postSolve){
	      listener.PostSolve = function(contact, impulse){
	        contactListener.postSolve(contact.m_fixtureA.m_body.m_userData, contact.m_fixtureB.m_body.m_userData, impulse, contact);
	      };
	    }
	    this.b2World.SetContactListener(listener);
	  }
	
	  /**
	   * Remove a joint from the world.
	   *
	   * This must be done outside of the update() iteration, and BEFORE any bodies connected to the joint are removed!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Number} jointId The id of joint to be destroyed.
	   */
	  removeJoint(jointId) {
	    if(this.jointsMap[jointId]){
	      this.b2World.DestroyJoint(this.jointsMap[jointId]);
	      delete this.jointsMap[jointId];
	    }
	  }
	
	  /**
	   * Add a joint to the box2d world.
	   *
	   * This must be done outside of the update() iteration!
	   *
	   * @function
	   * @memberOf Box#
	   * @param {Joint} A joint definition.
	   */
	  addJoint(joint) {
	    if(joint && joint.id && !this.jointsMap[joint.id]){
	
	      if(!joint.alreadyScaled && joint.scaleJointLocation){
	        joint.scaleJointLocation(1 / this.scale);
	        joint.scale = this.scale;
	      }
	
	      var b2Joint = joint.createB2Joint(this);
	      if(b2Joint){
	        this.jointsMap[joint.id] = b2Joint;
	      }
	    }
	  }
	}
	
	module.exports = Box;
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 41 */
/***/ (function(module, exports) {

	/**
	 * This contact listener for the Box2d world assigns collision objects to entities when they collide.
	 * @name Contact
	 * @constructor Contact
	 */
	
	class Contact {
	  constructor(options = {}){
	
	    Object.assign(this, options);
	
	    this.collisions = this.collisions || {};
	  }
	
	  /**
	   * Resets the state of the contact listener per iteration of the box world calculations.
	   * @function
	   * @memberOf Contact#
	   */
	  reset(){
	    this.collisions = {};
	  }
	
	  /**
	   * Called when a box2d collison begins
	   * @function beginContact
	   * @memberOf Contact#
	   * @param {String} idA Id of body A
	   * @param {String} idB Id of body B
	   * @param {b2Contacnt} contact The box2d contact object.
	   */
	
	  /**
	   * Called when a box2d collison ends
	   * @function endContact
	   * @memberOf Contact#
	   * @param {String} idA Id of body A
	   * @param {String} idB Id of body B
	   * @param {b2Contact} contact The box2d contact object.
	  */
	
	  /**
	   * Called before a box2d collison is resolved
	   * @function preSolve
	   * @memberOf Contact#
	   * @param {String} idA Id of body A
	   * @param {String} idB Id of body B
	   * @param {Object} oldManifold Old manifold object passed into preSolve listener
	   * @param {b2Contact} contact The box2d contact object.
	  */
	
	  /**
	   * Called after a box2d collison is resolved
	   * @function
	   * @memberOf Contact#
	   * @param {String} idA Id of body A
	   * @param {String} idB Id of body B
	   * @param {Object} impulse Impulse object passed into postSolve listener
	   * @param {b2Contact} contact The box2d contact object.
	  */
	  postSolve(idA, idB, impulse, contact){
	    this.collisions[idA] = this.collisions[idA] || [];
	    this.collisions[idA].push({id: idB, impulse: impulse.normalImpulses[0]});
	    this.collisions[idB] = this.collisions[idB] || [];
	    this.collisions[idB].push({id: idA, impulse: impulse.normalImpulses[0]});
	  }
	}
	
	module.exports = Contact;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * This is a convenience object that allows for quickly creating a box2d based game.
	 * @name BoxGame
	 * @constructor BoxGame
	 * @extends GameCore
	 */
	
	const GameCore = __webpack_require__(1);
	const Box = __webpack_require__(40);
	
	class BoxGame extends GameCore {
	  constructor(options = {}){
	    super(options);
	    console.log('boxgame options', options);
	    /**
	     * The instance of Box used for this game.
	     * @type {Box}
	     * @memberOf BoxGame#
	     * @default
	     */
	    this.box = null;
	
	    /**
	     * Whether the box should perform calculations during its update cycle
	     * @type {Boolean}
	     * @memberOf BoxGame#
	     * @default
	     */
	    this.boxUpdating = true;
	
	    /**
	     * A map of Entity objects that are added to the Box
	     * @type {Object}
	     * @memberOf BoxGame#
	     * @default
	     */
	    this.entities = null;
	
	    /**
	     * A map of Joint objects that are added to the Box
	     * @type {Object}
	     * @memberOf BoxGame#
	     * @default
	     */
	    this.joints = null;
	
	    Object.assign(this, options);
	
	    if(!this.box){
	      this.box = new Box(options.boxOptions);
	    }
	
	    if(!this.entities){
	      this.entities = {};
	    }
	
	    if(!this.joints){
	      this.joints = {};
	    }
	
	  }
	
	  /**
	   * Performs all physics calculations in the Box
	   * @function
	   * @memberOf BoxGame#
	   * @param  {Number} millis The milliseconds that have passed since last iteration of gameLoop
	   */
	  updateBox(millis){
	    if(this.boxUpdating){
	      this.box.update(millis);
	      this.box.updateExternalState(this.entities);
	    }
	  }
	
	  /**
	   * Adds an Entity object to entities and box
	   * @function
	   * @memberOf BoxGame#
	   * @param {Entity} entity Entity to add
	   */
	  addBody(entity){
	    this.entities[entity.id] = entity;
	    this.box.addBody(entity);
	  }
	
	  /**
	   * Adds a series of Entity objects to entities and box
	   * @function
	   * @memberOf BoxGame#
	   * @param {Array|Entity} entities Can take an array of Entity objects or any number of Entity objects
	   */
	  addBodies(entities){
	    if(!Array.isArray(entities)) {
	      entities = [entities];
	    }
	    var self = this;
	    entities.forEach((entity) => {
	      this.addBody(entity);
	    });
	  }
	
	  /**
	   * Removes an Entity object from entities and box
	   * @function
	   * @memberOf BoxGame#
	   * @param  {Entity} entity Entity to remove
	   */
	  removeBody(entity){
	    this.box.removeBody(entity.id);
	    delete this.entities[entity.id];
	  }
	
	  /**
	   * Removes a series of Entity objects from entities and box
	   * @function
	   * @memberOf BoxGame#
	   * @param {Array|Entity} entities Can take an array of Entity objects or any number of Entity objects
	   */
	  removeBodies(entities){
	    if(!Array.isArray(entities)) {
	      entities = [entities];
	    }
	    entities.forEach((entity) => {
	      this.removeBody(entity);
	    });
	  }
	
	  /**
	   * Adds a Joint to joints and box
	   * @function
	   * @memberOf BoxGame#
	   * @param {Joint} joint Joint to add
	   */
	  addJoint(joint){
	    this.joints[joint.id] = joint;
	    this.box.addJoint(joint);
	  }
	
	  /**
	   * Adds a series of Joint objects to joints and box
	   * @function
	   * @memberOf BoxGame#
	   * @param {Array|Joint} joints Can take an array of Joint objects or any number of Joint objects
	   */
	  addJoints(joints){
	    if(!Array.isArray(joints)) {
	      joints = [joints];
	    }
	    joints.forEach((entity) => {
	      this.addJoint(entity);
	    });
	  }
	
	  /**
	   * Removes a Joint from joints and box
	   * @function
	   * @memberOf BoxGame#
	   * @param  {Joint} joint Joint to remove
	   */
	  removeJoint(joint){
	    this.box.removeJoint(joint.id);
	    delete this.joints[joint.id];
	  }
	
	  /**
	   * Removes a series of Joint objects from joints and box
	   * @function
	   * @memberOf BoxGame#
	   * @param {Array|Joint} joints Can take an array of Joint objects or any number of Joint objects
	   */
	  removeJoints(joints){
	    if(!Array.isArray(joints)) {
	      joints = [joints];
	    }
	    joints.forEach((entity) => {
	      this.removeJoint(entity);
	    });
	  }
	}
	
	module.exports = BoxGame;
	


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjk2OTI0MzhkZjA0NDRlZTUzYzkiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vR2FtZUNvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vSW5wdXRNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL34vaGFtbWVyanMvaGFtbWVyLmpzIiwid2VicGFjazovLy8uL0dhbWVBY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vVG91Y2hBY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vTW91c2VBY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vdXRpbHMvaW5zaWRlQ2FudmFzLmpzIiwid2VicGFjazovLy8uL2tleXMuanMiLCJ3ZWJwYWNrOi8vLy4vUmVzb3VyY2VNYW5hZ2VyLmpzIiwid2VicGFjazovLy8uL2hhcy5qcyIsIndlYnBhY2s6Ly8vLi9zaGltcy9BdWRpb0NvbnRleHQuanMiLCJ3ZWJwYWNrOi8vLy4vc291bmRzL1NvdW5kLmpzIiwid2VicGFjazovLy8uL3NvdW5kcy9XZWJBdWRpby5qcyIsIndlYnBhY2s6Ly8vLi91dGlscy9yZW1vdmVFeHRlbnNpb24uanMiLCJ3ZWJwYWNrOi8vLy4vQW5pbWF0aW9uLmpzIiwid2VicGFjazovLy8uL0FuaW1GcmFtZS5qcyIsIndlYnBhY2s6Ly8vLi91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi91dGlscy9hdmVyYWdlUG9pbnRzLmpzIiwid2VicGFjazovLy8uL3V0aWxzL2RlZ3JlZXNUb1JhZGlhbnMuanMiLCJ3ZWJwYWNrOi8vLy4vdXRpbHMvcmFkaWFuc1RvRGVncmVlcy5qcyIsIndlYnBhY2s6Ly8vLi91dGlscy9wb2ludEluUG9seWdvbi5qcyIsIndlYnBhY2s6Ly8vLi91dGlscy9kaXN0YW5jZS5qcyIsIndlYnBhY2s6Ly8vLi91dGlscy9kZWdyZWVzRnJvbUNlbnRlci5qcyIsIndlYnBhY2s6Ly8vLi91dGlscy9yYWRpYW5zRnJvbUNlbnRlci5qcyIsIndlYnBhY2s6Ly8vLi91dGlscy9zY2FsZVBvaW50cy5qcyIsIndlYnBhY2s6Ly8vLi91dGlscy90cmFuc2xhdGVQb2ludHMuanMiLCJ3ZWJwYWNrOi8vLy4vU3ByaXRlLmpzIiwid2VicGFjazovLy8uL3JlaW5lci9DcmVhdHVyZS5qcyIsIndlYnBhY2s6Ly8vLi9ib3gyZC9lbnRpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9ib3gyZC9lbnRpdGllcy9DaXJjbGUuanMiLCJ3ZWJwYWNrOi8vLy4vYm94MmQvZW50aXRpZXMvRW50aXR5LmpzIiwid2VicGFjazovLy8uL2JveDJkL2VudGl0aWVzL011bHRpUG9seWdvbi5qcyIsIndlYnBhY2s6Ly8vLi9ib3gyZC9lbnRpdGllcy9Qb2x5Z29uLmpzIiwid2VicGFjazovLy8uL2JveDJkL2VudGl0aWVzL1JlY3RhbmdsZS5qcyIsIndlYnBhY2s6Ly8vLi9ib3gyZC9qb2ludHMuanMiLCJ3ZWJwYWNrOi8vLy4vYm94MmQvam9pbnRzL0Rpc3RhbmNlLmpzIiwid2VicGFjazovLy8uL2JveDJkL2pvaW50cy9Kb2ludC5qcyIsIndlYnBhY2s6Ly8vLi9ib3gyZC9qb2ludHMvUHJpc21hdGljLmpzIiwid2VicGFjazovLy8uL2JveDJkL2pvaW50cy9SZXZvbHV0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ib3gyZC9Cb3guanMiLCJ3ZWJwYWNrOi8vLy4vYm94MmQvbGlzdGVuZXJzL0NvbnRhY3QuanMiLCJ3ZWJwYWNrOi8vLy4vYm94MmQvQm94R2FtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsMkJBQTBCOztBQUUxQjtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsZ0JBQWdCO0FBQzdCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVCxRQUFPO0FBQ1A7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLGFBQWE7QUFDMUI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsYUFBYTtBQUMxQixjQUFhLE9BQU87QUFDcEI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsT0FBTztBQUNwQjtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsT0FBTztBQUNwQjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FDMVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTBCOztBQUUxQjtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBVyxRQUFRO0FBQ25CLFlBQVcsT0FBTztBQUNsQixZQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFXLE9BQU87QUFDbEIsWUFBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCLFlBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFD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QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBLGVBQWMsTUFBTTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN4RUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFnQyxHQUFHO0FBQ25DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUEsMkJBQTBCOztBQUUxQjtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxhQUFhO0FBQzFCLGdCQUFlLFlBQVk7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLGFBQWE7QUFDMUIsZ0JBQWUsWUFBWTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFjLGNBQWM7QUFDNUIsZUFBYyxNQUFNO0FBQ3BCLGVBQWMsU0FBUztBQUN2QixlQUFjLE1BQU07QUFDcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBYyxjQUFj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O0FBQ0EsMkJBQTBCO0FBQzFCOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNuSUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQWtDLElBQUk7QUFDdEM7O0FBRUE7Ozs7Ozs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBLDJCQUEwQjs7QUFFMUI7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FB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O0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtB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SUFBSTtBQUNqQixlQUFjLFFBQVE7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSwyQkFBMEI7QUFDMUI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsSUFBSTtBQUNqQixlQUFjLFFBQVE7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEwQjs7QUFFMUI7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FB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QUNBO0FBQ0E7QUFDQSxjQUFhLE9BQU87QUFDcEIsY0FBYSxPQUFPO0FBQ3BCLGNBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLE9BQU87QUFDcEIsY0FBYSxPQUFPO0FBQ3BCLGNBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLE9BQU87QUFDcEIsY0FBYSxPQUFPO0FBQ3BCLGNBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsT0FBTztBQUNwQixjQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsTUFBTTtBQUNuQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7OztBQ3psQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEwQjs7QUFFMUI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxPQUFPO0FBQ3BCLGNBQWEsT0FBTztBQUNwQixjQUFhLFdBQVc7QUFDeEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLE9BQU87QUFDcEIsY0FBYSxPQUFPO0FBQ3BCLGNBQWEsVUFBVTtBQUN2Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsT0FBTztBQUNwQixjQUFhLE9BQU87QUFDcEIsY0FBYSxPQUFPO0FBQ3BCLGNBQWEsVUFBVTtBQUN2Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsT0FBTztBQUNwQixjQUFhLE9BQU87QUFDcEIsY0FBYSxPQUFPO0FBQ3BCLGNBQWEsVUFBVTtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxnQ0FBK0IsNENBQTRDO0FBQzNFO0FBQ0EsZ0NBQStCLDRDQUE0QztBQUMzRTtBQUNBOztBQUVBOzs7Ozs7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBYyxPQUFPO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLGFBQWE7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWMsT0FBTztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxhQUFhO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYSxNQUFNO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhLFlBQVk7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFjLE1BQU07QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWEsWUFBWTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBIiwiZmlsZSI6ImZyb3plbi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBmOTY5MjQzOGRmMDQ0NGVlNTNjOSIsIlxud2luZG93LmZyb3plbmpzID0ge1xuICBHYW1lQ29yZSA6IHJlcXVpcmUoJy4vR2FtZUNvcmUnKSxcbiAgSW5wdXRNYW5hZ2VyIDogcmVxdWlyZSgnLi9JbnB1dE1hbmFnZXInKSxcbiAgUmVzb3VyY2VNYW5hZ2VyIDogcmVxdWlyZSgnLi9SZXNvdXJjZU1hbmFnZXInKSxcbiAgTW91c2VBY3Rpb24gOiByZXF1aXJlKCcuL01vdXNlQWN0aW9uJyksXG4gIFRvdWNoQWN0aW9uIDogcmVxdWlyZSgnLi9Ub3VjaEFjdGlvbicpLFxuICBrZXlzIDogcmVxdWlyZSgnLi9rZXlzJyksXG4gIEFuaW1hdGlvbjogcmVxdWlyZSgnLi9BbmltYXRpb24nKSxcbiAgQW5pbUZyYW1lOiByZXF1aXJlKCcuL0FuaW1GcmFtZScpLFxuICB1dGlscyA6IHJlcXVpcmUoJy4vdXRpbHMnKSxcbiAgU3ByaXRlIDogcmVxdWlyZSgnLi9TcHJpdGUnKSxcbiAgcmVpbmVyIDoge1xuICAgIENyZWF0dXJlIDogcmVxdWlyZSgnLi9yZWluZXIvQ3JlYXR1cmUnKVxuICB9LFxuICBzb3VuZHMgOiB7XG4gICAgV2ViQXVkaW8gOiByZXF1aXJlKCcuL3NvdW5kcy9XZWJBdWRpbycpXG4gIH0sXG4gIGJveDJkIDoge1xuICAgIGVudGl0aWVzIDogcmVxdWlyZSgnLi9ib3gyZC9lbnRpdGllcycpLFxuICAgIGpvaW50czogcmVxdWlyZSgnLi9ib3gyZC9qb2ludHMnKSxcbiAgICBCb3ggOiByZXF1aXJlKCcuL2JveDJkL0JveCcpLFxuICAgIEJveEdhbWUgOiByZXF1aXJlKCcuL2JveDJkL0JveEdhbWUnKVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5mcm96ZW5qcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGUgR2FtZUNvcmUgY2xhc3MgcHJvdmlkZXMgdGhlIGJhc2UgdG8gYnVpbGQgZ2FtZXMgb24uXG4gKiBAbmFtZSBHYW1lQ29yZVxuICogQGNvbnN0cnVjdG9yIEdhbWVDb3JlXG4gKiBAZXhhbXBsZVxuICogdmFyIG15R2FtZSA9IG5ldyBHYW1lQ29yZSh7XG4gKiAgIGNhbnZhc0lkOiAnbXlDYW52YXMnLFxuICogICB1cGRhdGU6IGZ1bmN0aW9uKG1pbGxpcyl7XG4gKiAgICAgLy8gZG8gdXBkYXRpbmcgb2YgZ2FtZSBzdGF0ZVxuICogICB9LFxuICogICBkcmF3OiBmdW5jdGlvbihjb250ZXh0KXtcbiAqICAgICAvLyBkbyBkcmF3aW5nIG9mIHRoZSBnYW1lXG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIC8vc3RhcnQgdGhlIGdhbWVcbiAqIG15R2FtZS5ydW4oKTtcbiAqL1xuXG5jb25zdCBJbnB1dE1hbmFnZXIgPSByZXF1aXJlKCcuL0lucHV0TWFuYWdlcicpO1xuY29uc3QgUmVzb3VyY2VNYW5hZ2VyID0gcmVxdWlyZSgnLi9SZXNvdXJjZU1hbmFnZXInKTtcblxuY2xhc3MgR2FtZUNvcmUge1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSl7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgZ2FtZSBzaG91bGQgYmUgcnVubmluZyBpdHMgbG9vcFxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBtZW1iZXJPZiBHYW1lQ29yZSNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaWQgb2YgdGhlIGNhbnZhcyBlbGVtZW50IHRvIHVzZSByZW5kZXIgdGhlIGdhbWUgb25cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBtZW1iZXJPZiBHYW1lQ29yZSNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuY2FudmFzSWQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTWF4IG51bWJlciBvZiBtaWxsaXNlY29uZHMgYmV0d2VlbiB1cGRhdGVzLiAoaW4gY2FzZSB1c2VyIHN3aXRjaGVzIHRhYnMgYW5kIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwYXVzZXMpXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgR2FtZUNvcmUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLm1heFN0ZXAgPSA0MDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB0eXBlIG9mIGNvbnRleHQgdG8gcmVxdWVzdCBmcm9tIHRoZSBjYW52YXMuICAyZCBvciAzZFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQG1lbWJlck9mIEdhbWVDb3JlI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5jb250ZXh0VHlwZSA9ICcyZCc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaGVpZ2h0IG9mIHRoZSBHYW1lIGFuZCBjYW52YXNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBHYW1lQ29yZSNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gMDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB3aWR0aCBvZiB0aGUgR2FtZSBhbmQgY2FudmFzXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgR2FtZUNvcmUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gMDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBSZXNvdXJjZU1hbmFnZXIgdG8gYmUgdXNlZCBmb3IgZ2FtZVxuICAgICAqIEB0eXBlIHtSZXNvdXJjZU1hbmFnZXJ9XG4gICAgICogQG1lbWJlck9mIEdhbWVDb3JlI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5yZXNvdXJjZU1hbmFnZXIgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIElucHV0TWFuYWdlciB0byBiZSB1c2VkIGZvciBnYW1lXG4gICAgICogQHR5cGUge0lucHV0TWFuYWdlcn1cbiAgICAgKiBAbWVtYmVyT2YgR2FtZUNvcmUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmlucHV0TWFuYWdlciA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc3R5bGUgdG8gYmUgdXNlZCBmb3IgdGhlIGZvcmVncm91bmQgd2hpbGUgZ2FtZSByZXNvdXJjZXMgYXJlIGxvYWRpbmdcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBtZW1iZXJPZiBHYW1lQ29yZSNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMubG9hZGluZ0ZvcmVncm91bmQgPSAnIzAwRic7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc3R5bGUgdG8gYmUgdXNlZCBmb3IgdGhlIGJhY2tncm91bmQgd2hpbGUgZ2FtZSByZXNvdXJjZXMgYXJlIGxvYWRpbmdcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBtZW1iZXJPZiBHYW1lQ29yZSNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMubG9hZGluZ0JhY2tncm91bmQgPSAnI0ZGRic7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgSUQgb2YgYSBET00gZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSBnYW1lJ3MgY2FudmFzXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAbWVtYmVyT2YgR2FtZUNvcmUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmdhbWVBcmVhSWQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHBlcmNlbnRhZ2UgKDAgdG8gMS4wKSBvZiB0aGUgaGVpZ2h0IGFuZCB3aWR0aCB0aGUgY2FudmFzIHNob3VsZCB1c2UgdG8gZmlsbCBpbiBpdHMgY29udGFpbmVyIERPTSBlbGVtZW50XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgR2FtZUNvcmUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmNhbnZhc1BlcmNlbnRhZ2UgPSAwO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKTtcblxuICAgIGlmKCF0aGlzLnJlc291cmNlTWFuYWdlcil7XG4gICAgICB0aGlzLnJlc291cmNlTWFuYWdlciA9IG5ldyBSZXNvdXJjZU1hbmFnZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgaGVpZ2h0IG9uIHlvdXIgR2FtZUNvcmUgaW5zdGFuY2UgYW5kIG9uIHlvdXIgY2FudmFzIHJlZmVyZW5jZVxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIEdhbWVDb3JlI1xuICAgKiBAcGFyYW0ge051bWJlcn0gbmV3SGVpZ2h0IFRoZSBuZXcgaGVpZ2h0IGRlc2lyZWRcbiAgICovXG4gIHNldEhlaWdodChuZXdIZWlnaHQpe1xuICAgIHRoaXMuaGVpZ2h0ID0gbmV3SGVpZ2h0O1xuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IG5ld0hlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB3aWR0aCBvbiB5b3VyIEdhbWVDb3JlIGluc3RhbmNlIGFuZCBvbiB5b3VyIGNhbnZhcyByZWZlcmVuY2VcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBHYW1lQ29yZSNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5ld1dpZHRoIFRoZSBuZXcgd2lkdGggZGVzaXJlZFxuICAgKi9cbiAgc2V0V2lkdGgobmV3V2lkdGgpe1xuICAgIHRoaXMud2lkdGggPSBuZXdXaWR0aDtcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IG5ld1dpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFNpZ25hbHMgdGhlIGdhbWUgbG9vcCB0aGF0IGl0J3MgdGltZSB0byBxdWl0XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgR2FtZUNvcmUjXG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogTGF1bmNoZXMgdGhlIGdhbWUuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgR2FtZUNvcmUjXG4gICAqL1xuICBydW4oKSB7XG4gICAgaWYoIXRoaXMuaXNSdW5uaW5nKXtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgdGhpcy5sb2FkUmVzb3VyY2VzKHRoaXMucmVzb3VyY2VNYW5hZ2VyKTtcbiAgICAgIHRoaXMuaW5pdElucHV0KHRoaXMuaW5wdXRNYW5hZ2VyKTtcbiAgICAgIHRoaXMubGF1bmNoTG9vcCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYW4gYmUgb3ZlcmlkZGVuIGluIEdhbWVDb3JlIHN1YmNsYXNzZXMgdG8gbG9hZCBpbWFnZXMgYW5kIHNvdW5kc1xuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIEdhbWVDb3JlI1xuICAgKiBAcGFyYW0ge1Jlc291cmNlTWFuYWdlcn0gcmVzb3VyY2VNYW5hZ2VyXG4gICAqL1xuICBsb2FkUmVzb3VyY2VzKHJlc291cmNlTWFuYWdlcil7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzY3JlZW4gbW9kZSBhbmQgaW5pdGlhdGVzIGFuZCBvYmplY3RzLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIEdhbWVDb3JlI1xuICAgKi9cbiAgaW5pdCgpIHtcbiAgICBpZighdGhpcy5jYW52YXMpe1xuICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNhbnZhc0lkKTtcbiAgICB9XG4gICAgaWYoIXRoaXMuY2FudmFzKXtcbiAgICAgIFxuICAgICAgYWxlcnQoJ1NvcnJ5LCB5b3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBjYW52YXMuICBJIHJlY29tbWVuZCBhbnkgYnJvd3NlciBidXQgSW50ZXJuZXQgRXhwbG9yZXInKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIXRoaXMuY29udGV4dCl7XG4gICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KHRoaXMuY29udGV4dFR5cGUpO1xuICAgIH1cbiAgICBpZighdGhpcy5jb250ZXh0KXtcbiAgICAgIGFsZXJ0KCdTb3JyeSwgeW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYSAnICsgdGhpcy5jb250ZXh0VHlwZSArICcgZHJhd2luZyBzdXJmYWNlIG9uIGNhbnZhcy4gIEkgcmVjb21tZW5kIGFueSBicm93c2VyIGJ1dCBJbnRlcm5ldCBFeHBsb3JlcicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2V0SGVpZ2h0KHRoaXMuaGVpZ2h0IHx8IHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgdGhpcy5zZXRXaWR0aCh0aGlzLndpZHRoIHx8IHRoaXMuY2FudmFzLndpZHRoKTtcblxuICAgIGlmKCF0aGlzLmlucHV0TWFuYWdlcil7XG4gICAgICAvL2hhbmRsZSByZXNpemluZyBpZiBnYW1lQXJlYSBhbmQgY2FudmFzUGVyY2VudGFnZSBhcmUgc3BlY2lmaWVkXG4gICAgICBpZih0aGlzLmdhbWVBcmVhSWQgJiYgdGhpcy5jYW52YXNQZXJjZW50YWdlKXtcbiAgICAgICAgdGhpcy5pbnB1dE1hbmFnZXIgPSBuZXcgSW5wdXRNYW5hZ2VyKHtcbiAgICAgICAgICBjYW52YXM6IHRoaXMuY2FudmFzLFxuICAgICAgICAgIGdhbWVBcmVhOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmdhbWVBcmVhSWQpLFxuICAgICAgICAgIGNhbnZhc1BlcmNlbnRhZ2U6IHRoaXMuY2FudmFzUGVyY2VudGFnZVxuICAgICAgICB9KTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLmlucHV0TWFuYWdlciA9IG5ldyBJbnB1dE1hbmFnZXIoe1xuICAgICAgICAgIGNhbnZhczogdGhpcy5jYW52YXNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pbnB1dE1hbmFnZXIucmVzaXplKCk7XG5cbiAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FuIGJlIG92ZXJpZGRlbiBpbiB0aGUgc3ViY2xhc3NlcyB0byBtYXAgdXNlciBpbnB1dCB0byBhY3Rpb25zXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgR2FtZUNvcmUjXG4gICAqIEBwYXJhbSB7SW5wdXRNYW5hZ2VyfSBpbnB1dE1hbmFnZXJcbiAgICovXG4gIGluaXRJbnB1dChpbnB1dE1hbmFnZXIpIHtcblxuICB9XG5cbiAgLyoqXG4gICAqIENhbiBiZSBvdmVyaWRkZW4gaW4gdGhlIHN1YmNsYXNzZXMgdG8gZGVhbCB3aXRoIHVzZXIgaW5wdXQgYmVmb3JlIHVwZGF0aW5nIHRoZSBnYW1lIHN0YXRlXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgR2FtZUNvcmUjXG4gICAqIEBwYXJhbSB7SW5wdXRNYW5hZ2VyfSBpbnB1dE1hbmFnZXJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGVsYXBzZWRUaW1lIEVsYXBzZWQgdGltZSBpbiBtaWxsaXNlY29uZHNcbiAgICovXG4gIGhhbmRsZUlucHV0KGlucHV0TWFuYWdlcixlbGFwc2VkVGltZSkge1xuXG4gIH1cblxuICAvKipcbiAgICogUnVucyB0aHJvdWdoIHRoZSBnYW1lIGxvb3AgdW50aWwgc3RvcCgpIGlzIGNhbGxlZC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBHYW1lQ29yZSNcbiAgICovXG4gIGdhbWVMb29wKCkge1xuICAgIHRoaXMuY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB0aGlzLmVsYXBzZWRUaW1lID0gTWF0aC5taW4odGhpcy5jdXJyVGltZSAtIHRoaXMucHJldlRpbWUsIHRoaXMubWF4U3RlcCk7XG4gICAgdGhpcy5wcmV2VGltZSA9IHRoaXMuY3VyclRpbWU7XG5cbiAgICAvL2l0J3MgdXNpbmcgYSByZXNvdXJjZSBtYW5hZ2VyLCBidXQgcmVzb3VyY2VzIGhhdmVuJ3QgZmluaXNoZWRcbiAgICBpZih0aGlzLnJlc291cmNlTWFuYWdlciAmJiAhdGhpcy5yZXNvdXJjZU1hbmFnZXIucmVzb3VyY2VzUmVhZHkoKSl7XG4gICAgICB0aGlzLnVwZGF0ZUxvYWRpbmdTY3JlZW4odGhpcy5lbGFwc2VkVGltZSk7XG4gICAgICB0aGlzLmRyYXdMb2FkaW5nU2NyZWVuKHRoaXMuY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGFuZGxlSW5wdXQodGhpcy5pbnB1dE1hbmFnZXIsdGhpcy5lbGFwc2VkVGltZSk7XG4gICAgICBpZighdGhpcy5wYXVzZWQpe1xuICAgICAgICAvLyB1cGRhdGVcbiAgICAgICAgdGhpcy51cGRhdGUodGhpcy5lbGFwc2VkVGltZSk7XG4gICAgICB9XG4gICAgICAvLyBkcmF3IHRoZSBzY3JlZW5cbiAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG4gICAgICB0aGlzLmRyYXcodGhpcy5jb250ZXh0KTtcbiAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExhdW5jaGVzIHRoZSBnYW1lIGxvb3AuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgR2FtZUNvcmUjXG4gICAqL1xuICBsYXVuY2hMb29wKCl7XG4gICAgdGhpcy5lbGFwc2VkVGltZSA9IDA7XG4gICAgdmFyIHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5jdXJyVGltZSA9IHN0YXJ0VGltZTtcbiAgICB0aGlzLnByZXZUaW1lID0gc3RhcnRUaW1lO1xuXG4gICAgLy9uZWVkIHRvIGtlZXAgdGhlIGNvbnRleHQgZGVmaW5lZCBoZXJlIHNvIHRoZSBnYW1lIGxvb3AgaGFzIGFjY2VzcyB0byBpdFxuICAgIHRoaXMubG9vcFJ1bm5lciA9IHRoaXMubG9vcFJ1bm5lci5iaW5kKHRoaXMpO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wUnVubmVyKTtcbiAgfVxuXG4gIGxvb3BSdW5uZXIoKXtcbiAgICB0aGlzLmdhbWVMb29wKCk7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3BSdW5uZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3VsZCBiZSBvdmVycmlkZGVuIHRvIHVwZGF0ZSB0aGUgc3RhdGUgb2YgdGhlIGdhbWUvYW5pbWF0aW9uIGJhc2VkIG9uIHRoZSBhbW91bnQgb2YgZWxhcHNlZCB0aW1lIHRoYXQgaGFzIHBhc3NlZC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBHYW1lQ29yZSNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGVsYXBzZWRUaW1lIEVsYXBzZWQgdGltZSBpbiBtaWxsaXNlY29uZHNcbiAgICovXG4gIHVwZGF0ZShlbGFwc2VkVGltZSkge1xuXG5cbiAgfVxuXG4gIC8qKlxuICAgKiBDYW4gYmUgb3ZlcnJpZGRlbiB0byB1cGRhdGUgdGhlIHN0YXRlIG9mIHRoZSBnYW1lL2FuaW1hdGlvbiB3aGlsZSBhIGN1c3RvbSBsb2FkaW5nIHNjcmVlbiBpcyBkaXNwbGF5ZWQuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgR2FtZUNvcmUjXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBlbGFwc2VkVGltZSBFbGFwc2VkIHRpbWUgaW4gbWlsbGlzZWNvbmRzXG4gICAqL1xuICB1cGRhdGVMb2FkaW5nU2NyZWVuKGVsYXBzZWRUaW1lKSB7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyB0byB0aGUgc2NyZWVuLiBTdWJjbGFzc2VzIG9yIGluc3RhbmNlcyBtdXN0IG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIHBhaW50IGl0ZW1zIHRvIHRoZSBzY3JlZW4uXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgR2FtZUNvcmUjXG4gICAqIEBwYXJhbSB7Q29udGV4dH0gY29udGV4dCBBbiBIVE1MNSBjYW52YXMgZHJhd2luZyBjb250ZXh0LlxuICAgKi9cbiAgZHJhdyhjb250ZXh0KXtcbiAgICBpZih0aGlzLmNvbnRleHRUeXBlID09PSAnMmQnKXtcbiAgICAgIGNvbnRleHQuZm9udCA9IFwiMTRweCBzYW5zLXNlcmlmXCI7XG4gICAgICBjb250ZXh0LmZpbGxUZXh0KFwiVGhpcyBnYW1lIGRvZXMgbm90IGhhdmUgaXRzIG93biBkcmF3IGZ1bmN0aW9uIVwiLCAxMCwgNTApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyB0aGUgcHJvZ3Jlc3Mgb2YgdGhlIHJlc291cmNlIG1hbmdlciB0byB0aGUgc2NyZWVuIHdoaWxlIGxvYWRpbmcuXG4gICAqIFN1YmNsYXNzZXMgb3IgaW5zdGFuY2VzIG1heSBvdmVycmlkZSBmb3IgY3VzdG9tIGxvYWRpbmcgYW5pbWF0aW9ucy5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBHYW1lQ29yZSNcbiAgICogQHBhcmFtIHtDb250ZXh0fSBjb250ZXh0IEFuIEhUTUw1IGNhbnZhcyBkcmF3aW5nIGNvbnRleHQuXG4gICAqL1xuICBkcmF3TG9hZGluZ1NjcmVlbihjb250ZXh0KXtcbiAgICBpZih0aGlzLnJlc291cmNlTWFuYWdlciAmJiAodGhpcy5jb250ZXh0VHlwZSA9PT0gJzJkJykpe1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmxvYWRpbmdCYWNrZ3JvdW5kO1xuICAgICAgY29udGV4dC5maWxsUmVjdCgwLDAsIHRoaXMud2lkdGgsdGhpcy5oZWlnaHQpO1xuXG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMubG9hZGluZ0ZvcmVncm91bmQ7XG4gICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5sb2FkaW5nRm9yZWdyb3VuZDtcblxuICAgICAgdmFyIHRleHRQeFNpemUgPSBNYXRoLmZsb29yKHRoaXMuaGVpZ2h0LzEyKTtcblxuICAgICAgY29udGV4dC5mb250ID0gXCJib2xkIFwiICsgdGV4dFB4U2l6ZSArIFwicHggc2Fucy1zZXJpZlwiO1xuXG4gICAgICBjb250ZXh0LmZpbGxUZXh0KFwiTG9hZGluZy4uLiBcIiArIHRoaXMucmVzb3VyY2VNYW5hZ2VyLmdldFBlcmNlbnRDb21wbGV0ZSgpICsgXCIlXCIsIHRoaXMud2lkdGggKiAwLjEsIHRoaXMuaGVpZ2h0ICogMC41NSk7XG5cbiAgICAgIGNvbnRleHQuc3Ryb2tlUmVjdCh0aGlzLndpZHRoICogMC4xLCB0aGlzLmhlaWdodCAqIDAuNywgdGhpcy53aWR0aCAqIDAuOCwgdGhpcy5oZWlnaHQgKiAwLjEpO1xuICAgICAgY29udGV4dC5maWxsUmVjdCh0aGlzLndpZHRoICogMC4xLCB0aGlzLmhlaWdodCAqIDAuNywgKHRoaXMud2lkdGggKiAwLjgpICogdGhpcy5yZXNvdXJjZU1hbmFnZXIuZ2V0UGVyY2VudENvbXBsZXRlKCkvMTAwLCB0aGlzLmhlaWdodCAqIDAuMSk7XG5cbiAgICAgIGNvbnRleHQubGluZVdpZHRoID0gNDtcbiAgICB9XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVDb3JlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9HYW1lQ29yZS5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRoZSBJbnB1dE1hbmFnZXIgaGFuZGxlcyBET00gZXZlbnRzIGZvciB1c2UgaW4gZ2FtZXMuXG4gKiBAbmFtZSBJbnB1dE1hbmFnZXJcbiAqIEBjb25zdHJ1Y3RvciBJbnB1dE1hbmFnZXJcbiAqL1xuXG5jb25zdCBIYW1tZXIgPSByZXF1aXJlKCdoYW1tZXJqcycpO1xuXG5jb25zdCBHYW1lQWN0aW9uID0gcmVxdWlyZSgnLi9HYW1lQWN0aW9uJyk7XG5jb25zdCBUb3VjaEFjdGlvbiA9IHJlcXVpcmUoJy4vVG91Y2hBY3Rpb24nKTtcbmNvbnN0IE1vdXNlQWN0aW9uID0gcmVxdWlyZSgnLi9Nb3VzZUFjdGlvbicpO1xuY29uc3QgaW5zaWRlQ2FudmFzID0gcmVxdWlyZSgnLi91dGlscy9pbnNpZGVDYW52YXMnKTtcbmNvbnN0IGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuZnVuY3Rpb24gb24gKGVsZW1lbnQsIG5hbWUsIGhhbmRsZXIpIHtcbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGhhbmRsZXIpO1xuICByZXR1cm4gZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCBoYW5kbGVyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwb3NpdGlvbihub2RlKXtcbiAgdmFyIGJvdW5kaW5nUmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHJldHVybiB7XG4gICAgeDogYm91bmRpbmdSZWN0LmxlZnQsXG4gICAgeTogYm91bmRpbmdSZWN0LnRvcFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKG5vZGUpe1xuICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkgfHwge307XG59XG5cbmZ1bmN0aW9uIHRvUGl4ZWwodmFsdWUpe1xuICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSkgfHwgMDtcbn1cblxuZnVuY3Rpb24gZ2V0TWFyZ2luRXh0ZW50cyhub2RlKXtcbiAgdmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgdmFyIGwgPSB0b1BpeGVsKHN0eWxlLm1hcmdpbkxlZnQpO1xuICB2YXIgdCA9IHRvUGl4ZWwoc3R5bGUubWFyZ2luVG9wKTtcbiAgdmFyIHIgPSB0b1BpeGVsKHN0eWxlLm1hcmdpblJpZ2h0KTtcbiAgdmFyIGIgPSB0b1BpeGVsKHN0eWxlLm1hcmdpbkJvdHRvbSk7XG4gIHJldHVybiB7XG4gICAgdzogbCArIHIsXG4gICAgaDogdCArIGJcbiAgfTtcbn1cblxuY2xhc3MgSW5wdXRNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KXtcblxuICAgIC8qKlxuICAgICAqIE9iamVjdCBvZiBrZXlBY3Rpb25zIGJlaW5nIGxpc3RlbmVkIGZvclxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5rZXlBY3Rpb25zID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBNb3VzZUFjdGlvbiB0byBrZWVwIHRyYWNrIG9mIHRoZSBtb3VzZSdzIHN0YXRlXG4gICAgICogQHR5cGUge01vdXNlQWN0aW9ufVxuICAgICAqIEBtZW1iZXJPZiBJbnB1dE1hbmFnZXIjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLm1vdXNlQWN0aW9uID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBUb3VjaEFjdGlvbiB0byBrZWVwIHRyYWNrIG9mIHRvdWNoIGV2ZW50c1xuICAgICAqIEB0eXBlIHtUb3VjaEFjdGlvbn1cbiAgICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy50b3VjaEFjdGlvbiA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgSFRNTDUgY2FudmFzIG9uIHdoaWNoIHRvIGxpc3RlbiBmb3IgZXZlbnRzXG4gICAgICogQHR5cGUge0NhbnZhc31cbiAgICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5jYW52YXMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgdG8gbGlzdGVuIGZvciBtb3VzZSBldmVudHNcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICogQGRlcHJlY2F0ZWQgTW91c2UgaXMgYWx3YXlzIGhhbmRsZWQsIHVzZSBlbXVsYXRlTW91c2UgdG8gc3BlY2lmeSBob3cgdG8gaGFuZGxlIGl0XG4gICAgICovXG4gICAgdGhpcy5oYW5kbGVNb3VzZSA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIG9yIG5vdCB0byBsaXN0ZW4gZm9yIHRvdWNoIGV2ZW50c1xuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBtZW1iZXJPZiBJbnB1dE1hbmFnZXIjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKiBAZGVwcmVjYXRlZCBUb3VjaCBpcyBhbHdheXMgaGFuZGxlZCwgdXNlIGVtdWxhdGVNb3VzZSB0byBzcGVjaWZ5IGhvdyB0byBoYW5kbGUgaXRcbiAgICAgKi9cbiAgICB0aGlzLmhhbmRsZVRvdWNoID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgb3Igbm90IHRvIGxpc3RlbiBmb3Iga2V5Ym9hcmQgZXZlbnRzXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuaGFuZGxlS2V5cyA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgRE9NIGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgZ2FtZSdzIGNhbnZhc1xuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqIEBtZW1iZXJPZiBJbnB1dE1hbmFnZXIjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmdhbWVBcmVhID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwZXJjZW50YWdlICgwIHRvIDEuMCkgb2YgdGhlIGhlaWdodCBhbmQgd2lkdGggdGhlIGNhbnZhcyBzaG91bGQgdXNlIHRvIGZpbGwgaW4gaXRzIGNvbnRhaW5lciBET00gZWxlbWVudFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuY2FudmFzUGVyY2VudGFnZSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBFbXVsYXRlIG1vdXNlIGV2ZW50cyB3aGVuIHVzaW5nIHRvdWNoXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuZW11bGF0ZU1vdXNlID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEluc3RhbmNlIG9mIEhhbW1lci5qcyAtIFlvdSBjYW4gcGFzcyBpbiBhIEhhbW1lcigpIGNvbnN0cnVjdG9yIHdpdGggb3B0aW9ucyB0byBjdXN0b21pemUgeW91ciBIYW1tZXIgaW5zdGFuY2VcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBtZW1iZXJPZiBJbnB1dE1hbmFnZXIjXG4gICAgICogQGRlZmF1bHQgSGFtbWVyIGluc3RhbmNlLCBib3VuZCB0byBkb2N1bWVudCwgd2l0aCBwcmV2ZW50X2RlZmF1bHQ6IHRydWUsIGRyYWdfbWF4X3RvdWNoZXM6IDAsIGFuZCBob2xkOiBmYWxzZVxuICAgICAqL1xuICAgIHRoaXMuaGFtbWVyID0gbnVsbDtcblxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0aW9ucyk7XG5cbiAgICBpZighdGhpcy5oYW1tZXIpe1xuICAgICAgdGhpcy5oYW1tZXIgPSBuZXcgSGFtbWVyKGRvY3VtZW50LmJvZHksIHtcbiAgICAgICAgcHJldmVudF9kZWZhdWx0OiB0cnVlLFxuICAgICAgICBkcmFnX21heF90b3VjaGVzOiAwLFxuICAgICAgICAvLyBIb2xkIHVzZXMgc2V0VGltZW91dCB3aGljaCBpcyB2ZXJ5IGJhZCBmb3IgcGVyZm9ybWFuY2VcbiAgICAgICAgLy8gVE9ETzogRG8gd2Ugd2FudCB0byBhbGxvdyB0aGlzIHRvIGJlIG92ZXJyaWRkZW4/XG4gICAgICAgIGhvbGQ6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZighdGhpcy5rZXlBY3Rpb25zKXtcbiAgICAgIHRoaXMua2V5QWN0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFudXAoaGFuZGxlcil7XG4gICAgICBoYW5kbGVyLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIGlmKHRoaXMuaGFuZGxlS2V5cyl7XG4gICAgICB0aGlzLnB1c2hDbGVhbnVwKG9uKGRvY3VtZW50LCAna2V5ZG93bicsIHRoaXMua2V5ZG93bi5iaW5kKHRoaXMpKSwgY2xlYW51cCk7XG4gICAgICB0aGlzLnB1c2hDbGVhbnVwKG9uKGRvY3VtZW50LCAna2V5dXAnLCB0aGlzLmtleXVwLmJpbmQodGhpcykpLCBjbGVhbnVwKTtcbiAgICB9XG5cbiAgICBpZignb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudCl7XG4gICAgICB0aGlzLnB1c2hDbGVhbnVwKG9uKGRvY3VtZW50LCAndG91Y2hzdGFydCcsIHRoaXMudG91Y2hzdGFydC5iaW5kKHRoaXMpKSwgY2xlYW51cCk7XG4gICAgICB0aGlzLnB1c2hDbGVhbnVwKG9uKGRvY3VtZW50LCAndG91Y2htb3ZlJywgdGhpcy50b3VjaG1vdmUuYmluZCh0aGlzKSksIGNsZWFudXApO1xuICAgICAgdGhpcy5wdXNoQ2xlYW51cChvbihkb2N1bWVudCwgJ3RvdWNoZW5kJywgdGhpcy50b3VjaGVuZC5iaW5kKHRoaXMpKSwgY2xlYW51cCk7XG5cbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHRoaXMucHVzaENsZWFudXAob24oZG9jdW1lbnQsICdtb3VzZWRvd24nLCB0aGlzLm1vdXNlZG93bi5iaW5kKHRoaXMpKSwgY2xlYW51cCk7XG4gICAgICB0aGlzLnB1c2hDbGVhbnVwKG9uKGRvY3VtZW50LCAnbW91c2Vtb3ZlJywgdGhpcy5tb3VzZW1vdmUuYmluZCh0aGlzKSksIGNsZWFudXApO1xuICAgICAgdGhpcy5wdXNoQ2xlYW51cChvbihkb2N1bWVudCwgJ21vdXNldXAnLCB0aGlzLm1vdXNldXAuYmluZCh0aGlzKSksIGNsZWFudXApO1xuICAgIH1cblxuXG4gICAgaWYoIXRoaXMubW91c2VBY3Rpb24pe1xuICAgICAgdGhpcy5tb3VzZUFjdGlvbiA9IG5ldyBNb3VzZUFjdGlvbigpO1xuICAgIH1cblxuICAgIGlmKCF0aGlzLnRvdWNoQWN0aW9uKXtcbiAgICAgIHRoaXMudG91Y2hBY3Rpb24gPSBuZXcgVG91Y2hBY3Rpb24oKTtcbiAgICB9XG5cbiAgICBpZih0aGlzLmVtdWxhdGVNb3VzZSl7XG5cbiAgICAgIC8vZGEgaGVsbCBoYW1tZXIsIGdvdHRhIGRvIHRoaXMgb3Vyc2V2bGVzIG5vdz9cblxuICAgICAgLy8gdGhpcy5vbigndG91Y2gnLCB0aGlzLm1vdXNlZG93bi5iaW5kKHRoaXMpKTtcbiAgICAgIC8vIHRoaXMub24oJ2RyYWcnLCB0aGlzLm1vdXNlbW92ZS5iaW5kKHRoaXMpKTtcbiAgICAgIC8vIHRoaXMub24oJ3JlbGVhc2UnLCB0aGlzLm1vdXNldXAuYmluZCh0aGlzKSk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAvL2RhIGhlbGwgaGFtbWVyLCBnb3R0YSBkbyB0aGlzIG91cnNldmxlcyBub3c/XG4gICAgICAvLyB0aGlzLm9uKCd0b3VjaCcsIHRoaXMudG91Y2hzdGFydC5iaW5kKHRoaXMpKTtcbiAgICAgIC8vIHRoaXMub24oJ2RyYWcnLCB0aGlzLnRvdWNobW92ZS5iaW5kKHRoaXMpKTtcbiAgICAgIC8vIHRoaXMub24oJ3JlbGVhc2UnLCB0aGlzLnRvdWNoZW5kLmJpbmQodGhpcykpO1xuXG4gICAgfVxuXG4gICAgaWYodGhpcy5nYW1lQXJlYSAmJiB0aGlzLmNhbnZhc1BlcmNlbnRhZ2Upe1xuICAgICAgdmFyIGhhbmRsZXIgPSB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMpO1xuXG4gICAgICAvLyBMaXN0ZW4gZm9yIHJlc2l6ZSBjaGFuZ2VzXG5cbiAgICAgIHRoaXMucHVzaENsZWFudXAob24od2luZG93LCAncmVzaXplJywgaGFuZGxlciksIGNsZWFudXApO1xuICAgICAgdGhpcy5wdXNoQ2xlYW51cChvbih3aW5kb3csICdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZXIpLCBjbGVhbnVwKTtcbiAgICB9XG5cbiAgICB0aGlzLm5vcm1hbGl6ZVBvaW50ID0gdGhpcy5ub3JtYWxpemVQb2ludC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaW5zaWRlQ2FudmFzID0gdGhpcy5pbnNpZGVDYW52YXMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvd3MgeW91IHRvIGJpbmQgb3RoZXIgSGFtbWVyLmpzIGV2ZW50cyAoc3VjaCBhcyBTd2lwZSBvciBEb3VibGV0YXApO1xuICAgKiBXYXJuaW5nOiBPbmx5IHNldCBmbGFncyBvciB2YXJpYWJsZXMgaW4gdGhpcyBoYW5kbGVyLCBvdGhlcndpc2UgeW91ciBnYW1lIG1pZ2h0IGJlY29tZSBzbG93XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgKiBAcGFyYW0gIHtTdHJpbmd9IGdlc3R1cmUgVGhlIGdlc3R1cmUgdG8gYmluZFxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gaGFuZGxlciBFdmVudCBoYW5kbGVyIGNhbGxiYWNrXG4gICAqIEByZXR1cm4ge09iamVjdH0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHJlbW92ZSBmdW5jdGlvbiBmb3IgcmVtb3ZpbmcgdGhlIGV2ZW50LlxuICAgKi9cbiAgb24oZ2VzdHVyZSwgaGFuZGxlcil7XG4gICAgdmFyIGhhbW1lciA9IHRoaXMuaGFtbWVyO1xuICAgIHZhciByZW1vdmVDbGVhbnVwID0gdGhpcy5yZW1vdmVDbGVhbnVwO1xuXG4gICAgaGFtbWVyLm9uKGdlc3R1cmUsIGhhbmRsZXIpO1xuICAgIHZhciBjbGVhbnVwID0gdGhpcy5wdXNoQ2xlYW51cChbZ2VzdHVyZSwgaGFuZGxlcl0sIGZ1bmN0aW9uKGFyZ3Mpe1xuICAgICAgaGFtbWVyLm9mZi5hcHBseShoYW1tZXIsIGFyZ3MpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgcmVtb3ZlQ2xlYW51cChjbGVhbnVwKTtcbiAgICAgICAgY2xlYW51cCgpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHdoZXRoZXIgYSBwb2ludCBpcyB3aXRoaW4gdGhlIElucHV0TWFuYWdlcidzIGNhbnZhc1xuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICogQHBhcmFtICB7UG9pbnR9IHBvaW50IFBvaW50IHRvIHRlc3RcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHBvaW50IGlzIGluc2lkZSB0aGlzIElucHV0TWFuYWdlcidzIGNhbnZhc1xuICAgKi9cbiAgaW5zaWRlQ2FudmFzKHBvaW50KXtcbiAgICByZXR1cm4gaW5zaWRlQ2FudmFzKHBvaW50LCB0aGlzLmNhbnZhcyk7XG4gIH1cblxuICAvKipcbiAgICogTWFwcyBhIEdhbWVBY3Rpb24gdG8gYSBzcGVjaWZpYyBrZXkuIFRoZSBrZXkgY29kZXMgYXJlIGRlZmluZWQgaW4gZG9qby5rZXlzLlxuICAgKiBJZiB0aGUga2V5IGFscmVhZHkgaGFzIGEgR2FtZUFjdGlvbiBtYXBwZWQgdG8gaXQsIHRoZSBuZXcgR2FtZUFjdGlvbiBvdmVyd3JpdGVzIGl0LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICogQHBhcmFtIHtHYW1lQWN0aW9ufSBnYW1lQWN0aW9uIHRoZSBHYW1lQWN0aW9uIHRvIG1hcFxuICAgKiBAcGFyYW0ge09iamVjdH0ga2V5Q29kZSBkb2pvLmtleXMga2V5IGNvZGUsIG9yIGNoYXJhY3RlclxuICAgKi9cbiAgbWFwVG9LZXkoZ2FtZUFjdGlvbiwga2V5Q29kZSl7XG4gICAgdGhpcy5rZXlBY3Rpb25zW2tleUNvZGVdID0gZ2FtZUFjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgR2FtZUFjdGlvbiB0byBhIGtleVxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICogQHBhcmFtIHtPYmplY3R9IGtleUNvZGUgS2V5IGNoYXJhY3RlciBvciBkb2pvL2tleXMga2V5IGNvZGVcbiAgICogQHBhcmFtIHtCb29sZWFuPX0gaW5pdGlhbFByZXNzT25seSBEbyBvbmx5IG9uZSBmaXJlIG9mIHRoZSBhY3Rpb24gcGVyIGtleXByZXNzXG4gICAqIEByZXR1cm4ge0dhbWVBY3Rpb259IEdhbWVBY3Rpb24gdGhhdCBpcyBtYXBwZWQgdG8ga2V5Q29kZVxuICAgKi9cbiAgYWRkS2V5QWN0aW9uKGtleUNvZGUsIGluaXRpYWxQcmVzc09ubHkpe1xuICAgIHZhciBnYSA9IG5ldyBHYW1lQWN0aW9uKCk7XG4gICAgaWYoaW5pdGlhbFByZXNzT25seSl7XG4gICAgICBnYS5iZWhhdmlvciA9IGdhLmRldGVjdEluaXRpYWxQcmVzc09ubHk7XG4gICAgfVxuICAgIHRoaXMubWFwVG9LZXkoZ2Esa2V5Q29kZSk7XG5cbiAgICByZXR1cm4gZ2E7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhcnJvdyBrZXkgR2FtZUFjdGlvbnNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBJbnB1dE1hbmFnZXIjXG4gICAqL1xuICBhZGRBcnJvd0tleUFjdGlvbnMoKXtcbiAgICB0aGlzLmFkZEtleUFjdGlvbihrZXlzLlVQKTtcbiAgICB0aGlzLmFkZEtleUFjdGlvbihrZXlzLkRPV04pO1xuICAgIHRoaXMuYWRkS2V5QWN0aW9uKGtleXMuTEVGVCk7XG4gICAgdGhpcy5hZGRLZXlBY3Rpb24oa2V5cy5SSUdIVCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHVwb24gbW91c2V1cCBldmVudFxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICogQHBhcmFtICB7RXZlbnR9IGUgRXZlbnQgb2JqZWN0XG4gICAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbG93ZXJjYXNlIG5hbWUgaW5zdGVhZCAtIHNhbWUgc3ludGF4IGFzIG5vcm1hbCBldmVudCBoYW5kbGluZ1xuICAgKi9cbiAgbW91c2VVcChlKSB7XG4gICAgdGhpcy5tb3VzZXVwKGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB1cG9uIG1vdXNldXAgZXZlbnRcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBJbnB1dE1hbmFnZXIjXG4gICAqIEBwYXJhbSAge0V2ZW50fSBlIEV2ZW50IG9iamVjdFxuICAgKi9cbiAgbW91c2V1cChlKXtcbiAgICB0aGlzLm1vdXNlQWN0aW9uLnJlbGVhc2UodGhpcy5ub3JtYWxpemVQb2ludChlKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHVwb24gbW91c2Vkb3duIGV2ZW50XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgKiBAcGFyYW0gIHtFdmVudH0gZSBFdmVudCBvYmplY3RcbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBsb3dlcmNhc2UgbmFtZSBpbnN0ZWFkIC0gc2FtZSBzeW50YXggYXMgbm9ybWFsIGV2ZW50IGhhbmRsaW5nXG4gICAqL1xuICBtb3VzZURvd24oZSl7XG4gICAgdGhpcy5tb3VzZWRvd24oZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHVwb24gbW91c2Vkb3duIGV2ZW50XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgKiBAcGFyYW0gIHtFdmVudH0gZSBFdmVudCBvYmplY3RcbiAgICovXG4gIG1vdXNlZG93bihlKXtcbiAgICAvLyBFbnN1cmUgbW91c2UgaGFzIGJlZW4gcmVsZWFzZWRcbiAgICB0aGlzLm1vdXNlQWN0aW9uLnJlbGVhc2UobnVsbCk7XG4gICAgdmFyIGN1cnJlbnRQb2ludCA9IHRoaXMubm9ybWFsaXplUG9pbnQoZSk7XG4gICAgdGhpcy5tb3VzZUFjdGlvbi5pbnNpZGVDYW52YXMgPSB0aGlzLmluc2lkZUNhbnZhcyhjdXJyZW50UG9pbnQpO1xuICAgIHRoaXMubW91c2VBY3Rpb24ucHJlc3MoY3VycmVudFBvaW50KTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENhbGxlZCB1cG9uIG1vdXNlbW92ZSBldmVudFxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICogQHBhcmFtICB7RXZlbnR9IGUgRXZlbnQgb2JqZWN0XG4gICAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbG93ZXJjYXNlIG5hbWUgaW5zdGVhZCAtIHNhbWUgc3ludGF4IGFzIG5vcm1hbCBldmVudCBoYW5kbGluZ1xuICAgKi9cbiAgbW91c2VNb3ZlKGUpe1xuICAgIHRoaXMubW91c2Vtb3ZlKGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB1cG9uIG1vdXNlbW92ZSBldmVudFxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICogQHBhcmFtICB7RXZlbnR9IGUgRXZlbnQgb2JqZWN0XG4gICAqL1xuICBtb3VzZW1vdmUoZSl7XG4gICAgdGhpcy5tb3VzZUFjdGlvbi5wb3NpdGlvbiA9IHRoaXMubm9ybWFsaXplUG9pbnQoZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHVwb24gdG91Y2hzdGFydCBldmVudFxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICogQHBhcmFtICB7RXZlbnR9IGUgRXZlbnQgb2JqZWN0XG4gICAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbG93ZXJjYXNlIG5hbWUgaW5zdGVhZCAtIHNhbWUgc3ludGF4IGFzIG5vcm1hbCBldmVudCBoYW5kbGluZ1xuICAgKi9cbiAgdG91Y2hTdGFydChlKXtcbiAgICB0aGlzLnRvdWNoc3RhcnQoZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHVwb24gdG91Y2hzdGFydCBldmVudFxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICogQHBhcmFtICB7RXZlbnR9IGUgRXZlbnQgb2JqZWN0XG4gICAqL1xuICB0b3VjaHN0YXJ0KGUpe1xuICAgIC8vIEVuc3VyZSB0b3VjaCBoYXMgYmVlbiByZWxlYXNlZFxuICAgIHRoaXMudG91Y2hBY3Rpb24ucmVsZWFzZShudWxsKTtcbiAgICBjb25zb2xlLmxvZyhlLnRvdWNoZXMsIGUpO1xuICAgIC8vVG91Y2hMaXN0IGRvZXNuJ3QgaW1wbGVtZW50IC5tYXAoKVxuICAgIGNvbnN0IGN1cnJlbnRQb2ludHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGUudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY3VycmVudFBvaW50cy5wdXNoKHRoaXMubm9ybWFsaXplUG9pbnQoZS50b3VjaGVzW2ldKSk7XG4gICAgfVxuICAgIHRoaXMudG91Y2hBY3Rpb24uaW5zaWRlQ2FudmFzID0gY3VycmVudFBvaW50cy5zb21lKHRoaXMuaW5zaWRlQ2FudmFzKTtcbiAgICB0aGlzLnRvdWNoQWN0aW9uLnByZXNzKGN1cnJlbnRQb2ludHMpO1xuICAgIGlmKHRoaXMuZW11bGF0ZU1vdXNlKXtcbiAgICAgIHRoaXMubW91c2Vkb3duKGUudG91Y2hlc1swXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB1cG9uIHRvdWNoZW5kIGV2ZW50XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgKiBAcGFyYW0gIHtFdmVudH0gZSBFdmVudCBvYmplY3RcbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBsb3dlcmNhc2UgbmFtZSBpbnN0ZWFkIC0gc2FtZSBzeW50YXggYXMgbm9ybWFsIGV2ZW50IGhhbmRsaW5nXG4gICAqL1xuICB0b3VjaEVuZChlKXtcbiAgICB0aGlzLnRvdWNoZW5kKGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB1cG9uIHRvdWNoZW5kIGV2ZW50XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgKiBAcGFyYW0gIHtFdmVudH0gZSBFdmVudCBvYmplY3RcbiAgICovXG4gIHRvdWNoZW5kKGUpe1xuICAgIC8vVG91Y2hMaXN0IGRvZXNuJ3QgaW1wbGVtZW50IC5tYXAoKVxuICAgIGNvbnN0IGN1cnJlbnRQb2ludHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGUudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY3VycmVudFBvaW50cy5wdXNoKHRoaXMubm9ybWFsaXplUG9pbnQoZS50b3VjaGVzW2ldKSk7XG4gICAgfVxuICAgIHRoaXMudG91Y2hBY3Rpb24ucmVsZWFzZShjdXJyZW50UG9pbnRzKTtcbiAgICBpZih0aGlzLmVtdWxhdGVNb3VzZSl7XG4gICAgICB0aGlzLm1vdXNlVXAoZS50b3VjaGVzWzBdKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHVwb24gdG91Y2htb3ZlIGV2ZW50XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgKiBAcGFyYW0gIHtFdmVudH0gZSBFdmVudCBvYmplY3RcbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBsb3dlcmNhc2UgbmFtZSBpbnN0ZWFkIC0gc2FtZSBzeW50YXggYXMgbm9ybWFsIGV2ZW50IGhhbmRsaW5nXG4gICAqL1xuICB0b3VjaE1vdmUoZSl7XG4gICAgdGhpcy50b3VjaG1vdmUoZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHVwb24gdG91Y2htb3ZlIGV2ZW50XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgKiBAcGFyYW0gIHtFdmVudH0gZSBFdmVudCBvYmplY3RcbiAgICovXG4gIHRvdWNobW92ZShlKXtcbiAgICAvL1RvdWNoTGlzdCBkb2Vzbid0IGltcGxlbWVudCAubWFwKClcbiAgICBjb25zdCBjdXJyZW50UG9pbnRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlLnRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGN1cnJlbnRQb2ludHMucHVzaCh0aGlzLm5vcm1hbGl6ZVBvaW50KGUudG91Y2hlc1tpXSkpO1xuICAgIH1cbiAgICB0aGlzLnRvdWNoQWN0aW9uLnBvc2l0aW9ucyA9IGN1cnJlbnRQb2ludHM7XG4gICAgaWYodGhpcy50b3VjaEFjdGlvbi5zdGFydFBvc2l0aW9ucyl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIGlmKHRoaXMuZW11bGF0ZU1vdXNlKXtcbiAgICAgIHRoaXMubW91c2Vtb3ZlKGUudG91Y2hlc1swXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgR2FtZUFjdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGtleUNvZGUgb24gdGhlIGV2ZW50IG9iamVjdFxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICogQHBhcmFtICB7RXZlbnR9IGUgRXZlbnQgb2JqZWN0XG4gICAqIEByZXR1cm4ge0dhbWVBY3Rpb258bnVsbH0gVGhlIEdhbWVBY3Rpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBrZXlDb2RlIGVsc2UgbnVsbFxuICAgKi9cbiAgZ2V0S2V5QWN0aW9uKGUpIHtcbiAgICBpZiAodGhpcy5rZXlBY3Rpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy5rZXlBY3Rpb25zW2Uua2V5Q29kZV0gfHwgdGhpcy5rZXlBY3Rpb25zW1N0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgdXBvbiBrZXlwcmVzcyBldmVudFxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICogQHBhcmFtICB7RXZlbnR9IGUgRXZlbnQgb2JqZWN0XG4gICAqIEBkZXByZWNhdGVkIFVzZSBrZXlkb3duIGluc3RlYWQgLSBzYW1lIHN5bnRheCBhcyBub3JtYWwgZXZlbnQgaGFuZGxpbmdcbiAgICovXG4gIGtleVByZXNzZWQoZSkge1xuICAgIHRoaXMua2V5ZG93bihlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgdXBvbiBrZXlkb3duIGV2ZW50XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgKiBAcGFyYW0gIHtFdmVudH0gZSBFdmVudCBvYmplY3RcbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBsb3dlcmNhc2UgbmFtZSBpbnN0ZWFkIC0gc2FtZSBzeW50YXggYXMgbm9ybWFsIGV2ZW50IGhhbmRsaW5nXG4gICAqL1xuICBrZXlEb3duKGUpe1xuICAgIHRoaXMua2V5ZG93bihlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgdXBvbiBrZXlkb3duIGV2ZW50XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgKiBAcGFyYW0gIHtFdmVudH0gZSBFdmVudCBvYmplY3RcbiAgICovXG4gIGtleWRvd24oZSkge1xuICAgIHZhciBnYW1lQWN0aW9uID0gdGhpcy5nZXRLZXlBY3Rpb24oZSk7XG4gICAgaWYgKGdhbWVBY3Rpb24gJiYgIWdhbWVBY3Rpb24uaXNQcmVzc2VkKCkpIHtcbiAgICAgIGdhbWVBY3Rpb24ucHJlc3MoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHVwb24ga2V5dXAgZXZlbnRcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBJbnB1dE1hbmFnZXIjXG4gICAqIEBwYXJhbSAge0V2ZW50fSBlIEV2ZW50IG9iamVjdFxuICAgKiBAZGVwcmVjYXRlZCBVc2Uga2V5dXAgaW5zdGVhZCAtIHNhbWUgc3ludGF4IGFzIG5vcm1hbCBldmVudCBoYW5kbGluZ1xuICAgKi9cbiAga2V5UmVsZWFzZWQoZSl7XG4gICAgdGhpcy5rZXl1cChlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgdXBvbiBrZXl1cCBldmVudFxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICogQHBhcmFtICB7RXZlbnR9IGUgRXZlbnQgb2JqZWN0XG4gICAqL1xuICBrZXl1cChlKSB7XG4gICAgdmFyIGdhbWVBY3Rpb24gPSB0aGlzLmdldEtleUFjdGlvbihlKTtcbiAgICBpZiAoZ2FtZUFjdGlvbikge1xuICAgICAgZ2FtZUFjdGlvbi5yZWxlYXNlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gZ2V0IGEgbm9ybWFsaXplZCBwb2ludCBvdXQgb2YgYW4gRXZlbnQgb2JqZWN0XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgKiBAcGFyYW0gIHtFdmVudH0gZXZ0IEV2ZW50IG9iamVjdFxuICAgKiBAcmV0dXJuIHtQb2ludH0gTm9ybWFsaXplZCBwb2ludFxuICAgKiBAZGVwcmVjYXRlZCBEZXByZWNhdGVkIGluIGZhdm9yIG9mIG5vcm1hbGl6ZVBvaW50IGZ1bmN0aW9uIChTYW1lIGZ1bmN0aW9uYWxpdHksIGRpZmZlcmVudCBuYW1lKVxuICAgKi9cbiAgZ2V0TW91c2VMb2MoZXZ0KXtcbiAgICByZXR1cm4gdGhpcy5ub3JtYWxpemVQb2ludChldnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gZ2V0IGEgbm9ybWFsaXplZCBwb2ludCBvdXQgb2YgYW4gRXZlbnQgb2JqZWN0XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgSW5wdXRNYW5hZ2VyI1xuICAgKiBAcGFyYW0gIHtFdmVudH0gZXZ0IEV2ZW50IG9iamVjdFxuICAgKiBAcmV0dXJuIHtQb2ludH0gTm9ybWFsaXplZCBwb2ludFxuICAgKi9cbiAgbm9ybWFsaXplUG9pbnQoZXZ0KXtcbiAgICBpZihldnQpe1xuICAgICAgdmFyIGNvb3Jkc00gPSBwb3NpdGlvbih0aGlzLmNhbnZhcyk7XG4gICAgICBpZih0aGlzLnpvb21SYXRpbyl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgeDogTWF0aC5yb3VuZCgoZXZ0LmNsaWVudFggLSBjb29yZHNNLngpIC8gdGhpcy56b29tUmF0aW8pLFxuICAgICAgICAgIHk6IE1hdGgucm91bmQoKGV2dC5jbGllbnRZIC0gY29vcmRzTS55KSAvIHRoaXMuem9vbVJhdGlvKVxuICAgICAgICB9O1xuICAgICAgfWVsc2V7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgeDogTWF0aC5yb3VuZChldnQuY2xpZW50WCAtIGNvb3Jkc00ueCksXG4gICAgICAgICAgeTogTWF0aC5yb3VuZChldnQuY2xpZW50WSAtIGNvb3Jkc00ueSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byByZXNpemUgdGhlIGNhbnZhc1xuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIElucHV0TWFuYWdlciNcbiAgICovXG4gIHJlc2l6ZSgpe1xuICAgIGlmKHRoaXMuZ2FtZUFyZWEgJiYgdGhpcy5jYW52YXNQZXJjZW50YWdlICYmIHRoaXMuY2FudmFzKXtcbiAgICAgIHZhciBjYW52YXNXaWR0aCA9IHRoaXMuY2FudmFzLndpZHRoO1xuICAgICAgdmFyIGNhbnZhc0hlaWdodCA9IHRoaXMuY2FudmFzLmhlaWdodDtcblxuICAgICAgdmFyIGJvZHlNYXJnaW5zID0gZ2V0TWFyZ2luRXh0ZW50cyhkb2N1bWVudC5ib2R5KTtcblxuICAgICAgdmFyIG5ld1dpZHRoID0gd2luZG93LmlubmVyV2lkdGggLSBib2R5TWFyZ2lucy53O1xuICAgICAgdmFyIG5ld0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIGJvZHlNYXJnaW5zLmg7XG5cbiAgICAgIHZhciB3aWR0aFRvSGVpZ2h0ID0gY2FudmFzV2lkdGggLyBjYW52YXNIZWlnaHQ7XG4gICAgICB2YXIgbmV3V2lkdGhUb0hlaWdodCA9IG5ld1dpZHRoIC8gbmV3SGVpZ2h0O1xuXG4gICAgICB2YXIgbmV3V2lkdGhTdHlsZSA9ICcnO1xuICAgICAgdmFyIG5ld0hlaWdodFN0eWxlID0gJyc7XG4gICAgICBpZiAobmV3V2lkdGhUb0hlaWdodCA+IHdpZHRoVG9IZWlnaHQpIHtcbiAgICAgICAgbmV3V2lkdGggPSBuZXdIZWlnaHQgKiB3aWR0aFRvSGVpZ2h0O1xuICAgICAgICBuZXdXaWR0aFN0eWxlID0gbmV3V2lkdGggKyAncHgnO1xuICAgICAgICBuZXdIZWlnaHRTdHlsZSA9IG5ld0hlaWdodCArICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdXaWR0aFN0eWxlID0gbmV3V2lkdGggKyAncHgnO1xuICAgICAgICBuZXdIZWlnaHRTdHlsZSA9IE1hdGgucm91bmQobmV3V2lkdGggLyB3aWR0aFRvSGVpZ2h0KSArICdweCc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuem9vbVJhdGlvID0gbmV3V2lkdGggLyBjYW52YXNXaWR0aCAqIHRoaXMuY2FudmFzUGVyY2VudGFnZTtcblxuICAgICAgdGhpcy5nYW1lQXJlYS5zdHlsZS53aWR0aCA9IG5ld1dpZHRoU3R5bGU7XG4gICAgICB0aGlzLmdhbWVBcmVhLnN0eWxlLmhlaWdodCA9IG5ld0hlaWdodFN0eWxlO1xuXG4gICAgICB2YXIgY2FudmFzUGVyY2VudGFnZVN0eWxlID0gTWF0aC5mbG9vcih0aGlzLmNhbnZhc1BlcmNlbnRhZ2UgKiAxMDApICsgJyUnO1xuICAgICAgdGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSBjYW52YXNQZXJjZW50YWdlU3R5bGU7XG4gICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBjYW52YXNQZXJjZW50YWdlU3R5bGU7XG4gICAgICB0aGlzLmNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHRoaXMuY2FudmFzLnN0eWxlLm1hcmdpbkxlZnQgPSAnYXV0byc7XG4gICAgICB0aGlzLmNhbnZhcy5zdHlsZS5tYXJnaW5SaWdodCA9ICdhdXRvJztcbiAgICB9XG4gIH1cblxuICBwdXNoQ2xlYW51cChhLCBiKXtcbiAgICAvLyBjb25zb2xlLmxvZygncHVzaENsZWFudXAnLCBhLCBiKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXRNYW5hZ2VyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9JbnB1dE1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyohIEhhbW1lci5KUyAtIHYyLjAuNyAtIDIwMTYtMDQtMjJcbiAqIGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE2IEpvcmlrIFRhbmdlbGRlcjtcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsIGV4cG9ydE5hbWUsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbnZhciBWRU5ET1JfUFJFRklYRVMgPSBbJycsICd3ZWJraXQnLCAnTW96JywgJ01TJywgJ21zJywgJ28nXTtcbnZhciBURVNUX0VMRU1FTlQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxudmFyIFRZUEVfRlVOQ1RJT04gPSAnZnVuY3Rpb24nO1xuXG52YXIgcm91bmQgPSBNYXRoLnJvdW5kO1xudmFyIGFicyA9IE1hdGguYWJzO1xudmFyIG5vdyA9IERhdGUubm93O1xuXG4vKipcbiAqIHNldCBhIHRpbWVvdXQgd2l0aCBhIGdpdmVuIHNjb3BlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBzZXRUaW1lb3V0Q29udGV4dChmbiwgdGltZW91dCwgY29udGV4dCkge1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGJpbmRGbihmbiwgY29udGV4dCksIHRpbWVvdXQpO1xufVxuXG4vKipcbiAqIGlmIHRoZSBhcmd1bWVudCBpcyBhbiBhcnJheSwgd2Ugd2FudCB0byBleGVjdXRlIHRoZSBmbiBvbiBlYWNoIGVudHJ5XG4gKiBpZiBpdCBhaW50IGFuIGFycmF5IHdlIGRvbid0IHdhbnQgdG8gZG8gYSB0aGluZy5cbiAqIHRoaXMgaXMgdXNlZCBieSBhbGwgdGhlIG1ldGhvZHMgdGhhdCBhY2NlcHQgYSBzaW5nbGUgYW5kIGFycmF5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfEFycmF5fSBhcmdcbiAqIEBwYXJhbSB7U3RyaW5nfSBmblxuICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XVxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGludm9rZUFycmF5QXJnKGFyZywgZm4sIGNvbnRleHQpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgICAgIGVhY2goYXJnLCBjb250ZXh0W2ZuXSwgY29udGV4dCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogd2FsayBvYmplY3RzIGFuZCBhcnJheXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICovXG5mdW5jdGlvbiBlYWNoKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgaTtcblxuICAgIGlmICghb2JqKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob2JqLmZvckVhY2gpIHtcbiAgICAgICAgb2JqLmZvckVhY2goaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IG9iai5sZW5ndGgpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpIGluIG9iaikge1xuICAgICAgICAgICAgb2JqLmhhc093blByb3BlcnR5KGkpICYmIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIHdyYXAgYSBtZXRob2Qgd2l0aCBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgYW5kIHN0YWNrIHRyYWNlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIG5ldyBmdW5jdGlvbiB3cmFwcGluZyB0aGUgc3VwcGxpZWQgbWV0aG9kLlxuICovXG5mdW5jdGlvbiBkZXByZWNhdGUobWV0aG9kLCBuYW1lLCBtZXNzYWdlKSB7XG4gICAgdmFyIGRlcHJlY2F0aW9uTWVzc2FnZSA9ICdERVBSRUNBVEVEIE1FVEhPRDogJyArIG5hbWUgKyAnXFxuJyArIG1lc3NhZ2UgKyAnIEFUIFxcbic7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcignZ2V0LXN0YWNrLXRyYWNlJyk7XG4gICAgICAgIHZhciBzdGFjayA9IGUgJiYgZS5zdGFjayA/IGUuc3RhY2sucmVwbGFjZSgvXlteXFwoXSs/W1xcbiRdL2dtLCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9eXFxzK2F0XFxzKy9nbSwgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXk9iamVjdC48YW5vbnltb3VzPlxccypcXCgvZ20sICd7YW5vbnltb3VzfSgpQCcpIDogJ1Vua25vd24gU3RhY2sgVHJhY2UnO1xuXG4gICAgICAgIHZhciBsb2cgPSB3aW5kb3cuY29uc29sZSAmJiAod2luZG93LmNvbnNvbGUud2FybiB8fCB3aW5kb3cuY29uc29sZS5sb2cpO1xuICAgICAgICBpZiAobG9nKSB7XG4gICAgICAgICAgICBsb2cuY2FsbCh3aW5kb3cuY29uc29sZSwgZGVwcmVjYXRpb25NZXNzYWdlLCBzdGFjayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbi8qKlxuICogZXh0ZW5kIG9iamVjdC5cbiAqIG1lYW5zIHRoYXQgcHJvcGVydGllcyBpbiBkZXN0IHdpbGwgYmUgb3ZlcndyaXR0ZW4gYnkgdGhlIG9uZXMgaW4gc3JjLlxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFxuICogQHBhcmFtIHsuLi5PYmplY3R9IG9iamVjdHNfdG9fYXNzaWduXG4gKiBAcmV0dXJucyB7T2JqZWN0fSB0YXJnZXRcbiAqL1xudmFyIGFzc2lnbjtcbmlmICh0eXBlb2YgT2JqZWN0LmFzc2lnbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIGFzc2lnbiA9IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQpIHtcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3V0cHV0ID0gT2JqZWN0KHRhcmdldCk7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XTtcbiAgICAgICAgICAgIGlmIChzb3VyY2UgIT09IHVuZGVmaW5lZCAmJiBzb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBuZXh0S2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KG5leHRLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRbbmV4dEtleV0gPSBzb3VyY2VbbmV4dEtleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xufSBlbHNlIHtcbiAgICBhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xufVxuXG4vKipcbiAqIGV4dGVuZCBvYmplY3QuXG4gKiBtZWFucyB0aGF0IHByb3BlcnRpZXMgaW4gZGVzdCB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBvbmVzIGluIHNyYy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXN0XG4gKiBAcGFyYW0ge09iamVjdH0gc3JjXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFttZXJnZT1mYWxzZV1cbiAqIEByZXR1cm5zIHtPYmplY3R9IGRlc3RcbiAqL1xudmFyIGV4dGVuZCA9IGRlcHJlY2F0ZShmdW5jdGlvbiBleHRlbmQoZGVzdCwgc3JjLCBtZXJnZSkge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoc3JjKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBrZXlzLmxlbmd0aCkge1xuICAgICAgICBpZiAoIW1lcmdlIHx8IChtZXJnZSAmJiBkZXN0W2tleXNbaV1dID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICBkZXN0W2tleXNbaV1dID0gc3JjW2tleXNbaV1dO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGRlc3Q7XG59LCAnZXh0ZW5kJywgJ1VzZSBgYXNzaWduYC4nKTtcblxuLyoqXG4gKiBtZXJnZSB0aGUgdmFsdWVzIGZyb20gc3JjIGluIHRoZSBkZXN0LlxuICogbWVhbnMgdGhhdCBwcm9wZXJ0aWVzIHRoYXQgZXhpc3QgaW4gZGVzdCB3aWxsIG5vdCBiZSBvdmVyd3JpdHRlbiBieSBzcmNcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXN0XG4gKiBAcGFyYW0ge09iamVjdH0gc3JjXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBkZXN0XG4gKi9cbnZhciBtZXJnZSA9IGRlcHJlY2F0ZShmdW5jdGlvbiBtZXJnZShkZXN0LCBzcmMpIHtcbiAgICByZXR1cm4gZXh0ZW5kKGRlc3QsIHNyYywgdHJ1ZSk7XG59LCAnbWVyZ2UnLCAnVXNlIGBhc3NpZ25gLicpO1xuXG4vKipcbiAqIHNpbXBsZSBjbGFzcyBpbmhlcml0YW5jZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2hpbGRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGJhc2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllc11cbiAqL1xuZnVuY3Rpb24gaW5oZXJpdChjaGlsZCwgYmFzZSwgcHJvcGVydGllcykge1xuICAgIHZhciBiYXNlUCA9IGJhc2UucHJvdG90eXBlLFxuICAgICAgICBjaGlsZFA7XG5cbiAgICBjaGlsZFAgPSBjaGlsZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKGJhc2VQKTtcbiAgICBjaGlsZFAuY29uc3RydWN0b3IgPSBjaGlsZDtcbiAgICBjaGlsZFAuX3N1cGVyID0gYmFzZVA7XG5cbiAgICBpZiAocHJvcGVydGllcykge1xuICAgICAgICBhc3NpZ24oY2hpbGRQLCBwcm9wZXJ0aWVzKTtcbiAgICB9XG59XG5cbi8qKlxuICogc2ltcGxlIGZ1bmN0aW9uIGJpbmRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBiaW5kRm4oZm4sIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gYm91bmRGbigpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn1cblxuLyoqXG4gKiBsZXQgYSBib29sZWFuIHZhbHVlIGFsc28gYmUgYSBmdW5jdGlvbiB0aGF0IG11c3QgcmV0dXJuIGEgYm9vbGVhblxuICogdGhpcyBmaXJzdCBpdGVtIGluIGFyZ3Mgd2lsbCBiZSB1c2VkIGFzIHRoZSBjb250ZXh0XG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IHZhbFxuICogQHBhcmFtIHtBcnJheX0gW2FyZ3NdXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gYm9vbE9yRm4odmFsLCBhcmdzKSB7XG4gICAgaWYgKHR5cGVvZiB2YWwgPT0gVFlQRV9GVU5DVElPTikge1xuICAgICAgICByZXR1cm4gdmFsLmFwcGx5KGFyZ3MgPyBhcmdzWzBdIHx8IHVuZGVmaW5lZCA6IHVuZGVmaW5lZCwgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB2YWw7XG59XG5cbi8qKlxuICogdXNlIHRoZSB2YWwyIHdoZW4gdmFsMSBpcyB1bmRlZmluZWRcbiAqIEBwYXJhbSB7Kn0gdmFsMVxuICogQHBhcmFtIHsqfSB2YWwyXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gaWZVbmRlZmluZWQodmFsMSwgdmFsMikge1xuICAgIHJldHVybiAodmFsMSA9PT0gdW5kZWZpbmVkKSA/IHZhbDIgOiB2YWwxO1xufVxuXG4vKipcbiAqIGFkZEV2ZW50TGlzdGVuZXIgd2l0aCBtdWx0aXBsZSBldmVudHMgYXQgb25jZVxuICogQHBhcmFtIHtFdmVudFRhcmdldH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcbiAqL1xuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnModGFyZ2V0LCB0eXBlcywgaGFuZGxlcikge1xuICAgIGVhY2goc3BsaXRTdHIodHlwZXMpLCBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiByZW1vdmVFdmVudExpc3RlbmVyIHdpdGggbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2VcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IHRhcmdldFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKHRhcmdldCwgdHlwZXMsIGhhbmRsZXIpIHtcbiAgICBlYWNoKHNwbGl0U3RyKHR5cGVzKSwgZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogZmluZCBpZiBhIG5vZGUgaXMgaW4gdGhlIGdpdmVuIHBhcmVudFxuICogQG1ldGhvZCBoYXNQYXJlbnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudFxuICogQHJldHVybiB7Qm9vbGVhbn0gZm91bmRcbiAqL1xuZnVuY3Rpb24gaGFzUGFyZW50KG5vZGUsIHBhcmVudCkge1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgIGlmIChub2RlID09IHBhcmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIHNtYWxsIGluZGV4T2Ygd3JhcHBlclxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IGZpbmRcbiAqIEByZXR1cm5zIHtCb29sZWFufSBmb3VuZFxuICovXG5mdW5jdGlvbiBpblN0cihzdHIsIGZpbmQpIHtcbiAgICByZXR1cm4gc3RyLmluZGV4T2YoZmluZCkgPiAtMTtcbn1cblxuLyoqXG4gKiBzcGxpdCBzdHJpbmcgb24gd2hpdGVzcGFjZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge0FycmF5fSB3b3Jkc1xuICovXG5mdW5jdGlvbiBzcGxpdFN0cihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRyaW0oKS5zcGxpdCgvXFxzKy9nKTtcbn1cblxuLyoqXG4gKiBmaW5kIGlmIGEgYXJyYXkgY29udGFpbnMgdGhlIG9iamVjdCB1c2luZyBpbmRleE9mIG9yIGEgc2ltcGxlIHBvbHlGaWxsXG4gKiBAcGFyYW0ge0FycmF5fSBzcmNcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaW5kXG4gKiBAcGFyYW0ge1N0cmluZ30gW2ZpbmRCeUtleV1cbiAqIEByZXR1cm4ge0Jvb2xlYW58TnVtYmVyfSBmYWxzZSB3aGVuIG5vdCBmb3VuZCwgb3IgdGhlIGluZGV4XG4gKi9cbmZ1bmN0aW9uIGluQXJyYXkoc3JjLCBmaW5kLCBmaW5kQnlLZXkpIHtcbiAgICBpZiAoc3JjLmluZGV4T2YgJiYgIWZpbmRCeUtleSkge1xuICAgICAgICByZXR1cm4gc3JjLmluZGV4T2YoZmluZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IHNyYy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICgoZmluZEJ5S2V5ICYmIHNyY1tpXVtmaW5kQnlLZXldID09IGZpbmQpIHx8ICghZmluZEJ5S2V5ICYmIHNyY1tpXSA9PT0gZmluZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxufVxuXG4vKipcbiAqIGNvbnZlcnQgYXJyYXktbGlrZSBvYmplY3RzIHRvIHJlYWwgYXJyYXlzXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG9iaiwgMCk7XG59XG5cbi8qKlxuICogdW5pcXVlIGFycmF5IHdpdGggb2JqZWN0cyBiYXNlZCBvbiBhIGtleSAobGlrZSAnaWQnKSBvciBqdXN0IGJ5IHRoZSBhcnJheSdzIHZhbHVlXG4gKiBAcGFyYW0ge0FycmF5fSBzcmMgW3tpZDoxfSx7aWQ6Mn0se2lkOjF9XVxuICogQHBhcmFtIHtTdHJpbmd9IFtrZXldXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtzb3J0PUZhbHNlXVxuICogQHJldHVybnMge0FycmF5fSBbe2lkOjF9LHtpZDoyfV1cbiAqL1xuZnVuY3Rpb24gdW5pcXVlQXJyYXkoc3JjLCBrZXksIHNvcnQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICB3aGlsZSAoaSA8IHNyYy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHZhbCA9IGtleSA/IHNyY1tpXVtrZXldIDogc3JjW2ldO1xuICAgICAgICBpZiAoaW5BcnJheSh2YWx1ZXMsIHZhbCkgPCAwKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goc3JjW2ldKTtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZXNbaV0gPSB2YWw7XG4gICAgICAgIGkrKztcbiAgICB9XG5cbiAgICBpZiAoc29ydCkge1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuc29ydCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuc29ydChmdW5jdGlvbiBzb3J0VW5pcXVlQXJyYXkoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhW2tleV0gPiBiW2tleV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xufVxuXG4vKipcbiAqIGdldCB0aGUgcHJlZml4ZWQgcHJvcGVydHlcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eVxuICogQHJldHVybnMge1N0cmluZ3xVbmRlZmluZWR9IHByZWZpeGVkXG4gKi9cbmZ1bmN0aW9uIHByZWZpeGVkKG9iaiwgcHJvcGVydHkpIHtcbiAgICB2YXIgcHJlZml4LCBwcm9wO1xuICAgIHZhciBjYW1lbFByb3AgPSBwcm9wZXJ0eVswXS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHkuc2xpY2UoMSk7XG5cbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBWRU5ET1JfUFJFRklYRVMubGVuZ3RoKSB7XG4gICAgICAgIHByZWZpeCA9IFZFTkRPUl9QUkVGSVhFU1tpXTtcbiAgICAgICAgcHJvcCA9IChwcmVmaXgpID8gcHJlZml4ICsgY2FtZWxQcm9wIDogcHJvcGVydHk7XG5cbiAgICAgICAgaWYgKHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcDtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogZ2V0IGEgdW5pcXVlIGlkXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB1bmlxdWVJZFxuICovXG52YXIgX3VuaXF1ZUlkID0gMTtcbmZ1bmN0aW9uIHVuaXF1ZUlkKCkge1xuICAgIHJldHVybiBfdW5pcXVlSWQrKztcbn1cblxuLyoqXG4gKiBnZXQgdGhlIHdpbmRvdyBvYmplY3Qgb2YgYW4gZWxlbWVudFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybnMge0RvY3VtZW50Vmlld3xXaW5kb3d9XG4gKi9cbmZ1bmN0aW9uIGdldFdpbmRvd0ZvckVsZW1lbnQoZWxlbWVudCkge1xuICAgIHZhciBkb2MgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQgfHwgZWxlbWVudDtcbiAgICByZXR1cm4gKGRvYy5kZWZhdWx0VmlldyB8fCBkb2MucGFyZW50V2luZG93IHx8IHdpbmRvdyk7XG59XG5cbnZhciBNT0JJTEVfUkVHRVggPSAvbW9iaWxlfHRhYmxldHxpcChhZHxob25lfG9kKXxhbmRyb2lkL2k7XG5cbnZhciBTVVBQT1JUX1RPVUNIID0gKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyk7XG52YXIgU1VQUE9SVF9QT0lOVEVSX0VWRU5UUyA9IHByZWZpeGVkKHdpbmRvdywgJ1BvaW50ZXJFdmVudCcpICE9PSB1bmRlZmluZWQ7XG52YXIgU1VQUE9SVF9PTkxZX1RPVUNIID0gU1VQUE9SVF9UT1VDSCAmJiBNT0JJTEVfUkVHRVgudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxudmFyIElOUFVUX1RZUEVfVE9VQ0ggPSAndG91Y2gnO1xudmFyIElOUFVUX1RZUEVfUEVOID0gJ3Blbic7XG52YXIgSU5QVVRfVFlQRV9NT1VTRSA9ICdtb3VzZSc7XG52YXIgSU5QVVRfVFlQRV9LSU5FQ1QgPSAna2luZWN0JztcblxudmFyIENPTVBVVEVfSU5URVJWQUwgPSAyNTtcblxudmFyIElOUFVUX1NUQVJUID0gMTtcbnZhciBJTlBVVF9NT1ZFID0gMjtcbnZhciBJTlBVVF9FTkQgPSA0O1xudmFyIElOUFVUX0NBTkNFTCA9IDg7XG5cbnZhciBESVJFQ1RJT05fTk9ORSA9IDE7XG52YXIgRElSRUNUSU9OX0xFRlQgPSAyO1xudmFyIERJUkVDVElPTl9SSUdIVCA9IDQ7XG52YXIgRElSRUNUSU9OX1VQID0gODtcbnZhciBESVJFQ1RJT05fRE9XTiA9IDE2O1xuXG52YXIgRElSRUNUSU9OX0hPUklaT05UQUwgPSBESVJFQ1RJT05fTEVGVCB8IERJUkVDVElPTl9SSUdIVDtcbnZhciBESVJFQ1RJT05fVkVSVElDQUwgPSBESVJFQ1RJT05fVVAgfCBESVJFQ1RJT05fRE9XTjtcbnZhciBESVJFQ1RJT05fQUxMID0gRElSRUNUSU9OX0hPUklaT05UQUwgfCBESVJFQ1RJT05fVkVSVElDQUw7XG5cbnZhciBQUk9QU19YWSA9IFsneCcsICd5J107XG52YXIgUFJPUFNfQ0xJRU5UX1hZID0gWydjbGllbnRYJywgJ2NsaWVudFknXTtcblxuLyoqXG4gKiBjcmVhdGUgbmV3IGlucHV0IHR5cGUgbWFuYWdlclxuICogQHBhcmFtIHtNYW5hZ2VyfSBtYW5hZ2VyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0lucHV0fVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIElucHV0KG1hbmFnZXIsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMuZWxlbWVudCA9IG1hbmFnZXIuZWxlbWVudDtcbiAgICB0aGlzLnRhcmdldCA9IG1hbmFnZXIub3B0aW9ucy5pbnB1dFRhcmdldDtcblxuICAgIC8vIHNtYWxsZXIgd3JhcHBlciBhcm91bmQgdGhlIGhhbmRsZXIsIGZvciB0aGUgc2NvcGUgYW5kIHRoZSBlbmFibGVkIHN0YXRlIG9mIHRoZSBtYW5hZ2VyLFxuICAgIC8vIHNvIHdoZW4gZGlzYWJsZWQgdGhlIGlucHV0IGV2ZW50cyBhcmUgY29tcGxldGVseSBieXBhc3NlZC5cbiAgICB0aGlzLmRvbUhhbmRsZXIgPSBmdW5jdGlvbihldikge1xuICAgICAgICBpZiAoYm9vbE9yRm4obWFuYWdlci5vcHRpb25zLmVuYWJsZSwgW21hbmFnZXJdKSkge1xuICAgICAgICAgICAgc2VsZi5oYW5kbGVyKGV2KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmluaXQoKTtcblxufVxuXG5JbnB1dC5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogc2hvdWxkIGhhbmRsZSB0aGUgaW5wdXRFdmVudCBkYXRhIGFuZCB0cmlnZ2VyIHRoZSBjYWxsYmFja1xuICAgICAqIEB2aXJ0dWFsXG4gICAgICovXG4gICAgaGFuZGxlcjogZnVuY3Rpb24oKSB7IH0sXG5cbiAgICAvKipcbiAgICAgKiBiaW5kIHRoZSBldmVudHNcbiAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5ldkVsICYmIGFkZEV2ZW50TGlzdGVuZXJzKHRoaXMuZWxlbWVudCwgdGhpcy5ldkVsLCB0aGlzLmRvbUhhbmRsZXIpO1xuICAgICAgICB0aGlzLmV2VGFyZ2V0ICYmIGFkZEV2ZW50TGlzdGVuZXJzKHRoaXMudGFyZ2V0LCB0aGlzLmV2VGFyZ2V0LCB0aGlzLmRvbUhhbmRsZXIpO1xuICAgICAgICB0aGlzLmV2V2luICYmIGFkZEV2ZW50TGlzdGVuZXJzKGdldFdpbmRvd0ZvckVsZW1lbnQodGhpcy5lbGVtZW50KSwgdGhpcy5ldldpbiwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdW5iaW5kIHRoZSBldmVudHNcbiAgICAgKi9cbiAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5ldkVsICYmIHJlbW92ZUV2ZW50TGlzdGVuZXJzKHRoaXMuZWxlbWVudCwgdGhpcy5ldkVsLCB0aGlzLmRvbUhhbmRsZXIpO1xuICAgICAgICB0aGlzLmV2VGFyZ2V0ICYmIHJlbW92ZUV2ZW50TGlzdGVuZXJzKHRoaXMudGFyZ2V0LCB0aGlzLmV2VGFyZ2V0LCB0aGlzLmRvbUhhbmRsZXIpO1xuICAgICAgICB0aGlzLmV2V2luICYmIHJlbW92ZUV2ZW50TGlzdGVuZXJzKGdldFdpbmRvd0ZvckVsZW1lbnQodGhpcy5lbGVtZW50KSwgdGhpcy5ldldpbiwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIGNyZWF0ZSBuZXcgaW5wdXQgdHlwZSBtYW5hZ2VyXG4gKiBjYWxsZWQgYnkgdGhlIE1hbmFnZXIgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7SGFtbWVyfSBtYW5hZ2VyXG4gKiBAcmV0dXJucyB7SW5wdXR9XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0SW5zdGFuY2UobWFuYWdlcikge1xuICAgIHZhciBUeXBlO1xuICAgIHZhciBpbnB1dENsYXNzID0gbWFuYWdlci5vcHRpb25zLmlucHV0Q2xhc3M7XG5cbiAgICBpZiAoaW5wdXRDbGFzcykge1xuICAgICAgICBUeXBlID0gaW5wdXRDbGFzcztcbiAgICB9IGVsc2UgaWYgKFNVUFBPUlRfUE9JTlRFUl9FVkVOVFMpIHtcbiAgICAgICAgVHlwZSA9IFBvaW50ZXJFdmVudElucHV0O1xuICAgIH0gZWxzZSBpZiAoU1VQUE9SVF9PTkxZX1RPVUNIKSB7XG4gICAgICAgIFR5cGUgPSBUb3VjaElucHV0O1xuICAgIH0gZWxzZSBpZiAoIVNVUFBPUlRfVE9VQ0gpIHtcbiAgICAgICAgVHlwZSA9IE1vdXNlSW5wdXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgVHlwZSA9IFRvdWNoTW91c2VJbnB1dDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyAoVHlwZSkobWFuYWdlciwgaW5wdXRIYW5kbGVyKTtcbn1cblxuLyoqXG4gKiBoYW5kbGUgaW5wdXQgZXZlbnRzXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICovXG5mdW5jdGlvbiBpbnB1dEhhbmRsZXIobWFuYWdlciwgZXZlbnRUeXBlLCBpbnB1dCkge1xuICAgIHZhciBwb2ludGVyc0xlbiA9IGlucHV0LnBvaW50ZXJzLmxlbmd0aDtcbiAgICB2YXIgY2hhbmdlZFBvaW50ZXJzTGVuID0gaW5wdXQuY2hhbmdlZFBvaW50ZXJzLmxlbmd0aDtcbiAgICB2YXIgaXNGaXJzdCA9IChldmVudFR5cGUgJiBJTlBVVF9TVEFSVCAmJiAocG9pbnRlcnNMZW4gLSBjaGFuZ2VkUG9pbnRlcnNMZW4gPT09IDApKTtcbiAgICB2YXIgaXNGaW5hbCA9IChldmVudFR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSAmJiAocG9pbnRlcnNMZW4gLSBjaGFuZ2VkUG9pbnRlcnNMZW4gPT09IDApKTtcblxuICAgIGlucHV0LmlzRmlyc3QgPSAhIWlzRmlyc3Q7XG4gICAgaW5wdXQuaXNGaW5hbCA9ICEhaXNGaW5hbDtcblxuICAgIGlmIChpc0ZpcnN0KSB7XG4gICAgICAgIG1hbmFnZXIuc2Vzc2lvbiA9IHt9O1xuICAgIH1cblxuICAgIC8vIHNvdXJjZSBldmVudCBpcyB0aGUgbm9ybWFsaXplZCB2YWx1ZSBvZiB0aGUgZG9tRXZlbnRzXG4gICAgLy8gbGlrZSAndG91Y2hzdGFydCwgbW91c2V1cCwgcG9pbnRlcmRvd24nXG4gICAgaW5wdXQuZXZlbnRUeXBlID0gZXZlbnRUeXBlO1xuXG4gICAgLy8gY29tcHV0ZSBzY2FsZSwgcm90YXRpb24gZXRjXG4gICAgY29tcHV0ZUlucHV0RGF0YShtYW5hZ2VyLCBpbnB1dCk7XG5cbiAgICAvLyBlbWl0IHNlY3JldCBldmVudFxuICAgIG1hbmFnZXIuZW1pdCgnaGFtbWVyLmlucHV0JywgaW5wdXQpO1xuXG4gICAgbWFuYWdlci5yZWNvZ25pemUoaW5wdXQpO1xuICAgIG1hbmFnZXIuc2Vzc2lvbi5wcmV2SW5wdXQgPSBpbnB1dDtcbn1cblxuLyoqXG4gKiBleHRlbmQgdGhlIGRhdGEgd2l0aCBzb21lIHVzYWJsZSBwcm9wZXJ0aWVzIGxpa2Ugc2NhbGUsIHJvdGF0ZSwgdmVsb2NpdHkgZXRjXG4gKiBAcGFyYW0ge09iamVjdH0gbWFuYWdlclxuICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVJbnB1dERhdGEobWFuYWdlciwgaW5wdXQpIHtcbiAgICB2YXIgc2Vzc2lvbiA9IG1hbmFnZXIuc2Vzc2lvbjtcbiAgICB2YXIgcG9pbnRlcnMgPSBpbnB1dC5wb2ludGVycztcbiAgICB2YXIgcG9pbnRlcnNMZW5ndGggPSBwb2ludGVycy5sZW5ndGg7XG5cbiAgICAvLyBzdG9yZSB0aGUgZmlyc3QgaW5wdXQgdG8gY2FsY3VsYXRlIHRoZSBkaXN0YW5jZSBhbmQgZGlyZWN0aW9uXG4gICAgaWYgKCFzZXNzaW9uLmZpcnN0SW5wdXQpIHtcbiAgICAgICAgc2Vzc2lvbi5maXJzdElucHV0ID0gc2ltcGxlQ2xvbmVJbnB1dERhdGEoaW5wdXQpO1xuICAgIH1cblxuICAgIC8vIHRvIGNvbXB1dGUgc2NhbGUgYW5kIHJvdGF0aW9uIHdlIG5lZWQgdG8gc3RvcmUgdGhlIG11bHRpcGxlIHRvdWNoZXNcbiAgICBpZiAocG9pbnRlcnNMZW5ndGggPiAxICYmICFzZXNzaW9uLmZpcnN0TXVsdGlwbGUpIHtcbiAgICAgICAgc2Vzc2lvbi5maXJzdE11bHRpcGxlID0gc2ltcGxlQ2xvbmVJbnB1dERhdGEoaW5wdXQpO1xuICAgIH0gZWxzZSBpZiAocG9pbnRlcnNMZW5ndGggPT09IDEpIHtcbiAgICAgICAgc2Vzc2lvbi5maXJzdE11bHRpcGxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGZpcnN0SW5wdXQgPSBzZXNzaW9uLmZpcnN0SW5wdXQ7XG4gICAgdmFyIGZpcnN0TXVsdGlwbGUgPSBzZXNzaW9uLmZpcnN0TXVsdGlwbGU7XG4gICAgdmFyIG9mZnNldENlbnRlciA9IGZpcnN0TXVsdGlwbGUgPyBmaXJzdE11bHRpcGxlLmNlbnRlciA6IGZpcnN0SW5wdXQuY2VudGVyO1xuXG4gICAgdmFyIGNlbnRlciA9IGlucHV0LmNlbnRlciA9IGdldENlbnRlcihwb2ludGVycyk7XG4gICAgaW5wdXQudGltZVN0YW1wID0gbm93KCk7XG4gICAgaW5wdXQuZGVsdGFUaW1lID0gaW5wdXQudGltZVN0YW1wIC0gZmlyc3RJbnB1dC50aW1lU3RhbXA7XG5cbiAgICBpbnB1dC5hbmdsZSA9IGdldEFuZ2xlKG9mZnNldENlbnRlciwgY2VudGVyKTtcbiAgICBpbnB1dC5kaXN0YW5jZSA9IGdldERpc3RhbmNlKG9mZnNldENlbnRlciwgY2VudGVyKTtcblxuICAgIGNvbXB1dGVEZWx0YVhZKHNlc3Npb24sIGlucHV0KTtcbiAgICBpbnB1dC5vZmZzZXREaXJlY3Rpb24gPSBnZXREaXJlY3Rpb24oaW5wdXQuZGVsdGFYLCBpbnB1dC5kZWx0YVkpO1xuXG4gICAgdmFyIG92ZXJhbGxWZWxvY2l0eSA9IGdldFZlbG9jaXR5KGlucHV0LmRlbHRhVGltZSwgaW5wdXQuZGVsdGFYLCBpbnB1dC5kZWx0YVkpO1xuICAgIGlucHV0Lm92ZXJhbGxWZWxvY2l0eVggPSBvdmVyYWxsVmVsb2NpdHkueDtcbiAgICBpbnB1dC5vdmVyYWxsVmVsb2NpdHlZID0gb3ZlcmFsbFZlbG9jaXR5Lnk7XG4gICAgaW5wdXQub3ZlcmFsbFZlbG9jaXR5ID0gKGFicyhvdmVyYWxsVmVsb2NpdHkueCkgPiBhYnMob3ZlcmFsbFZlbG9jaXR5LnkpKSA/IG92ZXJhbGxWZWxvY2l0eS54IDogb3ZlcmFsbFZlbG9jaXR5Lnk7XG5cbiAgICBpbnB1dC5zY2FsZSA9IGZpcnN0TXVsdGlwbGUgPyBnZXRTY2FsZShmaXJzdE11bHRpcGxlLnBvaW50ZXJzLCBwb2ludGVycykgOiAxO1xuICAgIGlucHV0LnJvdGF0aW9uID0gZmlyc3RNdWx0aXBsZSA/IGdldFJvdGF0aW9uKGZpcnN0TXVsdGlwbGUucG9pbnRlcnMsIHBvaW50ZXJzKSA6IDA7XG5cbiAgICBpbnB1dC5tYXhQb2ludGVycyA9ICFzZXNzaW9uLnByZXZJbnB1dCA/IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA6ICgoaW5wdXQucG9pbnRlcnMubGVuZ3RoID5cbiAgICAgICAgc2Vzc2lvbi5wcmV2SW5wdXQubWF4UG9pbnRlcnMpID8gaW5wdXQucG9pbnRlcnMubGVuZ3RoIDogc2Vzc2lvbi5wcmV2SW5wdXQubWF4UG9pbnRlcnMpO1xuXG4gICAgY29tcHV0ZUludGVydmFsSW5wdXREYXRhKHNlc3Npb24sIGlucHV0KTtcblxuICAgIC8vIGZpbmQgdGhlIGNvcnJlY3QgdGFyZ2V0XG4gICAgdmFyIHRhcmdldCA9IG1hbmFnZXIuZWxlbWVudDtcbiAgICBpZiAoaGFzUGFyZW50KGlucHV0LnNyY0V2ZW50LnRhcmdldCwgdGFyZ2V0KSkge1xuICAgICAgICB0YXJnZXQgPSBpbnB1dC5zcmNFdmVudC50YXJnZXQ7XG4gICAgfVxuICAgIGlucHV0LnRhcmdldCA9IHRhcmdldDtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZURlbHRhWFkoc2Vzc2lvbiwgaW5wdXQpIHtcbiAgICB2YXIgY2VudGVyID0gaW5wdXQuY2VudGVyO1xuICAgIHZhciBvZmZzZXQgPSBzZXNzaW9uLm9mZnNldERlbHRhIHx8IHt9O1xuICAgIHZhciBwcmV2RGVsdGEgPSBzZXNzaW9uLnByZXZEZWx0YSB8fCB7fTtcbiAgICB2YXIgcHJldklucHV0ID0gc2Vzc2lvbi5wcmV2SW5wdXQgfHwge307XG5cbiAgICBpZiAoaW5wdXQuZXZlbnRUeXBlID09PSBJTlBVVF9TVEFSVCB8fCBwcmV2SW5wdXQuZXZlbnRUeXBlID09PSBJTlBVVF9FTkQpIHtcbiAgICAgICAgcHJldkRlbHRhID0gc2Vzc2lvbi5wcmV2RGVsdGEgPSB7XG4gICAgICAgICAgICB4OiBwcmV2SW5wdXQuZGVsdGFYIHx8IDAsXG4gICAgICAgICAgICB5OiBwcmV2SW5wdXQuZGVsdGFZIHx8IDBcbiAgICAgICAgfTtcblxuICAgICAgICBvZmZzZXQgPSBzZXNzaW9uLm9mZnNldERlbHRhID0ge1xuICAgICAgICAgICAgeDogY2VudGVyLngsXG4gICAgICAgICAgICB5OiBjZW50ZXIueVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlucHV0LmRlbHRhWCA9IHByZXZEZWx0YS54ICsgKGNlbnRlci54IC0gb2Zmc2V0LngpO1xuICAgIGlucHV0LmRlbHRhWSA9IHByZXZEZWx0YS55ICsgKGNlbnRlci55IC0gb2Zmc2V0LnkpO1xufVxuXG4vKipcbiAqIHZlbG9jaXR5IGlzIGNhbGN1bGF0ZWQgZXZlcnkgeCBtc1xuICogQHBhcmFtIHtPYmplY3R9IHNlc3Npb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICovXG5mdW5jdGlvbiBjb21wdXRlSW50ZXJ2YWxJbnB1dERhdGEoc2Vzc2lvbiwgaW5wdXQpIHtcbiAgICB2YXIgbGFzdCA9IHNlc3Npb24ubGFzdEludGVydmFsIHx8IGlucHV0LFxuICAgICAgICBkZWx0YVRpbWUgPSBpbnB1dC50aW1lU3RhbXAgLSBsYXN0LnRpbWVTdGFtcCxcbiAgICAgICAgdmVsb2NpdHksIHZlbG9jaXR5WCwgdmVsb2NpdHlZLCBkaXJlY3Rpb247XG5cbiAgICBpZiAoaW5wdXQuZXZlbnRUeXBlICE9IElOUFVUX0NBTkNFTCAmJiAoZGVsdGFUaW1lID4gQ09NUFVURV9JTlRFUlZBTCB8fCBsYXN0LnZlbG9jaXR5ID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgIHZhciBkZWx0YVggPSBpbnB1dC5kZWx0YVggLSBsYXN0LmRlbHRhWDtcbiAgICAgICAgdmFyIGRlbHRhWSA9IGlucHV0LmRlbHRhWSAtIGxhc3QuZGVsdGFZO1xuXG4gICAgICAgIHZhciB2ID0gZ2V0VmVsb2NpdHkoZGVsdGFUaW1lLCBkZWx0YVgsIGRlbHRhWSk7XG4gICAgICAgIHZlbG9jaXR5WCA9IHYueDtcbiAgICAgICAgdmVsb2NpdHlZID0gdi55O1xuICAgICAgICB2ZWxvY2l0eSA9IChhYnModi54KSA+IGFicyh2LnkpKSA/IHYueCA6IHYueTtcbiAgICAgICAgZGlyZWN0aW9uID0gZ2V0RGlyZWN0aW9uKGRlbHRhWCwgZGVsdGFZKTtcblxuICAgICAgICBzZXNzaW9uLmxhc3RJbnRlcnZhbCA9IGlucHV0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHVzZSBsYXRlc3QgdmVsb2NpdHkgaW5mbyBpZiBpdCBkb2Vzbid0IG92ZXJ0YWtlIGEgbWluaW11bSBwZXJpb2RcbiAgICAgICAgdmVsb2NpdHkgPSBsYXN0LnZlbG9jaXR5O1xuICAgICAgICB2ZWxvY2l0eVggPSBsYXN0LnZlbG9jaXR5WDtcbiAgICAgICAgdmVsb2NpdHlZID0gbGFzdC52ZWxvY2l0eVk7XG4gICAgICAgIGRpcmVjdGlvbiA9IGxhc3QuZGlyZWN0aW9uO1xuICAgIH1cblxuICAgIGlucHV0LnZlbG9jaXR5ID0gdmVsb2NpdHk7XG4gICAgaW5wdXQudmVsb2NpdHlYID0gdmVsb2NpdHlYO1xuICAgIGlucHV0LnZlbG9jaXR5WSA9IHZlbG9jaXR5WTtcbiAgICBpbnB1dC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG59XG5cbi8qKlxuICogY3JlYXRlIGEgc2ltcGxlIGNsb25lIGZyb20gdGhlIGlucHV0IHVzZWQgZm9yIHN0b3JhZ2Ugb2YgZmlyc3RJbnB1dCBhbmQgZmlyc3RNdWx0aXBsZVxuICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBjbG9uZWRJbnB1dERhdGFcbiAqL1xuZnVuY3Rpb24gc2ltcGxlQ2xvbmVJbnB1dERhdGEoaW5wdXQpIHtcbiAgICAvLyBtYWtlIGEgc2ltcGxlIGNvcHkgb2YgdGhlIHBvaW50ZXJzIGJlY2F1c2Ugd2Ugd2lsbCBnZXQgYSByZWZlcmVuY2UgaWYgd2UgZG9uJ3RcbiAgICAvLyB3ZSBvbmx5IG5lZWQgY2xpZW50WFkgZm9yIHRoZSBjYWxjdWxhdGlvbnNcbiAgICB2YXIgcG9pbnRlcnMgPSBbXTtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBpbnB1dC5wb2ludGVycy5sZW5ndGgpIHtcbiAgICAgICAgcG9pbnRlcnNbaV0gPSB7XG4gICAgICAgICAgICBjbGllbnRYOiByb3VuZChpbnB1dC5wb2ludGVyc1tpXS5jbGllbnRYKSxcbiAgICAgICAgICAgIGNsaWVudFk6IHJvdW5kKGlucHV0LnBvaW50ZXJzW2ldLmNsaWVudFkpXG4gICAgICAgIH07XG4gICAgICAgIGkrKztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aW1lU3RhbXA6IG5vdygpLFxuICAgICAgICBwb2ludGVyczogcG9pbnRlcnMsXG4gICAgICAgIGNlbnRlcjogZ2V0Q2VudGVyKHBvaW50ZXJzKSxcbiAgICAgICAgZGVsdGFYOiBpbnB1dC5kZWx0YVgsXG4gICAgICAgIGRlbHRhWTogaW5wdXQuZGVsdGFZXG4gICAgfTtcbn1cblxuLyoqXG4gKiBnZXQgdGhlIGNlbnRlciBvZiBhbGwgdGhlIHBvaW50ZXJzXG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludGVyc1xuICogQHJldHVybiB7T2JqZWN0fSBjZW50ZXIgY29udGFpbnMgYHhgIGFuZCBgeWAgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBnZXRDZW50ZXIocG9pbnRlcnMpIHtcbiAgICB2YXIgcG9pbnRlcnNMZW5ndGggPSBwb2ludGVycy5sZW5ndGg7XG5cbiAgICAvLyBubyBuZWVkIHRvIGxvb3Agd2hlbiBvbmx5IG9uZSB0b3VjaFxuICAgIGlmIChwb2ludGVyc0xlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogcm91bmQocG9pbnRlcnNbMF0uY2xpZW50WCksXG4gICAgICAgICAgICB5OiByb3VuZChwb2ludGVyc1swXS5jbGllbnRZKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciB4ID0gMCwgeSA9IDAsIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgcG9pbnRlcnNMZW5ndGgpIHtcbiAgICAgICAgeCArPSBwb2ludGVyc1tpXS5jbGllbnRYO1xuICAgICAgICB5ICs9IHBvaW50ZXJzW2ldLmNsaWVudFk7XG4gICAgICAgIGkrKztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB4OiByb3VuZCh4IC8gcG9pbnRlcnNMZW5ndGgpLFxuICAgICAgICB5OiByb3VuZCh5IC8gcG9pbnRlcnNMZW5ndGgpXG4gICAgfTtcbn1cblxuLyoqXG4gKiBjYWxjdWxhdGUgdGhlIHZlbG9jaXR5IGJldHdlZW4gdHdvIHBvaW50cy4gdW5pdCBpcyBpbiBweCBwZXIgbXMuXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsdGFUaW1lXG4gKiBAcGFyYW0ge051bWJlcn0geFxuICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAqIEByZXR1cm4ge09iamVjdH0gdmVsb2NpdHkgYHhgIGFuZCBgeWBcbiAqL1xuZnVuY3Rpb24gZ2V0VmVsb2NpdHkoZGVsdGFUaW1lLCB4LCB5KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogeCAvIGRlbHRhVGltZSB8fCAwLFxuICAgICAgICB5OiB5IC8gZGVsdGFUaW1lIHx8IDBcbiAgICB9O1xufVxuXG4vKipcbiAqIGdldCB0aGUgZGlyZWN0aW9uIGJldHdlZW4gdHdvIHBvaW50c1xuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKiBAcmV0dXJuIHtOdW1iZXJ9IGRpcmVjdGlvblxuICovXG5mdW5jdGlvbiBnZXREaXJlY3Rpb24oeCwgeSkge1xuICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAgIHJldHVybiBESVJFQ1RJT05fTk9ORTtcbiAgICB9XG5cbiAgICBpZiAoYWJzKHgpID49IGFicyh5KSkge1xuICAgICAgICByZXR1cm4geCA8IDAgPyBESVJFQ1RJT05fTEVGVCA6IERJUkVDVElPTl9SSUdIVDtcbiAgICB9XG4gICAgcmV0dXJuIHkgPCAwID8gRElSRUNUSU9OX1VQIDogRElSRUNUSU9OX0RPV047XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSBhYnNvbHV0ZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBwMSB7eCwgeX1cbiAqIEBwYXJhbSB7T2JqZWN0fSBwMiB7eCwgeX1cbiAqIEBwYXJhbSB7QXJyYXl9IFtwcm9wc10gY29udGFpbmluZyB4IGFuZCB5IGtleXNcbiAqIEByZXR1cm4ge051bWJlcn0gZGlzdGFuY2VcbiAqL1xuZnVuY3Rpb24gZ2V0RGlzdGFuY2UocDEsIHAyLCBwcm9wcykge1xuICAgIGlmICghcHJvcHMpIHtcbiAgICAgICAgcHJvcHMgPSBQUk9QU19YWTtcbiAgICB9XG4gICAgdmFyIHggPSBwMltwcm9wc1swXV0gLSBwMVtwcm9wc1swXV0sXG4gICAgICAgIHkgPSBwMltwcm9wc1sxXV0gLSBwMVtwcm9wc1sxXV07XG5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ICogeCkgKyAoeSAqIHkpKTtcbn1cblxuLyoqXG4gKiBjYWxjdWxhdGUgdGhlIGFuZ2xlIGJldHdlZW4gdHdvIGNvb3JkaW5hdGVzXG4gKiBAcGFyYW0ge09iamVjdH0gcDFcbiAqIEBwYXJhbSB7T2JqZWN0fSBwMlxuICogQHBhcmFtIHtBcnJheX0gW3Byb3BzXSBjb250YWluaW5nIHggYW5kIHkga2V5c1xuICogQHJldHVybiB7TnVtYmVyfSBhbmdsZVxuICovXG5mdW5jdGlvbiBnZXRBbmdsZShwMSwgcDIsIHByb3BzKSB7XG4gICAgaWYgKCFwcm9wcykge1xuICAgICAgICBwcm9wcyA9IFBST1BTX1hZO1xuICAgIH1cbiAgICB2YXIgeCA9IHAyW3Byb3BzWzBdXSAtIHAxW3Byb3BzWzBdXSxcbiAgICAgICAgeSA9IHAyW3Byb3BzWzFdXSAtIHAxW3Byb3BzWzFdXTtcbiAgICByZXR1cm4gTWF0aC5hdGFuMih5LCB4KSAqIDE4MCAvIE1hdGguUEk7XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSByb3RhdGlvbiBkZWdyZWVzIGJldHdlZW4gdHdvIHBvaW50ZXJzZXRzXG4gKiBAcGFyYW0ge0FycmF5fSBzdGFydCBhcnJheSBvZiBwb2ludGVyc1xuICogQHBhcmFtIHtBcnJheX0gZW5kIGFycmF5IG9mIHBvaW50ZXJzXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IHJvdGF0aW9uXG4gKi9cbmZ1bmN0aW9uIGdldFJvdGF0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZ2V0QW5nbGUoZW5kWzFdLCBlbmRbMF0sIFBST1BTX0NMSUVOVF9YWSkgKyBnZXRBbmdsZShzdGFydFsxXSwgc3RhcnRbMF0sIFBST1BTX0NMSUVOVF9YWSk7XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSBzY2FsZSBmYWN0b3IgYmV0d2VlbiB0d28gcG9pbnRlcnNldHNcbiAqIG5vIHNjYWxlIGlzIDEsIGFuZCBnb2VzIGRvd24gdG8gMCB3aGVuIHBpbmNoZWQgdG9nZXRoZXIsIGFuZCBiaWdnZXIgd2hlbiBwaW5jaGVkIG91dFxuICogQHBhcmFtIHtBcnJheX0gc3RhcnQgYXJyYXkgb2YgcG9pbnRlcnNcbiAqIEBwYXJhbSB7QXJyYXl9IGVuZCBhcnJheSBvZiBwb2ludGVyc1xuICogQHJldHVybiB7TnVtYmVyfSBzY2FsZVxuICovXG5mdW5jdGlvbiBnZXRTY2FsZShzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGdldERpc3RhbmNlKGVuZFswXSwgZW5kWzFdLCBQUk9QU19DTElFTlRfWFkpIC8gZ2V0RGlzdGFuY2Uoc3RhcnRbMF0sIHN0YXJ0WzFdLCBQUk9QU19DTElFTlRfWFkpO1xufVxuXG52YXIgTU9VU0VfSU5QVVRfTUFQID0ge1xuICAgIG1vdXNlZG93bjogSU5QVVRfU1RBUlQsXG4gICAgbW91c2Vtb3ZlOiBJTlBVVF9NT1ZFLFxuICAgIG1vdXNldXA6IElOUFVUX0VORFxufTtcblxudmFyIE1PVVNFX0VMRU1FTlRfRVZFTlRTID0gJ21vdXNlZG93bic7XG52YXIgTU9VU0VfV0lORE9XX0VWRU5UUyA9ICdtb3VzZW1vdmUgbW91c2V1cCc7XG5cbi8qKlxuICogTW91c2UgZXZlbnRzIGlucHV0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cbmZ1bmN0aW9uIE1vdXNlSW5wdXQoKSB7XG4gICAgdGhpcy5ldkVsID0gTU9VU0VfRUxFTUVOVF9FVkVOVFM7XG4gICAgdGhpcy5ldldpbiA9IE1PVVNFX1dJTkRPV19FVkVOVFM7XG5cbiAgICB0aGlzLnByZXNzZWQgPSBmYWxzZTsgLy8gbW91c2Vkb3duIHN0YXRlXG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KE1vdXNlSW5wdXQsIElucHV0LCB7XG4gICAgLyoqXG4gICAgICogaGFuZGxlIG1vdXNlIGV2ZW50c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldlxuICAgICAqL1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uIE1FaGFuZGxlcihldikge1xuICAgICAgICB2YXIgZXZlbnRUeXBlID0gTU9VU0VfSU5QVVRfTUFQW2V2LnR5cGVdO1xuXG4gICAgICAgIC8vIG9uIHN0YXJ0IHdlIHdhbnQgdG8gaGF2ZSB0aGUgbGVmdCBtb3VzZSBidXR0b24gZG93blxuICAgICAgICBpZiAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQgJiYgZXYuYnV0dG9uID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnByZXNzZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX01PVkUgJiYgZXYud2hpY2ggIT09IDEpIHtcbiAgICAgICAgICAgIGV2ZW50VHlwZSA9IElOUFVUX0VORDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1vdXNlIG11c3QgYmUgZG93blxuICAgICAgICBpZiAoIXRoaXMucHJlc3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX0VORCkge1xuICAgICAgICAgICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgZXZlbnRUeXBlLCB7XG4gICAgICAgICAgICBwb2ludGVyczogW2V2XSxcbiAgICAgICAgICAgIGNoYW5nZWRQb2ludGVyczogW2V2XSxcbiAgICAgICAgICAgIHBvaW50ZXJUeXBlOiBJTlBVVF9UWVBFX01PVVNFLFxuICAgICAgICAgICAgc3JjRXZlbnQ6IGV2XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG52YXIgUE9JTlRFUl9JTlBVVF9NQVAgPSB7XG4gICAgcG9pbnRlcmRvd246IElOUFVUX1NUQVJULFxuICAgIHBvaW50ZXJtb3ZlOiBJTlBVVF9NT1ZFLFxuICAgIHBvaW50ZXJ1cDogSU5QVVRfRU5ELFxuICAgIHBvaW50ZXJjYW5jZWw6IElOUFVUX0NBTkNFTCxcbiAgICBwb2ludGVyb3V0OiBJTlBVVF9DQU5DRUxcbn07XG5cbi8vIGluIElFMTAgdGhlIHBvaW50ZXIgdHlwZXMgaXMgZGVmaW5lZCBhcyBhbiBlbnVtXG52YXIgSUUxMF9QT0lOVEVSX1RZUEVfRU5VTSA9IHtcbiAgICAyOiBJTlBVVF9UWVBFX1RPVUNILFxuICAgIDM6IElOUFVUX1RZUEVfUEVOLFxuICAgIDQ6IElOUFVUX1RZUEVfTU9VU0UsXG4gICAgNTogSU5QVVRfVFlQRV9LSU5FQ1QgLy8gc2VlIGh0dHBzOi8vdHdpdHRlci5jb20vamFjb2Jyb3NzaS9zdGF0dXMvNDgwNTk2NDM4NDg5ODkwODE2XG59O1xuXG52YXIgUE9JTlRFUl9FTEVNRU5UX0VWRU5UUyA9ICdwb2ludGVyZG93bic7XG52YXIgUE9JTlRFUl9XSU5ET1dfRVZFTlRTID0gJ3BvaW50ZXJtb3ZlIHBvaW50ZXJ1cCBwb2ludGVyY2FuY2VsJztcblxuLy8gSUUxMCBoYXMgcHJlZml4ZWQgc3VwcG9ydCwgYW5kIGNhc2Utc2Vuc2l0aXZlXG5pZiAod2luZG93Lk1TUG9pbnRlckV2ZW50ICYmICF3aW5kb3cuUG9pbnRlckV2ZW50KSB7XG4gICAgUE9JTlRFUl9FTEVNRU5UX0VWRU5UUyA9ICdNU1BvaW50ZXJEb3duJztcbiAgICBQT0lOVEVSX1dJTkRPV19FVkVOVFMgPSAnTVNQb2ludGVyTW92ZSBNU1BvaW50ZXJVcCBNU1BvaW50ZXJDYW5jZWwnO1xufVxuXG4vKipcbiAqIFBvaW50ZXIgZXZlbnRzIGlucHV0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cbmZ1bmN0aW9uIFBvaW50ZXJFdmVudElucHV0KCkge1xuICAgIHRoaXMuZXZFbCA9IFBPSU5URVJfRUxFTUVOVF9FVkVOVFM7XG4gICAgdGhpcy5ldldpbiA9IFBPSU5URVJfV0lORE9XX0VWRU5UUztcblxuICAgIElucHV0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aGlzLnN0b3JlID0gKHRoaXMubWFuYWdlci5zZXNzaW9uLnBvaW50ZXJFdmVudHMgPSBbXSk7XG59XG5cbmluaGVyaXQoUG9pbnRlckV2ZW50SW5wdXQsIElucHV0LCB7XG4gICAgLyoqXG4gICAgICogaGFuZGxlIG1vdXNlIGV2ZW50c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldlxuICAgICAqL1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uIFBFaGFuZGxlcihldikge1xuICAgICAgICB2YXIgc3RvcmUgPSB0aGlzLnN0b3JlO1xuICAgICAgICB2YXIgcmVtb3ZlUG9pbnRlciA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBldmVudFR5cGVOb3JtYWxpemVkID0gZXYudHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ21zJywgJycpO1xuICAgICAgICB2YXIgZXZlbnRUeXBlID0gUE9JTlRFUl9JTlBVVF9NQVBbZXZlbnRUeXBlTm9ybWFsaXplZF07XG4gICAgICAgIHZhciBwb2ludGVyVHlwZSA9IElFMTBfUE9JTlRFUl9UWVBFX0VOVU1bZXYucG9pbnRlclR5cGVdIHx8IGV2LnBvaW50ZXJUeXBlO1xuXG4gICAgICAgIHZhciBpc1RvdWNoID0gKHBvaW50ZXJUeXBlID09IElOUFVUX1RZUEVfVE9VQ0gpO1xuXG4gICAgICAgIC8vIGdldCBpbmRleCBvZiB0aGUgZXZlbnQgaW4gdGhlIHN0b3JlXG4gICAgICAgIHZhciBzdG9yZUluZGV4ID0gaW5BcnJheShzdG9yZSwgZXYucG9pbnRlcklkLCAncG9pbnRlcklkJyk7XG5cbiAgICAgICAgLy8gc3RhcnQgYW5kIG1vdXNlIG11c3QgYmUgZG93blxuICAgICAgICBpZiAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQgJiYgKGV2LmJ1dHRvbiA9PT0gMCB8fCBpc1RvdWNoKSkge1xuICAgICAgICAgICAgaWYgKHN0b3JlSW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgc3RvcmUucHVzaChldik7XG4gICAgICAgICAgICAgICAgc3RvcmVJbmRleCA9IHN0b3JlLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnRUeXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcbiAgICAgICAgICAgIHJlbW92ZVBvaW50ZXIgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaXQgbm90IGZvdW5kLCBzbyB0aGUgcG9pbnRlciBoYXNuJ3QgYmVlbiBkb3duIChzbyBpdCdzIHByb2JhYmx5IGEgaG92ZXIpXG4gICAgICAgIGlmIChzdG9yZUluZGV4IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIHRoZSBldmVudCBpbiB0aGUgc3RvcmVcbiAgICAgICAgc3RvcmVbc3RvcmVJbmRleF0gPSBldjtcblxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgZXZlbnRUeXBlLCB7XG4gICAgICAgICAgICBwb2ludGVyczogc3RvcmUsXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IFtldl0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogcG9pbnRlclR5cGUsXG4gICAgICAgICAgICBzcmNFdmVudDogZXZcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJlbW92ZVBvaW50ZXIpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBmcm9tIHRoZSBzdG9yZVxuICAgICAgICAgICAgc3RvcmUuc3BsaWNlKHN0b3JlSW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbnZhciBTSU5HTEVfVE9VQ0hfSU5QVVRfTUFQID0ge1xuICAgIHRvdWNoc3RhcnQ6IElOUFVUX1NUQVJULFxuICAgIHRvdWNobW92ZTogSU5QVVRfTU9WRSxcbiAgICB0b3VjaGVuZDogSU5QVVRfRU5ELFxuICAgIHRvdWNoY2FuY2VsOiBJTlBVVF9DQU5DRUxcbn07XG5cbnZhciBTSU5HTEVfVE9VQ0hfVEFSR0VUX0VWRU5UUyA9ICd0b3VjaHN0YXJ0JztcbnZhciBTSU5HTEVfVE9VQ0hfV0lORE9XX0VWRU5UUyA9ICd0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbCc7XG5cbi8qKlxuICogVG91Y2ggZXZlbnRzIGlucHV0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cbmZ1bmN0aW9uIFNpbmdsZVRvdWNoSW5wdXQoKSB7XG4gICAgdGhpcy5ldlRhcmdldCA9IFNJTkdMRV9UT1VDSF9UQVJHRVRfRVZFTlRTO1xuICAgIHRoaXMuZXZXaW4gPSBTSU5HTEVfVE9VQ0hfV0lORE9XX0VWRU5UUztcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIElucHV0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXQoU2luZ2xlVG91Y2hJbnB1dCwgSW5wdXQsIHtcbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBURWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBTSU5HTEVfVE9VQ0hfSU5QVVRfTUFQW2V2LnR5cGVdO1xuXG4gICAgICAgIC8vIHNob3VsZCB3ZSBoYW5kbGUgdGhlIHRvdWNoIGV2ZW50cz9cbiAgICAgICAgaWYgKHR5cGUgPT09IElOUFVUX1NUQVJUKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b3VjaGVzID0gbm9ybWFsaXplU2luZ2xlVG91Y2hlcy5jYWxsKHRoaXMsIGV2LCB0eXBlKTtcblxuICAgICAgICAvLyB3aGVuIGRvbmUsIHJlc2V0IHRoZSBzdGFydGVkIHN0YXRlXG4gICAgICAgIGlmICh0eXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkgJiYgdG91Y2hlc1swXS5sZW5ndGggLSB0b3VjaGVzWzFdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgdHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IHRvdWNoZXNbMF0sXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IHRvdWNoZXNbMV0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9UT1VDSCxcbiAgICAgICAgICAgIHNyY0V2ZW50OiBldlxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBAdGhpcyB7VG91Y2hJbnB1dH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBldlxuICogQHBhcmFtIHtOdW1iZXJ9IHR5cGUgZmxhZ1xuICogQHJldHVybnMge3VuZGVmaW5lZHxBcnJheX0gW2FsbCwgY2hhbmdlZF1cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplU2luZ2xlVG91Y2hlcyhldiwgdHlwZSkge1xuICAgIHZhciBhbGwgPSB0b0FycmF5KGV2LnRvdWNoZXMpO1xuICAgIHZhciBjaGFuZ2VkID0gdG9BcnJheShldi5jaGFuZ2VkVG91Y2hlcyk7XG5cbiAgICBpZiAodHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpKSB7XG4gICAgICAgIGFsbCA9IHVuaXF1ZUFycmF5KGFsbC5jb25jYXQoY2hhbmdlZCksICdpZGVudGlmaWVyJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFthbGwsIGNoYW5nZWRdO1xufVxuXG52YXIgVE9VQ0hfSU5QVVRfTUFQID0ge1xuICAgIHRvdWNoc3RhcnQ6IElOUFVUX1NUQVJULFxuICAgIHRvdWNobW92ZTogSU5QVVRfTU9WRSxcbiAgICB0b3VjaGVuZDogSU5QVVRfRU5ELFxuICAgIHRvdWNoY2FuY2VsOiBJTlBVVF9DQU5DRUxcbn07XG5cbnZhciBUT1VDSF9UQVJHRVRfRVZFTlRTID0gJ3RvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsJztcblxuLyoqXG4gKiBNdWx0aS11c2VyIHRvdWNoIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBUb3VjaElucHV0KCkge1xuICAgIHRoaXMuZXZUYXJnZXQgPSBUT1VDSF9UQVJHRVRfRVZFTlRTO1xuICAgIHRoaXMudGFyZ2V0SWRzID0ge307XG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFRvdWNoSW5wdXQsIElucHV0LCB7XG4gICAgaGFuZGxlcjogZnVuY3Rpb24gTVRFaGFuZGxlcihldikge1xuICAgICAgICB2YXIgdHlwZSA9IFRPVUNIX0lOUFVUX01BUFtldi50eXBlXTtcbiAgICAgICAgdmFyIHRvdWNoZXMgPSBnZXRUb3VjaGVzLmNhbGwodGhpcywgZXYsIHR5cGUpO1xuICAgICAgICBpZiAoIXRvdWNoZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLCB0eXBlLCB7XG4gICAgICAgICAgICBwb2ludGVyczogdG91Y2hlc1swXSxcbiAgICAgICAgICAgIGNoYW5nZWRQb2ludGVyczogdG91Y2hlc1sxXSxcbiAgICAgICAgICAgIHBvaW50ZXJUeXBlOiBJTlBVVF9UWVBFX1RPVUNILFxuICAgICAgICAgICAgc3JjRXZlbnQ6IGV2XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEB0aGlzIHtUb3VjaElucHV0fVxuICogQHBhcmFtIHtPYmplY3R9IGV2XG4gKiBAcGFyYW0ge051bWJlcn0gdHlwZSBmbGFnXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfEFycmF5fSBbYWxsLCBjaGFuZ2VkXVxuICovXG5mdW5jdGlvbiBnZXRUb3VjaGVzKGV2LCB0eXBlKSB7XG4gICAgdmFyIGFsbFRvdWNoZXMgPSB0b0FycmF5KGV2LnRvdWNoZXMpO1xuICAgIHZhciB0YXJnZXRJZHMgPSB0aGlzLnRhcmdldElkcztcblxuICAgIC8vIHdoZW4gdGhlcmUgaXMgb25seSBvbmUgdG91Y2gsIHRoZSBwcm9jZXNzIGNhbiBiZSBzaW1wbGlmaWVkXG4gICAgaWYgKHR5cGUgJiAoSU5QVVRfU1RBUlQgfCBJTlBVVF9NT1ZFKSAmJiBhbGxUb3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0YXJnZXRJZHNbYWxsVG91Y2hlc1swXS5pZGVudGlmaWVyXSA9IHRydWU7XG4gICAgICAgIHJldHVybiBbYWxsVG91Y2hlcywgYWxsVG91Y2hlc107XG4gICAgfVxuXG4gICAgdmFyIGksXG4gICAgICAgIHRhcmdldFRvdWNoZXMsXG4gICAgICAgIGNoYW5nZWRUb3VjaGVzID0gdG9BcnJheShldi5jaGFuZ2VkVG91Y2hlcyksXG4gICAgICAgIGNoYW5nZWRUYXJnZXRUb3VjaGVzID0gW10sXG4gICAgICAgIHRhcmdldCA9IHRoaXMudGFyZ2V0O1xuXG4gICAgLy8gZ2V0IHRhcmdldCB0b3VjaGVzIGZyb20gdG91Y2hlc1xuICAgIHRhcmdldFRvdWNoZXMgPSBhbGxUb3VjaGVzLmZpbHRlcihmdW5jdGlvbih0b3VjaCkge1xuICAgICAgICByZXR1cm4gaGFzUGFyZW50KHRvdWNoLnRhcmdldCwgdGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIC8vIGNvbGxlY3QgdG91Y2hlc1xuICAgIGlmICh0eXBlID09PSBJTlBVVF9TVEFSVCkge1xuICAgICAgICBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCB0YXJnZXRUb3VjaGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGFyZ2V0SWRzW3RhcmdldFRvdWNoZXNbaV0uaWRlbnRpZmllcl0gPSB0cnVlO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZmlsdGVyIGNoYW5nZWQgdG91Y2hlcyB0byBvbmx5IGNvbnRhaW4gdG91Y2hlcyB0aGF0IGV4aXN0IGluIHRoZSBjb2xsZWN0ZWQgdGFyZ2V0IGlkc1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgY2hhbmdlZFRvdWNoZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmICh0YXJnZXRJZHNbY2hhbmdlZFRvdWNoZXNbaV0uaWRlbnRpZmllcl0pIHtcbiAgICAgICAgICAgIGNoYW5nZWRUYXJnZXRUb3VjaGVzLnB1c2goY2hhbmdlZFRvdWNoZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2xlYW51cCByZW1vdmVkIHRvdWNoZXNcbiAgICAgICAgaWYgKHR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSkge1xuICAgICAgICAgICAgZGVsZXRlIHRhcmdldElkc1tjaGFuZ2VkVG91Y2hlc1tpXS5pZGVudGlmaWVyXTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgaWYgKCFjaGFuZ2VkVGFyZ2V0VG91Y2hlcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBbXG4gICAgICAgIC8vIG1lcmdlIHRhcmdldFRvdWNoZXMgd2l0aCBjaGFuZ2VkVGFyZ2V0VG91Y2hlcyBzbyBpdCBjb250YWlucyBBTEwgdG91Y2hlcywgaW5jbHVkaW5nICdlbmQnIGFuZCAnY2FuY2VsJ1xuICAgICAgICB1bmlxdWVBcnJheSh0YXJnZXRUb3VjaGVzLmNvbmNhdChjaGFuZ2VkVGFyZ2V0VG91Y2hlcyksICdpZGVudGlmaWVyJywgdHJ1ZSksXG4gICAgICAgIGNoYW5nZWRUYXJnZXRUb3VjaGVzXG4gICAgXTtcbn1cblxuLyoqXG4gKiBDb21iaW5lZCB0b3VjaCBhbmQgbW91c2UgaW5wdXRcbiAqXG4gKiBUb3VjaCBoYXMgYSBoaWdoZXIgcHJpb3JpdHkgdGhlbiBtb3VzZSwgYW5kIHdoaWxlIHRvdWNoaW5nIG5vIG1vdXNlIGV2ZW50cyBhcmUgYWxsb3dlZC5cbiAqIFRoaXMgYmVjYXVzZSB0b3VjaCBkZXZpY2VzIGFsc28gZW1pdCBtb3VzZSBldmVudHMgd2hpbGUgZG9pbmcgYSB0b3VjaC5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cblxudmFyIERFRFVQX1RJTUVPVVQgPSAyNTAwO1xudmFyIERFRFVQX0RJU1RBTkNFID0gMjU7XG5cbmZ1bmN0aW9uIFRvdWNoTW91c2VJbnB1dCgpIHtcbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdmFyIGhhbmRsZXIgPSBiaW5kRm4odGhpcy5oYW5kbGVyLCB0aGlzKTtcbiAgICB0aGlzLnRvdWNoID0gbmV3IFRvdWNoSW5wdXQodGhpcy5tYW5hZ2VyLCBoYW5kbGVyKTtcbiAgICB0aGlzLm1vdXNlID0gbmV3IE1vdXNlSW5wdXQodGhpcy5tYW5hZ2VyLCBoYW5kbGVyKTtcblxuICAgIHRoaXMucHJpbWFyeVRvdWNoID0gbnVsbDtcbiAgICB0aGlzLmxhc3RUb3VjaGVzID0gW107XG59XG5cbmluaGVyaXQoVG91Y2hNb3VzZUlucHV0LCBJbnB1dCwge1xuICAgIC8qKlxuICAgICAqIGhhbmRsZSBtb3VzZSBhbmQgdG91Y2ggZXZlbnRzXG4gICAgICogQHBhcmFtIHtIYW1tZXJ9IG1hbmFnZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXRFdmVudFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKi9cbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBUTUVoYW5kbGVyKG1hbmFnZXIsIGlucHV0RXZlbnQsIGlucHV0RGF0YSkge1xuICAgICAgICB2YXIgaXNUb3VjaCA9IChpbnB1dERhdGEucG9pbnRlclR5cGUgPT0gSU5QVVRfVFlQRV9UT1VDSCksXG4gICAgICAgICAgICBpc01vdXNlID0gKGlucHV0RGF0YS5wb2ludGVyVHlwZSA9PSBJTlBVVF9UWVBFX01PVVNFKTtcblxuICAgICAgICBpZiAoaXNNb3VzZSAmJiBpbnB1dERhdGEuc291cmNlQ2FwYWJpbGl0aWVzICYmIGlucHV0RGF0YS5zb3VyY2VDYXBhYmlsaXRpZXMuZmlyZXNUb3VjaEV2ZW50cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2hlbiB3ZSdyZSBpbiBhIHRvdWNoIGV2ZW50LCByZWNvcmQgdG91Y2hlcyB0byAgZGUtZHVwZSBzeW50aGV0aWMgbW91c2UgZXZlbnRcbiAgICAgICAgaWYgKGlzVG91Y2gpIHtcbiAgICAgICAgICAgIHJlY29yZFRvdWNoZXMuY2FsbCh0aGlzLCBpbnB1dEV2ZW50LCBpbnB1dERhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzTW91c2UgJiYgaXNTeW50aGV0aWNFdmVudC5jYWxsKHRoaXMsIGlucHV0RGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FsbGJhY2sobWFuYWdlciwgaW5wdXRFdmVudCwgaW5wdXREYXRhKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmVtb3ZlIHRoZSBldmVudCBsaXN0ZW5lcnNcbiAgICAgKi9cbiAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLnRvdWNoLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5tb3VzZS5kZXN0cm95KCk7XG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIHJlY29yZFRvdWNoZXMoZXZlbnRUeXBlLCBldmVudERhdGEpIHtcbiAgICBpZiAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQpIHtcbiAgICAgICAgdGhpcy5wcmltYXJ5VG91Y2ggPSBldmVudERhdGEuY2hhbmdlZFBvaW50ZXJzWzBdLmlkZW50aWZpZXI7XG4gICAgICAgIHNldExhc3RUb3VjaC5jYWxsKHRoaXMsIGV2ZW50RGF0YSk7XG4gICAgfSBlbHNlIGlmIChldmVudFR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSkge1xuICAgICAgICBzZXRMYXN0VG91Y2guY2FsbCh0aGlzLCBldmVudERhdGEpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc2V0TGFzdFRvdWNoKGV2ZW50RGF0YSkge1xuICAgIHZhciB0b3VjaCA9IGV2ZW50RGF0YS5jaGFuZ2VkUG9pbnRlcnNbMF07XG5cbiAgICBpZiAodG91Y2guaWRlbnRpZmllciA9PT0gdGhpcy5wcmltYXJ5VG91Y2gpIHtcbiAgICAgICAgdmFyIGxhc3RUb3VjaCA9IHt4OiB0b3VjaC5jbGllbnRYLCB5OiB0b3VjaC5jbGllbnRZfTtcbiAgICAgICAgdGhpcy5sYXN0VG91Y2hlcy5wdXNoKGxhc3RUb3VjaCk7XG4gICAgICAgIHZhciBsdHMgPSB0aGlzLmxhc3RUb3VjaGVzO1xuICAgICAgICB2YXIgcmVtb3ZlTGFzdFRvdWNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaSA9IGx0cy5pbmRleE9mKGxhc3RUb3VjaCk7XG4gICAgICAgICAgICBpZiAoaSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgbHRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc2V0VGltZW91dChyZW1vdmVMYXN0VG91Y2gsIERFRFVQX1RJTUVPVVQpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNTeW50aGV0aWNFdmVudChldmVudERhdGEpIHtcbiAgICB2YXIgeCA9IGV2ZW50RGF0YS5zcmNFdmVudC5jbGllbnRYLCB5ID0gZXZlbnREYXRhLnNyY0V2ZW50LmNsaWVudFk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxhc3RUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcy5sYXN0VG91Y2hlc1tpXTtcbiAgICAgICAgdmFyIGR4ID0gTWF0aC5hYnMoeCAtIHQueCksIGR5ID0gTWF0aC5hYnMoeSAtIHQueSk7XG4gICAgICAgIGlmIChkeCA8PSBERURVUF9ESVNUQU5DRSAmJiBkeSA8PSBERURVUF9ESVNUQU5DRSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG52YXIgUFJFRklYRURfVE9VQ0hfQUNUSU9OID0gcHJlZml4ZWQoVEVTVF9FTEVNRU5ULnN0eWxlLCAndG91Y2hBY3Rpb24nKTtcbnZhciBOQVRJVkVfVE9VQ0hfQUNUSU9OID0gUFJFRklYRURfVE9VQ0hfQUNUSU9OICE9PSB1bmRlZmluZWQ7XG5cbi8vIG1hZ2ljYWwgdG91Y2hBY3Rpb24gdmFsdWVcbnZhciBUT1VDSF9BQ1RJT05fQ09NUFVURSA9ICdjb21wdXRlJztcbnZhciBUT1VDSF9BQ1RJT05fQVVUTyA9ICdhdXRvJztcbnZhciBUT1VDSF9BQ1RJT05fTUFOSVBVTEFUSU9OID0gJ21hbmlwdWxhdGlvbic7IC8vIG5vdCBpbXBsZW1lbnRlZFxudmFyIFRPVUNIX0FDVElPTl9OT05FID0gJ25vbmUnO1xudmFyIFRPVUNIX0FDVElPTl9QQU5fWCA9ICdwYW4teCc7XG52YXIgVE9VQ0hfQUNUSU9OX1BBTl9ZID0gJ3Bhbi15JztcbnZhciBUT1VDSF9BQ1RJT05fTUFQID0gZ2V0VG91Y2hBY3Rpb25Qcm9wcygpO1xuXG4vKipcbiAqIFRvdWNoIEFjdGlvblxuICogc2V0cyB0aGUgdG91Y2hBY3Rpb24gcHJvcGVydHkgb3IgdXNlcyB0aGUganMgYWx0ZXJuYXRpdmVcbiAqIEBwYXJhbSB7TWFuYWdlcn0gbWFuYWdlclxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gVG91Y2hBY3Rpb24obWFuYWdlciwgdmFsdWUpIHtcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIHRoaXMuc2V0KHZhbHVlKTtcbn1cblxuVG91Y2hBY3Rpb24ucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIHNldCB0aGUgdG91Y2hBY3Rpb24gdmFsdWUgb24gdGhlIGVsZW1lbnQgb3IgZW5hYmxlIHRoZSBwb2x5ZmlsbFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAqL1xuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgLy8gZmluZCBvdXQgdGhlIHRvdWNoLWFjdGlvbiBieSB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgaWYgKHZhbHVlID09IFRPVUNIX0FDVElPTl9DT01QVVRFKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuY29tcHV0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE5BVElWRV9UT1VDSF9BQ1RJT04gJiYgdGhpcy5tYW5hZ2VyLmVsZW1lbnQuc3R5bGUgJiYgVE9VQ0hfQUNUSU9OX01BUFt2YWx1ZV0pIHtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5lbGVtZW50LnN0eWxlW1BSRUZJWEVEX1RPVUNIX0FDVElPTl0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFjdGlvbnMgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICoganVzdCByZS1zZXQgdGhlIHRvdWNoQWN0aW9uIHZhbHVlXG4gICAgICovXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXQodGhpcy5tYW5hZ2VyLm9wdGlvbnMudG91Y2hBY3Rpb24pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBjb21wdXRlIHRoZSB2YWx1ZSBmb3IgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5IGJhc2VkIG9uIHRoZSByZWNvZ25pemVyJ3Mgc2V0dGluZ3NcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSB2YWx1ZVxuICAgICAqL1xuICAgIGNvbXB1dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgICBlYWNoKHRoaXMubWFuYWdlci5yZWNvZ25pemVycywgZnVuY3Rpb24ocmVjb2duaXplcikge1xuICAgICAgICAgICAgaWYgKGJvb2xPckZuKHJlY29nbml6ZXIub3B0aW9ucy5lbmFibGUsIFtyZWNvZ25pemVyXSkpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zID0gYWN0aW9ucy5jb25jYXQocmVjb2duaXplci5nZXRUb3VjaEFjdGlvbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjbGVhblRvdWNoQWN0aW9ucyhhY3Rpb25zLmpvaW4oJyAnKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCBvbiBlYWNoIGlucHV0IGN5Y2xlIGFuZCBwcm92aWRlcyB0aGUgcHJldmVudGluZyBvZiB0aGUgYnJvd3NlciBiZWhhdmlvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqL1xuICAgIHByZXZlbnREZWZhdWx0czogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIHNyY0V2ZW50ID0gaW5wdXQuc3JjRXZlbnQ7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBpbnB1dC5vZmZzZXREaXJlY3Rpb247XG5cbiAgICAgICAgLy8gaWYgdGhlIHRvdWNoIGFjdGlvbiBkaWQgcHJldmVudGVkIG9uY2UgdGhpcyBzZXNzaW9uXG4gICAgICAgIGlmICh0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wcmV2ZW50ZWQpIHtcbiAgICAgICAgICAgIHNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWN0aW9ucyA9IHRoaXMuYWN0aW9ucztcbiAgICAgICAgdmFyIGhhc05vbmUgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fTk9ORSkgJiYgIVRPVUNIX0FDVElPTl9NQVBbVE9VQ0hfQUNUSU9OX05PTkVdO1xuICAgICAgICB2YXIgaGFzUGFuWSA9IGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9QQU5fWSkgJiYgIVRPVUNIX0FDVElPTl9NQVBbVE9VQ0hfQUNUSU9OX1BBTl9ZXTtcbiAgICAgICAgdmFyIGhhc1BhblggPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fUEFOX1gpICYmICFUT1VDSF9BQ1RJT05fTUFQW1RPVUNIX0FDVElPTl9QQU5fWF07XG5cbiAgICAgICAgaWYgKGhhc05vbmUpIHtcbiAgICAgICAgICAgIC8vZG8gbm90IHByZXZlbnQgZGVmYXVsdHMgaWYgdGhpcyBpcyBhIHRhcCBnZXN0dXJlXG5cbiAgICAgICAgICAgIHZhciBpc1RhcFBvaW50ZXIgPSBpbnB1dC5wb2ludGVycy5sZW5ndGggPT09IDE7XG4gICAgICAgICAgICB2YXIgaXNUYXBNb3ZlbWVudCA9IGlucHV0LmRpc3RhbmNlIDwgMjtcbiAgICAgICAgICAgIHZhciBpc1RhcFRvdWNoVGltZSA9IGlucHV0LmRlbHRhVGltZSA8IDI1MDtcblxuICAgICAgICAgICAgaWYgKGlzVGFwUG9pbnRlciAmJiBpc1RhcE1vdmVtZW50ICYmIGlzVGFwVG91Y2hUaW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc1BhblggJiYgaGFzUGFuWSkge1xuICAgICAgICAgICAgLy8gYHBhbi14IHBhbi15YCBtZWFucyBicm93c2VyIGhhbmRsZXMgYWxsIHNjcm9sbGluZy9wYW5uaW5nLCBkbyBub3QgcHJldmVudFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc05vbmUgfHxcbiAgICAgICAgICAgIChoYXNQYW5ZICYmIGRpcmVjdGlvbiAmIERJUkVDVElPTl9IT1JJWk9OVEFMKSB8fFxuICAgICAgICAgICAgKGhhc1BhblggJiYgZGlyZWN0aW9uICYgRElSRUNUSU9OX1ZFUlRJQ0FMKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJldmVudFNyYyhzcmNFdmVudCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogY2FsbCBwcmV2ZW50RGVmYXVsdCB0byBwcmV2ZW50IHRoZSBicm93c2VyJ3MgZGVmYXVsdCBiZWhhdmlvciAoc2Nyb2xsaW5nIGluIG1vc3QgY2FzZXMpXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNyY0V2ZW50XG4gICAgICovXG4gICAgcHJldmVudFNyYzogZnVuY3Rpb24oc3JjRXZlbnQpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnNlc3Npb24ucHJldmVudGVkID0gdHJ1ZTtcbiAgICAgICAgc3JjRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIHdoZW4gdGhlIHRvdWNoQWN0aW9ucyBhcmUgY29sbGVjdGVkIHRoZXkgYXJlIG5vdCBhIHZhbGlkIHZhbHVlLCBzbyB3ZSBuZWVkIHRvIGNsZWFuIHRoaW5ncyB1cC4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFjdGlvbnNcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBjbGVhblRvdWNoQWN0aW9ucyhhY3Rpb25zKSB7XG4gICAgLy8gbm9uZVxuICAgIGlmIChpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fTk9ORSkpIHtcbiAgICAgICAgcmV0dXJuIFRPVUNIX0FDVElPTl9OT05FO1xuICAgIH1cblxuICAgIHZhciBoYXNQYW5YID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX1BBTl9YKTtcbiAgICB2YXIgaGFzUGFuWSA9IGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9QQU5fWSk7XG5cbiAgICAvLyBpZiBib3RoIHBhbi14IGFuZCBwYW4teSBhcmUgc2V0IChkaWZmZXJlbnQgcmVjb2duaXplcnNcbiAgICAvLyBmb3IgZGlmZmVyZW50IGRpcmVjdGlvbnMsIGUuZy4gaG9yaXpvbnRhbCBwYW4gYnV0IHZlcnRpY2FsIHN3aXBlPylcbiAgICAvLyB3ZSBuZWVkIG5vbmUgKGFzIG90aGVyd2lzZSB3aXRoIHBhbi14IHBhbi15IGNvbWJpbmVkIG5vbmUgb2YgdGhlc2VcbiAgICAvLyByZWNvZ25pemVycyB3aWxsIHdvcmssIHNpbmNlIHRoZSBicm93c2VyIHdvdWxkIGhhbmRsZSBhbGwgcGFubmluZ1xuICAgIGlmIChoYXNQYW5YICYmIGhhc1BhblkpIHtcbiAgICAgICAgcmV0dXJuIFRPVUNIX0FDVElPTl9OT05FO1xuICAgIH1cblxuICAgIC8vIHBhbi14IE9SIHBhbi15XG4gICAgaWYgKGhhc1BhblggfHwgaGFzUGFuWSkge1xuICAgICAgICByZXR1cm4gaGFzUGFuWCA/IFRPVUNIX0FDVElPTl9QQU5fWCA6IFRPVUNIX0FDVElPTl9QQU5fWTtcbiAgICB9XG5cbiAgICAvLyBtYW5pcHVsYXRpb25cbiAgICBpZiAoaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX01BTklQVUxBVElPTikpIHtcbiAgICAgICAgcmV0dXJuIFRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT047XG4gICAgfVxuXG4gICAgcmV0dXJuIFRPVUNIX0FDVElPTl9BVVRPO1xufVxuXG5mdW5jdGlvbiBnZXRUb3VjaEFjdGlvblByb3BzKCkge1xuICAgIGlmICghTkFUSVZFX1RPVUNIX0FDVElPTikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciB0b3VjaE1hcCA9IHt9O1xuICAgIHZhciBjc3NTdXBwb3J0cyA9IHdpbmRvdy5DU1MgJiYgd2luZG93LkNTUy5zdXBwb3J0cztcbiAgICBbJ2F1dG8nLCAnbWFuaXB1bGF0aW9uJywgJ3Bhbi15JywgJ3Bhbi14JywgJ3Bhbi14IHBhbi15JywgJ25vbmUnXS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCkge1xuXG4gICAgICAgIC8vIElmIGNzcy5zdXBwb3J0cyBpcyBub3Qgc3VwcG9ydGVkIGJ1dCB0aGVyZSBpcyBuYXRpdmUgdG91Y2gtYWN0aW9uIGFzc3VtZSBpdCBzdXBwb3J0c1xuICAgICAgICAvLyBhbGwgdmFsdWVzLiBUaGlzIGlzIHRoZSBjYXNlIGZvciBJRSAxMCBhbmQgMTEuXG4gICAgICAgIHRvdWNoTWFwW3ZhbF0gPSBjc3NTdXBwb3J0cyA/IHdpbmRvdy5DU1Muc3VwcG9ydHMoJ3RvdWNoLWFjdGlvbicsIHZhbCkgOiB0cnVlO1xuICAgIH0pO1xuICAgIHJldHVybiB0b3VjaE1hcDtcbn1cblxuLyoqXG4gKiBSZWNvZ25pemVyIGZsb3cgZXhwbGFpbmVkOyAqXG4gKiBBbGwgcmVjb2duaXplcnMgaGF2ZSB0aGUgaW5pdGlhbCBzdGF0ZSBvZiBQT1NTSUJMRSB3aGVuIGEgaW5wdXQgc2Vzc2lvbiBzdGFydHMuXG4gKiBUaGUgZGVmaW5pdGlvbiBvZiBhIGlucHV0IHNlc3Npb24gaXMgZnJvbSB0aGUgZmlyc3QgaW5wdXQgdW50aWwgdGhlIGxhc3QgaW5wdXQsIHdpdGggYWxsIGl0J3MgbW92ZW1lbnQgaW4gaXQuICpcbiAqIEV4YW1wbGUgc2Vzc2lvbiBmb3IgbW91c2UtaW5wdXQ6IG1vdXNlZG93biAtPiBtb3VzZW1vdmUgLT4gbW91c2V1cFxuICpcbiAqIE9uIGVhY2ggcmVjb2duaXppbmcgY3ljbGUgKHNlZSBNYW5hZ2VyLnJlY29nbml6ZSkgdGhlIC5yZWNvZ25pemUoKSBtZXRob2QgaXMgZXhlY3V0ZWRcbiAqIHdoaWNoIGRldGVybWluZXMgd2l0aCBzdGF0ZSBpdCBzaG91bGQgYmUuXG4gKlxuICogSWYgdGhlIHJlY29nbml6ZXIgaGFzIHRoZSBzdGF0ZSBGQUlMRUQsIENBTkNFTExFRCBvciBSRUNPR05JWkVEIChlcXVhbHMgRU5ERUQpLCBpdCBpcyByZXNldCB0b1xuICogUE9TU0lCTEUgdG8gZ2l2ZSBpdCBhbm90aGVyIGNoYW5nZSBvbiB0aGUgbmV4dCBjeWNsZS5cbiAqXG4gKiAgICAgICAgICAgICAgIFBvc3NpYmxlXG4gKiAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgKy0tLS0tKy0tLS0tLS0tLS0tLS0tLStcbiAqICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgKy0tLS0tKy0tLS0tKyAgICAgICAgICAgICAgIHxcbiAqICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgICAgIHxcbiAqICAgRmFpbGVkICAgICAgQ2FuY2VsbGVkICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICArLS0tLS0tLSstLS0tLS0rXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgfFxuICogICAgICAgICAgICAgICAgICAgICAgUmVjb2duaXplZCAgICAgICBCZWdhblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFuZ2VkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRW5kZWQvUmVjb2duaXplZFxuICovXG52YXIgU1RBVEVfUE9TU0lCTEUgPSAxO1xudmFyIFNUQVRFX0JFR0FOID0gMjtcbnZhciBTVEFURV9DSEFOR0VEID0gNDtcbnZhciBTVEFURV9FTkRFRCA9IDg7XG52YXIgU1RBVEVfUkVDT0dOSVpFRCA9IFNUQVRFX0VOREVEO1xudmFyIFNUQVRFX0NBTkNFTExFRCA9IDE2O1xudmFyIFNUQVRFX0ZBSUxFRCA9IDMyO1xuXG4vKipcbiAqIFJlY29nbml6ZXJcbiAqIEV2ZXJ5IHJlY29nbml6ZXIgbmVlZHMgdG8gZXh0ZW5kIGZyb20gdGhpcyBjbGFzcy5cbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gUmVjb2duaXplcihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMuaWQgPSB1bmlxdWVJZCgpO1xuXG4gICAgdGhpcy5tYW5hZ2VyID0gbnVsbDtcblxuICAgIC8vIGRlZmF1bHQgaXMgZW5hYmxlIHRydWVcbiAgICB0aGlzLm9wdGlvbnMuZW5hYmxlID0gaWZVbmRlZmluZWQodGhpcy5vcHRpb25zLmVuYWJsZSwgdHJ1ZSk7XG5cbiAgICB0aGlzLnN0YXRlID0gU1RBVEVfUE9TU0lCTEU7XG5cbiAgICB0aGlzLnNpbXVsdGFuZW91cyA9IHt9O1xuICAgIHRoaXMucmVxdWlyZUZhaWwgPSBbXTtcbn1cblxuUmVjb2duaXplci5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogQHZpcnR1YWxcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7fSxcblxuICAgIC8qKlxuICAgICAqIHNldCBvcHRpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcmV0dXJuIHtSZWNvZ25pemVyfVxuICAgICAqL1xuICAgIHNldDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICBhc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgICAvLyBhbHNvIHVwZGF0ZSB0aGUgdG91Y2hBY3Rpb24sIGluIGNhc2Ugc29tZXRoaW5nIGNoYW5nZWQgYWJvdXQgdGhlIGRpcmVjdGlvbnMvZW5hYmxlZCBzdGF0ZVxuICAgICAgICB0aGlzLm1hbmFnZXIgJiYgdGhpcy5tYW5hZ2VyLnRvdWNoQWN0aW9uLnVwZGF0ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmVjb2duaXplIHNpbXVsdGFuZW91cyB3aXRoIGFuIG90aGVyIHJlY29nbml6ZXIuXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcn0gdGhpc1xuICAgICAqL1xuICAgIHJlY29nbml6ZVdpdGg6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xuICAgICAgICBpZiAoaW52b2tlQXJyYXlBcmcob3RoZXJSZWNvZ25pemVyLCAncmVjb2duaXplV2l0aCcsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzaW11bHRhbmVvdXMgPSB0aGlzLnNpbXVsdGFuZW91cztcbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgICBpZiAoIXNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdKSB7XG4gICAgICAgICAgICBzaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXSA9IG90aGVyUmVjb2duaXplcjtcbiAgICAgICAgICAgIG90aGVyUmVjb2duaXplci5yZWNvZ25pemVXaXRoKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBkcm9wIHRoZSBzaW11bHRhbmVvdXMgbGluay4gaXQgZG9lc250IHJlbW92ZSB0aGUgbGluayBvbiB0aGUgb3RoZXIgcmVjb2duaXplci5cbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfSB0aGlzXG4gICAgICovXG4gICAgZHJvcFJlY29nbml6ZVdpdGg6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xuICAgICAgICBpZiAoaW52b2tlQXJyYXlBcmcob3RoZXJSZWNvZ25pemVyLCAnZHJvcFJlY29nbml6ZVdpdGgnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvdGhlclJlY29nbml6ZXIgPSBnZXRSZWNvZ25pemVyQnlOYW1lSWZNYW5hZ2VyKG90aGVyUmVjb2duaXplciwgdGhpcyk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmVjb2duaXplciBjYW4gb25seSBydW4gd2hlbiBhbiBvdGhlciBpcyBmYWlsaW5nXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcn0gdGhpc1xuICAgICAqL1xuICAgIHJlcXVpcmVGYWlsdXJlOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ3JlcXVpcmVGYWlsdXJlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlcXVpcmVGYWlsID0gdGhpcy5yZXF1aXJlRmFpbDtcbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgICBpZiAoaW5BcnJheShyZXF1aXJlRmFpbCwgb3RoZXJSZWNvZ25pemVyKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJlcXVpcmVGYWlsLnB1c2gob3RoZXJSZWNvZ25pemVyKTtcbiAgICAgICAgICAgIG90aGVyUmVjb2duaXplci5yZXF1aXJlRmFpbHVyZSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZHJvcCB0aGUgcmVxdWlyZUZhaWx1cmUgbGluay4gaXQgZG9lcyBub3QgcmVtb3ZlIHRoZSBsaW5rIG9uIHRoZSBvdGhlciByZWNvZ25pemVyLlxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gb3RoZXJSZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ9IHRoaXNcbiAgICAgKi9cbiAgICBkcm9wUmVxdWlyZUZhaWx1cmU6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xuICAgICAgICBpZiAoaW52b2tlQXJyYXlBcmcob3RoZXJSZWNvZ25pemVyLCAnZHJvcFJlcXVpcmVGYWlsdXJlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgICB2YXIgaW5kZXggPSBpbkFycmF5KHRoaXMucmVxdWlyZUZhaWwsIG90aGVyUmVjb2duaXplcik7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVpcmVGYWlsLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGhhcyByZXF1aXJlIGZhaWx1cmVzIGJvb2xlYW5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXNSZXF1aXJlRmFpbHVyZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1aXJlRmFpbC5sZW5ndGggPiAwO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBpZiB0aGUgcmVjb2duaXplciBjYW4gcmVjb2duaXplIHNpbXVsdGFuZW91cyB3aXRoIGFuIG90aGVyIHJlY29nbml6ZXJcbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGNhblJlY29nbml6ZVdpdGg6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xuICAgICAgICByZXR1cm4gISF0aGlzLnNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBZb3Ugc2hvdWxkIHVzZSBgdHJ5RW1pdGAgaW5zdGVhZCBvZiBgZW1pdGAgZGlyZWN0bHkgdG8gY2hlY2tcbiAgICAgKiB0aGF0IGFsbCB0aGUgbmVlZGVkIHJlY29nbml6ZXJzIGhhcyBmYWlsZWQgYmVmb3JlIGVtaXR0aW5nLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqL1xuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcblxuICAgICAgICBmdW5jdGlvbiBlbWl0KGV2ZW50KSB7XG4gICAgICAgICAgICBzZWxmLm1hbmFnZXIuZW1pdChldmVudCwgaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gJ3BhbnN0YXJ0JyBhbmQgJ3Bhbm1vdmUnXG4gICAgICAgIGlmIChzdGF0ZSA8IFNUQVRFX0VOREVEKSB7XG4gICAgICAgICAgICBlbWl0KHNlbGYub3B0aW9ucy5ldmVudCArIHN0YXRlU3RyKHN0YXRlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbWl0KHNlbGYub3B0aW9ucy5ldmVudCk7IC8vIHNpbXBsZSAnZXZlbnROYW1lJyBldmVudHNcblxuICAgICAgICBpZiAoaW5wdXQuYWRkaXRpb25hbEV2ZW50KSB7IC8vIGFkZGl0aW9uYWwgZXZlbnQocGFubGVmdCwgcGFucmlnaHQsIHBpbmNoaW4sIHBpbmNob3V0Li4uKVxuICAgICAgICAgICAgZW1pdChpbnB1dC5hZGRpdGlvbmFsRXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcGFuZW5kIGFuZCBwYW5jYW5jZWxcbiAgICAgICAgaWYgKHN0YXRlID49IFNUQVRFX0VOREVEKSB7XG4gICAgICAgICAgICBlbWl0KHNlbGYub3B0aW9ucy5ldmVudCArIHN0YXRlU3RyKHN0YXRlKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgdGhhdCBhbGwgdGhlIHJlcXVpcmUgZmFpbHVyZSByZWNvZ25pemVycyBoYXMgZmFpbGVkLFxuICAgICAqIGlmIHRydWUsIGl0IGVtaXRzIGEgZ2VzdHVyZSBldmVudCxcbiAgICAgKiBvdGhlcndpc2UsIHNldHVwIHRoZSBzdGF0ZSB0byBGQUlMRUQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gICAgICovXG4gICAgdHJ5RW1pdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuRW1pdCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbWl0KGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpdCdzIGZhaWxpbmcgYW55d2F5XG4gICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9GQUlMRUQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGNhbiB3ZSBlbWl0P1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGNhbkVtaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5yZXF1aXJlRmFpbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghKHRoaXMucmVxdWlyZUZhaWxbaV0uc3RhdGUgJiAoU1RBVEVfRkFJTEVEIHwgU1RBVEVfUE9TU0lCTEUpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlIHRoZSByZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0RGF0YVxuICAgICAqL1xuICAgIHJlY29nbml6ZTogZnVuY3Rpb24oaW5wdXREYXRhKSB7XG4gICAgICAgIC8vIG1ha2UgYSBuZXcgY29weSBvZiB0aGUgaW5wdXREYXRhXG4gICAgICAgIC8vIHNvIHdlIGNhbiBjaGFuZ2UgdGhlIGlucHV0RGF0YSB3aXRob3V0IG1lc3NpbmcgdXAgdGhlIG90aGVyIHJlY29nbml6ZXJzXG4gICAgICAgIHZhciBpbnB1dERhdGFDbG9uZSA9IGFzc2lnbih7fSwgaW5wdXREYXRhKTtcblxuICAgICAgICAvLyBpcyBpcyBlbmFibGVkIGFuZCBhbGxvdyByZWNvZ25pemluZz9cbiAgICAgICAgaWYgKCFib29sT3JGbih0aGlzLm9wdGlvbnMuZW5hYmxlLCBbdGhpcywgaW5wdXREYXRhQ2xvbmVdKSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX0ZBSUxFRDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlc2V0IHdoZW4gd2UndmUgcmVhY2hlZCB0aGUgZW5kXG4gICAgICAgIGlmICh0aGlzLnN0YXRlICYgKFNUQVRFX1JFQ09HTklaRUQgfCBTVEFURV9DQU5DRUxMRUQgfCBTVEFURV9GQUlMRUQpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfUE9TU0lCTEU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5wcm9jZXNzKGlucHV0RGF0YUNsb25lKTtcblxuICAgICAgICAvLyB0aGUgcmVjb2duaXplciBoYXMgcmVjb2duaXplZCBhIGdlc3R1cmVcbiAgICAgICAgLy8gc28gdHJpZ2dlciBhbiBldmVudFxuICAgICAgICBpZiAodGhpcy5zdGF0ZSAmIChTVEFURV9CRUdBTiB8IFNUQVRFX0NIQU5HRUQgfCBTVEFURV9FTkRFRCB8IFNUQVRFX0NBTkNFTExFRCkpIHtcbiAgICAgICAgICAgIHRoaXMudHJ5RW1pdChpbnB1dERhdGFDbG9uZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBzdGF0ZSBvZiB0aGUgcmVjb2duaXplclxuICAgICAqIHRoZSBhY3R1YWwgcmVjb2duaXppbmcgaGFwcGVucyBpbiB0aGlzIG1ldGhvZFxuICAgICAqIEB2aXJ0dWFsXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0RGF0YVxuICAgICAqIEByZXR1cm5zIHtDb25zdH0gU1RBVEVcbiAgICAgKi9cbiAgICBwcm9jZXNzOiBmdW5jdGlvbihpbnB1dERhdGEpIHsgfSwgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gdGhlIHByZWZlcnJlZCB0b3VjaC1hY3Rpb25cbiAgICAgKiBAdmlydHVhbFxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7IH0sXG5cbiAgICAvKipcbiAgICAgKiBjYWxsZWQgd2hlbiB0aGUgZ2VzdHVyZSBpc24ndCBhbGxvd2VkIHRvIHJlY29nbml6ZVxuICAgICAqIGxpa2Ugd2hlbiBhbm90aGVyIGlzIGJlaW5nIHJlY29nbml6ZWQgb3IgaXQgaXMgZGlzYWJsZWRcbiAgICAgKiBAdmlydHVhbFxuICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbigpIHsgfVxufTtcblxuLyoqXG4gKiBnZXQgYSB1c2FibGUgc3RyaW5nLCB1c2VkIGFzIGV2ZW50IHBvc3RmaXhcbiAqIEBwYXJhbSB7Q29uc3R9IHN0YXRlXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBzdGF0ZVxuICovXG5mdW5jdGlvbiBzdGF0ZVN0cihzdGF0ZSkge1xuICAgIGlmIChzdGF0ZSAmIFNUQVRFX0NBTkNFTExFRCkge1xuICAgICAgICByZXR1cm4gJ2NhbmNlbCc7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSAmIFNUQVRFX0VOREVEKSB7XG4gICAgICAgIHJldHVybiAnZW5kJztcbiAgICB9IGVsc2UgaWYgKHN0YXRlICYgU1RBVEVfQ0hBTkdFRCkge1xuICAgICAgICByZXR1cm4gJ21vdmUnO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgJiBTVEFURV9CRUdBTikge1xuICAgICAgICByZXR1cm4gJ3N0YXJ0JztcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIGRpcmVjdGlvbiBjb25zIHRvIHN0cmluZ1xuICogQHBhcmFtIHtDb25zdH0gZGlyZWN0aW9uXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBkaXJlY3Rpb25TdHIoZGlyZWN0aW9uKSB7XG4gICAgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fRE9XTikge1xuICAgICAgICByZXR1cm4gJ2Rvd24nO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09IERJUkVDVElPTl9VUCkge1xuICAgICAgICByZXR1cm4gJ3VwJztcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fTEVGVCkge1xuICAgICAgICByZXR1cm4gJ2xlZnQnO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09IERJUkVDVElPTl9SSUdIVCkge1xuICAgICAgICByZXR1cm4gJ3JpZ2h0JztcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIGdldCBhIHJlY29nbml6ZXIgYnkgbmFtZSBpZiBpdCBpcyBib3VuZCB0byBhIG1hbmFnZXJcbiAqIEBwYXJhbSB7UmVjb2duaXplcnxTdHJpbmd9IG90aGVyUmVjb2duaXplclxuICogQHBhcmFtIHtSZWNvZ25pemVyfSByZWNvZ25pemVyXG4gKiBAcmV0dXJucyB7UmVjb2duaXplcn1cbiAqL1xuZnVuY3Rpb24gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHJlY29nbml6ZXIpIHtcbiAgICB2YXIgbWFuYWdlciA9IHJlY29nbml6ZXIubWFuYWdlcjtcbiAgICBpZiAobWFuYWdlcikge1xuICAgICAgICByZXR1cm4gbWFuYWdlci5nZXQob3RoZXJSZWNvZ25pemVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG90aGVyUmVjb2duaXplcjtcbn1cblxuLyoqXG4gKiBUaGlzIHJlY29nbml6ZXIgaXMganVzdCB1c2VkIGFzIGEgYmFzZSBmb3IgdGhlIHNpbXBsZSBhdHRyaWJ1dGUgcmVjb2duaXplcnMuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIFJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gQXR0clJlY29nbml6ZXIoKSB7XG4gICAgUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KEF0dHJSZWNvZ25pemVyLCBSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAxXG4gICAgICAgICAqL1xuICAgICAgICBwb2ludGVyczogMVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVc2VkIHRvIGNoZWNrIGlmIGl0IHRoZSByZWNvZ25pemVyIHJlY2VpdmVzIHZhbGlkIGlucHV0LCBsaWtlIGlucHV0LmRpc3RhbmNlID4gMTAuXG4gICAgICogQG1lbWJlcm9mIEF0dHJSZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IHJlY29nbml6ZWRcbiAgICAgKi9cbiAgICBhdHRyVGVzdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIG9wdGlvblBvaW50ZXJzID0gdGhpcy5vcHRpb25zLnBvaW50ZXJzO1xuICAgICAgICByZXR1cm4gb3B0aW9uUG9pbnRlcnMgPT09IDAgfHwgaW5wdXQucG9pbnRlcnMubGVuZ3RoID09PSBvcHRpb25Qb2ludGVycztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUHJvY2VzcyB0aGUgaW5wdXQgYW5kIHJldHVybiB0aGUgc3RhdGUgZm9yIHRoZSByZWNvZ25pemVyXG4gICAgICogQG1lbWJlcm9mIEF0dHJSZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gICAgICogQHJldHVybnMgeyp9IFN0YXRlXG4gICAgICovXG4gICAgcHJvY2VzczogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IGlucHV0LmV2ZW50VHlwZTtcblxuICAgICAgICB2YXIgaXNSZWNvZ25pemVkID0gc3RhdGUgJiAoU1RBVEVfQkVHQU4gfCBTVEFURV9DSEFOR0VEKTtcbiAgICAgICAgdmFyIGlzVmFsaWQgPSB0aGlzLmF0dHJUZXN0KGlucHV0KTtcblxuICAgICAgICAvLyBvbiBjYW5jZWwgaW5wdXQgYW5kIHdlJ3ZlIHJlY29nbml6ZWQgYmVmb3JlLCByZXR1cm4gU1RBVEVfQ0FOQ0VMTEVEXG4gICAgICAgIGlmIChpc1JlY29nbml6ZWQgJiYgKGV2ZW50VHlwZSAmIElOUFVUX0NBTkNFTCB8fCAhaXNWYWxpZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0NBTkNFTExFRDtcbiAgICAgICAgfSBlbHNlIGlmIChpc1JlY29nbml6ZWQgfHwgaXNWYWxpZCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX0VORCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0VOREVEO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghKHN0YXRlICYgU1RBVEVfQkVHQU4pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFNUQVRFX0JFR0FOO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlIHwgU1RBVEVfQ0hBTkdFRDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIFBhblxuICogUmVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIGRvd24gYW5kIG1vdmVkIGluIHRoZSBhbGxvd2VkIGRpcmVjdGlvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gUGFuUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdGhpcy5wWCA9IG51bGw7XG4gICAgdGhpcy5wWSA9IG51bGw7XG59XG5cbmluaGVyaXQoUGFuUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFBhblJlY29nbml6ZXJcbiAgICAgKi9cbiAgICBkZWZhdWx0czoge1xuICAgICAgICBldmVudDogJ3BhbicsXG4gICAgICAgIHRocmVzaG9sZDogMTAsXG4gICAgICAgIHBvaW50ZXJzOiAxLFxuICAgICAgICBkaXJlY3Rpb246IERJUkVDVElPTl9BTExcbiAgICB9LFxuXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gdGhpcy5vcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9IT1JJWk9OVEFMKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goVE9VQ0hfQUNUSU9OX1BBTl9ZKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlyZWN0aW9uICYgRElSRUNUSU9OX1ZFUlRJQ0FMKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goVE9VQ0hfQUNUSU9OX1BBTl9YKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWN0aW9ucztcbiAgICB9LFxuXG4gICAgZGlyZWN0aW9uVGVzdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIHZhciBoYXNNb3ZlZCA9IHRydWU7XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IGlucHV0LmRpc3RhbmNlO1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gaW5wdXQuZGlyZWN0aW9uO1xuICAgICAgICB2YXIgeCA9IGlucHV0LmRlbHRhWDtcbiAgICAgICAgdmFyIHkgPSBpbnB1dC5kZWx0YVk7XG5cbiAgICAgICAgLy8gbG9jayB0byBheGlzP1xuICAgICAgICBpZiAoIShkaXJlY3Rpb24gJiBvcHRpb25zLmRpcmVjdGlvbikpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRpcmVjdGlvbiAmIERJUkVDVElPTl9IT1JJWk9OVEFMKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gKHggPT09IDApID8gRElSRUNUSU9OX05PTkUgOiAoeCA8IDApID8gRElSRUNUSU9OX0xFRlQgOiBESVJFQ1RJT05fUklHSFQ7XG4gICAgICAgICAgICAgICAgaGFzTW92ZWQgPSB4ICE9IHRoaXMucFg7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBNYXRoLmFicyhpbnB1dC5kZWx0YVgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSAoeSA9PT0gMCkgPyBESVJFQ1RJT05fTk9ORSA6ICh5IDwgMCkgPyBESVJFQ1RJT05fVVAgOiBESVJFQ1RJT05fRE9XTjtcbiAgICAgICAgICAgICAgICBoYXNNb3ZlZCA9IHkgIT0gdGhpcy5wWTtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IE1hdGguYWJzKGlucHV0LmRlbHRhWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICByZXR1cm4gaGFzTW92ZWQgJiYgZGlzdGFuY2UgPiBvcHRpb25zLnRocmVzaG9sZCAmJiBkaXJlY3Rpb24gJiBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICB9LFxuXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBBdHRyUmVjb2duaXplci5wcm90b3R5cGUuYXR0clRlc3QuY2FsbCh0aGlzLCBpbnB1dCkgJiZcbiAgICAgICAgICAgICh0aGlzLnN0YXRlICYgU1RBVEVfQkVHQU4gfHwgKCEodGhpcy5zdGF0ZSAmIFNUQVRFX0JFR0FOKSAmJiB0aGlzLmRpcmVjdGlvblRlc3QoaW5wdXQpKSk7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG5cbiAgICAgICAgdGhpcy5wWCA9IGlucHV0LmRlbHRhWDtcbiAgICAgICAgdGhpcy5wWSA9IGlucHV0LmRlbHRhWTtcblxuICAgICAgICB2YXIgZGlyZWN0aW9uID0gZGlyZWN0aW9uU3RyKGlucHV0LmRpcmVjdGlvbik7XG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgaW5wdXQuYWRkaXRpb25hbEV2ZW50ID0gdGhpcy5vcHRpb25zLmV2ZW50ICsgZGlyZWN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N1cGVyLmVtaXQuY2FsbCh0aGlzLCBpbnB1dCk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogUGluY2hcbiAqIFJlY29nbml6ZWQgd2hlbiB0d28gb3IgbW9yZSBwb2ludGVycyBhcmUgbW92aW5nIHRvd2FyZCAoem9vbS1pbikgb3IgYXdheSBmcm9tIGVhY2ggb3RoZXIgKHpvb20tb3V0KS5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gUGluY2hSZWNvZ25pemVyKCkge1xuICAgIEF0dHJSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXQoUGluY2hSZWNvZ25pemVyLCBBdHRyUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgUGluY2hSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdwaW5jaCcsXG4gICAgICAgIHRocmVzaG9sZDogMCxcbiAgICAgICAgcG9pbnRlcnM6IDJcbiAgICB9LFxuXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9OT05FXTtcbiAgICB9LFxuXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsIGlucHV0KSAmJlxuICAgICAgICAgICAgKE1hdGguYWJzKGlucHV0LnNjYWxlIC0gMSkgPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkIHx8IHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTik7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIGlmIChpbnB1dC5zY2FsZSAhPT0gMSkge1xuICAgICAgICAgICAgdmFyIGluT3V0ID0gaW5wdXQuc2NhbGUgPCAxID8gJ2luJyA6ICdvdXQnO1xuICAgICAgICAgICAgaW5wdXQuYWRkaXRpb25hbEV2ZW50ID0gdGhpcy5vcHRpb25zLmV2ZW50ICsgaW5PdXQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3VwZXIuZW1pdC5jYWxsKHRoaXMsIGlucHV0KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBQcmVzc1xuICogUmVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIGRvd24gZm9yIHggbXMgd2l0aG91dCBhbnkgbW92ZW1lbnQuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIFJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gUHJlc3NSZWNvZ25pemVyKCkge1xuICAgIFJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHRoaXMuX3RpbWVyID0gbnVsbDtcbiAgICB0aGlzLl9pbnB1dCA9IG51bGw7XG59XG5cbmluaGVyaXQoUHJlc3NSZWNvZ25pemVyLCBSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBQcmVzc1JlY29nbml6ZXJcbiAgICAgKi9cbiAgICBkZWZhdWx0czoge1xuICAgICAgICBldmVudDogJ3ByZXNzJyxcbiAgICAgICAgcG9pbnRlcnM6IDEsXG4gICAgICAgIHRpbWU6IDI1MSwgLy8gbWluaW1hbCB0aW1lIG9mIHRoZSBwb2ludGVyIHRvIGJlIHByZXNzZWRcbiAgICAgICAgdGhyZXNob2xkOiA5IC8vIGEgbWluaW1hbCBtb3ZlbWVudCBpcyBvaywgYnV0IGtlZXAgaXQgbG93XG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtUT1VDSF9BQ1RJT05fQVVUT107XG4gICAgfSxcblxuICAgIHByb2Nlc3M6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICB2YXIgdmFsaWRQb2ludGVycyA9IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA9PT0gb3B0aW9ucy5wb2ludGVycztcbiAgICAgICAgdmFyIHZhbGlkTW92ZW1lbnQgPSBpbnB1dC5kaXN0YW5jZSA8IG9wdGlvbnMudGhyZXNob2xkO1xuICAgICAgICB2YXIgdmFsaWRUaW1lID0gaW5wdXQuZGVsdGFUaW1lID4gb3B0aW9ucy50aW1lO1xuXG4gICAgICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG5cbiAgICAgICAgLy8gd2Ugb25seSBhbGxvdyBsaXR0bGUgbW92ZW1lbnRcbiAgICAgICAgLy8gYW5kIHdlJ3ZlIHJlYWNoZWQgYW4gZW5kIGV2ZW50LCBzbyBhIHRhcCBpcyBwb3NzaWJsZVxuICAgICAgICBpZiAoIXZhbGlkTW92ZW1lbnQgfHwgIXZhbGlkUG9pbnRlcnMgfHwgKGlucHV0LmV2ZW50VHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpICYmICF2YWxpZFRpbWUpKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dENvbnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX1JFQ09HTklaRUQ7XG4gICAgICAgICAgICAgICAgdGhpcy50cnlFbWl0KCk7XG4gICAgICAgICAgICB9LCBvcHRpb25zLnRpbWUsIHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmV2ZW50VHlwZSAmIElOUFVUX0VORCkge1xuICAgICAgICAgICAgcmV0dXJuIFNUQVRFX1JFQ09HTklaRUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNUQVRFX0ZBSUxFRDtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICAgIH0sXG5cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gU1RBVEVfUkVDT0dOSVpFRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlucHV0ICYmIChpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9FTkQpKSB7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQgKyAndXAnLCBpbnB1dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pbnB1dC50aW1lU3RhbXAgPSBub3coKTtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCwgdGhpcy5faW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8qKlxuICogUm90YXRlXG4gKiBSZWNvZ25pemVkIHdoZW4gdHdvIG9yIG1vcmUgcG9pbnRlciBhcmUgbW92aW5nIGluIGEgY2lyY3VsYXIgbW90aW9uLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBBdHRyUmVjb2duaXplclxuICovXG5mdW5jdGlvbiBSb3RhdGVSZWNvZ25pemVyKCkge1xuICAgIEF0dHJSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXQoUm90YXRlUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFJvdGF0ZVJlY29nbml6ZXJcbiAgICAgKi9cbiAgICBkZWZhdWx0czoge1xuICAgICAgICBldmVudDogJ3JvdGF0ZScsXG4gICAgICAgIHRocmVzaG9sZDogMCxcbiAgICAgICAgcG9pbnRlcnM6IDJcbiAgICB9LFxuXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9OT05FXTtcbiAgICB9LFxuXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsIGlucHV0KSAmJlxuICAgICAgICAgICAgKE1hdGguYWJzKGlucHV0LnJvdGF0aW9uKSA+IHRoaXMub3B0aW9ucy50aHJlc2hvbGQgfHwgdGhpcy5zdGF0ZSAmIFNUQVRFX0JFR0FOKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBTd2lwZVxuICogUmVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIG1vdmluZyBmYXN0ICh2ZWxvY2l0eSksIHdpdGggZW5vdWdoIGRpc3RhbmNlIGluIHRoZSBhbGxvd2VkIGRpcmVjdGlvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gU3dpcGVSZWNvZ25pemVyKCkge1xuICAgIEF0dHJSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXQoU3dpcGVSZWNvZ25pemVyLCBBdHRyUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgU3dpcGVSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdzd2lwZScsXG4gICAgICAgIHRocmVzaG9sZDogMTAsXG4gICAgICAgIHZlbG9jaXR5OiAwLjMsXG4gICAgICAgIGRpcmVjdGlvbjogRElSRUNUSU9OX0hPUklaT05UQUwgfCBESVJFQ1RJT05fVkVSVElDQUwsXG4gICAgICAgIHBvaW50ZXJzOiAxXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFBhblJlY29nbml6ZXIucHJvdG90eXBlLmdldFRvdWNoQWN0aW9uLmNhbGwodGhpcyk7XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gdGhpcy5vcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgdmFyIHZlbG9jaXR5O1xuXG4gICAgICAgIGlmIChkaXJlY3Rpb24gJiAoRElSRUNUSU9OX0hPUklaT05UQUwgfCBESVJFQ1RJT05fVkVSVElDQUwpKSB7XG4gICAgICAgICAgICB2ZWxvY2l0eSA9IGlucHV0Lm92ZXJhbGxWZWxvY2l0eTtcbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgdmVsb2NpdHkgPSBpbnB1dC5vdmVyYWxsVmVsb2NpdHlYO1xuICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkge1xuICAgICAgICAgICAgdmVsb2NpdHkgPSBpbnB1dC5vdmVyYWxsVmVsb2NpdHlZO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1cGVyLmF0dHJUZXN0LmNhbGwodGhpcywgaW5wdXQpICYmXG4gICAgICAgICAgICBkaXJlY3Rpb24gJiBpbnB1dC5vZmZzZXREaXJlY3Rpb24gJiZcbiAgICAgICAgICAgIGlucHV0LmRpc3RhbmNlID4gdGhpcy5vcHRpb25zLnRocmVzaG9sZCAmJlxuICAgICAgICAgICAgaW5wdXQubWF4UG9pbnRlcnMgPT0gdGhpcy5vcHRpb25zLnBvaW50ZXJzICYmXG4gICAgICAgICAgICBhYnModmVsb2NpdHkpID4gdGhpcy5vcHRpb25zLnZlbG9jaXR5ICYmIGlucHV0LmV2ZW50VHlwZSAmIElOUFVUX0VORDtcbiAgICB9LFxuXG4gICAgZW1pdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGRpcmVjdGlvblN0cihpbnB1dC5vZmZzZXREaXJlY3Rpb24pO1xuICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQgKyBkaXJlY3Rpb24sIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCwgaW5wdXQpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEEgdGFwIGlzIGVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIGRvaW5nIGEgc21hbGwgdGFwL2NsaWNrLiBNdWx0aXBsZSB0YXBzIGFyZSByZWNvZ25pemVkIGlmIHRoZXkgb2NjdXJcbiAqIGJldHdlZW4gdGhlIGdpdmVuIGludGVydmFsIGFuZCBwb3NpdGlvbi4gVGhlIGRlbGF5IG9wdGlvbiBjYW4gYmUgdXNlZCB0byByZWNvZ25pemUgbXVsdGktdGFwcyB3aXRob3V0IGZpcmluZ1xuICogYSBzaW5nbGUgdGFwLlxuICpcbiAqIFRoZSBldmVudERhdGEgZnJvbSB0aGUgZW1pdHRlZCBldmVudCBjb250YWlucyB0aGUgcHJvcGVydHkgYHRhcENvdW50YCwgd2hpY2ggY29udGFpbnMgdGhlIGFtb3VudCBvZlxuICogbXVsdGktdGFwcyBiZWluZyByZWNvZ25pemVkLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFRhcFJlY29nbml6ZXIoKSB7XG4gICAgUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgLy8gcHJldmlvdXMgdGltZSBhbmQgY2VudGVyLFxuICAgIC8vIHVzZWQgZm9yIHRhcCBjb3VudGluZ1xuICAgIHRoaXMucFRpbWUgPSBmYWxzZTtcbiAgICB0aGlzLnBDZW50ZXIgPSBmYWxzZTtcblxuICAgIHRoaXMuX3RpbWVyID0gbnVsbDtcbiAgICB0aGlzLl9pbnB1dCA9IG51bGw7XG4gICAgdGhpcy5jb3VudCA9IDA7XG59XG5cbmluaGVyaXQoVGFwUmVjb2duaXplciwgUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgUGluY2hSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICd0YXAnLFxuICAgICAgICBwb2ludGVyczogMSxcbiAgICAgICAgdGFwczogMSxcbiAgICAgICAgaW50ZXJ2YWw6IDMwMCwgLy8gbWF4IHRpbWUgYmV0d2VlbiB0aGUgbXVsdGktdGFwIHRhcHNcbiAgICAgICAgdGltZTogMjUwLCAvLyBtYXggdGltZSBvZiB0aGUgcG9pbnRlciB0byBiZSBkb3duIChsaWtlIGZpbmdlciBvbiB0aGUgc2NyZWVuKVxuICAgICAgICB0aHJlc2hvbGQ6IDksIC8vIGEgbWluaW1hbCBtb3ZlbWVudCBpcyBvaywgYnV0IGtlZXAgaXQgbG93XG4gICAgICAgIHBvc1RocmVzaG9sZDogMTAgLy8gYSBtdWx0aS10YXAgY2FuIGJlIGEgYml0IG9mZiB0aGUgaW5pdGlhbCBwb3NpdGlvblxuICAgIH0sXG5cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBbVE9VQ0hfQUNUSU9OX01BTklQVUxBVElPTl07XG4gICAgfSxcblxuICAgIHByb2Nlc3M6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICAgIHZhciB2YWxpZFBvaW50ZXJzID0gaW5wdXQucG9pbnRlcnMubGVuZ3RoID09PSBvcHRpb25zLnBvaW50ZXJzO1xuICAgICAgICB2YXIgdmFsaWRNb3ZlbWVudCA9IGlucHV0LmRpc3RhbmNlIDwgb3B0aW9ucy50aHJlc2hvbGQ7XG4gICAgICAgIHZhciB2YWxpZFRvdWNoVGltZSA9IGlucHV0LmRlbHRhVGltZSA8IG9wdGlvbnMudGltZTtcblxuICAgICAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICAgICAgaWYgKChpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9TVEFSVCkgJiYgKHRoaXMuY291bnQgPT09IDApKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYWlsVGltZW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Ugb25seSBhbGxvdyBsaXR0bGUgbW92ZW1lbnRcbiAgICAgICAgLy8gYW5kIHdlJ3ZlIHJlYWNoZWQgYW4gZW5kIGV2ZW50LCBzbyBhIHRhcCBpcyBwb3NzaWJsZVxuICAgICAgICBpZiAodmFsaWRNb3ZlbWVudCAmJiB2YWxpZFRvdWNoVGltZSAmJiB2YWxpZFBvaW50ZXJzKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQuZXZlbnRUeXBlICE9IElOUFVUX0VORCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZhaWxUaW1lb3V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2YWxpZEludGVydmFsID0gdGhpcy5wVGltZSA/IChpbnB1dC50aW1lU3RhbXAgLSB0aGlzLnBUaW1lIDwgb3B0aW9ucy5pbnRlcnZhbCkgOiB0cnVlO1xuICAgICAgICAgICAgdmFyIHZhbGlkTXVsdGlUYXAgPSAhdGhpcy5wQ2VudGVyIHx8IGdldERpc3RhbmNlKHRoaXMucENlbnRlciwgaW5wdXQuY2VudGVyKSA8IG9wdGlvbnMucG9zVGhyZXNob2xkO1xuXG4gICAgICAgICAgICB0aGlzLnBUaW1lID0gaW5wdXQudGltZVN0YW1wO1xuICAgICAgICAgICAgdGhpcy5wQ2VudGVyID0gaW5wdXQuY2VudGVyO1xuXG4gICAgICAgICAgICBpZiAoIXZhbGlkTXVsdGlUYXAgfHwgIXZhbGlkSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50ID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuXG4gICAgICAgICAgICAvLyBpZiB0YXAgY291bnQgbWF0Y2hlcyB3ZSBoYXZlIHJlY29nbml6ZWQgaXQsXG4gICAgICAgICAgICAvLyBlbHNlIGl0IGhhcyBiZWdhbiByZWNvZ25pemluZy4uLlxuICAgICAgICAgICAgdmFyIHRhcENvdW50ID0gdGhpcy5jb3VudCAlIG9wdGlvbnMudGFwcztcbiAgICAgICAgICAgIGlmICh0YXBDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIG5vIGZhaWxpbmcgcmVxdWlyZW1lbnRzLCBpbW1lZGlhdGVseSB0cmlnZ2VyIHRoZSB0YXAgZXZlbnRcbiAgICAgICAgICAgICAgICAvLyBvciB3YWl0IGFzIGxvbmcgYXMgdGhlIG11bHRpdGFwIGludGVydmFsIHRvIHRyaWdnZXJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaGFzUmVxdWlyZUZhaWx1cmVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNUQVRFX1JFQ09HTklaRUQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0Q29udGV4dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cnlFbWl0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMuaW50ZXJ2YWwsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU1RBVEVfQkVHQU47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTVEFURV9GQUlMRUQ7XG4gICAgfSxcblxuICAgIGZhaWxUaW1lb3V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0Q29udGV4dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9GQUlMRUQ7XG4gICAgICAgIH0sIHRoaXMub3B0aW9ucy5pbnRlcnZhbCwgdGhpcyk7XG4gICAgICAgIHJldHVybiBTVEFURV9GQUlMRUQ7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgICB9LFxuXG4gICAgZW1pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09IFNUQVRFX1JFQ09HTklaRUQpIHtcbiAgICAgICAgICAgIHRoaXMuX2lucHV0LnRhcENvdW50ID0gdGhpcy5jb3VudDtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCwgdGhpcy5faW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8qKlxuICogU2ltcGxlIHdheSB0byBjcmVhdGUgYSBtYW5hZ2VyIHdpdGggYSBkZWZhdWx0IHNldCBvZiByZWNvZ25pemVycy5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBIYW1tZXIoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMucmVjb2duaXplcnMgPSBpZlVuZGVmaW5lZChvcHRpb25zLnJlY29nbml6ZXJzLCBIYW1tZXIuZGVmYXVsdHMucHJlc2V0KTtcbiAgICByZXR1cm4gbmV3IE1hbmFnZXIoZWxlbWVudCwgb3B0aW9ucyk7XG59XG5cbi8qKlxuICogQGNvbnN0IHtzdHJpbmd9XG4gKi9cbkhhbW1lci5WRVJTSU9OID0gJzIuMC43JztcblxuLyoqXG4gKiBkZWZhdWx0IHNldHRpbmdzXG4gKiBAbmFtZXNwYWNlXG4gKi9cbkhhbW1lci5kZWZhdWx0cyA9IHtcbiAgICAvKipcbiAgICAgKiBzZXQgaWYgRE9NIGV2ZW50cyBhcmUgYmVpbmcgdHJpZ2dlcmVkLlxuICAgICAqIEJ1dCB0aGlzIGlzIHNsb3dlciBhbmQgdW51c2VkIGJ5IHNpbXBsZSBpbXBsZW1lbnRhdGlvbnMsIHNvIGRpc2FibGVkIGJ5IGRlZmF1bHQuXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICBkb21FdmVudHM6IGZhbHNlLFxuXG4gICAgLyoqXG4gICAgICogVGhlIHZhbHVlIGZvciB0aGUgdG91Y2hBY3Rpb24gcHJvcGVydHkvZmFsbGJhY2suXG4gICAgICogV2hlbiBzZXQgdG8gYGNvbXB1dGVgIGl0IHdpbGwgbWFnaWNhbGx5IHNldCB0aGUgY29ycmVjdCB2YWx1ZSBiYXNlZCBvbiB0aGUgYWRkZWQgcmVjb2duaXplcnMuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBjb21wdXRlXG4gICAgICovXG4gICAgdG91Y2hBY3Rpb246IFRPVUNIX0FDVElPTl9DT01QVVRFLFxuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAqL1xuICAgIGVuYWJsZTogdHJ1ZSxcblxuICAgIC8qKlxuICAgICAqIEVYUEVSSU1FTlRBTCBGRUFUVVJFIC0tIGNhbiBiZSByZW1vdmVkL2NoYW5nZWRcbiAgICAgKiBDaGFuZ2UgdGhlIHBhcmVudCBpbnB1dCB0YXJnZXQgZWxlbWVudC5cbiAgICAgKiBJZiBOdWxsLCB0aGVuIGl0IGlzIGJlaW5nIHNldCB0aGUgdG8gbWFpbiBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdWxsfEV2ZW50VGFyZ2V0fVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICBpbnB1dFRhcmdldDogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIGZvcmNlIGFuIGlucHV0IGNsYXNzXG4gICAgICogQHR5cGUge051bGx8RnVuY3Rpb259XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIGlucHV0Q2xhc3M6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBEZWZhdWx0IHJlY29nbml6ZXIgc2V0dXAgd2hlbiBjYWxsaW5nIGBIYW1tZXIoKWBcbiAgICAgKiBXaGVuIGNyZWF0aW5nIGEgbmV3IE1hbmFnZXIgdGhlc2Ugd2lsbCBiZSBza2lwcGVkLlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICBwcmVzZXQ6IFtcbiAgICAgICAgLy8gUmVjb2duaXplckNsYXNzLCBvcHRpb25zLCBbcmVjb2duaXplV2l0aCwgLi4uXSwgW3JlcXVpcmVGYWlsdXJlLCAuLi5dXG4gICAgICAgIFtSb3RhdGVSZWNvZ25pemVyLCB7ZW5hYmxlOiBmYWxzZX1dLFxuICAgICAgICBbUGluY2hSZWNvZ25pemVyLCB7ZW5hYmxlOiBmYWxzZX0sIFsncm90YXRlJ11dLFxuICAgICAgICBbU3dpcGVSZWNvZ25pemVyLCB7ZGlyZWN0aW9uOiBESVJFQ1RJT05fSE9SSVpPTlRBTH1dLFxuICAgICAgICBbUGFuUmVjb2duaXplciwge2RpcmVjdGlvbjogRElSRUNUSU9OX0hPUklaT05UQUx9LCBbJ3N3aXBlJ11dLFxuICAgICAgICBbVGFwUmVjb2duaXplcl0sXG4gICAgICAgIFtUYXBSZWNvZ25pemVyLCB7ZXZlbnQ6ICdkb3VibGV0YXAnLCB0YXBzOiAyfSwgWyd0YXAnXV0sXG4gICAgICAgIFtQcmVzc1JlY29nbml6ZXJdXG4gICAgXSxcblxuICAgIC8qKlxuICAgICAqIFNvbWUgQ1NTIHByb3BlcnRpZXMgY2FuIGJlIHVzZWQgdG8gaW1wcm92ZSB0aGUgd29ya2luZyBvZiBIYW1tZXIuXG4gICAgICogQWRkIHRoZW0gdG8gdGhpcyBtZXRob2QgYW5kIHRoZXkgd2lsbCBiZSBzZXQgd2hlbiBjcmVhdGluZyBhIG5ldyBNYW5hZ2VyLlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKi9cbiAgICBjc3NQcm9wczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogRGlzYWJsZXMgdGV4dCBzZWxlY3Rpb24gdG8gaW1wcm92ZSB0aGUgZHJhZ2dpbmcgZ2VzdHVyZS4gTWFpbmx5IGZvciBkZXNrdG9wIGJyb3dzZXJzLlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIHVzZXJTZWxlY3Q6ICdub25lJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzYWJsZSB0aGUgV2luZG93cyBQaG9uZSBncmlwcGVycyB3aGVuIHByZXNzaW5nIGFuIGVsZW1lbnQuXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xuICAgICAgICAgKi9cbiAgICAgICAgdG91Y2hTZWxlY3Q6ICdub25lJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzYWJsZXMgdGhlIGRlZmF1bHQgY2FsbG91dCBzaG93biB3aGVuIHlvdSB0b3VjaCBhbmQgaG9sZCBhIHRvdWNoIHRhcmdldC5cbiAgICAgICAgICogT24gaU9TLCB3aGVuIHlvdSB0b3VjaCBhbmQgaG9sZCBhIHRvdWNoIHRhcmdldCBzdWNoIGFzIGEgbGluaywgU2FmYXJpIGRpc3BsYXlzXG4gICAgICAgICAqIGEgY2FsbG91dCBjb250YWluaW5nIGluZm9ybWF0aW9uIGFib3V0IHRoZSBsaW5rLiBUaGlzIHByb3BlcnR5IGFsbG93cyB5b3UgdG8gZGlzYWJsZSB0aGF0IGNhbGxvdXQuXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xuICAgICAgICAgKi9cbiAgICAgICAgdG91Y2hDYWxsb3V0OiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpZmllcyB3aGV0aGVyIHpvb21pbmcgaXMgZW5hYmxlZC4gVXNlZCBieSBJRTEwPlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIGNvbnRlbnRab29taW5nOiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpZmllcyB0aGF0IGFuIGVudGlyZSBlbGVtZW50IHNob3VsZCBiZSBkcmFnZ2FibGUgaW5zdGVhZCBvZiBpdHMgY29udGVudHMuIE1haW5seSBmb3IgZGVza3RvcCBicm93c2Vycy5cbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICAgICAqL1xuICAgICAgICB1c2VyRHJhZzogJ25vbmUnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPdmVycmlkZXMgdGhlIGhpZ2hsaWdodCBjb2xvciBzaG93biB3aGVuIHRoZSB1c2VyIHRhcHMgYSBsaW5rIG9yIGEgSmF2YVNjcmlwdFxuICAgICAgICAgKiBjbGlja2FibGUgZWxlbWVudCBpbiBpT1MuIFRoaXMgcHJvcGVydHkgb2JleXMgdGhlIGFscGhhIHZhbHVlLCBpZiBzcGVjaWZpZWQuXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICdyZ2JhKDAsMCwwLDApJ1xuICAgICAgICAgKi9cbiAgICAgICAgdGFwSGlnaGxpZ2h0Q29sb3I6ICdyZ2JhKDAsMCwwLDApJ1xuICAgIH1cbn07XG5cbnZhciBTVE9QID0gMTtcbnZhciBGT1JDRURfU1RPUCA9IDI7XG5cbi8qKlxuICogTWFuYWdlclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE1hbmFnZXIoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IGFzc2lnbih7fSwgSGFtbWVyLmRlZmF1bHRzLCBvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMub3B0aW9ucy5pbnB1dFRhcmdldCA9IHRoaXMub3B0aW9ucy5pbnB1dFRhcmdldCB8fCBlbGVtZW50O1xuXG4gICAgdGhpcy5oYW5kbGVycyA9IHt9O1xuICAgIHRoaXMuc2Vzc2lvbiA9IHt9O1xuICAgIHRoaXMucmVjb2duaXplcnMgPSBbXTtcbiAgICB0aGlzLm9sZENzc1Byb3BzID0ge307XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMuaW5wdXQgPSBjcmVhdGVJbnB1dEluc3RhbmNlKHRoaXMpO1xuICAgIHRoaXMudG91Y2hBY3Rpb24gPSBuZXcgVG91Y2hBY3Rpb24odGhpcywgdGhpcy5vcHRpb25zLnRvdWNoQWN0aW9uKTtcblxuICAgIHRvZ2dsZUNzc1Byb3BzKHRoaXMsIHRydWUpO1xuXG4gICAgZWFjaCh0aGlzLm9wdGlvbnMucmVjb2duaXplcnMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgdmFyIHJlY29nbml6ZXIgPSB0aGlzLmFkZChuZXcgKGl0ZW1bMF0pKGl0ZW1bMV0pKTtcbiAgICAgICAgaXRlbVsyXSAmJiByZWNvZ25pemVyLnJlY29nbml6ZVdpdGgoaXRlbVsyXSk7XG4gICAgICAgIGl0ZW1bM10gJiYgcmVjb2duaXplci5yZXF1aXJlRmFpbHVyZShpdGVtWzNdKTtcbiAgICB9LCB0aGlzKTtcbn1cblxuTWFuYWdlci5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogc2V0IG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHtNYW5hZ2VyfVxuICAgICAqL1xuICAgIHNldDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICBhc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgICAvLyBPcHRpb25zIHRoYXQgbmVlZCBhIGxpdHRsZSBtb3JlIHNldHVwXG4gICAgICAgIGlmIChvcHRpb25zLnRvdWNoQWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnRvdWNoQWN0aW9uLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmlucHV0VGFyZ2V0KSB7XG4gICAgICAgICAgICAvLyBDbGVhbiB1cCBleGlzdGluZyBldmVudCBsaXN0ZW5lcnMgYW5kIHJlaW5pdGlhbGl6ZVxuICAgICAgICAgICAgdGhpcy5pbnB1dC5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmlucHV0LnRhcmdldCA9IG9wdGlvbnMuaW5wdXRUYXJnZXQ7XG4gICAgICAgICAgICB0aGlzLmlucHV0LmluaXQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogc3RvcCByZWNvZ25pemluZyBmb3IgdGhpcyBzZXNzaW9uLlxuICAgICAqIFRoaXMgc2Vzc2lvbiB3aWxsIGJlIGRpc2NhcmRlZCwgd2hlbiBhIG5ldyBbaW5wdXRdc3RhcnQgZXZlbnQgaXMgZmlyZWQuXG4gICAgICogV2hlbiBmb3JjZWQsIHRoZSByZWNvZ25pemVyIGN5Y2xlIGlzIHN0b3BwZWQgaW1tZWRpYXRlbHkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbZm9yY2VdXG4gICAgICovXG4gICAgc3RvcDogZnVuY3Rpb24oZm9yY2UpIHtcbiAgICAgICAgdGhpcy5zZXNzaW9uLnN0b3BwZWQgPSBmb3JjZSA/IEZPUkNFRF9TVE9QIDogU1RPUDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcnVuIHRoZSByZWNvZ25pemVycyFcbiAgICAgKiBjYWxsZWQgYnkgdGhlIGlucHV0SGFuZGxlciBmdW5jdGlvbiBvbiBldmVyeSBtb3ZlbWVudCBvZiB0aGUgcG9pbnRlcnMgKHRvdWNoZXMpXG4gICAgICogaXQgd2Fsa3MgdGhyb3VnaCBhbGwgdGhlIHJlY29nbml6ZXJzIGFuZCB0cmllcyB0byBkZXRlY3QgdGhlIGdlc3R1cmUgdGhhdCBpcyBiZWluZyBtYWRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0RGF0YVxuICAgICAqL1xuICAgIHJlY29nbml6ZTogZnVuY3Rpb24oaW5wdXREYXRhKSB7XG4gICAgICAgIHZhciBzZXNzaW9uID0gdGhpcy5zZXNzaW9uO1xuICAgICAgICBpZiAoc2Vzc2lvbi5zdG9wcGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBydW4gdGhlIHRvdWNoLWFjdGlvbiBwb2x5ZmlsbFxuICAgICAgICB0aGlzLnRvdWNoQWN0aW9uLnByZXZlbnREZWZhdWx0cyhpbnB1dERhdGEpO1xuXG4gICAgICAgIHZhciByZWNvZ25pemVyO1xuICAgICAgICB2YXIgcmVjb2duaXplcnMgPSB0aGlzLnJlY29nbml6ZXJzO1xuXG4gICAgICAgIC8vIHRoaXMgaG9sZHMgdGhlIHJlY29nbml6ZXIgdGhhdCBpcyBiZWluZyByZWNvZ25pemVkLlxuICAgICAgICAvLyBzbyB0aGUgcmVjb2duaXplcidzIHN0YXRlIG5lZWRzIHRvIGJlIEJFR0FOLCBDSEFOR0VELCBFTkRFRCBvciBSRUNPR05JWkVEXG4gICAgICAgIC8vIGlmIG5vIHJlY29nbml6ZXIgaXMgZGV0ZWN0aW5nIGEgdGhpbmcsIGl0IGlzIHNldCB0byBgbnVsbGBcbiAgICAgICAgdmFyIGN1clJlY29nbml6ZXIgPSBzZXNzaW9uLmN1clJlY29nbml6ZXI7XG5cbiAgICAgICAgLy8gcmVzZXQgd2hlbiB0aGUgbGFzdCByZWNvZ25pemVyIGlzIHJlY29nbml6ZWRcbiAgICAgICAgLy8gb3Igd2hlbiB3ZSdyZSBpbiBhIG5ldyBzZXNzaW9uXG4gICAgICAgIGlmICghY3VyUmVjb2duaXplciB8fCAoY3VyUmVjb2duaXplciAmJiBjdXJSZWNvZ25pemVyLnN0YXRlICYgU1RBVEVfUkVDT0dOSVpFRCkpIHtcbiAgICAgICAgICAgIGN1clJlY29nbml6ZXIgPSBzZXNzaW9uLmN1clJlY29nbml6ZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IHJlY29nbml6ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVjb2duaXplciA9IHJlY29nbml6ZXJzW2ldO1xuXG4gICAgICAgICAgICAvLyBmaW5kIG91dCBpZiB3ZSBhcmUgYWxsb3dlZCB0cnkgdG8gcmVjb2duaXplIHRoZSBpbnB1dCBmb3IgdGhpcyBvbmUuXG4gICAgICAgICAgICAvLyAxLiAgIGFsbG93IGlmIHRoZSBzZXNzaW9uIGlzIE5PVCBmb3JjZWQgc3RvcHBlZCAoc2VlIHRoZSAuc3RvcCgpIG1ldGhvZClcbiAgICAgICAgICAgIC8vIDIuICAgYWxsb3cgaWYgd2Ugc3RpbGwgaGF2ZW4ndCByZWNvZ25pemVkIGEgZ2VzdHVyZSBpbiB0aGlzIHNlc3Npb24sIG9yIHRoZSB0aGlzIHJlY29nbml6ZXIgaXMgdGhlIG9uZVxuICAgICAgICAgICAgLy8gICAgICB0aGF0IGlzIGJlaW5nIHJlY29nbml6ZWQuXG4gICAgICAgICAgICAvLyAzLiAgIGFsbG93IGlmIHRoZSByZWNvZ25pemVyIGlzIGFsbG93ZWQgdG8gcnVuIHNpbXVsdGFuZW91cyB3aXRoIHRoZSBjdXJyZW50IHJlY29nbml6ZWQgcmVjb2duaXplci5cbiAgICAgICAgICAgIC8vICAgICAgdGhpcyBjYW4gYmUgc2V0dXAgd2l0aCB0aGUgYHJlY29nbml6ZVdpdGgoKWAgbWV0aG9kIG9uIHRoZSByZWNvZ25pemVyLlxuICAgICAgICAgICAgaWYgKHNlc3Npb24uc3RvcHBlZCAhPT0gRk9SQ0VEX1NUT1AgJiYgKCAvLyAxXG4gICAgICAgICAgICAgICAgICAgICFjdXJSZWNvZ25pemVyIHx8IHJlY29nbml6ZXIgPT0gY3VyUmVjb2duaXplciB8fCAvLyAyXG4gICAgICAgICAgICAgICAgICAgIHJlY29nbml6ZXIuY2FuUmVjb2duaXplV2l0aChjdXJSZWNvZ25pemVyKSkpIHsgLy8gM1xuICAgICAgICAgICAgICAgIHJlY29nbml6ZXIucmVjb2duaXplKGlucHV0RGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlY29nbml6ZXIucmVzZXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlIHJlY29nbml6ZXIgaGFzIGJlZW4gcmVjb2duaXppbmcgdGhlIGlucHV0IGFzIGEgdmFsaWQgZ2VzdHVyZSwgd2Ugd2FudCB0byBzdG9yZSB0aGlzIG9uZSBhcyB0aGVcbiAgICAgICAgICAgIC8vIGN1cnJlbnQgYWN0aXZlIHJlY29nbml6ZXIuIGJ1dCBvbmx5IGlmIHdlIGRvbid0IGFscmVhZHkgaGF2ZSBhbiBhY3RpdmUgcmVjb2duaXplclxuICAgICAgICAgICAgaWYgKCFjdXJSZWNvZ25pemVyICYmIHJlY29nbml6ZXIuc3RhdGUgJiAoU1RBVEVfQkVHQU4gfCBTVEFURV9DSEFOR0VEIHwgU1RBVEVfRU5ERUQpKSB7XG4gICAgICAgICAgICAgICAgY3VyUmVjb2duaXplciA9IHNlc3Npb24uY3VyUmVjb2duaXplciA9IHJlY29nbml6ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZ2V0IGEgcmVjb2duaXplciBieSBpdHMgZXZlbnQgbmFtZS5cbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ8U3RyaW5nfSByZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ8TnVsbH1cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKHJlY29nbml6ZXIgaW5zdGFuY2VvZiBSZWNvZ25pemVyKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVjb2duaXplcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZWNvZ25pemVycyA9IHRoaXMucmVjb2duaXplcnM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVjb2duaXplcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChyZWNvZ25pemVyc1tpXS5vcHRpb25zLmV2ZW50ID09IHJlY29nbml6ZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVjb2duaXplcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGFkZCBhIHJlY29nbml6ZXIgdG8gdGhlIG1hbmFnZXJcbiAgICAgKiBleGlzdGluZyByZWNvZ25pemVycyB3aXRoIHRoZSBzYW1lIGV2ZW50IG5hbWUgd2lsbCBiZSByZW1vdmVkXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSByZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ8TWFuYWdlcn1cbiAgICAgKi9cbiAgICBhZGQ6IGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKHJlY29nbml6ZXIsICdhZGQnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgZXhpc3RpbmdcbiAgICAgICAgdmFyIGV4aXN0aW5nID0gdGhpcy5nZXQocmVjb2duaXplci5vcHRpb25zLmV2ZW50KTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZShleGlzdGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlY29nbml6ZXJzLnB1c2gocmVjb2duaXplcik7XG4gICAgICAgIHJlY29nbml6ZXIubWFuYWdlciA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHJlY29nbml6ZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlbW92ZSBhIHJlY29nbml6ZXIgYnkgbmFtZSBvciBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcnxTdHJpbmd9IHJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7TWFuYWdlcn1cbiAgICAgKi9cbiAgICByZW1vdmU6IGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKHJlY29nbml6ZXIsICdyZW1vdmUnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZWNvZ25pemVyID0gdGhpcy5nZXQocmVjb2duaXplcik7XG5cbiAgICAgICAgLy8gbGV0J3MgbWFrZSBzdXJlIHRoaXMgcmVjb2duaXplciBleGlzdHNcbiAgICAgICAgaWYgKHJlY29nbml6ZXIpIHtcbiAgICAgICAgICAgIHZhciByZWNvZ25pemVycyA9IHRoaXMucmVjb2duaXplcnM7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBpbkFycmF5KHJlY29nbml6ZXJzLCByZWNvZ25pemVyKTtcblxuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJlY29nbml6ZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBiaW5kIGV2ZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50c1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcbiAgICAgKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSB0aGlzXG4gICAgICovXG4gICAgb246IGZ1bmN0aW9uKGV2ZW50cywgaGFuZGxlcikge1xuICAgICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFuZGxlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzO1xuICAgICAgICBlYWNoKHNwbGl0U3RyKGV2ZW50cyksIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBoYW5kbGVyc1tldmVudF0gPSBoYW5kbGVyc1tldmVudF0gfHwgW107XG4gICAgICAgICAgICBoYW5kbGVyc1tldmVudF0ucHVzaChoYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB1bmJpbmQgZXZlbnQsIGxlYXZlIGVtaXQgYmxhbmsgdG8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudHNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaGFuZGxlcl1cbiAgICAgKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSB0aGlzXG4gICAgICovXG4gICAgb2ZmOiBmdW5jdGlvbihldmVudHMsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzO1xuICAgICAgICBlYWNoKHNwbGl0U3RyKGV2ZW50cyksIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIWhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgaGFuZGxlcnNbZXZlbnRdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyc1tldmVudF0gJiYgaGFuZGxlcnNbZXZlbnRdLnNwbGljZShpbkFycmF5KGhhbmRsZXJzW2V2ZW50XSwgaGFuZGxlciksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGVtaXQgZXZlbnQgdG8gdGhlIGxpc3RlbmVyc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAgICovXG4gICAgZW1pdDogZnVuY3Rpb24oZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgLy8gd2UgYWxzbyB3YW50IHRvIHRyaWdnZXIgZG9tIGV2ZW50c1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRvbUV2ZW50cykge1xuICAgICAgICAgICAgdHJpZ2dlckRvbUV2ZW50KGV2ZW50LCBkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vIGhhbmRsZXJzLCBzbyBza2lwIGl0IGFsbFxuICAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzW2V2ZW50XSAmJiB0aGlzLmhhbmRsZXJzW2V2ZW50XS5zbGljZSgpO1xuICAgICAgICBpZiAoIWhhbmRsZXJzIHx8ICFoYW5kbGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEudHlwZSA9IGV2ZW50O1xuICAgICAgICBkYXRhLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkYXRhLnNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IGhhbmRsZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgaGFuZGxlcnNbaV0oZGF0YSk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZGVzdHJveSB0aGUgbWFuYWdlciBhbmQgdW5iaW5kcyBhbGwgZXZlbnRzXG4gICAgICogaXQgZG9lc24ndCB1bmJpbmQgZG9tIGV2ZW50cywgdGhhdCBpcyB0aGUgdXNlciBvd24gcmVzcG9uc2liaWxpdHlcbiAgICAgKi9cbiAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ICYmIHRvZ2dsZUNzc1Byb3BzKHRoaXMsIGZhbHNlKTtcblxuICAgICAgICB0aGlzLmhhbmRsZXJzID0ge307XG4gICAgICAgIHRoaXMuc2Vzc2lvbiA9IHt9O1xuICAgICAgICB0aGlzLmlucHV0LmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgICB9XG59O1xuXG4vKipcbiAqIGFkZC9yZW1vdmUgdGhlIGNzcyBwcm9wZXJ0aWVzIGFzIGRlZmluZWQgaW4gbWFuYWdlci5vcHRpb25zLmNzc1Byb3BzXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYWRkXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUNzc1Byb3BzKG1hbmFnZXIsIGFkZCkge1xuICAgIHZhciBlbGVtZW50ID0gbWFuYWdlci5lbGVtZW50O1xuICAgIGlmICghZWxlbWVudC5zdHlsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBwcm9wO1xuICAgIGVhY2gobWFuYWdlci5vcHRpb25zLmNzc1Byb3BzLCBmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICBwcm9wID0gcHJlZml4ZWQoZWxlbWVudC5zdHlsZSwgbmFtZSk7XG4gICAgICAgIGlmIChhZGQpIHtcbiAgICAgICAgICAgIG1hbmFnZXIub2xkQ3NzUHJvcHNbcHJvcF0gPSBlbGVtZW50LnN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IG1hbmFnZXIub2xkQ3NzUHJvcHNbcHJvcF0gfHwgJyc7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWFkZCkge1xuICAgICAgICBtYW5hZ2VyLm9sZENzc1Byb3BzID0ge307XG4gICAgfVxufVxuXG4vKipcbiAqIHRyaWdnZXIgZG9tIGV2ZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gKi9cbmZ1bmN0aW9uIHRyaWdnZXJEb21FdmVudChldmVudCwgZGF0YSkge1xuICAgIHZhciBnZXN0dXJlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICBnZXN0dXJlRXZlbnQuaW5pdEV2ZW50KGV2ZW50LCB0cnVlLCB0cnVlKTtcbiAgICBnZXN0dXJlRXZlbnQuZ2VzdHVyZSA9IGRhdGE7XG4gICAgZGF0YS50YXJnZXQuZGlzcGF0Y2hFdmVudChnZXN0dXJlRXZlbnQpO1xufVxuXG5hc3NpZ24oSGFtbWVyLCB7XG4gICAgSU5QVVRfU1RBUlQ6IElOUFVUX1NUQVJULFxuICAgIElOUFVUX01PVkU6IElOUFVUX01PVkUsXG4gICAgSU5QVVRfRU5EOiBJTlBVVF9FTkQsXG4gICAgSU5QVVRfQ0FOQ0VMOiBJTlBVVF9DQU5DRUwsXG5cbiAgICBTVEFURV9QT1NTSUJMRTogU1RBVEVfUE9TU0lCTEUsXG4gICAgU1RBVEVfQkVHQU46IFNUQVRFX0JFR0FOLFxuICAgIFNUQVRFX0NIQU5HRUQ6IFNUQVRFX0NIQU5HRUQsXG4gICAgU1RBVEVfRU5ERUQ6IFNUQVRFX0VOREVELFxuICAgIFNUQVRFX1JFQ09HTklaRUQ6IFNUQVRFX1JFQ09HTklaRUQsXG4gICAgU1RBVEVfQ0FOQ0VMTEVEOiBTVEFURV9DQU5DRUxMRUQsXG4gICAgU1RBVEVfRkFJTEVEOiBTVEFURV9GQUlMRUQsXG5cbiAgICBESVJFQ1RJT05fTk9ORTogRElSRUNUSU9OX05PTkUsXG4gICAgRElSRUNUSU9OX0xFRlQ6IERJUkVDVElPTl9MRUZULFxuICAgIERJUkVDVElPTl9SSUdIVDogRElSRUNUSU9OX1JJR0hULFxuICAgIERJUkVDVElPTl9VUDogRElSRUNUSU9OX1VQLFxuICAgIERJUkVDVElPTl9ET1dOOiBESVJFQ1RJT05fRE9XTixcbiAgICBESVJFQ1RJT05fSE9SSVpPTlRBTDogRElSRUNUSU9OX0hPUklaT05UQUwsXG4gICAgRElSRUNUSU9OX1ZFUlRJQ0FMOiBESVJFQ1RJT05fVkVSVElDQUwsXG4gICAgRElSRUNUSU9OX0FMTDogRElSRUNUSU9OX0FMTCxcblxuICAgIE1hbmFnZXI6IE1hbmFnZXIsXG4gICAgSW5wdXQ6IElucHV0LFxuICAgIFRvdWNoQWN0aW9uOiBUb3VjaEFjdGlvbixcblxuICAgIFRvdWNoSW5wdXQ6IFRvdWNoSW5wdXQsXG4gICAgTW91c2VJbnB1dDogTW91c2VJbnB1dCxcbiAgICBQb2ludGVyRXZlbnRJbnB1dDogUG9pbnRlckV2ZW50SW5wdXQsXG4gICAgVG91Y2hNb3VzZUlucHV0OiBUb3VjaE1vdXNlSW5wdXQsXG4gICAgU2luZ2xlVG91Y2hJbnB1dDogU2luZ2xlVG91Y2hJbnB1dCxcblxuICAgIFJlY29nbml6ZXI6IFJlY29nbml6ZXIsXG4gICAgQXR0clJlY29nbml6ZXI6IEF0dHJSZWNvZ25pemVyLFxuICAgIFRhcDogVGFwUmVjb2duaXplcixcbiAgICBQYW46IFBhblJlY29nbml6ZXIsXG4gICAgU3dpcGU6IFN3aXBlUmVjb2duaXplcixcbiAgICBQaW5jaDogUGluY2hSZWNvZ25pemVyLFxuICAgIFJvdGF0ZTogUm90YXRlUmVjb2duaXplcixcbiAgICBQcmVzczogUHJlc3NSZWNvZ25pemVyLFxuXG4gICAgb246IGFkZEV2ZW50TGlzdGVuZXJzLFxuICAgIG9mZjogcmVtb3ZlRXZlbnRMaXN0ZW5lcnMsXG4gICAgZWFjaDogZWFjaCxcbiAgICBtZXJnZTogbWVyZ2UsXG4gICAgZXh0ZW5kOiBleHRlbmQsXG4gICAgYXNzaWduOiBhc3NpZ24sXG4gICAgaW5oZXJpdDogaW5oZXJpdCxcbiAgICBiaW5kRm46IGJpbmRGbixcbiAgICBwcmVmaXhlZDogcHJlZml4ZWRcbn0pO1xuXG4vLyB0aGlzIHByZXZlbnRzIGVycm9ycyB3aGVuIEhhbW1lciBpcyBsb2FkZWQgaW4gdGhlIHByZXNlbmNlIG9mIGFuIEFNRFxuLy8gIHN0eWxlIGxvYWRlciBidXQgYnkgc2NyaXB0IHRhZywgbm90IGJ5IHRoZSBsb2FkZXIuXG52YXIgZnJlZUdsb2JhbCA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6ICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDoge30pKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5mcmVlR2xvYmFsLkhhbW1lciA9IEhhbW1lcjtcblxuaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEhhbW1lcjtcbiAgICB9KTtcbn0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gSGFtbWVyO1xufSBlbHNlIHtcbiAgICB3aW5kb3dbZXhwb3J0TmFtZV0gPSBIYW1tZXI7XG59XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsICdIYW1tZXInKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9oYW1tZXJqcy9oYW1tZXIuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGUgR2FtZUFjdGlvbiBoYW5kbGVzIERPTSBldmVudHMgZm9yIHVzZSBpbiBnYW1lcy5cbiAqIEBuYW1lIEdhbWVBY3Rpb25cbiAqIEBjb25zdHJ1Y3RvciBHYW1lQWN0aW9uXG4gKi9cblxuLyoqXG4gKiBBIG1hcCBvZiBzdGF0aWMgY29uc3RhbnRzIGZvciBpbnRlcm5hbCB1c2VcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAbWVtYmVyT2YgR2FtZUFjdGlvbiNcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBOT1JNQUwgTm9ybWFsIGJlaGF2aW9yLiBUaGUgaXNQcmVzc2VkKCkgbWV0aG9kIHJldHVybnMgdHJ1ZSBhcyBsb25nIGFzIHRoZSBrZXkgaXMgaGVsZCBkb3duLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IERFVEVDVF9JTklUQUxfUFJFU1NfT05MWSBJbml0aWFsIHByZXNzIGJlaGF2aW9yLiBUaGUgaXNQcmVzc2VkKCkgbWV0aG9kIHJldHVybnMgdHJ1ZSBvbmx5IGFmdGVyIHRoZSBrZXkgaXMgZmlyc3QgcHJlc3NlZCwgYW5kIG5vdCBhZ2FpbiB1bnRpbCB0aGUga2V5IGlzIHJlbGVhc2VkIGFuZCBwcmVzc2VkIGFnYWluLlxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFNUQVRFX1JFTEVBU0VEIFZhbHVlIGZvciByZWxlYXNlZCBzdGF0ZVxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFNUQVRFX1BSRVNTRUQgVmFsdWUgZm9yIHByZXNzZWQgc3RhdGVcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTVEFURV9XQUlUSU5HX0ZPUl9SRUxFQVNFIFZhbHVlIGZvciB3YWl0aW5nIGZvciByZWxlYXNlIHN0YXRlXG4gKiBAcHJvcGVydHkge051bWJlcn0gU1RBVEVfTU9WRUQgVmFsdWUgZm9yIG1vdmVkIHN0YXRlXG4gKi9cbmNvbnN0IHN0YXRpY3MgPSB7XG4gIE5PUk1BTDogMCxcbiAgREVURUNUX0lOSVRBTF9QUkVTU19PTkxZOiAxLFxuICBTVEFURV9SRUxFQVNFRDogMCxcbiAgU1RBVEVfUFJFU1NFRDogMSxcbiAgU1RBVEVfV0FJVElOR19GT1JfUkVMRUFTRTogMixcbiAgU1RBVEVfTU9WRUQ6IDNcbn07XG5cbmNsYXNzIEdhbWVBY3Rpb24ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pe1xuICAgIC8qKlxuICAgICAqIEEgbmFtZSB0byByZWZlcmVuY2UgdGhlIEdhbWVBY3Rpb24gd2l0aFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQG1lbWJlck9mIEdhbWVBY3Rpb24jXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgdG8gZGV0ZWN0IG9ubHkgdGhlIGludGlhbCBwcmVzcyBvZiB0aGUgZ2FtZSBhY3Rpb25cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBHYW1lQWN0aW9uI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5iZWhhdmlvciA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBIb3cgbWFueSB0aW1lcyB0aGUgR2FtZUFjdGlvbiBoYXMgYmVlbiBwcmVzc2VkXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgR2FtZUFjdGlvbiNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuYW1vdW50ID0gMDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBHYW1lQWN0aW9uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgR2FtZUFjdGlvbiNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuc3RhdGUgPSAwO1xuXG4gICAgdGhpcy5zdGF0aWNzID0gc3RhdGljcztcblxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoaXMgR2FtZUFjdGlvbiBzbyB0aGF0IGl0IGFwcGVhcnMgbGlrZSBpdCBoYXNuJ3QgYmVlbiBwcmVzc2VkLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIEdhbWVBY3Rpb24jXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGljcy5TVEFURV9SRUxFQVNFRDtcbiAgICB0aGlzLmFtb3VudCA9IDA7XG4gIH1cblxuICAvKipcbiAgICogVGFwcyB0aGlzIEdhbWVBY3Rpb24uIFNhbWUgYXMgY2FsbGluZyBwcmVzcygpIGZvbGxvd2VkIGJ5IHJlbGVhc2UoKS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBHYW1lQWN0aW9uI1xuICAgKi9cbiAgdGFwKCkge1xuICAgIHRoaXMucHJlc3MoKTtcbiAgICB0aGlzLnJlbGVhc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaWduYWxzIHRoYXQgdGhlIGtleSB3YXMgcHJlc3NlZC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBHYW1lQWN0aW9uI1xuICAgKi9cbiAgcHJlc3MoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRpY3MuU1RBVEVfUFJFU1NFRDtcbiAgICBpZih0aGlzLmJlaGF2aW9yID09PSBzdGF0aWNzLkRFVEVDVF9JTklUQUxfUFJFU1NfT05MWSl7XG4gICAgICB0aGlzLnByZXNzQW10KDEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTaWduYWxzIHRoYXQgdGhlIGtleSB3YXMgcHJlc3NlZCBhIHNwZWNpZmllZCBudW1iZXIgb2YgdGltZXMsIG9yIHRoYXQgdGhlIG1vdXNlIG1vdmUgYSBzcGVjaWZpZWQgZGlzdGFuY2UuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgR2FtZUFjdGlvbiNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFtb3VudCB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoZSBrZXkgaXMgcHJlc3NlZFxuICAgKi9cbiAgcHJlc3NBbXQoYW1vdW50KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUgIT09IHN0YXRpY3MuU1RBVEVfV0FJVElOR19GT1JfUkVMRUFTRSkge1xuICAgICAgdGhpcy5hbW91bnQgKz0gYW1vdW50O1xuICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRpY3MuU1RBVEVfV0FJVElOR19GT1JfUkVMRUFTRTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2lnbmFscyB0aGF0IHRoZSBrZXkgd2FzIHJlbGVhc2VkXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgR2FtZUFjdGlvbiNcbiAgICovXG4gIHJlbGVhc2UoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRpY3MuU1RBVEVfUkVMRUFTRUQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIHRoZSBrZXkgd2FzIHByZXNzZWQgb3Igbm90IHNpbmNlIGxhc3QgY2hlY2tlZC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBHYW1lQWN0aW9uI1xuICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIHRoZSBrZXkgaXMgcHJlc3NlZCwgZWxzZSBmYWxzZVxuICAgKi9cbiAgaXNQcmVzc2VkKCkge1xuICAgIGlmKHRoaXMuc3RhdGUgPT09IHN0YXRpY3MuU1RBVEVfUFJFU1NFRCl7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb3Iga2V5cywgdGhpcyBpcyB0aGUgbnVtYmVyIG9mIHRpbWVzIHRoZSBrZXkgd2FzIHByZXNzZWQgc2luY2UgaXQgd2FzIGxhc3QgY2hlY2tlZC5cbiAgICogRm9yIG1vdXNlIG1vdmVtZW50LCB0aGlzIGlzIHRoZSBkaXN0YW5jZSBtb3ZlZC5cbiAgICpcbiAgICogVGhpcyBSZXNldHMgdGhlIGFtb3VudCB0byB6ZXJvIGFmdGVyIGJlaW5nIGNoZWNrZWQhXG4gICAqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgR2FtZUFjdGlvbiNcbiAgICogQHJldHVybiB7TnVtYmVyfSBOdW1iZXIgb2YgdGltZXMgdGhlIGtleSB3YXMgcHJlc3NlZCBvciBkaXN0YW5jZSBtb3VzZSB3YXMgbW92ZWRcbiAgICovXG4gIGdldEFtb3VudCgpIHtcbiAgICB2YXIgcmV0VmFsID0gdGhpcy5hbW91bnQ7XG4gICAgaWYgKHJldFZhbCAhPT0gMCkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IHN0YXRpY3MuU1RBVEVfUkVMRUFTRUQpIHtcbiAgICAgICAgdGhpcy5hbW91bnQgPSAwO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmJlaGF2aW9yID09PSBzdGF0aWNzLkRFVEVDVF9JTklUQUxfUFJFU1NfT05MWSkge1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGljcy5TVEFURV9XQUlUSU5HX0ZPUl9SRUxFQVNFO1xuICAgICAgICB0aGlzLmFtb3VudCA9IDA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXRWYWw7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lQWN0aW9uO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9HYW1lQWN0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQSBHYW1lQWN0aW9uIHRoYXQgaGFuZGxlcyBUb3VjaCBldmVudHNcbiAqIEBuYW1lIFRvdWNoQWN0aW9uXG4gKiBAY29uc3RydWN0b3IgVG91Y2hBY3Rpb25cbiAqIEBleHRlbmRzIHtHYW1lQWN0aW9ufVxuICovXG5cbmNvbnN0IEdhbWVBY3Rpb24gPSByZXF1aXJlKCcuL0dhbWVBY3Rpb24nKTtcblxuY2xhc3MgVG91Y2hBY3Rpb24gZXh0ZW5kcyBHYW1lQWN0aW9uIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KXtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIHBvc2l0aW9ucyB3aGVyZSB0b3VjaHN0YXJ0IGhhcHBlbmVkXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqIEBtZW1iZXJPZiBUb3VjaEFjdGlvbiNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuc3RhcnRQb3NpdGlvbnMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgcG9zaXRpb25zIHdoZXJlIHRvdWNoZW5kIGhhcHBlbmVkXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqIEBtZW1iZXJPZiBUb3VjaEFjdGlvbiNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuZW5kUG9zaXRpb25zID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIHBvc2l0aW9ucyB3aGVyZSB0b3VjaG1vdmUgaGFwcGVuZWRcbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICogQG1lbWJlck9mIFRvdWNoQWN0aW9uI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5wb3NpdGlvbnMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogV2V0aGVyIGFueSBvZiB0aGUgdG91Y2ggYWN0aW9ucyBvcmlnaW5hdGVkIGluc2lkZSB0aGUgY2FudmFzXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG1lbWJlck9mIFRvdWNoQWN0aW9uI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5pbnNpZGVDYW52YXMgPSBudWxsO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIFNpZ25hbHMgdGhhdCB0aGUgdG91Y2ggd2FzIGluaXRpYXRlZC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBUb3VjaEFjdGlvbiNcbiAgICogQHBhcmFtIHtBcnJheX0gc3RhcnRQb3NpdGlvbnMgQXJyYXkgb2YgcG9pbnRzIHdoZXJlIHRvdWNoIHdhcyBwcmVzc2VkXG4gICAqL1xuICBwcmVzcyhzdGFydFBvc2l0aW9ucyl7XG4gICAgdGhpcy5zdGFydFBvc2l0aW9ucyA9IHN0YXJ0UG9zaXRpb25zO1xuICAgIHRoaXMucG9zaXRpb25zID0gc3RhcnRQb3NpdGlvbnM7XG4gICAgc3VwZXIucHJlc3Moc3RhcnRQb3NpdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNpZ25hbHMgdGhhdCB0aGUgdG91Y2ggd2FzIHJlbGVhc2VkXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgVG91Y2hBY3Rpb24jXG4gICAqIEBwYXJhbSB7QXJyYXl9IGVuZFBvc2l0aW9ucyBBcnJheSBvZiBwb2ludHMgd2hlcmUgdG91Y2ggd2FzIHJlbGVhc2VkXG4gICAqL1xuICByZWxlYXNlKGVuZFBvc2l0aW9ucyl7XG4gICAgdGhpcy5lbmRQb3NpdGlvbnMgPSBlbmRQb3NpdGlvbnM7XG4gICAgc3VwZXIucmVsZWFzZShlbmRQb3NpdGlvbnMpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVG91Y2hBY3Rpb247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL1RvdWNoQWN0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQSBHYW1lQWN0aW9uIHRoYXQgaGFuZGxlcyBNb3VzZSBldmVudHNcbiAqIEBuYW1lIE1vdXNlQWN0aW9uXG4gKiBAY29uc3RydWN0b3IgTW91c2VBY3Rpb25cbiAqIEBleHRlbmRzIHtHYW1lQWN0aW9ufVxuICovXG5cbmNvbnN0IEdhbWVBY3Rpb24gPSByZXF1aXJlKCcuL0dhbWVBY3Rpb24nKTtcblxuY2xhc3MgTW91c2VBY3Rpb24gZXh0ZW5kcyBHYW1lQWN0aW9uIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KXtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFBvc2l0aW9uIHdoZXJlIG1vdXNlZG93biBoYXBwZW5lZFxuICAgICAqIEB0eXBlIHtQb2ludH1cbiAgICAgKiBAbWVtYmVyT2YgTW91c2VBY3Rpb24jXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLnN0YXJ0UG9zaXRpb24gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogUG9zaXRpb24gd2hlcmUgbW91c2V1cCBoYXBwZW5lZFxuICAgICAqIEB0eXBlIHtQb2ludH1cbiAgICAgKiBAbWVtYmVyT2YgTW91c2VBY3Rpb24jXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmVuZFBvc2l0aW9uID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFBvc2l0aW9uIHdoZXJlIG1vdXNlbW92ZSBoYXBwZW5lZFxuICAgICAqIEB0eXBlIHtQb2ludH1cbiAgICAgKiBAbWVtYmVyT2YgTW91c2VBY3Rpb24jXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLnBvc2l0aW9uID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFdldGhlciB0aGUgbW91c2UgYWN0aW9uIG9yaWdpbmF0ZWQgaW5zaWRlIHRoZSBjYW52YXNcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbWVtYmVyT2YgTW91c2VBY3Rpb24jXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmluc2lkZUNhbnZhcyA9IG51bGw7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9wdGlvbnMpO1xuXG4gIH1cblxuICAvKipcbiAgICogU2lnbmFscyB0aGF0IHRoZSBtb3VzZSB3YXMgcHJlc3NlZC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBHYW1lQWN0aW9uI1xuICAgKi9cbiAgcHJlc3Moc3RhcnRQb3NpdGlvbil7XG4gICAgdGhpcy5zdGFydFBvc2l0aW9uID0gc3RhcnRQb3NpdGlvbjtcbiAgICB0aGlzLnBvc2l0aW9uID0gc3RhcnRQb3NpdGlvbjtcbiAgICBzdXBlci5wcmVzcyhzdGFydFBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaWduYWxzIHRoYXQgdGhlIG1vdXNlIHdhcyByZWxlYXNlZFxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIE1vdXNlQWN0aW9uI1xuICAgKiBAcGFyYW0gIHtQb2ludH0gZW5kUG9zaXRpb24gVGhlIHBvaW50IHdoZXJlIG1vdXNlIHdhcyByZWxlYXNlZFxuICAgKi9cbiAgcmVsZWFzZShlbmRQb3NpdGlvbil7XG4gICAgdGhpcy5lbmRQb3NpdGlvbiA9IGVuZFBvc2l0aW9uIHx8IHRoaXMucG9zaXRpb247XG4gICAgc3VwZXIucmVsZWFzZShlbmRQb3NpdGlvbik7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb3VzZUFjdGlvbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vTW91c2VBY3Rpb24uanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gaW5zaWRlQ2FudmFzKHB0LCBjYW52YXMpe1xuICBpZigocHQueCA8IDApIHx8IChwdC54ID4gIGNhbnZhcy53aWR0aCkgfHwgKHB0LnkgPCAwKSB8fCAocHQueSA+IGNhbnZhcy5oZWlnaHQpKXtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNpZGVDYW52YXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3V0aWxzL2luc2lkZUNhbnZhcy5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ0FOQ0VMOiAzLFxuICBIRUxQOiA2LFxuICBCQUNLX1NQQUNFOiA4LFxuICBUQUI6IDksXG4gIENMRUFSOiAxMixcbiAgUkVUVVJOOiAxMyxcbiAgRU5URVI6IDE0LFxuICBTSElGVDogMTYsXG4gIENPTlRST0w6IDE3LFxuICBBTFQ6IDE4LFxuICBQQVVTRTogMTksXG4gIENBUFNfTE9DSzogMjAsXG4gIEVTQ0FQRTogMjcsXG4gIFNQQUNFOiAzMixcbiAgUEFHRV9VUDogMzMsXG4gIFBBR0VfRE9XTjogMzQsXG4gIEVORDogMzUsXG4gIEhPTUU6IDM2LFxuICBMRUZUOiAzNyxcbiAgVVA6IDM4LFxuICBSSUdIVDogMzksXG4gIERPV046IDQwLFxuICBQUklOVFNDUkVFTjogNDQsXG4gIElOU0VSVDogNDUsXG4gIERFTEVURTogNDYsXG4gIE5VTTA6IDQ4LFxuICBOVU0xOiA0OSxcbiAgTlVNMjogNTAsXG4gIE5VTTM6IDUxLFxuICBOVU00OiA1MixcbiAgTlVNNTogNTMsXG4gIE5VTTY6IDU0LFxuICBOVU03OiA1NSxcbiAgTlVNODogNTYsXG4gIE5VTTk6IDU3LFxuICBTRU1JQ09MT046IDU5LFxuICBFUVVBTFM6IDYxLFxuICBBOiA2NSxcbiAgQjogNjYsXG4gIEM6IDY3LFxuICBEOiA2OCxcbiAgRTogNjksXG4gIEY6IDcwLFxuICBHOiA3MSxcbiAgSDogNzIsXG4gIEk6IDczLFxuICBKOiA3NCxcbiAgSzogNzUsXG4gIEw6IDc2LFxuICBNOiA3NyxcbiAgTjogNzgsXG4gIE86IDc5LFxuICBQOiA4MCxcbiAgUTogODEsXG4gIFI6IDgyLFxuICBTOiA4MyxcbiAgVDogODQsXG4gIFU6IDg1LFxuICBWOiA4NixcbiAgVzogODcsXG4gIFg6IDg4LFxuICBZOiA4OSxcbiAgWjogOTAsXG4gIENPTlRFWFRfTUVOVTogOTMsXG4gIE5VTVBBRDA6IDk2LFxuICBOVU1QQUQxOiA5NyxcbiAgTlVNUEFEMjogOTgsXG4gIE5VTVBBRDM6IDk5LFxuICBOVU1QQUQ0OiAxMDAsXG4gIE5VTVBBRDU6IDEwMSxcbiAgTlVNUEFENjogMTAyLFxuICBOVU1QQUQ3OiAxMDMsXG4gIE5VTVBBRDg6IDEwNCxcbiAgTlVNUEFEOTogMTA1LFxuICBNVUxUSVBMWTogMTA2LFxuICBBREQ6IDEwNyxcbiAgU0VQQVJBVE9SOiAxMDgsXG4gIFNVQlRSQUNUOiAxMDksXG4gIERFQ0lNQUw6IDExMCxcbiAgRElWSURFOiAxMTEsXG4gIEYxOiAxMTIsXG4gIEYyOiAxMTMsXG4gIEYzOiAxMTQsXG4gIEY0OiAxMTUsXG4gIEY1OiAxMTYsXG4gIEY2OiAxMTcsXG4gIEY3OiAxMTgsXG4gIEY4OiAxMTksXG4gIEY5OiAxMjAsXG4gIEYxMDogMTIxLFxuICBGMTE6IDEyMixcbiAgRjEyOiAxMjMsXG4gIEYxMzogMTI0LFxuICBGMTQ6IDEyNSxcbiAgRjE1OiAxMjYsXG4gIEYxNjogMTI3LFxuICBGMTc6IDEyOCxcbiAgRjE4OiAxMjksXG4gIEYxOTogMTMwLFxuICBGMjA6IDEzMSxcbiAgRjIxOiAxMzIsXG4gIEYyMjogMTMzLFxuICBGMjM6IDEzNCxcbiAgRjI0OiAxMzUsXG4gIE5VTV9MT0NLOiAxNDQsXG4gIFNDUk9MTF9MT0NLOiAxNDUsXG4gIFVQX0RQQUQ6IDE3NSxcbiAgRE9XTl9EUEFEOiAxNzYsXG4gIExFRlRfRFBBRDogMTc3LFxuICBSSUdIVF9EUEFEOiAxNzgsXG4gIENPTU1BOiAxODgsXG4gIFBFUklPRDogMTkwLFxuICBTTEFTSDogMTkxLFxuICBCQUNLX1FVT1RFOiAxOTIsXG4gIE9QRU5fQlJBQ0tFVDogMjE5LFxuICBCQUNLX1NMQVNIOiAyMjAsXG4gIENMT1NFX0JSQUNLRVQ6IDIyMSxcbiAgUVVPVEU6IDIyMixcbiAgTUVUQTogMjI0XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9rZXlzLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhlIFJlc291cmNlTWFuYWdlciBoYW5kbGVzIGxvYWRpbmcgaW1hZ2VzIGFuZCBzb3VuZHMgZm9yIHVzZSBpbiBnYW1lcy5cbiAqIEBuYW1lIFJlc291cmNlTWFuYWdlclxuICogQGNvbnN0cnVjdG9yIFJlc291cmNlTWFuYWdlclxuICovXG5cbiAndXNlIHN0cmljdCc7XG5cbmNvbnN0IGhhcyA9IHJlcXVpcmUoJy4vaGFzJyk7XG5jb25zdCBTb3VuZCA9IHJlcXVpcmUoJy4vc291bmRzL1NvdW5kJyk7XG5jb25zdCBXZWJBdWRpbyA9IHJlcXVpcmUoJy4vc291bmRzL1dlYkF1ZGlvJyk7XG5cbnZhciByZXNvdXJjZUxpc3QgPSB7fTtcblxuLy9UT0RPOiBtb3ZlIHRoZXNlIHRvIGl0cyBvd24gbW9kdWxlIGZvciB1bml0IHRlc3Rpbmc/XG5mdW5jdGlvbiBub3JtYWxpemVQYXRoKGJhc2VEaXIsIHBhdGgpe1xuICB2YXIgam9pbmVkUGF0aCA9IHBhdGg7XG4gIGlmKGJhc2VEaXIpe1xuICAgIGpvaW5lZFBhdGggPSBbYmFzZURpciwgcGF0aF0uam9pbignLycpO1xuICB9XG4gIHJldHVybiBqb2luZWRQYXRoLnJlcGxhY2UoL1xcL3syLH0vZywgJy8nKTtcbn1cblxuZnVuY3Rpb24gZmxpcFgoaW1hZ2Upe1xuICB2YXIgb2Zmc2NyZWVuQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIG9mZnNjcmVlbkNhbnZhcy5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG4gIG9mZnNjcmVlbkNhbnZhcy53aWR0aCA9IGltYWdlLndpZHRoO1xuICB2YXIgY3R4ID0gb2Zmc2NyZWVuQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgY3R4LnRyYW5zbGF0ZShvZmZzY3JlZW5DYW52YXMud2lkdGgsIDApO1xuICBjdHguc2NhbGUoLTEsIDEpO1xuICBjdHguZHJhd0ltYWdlKGltYWdlLCAwLCAwKTtcbiAgcmV0dXJuIG9mZnNjcmVlbkNhbnZhcy50b0RhdGFVUkwoKTtcbn1cblxuZnVuY3Rpb24gZmxpcFkoaW1hZ2Upe1xuICB2YXIgb2Zmc2NyZWVuQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIG9mZnNjcmVlbkNhbnZhcy5oZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG4gIG9mZnNjcmVlbkNhbnZhcy53aWR0aCA9IGltYWdlLndpZHRoO1xuICB2YXIgY3R4ID0gb2Zmc2NyZWVuQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgY3R4LnRyYW5zbGF0ZSgwLCBvZmZzY3JlZW5DYW52YXMuaGVpZ2h0KTtcbiAgY3R4LnNjYWxlKDEsIC0xKTtcbiAgY3R4LmRyYXdJbWFnZShpbWFnZSwgMCwgMCk7XG4gIHJldHVybiBvZmZzY3JlZW5DYW52YXMudG9EYXRhVVJMKCk7XG59XG5cbmNsYXNzIEltYWdlV3JhcHBlciB7XG4gIGNvbnN0cnVjdG9yKGZpbGVuYW1lKXtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5uYW1lID0gZmlsZW5hbWU7XG4gICAgc2VsZi5jb21wbGV0ZSA9IGZhbHNlO1xuICAgIHNlbGYuaW1nID0gbmV3IEltYWdlKCk7XG4gICAgc2VsZi5pbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5jb21wbGV0ZSA9IHRydWU7XG4gICAgfSwgZmFsc2UpO1xuICB9XG5cbiAgbG9hZCgpe1xuICAgIHRoaXMuaW1nLnNyYyA9IHRoaXMubmFtZTtcbiAgfVxufVxuXG5cbmNsYXNzIFJlc291cmNlTWFuYWdlciB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KXtcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgYWxsIHRoZSByZXNvdXJjZXMgaGF2ZSBiZWVuIGxvYWRlZFxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBtZW1iZXJPZiBSZXNvdXJjZU1hbmFnZXIjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmFsbExvYWRlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgZGlyZWN0b3J5IHRvIGxvYWQgaW1hZ2VzIGZyb21cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBtZW1iZXJPZiBSZXNvdXJjZU1hbmFnZXIjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmltYWdlRGlyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBiYXNlIGRpcmVjdG9yeSB0byBsb2FkIHNvdW5kcyBmcm9tXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAbWVtYmVyT2YgUmVzb3VyY2VNYW5hZ2VyI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5zb3VuZERpciA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBBIG1hcCBvZiBhbGwgdGhlIHJlc291cmNlcyBieSB0aGVpciBVUkxzXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbWVtYmVyT2YgUmVzb3VyY2VNYW5hZ2VyI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5yZXNvdXJjZUxpc3QgPSByZXNvdXJjZUxpc3Q7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9wdGlvbnMpO1xuXG4gICAgLy8gVE9ETyBub3Qgc3VyZSBhIGJldHRlciB3YXlcbiAgICBpZighdGhpcy5Tb3VuZCl7XG4gICAgICBpZihoYXMoJ1dlYkF1ZGlvJykpe1xuICAgICAgICB0aGlzLlNvdW5kID0gV2ViQXVkaW87XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICB0aGlzLlNvdW5kID0gU291bmQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIGFuIGltYWdlIChvciBhIGNvbGxlY3Rpb24gb2YgaW1hZ2VzKSwgYW5kIHRyYWNrcyBpZiBpdCBoYXMgZmluaXNoZWQgbG9hZGluZ1xuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIFJlc291cmNlTWFuYWdlciNcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGZpbGVzIEZpbGVuYW1lIG9mIHRoZSBpbWFnZSByZWxhdGl2ZSB0aGUgR2FtZSdzIEhUTUwgcGFnZS5cbiAgICogQHJldHVybnMge0ltYWdlfEFycmF5fSBSZXR1cm4gdHlwZSBiYXNlZCBvbiBhcmd1bWVudDogSW1hZ2UgaWYgU3RyaW5nIG9yIEFycmF5IG9mIEltYWdlcyBpZiBBcnJheVxuICAgKi9cbiAgbG9hZEltYWdlKGZpbGVzKXtcbiAgICBsZXQgc2luZ2xlRmlsZSA9IGZhbHNlO1xuICAgIGlmKCFBcnJheS5pc0FycmF5KGZpbGVzKSkge1xuICAgICAgc2luZ2xlRmlsZSA9IHRydWU7XG4gICAgICBmaWxlcyA9IFtmaWxlc107XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZUxpc3QgPSBmaWxlcy5tYXAoKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVuYW1lID0gbm9ybWFsaXplUGF0aCh0aGlzLmltYWdlRGlyLCBmaWxlKTtcbiAgICAgIC8vaWYgd2UgYWxyZWFkeSBoYXZlIHRoZSBpbWFnZSwganVzdCByZXR1cm4gaXRcbiAgICAgIGlmKHRoaXMucmVzb3VyY2VMaXN0W2ZpbGVuYW1lXSl7XG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlTGlzdFtmaWxlbmFtZV0uaW1nO1xuICAgICAgfVxuICAgICAgdGhpcy5hbGxMb2FkZWQgPSBmYWxzZTtcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IG5ldyBJbWFnZVdyYXBwZXIoZmlsZW5hbWUpO1xuICAgICAgLy8gTmVlZCB0byBleHBsaWNpdGx5IGNhbGwgbG9hZCBiZWNhdXNlIGZsaXBJbWFnZSBhbHNvIHVzZXMgdGhpcyBvYmplY3RcbiAgICAgIC8vIHdoaWNoIGlzIHByb2JhYmx5IGEgYmFkIGlkZWEgYW5kIHNob3VsZCBjaGFuZ2UgaW4gZnV0dXJlXG4gICAgICAvLyBUT0RPOiBkaWZmZXJlbnQgb2JqZWN0cyBmb3IgZmxpcHBlZCBpbWFnZSBhbmQgcmVndWxhciBpbWFnZVxuICAgICAgd3JhcHBlci5sb2FkKCk7XG4gICAgICB0aGlzLnJlc291cmNlTGlzdFtmaWxlbmFtZV0gPSB3cmFwcGVyO1xuICAgICAgcmV0dXJuIHdyYXBwZXIuaW1nO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNpbmdsZUZpbGUgPyBmaWxlTGlzdFswXSA6IGZpbGVMaXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIGEgc291bmQgZmlsZSAob3IgYSBjb2xsZWN0aW9uIG9mIHNvdW5kIGZpbGVzKSwgYW5kIHRyYWNrcyBpZiBpdCBoYXMgZmluaXNoZWQgbG9hZGluZ1xuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIFJlc291cmNlTWFuYWdlciNcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGZpbGVuYW1lIEZpbGVuYW1lIG9mIHRoZSBzb3VuZCByZWxhdGl2ZSB0aGUgR2FtZSdzIEhUTUwgcGFnZS5cbiAgICogQHJldHVybnMge1NvdW5kfEFycmF5fSBSZXR1cm4gdHlwZSBiYXNlZCBvbiBhcmd1bWVudDogU291bmQgT2JqZWN0IGlmIFN0cmluZyBvciBBcnJheSBvZiBTb3VuZCBPYmplY3RzIGlmIEFycmF5XG4gICAqL1xuICBsb2FkU291bmQoZmlsZXMpe1xuICAgIGxldCBzaW5nbGVGaWxlID0gZmFsc2U7XG4gICAgaWYoIUFycmF5LmlzQXJyYXkoZmlsZXMpKSB7XG4gICAgICBzaW5nbGVGaWxlID0gdHJ1ZTtcbiAgICAgIGZpbGVzID0gW2ZpbGVzXTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlTGlzdCA9IGZpbGVzLm1hcCgoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgZmlsZW5hbWUgPSBub3JtYWxpemVQYXRoKHRoaXMuc291bmREaXIsIGZpbGUpO1xuICAgICAgLy9pZiB3ZSBhbHJlYWR5IGhhdmUgdGhlIHNvdW5kLCBqdXN0IHJldHVybiBpdFxuICAgICAgaWYodGhpcy5yZXNvdXJjZUxpc3RbZmlsZW5hbWVdKXtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VMaXN0W2ZpbGVuYW1lXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYWxsTG9hZGVkID0gZmFsc2U7XG5cbiAgICAgIGNvbnN0IHNvdW5kID0gbmV3IHRoaXMuU291bmQoZmlsZW5hbWUpO1xuICAgICAgdGhpcy5yZXNvdXJjZUxpc3RbZmlsZW5hbWVdID0gc291bmQ7XG4gICAgICByZXR1cm4gc291bmQ7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc2luZ2xlRmlsZSA/IGZpbGVMaXN0WzBdIDogZmlsZUxpc3Q7XG4gIH1cblxuICAvKipcbiAgICogRmxpcHMgYW4gaW1hZ2UgdXNpbmcgdGhlIGxvZ2ljIGluIGEgZmxpcCBmdW5jdGlvbiBwYXNzZWQgYW5kIGF0dGFjaGVzIHRvIHJlc291cmNlIG1hbmFnZXIgd2l0aCBuYW1lXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgUmVzb3VyY2VNYW5hZ2VyI1xuICAgKiBAcGFyYW0gIHtTdHJpbmd8TnVtYmVyfSBuYW1lIE5hbWUgZm9yIGNhY2hpbmcgZmxpcHBlZCBpbWFnZVxuICAgKiBAcGFyYW0gIHtJbWFnZX0gaW1hZ2UgSW1hZ2UgdG8gYmUgZmxpcHBlZFxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZmxpcEZuIEZ1bmN0aW9uIGNvbnRhaW5pbmcgbG9naWMgdG8gZmxpcCBpbWFnZVxuICAgKiBAcmV0dXJuIHtJbWFnZX0gRmxpcHBlZCBpbWFnZVxuICAgKi9cbiAgZmxpcEltYWdlKG5hbWUsIGltYWdlLCBmbGlwRm4pe1xuICAgIHRoaXMuYWxsTG9hZGVkID0gZmFsc2U7XG5cbiAgICBjb25zdCB3cmFwcGVyID0gbmV3IEltYWdlV3JhcHBlcihuYW1lKTtcbiAgICB0aGlzLnJlc291cmNlTGlzdFtuYW1lXSA9IHdyYXBwZXI7XG4gICAgY29uc3QgaW1nMiA9IG5ldyBJbWFnZSgpO1xuICAgIGZ1bmN0aW9uIGRvRmxpcCgpIHtcbiAgICAgIHdyYXBwZXIuaW1nLnNyYyA9IGZsaXBGbihpbWcyKTtcbiAgICAgIGltZzIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIGRvRmxpcCk7XG4gICAgfVxuICAgIGltZzIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGRvRmxpcCk7XG4gICAgaW1nMi5zcmMgPSBpbWFnZS5zcmM7XG5cbiAgICByZXR1cm4gd3JhcHBlci5pbWc7XG4gIH1cblxuICAvKipcbiAgICogRmxpcCBpbWFnZSBhbG9uZyB4LWF4aXMgdXNpbmcgZGVmYXVsdCBmbGlwIGxvZ2ljXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgUmVzb3VyY2VNYW5hZ2VyI1xuICAgKiBAcGFyYW0gIHtTdHJpbmd8TnVtYmVyfSBuYW1lIE5hbWUgZm9yIGNhY2hpbmcgZmxpcHBlZCBpbWFnZVxuICAgKiBAcGFyYW0gIHtJbWFnZX0gaW1hZ2UgSW1hZ2UgdG8gYmUgZmxpcHBlZFxuICAgKiBAcmV0dXJuIHtJbWFnZX0gRmxpcHBlZCBpbWFnZVxuICAgKi9cbiAgZmxpcEltYWdlWChuYW1lLCBpbWFnZSl7XG4gICAgcmV0dXJuIHRoaXMuZmxpcEltYWdlKG5hbWUsIGltYWdlLCBmbGlwWCk7XG4gIH1cblxuICAvKipcbiAgICogRmxpcCBpbWFnZSBhbG9uZyB0aGUgeS1heGlzIHVzaW5nIGRlZmF1bHQgZmxpcCBsb2dpY1xuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIFJlc291cmNlTWFuYWdlciNcbiAgICogQHBhcmFtICB7U3RyaW5nfE51bWJlcn0gbmFtZSBOYW1lIGZvciBjYWNoaW5nIGZsaXBwZWQgaW1hZ2VcbiAgICogQHBhcmFtICB7SW1hZ2V9IGltYWdlIEltYWdlIHRvIGJlIGZsaXBwZWRcbiAgICogQHJldHVybiB7SW1hZ2V9IEZsaXBwZWQgaW1hZ2VcbiAgICovXG4gIGZsaXBJbWFnZVkobmFtZSwgaW1hZ2Upe1xuICAgIHJldHVybiB0aGlzLmZsaXBJbWFnZShuYW1lLCBpbWFnZSwgZmxpcFkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIHRoZSByZXNvdXJjZXMgaGF2ZSBmaW5pc2hlZCBsb2FkaW5nXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgUmVzb3VyY2VNYW5hZ2VyI1xuICAgKi9cbiAgcmVzb3VyY2VzUmVhZHkoKXtcbiAgICBpZih0aGlzLmFsbExvYWRlZCl7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yKHZhciBmaWxlbmFtZSBpbiB0aGlzLnJlc291cmNlTGlzdCl7XG4gICAgICAgIHZhciByZXNvdXJjZSA9IHRoaXMucmVzb3VyY2VMaXN0W2ZpbGVuYW1lXTtcbiAgICAgICAgaWYoIXJlc291cmNlLmNvbXBsZXRlKXtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYWxsTG9hZGVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBwZXJjZW50IG9mIHJlc291cmNlcyBsb2FkZWQuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgUmVzb3VyY2VNYW5hZ2VyI1xuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBwZXJjZW50IG9mIHJlc291cmNlcyBsb2FkZWRcbiAgICovXG4gIGdldFBlcmNlbnRDb21wbGV0ZSgpe1xuICAgIHZhciBudW1Db21wbGV0ZSA9IDAuMDtcbiAgICB2YXIgbGVuZ3RoID0gMDtcbiAgICBmb3IodmFyIGZpbGVuYW1lIGluIHRoaXMucmVzb3VyY2VMaXN0KXtcbiAgICAgIHZhciByZXNvdXJjZSA9IHRoaXMucmVzb3VyY2VMaXN0W2ZpbGVuYW1lXTtcbiAgICAgIGxlbmd0aCsrO1xuICAgICAgaWYocmVzb3VyY2UuY29tcGxldGUpe1xuICAgICAgICBudW1Db21wbGV0ZSA9IG51bUNvbXBsZXRlICsgMS4wO1xuICAgICAgfVxuICAgIH1cbiAgICBpZihsZW5ndGggPT09IDApe1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBNYXRoLnJvdW5kKChudW1Db21wbGV0ZSAvIGxlbmd0aCkgKiAxMDAuMCk7XG4gICAgfVxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNvdXJjZU1hbmFnZXI7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL1Jlc291cmNlTWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbi8vIGhhY2t5IHNpbXBsZSBpbXBsZW1lbnRhdGlvbiBvZiBoYXNcblxuY29uc3QgZ2xvYmFsQXVkaW9Db250ZXh0ID0gcmVxdWlyZSgnLi9zaGltcy9BdWRpb0NvbnRleHQnKTtcblxuXG5mdW5jdGlvbiBoYXMoY2hlY2spe1xuXG4gIGlmKGNoZWNrID09ICdzaGl0dHlTb3VuZCcpe1xuICAgIHJldHVybiAhISgoaGFzKCdhbmRyb2lkJykgfHwgaGFzKCdpb3MnKSkgJiYgaGFzKCd3ZWJraXQnKSk7XG4gIH1cbiAgZWxzZSBpZihjaGVjayA9PSAnYW5kcm9pZCcpe1xuICAgIHJldHVybiAocGFyc2VGbG9hdChuYXZpZ2F0b3IudXNlckFnZW50LnNwbGl0KFwiQW5kcm9pZCBcIilbMV0pIHx8IHVuZGVmaW5lZCk7XG4gIH1cbiAgZWxzZSBpZihjaGVjayA9PSAnaW9zJyl7XG4gICAgLy9UT0RPIG5lZWQgc29tZXRoaW5nIGZvciB0aGlzXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGVsc2UgaWYoY2hlY2sgPT0gJ3dlYmtpdCcpe1xuICAgIHJldHVybiAocGFyc2VGbG9hdChuYXZpZ2F0b3IudXNlckFnZW50LnNwbGl0KFwiV2ViS2l0L1wiKVsxXSkgfHwgdW5kZWZpbmVkKTtcbiAgfVxuICBlbHNlIGlmKGNoZWNrID09ICdXZWJBdWRpbycpe1xuICAgIHJldHVybiAhIWdsb2JhbC5BdWRpb0NvbnRleHQ7XG4gIH1cbiAgZWxzZSBpZiAoY2hlY2sgPT09ICd0b3VjaCcpIHtcbiAgICByZXR1cm4gJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vaGFzLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbnZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcblxuZm9yKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cuQXVkaW9Db250ZXh0OyArK3gpIHtcbiAgd2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvd1t2ZW5kb3JzW3hdKydBdWRpb0NvbnRleHQnXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3aW5kb3cuQXVkaW9Db250ZXh0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zaGltcy9BdWRpb0NvbnRleHQuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQW4gQXVkaW8gb2JqZWN0IHRoYXQgaW1wbGVtZW50cyBhIGdlbmVyaWMgQVBJXG4gKiBAbmFtZSBTb3VuZFxuICogQGNvbnN0cnVjdG9yIFNvdW5kXG4gKi9cblxuXG4vKipcbiAqIE1hcCBvZiBhdWRpbyB0eXBlcyBhbmQgY29kZWNzIHVzZWQgaW4gZmFsbGJhY2sgbG9hZGluZyBvZiBzb3VuZHMgPGJyPlxuICogUmVmZXJlbmNlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL0hUTUwvU3VwcG9ydGVkX21lZGlhX2Zvcm1hdHNcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAbWVtYmVyT2YgU291bmQjXG4gKiBAcHJvcGVydHkge1N0cmluZ30gJ2F1ZGlvL21wZWcnICcubXAzJ1xuICogQHByb3BlcnR5IHtTdHJpbmd9ICdhdWRpby93ZWJtJyAnLndlYm0nXG4gKiBAcHJvcGVydHkge1N0cmluZ30gJ2F1ZGlvL29nZycgJy5vZ2cnXG4gKiBAcHJvcGVydHkge1N0cmluZ30gJ2F1ZGlvL3dhdicgJy53YXYnXG4gKiBAcHJvcGVydHkge1N0cmluZ30gJ2F1ZGlvL2FhYycgJy5hYWMnXG4gKiBAcHJvcGVydHkge1N0cmluZ30gJ2F1ZGlvL3gtbTRhJyAnLm00YSdcbiAqIEBleGFtcGxlXG4gKiAvLyBUbyBvdmVycmlkZSB0aGUgZGVmYXVsdCBmb3JtYXRzOlxuICogLy8gRG8gdGhpcyBiZWZvcmUgbG9hZGluZyBhbnkgc291bmRzXG4gKiByZXF1aXJlKFtcbiAqICAgJ2Zyb3plbi9zb3VuZHMvU291bmQnXG4gKiBdLCBmdW5jdGlvbihTb3VuZCl7XG4gKiAgIFNvdW5kLnByb3RvdHlwZS5mb3JtYXRzID0ge1xuICogICAgICdhdWRpby9tcGVnJzogJy5tcDMnLFxuICogICAgICdhdWRpby93ZWJtJzogJy53ZWJtJ1xuICogICB9O1xuICogfSk7XG4gKi9cbmNvbnN0IGZvcm1hdHMgPSB7XG4gICdhdWRpby9tcGVnJzogJy5tcDMnLFxuICAnYXVkaW8vd2VibSc6ICcud2VibScsXG4gICdhdWRpby9vZ2cnOiAnLm9nZycsXG4gICdhdWRpby93YXYnOiAnLndhdicsXG4gICdhdWRpby9hYWMnOiAnLmFhYycsXG4gICdhdWRpby94LW00YSc6ICcubTRhJ1xufTtcblxuXG5cbmNsYXNzIFNvdW5kIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KXtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBBdWRpbyBvYmplY3QgLSB0eXBpY2FsbHkgdGhlIGZpbGVuYW1lXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAbWVtYmVyT2YgU291bmQjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogU2lnbmFscyBpZiB0aGUgQXVkaW8gb2JqZWN0IGhhcyBjb21wbGV0ZWQgbG9hZGluZ1xuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBtZW1iZXJPZiBTb3VuZCNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuY29tcGxldGUgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIGV4dGVuc2lvbnMgdGhlIGJyb3dzZXIgXCJwcm9iYWJseVwiIGNhbiBwbGF5XG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqIEBtZW1iZXJPZiBTb3VuZCNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMucHJvYmFibHkgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIGV4dGVuc2lvbnMgdGhlIGJyb3dzZXIgXCJtYXliZVwiIGNhbiBwbGF5XG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqIEBtZW1iZXJPZiBTb3VuZCNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMubWF5YmUgPSBbXTtcblxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmZvcm1hdHMgPSBmb3JtYXRzO1xuXG4gICAgaWYodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKXtcbiAgICAgIHRoaXMubG9hZChvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9hZCB0aGUgc291bmQgYnkgZmlsZW5hbWVcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBTb3VuZCNcbiAgICogQHBhcmFtICB7U3RyaW5nfSBmaWxlbmFtZSBUaGUgZmlsZW5hbWUgb2YgdGhlIGZpbGUgdG8gbG9hZFxuICAgKi9cbiAgbG9hZChmaWxlbmFtZSl7XG4gICAgdGhpcy5uYW1lID0gZmlsZW5hbWU7XG4gICAgdGhpcy5jb21wbGV0ZSA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogTG9vcCB0aGUgc291bmQgYXQgYSBjZXJ0YWluIHZvbHVtZVxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIFNvdW5kI1xuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHZvbHVtZSBWYWx1ZSBvZiB2b2x1bWUgLSBiZXR3ZWVuIDAgYW5kIDFcbiAgICovXG4gIGxvb3Aodm9sdW1lKXt9XG5cbiAgLyoqXG4gICAqIFBsYXkgdGhlIHNvdW5kIGF0IGEgY2VydGFpbiB2b2x1bWUgYW5kIHN0YXJ0IHRpbWVcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBTb3VuZCNcbiAgICogQHBhcmFtICB7TnVtYmVyfSB2b2x1bWUgICAgVmFsdWUgb2Ygdm9sdW1lIC0gYmV0d2VlbiAwIGFuZCAxXG4gICAqIEBwYXJhbSAge051bWJlcn0gc3RhcnRUaW1lIFZhbHVlIG9mIG1pbGxpc2Vjb25kcyBpbnRvIHRoZSB0cmFjayB0byBzdGFydFxuICAgKi9cbiAgcGxheSh2b2x1bWUsIHN0YXJ0VGltZSl7fVxuXG4gIC8qKlxuICAgKiBNZXRob2QgdXNlZCB0byBjb25zdHJ1Y3QgQXVkaW8gb2JqZWN0cyBpbnRlcm5hbGx5XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgU291bmQjXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge051bWJlcn0gdm9sdW1lIFZhbHVlIG9mIHZvbHVtZSAtIGJldHdlZW4gMCBhbmQgMVxuICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb29wIFdoZXRoZXIgb3Igbm90IHRvIGxvb3AgYXVkaW9cbiAgICogQHJldHVybiB7QXVkaW99IEF1ZGlvIG9iamVjdCB0aGF0IHdhcyBjb25zdHJ1Y3RlZFxuICAgKi9cbiAgX2luaXRBdWRpbyh2b2x1bWUsIGxvb3Ape31cblxuICAvKipcbiAgICogTWV0aG9kIHVzZWQgdG8gZ2VuZXJhdGUgYSBjYWNoZSBvZiBleHRlbnNpb25zIChwcm9iYWJseS9tYXliZSBhcnJheXMpIHRvIHRyeSBsb2FkaW5nXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgU291bmQjXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge1N0cmluZ30gRmlyc3QgZXh0ZW5zaW9uIHRvIHRyeSBsb2FkaW5nXG4gICAqL1xuICBfY2hvb3NlRm9ybWF0KCl7XG4gICAgaWYoIXRoaXMucHJvYmFibHkubGVuZ3RoICYmICF0aGlzLm1heWJlLmxlbmd0aCl7XG4gICAgICAvLyBGaWd1cmUgb3V0IHRoZSBiZXN0IGV4dGVuc2lvbiBpZiB3ZSBoYXZlIG5vIGNhY2hlXG4gICAgICB2YXIgYXVkaW8gPSBuZXcgQXVkaW8oKTtcbiAgICAgIHZhciBjb2RlYztcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBmb3IoY29kZWMgaW4gdGhpcy5mb3JtYXRzKXtcbiAgICAgICAgcmVzdWx0ID0gYXVkaW8uY2FuUGxheVR5cGUoY29kZWMpO1xuICAgICAgICBpZihyZXN1bHQgPT09ICdwcm9iYWJseScpe1xuICAgICAgICAgIHRoaXMucHJvYmFibHkucHVzaCh0aGlzLmZvcm1hdHNbY29kZWNdKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHJlc3VsdCA9PT0gJ21heWJlJyl7XG4gICAgICAgICAgdGhpcy5tYXliZS5wdXNoKHRoaXMuZm9ybWF0c1tjb2RlY10pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYodGhpcy5wcm9iYWJseS5sZW5ndGgpe1xuICAgICAgcmV0dXJuIHRoaXMucHJvYmFibHlbMF07XG4gICAgfVxuXG4gICAgaWYodGhpcy5tYXliZS5sZW5ndGgpe1xuICAgICAgcmV0dXJuIHRoaXMubWF5YmVbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCB1c2VkIHRvIHJlbW92ZSBhIGV4dGVuc2lvbiB0aGF0IGRpZG4ndCB3b3JrIGFuZCByZXR1cm4gdGhlIG5leHQgdmlhYmxlIGV4dGVuc2lvblxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIFNvdW5kI1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IE5leHQgZXh0ZW5zaW9uIHRvIHRyeSBsb2FkaW5nXG4gICAqL1xuICBfbmV4dEZvcm1hdCgpe1xuICAgIGlmKHRoaXMucHJvYmFibHkubGVuZ3RoID4gMSl7XG4gICAgICB0aGlzLnByb2JhYmx5LnNoaWZ0KCk7XG4gICAgICByZXR1cm4gdGhpcy5wcm9iYWJseVswXTtcbiAgICB9XG5cbiAgICBpZih0aGlzLnByb2JhYmx5Lmxlbmd0aCA9PT0gMSl7XG4gICAgICB0aGlzLnByb2JhYmx5Lmxlbmd0aCA9IDA7XG4gICAgICBpZih0aGlzLm1heWJlLmxlbmd0aCl7XG4gICAgICAgIHJldHVybiB0aGlzLm1heWJlWzBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmKHRoaXMubWF5YmUubGVuZ3RoID4gMSl7XG4gICAgICB0aGlzLm1heWJlLnNoaWZ0KCk7XG4gICAgICByZXR1cm4gdGhpcy5tYXliZVswXTtcbiAgICB9XG5cbiAgICBpZih0aGlzLm1heWJlLmxlbmd0aCA9PT0gMSl7XG4gICAgICB0aGlzLm1heWJlLmxlbmd0aCA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTb3VuZDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc291bmRzL1NvdW5kLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIEFuIEF1ZGlvIG9iamVjdCB0aGF0IGltcGxlbWVudHMgV2ViQXVkaW8gaW50byBhIGdlbmVyaWMgQVBJXG4gKiBAbmFtZSBXZWJBdWRpb1xuICogQGNvbnN0cnVjdG9yIFdlYkF1ZGlvXG4gKiBAZXh0ZW5kcyBTb3VuZFxuICovXG5cbmNvbnN0IFNvdW5kID0gcmVxdWlyZSgnLi9Tb3VuZCcpO1xuY29uc3QgcmVtb3ZlRXh0ZW5zaW9uID0gcmVxdWlyZSgnLi4vdXRpbHMvcmVtb3ZlRXh0ZW5zaW9uJyk7XG5jb25zdCBoYXMgPSByZXF1aXJlKCcuLi9oYXMnKTtcblxudmFyIGF1ZGlvQ29udGV4dCA9IG51bGw7XG5cblxuaWYoaGFzKCdXZWJBdWRpbycpKXtcbiAgYXVkaW9Db250ZXh0ID0gbmV3IHdpbmRvdy5BdWRpb0NvbnRleHQoKTtcbn1cblxuaWYoaGFzKCdzaGl0dHlTb3VuZCcpKXtcbiAgLy8gU2ltaWxhciBzdHJhdGVneSB0byBodHRwczovL2dpdGh1Yi5jb20vQ3JlYXRlSlMvU291bmRKU1xuICBmdW5jdGlvbiBoYW5kbGVTaGl0dHkoKSB7XG4gICAgY29uc3Qgc291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgIHNvdXJjZS5idWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcbiAgICBzb3VyY2UuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgIHNvdXJjZS5zdGFydCgwKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgaGFuZGxlU2hpdHR5KTtcbiAgfVxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgaGFuZGxlU2hpdHR5KTtcbn1cblxuY2xhc3MgV2ViQXVkaW8gZXh0ZW5kcyBTb3VuZCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSl7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgV2ViQXVkaW8gQXVkaW9Db250ZXh0IC0gdXNlZCB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gYSBzb3VuZFxuICAgICAqIEB0eXBlIHtBdWRpb0NvbnRleHR9XG4gICAgICogQG1lbWJlck9mIFdlYkF1ZGlvI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5hdWRpb0NvbnRleHQgPSBhdWRpb0NvbnRleHQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc291bmQgYnVmZmVyXG4gICAgICogQHR5cGUge0J1ZmZlcn1cbiAgICAgKiBAbWVtYmVyT2YgV2ViQXVkaW8jXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgbG9hZChmaWxlbmFtZSl7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5uYW1lID0gZmlsZW5hbWU7XG5cbiAgICB2YXIgYmFzZW5hbWUgPSByZW1vdmVFeHRlbnNpb24oZmlsZW5hbWUpO1xuICAgIGlmKGJhc2VuYW1lID09PSBmaWxlbmFtZSl7XG4gICAgICBmaWxlbmFtZSA9IGJhc2VuYW1lICsgdGhpcy5fY2hvb3NlRm9ybWF0KCk7XG4gICAgfVxuICAgIC8vIGZpbGVuYW1lID0gcmVxLnRvVXJsKGZpbGVuYW1lKTtcblxuICAgIGZ1bmN0aW9uIGRlY29kZUF1ZGlvRGF0YShlKXtcbiAgICAgIC8vIERlY29kZSBhc3luY2hyb25vdXNseVxuICAgICAgc2VsZi5hdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKGUudGFyZ2V0LnJlc3BvbnNlLFxuICAgICAgICBmdW5jdGlvbihidWZmZXIpe1xuICAgICAgICAgIHNlbGYuYnVmZmVyID0gYnVmZmVyO1xuICAgICAgICAgIHNlbGYuY29tcGxldGUgPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbihlcnIpe1xuICAgICAgICAgIHZhciBmb3JtYXQgPSBzZWxmLl9uZXh0Rm9ybWF0KCk7XG4gICAgICAgICAgaWYoZm9ybWF0KXtcbiAgICAgICAgICAgIHNlbGYubG9hZChzZWxmLm5hbWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmLmNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGJyb3dzZXIgaGFzIEF1ZGlvQ29udGV4dCwgaXQncyBuZXcgZW5vdWdoIGZvciBYTUxIdHRwUmVxdWVzdFxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxdWVzdC5vcGVuKCdHRVQnLCBmaWxlbmFtZSwgdHJ1ZSk7XG4gICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgcmVxdWVzdC5vbmxvYWQgPSBkZWNvZGVBdWRpb0RhdGE7XG4gICAgcmVxdWVzdC5zZW5kKCk7XG4gIH1cblxuICBsb29wKHZvbHVtZSl7XG4gICAgLy8gUmV0dXJuIGVhcmx5IGlmIHdlIGRvbid0IGhhdmUgYSBidWZmZXIgdG8gcHJvdGVjdCBmcm9tIHVubG9hZGVkIHJlc291cmNlc1xuICAgIGlmKCF0aGlzLmJ1ZmZlcil7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGF1ZGlvID0gdGhpcy5faW5pdEF1ZGlvKHZvbHVtZSwgdHJ1ZSk7XG4gICAgYXVkaW8uc3RhcnQoMCk7XG4gIH1cblxuICBwbGF5KHZvbHVtZSwgc3RhcnRUaW1lKXtcbiAgICAvLyBSZXR1cm4gZWFybHkgaWYgd2UgZG9uJ3QgaGF2ZSBhIGJ1ZmZlciB0byBwcm90ZWN0IGZyb20gdW5sb2FkZWQgcmVzb3VyY2VzXG4gICAgaWYoIXRoaXMuYnVmZmVyKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzdGFydFRpbWUgPSBzdGFydFRpbWUgfHwgMDtcblxuICAgIHZhciBhdWRpbyA9IHRoaXMuX2luaXRBdWRpbyh2b2x1bWUsIGZhbHNlKTtcbiAgICBhdWRpby5zdGFydChzdGFydFRpbWUpO1xuICB9XG5cbiAgX2luaXRBdWRpbyh2b2x1bWUsIGxvb3Ape1xuICAgIGxvb3AgPSB0eXBlb2YgbG9vcCA9PT0gJ2Jvb2xlYW4nID8gbG9vcCA6IGZhbHNlO1xuXG4gICAgdmFyIHNvdXJjZSA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgIHNvdXJjZS5idWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICBzb3VyY2UubG9vcCA9IGxvb3A7XG4gICAgaWYodm9sdW1lKXtcbiAgICAgIHZhciBnYWluTm9kZSA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICAgIGdhaW5Ob2RlLmdhaW4udmFsdWUgPSB2b2x1bWU7XG4gICAgICBzb3VyY2UuY29ubmVjdChnYWluTm9kZSk7XG4gICAgICBnYWluTm9kZS5jb25uZWN0KHRoaXMuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc291cmNlLmNvbm5lY3QodGhpcy5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2ViQXVkaW87XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NvdW5kcy9XZWJBdWRpby5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiByZW1vdmVFeHRlbnNpb24ocGF0aCl7XG4gIC8vIG9ubHkgc3RyaXBzIG9mZiBleHRlbnNpb25zIHRoYXQgaGF2ZSBsZW5ndGggb2YgNCBvciBsZXNzXG4gIC8vIHJlZ2V4IGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODE4MzEwL3JlZ3VsYXItZXhwcmVzc2lvbi10by1yZW1vdmUtYS1maWxlcy1leHRlbnNpb25cbiAgcmV0dXJuIHBhdGgucmVwbGFjZSgvKC4qKVxcLlteLl17MSw0fSQvLCAnJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVtb3ZlRXh0ZW5zaW9uO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi91dGlscy9yZW1vdmVFeHRlbnNpb24uanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogUmVwcmVzZW50cyBhIHNlcmllcyBvZiBmcmFtZXMgdGhhdCBjYW4gYmUgcmVuZGVyZWQgYXMgYW4gYW5pbWF0aW9uLlxuICogQG5hbWUgQW5pbWF0aW9uXG4gKiBAY29uc3RydWN0b3IgQW5pbWF0aW9uXG4gKi9cblxuY29uc3QgQW5pbUZyYW1lID0gcmVxdWlyZSgnLi9BbmltRnJhbWUnKTtcblxuXG5jbGFzcyBBbmltYXRpb24ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pe1xuXG4gICAgLyoqXG4gICAgICogVGhlIGluZGV4IG9mIHRoZSBjdXJyZW50IGZyYW1lIGJlaW5nIHVzZWQgdG8gcmVuZGVyIHRoaXMgQW5pbWF0aW9uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgQW5pbWF0aW9uI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5jdXJyRnJhbWVJbmRleCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY3VycmVudCBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgdGhpcyBhbmltYXRpb24gaGFzIGJlZW4gcnVubmluZ1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlck9mIEFuaW1hdGlvbiNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuYW5pbVRpbWUgPSAwO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHRvdGFsIG51bWJlciBvZiBtaWxsaXNlY29uZHMgZm9yIGEgY29tcGxldGUgY3ljbGVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBBbmltYXRpb24jXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLnRvdGFsRHVyYXRpb24gPSAwO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGhlaWdodCBpbiBwaXhlbHNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBBbmltYXRpb24jXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IDY0O1xuXG4gICAgLyoqXG4gICAgICogVGhlIHdpZHRoIGluIHBpeGVsc1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlck9mIEFuaW1hdGlvbiNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSA2NDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBpbWFnZSB0byByZW5kZXJcbiAgICAgKiBAdHlwZSB7SW1hZ2V9XG4gICAgICogQG1lbWJlck9mIEFuaW1hdGlvbiNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuaW1hZ2UgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG9mZnNldCBvZiB0aGUgb2YgcGl4ZWxzIGluIHRoZSB4IHNsb3QgZnJvbSB0aGUgc291cmNlIGltYWdlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgQW5pbWF0aW9uI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5vZmZzZXRYID0gMDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBvZmZzZXQgb2YgdGhlIG9mIHBpeGVscyBpbiB0aGUgeSBzbG90IGZyb20gdGhlIHNvdXJjZSBpbWFnZVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlck9mIEFuaW1hdGlvbiNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMub2Zmc2V0WSA9IDA7XG5cbiAgICB0aGlzLmZyYW1lcyA9IHVuZGVmaW5lZDtcblxuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuc3RhcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGNyZWF0ZSBhbiBhbmltYXRpb24gZnJvbSBhIHNoZWV0IG9mIHRpbGVzXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQW5pbWF0aW9uI1xuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGZyYW1lQ291bnQgTnVtYmVyIG9mIGZyYW1lcyBpbiB0aGUgYW5pbWF0aW9uXG4gICAqIEBwYXJhbSAge051bWJlcnxBcnJheX0gZnJhbWVUaW1lcyBWYWx1ZSBvciBhcnJheSBvZiB2YWx1ZXMgY29ycmVzcG9uZGluZyB0byBhbW91bnQgb2YgdGltZSBwZXIgZnJhbWVcbiAgICogQHBhcmFtICB7SW1hZ2V9IGltZyBJbWFnZSBzaGVldCB0byBjcmVhdGUgYW5pbWF0aW9uIGZyb21cbiAgICogQHBhcmFtICB7TnVtYmVyfSB3IFdpZHRoIG9mIGVhY2ggdGlsZSBpbiBwaXhlbHNcbiAgICogQHBhcmFtICB7TnVtYmVyfSBoIEhlaWdodCBvZiBlYWNoIHRpbGUgaW4gcGl4ZWxzXG4gICAqIEBwYXJhbSAge051bWJlcn0geVNsb3QgU2xvdCBvbiBZIGF4aXMgdG8gc3RhcnQgY3JlYXRpbmcgdGlsZXNcbiAgICogQHJldHVybiB7QW5pbWF0aW9ufSBBbmltYXRpb24gZ2VuZXJhdGVkIHVzaW5nIHBhcmFtZXRlcnNcbiAgICovXG4gIGNyZWF0ZUZyb21TaGVldChmcmFtZUNvdW50LCBmcmFtZVRpbWVzLCBpbWcsIHcsIGgsIHlTbG90KXtcbiAgICB2YXIgYW5pbSA9IG5ldyBBbmltYXRpb24oe1xuICAgICAgaW1hZ2U6IGltZyxcbiAgICAgIGhlaWdodDogaCxcbiAgICAgIHdpZHRoOiB3XG4gICAgfSk7XG5cbiAgICB2YXIgaXNGVEFycmF5ID0gQXJyYXkuaXNBcnJheShmcmFtZVRpbWVzKTtcblxuICAgIHZhciBjdXJyZW50RnJhbWVUaW1lID0gMTtcbiAgICBpZigheVNsb3Qpe1xuICAgICAgeVNsb3QgPSAwO1xuICAgIH1cbiAgICBmb3IodmFyIGogPSAwOyBqIDwgZnJhbWVDb3VudDsgaisrKXtcbiAgICAgIGlmKGlzRlRBcnJheSl7XG4gICAgICAgIGN1cnJlbnRGcmFtZVRpbWUgPSBmcmFtZVRpbWVzW2pdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudEZyYW1lVGltZSA9IGZyYW1lVGltZXM7XG4gICAgICB9XG4gICAgICBhbmltLmFkZEZyYW1lKGN1cnJlbnRGcmFtZVRpbWUsIGosIHlTbG90KTtcbiAgICB9XG4gICAgcmV0dXJuIGFuaW07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGR1cGxpY2F0ZSBvZiB0aGlzIGFuaW1hdGlvbi4gVGhlIGxpc3Qgb2YgZnJhbWVzXG4gICAqIGFyZSBzaGFyZWQgYmV0d2VlbiB0aGUgdHdvIEFuaW1hdGlvbnMsIGJ1dCBlYWNoIEFuaW1hdGlvblxuICAgKiBjYW4gYmUgYW5pbWF0ZWQgaW5kZXBlbmRlbnRseS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBBbmltYXRpb24jXG4gICAqL1xuICBjbG9uZSgpe1xuICAgIHJldHVybiBuZXcgQW5pbWF0aW9uKHtcbiAgICAgIGltYWdlOiB0aGlzLmltYWdlLFxuICAgICAgZnJhbWVzOiB0aGlzLmZyYW1lcyxcbiAgICAgIHRvdGFsRHVyYXRpb246IHRoaXMudG90YWxEdXJhdGlvblxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gaW1hZ2UgdG8gdGhlIGFuaW1hdGlvbiB3aXRoIHRoZSBzcGVjaWZpZWQgZHVyYXRpb24gKHRpbWUgdG8gZGlzcGxheSB0aGUgaW1hZ2UpLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIEFuaW1hdGlvbiNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIER1cmF0aW9uIG9mIHRoZSBmcmFtZVxuICAgKiBAcGFyYW0ge051bWJlcn0gaW1hZ2VTbG90WCBTbG90IG9uIHRoZSBYIGF4aXMgZm9yIHRoZSBmcmFtZVxuICAgKiBAcGFyYW0ge051bWJlcn0gaW1hZ2VTbG90WSBTbG90IG9uIHRoZSBZIGF4aXMgZm9yIHRoZSBmcmFtZVxuICAgKi9cbiAgYWRkRnJhbWUoZHVyYXRpb24sIGltYWdlU2xvdFgsIGltYWdlU2xvdFkpe1xuICAgIGlmKCF0aGlzLmZyYW1lcyl7XG4gICAgICB0aGlzLmZyYW1lcyA9IFtdO1xuICAgIH1cbiAgICB0aGlzLnRvdGFsRHVyYXRpb24gKz0gZHVyYXRpb247XG4gICAgdGhpcy5mcmFtZXMucHVzaChuZXcgQW5pbUZyYW1lKHtcbiAgICAgIGVuZFRpbWU6IHRoaXMudG90YWxEdXJhdGlvbixcbiAgICAgIGltYWdlOiB0aGlzLmltYWdlLFxuICAgICAgaW1nU2xvdFg6IGltYWdlU2xvdFgsXG4gICAgICBpbWdTbG90WTogaW1hZ2VTbG90WVxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhpcyBhbmltYXRpb24gb3ZlciBmcm9tIHRoZSBiZWdpbm5pbmcuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQW5pbWF0aW9uI1xuICAgKi9cbiAgc3RhcnQoKXtcbiAgICB0aGlzLmFuaW1UaW1lID0gMDtcbiAgICB0aGlzLmN1cnJGcmFtZUluZGV4ID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoaXMgYW5pbWF0aW9uJ3MgY3VycmVudCBpbWFnZSAoZnJhbWUpLCBpZiBuZWNjZXNhcnkuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQW5pbWF0aW9uI1xuICAgKiBAcGFyYW0ge051bWJlcn0gZWxhcHNlZFRpbWUgRWxhcHNlZCB0aW1lIGluIG1pbGxpc2Vjb25kc1xuICAgKi9cbiAgdXBkYXRlKGVsYXBzZWRUaW1lKXtcbiAgICBpZiAodGhpcy5mcmFtZXMubGVuZ3RoID4gMSkge1xuICAgICAgdGhpcy5hbmltVGltZSArPSBlbGFwc2VkVGltZTtcblxuICAgICAgaWYgKHRoaXMuYW5pbVRpbWUgPj0gdGhpcy50b3RhbER1cmF0aW9uKSB7XG4gICAgICAgIHRoaXMuYW5pbVRpbWUgPSB0aGlzLmFuaW1UaW1lICUgdGhpcy50b3RhbER1cmF0aW9uO1xuICAgICAgICB0aGlzLmN1cnJGcmFtZUluZGV4ID0gMDtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHRoaXMuYW5pbVRpbWUgPiB0aGlzLmZyYW1lc1t0aGlzLmN1cnJGcmFtZUluZGV4XS5lbmRUaW1lKSB7XG4gICAgICAgIHRoaXMuY3VyckZyYW1lSW5kZXgrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGlzIEFuaW1hdGlvbidzIGN1cnJlbnQgYW5pbWF0aW9uIGZyYW1lLiBSZXR1cm5zIG51bGwgaWYgdGhpcyBhbmltYXRpb24gaGFzIG5vIGZyYW1lcy5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBBbmltYXRpb24jXG4gICAqIEByZXR1cm4ge0FuaW1hdGlvbkZyYW1lfG51bGx9IFRoZSBhbmltYXRpb24gZnJhbWUgYXQgdGhlIGN1cnJlbnQgZnJhbWUgaW5kZXggb3IgbnVsbCBpZiBubyBmcmFtZXMgYXJlIGF2YWlsYWJsZVxuICAgKi9cbiAgZ2V0Q3VycmVudEZyYW1lKCl7XG4gICAgaWYgKHRoaXMuZnJhbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmZyYW1lc1t0aGlzLmN1cnJGcmFtZUluZGV4XTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRHJhd3MgdGhlIGN1cnJlbnQgZnJhbWUgaW50byBhIDJkIGNvbnRleHQuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQW5pbWF0aW9uI1xuICAgKiBAcGFyYW0ge0NvbnRleHR9IGNvbnRleHQgVGhlIEhUTUw1IGRyYXdpbmcgY2FudmFzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4IFRoZSB4IGNvb3JkaW5hdGUgaW4gdGhlIGdyYXBoaWNzIGNvbnRleHRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgVGhlIHkgY29vcmRpbmF0ZSBpbiB0aGUgZ3JhcGhpY3MgY29udGV4dFxuICAgKi9cbiAgZHJhdyhjb250ZXh0LCB4LCB5KXtcbiAgICB2YXIgY2YgPSB0aGlzLmdldEN1cnJlbnRGcmFtZSgpO1xuICAgIGNvbnRleHQuZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIGNmLmltZ1Nsb3RYICogdGhpcy53aWR0aCArIHRoaXMub2Zmc2V0WCwgY2YuaW1nU2xvdFkgKiB0aGlzLmhlaWdodCArIHRoaXMub2Zmc2V0WSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIHgsIHksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFuaW1hdGlvbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQW5pbWF0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFJlcHJlc2VudHMgYSBhIHNpbmdsZSBmcmFtZSBpbiBhbiBhbmltYXRpb24uXG4gKiBAbmFtZSBBbmltYXRpb25GcmFtZVxuICogQGNvbnN0cnVjdG9yIEFuaW1hdGlvbkZyYW1lXG4gKiBAcGFyYW0ge09iamVjdH0gbWl4aW4gT2JqZWN0IGNvbnRhaW5pbmcgcHJvcGVydGllcyB0byBtaXhpblxuICovXG5cbmNsYXNzIEFuaW1GcmFtZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSl7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZW5kaW5nIHRpbWUgaW4gbWlsbGlzZWNvbmRzIG9mIHRoaXMgZnJhbWUgcmVsYXRpdmUgdG8gaXRzIEFuaW1hdGlvblxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlck9mIEFuaW1hdGlvbkZyYW1lI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5lbmRUaW1lID0gMDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBob3Jpem9udGFsIHBvc2l0aW9uIG9mIHRoZSBncm91cCBvZiBmcmFtZXMgY29udGFpbmVkIGluIGEgc2luZ2xlIGltYWdlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgQW5pbWF0aW9uRnJhbWUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmltZ1Nsb3RYID0gMDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB2ZXJ0aWNhbCBwb3NpdGlvbiBvZiB0aGUgZ3JvdXAgb2YgZnJhbWVzIGNvbnRhaW5lZCBpbiBhIHNpbmdsZSBpbWFnZVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlck9mIEFuaW1hdGlvbkZyYW1lI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5pbWdTbG90WSA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaW1hZ2UgdG8gcmVuZGVyXG4gICAgICogQHR5cGUge0ltYWdlfVxuICAgICAqIEBtZW1iZXJPZiBBbmltYXRpb25GcmFtZSNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuaW1hZ2UgPSBudWxsO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQW5pbUZyYW1lO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9BbmltRnJhbWUuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGF2ZXJhZ2VQb2ludHMgPSByZXF1aXJlKCcuL3V0aWxzL2F2ZXJhZ2VQb2ludHMnKTtcbmNvbnN0IGRlZ3JlZXNUb1JhZGlhbnMgPSByZXF1aXJlKCcuL3V0aWxzL2RlZ3JlZXNUb1JhZGlhbnMnKTtcbmNvbnN0IHJhZGlhbnNUb0RlZ3JlZXMgPSByZXF1aXJlKCcuL3V0aWxzL3JhZGlhbnNUb0RlZ3JlZXMnKTtcbmNvbnN0IHBvaW50SW5Qb2x5Z29uID0gcmVxdWlyZSgnLi91dGlscy9wb2ludEluUG9seWdvbicpO1xuY29uc3QgZGlzdGFuY2UgPSByZXF1aXJlKCcuL3V0aWxzL2Rpc3RhbmNlJyk7XG5jb25zdCBkZWdyZWVzRnJvbUNlbnRlciA9IHJlcXVpcmUoJy4vdXRpbHMvZGVncmVlc0Zyb21DZW50ZXInKTtcbmNvbnN0IHJhZGlhbnNGcm9tQ2VudGVyID0gcmVxdWlyZSgnLi91dGlscy9yYWRpYW5zRnJvbUNlbnRlcicpO1xuY29uc3Qgc2NhbGVQb2ludHMgPSByZXF1aXJlKCcuL3V0aWxzL3NjYWxlUG9pbnRzJyk7XG5jb25zdCB0cmFuc2xhdGVQb2ludHMgPSByZXF1aXJlKCcuL3V0aWxzL3RyYW5zbGF0ZVBvaW50cycpO1xuY29uc3QgaW5zaWRlQ2FudmFzID0gcmVxdWlyZSgnLi91dGlscy9pbnNpZGVDYW52YXMnKTtcblxuXG4vKipcbiAqIE1hdGggdXRpbGl0eSBsaWJyYXJpZXNcbiAqIEBleHBvcnRzIHV0aWxzXG4gKi9cbmNvbnN0IHV0aWxzID0ge1xuICAvKipcbiAgICogR2V0cyB0aGUgYXZlcmFnZSBwb2ludCB2YWx1ZSBpbiBhbiBhcnJheSBvZiBwb2ludHMuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge0FycmF5fSBwb2ludHNcbiAgICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3Qgd2l0aCB4IGFuZCB5IHZhbHVlc1xuICAgKi9cbiAgYXZlcmFnZVBvaW50cyxcblxuICAvKipcbiAgICogQ29udmVydCBkZWdyZWVzIHRvIHJhaWRhbnNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkZWdyZWVzXG4gICAqIEByZXR1cm4ge051bWJlcn0gQSB2YWx1ZSBpbiByYWRpYW5zXG4gICAqL1xuICBkZWdyZWVzVG9SYWRpYW5zLFxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IHJhZGlhbnMgdG8gZGVncmVlc1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGlhbnNcbiAgICogQHJldHVybiB7TnVtYmVyfSBBIHZhbHVlIGluIGRlZ3JlZXNcbiAgICovXG4gIHJhZGlhbnNUb0RlZ3JlZXMsXG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIHBvaW50IGlzIGluIGEgcG9seWdvblxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IE9iamVjdCB3aXRoIGFuIHggYW5kIHkgdmFsdWVcbiAgICogQHBhcmFtIHtBcnJheX0gcG9seWdvbiBBcnJheSBvZiBwb2ludHNcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgcG9pbnQgaXMgaW5zaWRlIHRoZSBwb2x5Z29uXG4gICAqL1xuICBwb2ludEluUG9seWdvbixcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGlzdGFuY2UgYmV0d2VlbiAyIHBvaW50c1xuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50MSBPYmplY3Qgd2l0aCBhbiB4IGFuZCB5IHZhbHVlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludDIgT2JqZWN0IHdpdGggYW4geCBhbmQgeSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBkaXN0YW5jZVxuICAgKi9cbiAgZGlzdGFuY2UsXG5cbiAgLyoqXG4gICAqIERlZ3JlZXMgYSBwb2ludCBpcyBvZmZzZXQgZnJvbSBhIGNlbnRlciBwb2ludFxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IGNlbnRlciBPYmplY3Qgd2l0aCBhbiB4IGFuZCB5IHZhbHVlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludCBPYmplY3Qgd2l0aCBhbiB4IGFuZCB5IHZhbHVlXG4gICAqIEByZXR1cm4ge051bWJlcn0gQSB2YWx1ZSBpbiBkZWdyZWVzXG4gICAqL1xuICBkZWdyZWVzRnJvbUNlbnRlcixcblxuICAvKipcbiAgICogUmFkaWFucyBhIHBvaW50IGlzIG9mZnNldCBmcm9tIGEgY2VudGVyIHBvaW50XG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gY2VudGVyIE9iamVjdCB3aXRoIGFuIHggYW5kIHkgdmFsdWVcbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IE9iamVjdCB3aXRoIGFuIHggYW5kIHkgdmFsdWVcbiAgICogQHJldHVybiB7TnVtYmVyfSBBIHZhbHVlIGluIHJhZGlhbnNcbiAgICovXG4gIHJhZGlhbnNGcm9tQ2VudGVyLFxuXG4gIC8qKlxuICAgKiBTY2FsZSBhIHBvaW50IG9yIGFycmF5IG9mIHBvaW50cy5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBwb2ludHMgQSBwb2ludCBvciBhcnJheSBvZiBwb2ludHNcbiAgICogQHBhcmFtIHtPYmplY3R9IHNjYWxlIE9iamVjdCB3aXRoIGFuIHggYW5kIHkgdmFsdWVcbiAgICogQHJldHVybiB7T2JqZWN0fEFycmF5fSBBIHNjYWxlZCBwb2ludCBvciBhcnJheSBvZiBwb2ludHNcbiAgICovXG4gIHNjYWxlUG9pbnRzLFxuXG4gIC8qKlxuICAgKiBUcmFuc2xhdGUgYSBwb2ludCBvciBhcnJheSBvZiBwb2ludHNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBwb2ludHMgQSBwb2ludCBvciBhcnJheSBvZiBwb2ludHNcbiAgICogQHBhcmFtIHtPYmplY3R9IG9mZnNldCBPYmplY3Qgd2l0aCBhbiB4IGFuZCB5IHZhbHVlXG4gICAqIEByZXR1cm4ge09iamVjdHxBcnJheX0gQSB0cmFuc2xhdGVkIHBvaW50IG9yIGFycmF5IG9mIHBvaW50c1xuICAgKi9cbiAgdHJhbnNsYXRlUG9pbnRzLFxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIGEgcG9pbnQgaXMgaW5zaWRlIGEgY2FudmFzXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgQSBwb2ludCB0byB0ZXN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjYW52YXMgT2JqZWN0IHdpdGggaGVpZ2h0IGFuZCB3aWR0aCBwcm9wZXJ0aWVzXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgaW5zaWRlIGNhbnZhcyBlbHNlIGZhbHNlXG4gICAqL1xuICBpbnNpZGVDYW52YXNcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdXRpbHM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3V0aWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcbmZ1bmN0aW9uIGF2ZXJhZ2VQb2ludHMocG9pbnRzKXtcbiAgdmFyIHJldFZhbCA9IHt4OiAwLCB5OiAwfTtcbiAgcG9pbnRzLmZvckVhY2gocG9pbnRzLCBmdW5jdGlvbihwb2ludCl7XG4gICAgcmV0VmFsLngrPSBwb2ludC54O1xuICAgIHJldFZhbC55Kz0gcG9pbnQueTtcbiAgfSk7XG4gIHJldFZhbC54ID0gcmV0VmFsLnggLyBwb2ludHMubGVuZ3RoO1xuICByZXRWYWwueSA9IHJldFZhbC55IC8gcG9pbnRzLmxlbmd0aDtcbiAgcmV0dXJuIHJldFZhbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhdmVyYWdlUG9pbnRzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi91dGlscy9hdmVyYWdlUG9pbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCByYWRDb25zdCA9IE1hdGguUEkgLyAxODAuMDtcblxuZnVuY3Rpb24gZGVncmVlc1RvUmFkaWFucyhkZWdyZWVzKXtcbiAgcmV0dXJuIGRlZ3JlZXMgKiByYWRDb25zdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWdyZWVzVG9SYWRpYW5zO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi91dGlscy9kZWdyZWVzVG9SYWRpYW5zLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGRlZ0NvbnN0ID0gMTgwLjAgLyBNYXRoLlBJO1xuXG5mdW5jdGlvbiByYWRpYW5zVG9EZWdyZWVzKHJhZGlhbnMpe1xuICByZXR1cm4gcmFkaWFucyAqIGRlZ0NvbnN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJhZGlhbnNUb0RlZ3JlZXM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3V0aWxzL3JhZGlhbnNUb0RlZ3JlZXMuanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0JztcblxuLy8gVXNpbmcgUmF5LUNhc3RpbmcgZm9ybXVsYSBiYXNlZCBvblxuLy8gaHR0cDovL3d3dy5lY3NlLnJwaS5lZHUvSG9tZXBhZ2VzL3dyZi9SZXNlYXJjaC9TaG9ydF9Ob3Rlcy9wbnBvbHkuaHRtbFxuLy8gYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS9zdWJzdGFjay9wb2ludC1pbi1wb2x5Z29uL1xuLy8gUmUtd3JpdHRlbiBmb3IgbW9zdCByZWFkYWJpbGl0eSBhbmQgZm9yIHVzZSB3aXRoIHBvaW50IG9iamVjdHMgaW5zdGVhZCBvZiBhcnJheXNcblxuZnVuY3Rpb24gcG9pbnRJblBvbHkocG9pbnQsIHBvbHlnb24pe1xuICBpZighcG9pbnQgfHwgIXBvbHlnb24pe1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBwb2x5ID0gcG9seWdvbi5wb2ludHMgfHwgcG9seWdvbjtcblxuICB2YXIgaW5zaWRlUG9seSA9IGZhbHNlO1xuICB2YXIgaiA9IHBvbHkubGVuZ3RoIC0gMTtcblxuICBmb3IodmFyIGkgPSAwOyBpIDwgcG9seS5sZW5ndGg7IGogPSBpKyspe1xuICAgIHZhciB4aSA9IHBvbHlbaV0ueDtcbiAgICB2YXIgeWkgPSBwb2x5W2ldLnk7XG4gICAgdmFyIHhqID0gcG9seVtqXS54O1xuICAgIHZhciB5aiA9IHBvbHlbal0ueTtcblxuICAgIGlmKHlpID4gcG9pbnQueSAhPT0geWogPiBwb2ludC55KXtcbiAgICAgIGlmKHBvaW50LnggPCAoeGogLSB4aSkgKiAocG9pbnQueSAtIHlpKSAvICh5aiAtIHlpKSArIHhpKXtcbiAgICAgICAgaW5zaWRlUG9seSA9ICFpbnNpZGVQb2x5O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbnNpZGVQb2x5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBvaW50SW5Qb2x5O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi91dGlscy9wb2ludEluUG9seWdvbi5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gZGlzdGFuY2UocDEsIHAyKXtcbiAgcmV0dXJuIE1hdGguc3FydCggKChwMi54IC0gcDEueCkgKiAocDIueCAtIHAxLngpKSArICgocDIueSAtIHAxLnkpICogKHAyLnkgLSBwMS55KSkgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkaXN0YW5jZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdXRpbHMvZGlzdGFuY2UuanNcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IHJhZGlhbnNUb0RlZ3JlZXMgPSByZXF1aXJlKCcuL3JhZGlhbnNUb0RlZ3JlZXMnKTtcbmNvbnN0IHJhZGlhbnNGcm9tQ2VudGVyID0gcmVxdWlyZSgnLi9yYWRpYW5zRnJvbUNlbnRlcicpO1xuXG5mdW5jdGlvbiBkZWdyZWVzRnJvbUNlbnRlcihjZW50ZXIsIHB0KXtcbiAgcmV0dXJuIHJhZGlhbnNUb0RlZ3JlZXMocmFkaWFuc0Zyb21DZW50ZXIoY2VudGVyLCBwdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZ3JlZXNGcm9tQ2VudGVyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi91dGlscy9kZWdyZWVzRnJvbUNlbnRlci5qc1xuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBvcmlnaW4gPSB7eDogMC4wLCB5OiAwLjB9O1xuXG5mdW5jdGlvbiByYWRpYW5zRnJvbUNlbnRlcihjZW50ZXIsIHB0KXtcblxuICAvL2lmIG51bGwgb3IgemVybyBpcyBwYXNzZWQgaW4gZm9yIGNlbnRlciwgd2UnbGwgdXNlIHRoZSBvcmlnaW5cbiAgY2VudGVyID0gY2VudGVyIHx8IG9yaWdpbjtcblxuICAvL3NhbWUgcG9pbnRcbiAgaWYoKGNlbnRlci54ID09PSBwdC54KSAmJiAoY2VudGVyLnkgPT09IHB0LnkpKXtcbiAgICByZXR1cm4gMDtcbiAgfWVsc2UgaWYoY2VudGVyLnggPT09IHB0Lngpe1xuICAgIGlmKGNlbnRlci55ID4gcHQueSl7XG4gICAgICByZXR1cm4gMDtcbiAgICB9ZWxzZXtcbiAgICAgIHJldHVybiBNYXRoLlBJO1xuICAgIH1cbiAgfWVsc2UgaWYoY2VudGVyLnkgPT09IHB0Lnkpe1xuICAgIGlmKGNlbnRlci54ID4gcHQueCl7XG4gICAgICByZXR1cm4gMS41ICogTWF0aC5QSTtcbiAgICB9ZWxzZXtcbiAgICAgIHJldHVybiBNYXRoLlBJIC8gMjtcbiAgICB9XG4gIH1lbHNlIGlmKChjZW50ZXIueCA8IHB0LngpICYmIChjZW50ZXIueSA+IHB0LnkpKXtcbiAgICAvL3F1YWRyYW50IDFcbiAgICAvL2NvbnNvbGUubG9nKCdxdWFkMScsY2VudGVyLngsY2VudGVyLnkscHQueCxwdC55LCdvJyxwdC54IC0gY2VudGVyLngsJ2EnLHB0LnkgLSBjZW50ZXIueSk7XG4gICAgcmV0dXJuIE1hdGguYXRhbigocHQueCAtIGNlbnRlci54KS8oY2VudGVyLnkgLSBwdC55KSk7XG4gIH1cbiAgZWxzZSBpZigoY2VudGVyLnggPCBwdC54KSAmJiAoY2VudGVyLnkgPCBwdC55KSl7XG4gICAgLy9xdWFkcmFudCAyXG4gICAgLy9jb25zb2xlLmxvZygncXVhZDInLGNlbnRlci54LGNlbnRlci55LHB0LngscHQueSk7XG4gICAgcmV0dXJuIE1hdGguUEkgLyAyICsgTWF0aC5hdGFuKChwdC55IC0gY2VudGVyLnkpLyhwdC54IC0gY2VudGVyLngpKTtcbiAgfVxuICBlbHNlIGlmKChjZW50ZXIueCA+IHB0LngpICYmIChjZW50ZXIueSA8IHB0LnkpKXtcbiAgICAvL3F1YWRyYW50IDNcbiAgICAvL2NvbnNvbGUubG9nKCdxdWFkMycsY2VudGVyLngsY2VudGVyLnkscHQueCxwdC55KTtcbiAgICByZXR1cm4gTWF0aC5QSSArIE1hdGguYXRhbigoY2VudGVyLnggLSBwdC54KS8ocHQueSAtIGNlbnRlci55KSk7XG4gIH1cbiAgZWxzZXtcbiAgICAvL3F1YWRyYW50IDRcbiAgICAvL2NvbnNvbGUubG9nKCdxdWFkNCcsY2VudGVyLngsY2VudGVyLnkscHQueCxwdC55KTtcbiAgICByZXR1cm4gMS41ICogTWF0aC5QSSArIE1hdGguYXRhbigoY2VudGVyLnkgLSBwdC55KS8oY2VudGVyLnggLSBwdC54KSk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJhZGlhbnNGcm9tQ2VudGVyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi91dGlscy9yYWRpYW5zRnJvbUNlbnRlci5qc1xuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXG5mdW5jdGlvbiBzY2FsZVBvaW50cyhwb2ludHMsIHNjYWxlKXtcbiAgaWYoQXJyYXkuaXNBcnJheShwb2ludHMpKXtcbiAgICBwb2ludHMgPSBwb2ludHMubWFwKGZ1bmN0aW9uKHBvaW50KXtcbiAgICAgIHJldHVybiBzY2FsZVBvaW50cyhwb2ludCwgc2NhbGUpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYodHlwZW9mIHNjYWxlID09PSAnb2JqZWN0Jyl7XG4gICAgcG9pbnRzID0ge1xuICAgICAgeDogcG9pbnRzLnggKiBzY2FsZS54LFxuICAgICAgeTogcG9pbnRzLnkgKiBzY2FsZS55XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBwb2ludHMgPSB7XG4gICAgICB4OiBwb2ludHMueCAqIHNjYWxlLFxuICAgICAgeTogcG9pbnRzLnkgKiBzY2FsZVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHBvaW50cztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzY2FsZVBvaW50cztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdXRpbHMvc2NhbGVQb2ludHMuanNcbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlxuZnVuY3Rpb24gdHJhbnNsYXRlUG9pbnRzKHBvaW50cywgdHJhbnNsYXRpb24pe1xuICBpZihBcnJheS5pc0FycmF5KHBvaW50cykpe1xuICAgIHBvaW50cyA9IHBvaW50cy5tYXAoZnVuY3Rpb24ocG9pbnQpe1xuICAgICAgcmV0dXJuIHRyYW5zbGF0ZVBvaW50cyhwb2ludCwgdHJhbnNsYXRpb24pO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHBvaW50cyA9IHtcbiAgICAgIHg6IHBvaW50cy54LFxuICAgICAgeTogcG9pbnRzLnlcbiAgICB9O1xuXG4gICAgaWYodHJhbnNsYXRpb24ueCAhPSBudWxsKXtcbiAgICAgIHBvaW50cy54ICs9IHRyYW5zbGF0aW9uLng7XG4gICAgfVxuXG4gICAgaWYodHJhbnNsYXRpb24ueSAhPSBudWxsKXtcbiAgICAgIHBvaW50cy55ICs9IHRyYW5zbGF0aW9uLnk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwb2ludHM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhbnNsYXRlUG9pbnRzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi91dGlscy90cmFuc2xhdGVQb2ludHMuanNcbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhlIFNwcml0ZSBjbGFzcyByZXByZXNlbnRzIGEgc2ltcGxlIGFuaW1hdGVkIGNoYXJhY3RlciBmb3IgYSBnYW1lXG4gKiBAbmFtZSBTcHJpdGVcbiAqIEBjb25zdHJ1Y3RvciBTcHJpdGVcbiAqL1xuXG5jbGFzcyBTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pe1xuXG4gICAgLyoqXG4gICAgICogVGhlIHggcG9zaXRpb24gb2YgdGhlIHNwcml0ZSBpbiBwaXhlbHNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBTcHJpdGUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLnggPSAwLjA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeSBwb3NpdGlvbiBvZiB0aGUgc3ByaXRlIGluIHBpeGVsc1xuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlck9mIFNwcml0ZSNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMueSA9IDAuMDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB4IGNvbXBvbmVudCBvZiB0aGUgdmVsb2NpdHkgaW4gcGl4ZWxzIHBlciBzZWNvbmRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBTcHJpdGUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmR4ID0gMC4wO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHkgY29tcG9uZW50IG9mIHRoZSB2ZWxvY2l0eSBpbiBwaXhlbHMgcGVyIHNlY29uZFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlck9mIFNwcml0ZSNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuZHkgPSAwLjA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWF4IHNwZWVkIGEgc3ByaXRlIGNhbiBtb3ZlIGluIGVpdGhlciBkaXJlY3Rpb25cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBTcHJpdGUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLm1heFNwZWVkID0gMC4wO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhpcyBTcHJpdGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBtZW1iZXJPZiBTcHJpdGUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJhZGl1cyBvZiB0aGlzIHNwcml0ZSBpbiBwaXhlbHMgZm9yIHNpbXBsZSBjb2xsaXNpb24gZGV0ZWN0aW9uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgU3ByaXRlI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5jb2xsaXNpb25SYWRpdXMgPSA0MDtcblxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGlzIFNwcml0ZSdzIEFuaW1hdGlvbiBhbmQgaXRzIHBvc2l0aW9uIGJhc2VkIG9uIHRoZSB2ZWxvY2l0eS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBTcHJpdGUjXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBlbGFwc2VkVGltZSBUaGUgZWxhcHNlZCB0aW1lIGluIG1pbGxpc2Vjb25kcyBzaW5jZSB0aGUgcHJldmlvdXMgdXBkYXRlXG4gICAqL1xuICB1cGRhdGUoZWxhcHNlZFRpbWUpe1xuICAgIHRoaXMueCArPSB0aGlzLmR4ICogZWxhcHNlZFRpbWU7XG4gICAgdGhpcy55ICs9IHRoaXMuZHkgKiBlbGFwc2VkVGltZTtcbiAgICB0aGlzLmFuaW0udXBkYXRlKGVsYXBzZWRUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtYXhTcGVlZCB1cCB0byB0aGUgc3BlZWQgbGltaXRcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBTcHJpdGUjXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2IFNwZWVkIGxpbWl0XG4gICAqIEByZXR1cm4ge051bWJlcn0gbWF4U3BlZWQgdXAgdG8gc3BlZWQgbGltaXRcbiAgICovXG4gIGxpbWl0U3BlZWQodil7XG4gICAgaWYodGhpcy5tYXhTcGVlZCl7XG4gICAgICBpZihNYXRoLmFicyh2KSA+IHRoaXMubWF4U3BlZWQpe1xuICAgICAgICBpZih2ID4gMCl7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubWF4U3BlZWQ7XG4gICAgICAgIH1lbHNlIGlmKHYgPCAwKXtcbiAgICAgICAgICByZXR1cm4gdGhpcy5tYXhTcGVlZDtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgcmV0dXJuICAwO1xuICAgICAgICB9XG4gICAgICB9ZWxzZXtcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgICB9XG4gICAgfWVsc2V7XG4gICAgICByZXR1cm4gdjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGlzIFNwcml0ZSdzIGN1cnJlbnQgYW5pbWF0aW9uIGZyYW1lLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIFNwcml0ZSNcbiAgICogQHJldHVybiB7QW5pbWF0aW9uRnJhbWV9IFRoZSBjdXJyZW50IGZyYW1lIG9mIHRoZSBBbmltYXRpb25cbiAgICovXG4gIGdldEN1cnJlbnRGcmFtZSgpe1xuICAgIGlmKHRoaXMuYW5pbSl7XG4gICAgICByZXR1cm4gdGhpcy5hbmltLmdldEN1cnJlbnRGcmFtZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyB0aGUgc3ByaXRlXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgU3ByaXRlI1xuICAgKiBAcGFyYW0ge0NvbnRleHR9IGNvbnRleHQgVGhlIEhUTUw1IGRyYXdpbmcgY29udGV4dFxuICAgKi9cbiAgZHJhdyhjb250ZXh0KXtcbiAgICBpZih0aGlzLmFuaW0pe1xuICAgICAgdGhpcy5hbmltLmRyYXcoY29udGV4dCwgdGhpcy54LCB0aGlzLnkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9uZXMgdGhlIGluc3RhbmNlIG9mIFNwcml0ZSBpdCBpcyBjYWxsZWQgdXBvblxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIFNwcml0ZSNcbiAgICogQHJldHVybiB7U3ByaXRlfSBBIGNsb25lIG9mIHRoZSBTcHJpdGVcbiAgICovXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgU3ByaXRlKHtcbiAgICAgIGFuaW06IHRoaXMuYW5pbS5jbG9uZSgpXG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGU7XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vU3ByaXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRoaXMgdHlwZSBvZiBzcHJpdGUgaXMgYmFzZWQgb2ZmIG9mIHRoZSBleGNlbGxlbnQgaW1hZ2VzIGZyb20gUmVpbmVyJ3MgdGlsZXNldHM6IGh0dHA6Ly93d3cucmVpbmVyc3RpbGVzZXRzLmRlL1xuICogPGJyPlxuICogY3JlYXR1cmVzIGhhdmUgd2Fsa2luZywgaWRsZSwgYW5kIGR5aW5nIGFuaW1hdGlvbnMgaW4gOCBpc29tZXRyaWMgZGlyZWN0aW9uc1xuICogVGhlIGFuaW1hdGlvbnMgZGlyZWN0aW9ucyBhcmUgaW4gRSxOLE5FLE5XLFMsU0UsU1csVyAoYWxwaGFiZXRpY2FsKSBvcmRlciBzaW1wbHkgYmVjYXVzZSB0aGF0J3NcbiAqIGhvdyB0aGV5IHdlcmUgc3RpdGNoZWQgdG9nZXRoZXIgdXNpbmcgSW1hZ2VNYWdpY2suXG4gKlxuICogQG5hbWUgQ3JlYXR1cmVcbiAqIEBjb25zdHJ1Y3RvciBDcmVhdHVyZVxuICogQGV4dGVuZHMgU3ByaXRlXG4gKi9cblxuY29uc3QgU3ByaXRlID0gcmVxdWlyZSgnLi4vU3ByaXRlJyk7XG5jb25zdCBBbmltYXRpb24gPSByZXF1aXJlKCcuLi9BbmltYXRpb24nKTtcblxuXG4vKipcbiogQSBtYXAgb2Ygc3RhdGljIGNvbnN0YW50cyBmb3IgaW50ZXJuYWwgdXNlXG4qIEB0eXBlIHtPYmplY3R9XG4qIEBtZW1iZXJPZiBDcmVhdHVyZSNcbiogQHByb3BlcnR5IHtOdW1iZXJ9IEVBU1QgYSBkaXJlY3Rpb24gdGhlIGNyZWF0dXJlIGNhbiBmYWNlXG4qIEBwcm9wZXJ0eSB7TnVtYmVyfSBOT1JUSCBhIGRpcmVjdGlvbiB0aGUgY3JlYXR1cmUgY2FuIGZhY2VcbiogQHByb3BlcnR5IHtOdW1iZXJ9IE5PUlRIRUFTVCBhIGRpcmVjdGlvbiB0aGUgY3JlYXR1cmUgY2FuIGZhY2VcbiogQHByb3BlcnR5IHtOdW1iZXJ9IE5PUlRIV0VTVCBhIGRpcmVjdGlvbiB0aGUgY3JlYXR1cmUgY2FuIGZhY2VcbiogQHByb3BlcnR5IHtOdW1iZXJ9IFNPVVRIIGEgZGlyZWN0aW9uIHRoZSBjcmVhdHVyZSBjYW4gZmFjZVxuKiBAcHJvcGVydHkge051bWJlcn0gU09VVEhFQVNUIGEgZGlyZWN0aW9uIHRoZSBjcmVhdHVyZSBjYW4gZmFjZVxuKiBAcHJvcGVydHkge051bWJlcn0gU09VVEhXRVNUIGEgZGlyZWN0aW9uIHRoZSBjcmVhdHVyZSBjYW4gZmFjZVxuKiBAcHJvcGVydHkge051bWJlcn0gV0VTVCBhIGRpcmVjdGlvbiB0aGUgY3JlYXR1cmUgY2FuIGZhY2VcbiogQHByb3BlcnR5IHtOdW1iZXJ9IFNUQVRFX1dBTEtJTkcgYSBzdGF0ZSB0aGUgY3JlYXR1cmUgY2FuIGJlIGluXG4qIEBwcm9wZXJ0eSB7TnVtYmVyfSBTVEFURV9EWUlORyBhIHN0YXRlIHRoZSBjcmVhdHVyZSBjYW4gYmUgaW5cbiogQHByb3BlcnR5IHtOdW1iZXJ9IFNUQVRFX0lETEUgYSBzdGF0ZSB0aGUgY3JlYXR1cmUgY2FuIGJlIGluXG4qL1xuY29uc3QgRUFTVCA9IDA7XG5jb25zdCBOT1JUSCA9IDE7XG5jb25zdCBOT1JUSEVBU1QgPSAyO1xuY29uc3QgTk9SVEhXRVNUID0gMztcbmNvbnN0IFNPVVRIID0gNDtcbmNvbnN0IFNPVVRIRUFTVCA9IDU7XG5jb25zdCBTT1VUSFdFU1QgPSA2O1xuY29uc3QgV0VTVCA9IDc7XG5jb25zdCBTVEFURV9XQUxLSU5HID0gMDtcbmNvbnN0IFNUQVRFX0RZSU5HID0gMTtcbmNvbnN0IFNUQVRFX0lETEUgPSAyO1xuXG5cbmNsYXNzIENyZWF0dXJlIGV4dGVuZHMgU3ByaXRlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KXtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICogVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGNyZWF0dXJlLiBXaWxsIGJlIGEgdmFsdWUgZnJvbSB0aGUgc3RhdGljIGNvbnN0YW50cy5cbiAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgKiBAbWVtYmVyT2YgQ3JlYXR1cmUjXG4gICAgKiBAZGVmYXVsdFxuICAgICovXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFX0lETEU7XG5cbiAgICAvKipcbiAgICAqIEFuIGFycmF5IG9mIEFuaW1hdGlvbiBvYmplY3RzIChvbmUgZm9yIGVhY2ggZGlyZWN0aW9uKSB0byBkaXNwbGF5IHRoZSBjcmVhdHVyZSBpbiBhIHdhbGtpbmcgc3RhdGVcbiAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAqIEBtZW1iZXJPZiBDcmVhdHVyZSNcbiAgICAqIEBkZWZhdWx0XG4gICAgKi9cbiAgICB0aGlzLndhbGtpbmdBbmltcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgKiBBbiBhcnJheSBvZiBBbmltYXRpb24gb2JqZWN0cyAob25lIGZvciBlYWNoIGRpcmVjdGlvbikgdG8gZGlzcGxheSB0aGUgY3JlYXR1cmUgaW4gYSBkeWluZyBzdGF0ZVxuICAgICogQHR5cGUge0FycmF5fVxuICAgICogQG1lbWJlck9mIENyZWF0dXJlI1xuICAgICogQGRlZmF1bHRcbiAgICAqL1xuICAgIHRoaXMuZHlpbmdBbmltcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgKiBBbiBhcnJheSBvZiBBbmltYXRpb24gb2JqZWN0cyAob25lIGZvciBlYWNoIGRpcmVjdGlvbikgdG8gZGlzcGxheSB0aGUgY3JlYXR1cmUgaW4gYW4gaWRsZSBzdGF0ZVxuICAgICogQHR5cGUge0FycmF5fVxuICAgICogQG1lbWJlck9mIENyZWF0dXJlI1xuICAgICogQGRlZmF1bHRcbiAgICAqL1xuICAgIHRoaXMuaWRsZUFuaW1zID0gW107XG5cbiAgICAvKipcbiAgICAqIFRoZSBjdXJyZW50IGRpcmVjdGlvbiB0aGF0IHRoZSBjcmVhdHVyZSBpcyBwb2ludGVkLiBXaWxsIGJlIGEgdmFsdWUgZnJvbSB0aGUgc3RhdGljIGNvbnN0YW5zdHMuXG4gICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICogQG1lbWJlck9mIENyZWF0dXJlI1xuICAgICogQGRlZmF1bHRcbiAgICAqL1xuICAgIHRoaXMuZGlyZWN0aW9uID0gRUFTVDtcblxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGlzIGNyZWF0dXJlJ3MgY3VycmVudCBkaXJlY3Rpb24gKGZyYW1lKSwgYW5kIGNoYW5nZXMgd2hpY2ggYW5pbWF0aW9uIGl0IHNob3VsZCBiZSB1c2luZyBpZiBuZWNjZXNhcnkuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQ3JlYXR1cmUjXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBlbGFwc2VkVGltZSBFbGFwc2VkIHRpbWUgaW4gbWlsbGlzZWNvbmRzXG4gICAqL1xuICB1cGRhdGVEaXJlY3Rpb24oZWxhcHNlZFRpbWUpe1xuICAgIHRoaXMueCArPSB0aGlzLmR4ICogZWxhcHNlZFRpbWU7XG4gICAgdGhpcy55ICs9IHRoaXMuZHkgKiBlbGFwc2VkVGltZTtcblxuICAgIGlmKHRoaXMuc3RhdGUgIT09IHRoaXMuc3RhdGljcy5TVEFURV9EWUlORyl7XG4gICAgICBpZih0aGlzLmR4ID4gMCAmJiB0aGlzLmR5ID09PSAwKXtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLnN0YXRpY3MuRUFTVDtcbiAgICAgIH0gZWxzZSBpZih0aGlzLmR4ID09PSAwICYmIHRoaXMuZHkgPCAwKXtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLnN0YXRpY3MuTk9SVEg7XG4gICAgICB9IGVsc2UgaWYodGhpcy5keCA+IDAgJiYgdGhpcy5keSA8IDApe1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IHRoaXMuc3RhdGljcy5OT1JUSEVBU1Q7XG4gICAgICB9IGVsc2UgaWYodGhpcy5keCA8IDAgJiYgdGhpcy5keSA8IDApe1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IHRoaXMuc3RhdGljcy5OT1JUSFdFU1Q7XG4gICAgICB9IGVsc2UgaWYodGhpcy5keCA9PT0gMCAmJiB0aGlzLmR5ID4gMCl7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gdGhpcy5zdGF0aWNzLlNPVVRIO1xuICAgICAgfSBlbHNlIGlmKHRoaXMuZHggPiAwICYmIHRoaXMuZHkgPiAwKXtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLnN0YXRpY3MuU09VVEhFQVNUO1xuICAgICAgfSBlbHNlIGlmKHRoaXMuZHggPCAwICYmIHRoaXMuZHkgPiAwKXtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLnN0YXRpY3MuU09VVEhXRVNUO1xuICAgICAgfSBlbHNlIGlmKHRoaXMuZHggPCAwICYmIHRoaXMuZHkgPT09IDApe1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IHRoaXMuc3RhdGljcy5XRVNUO1xuICAgICAgfVxuXG4gICAgICBpZih0aGlzLmR4ID09PSAwICYmIHRoaXMuZHkgPT09IDApe1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0aWNzLlNUQVRFX0lETEU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGF0aWNzLlNUQVRFX1dBTEtJTkc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhpcyBjcmVhdHVyZSdzIGN1cnJlbnQgYW5pbWF0aW9uLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIENyZWF0dXJlI1xuICAgKiBAcGFyYW0ge051bWJlcn0gZWxhcHNlZFRpbWUgRWxhcHNlZCB0aW1lIGluIG1pbGxpc2Vjb25kc1xuICAgKi9cbiAgdXBkYXRlQW5pbWF0aW9ucyhlbGFwc2VkVGltZSl7XG4gICAgaWYodGhpcy5zdGF0ZSA9PT0gdGhpcy5zdGF0aWNzLlNUQVRFX1dBTEtJTkcpe1xuICAgICAgdGhpcy5hbmltID0gdGhpcy53YWxraW5nQW5pbXNbdGhpcy5kaXJlY3Rpb25dO1xuICAgIH0gZWxzZSBpZih0aGlzLnN0YXRlID09PSB0aGlzLnN0YXRpY3MuU1RBVEVfRFlJTkcpe1xuICAgICAgdGhpcy5hbmltID0gdGhpcy5keWluZ0FuaW1zW3RoaXMuZGlyZWN0aW9uXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hbmltID0gdGhpcy5pZGxlQW5pbXNbdGhpcy5kaXJlY3Rpb25dO1xuICAgIH1cbiAgICB0aGlzLmFuaW0udXBkYXRlKGVsYXBzZWRUaW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIHRvIGNyZWF0ZSBhbmltYXRpb25zIGZyb20gYSBzaGVldCBvZiB0aWxlc1xuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIENyZWF0dXJlI1xuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGZyYW1lQ291bnQgTnVtYmVyIG9mIGZyYW1lcyBpbiB0aGUgYW5pbWF0aW9uXG4gICAqIEBwYXJhbSAge051bWJlcnxBcnJheX0gZnJhbWVUaW1lcyBWYWx1ZSBvciBhcnJheSBvZiB2YWx1ZXMgY29ycmVzcG9uZGluZyB0byBhbW91bnQgb2YgdGltZSBwZXIgZnJhbWVcbiAgICogQHBhcmFtICB7SW1hZ2V9IGltZyBJbWFnZSBzaGVldCB0byBjcmVhdGUgYW5pbWF0aW9uIGZyb21cbiAgICogQHBhcmFtICB7TnVtYmVyfSB3IFdpZHRoIG9mIGVhY2ggdGlsZSBpbiBwaXhlbHNcbiAgICogQHBhcmFtICB7TnVtYmVyfSBoIEhlaWdodCBvZiBlYWNoIHRpbGUgaW4gcGl4ZWxzXG4gICAqIEBwYXJhbSAge051bWJlcn0geVNsb3QgU2xvdCBvbiBZIGF4aXMgdG8gc3RhcnQgY3JlYXRpbmcgdGlsZXNcbiAgICogQHJldHVybiB7QXJyYXl9IEFycmF5IG9mIEFuaW1hdGlvbnMgZ2VuZXJhdGVkIHVzaW5nIHBhcmFtZXRlcnNcbiAgICovXG4gIGNyZWF0ZUFuaW1hdGlvbnMoZnJhbWVDb3VudCwgZnJhbWVUaW1lcywgaW1nLCBoLCB3LCB5U2xvdCl7XG4gICAgdmFyIGFuaW1zID0gW107XG4gICAgdmFyIGlzRlRBcnJheSA9IEFycmF5LmlzQXJyYXkoZnJhbWVUaW1lcyk7XG4gICAgdmFyIGN1cnJlbnRGcmFtZVRpbWUgPSAxO1xuICAgIGlmKCF5U2xvdCl7XG4gICAgICB5U2xvdCA9IDA7XG4gICAgfVxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCA4OyBpKyspe1xuICAgICAgYW5pbXNbaV0gPSBuZXcgQW5pbWF0aW9uKHtcbiAgICAgICAgaGVpZ2h0OiBoLFxuICAgICAgICB3aWR0aDogdyxcbiAgICAgICAgaW1hZ2U6IGltZ1xuICAgICAgfSk7XG4gICAgICBmb3IodmFyIGogPSAwOyBqIDwgZnJhbWVDb3VudDsgaisrKXtcbiAgICAgICAgaWYoaXNGVEFycmF5KXtcbiAgICAgICAgICBjdXJyZW50RnJhbWVUaW1lID0gZnJhbWVUaW1lc1tqXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXJyZW50RnJhbWVUaW1lID0gZnJhbWVUaW1lcztcbiAgICAgICAgfVxuICAgICAgICBhbmltc1tpXS5hZGRGcmFtZShjdXJyZW50RnJhbWVUaW1lLCBqICsgZnJhbWVDb3VudCAqIGksIHlTbG90KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFuaW1zO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ3JlYXR1cmU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3JlaW5lci9DcmVhdHVyZS5qc1xuLy8gbW9kdWxlIGlkID0gMjhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBDaXJjbGUgPSByZXF1aXJlKCcuL2VudGl0aWVzL0NpcmNsZScpO1xuY29uc3QgTXVsdGlQb2x5Z29uID0gcmVxdWlyZSgnLi9lbnRpdGllcy9NdWx0aVBvbHlnb24nKTtcbmNvbnN0IFBvbHlnb24gPSByZXF1aXJlKCcuL2VudGl0aWVzL1BvbHlnb24nKTtcbmNvbnN0IFJlY3RhbmdsZSA9IHJlcXVpcmUoJy4vZW50aXRpZXMvUmVjdGFuZ2xlJyk7XG5cbnZhciBlbnRpdGllcyA9IHtcbiAgQ2lyY2xlLFxuICBNdWx0aVBvbHlnb24sXG4gIFBvbHlnb24sXG4gIFJlY3RhbmdsZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbnRpdGllcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYm94MmQvZW50aXRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhpcyByZXByZXNlbnRzIGEgQ2lyY2xlIGJvZHkgYW5kIHNoYXBlIGluIGEgQm94MmQgd29ybGRcbiAqIEBuYW1lIENpcmNsZVxuICogQGNvbnN0cnVjdG9yIENpcmNsZVxuICogQGV4dGVuZHMgRW50aXR5XG4gKi9cblxuY29uc3QgRW50aXR5ID0gcmVxdWlyZSgnLi9FbnRpdHknKTtcbmNvbnN0IGRpc3RhbmNlID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvZGlzdGFuY2UnKTtcblxuY2xhc3MgQ2lyY2xlIGV4dGVuZHMgRW50aXR5e1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pe1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJhZGl1cyBvZiB0aGlzIGNpcmNsZS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBDaXJjbGUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLnJhZGl1cyA9IDE7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERyYXdzIHRoZSBDaXJjbGUgYXQgYSBnaXZlbiBzY2FsZVxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIENpcmNsZSNcbiAgICogQHBhcmFtIHtDb250ZXh0fSBjdHggVGhlIGRyYXdpbmcgY29udGV4dFxuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgVGhlIHNjYWxlIGF0IHdoaWNoIHRvIGRyYXdcbiAgICovXG4gIGRyYXcoY3R4LCBzY2FsZSl7XG4gICAgc2NhbGUgPSBzY2FsZSB8fCB0aGlzLnNjYWxlIHx8IDE7XG4gICAgdmFyIG9nTGluZVdpZHRoID0gY3R4LmxpbmVXaWR0aDtcbiAgICBjdHgubGluZVdpZHRoID0gdGhpcy5saW5lV2lkdGg7XG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbFN0eWxlO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuc3Ryb2tlU3R5bGU7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmModGhpcy54ICogc2NhbGUsIHRoaXMueSAqIHNjYWxlLCB0aGlzLnJhZGl1cyAqIHNjYWxlLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnN0cm9rZSgpO1xuXG4gICAgaWYoIXRoaXMuc3RhdGljQm9keSl7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLnggKiBzY2FsZSwgdGhpcy55ICogc2NhbGUpO1xuICAgICAgY3R4LnJvdGF0ZSh0aGlzLmFuZ2xlKTtcbiAgICAgIGN0eC50cmFuc2xhdGUoLSh0aGlzLngpICogc2NhbGUsIC0odGhpcy55KSAqIHNjYWxlKTtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8odGhpcy54ICogc2NhbGUsIHRoaXMueSAqIHNjYWxlKTtcbiAgICAgIGN0eC5saW5lVG8odGhpcy54ICogc2NhbGUsICh0aGlzLnkgKiBzY2FsZSkgLSAodGhpcy5yYWRpdXMgKiBzY2FsZSkpO1xuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gICAgY3R4LmxpbmVXaWR0aCA9IG9nTGluZVdpZHRoO1xuXG4gICAgc3VwZXIuZHJhdyhjdHgsIHNjYWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY2FsZSB0aGlzIHNoYXBlXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQ2lyY2xlI1xuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgVGhlIGFtb3VudCB0aGUgc2hhcGUgc2hvdWxkIHNjYWxlXG4gICAqL1xuICBzY2FsZVNoYXBlKHNjYWxlKXtcbiAgICB0aGlzLnJhZGl1cyA9IHRoaXMucmFkaXVzICogc2NhbGU7XG4gICAgc3VwZXIuc2NhbGVTaGFwZShzY2FsZSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBnaXZlbiBwb2ludCBpcyBjb250YWluZWQgd2l0aGluIHRoaXMgQ2lyY2xlLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIENpcmNsZSNcbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IEFuIG9iamVjdCB3aXRoIHggYW5kIHkgdmFsdWVzLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIHBvaW50IGlzIGluIHNoYXBlIGVsc2UgZmFsc2VcbiAgICovXG4gIHBvaW50SW5TaGFwZShwb2ludCl7XG4gICAgcmV0dXJuIChkaXN0YW5jZShwb2ludCwgdGhpcykgPD0gdGhpcy5yYWRpdXMpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDaXJjbGU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2JveDJkL2VudGl0aWVzL0NpcmNsZS5qc1xuLy8gbW9kdWxlIGlkID0gMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gZ2VuSWQoKSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpICsgJ18nICsgRGF0ZS5ub3coKTtcbn1cblxuLyoqXG4gKiBUaGlzIHJlcHJlc2VudHMgYSBib2R5IGFuZCBzaGFwZSBpbiBhIEJveDJkIHdvcmxkIHVzaW5nIHBvc2l0aW9ucyBhbmQgc2l6ZXMgcmVsYXRpdmUgdG8gdGhlIEJveDJkIHdvcmxkIGluc3RhbmNlLlxuICogQG5hbWUgRW50aXR5XG4gKiBAY29uc3RydWN0b3IgRW50aXR5XG4gKi9cblxuY2xhc3MgRW50aXR5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KXtcblxuICAgIC8qKlxuICAgICAqIFRoZSBpZCBpbiB3aGljaCB0byByZWZlcmVuY2UgdGhpcyBvYmplY3QuIEFsc28gdGhlIHVzZXJEYXRhIHByb3BlcnR5IGZvciBib3gyZCBib2RpZXMuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgRW50aXR5I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgIHRoaXMuaWQgPSBvcHRpb25zLmlkIHx8IGdlbklkKCk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeCBjb21wb25lbnQgb2YgdGhlIGVudGl0eSdzIGxvY2F0aW9uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgRW50aXR5I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgIHRoaXMueCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeSBjb21wb25lbnQgb2YgdGhlIGVudGl0eSdzIGxvY2F0aW9uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgRW50aXR5I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgIHRoaXMueSA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc2NhbGUgaW4gcGl4ZWxzIHBlciBtZXRlciBpbiB3aGljaCB0byByZXByZXNlbnQgdGhpcyBFbnRpdHkgaW4gdGhlIGJveDJkIHdvcmxkXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgRW50aXR5I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgIHRoaXMuc2NhbGUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgYW5nbGUgdGhhdCB0aGlzIGVudGl0eSBpcyByb3RhdGVkIGF0XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgRW50aXR5I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgIHRoaXMuYW5nbGUgPSAwO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHggYW5kIHkgbG9jYXRpb25zIG9mIHdoYXQgYm94MmQgY29uc2lkZXJzIHRoZSBlbml0eSdzIGNlbnRlciBvZiBtYXNzXG4gICAgICogQHR5cGUge1BvaW50fVxuICAgICAqIEBtZW1iZXJPZiBFbnRpdHkjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICAgdGhpcy5jZW50ZXIgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBkcmF3IHRoZSBjZW50ZXIgcG9pbnQgb2YgYW4gZW50aXR5XG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG1lbWJlck9mIEVudGl0eSNcbiAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICovXG4gICAgIHRoaXMuZHJhd0NlbnRlciA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGVyY2VudGFnZSBvZiBmb3JjZSBpbiB3aGljaCB0aGUgZW50aXR5IHdpbGwgYm91bmNlIGJhY2sgZnJvbSBhbm90aGVyIGJhc2VkIG9uIGl0cyBmb3JjZSBwcmUtY29sbGlzaW9uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgRW50aXR5I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgIHRoaXMucmVzdGl0dXRpb24gPSAwLjM7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdHdvLWRpbWVuc2lvbmFsIGRlbnNpdHkgb2YgdGhlIGVudGl0eS4gIE1hc3MgLyBhcmVhLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlck9mIEVudGl0eSNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgICB0aGlzLmRlbnNpdHkgPSAxLjA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIGZyaWN0aW9uIG9uIHRoIHN1cmZhY2Ugb2YgdGhpcyBlbnRpdHlcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBFbnRpdHkjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICAgdGhpcy5mcmljdGlvbiA9IDAuOTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgbGluZWFyIHZlbG9jaXR5IHRoZSBlbnRpdHkgc2hvdWxkIGxvc2Ugb3ZlciB0aW1lXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgRW50aXR5I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgIHRoaXMubGluZWFyRGFtcGluZyA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdmVsb2NpdHkgaW4gbWV0ZXJzL3NlY29uZCBnaXZlbiB0byB0aGlzIGVudGl0eSBieSBib3gyZCBjYWxjdWxhdGlvbnNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBFbnRpdHkjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICAgdGhpcy5saW5lYXJWZWxvY2l0eSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW5ndWxhciB2ZWxvY2l0eSBpbiByYWRpYW5zL3NlY29uZCBnaXZlbiB0byB0aGlzIGVudGl0eSBieSBib3gyZCBjYWxjdWxhdGlvbnNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBFbnRpdHkjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICAgdGhpcy5hbmd1bGFyVmVsb2NpdHkgPSAwO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG9mIGFtb3VudCBvZiBhbmd1bGFyIHZlbG9jaXR5IGFuIGVudGl0eSBzaG91bGQgbG9zZSBvdmVyIHRpbWVcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBFbnRpdHkjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICAgdGhpcy5hbmd1bGFyRGFtcGluZyA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBJZiB0cnVlLCB0aGUgZW50aXR5IGRvZXMgY2hhbmdlIGl0cyBwb3NpdGlvbiBhbmQgYW5nbGUgYXMgdGhlIHJlc3VsdCBvZiBib3gyZCBjYWxjdWxhdGlvbnNcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbWVtYmVyT2YgRW50aXR5I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgIHRoaXMuc3RhdGljQm9keSA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGZpbGxTdHlsZSB0byB1c2UgZm9yIHRoZSBlbnRpdHkncyBkZWZhdWx0IHJlbmRlcmVyXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAbWVtYmVyT2YgRW50aXR5I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgIHRoaXMuZmlsbFN0eWxlID0gJ3JnYmEoMTI4LDEyOCwxMjgsMC41KSc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc3Ryb2tlU3R5bGUgdG8gdXNlIGZvciB0aGUgZW50aXR5J3MgZGVmYXVsdCByZW5kZXJlclxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQG1lbWJlck9mIEVudGl0eSNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgICB0aGlzLnN0cm9rZVN0eWxlID0gJyMwMDAnO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGxpbmUgd2lkdGggdG8gdXNlIGZvciB0aGUgZW50aXR5J3MgZGVmYXVsdCByZW5kZXJlclxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlck9mIEVudGl0eSNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgICB0aGlzLmxpbmVXaWR0aCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgMTYgYml0IGludGVnZXIgdXNlZCBpbiBkZXRlcm1pbmluZyB3aGljaCBvdGhlciB0eXBlcyBvZiBlbnRpdGllcyB0aGlzIGJvZHkgd2lsbCBjb2xsaWRlIHdpdGguXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgRW50aXR5I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgIHRoaXMubWFza0JpdHMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIDE2IGJpdCBpbnRlZ2VyIHVzZWQgaW4gZGVzY3JpYmluZyB0aGUgdHlwZSB0aGF0IHRoaXMgZW5pdGl0eSBpcyBmb3IgY29sbGlzaW9ucy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBFbnRpdHkjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICAgdGhpcy5jYXRlZ29yeUJpdHMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIDE2IGJpdCBpbnRlZ2VyIHVzZWQgaW4gb3ZlcmlkaW5nIG1hc2tCaXRzIGFuZCBjYXRlZ29yeUJpdHMgZm9yIGNvbGxpc2lvbiBkZXRlY3Rpb24uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgRW50aXR5I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgIHRoaXMuZ3JvdXBJbmRleCA9IG51bGw7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGlzIGVudGl0eSB3aXRoIHRoZSBzdGF0ZSBwYXNzZWQgaW5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBFbnRpdHkjXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSBTdGF0ZSB0byBtZXJnZSB3aXRoIHRoaXMgb2JqZWN0XG4gICAqL1xuICB1cGRhdGUoc3RhdGUpe1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgc3RhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIERyYXdzIHRoZSBFbnRpdHkgYXQgYSBnaXZlbiBzY2FsZVxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIEVudGl0eSNcbiAgICogQHBhcmFtIHtDb250ZXh0fSBjdHggVGhlIEhUTUw1IDJkIGRyYXdpbmcgY29udGV4dFxuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgVGhlIHNjYWxlIHRvIGRyYXcgdGhlIGVudGl0eSBhdFxuICAgKi9cbiAgZHJhdyhjdHgsIHNjYWxlKXtcbiAgICBzY2FsZSA9IHNjYWxlIHx8IHRoaXMuc2NhbGUgfHwgMTtcbiAgICB2YXIgb2dMaW5lV2lkdGggPSBjdHgubGluZVdpZHRoO1xuICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmxpbmVXaWR0aDtcbiAgICAvLyBibGFjayBjaXJjbGUgaW4gZW50aXR5J3MgbG9jYXRpb25cbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5zdHJva2VTdHlsZTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmFyYyh0aGlzLnggKiBzY2FsZSwgdGhpcy55ICogc2NhbGUsIDQsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LmZpbGwoKTtcblxuICAgIC8vIHllbGxvdyBjaXJjbGUgaW4gZW50aXR5J3MgZ2VvbWV0cmljIGNlbnRlclxuICAgIGlmKHRoaXMuY2VudGVyICYmIHRoaXMuZHJhd0NlbnRlcil7XG4gICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jZW50ZXJTdHlsZSB8fCAneWVsbG93JztcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5hcmModGhpcy5jZW50ZXIueCAqIHNjYWxlLCB0aGlzLmNlbnRlci55ICogc2NhbGUsIDIsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcbiAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgIGN0eC5maWxsKCk7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVXaWR0aCA9IG9nTGluZVdpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYWxlcyB0aGUgcG9zaXRpb24gYW5kIGRpbWVuc2lvbnMgb2YgdGhpcyBzaGFwZS5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBFbnRpdHkjXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzY2FsZSBUaGUgc2NhbGUgdG8gbXVsdGlwbHkgdGhlIGRpbWVudGlvbnMgYnlcbiAgICovXG4gIHNjYWxlU2hhcGUoc2NhbGUpe1xuICAgIHRoaXMueCA9IHRoaXMueCAqIHNjYWxlO1xuICAgIHRoaXMueSA9IHRoaXMueSAqIHNjYWxlO1xuICAgIHRoaXMuYWxyZWFkeVNjYWxlZCA9IHRydWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYm94MmQvZW50aXRpZXMvRW50aXR5LmpzXG4vLyBtb2R1bGUgaWQgPSAzMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRoaXMgRW50aXR5IGlzIGZvciBidWlsZGluZyBjb21wbGV4IGFuZCBwb3NzaWJseSBjb25jYXZlIHNoYXBlc1xuICogQG5hbWUgTXVsdGlQb2x5Z29uXG4gKiBAY29uc3RydWN0b3IgTXVsdGlQb2x5Z29uXG4gKiBAZXh0ZW5kcyBFbnRpdHlcbiAqL1xuXG5jb25zdCBFbnRpdHkgPSByZXF1aXJlKCcuL0VudGl0eScpO1xuY29uc3Qgc2NhbGVQb2ludHMgPSByZXF1aXJlKCcuLi8uLi91dGlscy9zY2FsZVBvaW50cycpO1xuY29uc3QgcG9pbnRJblBvbHlnb24gPSByZXF1aXJlKCcuLi8uLi91dGlscy9wb2ludEluUG9seWdvbicpO1xuY29uc3QgdHJhbnNsYXRlUG9pbnRzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvdHJhbnNsYXRlUG9pbnRzJyk7XG5cbmNsYXNzIE11bHRpUG9seWdvbiBleHRlbmRzIEVudGl0eSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSl7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBwb2x5Z29uc1xuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKiBAbWVtYmVyT2YgTXVsdGlQb2x5Z29uI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5wb2x5cyA9IFtdO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyBlYWNoIHBvbHlnb24gaW4gdGhlIGVudGl0eVxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIE11bHRpUG9seWdvbiNcbiAgICogQHBhcmFtIHtDb250ZXh0fSBjdHggdGhlIEhUTUw1IDJkIGRyYXdpbmcgY29udGV4dFxuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgdGhlIHNjYWxlIHRvIGRyYXcgdGhlIGVudGl0eSBhdFxuICAgKi9cbiAgZHJhdyhjdHgsIHNjYWxlKXtcbiAgICBzY2FsZSA9IHNjYWxlIHx8IHRoaXMuc2NhbGUgfHwgMTtcbiAgICB2YXIgb2dMaW5lV2lkdGggPSBjdHgubGluZVdpZHRoO1xuICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmxpbmVXaWR0aDtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC50cmFuc2xhdGUodGhpcy54ICogc2NhbGUsIHRoaXMueSAqIHNjYWxlKTtcbiAgICBjdHgucm90YXRlKHRoaXMuYW5nbGUpO1xuICAgIGN0eC50cmFuc2xhdGUoLSh0aGlzLngpICogc2NhbGUsIC0odGhpcy55KSAqIHNjYWxlKTtcbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsU3R5bGU7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5zdHJva2VTdHlsZTtcblxuICAgIGZvcih2YXIgaiA9IDA7IGogPCB0aGlzLnBvbHlzLmxlbmd0aDsgaisrKXtcbiAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgIGN0eC5tb3ZlVG8oKHRoaXMueCArIHRoaXMucG9seXNbal1bMF0ueCkgKiBzY2FsZSwgKHRoaXMueSArIHRoaXMucG9seXNbal1bMF0ueSkgKiBzY2FsZSk7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHRoaXMucG9seXNbal0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgIGN0eC5saW5lVG8oKHRoaXMucG9seXNbal1baV0ueCArIHRoaXMueCkgKiBzY2FsZSwgKHRoaXMucG9seXNbal1baV0ueSArIHRoaXMueSkgKiBzY2FsZSk7XG4gICAgICB9XG4gICAgICBjdHgubGluZVRvKCh0aGlzLnggKyB0aGlzLnBvbHlzW2pdWzBdLngpICogc2NhbGUsICh0aGlzLnkgKyB0aGlzLnBvbHlzW2pdWzBdLnkpICogc2NhbGUpO1xuICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgY3R4LmZpbGwoKTtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIGN0eC5saW5lV2lkdGggPSBvZ0xpbmVXaWR0aDtcbiAgICBzdXBlci5kcmF3KGN0eCwgc2NhbGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYWxlIHRoaXMgc2hhcGVcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBNdWx0aVBvbHlnb24jXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzY2FsZSBUaGUgYW1vdW50IHRoZSBzaGFwZSBzaG91bGQgc2NhbGVcbiAgICovXG4gIHNjYWxlU2hhcGUoc2NhbGUpe1xuICAgIHRoaXMucG9seXMgPSBzY2FsZVBvaW50cyh0aGlzLnBvbHlzLCBzY2FsZSk7XG4gICAgc3VwLnNjYWxlU2hhcGUoc2NhbGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIGdpdmVuIHBvaW50IGlzIGNvbnRhaW5lZCB3aXRoaW4gdGhpcyBNdWx0aVBvbHlnb24uXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgTXVsdGlQb2x5Z29uI1xuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgQW4gb2JqZWN0IHdpdGggeCBhbmQgeSB2YWx1ZXMuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgcG9pbnQgaXMgaW4gc2hhcGUgZWxzZSBmYWxzZVxuICAgKi9cbiAgcG9pbnRJblNoYXBlKHBvaW50KXtcbiAgICBmb3IodmFyIGogPSAwOyBqIDwgdGhpcy5wb2x5cy5sZW5ndGg7IGorKyl7XG4gICAgICBpZihwb2ludEluUG9seWdvbihwb2ludCwgdHJhbnNsYXRlUG9pbnRzKHRoaXMucG9seXNbal0sIHRoaXMpKSl7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE11bHRpUG9seWdvbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYm94MmQvZW50aXRpZXMvTXVsdGlQb2x5Z29uLmpzXG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRoaXMgRW50aXR5IHJlcHJlc2VudHMgYSBwb2x5Z29uIHdoaWNoIGlzIGJ1aWxkIGZyb20gYW4gYXJyYXkgb2YgcG9pbnRzLlxuICogQG5hbWUgUG9seWdvblxuICogQGNvbnN0cnVjdG9yIFBvbHlnb25cbiAqIEBleHRlbmRzIEVudGl0eVxuICovXG5cbmNvbnN0IEVudGl0eSA9IHJlcXVpcmUoJy4vRW50aXR5Jyk7XG5jb25zdCBzY2FsZVBvaW50cyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL3NjYWxlUG9pbnRzJyk7XG5jb25zdCBwb2ludEluUG9seWdvbiA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL3BvaW50SW5Qb2x5Z29uJyk7XG5jb25zdCB0cmFuc2xhdGVQb2ludHMgPSByZXF1aXJlKCcuLi8uLi91dGlscy90cmFuc2xhdGVQb2ludHMnKTtcblxuY2xhc3MgUG9seWdvbiBleHRlbmRzIEVudGl0eSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSl7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBvYmplY3RzIHRoYXQgaGF2ZSB4IGFuZCB5IHZhbHVlcy5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICogQG1lbWJlck9mIFBvbHlnb24jXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLnBvaW50cyA9IFtdO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyB0aGUgUG9seWdvbiBhdCBhIGdpdmVuIHNjYWxlXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgUG9seWdvbiNcbiAgICogQHBhcmFtIHtDb250ZXh0fSBjdHggVGhlIGRyYXdpbmcgY29udGV4dFxuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgVGhlIHNjYWxlIGF0IHdoaWNoIHRvIGRyYXdcbiAgICovXG4gIGRyYXcoY3R4LCBzY2FsZSl7XG4gICAgc2NhbGUgPSBzY2FsZSB8fCB0aGlzLnNjYWxlIHx8IDE7XG4gICAgdmFyIG9nTGluZVdpZHRoID0gY3R4LmxpbmVXaWR0aDtcbiAgICBjdHgubGluZVdpZHRoID0gdGhpcy5saW5lV2lkdGg7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHgudHJhbnNsYXRlKHRoaXMueCAqIHNjYWxlLCB0aGlzLnkgKiBzY2FsZSk7XG4gICAgY3R4LnJvdGF0ZSh0aGlzLmFuZ2xlKTtcbiAgICBjdHgudHJhbnNsYXRlKC0odGhpcy54KSAqIHNjYWxlLCAtKHRoaXMueSkgKiBzY2FsZSk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbFN0eWxlO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuc3Ryb2tlU3R5bGU7XG5cbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbygodGhpcy54ICsgdGhpcy5wb2ludHNbMF0ueCkgKiBzY2FsZSwgKHRoaXMueSArIHRoaXMucG9pbnRzWzBdLnkpICogc2NhbGUpO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGhpcy5wb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICBjdHgubGluZVRvKCh0aGlzLnBvaW50c1tpXS54ICsgdGhpcy54KSAqIHNjYWxlLCAodGhpcy5wb2ludHNbaV0ueSArIHRoaXMueSkgKiBzY2FsZSk7XG4gICAgfVxuICAgIGN0eC5saW5lVG8oKHRoaXMueCArIHRoaXMucG9pbnRzWzBdLngpICogc2NhbGUsICh0aGlzLnkgKyB0aGlzLnBvaW50c1swXS55KSAqIHNjYWxlKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LmZpbGwoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIGN0eC5saW5lV2lkdGggPSBvZ0xpbmVXaWR0aDtcbiAgICBzdXBlci5kcmF3KGN0eCwgc2NhbGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYWxlIHRoaXMgc2hhcGVcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBQb2x5Z29uI1xuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgVGhlIGFtb3VudCB0aGUgc2hhcGUgc2hvdWxkIHNjYWxlXG4gICAqL1xuICBzY2FsZVNoYXBlKHNjYWxlKXtcbiAgICB0aGlzLnBvaW50cyA9IHNjYWxlUG9pbnRzKHRoaXMucG9pbnRzLCBzY2FsZSk7XG4gICAgc3VwZXIuc2NhbGVTaGFwZShzY2FsZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgZ2l2ZW4gcG9pbnQgaXMgY29udGFpbmVkIHdpdGhpbiB0aGlzIFBvbHlnb24uXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgUG9seWdvbiNcbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IEFuIG9iamVjdCB3aXRoIHggYW5kIHkgdmFsdWVzLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIHBvaW50IGlzIGluIHNoYXBlIGVsc2UgZmFsc2VcbiAgICovXG4gIHBvaW50SW5TaGFwZShwb2ludCl7XG4gICAgcmV0dXJuIHBvaW50SW5Qb2x5Z29uKHBvaW50LCB0cmFuc2xhdGVQb2ludHModGhpcy5wb2ludHMsIHRoaXMpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvbHlnb247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2JveDJkL2VudGl0aWVzL1BvbHlnb24uanNcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhpcyBFbnRpdHkgcmVwcmVzZW50cyBhIFJlY3RhbmdsZVxuICogQG5hbWUgUmVjdGFuZ2xlXG4gKiBAY29uc3RydWN0b3IgUmVjdGFuZ2xlXG4gKiBAZXh0ZW5kcyBFbnRpdHlcbiAqL1xuXG5jb25zdCBFbnRpdHkgPSByZXF1aXJlKCcuL0VudGl0eScpO1xuXG5jbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBFbnRpdHkge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pe1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogSGFsZiBvZiB0aGUgUmVjdGFuZ2xlJ3MgdG90YWwgd2lkdGhcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBSZWN0YW5nbGUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmhhbGZXaWR0aCA9IDE7XG4gICAgLyoqXG4gICAgICogSGFsZiBvZiB0aGUgUmVjdGFuZ2xlJ3MgdG90YWwgd2lkdGhcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBSZWN0YW5nbGUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmhhbGZIZWlnaHQgPSAxO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyB0aGUgUmVjdGFuZ2xlIGF0IGEgZ2l2ZW4gc2NhbGVcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBSZWN0YW5nbGUjXG4gICAqIEBwYXJhbSB7Q29udGV4dH0gY3R4IFRoZSBkcmF3aW5nIGNvbnRleHRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNjYWxlIFRoZSBzY2FsZSBhdCB3aGljaCB0byBkcmF3XG4gICAqL1xuICBkcmF3KGN0eCwgc2NhbGUpe1xuICAgIHNjYWxlID0gc2NhbGUgfHwgdGhpcy5zY2FsZSB8fCAxO1xuICAgIHZhciBvZ0xpbmVXaWR0aCA9IGN0eC5saW5lV2lkdGg7XG4gICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMubGluZVdpZHRoO1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LnRyYW5zbGF0ZSh0aGlzLnggKiBzY2FsZSwgdGhpcy55ICogc2NhbGUpO1xuICAgIGN0eC5yb3RhdGUodGhpcy5hbmdsZSk7XG4gICAgY3R4LnRyYW5zbGF0ZSgtKHRoaXMueCkgKiBzY2FsZSwgLSh0aGlzLnkpICogc2NhbGUpO1xuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpbGxTdHlsZTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnN0cm9rZVN0eWxlO1xuICAgIGN0eC5maWxsUmVjdChcbiAgICAgICh0aGlzLngtdGhpcy5oYWxmV2lkdGgpICogc2NhbGUsXG4gICAgICAodGhpcy55LXRoaXMuaGFsZkhlaWdodCkgKiBzY2FsZSxcbiAgICAgICh0aGlzLmhhbGZXaWR0aCoyKSAqIHNjYWxlLFxuICAgICAgKHRoaXMuaGFsZkhlaWdodCoyKSAqIHNjYWxlXG4gICAgKTtcbiAgICBjdHguc3Ryb2tlUmVjdChcbiAgICAgICh0aGlzLngtdGhpcy5oYWxmV2lkdGgpICogc2NhbGUsXG4gICAgICAodGhpcy55LXRoaXMuaGFsZkhlaWdodCkgKiBzY2FsZSxcbiAgICAgICh0aGlzLmhhbGZXaWR0aCoyKSAqIHNjYWxlLFxuICAgICAgKHRoaXMuaGFsZkhlaWdodCoyKSAqIHNjYWxlXG4gICAgKTtcbiAgICBjdHgucmVzdG9yZSgpO1xuICAgIGN0eC5saW5lV2lkdGggPSBvZ0xpbmVXaWR0aDtcbiAgICBzdXBlci5kcmF3KGN0eCwgc2NhbGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYWxlIHRoaXMgc2hhcGVcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBSZWN0YW5nbGUjXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzY2FsZSBUaGUgYW1vdW50IHRoZSBzaGFwZSBzaG91bGQgc2NhbGVcbiAgICovXG4gIHNjYWxlU2hhcGUoc2NhbGUpe1xuICAgIHRoaXMuaGFsZkhlaWdodCA9IHRoaXMuaGFsZkhlaWdodCAqIHNjYWxlO1xuICAgIHRoaXMuaGFsZldpZHRoID0gdGhpcy5oYWxmV2lkdGggKiBzY2FsZTtcbiAgICBzdXBlci5zY2FsZVNoYXBlKHNjYWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYSBnaXZlbiBwb2ludCBpcyBjb250YWluZWQgd2l0aGluIHRoaXMgUmVjdGFuZ2xlLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIFJlY3RhbmdsZSNcbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IEFuIG9iamVjdCB3aXRoIHggYW5kIHkgdmFsdWVzLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIHBvaW50IGlzIGluIHNoYXBlIGVsc2UgZmFsc2VcbiAgICovXG4gIHBvaW50SW5TaGFwZShwb2ludCl7XG4gICAgcmV0dXJuICgocG9pbnQueCA+PSAodGhpcy54IC0gdGhpcy5oYWxmV2lkdGgpKSAmJiAocG9pbnQueCA8PSAodGhpcy54ICsgdGhpcy5oYWxmV2lkdGgpKSAmJiAocG9pbnQueSA+PSAodGhpcy55IC0gdGhpcy5oYWxmSGVpZ2h0KSkgJiYgKHBvaW50LnkgPD0gKHRoaXMueSArIHRoaXMuaGFsZkhlaWdodCkpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlY3RhbmdsZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYm94MmQvZW50aXRpZXMvUmVjdGFuZ2xlLmpzXG4vLyBtb2R1bGUgaWQgPSAzNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IERpc3RhbmNlID0gcmVxdWlyZSgnLi9qb2ludHMvRGlzdGFuY2UnKTtcbmNvbnN0IFByaXNtYXRpYyA9IHJlcXVpcmUoJy4vam9pbnRzL1ByaXNtYXRpYycpO1xuY29uc3QgUmV2b2x1dGUgPSByZXF1aXJlKCcuL2pvaW50cy9SZXZvbHV0ZScpO1xuXG52YXIgam9pbnRzID0ge1xuICBEaXN0YW5jZSxcbiAgUHJpc21hdGljLFxuICBSZXZvbHV0ZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBqb2ludHM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2JveDJkL2pvaW50cy5qc1xuLy8gbW9kdWxlIGlkID0gMzVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGlzIHJlcHJlc2VudHMgYSBkaXN0YW5jZSBqb2ludCBiZXR3ZWVuIHR3byBib2RpZXMuXG4gKiBUaGlzIHR5cGUgb2Ygam9pbnQgZm9yY2VzIHR3byBib2RpZXMgdG8ga2VlcCBhIGNvbnN0YW50IGRpc3RhbmNlIGZvciBlYWNoIG90aGVyLlxuICogQG5hbWUgRGlzdGFuY2VcbiAqIEBjb25zdHJ1Y3RvciBEaXN0YW5jZVxuICogQGV4dGVuZHMgSm9pbnRcbiAqL1xuXG5jb25zdCBKb2ludCA9IHJlcXVpcmUoJy4vSm9pbnQnKTtcblxuXG4vLyBib3gyZCBnbG9iYWxzXG5jb25zdCBCMlZlYzIgPSBCb3gyRC5Db21tb24uTWF0aC5iMlZlYzI7XG5jb25zdCBCMkRpc3RhbmNlSm9pbnREZWYgPSBCb3gyRC5EeW5hbWljcy5Kb2ludHMuYjJEaXN0YW5jZUpvaW50RGVmO1xuXG5jbGFzcyBEaXN0YW5jZSBleHRlbmRzIEpvaW50IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KXtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIEEgcG9pbnQgb24gdGhlIHNlY29uZCBlbnRpdHkgd2hlcmUgdGhlIGpvaW50IHdpbGwgYmUgYXR0YWNoZWQuIElmIG5vIHBvaW50IGlzIHNwZWNpZmllZCwgdGhlIHNlY29uZCBib2R5IHdpbGwgYmUgYXR0YWNoZWQgYXQgaXRzIGNlbnRlciBwb2ludC5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBtZW1iZXJPZiBEaXN0YW5jZSNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuYm9keVBvaW50MiA9IG51bGw7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYWxlcyB0aGUgcG9zaXRpb25zIGJvZGllcyB0aGF0IHRoZSBqb2ludCBhcmUgY29ubmVjdGVkIGF0LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIERpc3RhbmNlI1xuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgdGhlIHNjYWxlIHRvIG11bHRpcGx5IHRoZSBkaW1lbnRpb25zIGJ5XG4gICAqL1xuICBzY2FsZUpvaW50TG9jYXRpb24oc2NhbGUpe1xuICAgIGlmKHNjYWxlICYmIHRoaXMuYm9keVBvaW50Mil7XG4gICAgICB0aGlzLmJvZHlQb2ludDIueCA9IHRoaXMuYm9keVBvaW50Mi54ICogc2NhbGU7XG4gICAgICB0aGlzLmJvZHlQb2ludDIueSA9IHRoaXMuYm9keVBvaW50Mi55ICogc2NhbGU7XG4gICAgICB0aGlzLmFscmVhZHlTY2FsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBzdXBlci5zY2FsZUpvaW50TG9jYXRpb24oc2NhbGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW5kIGFkZHMgdGhpcyBqb2ludCBpbiB0aGUgQm94MmQgd29ybGQuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgRGlzdGFuY2UjXG4gICAqIEBwYXJhbSB7Qm94fSB0aGUgYm94IGluIHdoaWNoIHRvIGNyZWF0ZSB0aGUgam9pbnQuXG4gICAqIEByZXR1cm4ge2IySm9pbnR9IEpvaW50IGNyZWF0ZWQgYnkgYm94MmRcbiAgICovXG4gIGNyZWF0ZUIySm9pbnQoYm94KXtcbiAgICBpZihib3ggJiYgYm94LmJvZGllc01hcCAmJiBib3guYjJXb3JsZCAmJiBib3guam9pbnRzTWFwICYmICFib3guam9pbnRzTWFwW3RoaXMuaWRdKXtcbiAgICAgIGNvbnN0IGJvZHkxID0gYm94LmJvZGllc01hcFt0aGlzLmJvZHlJZDFdO1xuICAgICAgY29uc3QgYm9keTIgPSBib3guYm9kaWVzTWFwW3RoaXMuYm9keUlkMl07XG4gICAgICBpZihib2R5MSAmJiBib2R5Mil7XG4gICAgICAgIGxldCB2ZWMxLCB2ZWMyO1xuICAgICAgICBpZih0aGlzLmJvZHlQb2ludDEpe1xuICAgICAgICAgIHZlYzEgPSBuZXcgQjJWZWMyKHRoaXMuYm9keVBvaW50MS54LCB0aGlzLmJvZHlQb2ludDEueSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5ib2R5UG9pbnQyKXtcbiAgICAgICAgICB2ZWMyID0gbmV3IEIyVmVjMih0aGlzLmJvZHlQb2ludDIueCwgdGhpcy5ib2R5UG9pbnQyLnkpO1xuICAgICAgICB9XG4gICAgICAgIHZlYzEgPSB2ZWMxIHx8IGJvZHkxLkdldFdvcmxkQ2VudGVyKCk7XG4gICAgICAgIHZlYzIgPSB2ZWMyIHx8IGJvZHkyLkdldFdvcmxkQ2VudGVyKCk7XG4gICAgICAgIGNvbnN0IGpvaW50ID0gbmV3IEIyRGlzdGFuY2VKb2ludERlZigpO1xuICAgICAgICBqb2ludC5Jbml0aWFsaXplKGJvZHkxLCBib2R5MiwgdmVjMSwgdmVjMik7XG5cbiAgICAgICAgaWYgKHRoaXMuam9pbnRBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgT2JqZWN0LmFzc2lnbihqb2ludCwgdGhpcy5qb2ludEF0dHJpYnV0ZXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBib3guYjJXb3JsZC5DcmVhdGVKb2ludChqb2ludCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGlzdGFuY2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2JveDJkL2pvaW50cy9EaXN0YW5jZS5qc1xuLy8gbW9kdWxlIGlkID0gMzZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGlzIHJlcHJlc2VudHMgYSBqb2ludCBiZXR3ZWVuIHR3byBib2RpZXMuXG4gKiBAbmFtZSBKb2ludFxuICogQGNvbnN0cnVjdG9yIEpvaW50XG4gKi9cblxuXG5jbGFzcyBKb2ludCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSl7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaWQgb2YgdGhlIGZpcnN0IGVudGl0eSB0aGF0IHdpbGwgYmUgYXR0YWNoZWQgdG8gdGhpcyBqb2ludFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQG1lbWJlck9mIEpvaW50I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5ib2R5SWQxID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBpZCBvZiB0aGUgc2Vjb25kIGVudGl0eSB0aGF0IHdpbGwgYmUgYXR0YWNoZWQgdG8gdGhpcyBqb2ludFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQG1lbWJlck9mIEpvaW50I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5ib2R5SWQyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEEgcG9pbnQgb24gdGhlIGZpcnN0IGVudGl0eSB3aGVyZSBiZSBhdHRhY2hlZCB0byB0aGUgc2Vjb25kIGJvZHkuIElmIG5vIHBvaW50IGlzIHNwZWNpZmllZCwgdGhlIGZpcnN0IGJvZHkgd2lsbCBiZSBhdHRhY2hlZCBhdCBpdHMgY2VudGVyIHBvaW50LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG1lbWJlck9mIEpvaW50I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5ib2R5UG9pbnQxID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEFuIG9iamVjdCB3aXRoIGFueSBvdGhlciBwcm9wZXJ0aWVzIHRoYXQgc2hvdWxkIGJlIG1peGVkIGludG8gdGhlIGJveDJkIGpvaW50IGRlZmluaXRpb24uXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbWVtYmVyT2YgSm9pbnQjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmpvaW50QXR0cmlidXRlcyA9IG51bGw7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYWxlcyB0aGUgcG9zaXRpb24gdGhhdCBvbiB0aGUgZmlyc3QgYm9keSB0aGF0IHRoZSBqb2ludCBpcyBjb25uZWN0ZWQgYXQuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgSm9pbnQjXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzY2FsZSB0aGUgc2NhbGUgdG8gbXVsdGlwbHkgdGhlIGRpbWVudGlvbnMgYnlcbiAgICovXG4gIHNjYWxlSm9pbnRMb2NhdGlvbihzY2FsZSl7XG4gICAgaWYoc2NhbGUgJiYgdGhpcy5ib2R5UG9pbnQxKXtcbiAgICAgIHRoaXMuYm9keVBvaW50MS54ID0gdGhpcy5ib2R5UG9pbnQxLnggKiBzY2FsZTtcbiAgICAgIHRoaXMuYm9keVBvaW50MS55ID0gdGhpcy5ib2R5UG9pbnQxLnkgKiBzY2FsZTtcbiAgICAgIHRoaXMuYWxyZWFkeVNjYWxlZCA9IHRydWU7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSm9pbnQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2JveDJkL2pvaW50cy9Kb2ludC5qc1xuLy8gbW9kdWxlIGlkID0gMzdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGlzIHJlcHJlc2VudHMgYSBwcmlzbWF0aWMgam9pbnQgYmV0d2VlbiB0d28gYm9kaWVzLlxuICogVGhpcyB0eXBlIG9mIGpvaW50IGZvcmNlcyBhIGJvZHkgdG8ga2VlcCBpdHMgYW5nbGUgcm90YXRpb24gY29uc2l0ZW50IHdpdGggYW5vdGhlciBib2R5XG4gKiBAbmFtZSBQcmlzbWF0aWNcbiAqIEBjb25zdHJ1Y3RvciBQcmlzbWF0aWNcbiAqIEBleHRlbmRzIEpvaW50XG4gKi9cblxuY29uc3QgSm9pbnQgPSByZXF1aXJlKCcuL0pvaW50Jyk7XG5cbi8vIGJveDJkIGdsb2JhbHNcbmNvbnN0IEIyVmVjMiA9IEJveDJELkNvbW1vbi5NYXRoLmIyVmVjMjtcbmNvbnN0IEIyUHJpc21hdGljSm9pbnREZWYgPSBCb3gyRC5EeW5hbWljcy5Kb2ludHMuYjJQcmlzbWF0aWNKb2ludERlZjtcblxuY2xhc3MgUHJpc21hdGljIGV4dGVuZHMgSm9pbnQge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pe1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogQW4gb2JqZWN0IHdpdGggeCBhbmQgeSBudW1lcmljIGNvbXBvbmVudHMgcmVwcmVzZW50aW5nIHRoZSBsaW5lIGluIHdoaWNoIHRoZSBlbnRpdGllcyBjYW4gbW92ZSByZWxhdGl2ZSB0byBlYWNoIG90aGVyXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbWVtYmVyT2YgUHJpc21hdGljI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5heGlzU2NhbGUgPSBudWxsO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuZCBhZGRzIHRoaXMgam9pbnQgaW4gdGhlIEJveDJkIHdvcmxkLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIFByaXNtYXRpYyNcbiAgICogQHBhcmFtIHtCb3h9IHRoZSBib3ggaW4gd2hpY2ggdG8gY3JlYXRlIHRoZSBqb2ludC5cbiAgICogQHJldHVybiB7YjJKb2ludH0gSm9pbnQgY3JlYXRlZCBieSBib3gyZFxuICAgKi9cbiAgY3JlYXRlQjJKb2ludChib3gpe1xuICAgIGlmKGJveCAmJiBib3guYm9kaWVzTWFwICYmIGJveC5iMldvcmxkICYmIGJveC5qb2ludHNNYXAgJiYgIWJveC5qb2ludHNNYXBbdGhpcy5pZF0pe1xuICAgICAgY29uc3QgYm9keTEgPSBib3guYm9kaWVzTWFwW3RoaXMuYm9keUlkMV07XG4gICAgICBjb25zdCBib2R5MiA9IGJveC5ib2RpZXNNYXBbdGhpcy5ib2R5SWQyXTtcbiAgICAgIGlmKGJvZHkxICYmIGJvZHkyKXtcbiAgICAgICAgbGV0IHZlYzE7XG4gICAgICAgIGlmKHRoaXMuYm9keVBvaW50MSl7XG4gICAgICAgICAgdmVjMSA9IG5ldyBCMlZlYzIodGhpcy5ib2R5UG9pbnQxLngsIHRoaXMuYm9keVBvaW50MS55KTtcbiAgICAgICAgfVxuICAgICAgICB2ZWMxID0gdmVjMSB8fCBib2R5MS5HZXRXb3JsZENlbnRlcigpO1xuICAgICAgICB2YXIgam9pbnQgPSBuZXcgQjJQcmlzbWF0aWNKb2ludERlZigpO1xuICAgICAgICB2YXIgYXhpcztcbiAgICAgICAgaWYodGhpcy5heGlzU2NhbGUpe1xuICAgICAgICAgIGF4aXMgPSBuZXcgQjJWZWMyKHRoaXMuYXhpc1NjYWxlLngsIHRoaXMuYXhpc1NjYWxlLnkpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBheGlzID0gbmV3IEIyVmVjMigxLCAwKTtcbiAgICAgICAgfVxuICAgICAgICBqb2ludC5Jbml0aWFsaXplKGJvZHkxLCBib2R5MiwgdmVjMSwgYXhpcyk7XG5cbiAgICAgICAgaWYgKHRoaXMuam9pbnRBdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgT2JqZWN0LmFzc2lnbihqb2ludCwgdGhpcy5qb2ludEF0dHJpYnV0ZXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBib3guYjJXb3JsZC5DcmVhdGVKb2ludChqb2ludCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJpc21hdGljO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ib3gyZC9qb2ludHMvUHJpc21hdGljLmpzXG4vLyBtb2R1bGUgaWQgPSAzOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRoaXMgcmVwcmVzZW50cyBhIHJldm9sdXRlIGpvaW50IGJldHdlZW4gdHdvIGJvZGllcy5cbiAqIFRoaXMgYWxsb3cgZm9yIHJvdGF0aW9uIG9mIG9uZSBib2R5IGFyb3VuZCBhIHBvaW50IG9mIGFub3RoZXIuXG4gKiBAbmFtZSBSZXZvbHV0ZVxuICogQGNvbnN0cnVjdG9yIFJldm9sdXRlXG4gKiBAZXh0ZW5kcyBKb2ludFxuICovXG5cbmNvbnN0IEpvaW50ID0gcmVxdWlyZSgnLi9Kb2ludCcpO1xuXG4vLyBib3gyZCBnbG9iYWxzXG5jb25zdCBCMlZlYzIgPSBCb3gyRC5Db21tb24uTWF0aC5iMlZlYzI7XG5jb25zdCBCMlJldm9sdXRlSm9pbnREZWYgPSBCb3gyRC5EeW5hbWljcy5Kb2ludHMuYjJSZXZvbHV0ZUpvaW50RGVmO1xuXG5cbmNsYXNzIFJldm9sdXRlIGV4dGVuZHMgSm9pbnQge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pe1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuZCBhZGRzIHRoaXMgam9pbnQgaW4gdGhlIEJveDJkIHdvcmxkLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIFJldm9sdXRlI1xuICAgKiBAcGFyYW0ge0JveH0gdGhlIGJveCBpbiB3aGljaCB0byBjcmVhdGUgdGhlIGpvaW50LlxuICAgKiBAcmV0dXJuIHtiMkpvaW50fSBKb2ludCBjcmVhdGVkIGJ5IGJveDJkXG4gICAqL1xuICBjcmVhdGVCMkpvaW50KGJveCl7XG4gICAgaWYoYm94ICYmIGJveC5ib2RpZXNNYXAgJiYgYm94LmIyV29ybGQgJiYgYm94LmpvaW50c01hcCAmJiAhYm94LmpvaW50c01hcFt0aGlzLmlkXSl7XG4gICAgICAgIHZhciBib2R5MSA9IGJveC5ib2RpZXNNYXBbdGhpcy5ib2R5SWQxXTtcbiAgICAgICAgdmFyIGJvZHkyID0gYm94LmJvZGllc01hcFt0aGlzLmJvZHlJZDJdO1xuICAgICAgICBpZihib2R5MSAmJiBib2R5Mil7XG4gICAgICAgICAgdmFyIHZlYzE7XG4gICAgICAgICAgaWYodGhpcy5ib2R5UG9pbnQxKXtcbiAgICAgICAgICAgIHZlYzEgPSBuZXcgQjJWZWMyKHRoaXMuYm9keVBvaW50MS54LCB0aGlzLmJvZHlQb2ludDEueSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZlYzEgPSB2ZWMxIHx8IGJvZHkxLkdldFdvcmxkQ2VudGVyKCk7XG4gICAgICAgICAgdmFyIGpvaW50ID0gbmV3IEIyUmV2b2x1dGVKb2ludERlZigpO1xuICAgICAgICAgIHZhciBheGlzO1xuICAgICAgICAgIGpvaW50LkluaXRpYWxpemUoYm9keTEsIGJvZHkyLCB2ZWMxLCBheGlzKTtcblxuICAgICAgICAgIGlmICh0aGlzLmpvaW50QXR0cmlidXRlcykge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihqb2ludCwgdGhpcy5qb2ludEF0dHJpYnV0ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYm94LmIyV29ybGQuQ3JlYXRlSm9pbnQoam9pbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJldm9sdXRlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ib3gyZC9qb2ludHMvUmV2b2x1dGUuanNcbi8vIG1vZHVsZSBpZCA9IDM5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogVGhpcyB3cmFwcyB0aGUgYm94MmQgd29ybGQgdGhhdCBjb250YWlucyBib2RpZXMsIHNoYXBlcywgYW5kIHBlcmZvcm1zIHRoZSBwaHlzaWNzIGNhbGN1bGF0aW9ucy5cbiAqIEBuYW1lIEJveFxuICogQGNvbnN0cnVjdG9yIEJveFxuICovXG5cbmNvbnN0IENvbnRhY3QgPSByZXF1aXJlKCcuL2xpc3RlbmVycy9Db250YWN0Jyk7XG5cblxuY29uc29sZS5sb2coQm94MkQsICdCb3gyRCcsIGdsb2JhbCwgd2luZG93KTtcblxuLy8gYm94MmQgZ2xvYmFsc1xuY29uc3QgQjJWZWMyID0gQm94MkQuQ29tbW9uLk1hdGguYjJWZWMyO1xuY29uc3QgQjJCb2R5RGVmID0gQm94MkQuRHluYW1pY3MuYjJCb2R5RGVmO1xuY29uc3QgQjJCb2R5ID0gQm94MkQuRHluYW1pY3MuYjJCb2R5O1xuY29uc3QgQjJGaXh0dXJlRGVmID0gQm94MkQuRHluYW1pY3MuYjJGaXh0dXJlRGVmO1xuY29uc3QgQjJGaXh0dXJlID0gQm94MkQuRHluYW1pY3MuYjJGaXh0dXJlO1xuY29uc3QgQjJXb3JsZCA9IEJveDJELkR5bmFtaWNzLmIyV29ybGQ7XG5jb25zdCBCMlBvbHlnb25TaGFwZSA9IEJveDJELkNvbGxpc2lvbi5TaGFwZXMuYjJQb2x5Z29uU2hhcGU7XG5jb25zdCBCMkNpcmNsZVNoYXBlID0gQm94MkQuQ29sbGlzaW9uLlNoYXBlcy5iMkNpcmNsZVNoYXBlO1xuXG5jbGFzcyBCb3gge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pe1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiBjeWNsZXMgcGVyIHNlY29uZCBleHBlY3RlZCBpbiB1cGRhdGUgY2FsY3VhdGlvbnNcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBCb3gjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmludGVydmFsUmF0ZSA9IDYwO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgdG8gdHJ5IHRvIGNvbXBlbnNhdGUgY2FsY3VsYXRpb25zIGJhc2VkIG9uIHBlcmZvcm1hbmNlXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG1lbWJlck9mIEJveCNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuYWRhcHRpdmUgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEEgbWFwIG9mIHRoZSBib2RpZXMgaW4gdGhlIGJveDJkIHdvcmxkIHJlZmVyZW5jZWQgYnkgdGhlaXIgZ2l2ZW4gdXNlckRhdGFcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBtZW1iZXJPZiBCb3gjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmJvZGllc01hcCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBBIG1hcCBvZiB0aGUgZml4dHVyZXMgaW4gdGhlIGJveDJkIHdvcmxkIHJlZmVyZW5jZWQgYnkgdGhlaXIgZ2l2ZW4gdXNlckRhdGFcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBtZW1iZXJPZiBCb3gjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmZpeHR1cmVzTWFwID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEEgbWFwIG9mIHRoZSBqb2ludHMgaW4gdGhlIGJveDJkIHdvcmxkIHJlZmVyZW5jZWQgYnkgdGhlaXIgZ2l2ZW4gdXNlckRhdGFcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBtZW1iZXJPZiBCb3gjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmpvaW50c01hcCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaW5zdGFuY2Ugb2YgdGhlIEJveDJELkR5bmFtaWNzLmIyV29ybGQgd29ybGQgY2xhc3MgdGhhdCB0aGUgYm9kaWVzLCBmaXh0dXJlcywgYW5kIGpvaW50cyBhcmUgdXNlZCBpbi5cbiAgICAgKiBAdHlwZSB7QjJXb3JsZH1cbiAgICAgKiBAbWVtYmVyT2YgQm94I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5iMldvcmxkID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB4IGNvbXBvbmVudCBvZiB0aGUgYjJXb3JsZCdzIGdyYXZpdHkgaW4gbWV0ZXJzL3NlY29uZCBzcXVhcmVkXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyT2YgQm94I1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5ncmF2aXR5WCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeSBjb21wb25lbnQgb2YgdGhlIGIyV29ybGQncyBncmF2aXR5IGluIG1ldGVycy9zZWNvbmQgc3F1YXJlZFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlck9mIEJveCNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuZ3Jhdml0eVkgPSA5Ljg7XG5cbiAgICAvKipcbiAgICAgKiBBbGxvdyBib3gyZCB0byBza2lwIHBoeXNpY3MgY2FsY3VsYXRpb25zIG9uIGJvZGllcyBhdCByZXN0IGZvciBwZXJmb3JtYW5jZVxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBtZW1iZXJPZiBCb3gjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmFsbG93U2xlZXAgPSB0cnVlO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBhZGQgYSBsaXN0ZW5lciB0byBjb2xsaXNpb24gZXZlbnRzLiBEZWZhdWx0IGJlaGF2aW9yIGFkZHMgY29sbGlzaW9uIGRhdGEgdG8gZW50aXRpZXMgb24gdXBkYXRlIGN5Y2xlXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG1lbWJlck9mIEJveCNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMucmVzb2x2ZUNvbGxpc2lvbnMgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEEgY29udGFjdCBsaXN0ZW5lciBmb3IgY2FsbGJhY2tzIG9uIGNvbGxpc2lvbiBldmVudHMuIERlZmF1bHQgaXMgdGhpcyBib3ggaXRzZWxmLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG1lbWJlck9mIEJveCNcbiAgICAgKiBAZGVmYXVsdFxuICAgICAqL1xuICAgIHRoaXMuY29udGFjdExpc3RlbmVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE1hcCBvZiBjb2xsaXNpb25zLiBJbnN0YW50aWF0ZWQgaW4gdXBkYXRlIGlmIHJlc29sdmVDb2xsaXNpb25zIGlzIHRydWVcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBtZW1iZXJPZiBCb3gjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmNvbGxpc2lvbnMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiBwaXhlbHMgdGhhdCByZXByZXNudCBvbmUgbWV0ZXIgaW4gdGhlIGJveDJkIHdvcmxkLiAoMzAgcGl4ZWxzIH4gMSBtZXRlciBpbiBib3gyZClcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJPZiBCb3gjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLnNjYWxlID0gMzA7XG5cbiAgICB0aGlzLmJvZGllc01hcCA9IHt9O1xuICAgIHRoaXMuZml4dHVyZXNNYXAgPSB7fTtcbiAgICB0aGlzLmpvaW50c01hcCA9IHt9O1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmIyV29ybGQgPSBuZXcgQjJXb3JsZChuZXcgQjJWZWMyKHRoaXMuZ3Jhdml0eVgsIHRoaXMuZ3Jhdml0eVkpLCB0aGlzLmFsbG93U2xlZXApO1xuXG4gICAgaWYodGhpcy5pbnRlcnZhbFJhdGUpe1xuICAgICAgdGhpcy5pbnRlcnZhbFJhdGUgPSBwYXJzZUludCh0aGlzLmludGVydmFsUmF0ZSwgMTApO1xuICAgIH1cblxuXG4gICAgaWYodGhpcy5yZXNvbHZlQ29sbGlzaW9ucyl7XG4gICAgICB0aGlzLmNvbnRhY3RMaXN0ZW5lciA9IG5ldyBDb250YWN0KCk7XG4gICAgfVxuXG4gICAgaWYodGhpcy5jb250YWN0TGlzdGVuZXIpe1xuICAgICAgdGhpcy5hZGRDb250YWN0TGlzdGVuZXIodGhpcy5jb250YWN0TGlzdGVuZXIpO1xuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgYm94MmQgcGh5c2ljcyBjYWxjdWxhdGlvbnNcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBCb3gjXG4gICAqIEBwYXJhbSAge051bWJlcn0gbWlsbGlzIFRoZSBtaWxsaXNlY29uZHMgdXNlZCB0byBkZXRlcm1pbmUgZnJhbWVyYXRlIGZvciBib3gyZCBzdGVwXG4gICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGFtb3VudCBvZiBtaWxsaXNlY29uZHMgdGhlIHVwZGF0ZSB0b29rXG4gICAqL1xuICB1cGRhdGUobWlsbGlzKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ3VwZGF0ZSBtaWxsaXMnLCBtaWxsaXMpO1xuXG4gICAgaWYodGhpcy5jb250YWN0TGlzdGVuZXIgJiYgdGhpcy5jb250YWN0TGlzdGVuZXIucmVzZXQpe1xuICAgICAgdGhpcy5jb250YWN0TGlzdGVuZXIucmVzZXQoKTtcbiAgICB9XG5cbiAgICB2YXIgc3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIGlmKG1pbGxpcyl7XG4gICAgICB0aGlzLmIyV29ybGQuU3RlcChtaWxsaXMgLyAxMDAwIC8qIGZyYW1lLXJhdGUgKi8sIDEwIC8qIHZlbG9jaXR5IGl0ZXJhdGlvbnMgKi8sIDEwIC8qcG9zaXRpb24gaXRlcmF0aW9ucyovKTtcbiAgICAgIHRoaXMuYjJXb3JsZC5DbGVhckZvcmNlcygpO1xuICAgIH1lbHNle1xuICAgICAgdmFyIHN0ZXBSYXRlID0gKHRoaXMuYWRhcHRpdmUpID8gKHN0YXJ0IC0gdGhpcy5sYXN0VGltZXN0YW1wKSAvIDEwMDAgOiAoMSAvIHRoaXMuaW50ZXJ2YWxSYXRlKTtcbiAgICAgIHRoaXMuYjJXb3JsZC5TdGVwKHN0ZXBSYXRlIC8qIGZyYW1lLXJhdGUgKi8sIDEwIC8qIHZlbG9jaXR5IGl0ZXJhdGlvbnMgKi8sIDEwIC8qcG9zaXRpb24gaXRlcmF0aW9ucyovKTtcbiAgICAgIHRoaXMuYjJXb3JsZC5DbGVhckZvcmNlcygpO1xuICAgIH1cblxuICAgIHJldHVybiAoRGF0ZS5ub3coKSAtIHN0YXJ0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBvYmplY3RzIGluIHRoZSBib3gyZCB3b3JsZC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBCb3gjXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHN0YXRlIG9mIHRoZSBib3gyZCB3b3JsZFxuICAgKi9cbiAgZ2V0U3RhdGUoKSB7XG4gICAgdmFyIHN0YXRlID0ge307XG4gICAgICBmb3IgKHZhciBiID0gdGhpcy5iMldvcmxkLkdldEJvZHlMaXN0KCk7IGI7IGIgPSBiLm1fbmV4dCkge1xuICAgICAgICBpZiAoYi5Jc0FjdGl2ZSgpICYmIHR5cGVvZiBiLkdldFVzZXJEYXRhKCkgIT09ICd1bmRlZmluZWQnICYmIGIuR2V0VXNlckRhdGEoKSAhPT0gbnVsbCkge1xuICAgICAgICAgIHN0YXRlW2IuR2V0VXNlckRhdGEoKV0gPSB7XG4gICAgICAgICAgICB4OiBiLkdldFBvc2l0aW9uKCkueCxcbiAgICAgICAgICAgIHk6IGIuR2V0UG9zaXRpb24oKS55LFxuICAgICAgICAgICAgYW5nbGU6IGIuR2V0QW5nbGUoKSxcbiAgICAgICAgICAgIGNlbnRlcjoge1xuICAgICAgICAgICAgICB4OiBiLkdldFdvcmxkQ2VudGVyKCkueCxcbiAgICAgICAgICAgICAgeTogYi5HZXRXb3JsZENlbnRlcigpLnlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5lYXJWZWxvY2l0eTogYi5tX2xpbmVhclZlbG9jaXR5LFxuICAgICAgICAgICAgYW5ndWxhclZlbG9jaXR5OiBiLm1fYW5ndWxhclZlbG9jaXR5XG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZih0aGlzLmNvbnRhY3RMaXN0ZW5lciAmJiB0aGlzLmNvbnRhY3RMaXN0ZW5lci5jb2xsaXNpb25zKXtcbiAgICAgICAgICAgIHN0YXRlW2IuR2V0VXNlckRhdGEoKV0uY29sbGlzaW9ucyA9IHRoaXMuY29udGFjdExpc3RlbmVyLmNvbGxpc2lvbnNbYi5HZXRVc2VyRGF0YSgpXSB8fCBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHN0YXRlIGluIHRoZSBFbnRpdHkgb2JqZWN0cyB0aGF0IGFyZSBtb2RpZmllZCBieSBib3gyZCBjYWxjdWxhdGlvbnMuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQm94I1xuICAgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gZW50aXRpZXMgQW4gYXJyYXkgb3IgbWFwIG9mIEVudGl0eSBvYmplY3RzXG4gICAqL1xuICB1cGRhdGVFeHRlcm5hbFN0YXRlKGVudGl0aWVzKXtcbiAgICAvL3VwZGF0ZSB0aGUgZHlhbm1pYyBzaGFwZXMgd2l0aCBib3gyZCBjYWxjdWxhdGlvbnNcbiAgICB2YXIgYm9kaWVzU3RhdGUgPSB0aGlzLmdldFN0YXRlKCk7XG4gICAgZm9yICh2YXIgaWQgaW4gYm9kaWVzU3RhdGUpIHtcbiAgICAgIHZhciBlbnRpdHkgPSBlbnRpdGllc1tpZF07XG4gICAgICAvL3VwZGF0ZSBhbnkgZHluYW1pYyBib2RpZXNcbiAgICAgIGlmIChlbnRpdHkgJiYgIWVudGl0eS5zdGF0aWNCb2R5KXtcbiAgICAgICAgZW50aXR5LnVwZGF0ZShib2RpZXNTdGF0ZVtpZF0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBtYXAgb2YgZW50aXRpZXMgdG8gdGhlIEJveFxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIEJveCNcbiAgICogQHBhcmFtIHtPYmplY3R9IGJvZHlFbnRpdGllcyBNYXAgb2YgZW50aXRpZXNcbiAgICovXG4gIHNldEJvZGllcyhib2R5RW50aXRpZXMpIHtcbiAgICBmb3IodmFyIGlkIGluIGJvZHlFbnRpdGllcykge1xuICAgICAgdmFyIGVudGl0eSA9IGJvZHlFbnRpdGllc1tpZF07XG4gICAgICB0aGlzLmFkZEJvZHkoZW50aXR5KTtcbiAgICB9XG4gICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIEVudGl0eSB0byB0aGUgYm94MmQgd29ybGQgd2hpY2ggd2lsbCBpbnRlcm5hbGx5IGJlIGNvbnZlcnRlZCB0byBhIGJveDJkIGJvZHkgYW5kIGZpeHR1cmUgKGF1dG8gc2NhbGVkIHdpdGggQm94J3Mgc2NhbGUgcHJvcGVydHkgaWYgdGhlIGVudGl0eSBoYXNuJ3QgYmVlbiBzY2FsZWQgeWV0KVxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIEJveCNcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBBbnkgRW50aXR5IG9iamVjdFxuICAgKi9cbiAgYWRkQm9keShlbnRpdHkpIHtcbiAgICAvKmpzaGludCBlcW51bGw6dHJ1ZSAqL1xuXG4gICAgaWYoIWVudGl0eS5hbHJlYWR5U2NhbGVkKXtcbiAgICAgIGVudGl0eS5zY2FsZVNoYXBlKDEgLyB0aGlzLnNjYWxlKTtcbiAgICAgIGVudGl0eS5zY2FsZSA9IHRoaXMuc2NhbGU7XG4gICAgfVxuXG4gICAgdmFyIGJvZHlEZWYgPSBuZXcgQjJCb2R5RGVmKCk7XG4gICAgdmFyIGZpeERlZiA9IG5ldyBCMkZpeHR1cmVEZWYoKTtcbiAgICB2YXIgaSxqLHBvaW50cyx2ZWMsdmVjcztcbiAgICBmaXhEZWYucmVzdGl0dXRpb24gPSBlbnRpdHkucmVzdGl0dXRpb247XG4gICAgZml4RGVmLmRlbnNpdHkgPSBlbnRpdHkuZGVuc2l0eTtcbiAgICBmaXhEZWYuZnJpY3Rpb24gPSBlbnRpdHkuZnJpY3Rpb247XG5cblxuICAgIC8vdGhlc2UgdGhyZWUgcHJvcHMgYXJlIGZvciBjdXN0b20gY29sbGlzaW9uIGZpbHRlcmluZ1xuICAgIGlmKGVudGl0eS5tYXNrQml0cyAhPSBudWxsKXtcbiAgICAgIGZpeERlZi5maWx0ZXIubWFza0JpdHMgPSBlbnRpdHkubWFza0JpdHM7XG4gICAgfVxuICAgIGlmKGVudGl0eS5jYXRlZ29yeUJpdHMgIT0gbnVsbCl7XG4gICAgICBmaXhEZWYuZmlsdGVyLmNhdGVnb3J5Qml0cyA9IGVudGl0eS5jYXRlZ29yeUJpdHM7XG4gICAgfVxuICAgIGlmKGVudGl0eS5ncm91cEluZGV4ICE9IG51bGwpe1xuICAgICAgZml4RGVmLmZpbHRlci5ncm91cEluZGV4ID0gZW50aXR5Lmdyb3VwSW5kZXg7XG4gICAgfVxuXG4gICAgaWYoZW50aXR5LnN0YXRpY0JvZHkpe1xuICAgICAgYm9keURlZi50eXBlID0gIEIyQm9keS5iMl9zdGF0aWNCb2R5O1xuICAgIH0gZWxzZSB7XG4gICAgICBib2R5RGVmLnR5cGUgPSBCMkJvZHkuYjJfZHluYW1pY0JvZHk7XG4gICAgfVxuXG4gICAgYm9keURlZi5wb3NpdGlvbi54ID0gZW50aXR5Lng7XG4gICAgYm9keURlZi5wb3NpdGlvbi55ID0gZW50aXR5Lnk7XG4gICAgYm9keURlZi51c2VyRGF0YSA9IGVudGl0eS5pZDtcbiAgICBib2R5RGVmLmFuZ2xlID0gZW50aXR5LmFuZ2xlO1xuICAgIGJvZHlEZWYubGluZWFyRGFtcGluZyA9IGVudGl0eS5saW5lYXJEYW1waW5nO1xuICAgIGJvZHlEZWYuYW5ndWxhckRhbXBpbmcgPSBlbnRpdHkuYW5ndWxhckRhbXBpbmc7XG4gICAgdmFyIGJvZHkgPSB0aGlzLmIyV29ybGQuQ3JlYXRlQm9keShib2R5RGVmKTtcblxuXG4gICAgaWYgKGVudGl0eS5yYWRpdXMpIHsgLy9jaXJjbGVcbiAgICAgIGZpeERlZi5zaGFwZSA9IG5ldyBCMkNpcmNsZVNoYXBlKGVudGl0eS5yYWRpdXMpO1xuICAgICAgYm9keS5DcmVhdGVGaXh0dXJlKGZpeERlZik7XG4gICAgfSBlbHNlIGlmIChlbnRpdHkucG9pbnRzKSB7IC8vcG9seWdvblxuICAgICAgcG9pbnRzID0gW107XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZW50aXR5LnBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2ZWMgPSBuZXcgQjJWZWMyKCk7XG4gICAgICAgIHZlYy5TZXQoZW50aXR5LnBvaW50c1tpXS54LCBlbnRpdHkucG9pbnRzW2ldLnkpO1xuICAgICAgICBwb2ludHNbaV0gPSB2ZWM7XG4gICAgICB9XG4gICAgICBmaXhEZWYuc2hhcGUgPSBuZXcgQjJQb2x5Z29uU2hhcGUoKTtcbiAgICAgIGZpeERlZi5zaGFwZS5TZXRBc0FycmF5KHBvaW50cywgcG9pbnRzLmxlbmd0aCk7XG4gICAgICBib2R5LkNyZWF0ZUZpeHR1cmUoZml4RGVmKTtcbiAgICB9IGVsc2UgaWYoZW50aXR5LnBvbHlzKSB7IC8vY29tcGxleCBvYmplY3RcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGVudGl0eS5wb2x5cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgcG9pbnRzID0gZW50aXR5LnBvbHlzW2pdO1xuICAgICAgICAgICAgdmVjcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZlYyA9IG5ldyBCMlZlYzIoKTtcbiAgICAgICAgICAgICAgICB2ZWMuU2V0KHBvaW50c1tpXS54LCBwb2ludHNbaV0ueSk7XG4gICAgICAgICAgICAgICAgdmVjc1tpXSA9IHZlYztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpeERlZi5zaGFwZSA9IG5ldyBCMlBvbHlnb25TaGFwZSgpO1xuICAgICAgICAgICAgZml4RGVmLnNoYXBlLlNldEFzQXJyYXkodmVjcywgdmVjcy5sZW5ndGgpO1xuICAgICAgICAgICAgYm9keS5DcmVhdGVGaXh0dXJlKGZpeERlZik7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgeyAvL3JlY3RhbmdsZVxuICAgICAgZml4RGVmLnNoYXBlID0gbmV3IEIyUG9seWdvblNoYXBlKCk7XG4gICAgICBmaXhEZWYuc2hhcGUuU2V0QXNCb3goZW50aXR5LmhhbGZXaWR0aCwgZW50aXR5LmhhbGZIZWlnaHQpO1xuICAgICAgYm9keS5DcmVhdGVGaXh0dXJlKGZpeERlZik7XG4gICAgfVxuXG5cbiAgICB0aGlzLmJvZGllc01hcFtlbnRpdHkuaWRdID0gYm9keTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHBvc2l0aW9uIG9mIGFuIGVudGl0eS5cbiAgICpcbiAgICogVGhpcyBtdXN0IGJlIGRvbmUgb3V0c2lkZSBvZiB0aGUgdXBkYXRlKCkgaXRlcmF0aW9uIVxuICAgKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIEJveCNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGJvZHlJZCBUaGUgaWQgb2YgdGhlIEVudGl0eS9Cb2R5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4IFRoZSBuZXcgeCBjb29yZGluYXRlIGluIGJveDJkIHNwYWNlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5IFRoZSBuZXcgeSBjb29yZGluYXRlIGluIGJveDJkIHNwYWNlXG4gICAqL1xuICBzZXRQb3NpdGlvbihib2R5SWQsIHgsIHkpe1xuICAgIHZhciBib2R5ID0gdGhpcy5ib2RpZXNNYXBbYm9keUlkXTtcbiAgICBib2R5LlNldFBvc2l0aW9uKG5ldyBCMlZlYzIoeCwgeSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgYW5nbGUgb2YgYW4gZW50aXR5LlxuICAgKlxuICAgKiBUaGlzIG11c3QgYmUgZG9uZSBvdXRzaWRlIG9mIHRoZSB1cGRhdGUoKSBpdGVyYXRpb24hXG4gICAqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQm94I1xuICAgKiBAcGFyYW0ge051bWJlcn0gYm9keUlkIFRoZSBpZCBvZiB0aGUgRW50aXR5L0JvZHlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlIFRoZSBuZXcgYW5nbGUgb2YgdGhlIGJvZHkgaW4gcmFkaWFuc1xuICAgKi9cbiAgc2V0QW5nbGUoYm9keUlkLCBhbmdsZSl7XG4gICAgdmFyIGJvZHkgPSB0aGlzLmJvZGllc01hcFtib2R5SWRdO1xuICAgIGNvbnNvbGUubG9nKCdzZXQgYW5nbGUnLCBib2R5LnNldEFuZ2xlLCBib2R5KTtcbiAgICBib2R5LnNldEFuZ2xlKGFuZ2xlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGxpbmVhciB2ZWxvY2l0eSBvZiBhbiBlbnRpdHkuXG4gICAqXG4gICAqIFRoaXMgbXVzdCBiZSBkb25lIG91dHNpZGUgb2YgdGhlIHVwZGF0ZSgpIGl0ZXJhdGlvbiFcbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBCb3gjXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBib2R5SWQgVGhlIGlkIG9mIHRoZSBFbnRpdHkvQm9keVxuICAgKiBAcGFyYW0ge051bWJlcn0geCBUaGUgbmV3IHggY29tcG9uZW50IG9mIHRoZSB2ZWxvY2l0eVxuICAgKiBAcGFyYW0ge051bWJlcn0geSBUaGUgbmV3IHkgY29tcG9uZW50IG9mIHRoZSB2ZWxvY2l0eVxuICAgKi9cbiAgc2V0TGluZWFyVmVsb2NpdHkoYm9keUlkLCB4LCB5KXtcbiAgICB2YXIgYm9keSA9IHRoaXMuYm9kaWVzTWFwW2JvZHlJZF07XG4gICAgYm9keS5TZXRMaW5lYXJWZWxvY2l0eShuZXcgQjJWZWMyKHgsIHkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGFuZ3VsYXIgdmVsb2NpdHkgb2YgYW4gZW50aXR5LlxuICAgKlxuICAgKiBUaGlzIG11c3QgYmUgZG9uZSBvdXRzaWRlIG9mIHRoZSB1cGRhdGUoKSBpdGVyYXRpb24hXG4gICAqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQm94I1xuICAgKiBAcGFyYW0ge051bWJlcn0gYm9keUlkIFRoZSBpZCBvZiB0aGUgRW50aXR5L0JvZHlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZlbG9jaXR5IFRoZSBhbmd1bGFyIHZlbG9jaXR5IGZvciB0aGUgYm9keVxuICAgKi9cbiAgc2V0QW5ndWxhclZlbG9jaXR5KGJvZHlJZCwgdmVsb2NpdHkpe1xuICAgIHZhciBib2R5ID0gdGhpcy5ib2RpZXNNYXBbYm9keUlkXTtcbiAgICBib2R5LlNldEFuZ3VsYXJWZWxvY2l0eSh2ZWxvY2l0eSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgYW4gaW1wdWxzZSB0byBhIGJvZHkgYXQgYW4gYW5nbGUgaW4gZGVncmVlc1xuICAgKlxuICAgKiBUaGlzIG11c3QgYmUgZG9uZSBvdXRzaWRlIG9mIHRoZSB1cGRhdGUoKSBpdGVyYXRpb24hXG4gICAqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQm94I1xuICAgKiBAcGFyYW0ge051bWJlcn0gYm9keUlkIFRoZSBpZCBvZiB0aGUgRW50aXR5L0JvZHlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGRlZ3JlZXMgVGhlIGFuZ2xlIGluIHdoaWNoIHRvIGFwcGx5IHRoZSBpbXB1bHNlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG93ZXIgVGhlIGltcHVsc2UgcG93ZXIuXG4gICAqL1xuICBhcHBseUltcHVsc2VEZWdyZWVzKGJvZHlJZCwgZGVncmVlcywgcG93ZXIpIHtcbiAgICB2YXIgYm9keSA9IHRoaXMuYm9kaWVzTWFwW2JvZHlJZF07XG4gICAgYm9keS5BcHBseUltcHVsc2UoXG4gICAgICBuZXcgQjJWZWMyKE1hdGguc2luKGRlZ3JlZXMgKiAoTWF0aC5QSSAvIDE4MCkpICogcG93ZXIsXG4gICAgICBNYXRoLmNvcyhkZWdyZWVzICogKE1hdGguUEkgLyAxODApKSAqIHBvd2VyICogLTEpLFxuICAgICAgYm9keS5HZXRXb3JsZENlbnRlcigpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBhIGZvcmNlIHRvIGEgYm9keSBhdCBhbiBhbmdsZSBpbiBkZWdyZWVzXG4gICAqXG4gICAqIFRoaXMgbXVzdCBiZSBkb25lIG91dHNpZGUgb2YgdGhlIHVwZGF0ZSgpIGl0ZXJhdGlvbiFcbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBCb3gjXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBib2R5SWQgVGhlIGlkIG9mIHRoZSBFbnRpdHkvQm9keVxuICAgKiBAcGFyYW0ge051bWJlcn0gZGVncmVlcyBUaGUgYW5nbGUgaW4gd2hpY2ggdG8gYXBwbHkgdGhlIGZvcmNlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG93ZXIgVGhlIHBvd2VyIG9mIHRoZSBmb3JjZS4gKFRoZSBhYmlsaXR5IHRvIGRlc3Ryb3kgYSBwbGFuZXQgaXMgaW5zaWduaWZpY2FudCBuZXh0IHRvIHRoaXMpXG4gICAqL1xuICBhcHBseUZvcmNlRGVncmVlcyhib2R5SWQsIGRlZ3JlZXMsIHBvd2VyKSB7XG4gICAgdmFyIGJvZHkgPSB0aGlzLmJvZGllc01hcFtib2R5SWRdO1xuICAgIGJvZHkuQXBwbHlGb3JjZShcbiAgICAgIG5ldyBCMlZlYzIoTWF0aC5zaW4oZGVncmVlcyAqIChNYXRoLlBJIC8gMTgwKSkgKiBwb3dlcixcbiAgICAgIE1hdGguY29zKGRlZ3JlZXMgKiAoTWF0aC5QSSAvIDE4MCkpICogcG93ZXIgKiAtMSksXG4gICAgICBib2R5LkdldFdvcmxkQ2VudGVyKClcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGFuIGltcHVsc2UgdG8gYSBib2R5IGF0IGFuIGFuZ2xlIGluIHJhZGlhbnNcbiAgICpcbiAgICogVGhpcyBtdXN0IGJlIGRvbmUgb3V0c2lkZSBvZiB0aGUgdXBkYXRlKCkgaXRlcmF0aW9uIVxuICAgKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIEJveCNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGJvZHlJZCBUaGUgaWQgb2YgdGhlIEVudGl0eS9Cb2R5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpYW5zIFRoZSBhbmdsZSBpbiB3aGljaCB0byBhcHBseSB0aGUgaW1wdWxzZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvd2VyIFRoZSBpbXB1bHNlIHBvd2VyLlxuICAgKi9cbiAgYXBwbHlJbXB1bHNlKGJvZHlJZCwgcmFkaWFucywgcG93ZXIpIHtcbiAgICB2YXIgYm9keSA9IHRoaXMuYm9kaWVzTWFwW2JvZHlJZF07XG4gICAgYm9keS5BcHBseUltcHVsc2UoXG4gICAgICBuZXcgQjJWZWMyKE1hdGguc2luKHJhZGlhbnMpICogcG93ZXIsXG4gICAgICBNYXRoLmNvcyhyYWRpYW5zKSAqIHBvd2VyICogLTEpLFxuICAgICAgYm9keS5HZXRXb3JsZENlbnRlcigpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBhIGZvcmNlIHRvIGEgYm9keSBhdCBhbiBhbmdsZSBpbiByYWRpYW5zXG4gICAqXG4gICAqIFRoaXMgbXVzdCBiZSBkb25lIG91dHNpZGUgb2YgdGhlIHVwZGF0ZSgpIGl0ZXJhdGlvbiFcbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBCb3gjXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBib2R5SWQgVGhlIGlkIG9mIHRoZSBFbnRpdHkvQm9keVxuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaWFucyBUaGUgYW5nbGUgaW4gd2hpY2ggdG8gYXBwbHkgdGhlIGZvcmNlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG93ZXIgVGhlIHBvd2VyIG9mIHRoZSBmb3JjZS4gKFRoZSBhYmlsaXR5IHRvIGRlc3Ryb3kgYSBwbGFuZXQgaXMgaW5zaWduaWZpY2FudCBuZXh0IHRvIHRoaXMpXG4gICAqL1xuICBhcHBseUZvcmNlKGJvZHlJZCwgcmFkaWFucywgcG93ZXIpIHtcbiAgICB2YXIgYm9keSA9IHRoaXMuYm9kaWVzTWFwW2JvZHlJZF07XG4gICAgYm9keS5BcHBseUZvcmNlKFxuICAgICAgbmV3IEIyVmVjMihNYXRoLnNpbihyYWRpYW5zKSAqIHBvd2VyLFxuICAgICAgTWF0aC5jb3MocmFkaWFucykgKiBwb3dlciAqIC0xKSxcbiAgICAgIGJvZHkuR2V0V29ybGRDZW50ZXIoKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgdG9ycXVlIChyb3RhdGlvbiBmb3JjZSkgdG8gYSBib2R5LlxuICAgKiBQb3NpdGl2ZSB2YWx1ZXMgYXJlIGNsb2Nrd2lzZSwgbmVnYXRpdmUgdmFsdWVzIGFyZSBjb3VudGVyLWNsb2Nrd2lzZS5cbiAgICpcbiAgICogVGhpcyBtdXN0IGJlIGRvbmUgb3V0c2lkZSBvZiB0aGUgdXBkYXRlKCkgaXRlcmF0aW9uIVxuICAgKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIEJveCNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGJvZHlJZCBUaGUgaWQgb2YgdGhlIEVudGl0eS9Cb2R5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb3dlciBUaGUgcG93ZXIgb2YgdGhlIHRvcnF1ZS5cbiAgICovXG4gIGFwcGx5VG9ycXVlKGJvZHlJZCwgcG93ZXIpIHtcbiAgICB2YXIgYm9keSA9IHRoaXMuYm9kaWVzTWFwW2JvZHlJZF07XG4gICAgYm9keS5BcHBseVRvcnF1ZShwb3dlcik7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgd29ybGQncyBncmF2aXR5XG4gICAqXG4gICAqIFRoaXMgbXVzdCBiZSBkb25lIG91dHNpZGUgb2YgdGhlIHVwZGF0ZSgpIGl0ZXJhdGlvbiFcbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBCb3gjXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2ZWN0b3IgQW4gb2JqZWN0IHdpdGggeCBhbmQgeSB2YWx1ZXMgaW4gbWV0ZXJzIHBlciBzZWNvbmQgc3F1YXJlZC5cbiAgICovXG4gIHNldEdyYXZpdHkodmVjdG9yKSB7XG4gICAgdGhpcy5iMldvcmxkLlNldEdyYXZpdHkobmV3IEIyVmVjMih2ZWN0b3IueCwgdmVjdG9yLnkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBib2R5IGZyb20gdGhlIGJveDJkIHdvcmxkXG4gICAqXG4gICAqIFRoaXMgbXVzdCBiZSBkb25lIG91dHNpZGUgb2YgdGhlIHVwZGF0ZSgpIGl0ZXJhdGlvbiFcbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBCb3gjXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBib2R5SWQgVGhlIGlkIG9mIHRoZSBFbnRpdHkvQm9keVxuICAgKi9cbiAgcmVtb3ZlQm9keShpZCkge1xuICAgIGlmKHRoaXMuYm9kaWVzTWFwW2lkXSl7XG4gICAgICBpZih0aGlzLmZpeHR1cmVzTWFwW2lkXSl7XG4gICAgICAgIHRoaXMuYm9kaWVzTWFwW2lkXS5EZXN0cm95Rml4dHVyZSh0aGlzLmZpeHR1cmVzTWFwW2lkXSk7XG4gICAgICB9XG4gICAgICB0aGlzLmIyV29ybGQuRGVzdHJveUJvZHkodGhpcy5ib2RpZXNNYXBbaWRdKTtcbiAgICAgIC8vZGVsZXRlIHRoaXMuZml4dHVyZXNNYXBbaWRdO1xuICAgICAgZGVsZXRlIHRoaXMuYm9kaWVzTWFwW2lkXTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2FrZSB1cCBhIGJvZHkgaW4gdGhlIGJveDJkIHdvcmxkIHNvIHRoYXQgYm94MmQgd2lsbCBjb250aW51ZSB0byBydW4gY2FsY3VsYXRpb25zIG9uIGl0LlxuICAgKlxuICAgKiBUaGlzIG11c3QgYmUgZG9uZSBvdXRzaWRlIG9mIHRoZSB1cGRhdGUoKSBpdGVyYXRpb24hXG4gICAqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQm94I1xuICAgKiBAcGFyYW0ge051bWJlcn0gYm9keUlkIFRoZSBpZCBvZiB0aGUgRW50aXR5L0JvZHlcbiAgICovXG4gIHdha2VVcEJvZHkoaWQpIHtcbiAgICBpZih0aGlzLmJvZGllc01hcFtpZF0pe1xuICAgICAgdGhpcy5ib2RpZXNNYXBbaWRdLlNldEF3YWtlKHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjb250YWN0TGlzdGVuZXIgdG8gdGhlIGIyV29ybGRcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBCb3gjXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjYWxsYmFja3MgT2JqZWN0IGNvbnRhaW5pbmcgYSBiZWdpbkNvbnRhbnQsIGVuZENvbnRhY3QgYW5kL29yIHByZVNvbHZlL3Bvc3RTb2x2ZSBrZXlzIGFuZCBjYWxsYmFja3NcbiAgICovXG4gIGFkZENvbnRhY3RMaXN0ZW5lcihjb250YWN0TGlzdGVuZXIpe1xuICAgIHZhciBsaXN0ZW5lciA9IG5ldyBCb3gyRC5EeW5hbWljcy5iMkNvbnRhY3RMaXN0ZW5lcigpO1xuICAgIGlmKGNvbnRhY3RMaXN0ZW5lci5iZWdpbkNvbnRhY3Qpe1xuICAgICAgbGlzdGVuZXIuQmVnaW5Db250YWN0ID0gZnVuY3Rpb24oY29udGFjdCl7XG4gICAgICAgIGNvbnRhY3RMaXN0ZW5lci5iZWdpbkNvbnRhY3QoY29udGFjdC5tX2ZpeHR1cmVBLm1fYm9keS5tX3VzZXJEYXRhLCBjb250YWN0Lm1fZml4dHVyZUIubV9ib2R5Lm1fdXNlckRhdGEsIGNvbnRhY3QpO1xuICAgICAgfTtcbiAgICB9XG4gICAgaWYoY29udGFjdExpc3RlbmVyLmVuZENvbnRhY3Qpe1xuICAgICAgbGlzdGVuZXIuRW5kQ29udGFjdCA9IGZ1bmN0aW9uKGNvbnRhY3Qpe1xuICAgICAgICBjb250YWN0TGlzdGVuZXIuZW5kQ29udGFjdChjb250YWN0Lm1fZml4dHVyZUEubV9ib2R5Lm1fdXNlckRhdGEsIGNvbnRhY3QubV9maXh0dXJlQi5tX2JvZHkubV91c2VyRGF0YSwgY29udGFjdCk7XG4gICAgICB9O1xuICAgIH1cbiAgICBpZihjb250YWN0TGlzdGVuZXIucHJlU29sdmUpe1xuICAgICAgbGlzdGVuZXIuUHJlU29sdmUgPSBmdW5jdGlvbihjb250YWN0LCBvbGRNYW5pZm9sZCl7XG4gICAgICAgIGNvbnRhY3RMaXN0ZW5lci5wcmVTb2x2ZShjb250YWN0Lm1fZml4dHVyZUEubV9ib2R5Lm1fdXNlckRhdGEsIGNvbnRhY3QubV9maXh0dXJlQi5tX2JvZHkubV91c2VyRGF0YSwgb2xkTWFuaWZvbGQsIGNvbnRhY3QpO1xuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGNvbnRhY3RMaXN0ZW5lci5wb3N0U29sdmUpe1xuICAgICAgbGlzdGVuZXIuUG9zdFNvbHZlID0gZnVuY3Rpb24oY29udGFjdCwgaW1wdWxzZSl7XG4gICAgICAgIGNvbnRhY3RMaXN0ZW5lci5wb3N0U29sdmUoY29udGFjdC5tX2ZpeHR1cmVBLm1fYm9keS5tX3VzZXJEYXRhLCBjb250YWN0Lm1fZml4dHVyZUIubV9ib2R5Lm1fdXNlckRhdGEsIGltcHVsc2UsIGNvbnRhY3QpO1xuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5iMldvcmxkLlNldENvbnRhY3RMaXN0ZW5lcihsaXN0ZW5lcik7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgam9pbnQgZnJvbSB0aGUgd29ybGQuXG4gICAqXG4gICAqIFRoaXMgbXVzdCBiZSBkb25lIG91dHNpZGUgb2YgdGhlIHVwZGF0ZSgpIGl0ZXJhdGlvbiwgYW5kIEJFRk9SRSBhbnkgYm9kaWVzIGNvbm5lY3RlZCB0byB0aGUgam9pbnQgYXJlIHJlbW92ZWQhXG4gICAqXG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQm94I1xuICAgKiBAcGFyYW0ge051bWJlcn0gam9pbnRJZCBUaGUgaWQgb2Ygam9pbnQgdG8gYmUgZGVzdHJveWVkLlxuICAgKi9cbiAgcmVtb3ZlSm9pbnQoam9pbnRJZCkge1xuICAgIGlmKHRoaXMuam9pbnRzTWFwW2pvaW50SWRdKXtcbiAgICAgIHRoaXMuYjJXb3JsZC5EZXN0cm95Sm9pbnQodGhpcy5qb2ludHNNYXBbam9pbnRJZF0pO1xuICAgICAgZGVsZXRlIHRoaXMuam9pbnRzTWFwW2pvaW50SWRdO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBqb2ludCB0byB0aGUgYm94MmQgd29ybGQuXG4gICAqXG4gICAqIFRoaXMgbXVzdCBiZSBkb25lIG91dHNpZGUgb2YgdGhlIHVwZGF0ZSgpIGl0ZXJhdGlvbiFcbiAgICpcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBCb3gjXG4gICAqIEBwYXJhbSB7Sm9pbnR9IEEgam9pbnQgZGVmaW5pdGlvbi5cbiAgICovXG4gIGFkZEpvaW50KGpvaW50KSB7XG4gICAgaWYoam9pbnQgJiYgam9pbnQuaWQgJiYgIXRoaXMuam9pbnRzTWFwW2pvaW50LmlkXSl7XG5cbiAgICAgIGlmKCFqb2ludC5hbHJlYWR5U2NhbGVkICYmIGpvaW50LnNjYWxlSm9pbnRMb2NhdGlvbil7XG4gICAgICAgIGpvaW50LnNjYWxlSm9pbnRMb2NhdGlvbigxIC8gdGhpcy5zY2FsZSk7XG4gICAgICAgIGpvaW50LnNjYWxlID0gdGhpcy5zY2FsZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGIySm9pbnQgPSBqb2ludC5jcmVhdGVCMkpvaW50KHRoaXMpO1xuICAgICAgaWYoYjJKb2ludCl7XG4gICAgICAgIHRoaXMuam9pbnRzTWFwW2pvaW50LmlkXSA9IGIySm9pbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm94O1xuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2JveDJkL0JveC5qc1xuLy8gbW9kdWxlIGlkID0gNDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGlzIGNvbnRhY3QgbGlzdGVuZXIgZm9yIHRoZSBCb3gyZCB3b3JsZCBhc3NpZ25zIGNvbGxpc2lvbiBvYmplY3RzIHRvIGVudGl0aWVzIHdoZW4gdGhleSBjb2xsaWRlLlxuICogQG5hbWUgQ29udGFjdFxuICogQGNvbnN0cnVjdG9yIENvbnRhY3RcbiAqL1xuXG5jbGFzcyBDb250YWN0IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KXtcblxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbGxpc2lvbnMgPSB0aGlzLmNvbGxpc2lvbnMgfHwge307XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBzdGF0ZSBvZiB0aGUgY29udGFjdCBsaXN0ZW5lciBwZXIgaXRlcmF0aW9uIG9mIHRoZSBib3ggd29ybGQgY2FsY3VsYXRpb25zLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIENvbnRhY3QjXG4gICAqL1xuICByZXNldCgpe1xuICAgIHRoaXMuY29sbGlzaW9ucyA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGEgYm94MmQgY29sbGlzb24gYmVnaW5zXG4gICAqIEBmdW5jdGlvbiBiZWdpbkNvbnRhY3RcbiAgICogQG1lbWJlck9mIENvbnRhY3QjXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZEEgSWQgb2YgYm9keSBBXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZEIgSWQgb2YgYm9keSBCXG4gICAqIEBwYXJhbSB7YjJDb250YWNudH0gY29udGFjdCBUaGUgYm94MmQgY29udGFjdCBvYmplY3QuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBhIGJveDJkIGNvbGxpc29uIGVuZHNcbiAgICogQGZ1bmN0aW9uIGVuZENvbnRhY3RcbiAgICogQG1lbWJlck9mIENvbnRhY3QjXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZEEgSWQgb2YgYm9keSBBXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZEIgSWQgb2YgYm9keSBCXG4gICAqIEBwYXJhbSB7YjJDb250YWN0fSBjb250YWN0IFRoZSBib3gyZCBjb250YWN0IG9iamVjdC5cbiAgKi9cblxuICAvKipcbiAgICogQ2FsbGVkIGJlZm9yZSBhIGJveDJkIGNvbGxpc29uIGlzIHJlc29sdmVkXG4gICAqIEBmdW5jdGlvbiBwcmVTb2x2ZVxuICAgKiBAbWVtYmVyT2YgQ29udGFjdCNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkQSBJZCBvZiBib2R5IEFcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkQiBJZCBvZiBib2R5IEJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9sZE1hbmlmb2xkIE9sZCBtYW5pZm9sZCBvYmplY3QgcGFzc2VkIGludG8gcHJlU29sdmUgbGlzdGVuZXJcbiAgICogQHBhcmFtIHtiMkNvbnRhY3R9IGNvbnRhY3QgVGhlIGJveDJkIGNvbnRhY3Qgb2JqZWN0LlxuICAqL1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYWZ0ZXIgYSBib3gyZCBjb2xsaXNvbiBpcyByZXNvbHZlZFxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIENvbnRhY3QjXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZEEgSWQgb2YgYm9keSBBXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZEIgSWQgb2YgYm9keSBCXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBpbXB1bHNlIEltcHVsc2Ugb2JqZWN0IHBhc3NlZCBpbnRvIHBvc3RTb2x2ZSBsaXN0ZW5lclxuICAgKiBAcGFyYW0ge2IyQ29udGFjdH0gY29udGFjdCBUaGUgYm94MmQgY29udGFjdCBvYmplY3QuXG4gICovXG4gIHBvc3RTb2x2ZShpZEEsIGlkQiwgaW1wdWxzZSwgY29udGFjdCl7XG4gICAgdGhpcy5jb2xsaXNpb25zW2lkQV0gPSB0aGlzLmNvbGxpc2lvbnNbaWRBXSB8fCBbXTtcbiAgICB0aGlzLmNvbGxpc2lvbnNbaWRBXS5wdXNoKHtpZDogaWRCLCBpbXB1bHNlOiBpbXB1bHNlLm5vcm1hbEltcHVsc2VzWzBdfSk7XG4gICAgdGhpcy5jb2xsaXNpb25zW2lkQl0gPSB0aGlzLmNvbGxpc2lvbnNbaWRCXSB8fCBbXTtcbiAgICB0aGlzLmNvbGxpc2lvbnNbaWRCXS5wdXNoKHtpZDogaWRBLCBpbXB1bHNlOiBpbXB1bHNlLm5vcm1hbEltcHVsc2VzWzBdfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb250YWN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ib3gyZC9saXN0ZW5lcnMvQ29udGFjdC5qc1xuLy8gbW9kdWxlIGlkID0gNDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBUaGlzIGlzIGEgY29udmVuaWVuY2Ugb2JqZWN0IHRoYXQgYWxsb3dzIGZvciBxdWlja2x5IGNyZWF0aW5nIGEgYm94MmQgYmFzZWQgZ2FtZS5cbiAqIEBuYW1lIEJveEdhbWVcbiAqIEBjb25zdHJ1Y3RvciBCb3hHYW1lXG4gKiBAZXh0ZW5kcyBHYW1lQ29yZVxuICovXG5cbmNvbnN0IEdhbWVDb3JlID0gcmVxdWlyZSgnLi4vR2FtZUNvcmUnKTtcbmNvbnN0IEJveCA9IHJlcXVpcmUoJy4vQm94Jyk7XG5cbmNsYXNzIEJveEdhbWUgZXh0ZW5kcyBHYW1lQ29yZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSl7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgY29uc29sZS5sb2coJ2JveGdhbWUgb3B0aW9ucycsIG9wdGlvbnMpO1xuICAgIC8qKlxuICAgICAqIFRoZSBpbnN0YW5jZSBvZiBCb3ggdXNlZCBmb3IgdGhpcyBnYW1lLlxuICAgICAqIEB0eXBlIHtCb3h9XG4gICAgICogQG1lbWJlck9mIEJveEdhbWUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmJveCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBib3ggc2hvdWxkIHBlcmZvcm0gY2FsY3VsYXRpb25zIGR1cmluZyBpdHMgdXBkYXRlIGN5Y2xlXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG1lbWJlck9mIEJveEdhbWUjXG4gICAgICogQGRlZmF1bHRcbiAgICAgKi9cbiAgICB0aGlzLmJveFVwZGF0aW5nID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEEgbWFwIG9mIEVudGl0eSBvYmplY3RzIHRoYXQgYXJlIGFkZGVkIHRvIHRoZSBCb3hcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBtZW1iZXJPZiBCb3hHYW1lI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5lbnRpdGllcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBBIG1hcCBvZiBKb2ludCBvYmplY3RzIHRoYXQgYXJlIGFkZGVkIHRvIHRoZSBCb3hcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBtZW1iZXJPZiBCb3hHYW1lI1xuICAgICAqIEBkZWZhdWx0XG4gICAgICovXG4gICAgdGhpcy5qb2ludHMgPSBudWxsO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKTtcblxuICAgIGlmKCF0aGlzLmJveCl7XG4gICAgICB0aGlzLmJveCA9IG5ldyBCb3gob3B0aW9ucy5ib3hPcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZighdGhpcy5lbnRpdGllcyl7XG4gICAgICB0aGlzLmVudGl0aWVzID0ge307XG4gICAgfVxuXG4gICAgaWYoIXRoaXMuam9pbnRzKXtcbiAgICAgIHRoaXMuam9pbnRzID0ge307XG4gICAgfVxuXG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgYWxsIHBoeXNpY3MgY2FsY3VsYXRpb25zIGluIHRoZSBCb3hcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBCb3hHYW1lI1xuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IG1pbGxpcyBUaGUgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBwYXNzZWQgc2luY2UgbGFzdCBpdGVyYXRpb24gb2YgZ2FtZUxvb3BcbiAgICovXG4gIHVwZGF0ZUJveChtaWxsaXMpe1xuICAgIGlmKHRoaXMuYm94VXBkYXRpbmcpe1xuICAgICAgdGhpcy5ib3gudXBkYXRlKG1pbGxpcyk7XG4gICAgICB0aGlzLmJveC51cGRhdGVFeHRlcm5hbFN0YXRlKHRoaXMuZW50aXRpZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIEVudGl0eSBvYmplY3QgdG8gZW50aXRpZXMgYW5kIGJveFxuICAgKiBAZnVuY3Rpb25cbiAgICogQG1lbWJlck9mIEJveEdhbWUjXG4gICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgRW50aXR5IHRvIGFkZFxuICAgKi9cbiAgYWRkQm9keShlbnRpdHkpe1xuICAgIHRoaXMuZW50aXRpZXNbZW50aXR5LmlkXSA9IGVudGl0eTtcbiAgICB0aGlzLmJveC5hZGRCb2R5KGVudGl0eSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHNlcmllcyBvZiBFbnRpdHkgb2JqZWN0cyB0byBlbnRpdGllcyBhbmQgYm94XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQm94R2FtZSNcbiAgICogQHBhcmFtIHtBcnJheXxFbnRpdHl9IGVudGl0aWVzIENhbiB0YWtlIGFuIGFycmF5IG9mIEVudGl0eSBvYmplY3RzIG9yIGFueSBudW1iZXIgb2YgRW50aXR5IG9iamVjdHNcbiAgICovXG4gIGFkZEJvZGllcyhlbnRpdGllcyl7XG4gICAgaWYoIUFycmF5LmlzQXJyYXkoZW50aXRpZXMpKSB7XG4gICAgICBlbnRpdGllcyA9IFtlbnRpdGllc107XG4gICAgfVxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBlbnRpdGllcy5mb3JFYWNoKChlbnRpdHkpID0+IHtcbiAgICAgIHRoaXMuYWRkQm9keShlbnRpdHkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYW4gRW50aXR5IG9iamVjdCBmcm9tIGVudGl0aWVzIGFuZCBib3hcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBCb3hHYW1lI1xuICAgKiBAcGFyYW0gIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVCb2R5KGVudGl0eSl7XG4gICAgdGhpcy5ib3gucmVtb3ZlQm9keShlbnRpdHkuaWQpO1xuICAgIGRlbGV0ZSB0aGlzLmVudGl0aWVzW2VudGl0eS5pZF07XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIHNlcmllcyBvZiBFbnRpdHkgb2JqZWN0cyBmcm9tIGVudGl0aWVzIGFuZCBib3hcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBCb3hHYW1lI1xuICAgKiBAcGFyYW0ge0FycmF5fEVudGl0eX0gZW50aXRpZXMgQ2FuIHRha2UgYW4gYXJyYXkgb2YgRW50aXR5IG9iamVjdHMgb3IgYW55IG51bWJlciBvZiBFbnRpdHkgb2JqZWN0c1xuICAgKi9cbiAgcmVtb3ZlQm9kaWVzKGVudGl0aWVzKXtcbiAgICBpZighQXJyYXkuaXNBcnJheShlbnRpdGllcykpIHtcbiAgICAgIGVudGl0aWVzID0gW2VudGl0aWVzXTtcbiAgICB9XG4gICAgZW50aXRpZXMuZm9yRWFjaCgoZW50aXR5KSA9PiB7XG4gICAgICB0aGlzLnJlbW92ZUJvZHkoZW50aXR5KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgSm9pbnQgdG8gam9pbnRzIGFuZCBib3hcbiAgICogQGZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBCb3hHYW1lI1xuICAgKiBAcGFyYW0ge0pvaW50fSBqb2ludCBKb2ludCB0byBhZGRcbiAgICovXG4gIGFkZEpvaW50KGpvaW50KXtcbiAgICB0aGlzLmpvaW50c1tqb2ludC5pZF0gPSBqb2ludDtcbiAgICB0aGlzLmJveC5hZGRKb2ludChqb2ludCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHNlcmllcyBvZiBKb2ludCBvYmplY3RzIHRvIGpvaW50cyBhbmQgYm94XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQm94R2FtZSNcbiAgICogQHBhcmFtIHtBcnJheXxKb2ludH0gam9pbnRzIENhbiB0YWtlIGFuIGFycmF5IG9mIEpvaW50IG9iamVjdHMgb3IgYW55IG51bWJlciBvZiBKb2ludCBvYmplY3RzXG4gICAqL1xuICBhZGRKb2ludHMoam9pbnRzKXtcbiAgICBpZighQXJyYXkuaXNBcnJheShqb2ludHMpKSB7XG4gICAgICBqb2ludHMgPSBbam9pbnRzXTtcbiAgICB9XG4gICAgam9pbnRzLmZvckVhY2goKGVudGl0eSkgPT4ge1xuICAgICAgdGhpcy5hZGRKb2ludChlbnRpdHkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBKb2ludCBmcm9tIGpvaW50cyBhbmQgYm94XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQm94R2FtZSNcbiAgICogQHBhcmFtICB7Sm9pbnR9IGpvaW50IEpvaW50IHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlSm9pbnQoam9pbnQpe1xuICAgIHRoaXMuYm94LnJlbW92ZUpvaW50KGpvaW50LmlkKTtcbiAgICBkZWxldGUgdGhpcy5qb2ludHNbam9pbnQuaWRdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBzZXJpZXMgb2YgSm9pbnQgb2JqZWN0cyBmcm9tIGpvaW50cyBhbmQgYm94XG4gICAqIEBmdW5jdGlvblxuICAgKiBAbWVtYmVyT2YgQm94R2FtZSNcbiAgICogQHBhcmFtIHtBcnJheXxKb2ludH0gam9pbnRzIENhbiB0YWtlIGFuIGFycmF5IG9mIEpvaW50IG9iamVjdHMgb3IgYW55IG51bWJlciBvZiBKb2ludCBvYmplY3RzXG4gICAqL1xuICByZW1vdmVKb2ludHMoam9pbnRzKXtcbiAgICBpZighQXJyYXkuaXNBcnJheShqb2ludHMpKSB7XG4gICAgICBqb2ludHMgPSBbam9pbnRzXTtcbiAgICB9XG4gICAgam9pbnRzLmZvckVhY2goKGVudGl0eSkgPT4ge1xuICAgICAgdGhpcy5yZW1vdmVKb2ludChlbnRpdHkpO1xuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm94R2FtZTtcblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ib3gyZC9Cb3hHYW1lLmpzXG4vLyBtb2R1bGUgaWQgPSA0MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9