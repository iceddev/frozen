define([
  '../GameCore',
  './Box',
  'dcl',
  'dcl/bases/Mixer'
], function(GameCore, Box, dcl, Mixer){

  return dcl([GameCore, Mixer], {
    box: null,
    boxUpdating: true,
    entities: null,

    constructor: function(){
      if(!this.box){
        this.box = new Box();
      }

      if(!this.entities){
        this.entities = {};
      }
    },

    preUpdate: function(millis){
      if(this.boxUpdating){
        this.box.update(millis);
        this.box.updateExternalState(this.entities);
      }
    }
  });

});