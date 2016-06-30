//#################################
//           LOCATIONS
//#################################

//Collection of locations
App.Collections.UserLocation = Backbone.Collection.extend({
  model: App.Models.UserLocation
});

//#################################
//             USERS
//#################################

//Collection of users
App.Collections.UserLocationsUsers = Backbone.Collection.extend({
  model: App.Models.UserLocationsUser
});

//#################################
//             DEVICES
//#################################

//Collection of devices
App.Collections.UserLocationsDevices = Backbone.Collection.extend({
  model: App.Models.UserLocationsDevice
});