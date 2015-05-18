//Model for one resource
App.Models.UserResource = Backbone.Model.extend({
  defaults: {
    "locationName"     : "",
    "locationAddress"  : "",
    "locationId"       : "",
    'ownerName'        : "",
    'ownerEmail'       : "",
    //"policy"           : "",
    "type"             : "application",
    "status"           : "pending",
    "timeRestriction"  : "24/7",
   },
    initialize: function(){
      this.on("invalid",function(model,error){
        message('danger', 'Invalid: ', error);
      });
    },
    validate: function(attrs) {
      if ( ! $.trim(attrs.ownerEmail) ) return "Invalid owner e-mail";
      else if ( ! $.trim(attrs.locationName) ) return "Invalid location name";
    },
});