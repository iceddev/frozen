
dojo.provide("mwe.Sprite");



dojo.require("mwe.Animation");

/*********************** mwe.Sprite ********************************************/

dojo.declare("mwe.Sprite", null, {
    // position (pixels)
    x: 0.0,
    y: 0.0,
    // velocity (pixels per millisecond)
    dx: 0.0,
    dy: 0.0,
    name: null,
    collisionRadius: 40,

    /**
        Creates a new Sprite object.
    */
    constructor: function(args){
		dojo.safeMixin(this, args);
		//anim = args.anim;
    },

    /**
        Updates this Sprite's Animation and its position based
        on the velocity.
    */
    update: function(elapsedTime) {
    	this.x += this.dx * elapsedTime;
        this.y += this.dy * elapsedTime;
        this.anim.update(elapsedTime);
    },

    /**
        Gets this Sprite's current x position.
    */
    getX: function() {
        return this.x;
    },

    /**
        Gets this Sprite's current y position.
    */
    getY: function() {
        return this.y;
    },

    /**
        Sets this Sprite's current x position.
    */
    setX: function(x) {
        this.x = x;
    },

    /**
        Sets this Sprite's current y position.
    */
    setY: function(y) {
        this.y = y;
    },

    /**
        Gets this Sprite's width, based on the size of the
        current image.
    */
    getWidth: function() {
        return this.anim.width;
    },

    /**
        Gets this Sprite's height, based on the size of the
        current image.
    */
    getHeight: function() {
        return this.anim.height;
    },

    /**
        Gets the horizontal velocity of this Sprite in pixels
        per millisecond.
    */
    getVelocityX: function() {
        return this.dx;
    },

    /**
        Gets the vertical velocity of this Sprite in pixels
        per millisecond.
    */
    getVelocityY: function() {
        return this.dy;
    },

    /**
        Sets the horizontal velocity of this Sprite in pixels
        per millisecond.
    */
    setVelocityX: function(dx) {
        
        this.dx = this.limitSpeed(dx);
    },

    /**
    Sets the vertical velocity of this Sprite in pixels
    per millisecond.
	*/
	setVelocityY: function(dy) {
    	this.dy = this.limitSpeed(dy);
	},

    limitSpeed: function(v){
        if(this.getMaxSpeed()){
	    	if(Math.abs(v) > this.getMaxSpeed()){
				if(v > 0){
					return this.getMaxSpeed();
				}else if(v < 0){
					return this.getMaxSpeed();
				}else{
					return  0;
				}
	        }else{
				return v;
	        }
        }else{
        	return v;
        }
    },

	/**
    Gets the maximum speed of this Creature.
	*/
	getMaxSpeed: function() {
    	return this.maxSpeed;
	},



    /**
        Gets this Sprite's current animation frame.
    */
    getCurrentFrame: function() {
        return this.anim.getCurrentFrame();
    },
    
    drawCurrentFrame: function(context){
    	var cf = this.anim.getCurrentFrame();
    	context.drawImage(this.anim.image, cf.imgSlotX * this.anim.width, cf.imgSlotY * this.anim.height, this.anim.width, this.anim.height, this.x,this.y, this.anim.width, this.anim.height);
    },
	
	clone: function() {
        return new mwe.Sprite({anim: this.anim.clone()});
    }
});

