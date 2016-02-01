//Main View for User Devices
App.Views.UserDevicesMain = Backbone.View.extend({
  el: $("#content"),
  initialize:function () {
  },
  render:function () {
      var template = render('UserDevicesView', {});
      this.$el.html( template );
  }
});

//View for one device
App.Views.UserDevice = Backbone.View.extend({
  tagName: 'tr',
  initialize: function () {
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this);
    this.model.on('error', this.error, this);
  },
  render: function () {
    var template = render('forms/DeviceList', this.model.toJSON());
    this.$el.html( template );
    return this;
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
    this.model.url = App.Url + '/devices/'+this.model.id;
    this.model.save({name: name}, {
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
App.Views.UserDevices = Backbone.View.extend({
  el: $(".user_devices"),
  initialize: function () {
      this.collection.on('add', this.addOne, this);
      this.collection.on('reset', this.render, this);
  },
  render: function () {
    this.collection.each(this.addOne, this);
    return this;
  },
  addOne: function (device) {
    var deviceView = new App.Views.UserDevice ({ model: device });
    $(".user_devices").append(deviceView.render().el);
  }
});

//Add device form
App.Views.UserAddDevice = Backbone.View.extend({
  el: $("#content"),
  initialize: function() {

  },
  events: {
    'click .user-devices-add': 'addDevice',
    'click .user-devices-cancel': 'cancelForm',
    'click .user-devices-submit': 'submitForm',
  },
  addDevice: function(e) {
      $('.user-devices-add').addClass('hide');
      $('.user_devices_form').removeClass('hide');

  },
  cancelForm: function(e) {
      $('.user_devices_form').addClass('hide');
      $('.user-devices-add').removeClass('hide');

  },
  submitForm: function(e) {
    e.preventDefault();
    var type = $('#user_devices_type').val();
    var name = $('#user_devices_name').val();
    var serialNumber = $('#user_devices_number').val();

    window.newDevice =  new App.Models.UserDevice ();
    var validate = newDevice.validate({type: type, name: name, serialNumber: serialNumber, owner: Number(window.profileId)});
    if (validate) {
      message('danger', 'Validation error: ', validate);
    } else {
      //**********************************************************
      //       ADD new device (if success, add it to collection)
      //**********************************************************
      newDevice.url = App.Url + '/devices';
      var that = this;
      newDevice.save({type: type, name: name, serialNumber: serialNumber, owner: Number(window.profileId)}, {
        success: function (data) {
          that.collection.add(data);
          var newReport = new App.Models.UserReport ();
          newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-cog"></span> New ' + type + ' <strong>' + name + '</strong> added'});
        },
        error: function (data) {
          message('danger', 'Error: ', data);
        }
      });

      $('#user_devices_number').val('');
      $('#user_devices_name').val('');

      $('.user_devices_form').addClass('hide');
      $('.user-devices-add').removeClass('hide');
    }
  },
});