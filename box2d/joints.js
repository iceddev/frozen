'use strict';

const Distance = require('./joints/Distance');
const Prismatic = require('./joints/Prismatic');
const Revolute = require('./joints/Revolute');

var joints = {
  Distance,
  Prismatic,
  Revolute
};

module.exports = joints;
