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

dojo.provide("mwe.ResourceManager");


/*********************** mwe.ResourceManager ********************************************/

dojo.declare("mwe.ResourceManager",null,{

	
	imageCount: 0,
	loadedImages: 0,
	allLoaded: false,
	
	imageDir : 'images/',
	imgList: [],

	constructor: function(args){
		dojo.safeMixin(this, args);

	
	},

    /**
    Gets an image.
	*/
	loadImage: function(filename,width, height) {


		//if we already have the image, just return it
		for(i=0;i<this.imgList.length;i++){
			if(this.imgList[i].name == filename ){
				return this.imgList[i].img;
			}
		}

		this.allLoaded = false;
		
	    var img = new Image();

	    if(this.imageDir){
	    	filename = this.imageDir + filename;
	    }
	    img.src = filename;

	    this.imgList.push({name:filename,img:img});
	    
	    return img;
	},

	resourcesReady: function(){
		if(this.allLoaded){
			return true;
		}else{
			for(i=0; i<this.imgList.length; i++){
				if(!this.imgList[i].img.complete){
					return false;
				}
			}
			this.allLoaded = true;
			return true;
		}
	},
	
	getPercentComplete: function(){
		var numComplete = 0.0;
		for(i=0; i<this.imgList.length; i++){
			if(this.imgList[i].img.complete){
				numComplete = numComplete + 1.0;
			}
		}
		if(this.imgList.length === 0){
			return 0;
		}else{
			return Math.round((numComplete/this.imgList.length) * 100.0);
		}
		
	
	}

});