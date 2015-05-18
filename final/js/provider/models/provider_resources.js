//#################################
//            RESOURCES
//#################################

//Model for one resource
App.Models.ProviderResource = Backbone.Model.extend({
    defaults: {
      "name" : "",
      'address': {'street1': '', 'street2': '', 'city': '', 'country': '', 'postcode': ''},
      "owner" : "",
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
//             DEVICES
//#################################

//Model for one device
App.Models.ProviderResourcesDevice = Backbone.Model.extend({
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