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

dojo.provide("mwe.InputManager");

/*********************** mwe.InputManager ********************************************/
dojo.declare("mwe.InputManager",null,{
	
	keyActions: [],
	mouseAction: null,
	touchAction: null,
	
	canvas: null,

    constructor: function(args){
		dojo.safeMixin(this, args);
		dojo.connect(document,"onkeydown",this,this.keyPressed);
		dojo.connect(document,"onkeyup",this,this.keyReleased);
		dojo.connect(this.canvas,"onmousedown",this,this.mouseDown);
		dojo.connect(document,"onmouseup",this,this.mouseUp);
		dojo.connect(this.canvas,"onmousemove",this,this.mouseMove);
		
		dojo.connect(document,'ontouchend',this,this.touchEnd);
		dojo.connect(this.canvas,'ontouchstart',this.touchStart);
		dojo.connect(this.canvas,'ontouchmove',this.touchMove);
	},


    /**
    Maps a GameAction to a specific key. The key codes are
    defined in java.awt.KeyEvent. If the key already has
    a GameAction mapped to it, the new GameAction overwrites
    it.
	*/
	mapToKey: function(gameAction, keyCode) {
    	if(!this.keyActions){
    		this.keyActions = [];
    	}
	    this.keyActions[keyCode] = gameAction;
	},
	
	addKeyAction: function(keyCode,initialPressOnly){
		var ga = new mwe.GameAction();
		if(initialPressOnly){
			ga.behavior = ga.statics.DETECT_INITAL_PRESS_ONLY;
		}		
		this.mapToKey(ga,keyCode);	
	},
	
	setMouseAction: function(gameAction){
		this.mouseAction = gameAction;		
	},
	
	setTouchAction: function(gameAction){
		this.touchAction = gameAction;		
	},
	
	
	mouseUp: function(e) {
		this.mouseAction.release();
	},
	
	mouseDown: function(e){
		this.mouseAction.press();
	},
	
	mouseMove: function(e){
		this.mouseAction.move(e.clientX, e.clientY);
	},
	
	touchStart: function(e){
		this.touchAction.press();
	},
	
	touchEnd: function(e){
		this.touchAction.release();
	},
	
	touchMove: function(e){
		this.touchAction.move(e.clientX, e.clientY);
	},
	
	
	getKeyAction: function(e) {
	    
	    if (this.keyActions.length) {
	        return this.keyActions[e.keyCode];
	    }
	    else {
	        return null;
	    }
	},
	
	keyPressed : function(e) {
	    var gameAction = this.getKeyAction(e);
	    if (gameAction && (!gameAction.isPressed())) {
	    	gameAction.press();
	    }

	    
	    // make sure the key isn't processed for anything else
	    // TODO
	    //e.consume();
	},
	
	
	keyReleased : function(e) {
	    var gameAction = this.getKeyAction(e);
	    if (gameAction != null) {
	        gameAction.release();
	    }

	    
	    // make sure the key isn't processed for anything else
	    // TODO
	    //e.consume();
	},
	
	
	keyTyped: function(e) {
	    // make sure the key isn't processed for anything else
	    // TODO
	    //e.consume();
	},
	
	/**
	 * Get the mouse pointer location within the canvas' coordinates, not the page's
	 */
	getMouseLoc: function(evt){
		  var coordsM = dojo.coords(this.canvas);
		  return {x: Math.round(evt.clientX - coordsM.x), y: Math.round(evt.clientY - coordsM.y)};
	}
	
	
});


