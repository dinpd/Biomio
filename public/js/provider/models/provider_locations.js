//#################################
//            LOCATIONS
//#################################

//Model for one location
App.Models.ProviderLocation = Backbone.Model.extend({
    defaults: {
      "name" : "",
      'address': {"street1":"","street2":"","continent":"","country":"","province":"","region":"","city":"","postcode":""},
      "owner" : "",
      "description" : "",
      "deviceIds" : "",
      "policy" : "",
      "policyName" : "",
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
//             DEVICES
//#################################

//Model for one device
App.Models.ProviderLocationsDevice = Backbone.Model.extend({
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