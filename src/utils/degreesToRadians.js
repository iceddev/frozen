define(function(){
  var radConst = Math.PI / 180.0;
  return function(degrees){
      return degrees * radConst;
    };
});