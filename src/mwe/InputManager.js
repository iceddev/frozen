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
	
	
	mouseUp: function(e){
		
		
	},
	
	mouseDown: function(e){
		
		
	},
	
	mouseMove: function(e){
		
	},
	
	touchStart: function(e){
		
		
	},
	
	touchEnd: function(e){
		
		
	},
	
	touchMove: function(e){
		
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


