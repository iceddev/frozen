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

/*********************** mwe.GameCore ********************************************/
define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/dom', './InputManager', './ResourceManager', './shims/RAF'], function(declare, lang, dom, InputManager, ResourceManager){

  return declare(null, {
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
    constructor: function(args){
      declare.safeMixin(this, args);
    },
    /**
      Signals the game loop that it's time to quit
    */
    stop: function() {
        this.isRunning = false;
    },
    /**
      Calls init() and gameLoop()
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
      Should be overidden in the subclasses to create images
    */
    loadResources: function(resourceManager){},
    /**
      Sets full screen mode and initiates and objects.
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
        this.inputManager = new InputManager({
          canvas: this.canvas
        });
      }

      if(!this.resourceManager){
        this.resourceManager = new ResourceManager();
      }
      this.loadResources(this.resourceManager);

      this.isRunning = true;


    },
    /**
      Should be overidden in the subclasses to map input to actions
    */
    initInput: function(inputManager) {},
    /**
      Should be overidden in the subclasses to deal with user input
    */
    handleInput: function(inputManager,elapsedTime) {},
    /**
      Runs through the game loop until stop() is called.
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
      Launches the game loop.
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
      Updates the state of the game/animation based on the amount of elapsed time that has passed.
    */
    update: function(elapsedTime) {
      //overide this function in your game instance
    },
    /**
      Override this if want to use it update sprites/objects on loading screen
    */
    updateLoadingScreen: function(elapsedTime) {},
    /**
      Draws to the screen. Subclasses or instances must override this method to paint items to the screen.
    */
    draw: function(context){
      if(this.contextType === '2d'){
        context.font = "14px sans-serif";
        context.fillText("This game does not have its own draw function!", 10, 50);
      }
    },
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
