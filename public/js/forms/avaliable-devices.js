//Model for one device
App.Models.AvaliableDevice = Backbone.Model.extend({
  defaults: {
    "owner"          : 0,
    "name"           : "",
    "secureLocation" : "",
    "type"           : "",
    "serialNumber"   : "",
    "mac"            : "",
    "lastPing"       : false
  },
});

//View for one avaliable device
App.Views.AvaliableDevice = Backbone.View.extend({
  initialize: function () {
    this.render();
  },
  render: function () {
    var template = render('forms/AvaliableDevices', this.model.toJSON());
    return template;
  },
});

//Collection of avaliable devices
App.Collections.AvaliableDevice = Backbone.Collection.extend({
  model: App.Models.AvaliableDevice
});

//View of the list of avaliable devices
App.Views.AvaliableDevices = Backbone.View.extend({
  initialize: function () {
      this.collection.on('add', this.addOne, this);
      this.collection.on('reset',this.render(),this);
  },
  render: function () {
    this.collection.each(this.addOne, this);
    return this;
  },
  addOne: function (device) {
    var deviceView = new App.Views.AvaliableDevice ({ model: device });
    $(".avaliable-devices").append(deviceView.render());
  }
});