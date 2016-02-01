//Model for one device
App.Models.UserDevice = Backbone.Model.extend({
  defaults: {
    "owner"          : 0,
    "name"           : "",
    "secureLocation" : "",
    "type"           : "",
    "serialNumber"   : "",
    "mac"            : "",
    "lastPing"       : false
   },
  initialize: function(){
    this.on("invalid",function(model,error){
      message('danger', 'Invalid: ', error);
    });
  },
  validate: function(attrs) {
    if ( ! $.trim(attrs.name) ) return "Invalid name";
    else if ( ! $.trim(attrs.serialNumber) ) return "Serial number can't be empty";
  }
});