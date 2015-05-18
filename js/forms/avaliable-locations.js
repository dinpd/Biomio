//View for one avaliable resource
App.Views.AvaliableLocation = Backbone.View.extend({
  initialize: function () {
  },
  render: function (target) {
    if (target == 'users') var template = render('forms/AvaliableLocations', this.model.toJSON());
    else if (target == 'devices') var template = render('forms/DeviceLocations', this.model.toJSON());
    return template;
  },
});

//View of the list of avaliable locations
App.Views.AvaliableLocations = Backbone.View.extend({
  el: $(".avaliable-locations"),
  initialize: function () {
    this.collection.on('add', this.addOne, this);
    this.collection.on('reset', this.render, this);
  },
  renderForUsers: function () {
    this.collection.each(this.addOneForUsers, this);
    return this;
  },
  addOneForUsers: function (location) {
    var locationView = new App.Views.AvaliableLocation ({ model: location });
    $(".avaliable-locations").append(locationView.render('users'));
  },
  renderForDevices: function (element, activeLocation) {
    this.element = element;
    this.activeLocation = activeLocation;
    this.collection.each(this.addOneForDevices, this);
  },
  addOneForDevices: function (location) {
    var locationView = new App.Views.AvaliableLocation ({ model: location });
    $("." + this.element + " .device-location").append(locationView.render('devices'));
    if (location.id == this.activeLocation) {
      $("." + this.element + " .device-location").val(location.id);
    }
  },
});