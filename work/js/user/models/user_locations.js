//#################################
//           LOCATIONS
//#################################

//Model for one location
App.Models.UserLocation = Backbone.Model.extend({
  defaults: {
    "name" : "",
    "description" : "",
    "deviceIds" : "",
    "policy" : "",
   },
  initialize: function(){
    this.on("invalid",function(model,error){
      message('danger', 'Invalid: ', error);
    });
  },
  validate: function(attrs) {
    if ( ! $.trim(attrs.name) ) return "Invalid name";
  },
});

//#################################
//             USERS
//#################################

//Model for one user
App.Models.UserLocationsUser = Backbone.Model.extend({
  defaults: {
    "ownerName"        : '',
    "ownerEmail"       : '',
    "userName"         : '',
    "userEmail"        : '',
    "type"             : "invitation",
    "status"           : "pending",
    "timeRestriction"  : "24/7",
   },
  initialize: function(){
    this.on("invalid",function(model,error){
        message('danger', 'Invalid: ', error);
    });
  },
  validate: function(attrs) {
    if ( ! $.trim(attrs.userEmail) ) return "Invalid email";
  },
});

//#################################
//             DEVICES
//#################################

//Model for one device
App.Models.UserLocationsDevice = Backbone.Model.extend({
  defaults: {
    //"owner"        : 0,
    //"name"         : "",
    //"type"         : "",
    //"serialNumber" : "",
    //"mac"          : "",
    //"lastPing"     : false,
   },
  initialize: function(){
    this.on("invalid",function(model,error){
      message('danger', 'Invalid: ', error);
    });
  },
  validate: function(attrs) {
  },
});
