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

define([
  'dcl',
  'dcl/bases/Mixer',
  'dojo/_base/lang',
  'dojo/dom',
  './InputManager',
  './ResourceManager',
  './shims/RAF'
], function(dcl, Mixer, lang, dom, InputManager, ResourceManager){

  'use strict';

 /**
 * The GameCore class provides the base to build games on.
 * @name GameCore
 * @class GameCore
 * @example
var myGame = new GameCore({
  canvasId: 'myCanvas',
  update: function(millis){
    // do updating of game state
  },
  draw: function(context){
    // do drawing of the game
  }
});

//start the game
myGame.run();

 */

  return dcl(Mixer, {
    statics: {
      FONT_SIZE: 24
    },
    isRunning: false,
    canvasId: null,
    maxStep: 40, //max number of milliseconds between updates. (in case user switches tabs and requestAnimationFrame pauses)
    contextType: '2d',
    height: 0,
    width: 0,
    resourceManager: null,
    inputManager: null,
    loadingForeground: '#00F',
    loadingBackground: '#FFF',
    gameAreaId: null,
    canvasPercentage: 0,
    /**
      * Signals the game loop that it's time to quit
      * @name GameCore#stop
      * @function
      *
    */
    stop: function() {
        this.isRunning = false;
    },
    /**
      * Launches the game.
      * @name GameCore#run
      * @function
      *
    */
    run: function() {
      if(!this.isRunning){
        this.init();
        this.loadResources(this.resourceManager);
        this.initInput(this.inputManager);
        this.launchLoop();
      }
    },
    /**
      * Can be overidden in GameCore subclasses to load images and sounds
      * @name GameCore#loadResources
      * @function
      * @param {ResourceManager} resourceManager
      *
    */
    loadResources: function(resourceManager){},
    /**
      * Sets the screen mode and initiates and objects.
      * @name GameCore#init
      * @function
      *
    */
    init: function() {
      if(!this.canvas){
        this.canvas = dom.byId(this.canvasId);
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
      //try using game object's dimensions, or set dimensions to canvas if none are specified
      if(this.height){
        this.canvas.height = this.height;
      } else {
        this.height = this.canvas.height;
      }
      if(this.width){
        this.canvas.width = this.width;
      } else {
        this.width = this.canvas.width;
      }


      if(!this.inputManager){
        //hande resizing if gameArea and canvasPercentage are specified
        if(this.gameAreaId && this.canvasPercentage){
          this.inputManager = new InputManager({
            canvas: this.canvas,
            gameArea: dom.byId(this.gameAreaId),
            canvasPercentage: this.canvasPercentage
          });
        }else{
          this.inputManager = new InputManager({
          canvas: this.canvas
        });
        }

      }

      this.inputManager.resize();

      if(!this.resourceManager){
        this.resourceManager = new ResourceManager();
      }
      this.loadResources(this.resourceManager);

      this.isRunning = true;


    },
    /**
      * Can be overidden in the subclasses to map user input to actions
      * @name GameCore#initInput
      * @function
      * @param {InputManager} inputManager
      *
    */
    initInput: function(inputManager) {},
    /**
      * Can be overidden in the subclasses to deal with user input before updating the game state
      * @name GameCore#handleInput
      * @function
      * @param {InputManager} inputManager
      * @param {Number} elapsedTime elapsed time in milliseconds
      *
    */
    handleInput: function(inputManager,elapsedTime) {},
    /**
      * Runs through the game loop until stop() is called.
      * @name GameCore#gameLoop
      * @function
      *
    */
    gameLoop: function() {
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
    },
    /**
      * Launches the game loop.
      * @name GameCore#launchLoop
      * @function
      *
    */
    launchLoop: function(){
      this.elapsedTime = 0;
      var startTime = Date.now();
      this.currTime = startTime;
      this.prevTime = startTime;

      //need to keep the context defined here so the game loop has access to it
      this.loopRunner = lang.hitch(this, this.loopRunner);
      window.requestAnimationFrame(this.loopRunner);
    },
    loopRunner: function(){
      this.gameLoop();
      window.requestAnimationFrame(this.loopRunner);
    },
    /**
      * Should be overridden to update the state of the game/animation based on the amount of elapsed time that has passed.
      * @name GameCore#update
      * @function
      * @param {Number} elapsedTime elapsed time in milliseconds
      *
    */
    update: function(elapsedTime) {},
    /**
      * Can be overridden to update the state of the game/animation while a custom loading screen is displayed.
      * @name GameCore#updateLoadingScreen
      * @function
      * @param {Number} elapsedTime elapsed time in milliseconds
      *
    */
    updateLoadingScreen: function(elapsedTime) {},
    /**
      * Draws to the screen. Subclasses or instances must override this method to paint items to the screen.
      * @name GameCore#draw
      * @function
      * @param {Context} context An HTML5 canvas drawing context.
      *
    */
    draw: function(context){
      if(this.contextType === '2d'){
        context.font = "14px sans-serif";
        context.fillText("This game does not have its own draw function!", 10, 50);
      }
    },
    /**
      * Draws the progress of the resource manger to the screen while loading.
      * Subclasses or instances may override for custom loading animations.
      * @name GameCore#drawLoadingScreen
      * @function
      * @param {Context} context An HTML5 canvas drawing context.
      *
    */
    drawLoadingScreen: function(context){
      if(this.resourceManager && (this.contextType === '2d')){
        context.fillStyle   = this.loadingBackground;
        context.fillRect(0,0, this.width,this.height);

        context.fillStyle   = this.loadingForeground;
        context.strokeStyle = this.loadingForeground;

        var textPxSize =  Math.floor(this.height/12);

        context.font = "bold " + textPxSize + "px sans-serif";

        context.fillText("Loading... " + this.resourceManager.getPercentComplete() + "%", this.width * 0.1, this.height * 0.55);

        context.strokeRect(this.width * 0.1, this.height * 0.7,this.width * 0.8, this.height * 0.1);
        context.fillRect(this.width * 0.1, this.height * 0.7,(this.width * 0.8) * this.resourceManager.getPercentComplete()/100, this.height * 0.1);

        context.lineWidth   = 4;
      }
    }
  });

});
