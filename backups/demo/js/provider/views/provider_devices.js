//Main view for Provider Devices
App.Views.ProviderDevicesMain = Backbone.View.extend({
  el: $("#content"),
  initialize:function () {
  },
  render:function () {
      var template = render('ProviderDevicesView', {});
      this.$el.html( template );
  }
});

//View for one device
App.Views.ProviderDevice = Backbone.View.extend({
  tagName: 'tr',
  initialize: function () {
    this.model.on('change', this.reset, this);
    this.model.on('destroy', this.remove, this);
    this.model.on('error', this.error, this);
  },
  render: function () {
    var template = render('forms/DeviceList', this.model.toJSON());
    $(".provider_devices").append(this.$el.html( template ));
     this.getLocations();
  },
  reset: function () {
    var template = render('forms/DeviceList', this.model.toJSON());
    this.$el.html( template );
    this.getLocations();
  },
  getLocations: function () {
    if (!this.avaliableLocationsView) this.avaliableLocationsView = new App.Views.AvaliableLocations ({ collection: window.avaliableLocationsCollection });
    this.avaliableLocationsView.renderForDevices('location-' + this.model.id, this.model.get('secureLocation'));
  },
  events: {
    'click .update-device': 'updateDevice',
    'click .cancel-device': 'cancelDevice',
    'click .delete-device': 'deleteDevice',
    'click .submit-device': 'submitDevice',
  },
  updateDevice: function (e) {
    e.preventDefault();
    this.$el.find(".device_content").addClass('hide');
    this.$el.find(".device_form").removeClass('hide');
  },
  cancelDevice: function (e) {
    e.preventDefault();
    this.$el.find(".device_form").addClass('hide');
    this.$el.find(".device_content").removeClass('hide');
  },
  deleteDevice: function (e) {
    e.preventDefault();
    var that = this;
    var text = 'Are you sure that you want to delete <b>"' + that.model.get("name") + '"</b>?';
    bootbox.confirm(text, function(result) {
      that.model.url = App.Url + '/devices/' + that.model.id;
      if(result) that.model.destroy({
        contentType : 'application/json',
        dataType : 'text',
        success: function (data) {
          message('success', '', 'Success');
          var newReport = new App.Models.UserReport ();
          newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-cog"></span> ' + that.model.get("type") + ' <strong>' + that.model.get("name") + '</strong> deleted'});
        },
        error: function (data) {
          message('danger', 'Error: ', data);
        }
      });
    }); 
  },
  submitDevice: function (e) {
    e.preventDefault();
    var that = this;
    var name = this.$el.find('#device_new_name').val();
    
    var secureLocation = this.$el.find('.device-location').val();
    var locationName = this.$el.find('.device-location option:selected').text();

    this.model.url = App.Url + '/devices/'+this.model.id;
    this.model.save({name: name, secureLocation: secureLocation, locationName: locationName}, {
      contentType : 'application/json',
      dataType : 'text',
      success: function (model) {
        message('success', '', 'Success');
        var newReport = new App.Models.UserReport ();
        newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-cog"></span> ' + that.model.get("type") + ' <strong>' + that.model.get("name") + '</strong> updated'});
      },
      error: function (data) {
        message('danger', 'Error: ', data);
      }
    });

    this.$el.find(".device_form").addClass('hide');
    this.$el.find(".device_content").removeClass('hide');
  },

  remove: function () {
    this.$el.remove();
  },

  error: function () {
    message('danger', 'something is wrong', 'or may be not and this just a test alert message');
  }
});

//View of the list of devices
App.Views.ProviderDevices = Backbone.View.extend({
  el: $(".provider_devices"),
  initialize: function () {
      this.collection.on('add', this.addOne, this);
      this.collection.on('reset', this.render, this);
  },
  render: function () {
    this.collection.each(this.addOne, this);
    return this;
  },
  addOne: function (device) {
    var deviceView = new App.Views.ProviderDevice ({ model: device });
    deviceView.render();
  }
});
//Add device form
App.Views.ProviderAddDevice = Backbone.View.extend({
  el: $("#content"),
  initialize: function() {
  },
  events: {
    'click .provider-devices-add': 'addDevice',
    'click .provider-devices-cancel': 'cancelForm',
    'click .provider-devices-submit': 'submitForm',
  },
  addDevice: function(e) {
      $('.provider-devices-add').addClass('hide');
      $('.provider_devices_form').removeClass('hide');

  },
  cancelForm: function(e) {
      $('.provider_devices_form').addClass('hide');
      $('.provider-devices-add').removeClass('hide');

  },
  submitForm: function(e) {
    e.preventDefault();
    var type = $('#provider_devices_type').val();
    var name = $('#provider_devices_name').val();
    var serialNumber = $('#provider_devices_number').val();

    var newDevice =  new App.Models.UserDevice ();
    var validate = newDevice.validate({name: name, serialNumber: serialNumber});
    if (validate) {
      newDevice.destroy();
      message('danger', 'Validation error: ', validate);
    } else {
      //**********************************************************
      //       ADD new device (if success, add it to collection)
      //**********************************************************
      var time = new Date().getTime();
      // *Check if this.collection.id exists
      this.collection.add({id: time, type: type, name: name, serialNumber: serialNumber});

      newDevice.url = App.Url + '/devices';
      var that = this;
      add_progress('small', '#content');
      newDevice.save({type: type, name: name, serialNumber: serialNumber, owner: Number(window.profileId)}, {
        success: function (data) {
          that.collection.add(data);
          var newReport = new App.Models.UserReport ();
          newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-cog"></span> New ' + type + ' <strong>' + name + '</strong> added'});
          message('success', 'Success: ', 'Device ' + that.get('name') + ' successfully added');
        },
        error: function (data) {
          message('danger', 'Error ', '');
        }
      });

      $('#user_devices_number').val('');
      $('#user_devices_name').val('');

      $('.user_devices_form').addClass('hide');
      $('.user-devices-add').removeClass('hide');
    }
  }
});