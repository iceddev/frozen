define(function(){

  'use strict';

  return function removeExtension(path){
    var lastIndex = path.lastIndexOf('.');
    if(lastIndex < 0){
      return path;
    }
    return path.slice(0, lastIndex);
  };

});