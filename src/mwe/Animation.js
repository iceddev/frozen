
dojo.provide("mwe.AnimFrame");
dojo.provide("mwe.Animation");

/*********************** mwe.AnimFrame ********************************************/


dojo.declare("mwe.AnimFrame",null,{
    endTime: 0,
    imgSlotX: 0,
    imgSlotY: 0,
    image: null,

    constructor: function(args){
        dojo.safeMixin(this, args);
    }
});


/*********************** mwe.Animation ********************************************/
dojo.declare("mwe.Animation",null,{

    currFrameIndex: 0,
    animTime:0,
    totalDuration:0,
    height: 64,
    width: 64,
    image: null,


    /**
        Creates a new, empty Animation.
    */
    constructor: function(args){
        dojo.safeMixin(this, args);
        //this.frames= args.frames;
        this.start();
    },


    createFromTile: function(frameCount,frameTimes,img,h,w,ySlot){
        var anim = new mwe.Animation({
            image: img,
            height: h,
            width: w
        });

        var isFTArray = dojo.isArray(frameTimes);

        var currentFrameTime = 1;
        if(!ySlot){
            ySlot = 0;
        }
        for(var j = 0; j < frameCount; j++){
            if(isFTArray){
                currentFrameTime = frameTimes[j];
            }else{
                currentFrameTime = frameTimes;
            }
            anim.addFrame(currentFrameTime,j,ySlot);
        }
        return anim;
    },

    /**
        Creates a duplicate of this animation. The list of frames
        are shared between the two Animations, but each Animation
        can be animated independently.
    */
    clone: function() {
        return new mwe.Animation({image: this.image,frames: this.frames, totalDuration: this.totalDuration});
    },


    /**
        Adds an image to the animation with the specified
        duration (time to display the image).
    */
    addFrame: function(duration,imageSlotX,imageSlotY)
    {
        if(!this.frames){
            this.frames = [];
        }
        this.totalDuration += duration;
        this.frames.push(new mwe.AnimFrame({endTime: this.totalDuration, image: this.image, imgSlotX: imageSlotX, imgSlotY: imageSlotY}));
    },


    /**
        Starts this animation over from the beginning.
    */
    start: function() {
        this.animTime = 0;
        this.currFrameIndex = 0;
    },


    /**
        Updates this animation's current image (frame), if
        neccesary.
    */
    update: function(elapsedTime) {
        if (this.frames.length > 1) {
            this.animTime += elapsedTime;

            if (this.animTime >= this.totalDuration) {
                this.animTime = this.animTime % this.totalDuration;
                this.currFrameIndex = 0;
            }

            while (this.animTime > this.getFrame(this.currFrameIndex).endTime) {
                this.currFrameIndex++;
            }
        }
    },


    getImage: function() {
       return this.image;
    },


    getFrame: function(i) {
        return this.frames[i];
    },

    /**
        Gets this Animation's current animation frame. Returns null if this
        animation has no frames.
     */
    getCurrentFrame: function() {
         if (this.frames.length === 0) {
             return null;
         }
         else {
             return this.getFrame(this.currFrameIndex);
         }
    }
});