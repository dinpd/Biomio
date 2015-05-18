//#################################
//           LOCATIONS
//#################################

//Collection of resources
App.Collections.ProviderResource = Backbone.Collection.extend({
  model: App.Models.ProviderResource
});

//#################################
//             DEVICES
//#################################

//Collection of devices
App.Collections.ProviderResourcesDevice = Backbone.Collection.extend({
  model: App.Models.ProviderResourcesDevice
});