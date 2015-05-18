//#################################
//           LOCATIONS
//#################################

//Collection of locations
App.Collections.ProviderLocations = Backbone.Collection.extend({
  model: App.Models.ProviderLocation
});

//#################################
//             DEVICES
//#################################

//Collection of devices
App.Collections.ProviderLocationsDevice = Backbone.Collection.extend({
  model: App.Models.ProviderLocationsDevice
});