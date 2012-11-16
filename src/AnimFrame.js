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

/*********************** mwe.AnimFrame ********************************************/
define(['dojo/_base/declare'], function(declare){

  return declare(null, {
    endTime: 0,
    imgSlotX: 0,
    imgSlotY: 0,
    image: null,
    constructor: function(args){
      declare.safeMixin(this, args);
    }
  });

});