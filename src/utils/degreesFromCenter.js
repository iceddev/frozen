define(['./radiansToDegrees','./radiansFromCenter'
], function(radiansToDegrees, radiansFromCenter){
  return function(center, pt){
      return radiansToDegrees(radiansFromCenter(center, pt));
    };
});