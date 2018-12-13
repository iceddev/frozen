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

const InputManager = require('./InputManager');
const ResourceManager = require('./ResourceManager');

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
