
function rotateRadiansAroundCenter(center = {x: 0.0, y: 0.0}, pt, angle){
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  const newPt = {};

  // translate point back to origin:
  newPt.x = pt.x - center.x;
  newPt.y = pt.y - center.y;

  // rotate point
  const xnew = newPt.x * c - newPt.y * s;
  const ynew = newPt.x * s + newPt.y * c;

  // translate point back:
  newPt.x = xnew + center.x;
  newPt.y = ynew + center.y;
  return newPt;
}

module.exports = rotateRadiansAroundCenter;
