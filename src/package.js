var profile = (function(){

  'use strict';

  return {
    resourceTags: {
      amd: function(filename, mid) {
        return (/\.js$/).test(filename);
      }
    }
  };
}());