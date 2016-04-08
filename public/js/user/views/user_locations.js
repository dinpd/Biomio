//Main View for Locations
App.Views.UserLocationsMain = Backbone.View.extend({
  el: $("#content"),
  initialize:function () {
  },
  render:function () {
    var template = render('UserLocationsView', {});
    this.$el.html( template );
  }
});

//Main View for Devices details
App.Views.UserLocationDevicesDetails = Backbone.View.extend({
  initialize:function () {
    this.render();
  },
  render:function () {
    var template = render('forms/UserLocationDeviceDetails', {});
    return template;
  }
});

//Main View for User details
App.Views.UserLocationUsersDetails = Backbone.View.extend({
  initialize:function () {
    this.render();
  },
  render:function () {
    var template = render('forms/UserLocationUserDetails', {});
    return template;
  }
});


//#################################
//           LOCATIONS
//#################################

//View for one location
App.Views.UserLocation = Backbone.View.extend({
  tagName: 'tbody',
  initialize: function () {
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this);
    this.model.on('error', this.error, this);
  },
  render: function () {
    var template = render('forms/UserLocationsLocation', this.model.toJSON());
    this.$el.html( template );
    return this;
  },
  events: {
      'click .edit'         : 'editLocation',
      'click .cancel'       : 'cancelLocation',
      'click .delete'       : 'deleteLocation',
      'click .save'         : 'saveLocation',
      'click .show-users'   : 'showUsers',
      'click .show-devices' : 'showDevices',
      'change .user-location-geolocation': 'geolocation',
    },
  editLocation: function (e) {
      this.$el.find('.content').addClass('hide');
      this.$el.find('.form').removeClass('hide');

      this.generateLocationList(6295630,'continent','continent'); //get list of continents to start geolocation
  },
  cancelLocation: function (e) {
      e.preventDefault();
      this.$el.find('.form').addClass('hide');
      this.$el.find('.content').removeClass('hide');
  },
  deleteLocation: function (e) {
      e.preventDefault();
      that = this;
      var text = 'Are you sure that you want to delete <b>"' + this.model.get("name") + '"</b>?';
      bootbox.confirm(text, function(result) {
        that.model.url = App.Url + '/secureLocations/' + that.model.id;
        if(result) that.model.destroy({
          contentType : 'application/json',
          dataType : 'text',
          success: function (data) {
            message('success', '', 'Success');
            var newReport = new App.Models.UserReport ();
            newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-home"></span> ' + 'Resource <strong>' + that.model.get("name")  + '</strong> deleted'});
          },
          error: function (data) {
            message('danger', 'Error: ', data);
          }
        });
      }); 
  },
  saveLocation: function (e) {
      e.preventDefault();
      that = this;
      var name = this.$el.find('.location_name').val();
      var description = this.$el.find('.location_description').val();

      var street1   = this.$el.find('#address_street1').val();
      var street2   = this.$el.find('#address_street2').val();
      var continent = this.$el.find('#continent option:selected').text();
          if (continent.search('Select ') != -1 || continent.search('No Data ') != -1) continent = '';
      var country   = this.$el.find('#country option:selected').text();
          if (country.search('Select ') != -1 || country.search('No Data ') != -1) country = '';
      var province  = this.$el.find('#province option:selected').text();
          if (province.search('Select ') != -1 || province.search('No Data ') != -1) province = '';
      var region    = this.$el.find('#region option:selected').text();
          if (region.search('Select ') != -1 || region.search('No Data ') != -1) region = '';
      var city      = this.$el.find('#city option:selected').text();
          if (city.search('Select ') != -1 || city.search('No Data ') != -1) city = '';
      var postcode  = this.$el.find('#address_postcode').val();


      this.model.url = App.Url + '/secureLocations/' + this.model.id;
      this.model.set({name: name, description: description,
                address: {"street1": street1, "street2": street2, "continent": continent, 
                "country": country, "province": province, "region": region, "city": city, 
                "postcode": postcode}});
      this.model.save({
        success: function (model) {
            message('success', 'Success: ', 'Location is updated');
            if (!this.newReport) this.newReport = new App.Models.UserReport ();
            this.newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-home"></span> ' + 'Resource <strong>' + that.model.get("name")  + '</strong> updated'});
        }
      });
      this.$el.find('.form').addClass('hide');
      this.$el.find('.content').removeClass('hide');
  },
  showUsers: function (e) {
    if (this.$el.find('.list').hasClass("hide") || this.$el.find('.list').hasClass("devices")) {
      $('.list').addClass("hide");
      $('.list').addClass("users");
      $('.list').removeClass("devices");
      this.$el.find('.list').removeClass("hide");

      //Preload details form
      if (!this.detailsView) this.usersDetailsView = new App.Views.UserLocationUsersDetails ();
      this.$el.find('.location-details').html(this.usersDetailsView.render());

      //Trigger Users Collection.html(usersView.render());
     if (!this.usersCollection) this.usersCollection = new App.Collections.UserLocationsUsers();
     if (!this.usersView) this.usersView = new App.Views.UserLocationsUsers({collection: this.usersCollection});

      this.usersCollection.url = App.Url + '/secureLocations/' + this.model.id + '/users';
      this.usersCollection.fetch({
          success: function() {
            if (!this.addUser) this.addUser = new App.Views.UserLocationsAddUser({ collection: this.usersCollection });
          }
      });
    } else {
      this.$el.find('.list').addClass("hide");
      $('.list').removeClass("users");
    }
  },
  showDevices: function (e) {
    if (this.$el.find('.list').hasClass("hide")  || this.$el.find('.list').hasClass("users")) {
      $('.list').addClass("hide");
      $('.list').removeClass("users");
      $('.list').addClass("devices");
      this.$el.find('.list').removeClass("hide");

      //Preload details form
      if (!this.devicesDetailsView) this.devicesDetailsView = new App.Views.UserLocationDevicesDetails ();
      this.$el.find('.location-details').html(this.devicesDetailsView.render());

      //Trigger Device Collection
      $(".user_devices").html('');

      //Add resource ID to the hidden field for later use
      $("#user_selected_location").val(this.model.id);
      $("#user_selected_location_name").val(this.model.get("name"));

      if (!this.devicesCollection) this.devicesCollection = new App.Collections.UserLocationsDevices();
      this.devicesCollection.url = App.Url + '/secureLocations/' + this.model.id + '/devices';
      this.devicesCollection.fetch();
      if (!this.devicesView) this.devicesView = new App.Views.UserLocationsDevices ({ collection: this.devicesCollection });
      $('.user_devices').html(this.devicesView.render().el);
      that = this;
      setInterval(function(){ that.devicesCollection.fetch(); }, 180000);

      if (!this.addDevice) this.addDevice = new App.Views.UserLocationsAddDevice({ collection: this.devicesCollection });

      //Trigger avaliable devices collection
      if (!window.avaliableDevicesCollection) window.avaliableDevicesCollection = new App.Collections.AvaliableDevice();
      window.avaliableDevicesCollection.url = App.Url + '/users/' + window.profileId + '/devices?secureLocations=none';
      window.avaliableDevicesCollection.fetch();
      if (!window.avaliableDevicesView) window.avaliableDevicesView = new App.Views.AvaliableDevices ({ collection: window.avaliableDevicesCollection });

    } else {
      this.$el.find('.list').addClass("hide");
      $('.list').removeClass("devices");
    }
  },
  remove: function () {
    this.$el.remove();
  },
  error: function () {
    message('danger', 'something is wrong', 'or may be not and this just a test alert message');
  },
  geolocation: function (e) {
      var location = this.$el.find(e.currentTarget).attr("id");
      var id = this.$el.find("#" + location).val();
      var postTo;

      //get the name of the next category and clear every smaller category for new data
      if (location == 'continent') {
          postTo = 'country';
          this.$el.find('#country, #province, #region, #city').html('');
      } else if (location == 'country') {
          postTo = 'province';
          this.$el.find('#province, #region, #city').html('');
      } else if (location == 'province') { 
          postTo = 'region';
          this.$el.find('#region, #city').html('');
      } else if (location == 'region') { 
          postTo = 'city';
          this.$el.find('#city').html('');
      }
      this.generateLocationList(id, location, postTo);
  },
  generateLocationList: function (id, location, postTo) {
      that = this;
      if (id != '') {
          var url = "http://www.geonames.org/childrenJSON?geonameId="+id;
          $.post(url, function(data) {
              //check if data is not empty
              if (data.status || data['totalResultsCount'] == 0) {
                  that.$el.find('#' + postTo).append('<option value="">No Data Available</option>')
              } else {
                  that.$el.find('#' + postTo).append('<option value="">Select ' + postTo + '</option>')
                  for(var i = 0; i < data.geonames.length; i++) {
                      that.$el.find('#' + postTo).append('<option value="' + data.geonames[i]['geonameId'] + '">' + data.geonames[i]['name'] + '</option>')
                  }
                  //for the first run we select values from the profile
                  if (location == postTo) {
                      var address = that.model.get('address');
                      if (address[location] == '') return;

                      that.$el.find("#" + location + " option").filter(function() { return this.text == address[location]; }).attr('selected', true);
                      var newId = that.$el.find("#" + location + " option:selected").val();
                      if (location == 'continent') location = 'country';
                      else if (location == 'country') location = 'province';
                      else if (location == 'province') location = 'region';
                      else if (location == 'region') location = 'city';

                      that.generateLocationList(newId, location, location);
                  }
              }
          },"json");
      }
    },
});

//View of the list of locations
App.Views.UserLocations = Backbone.View.extend({
  el: $("#user_locations"),
  initialize: function () {
    this.collection.on('add', this.addOne, this);
    this.collection.on('reset', this.render, this);
  },
  render: function () {
    this.collection.each(this.addOne, this);
    return this;
  },
  addOne: function (location) {
    var locationView = new App.Views.UserLocation ({ model: location });
    $("#user_locations").append(locationView.render().el);
  }
});
//Add Location form
App.Views.UserAddLocation = Backbone.View.extend({
  el: $("#content"),
  initialize: function() {

  },
  events: {
    'click .user-location-add': 'addLocation',
    'click .user-location-cancel': 'cancelForm',
    'click .user-location-submit': 'submitForm',
    'change .user-add-location-geolocation': 'geolocation',
  },
  addLocation: function(e) {
    $('.user-location-add').addClass('hide');
    $('#user_location_form').removeClass('hide');
    this.generateLocationList(6295630,'continent','continent'); //get list of continents to start geolocation
  },
  cancelForm: function(e) {
    $('#user_location_form').addClass('hide');
    $('.user-location-add').removeClass('hide');
  },
  submitForm: function(e) {
    e.preventDefault();
    var name = $('#user_location_form #user_location_name').val();
    var description = $('#user_location_form #user_location_description').val();

    var street1   = $('#user_location_form #address_street1').val();
    var street2   = $('#user_location_form #address_street2').val();
    var continent = $('#user_location_form #continent option:selected').text();
        if (continent.search('Select ') != -1 || continent.search('No Data ') != -1) continent = '';
    var country   = $('#user_location_form #country option:selected').text();
        if (country.search('Select ') != -1 || country.search('No Data ') != -1) country = '';
    var province  = $('#user_location_form #province option:selected').text();
        if (province.search('Select ') != -1 || province.search('No Data ') != -1) province = '';
    var region    = $('#user_location_form #region option:selected').text();
        if (region.search('Select ') != -1 || region.search('No Data ') != -1) region = '';
    var city      = $('#user_location_form #city option:selected').text();
        if (city.search('Select ') != -1 || city.search('No Data ') != -1) city = '';
    var postcode  = $('#user_location_form #address_postcode').val();

    var newLocation =  new App.Models.UserLocation ();
    var validate = newLocation.validate({name: name, owner: window.profileId, description: description,
                address: {"street1": street1, "street2": street2, "continent": continent, 
                "country": country, "province": province, "region": region, "city": city, 
                "postcode": postcode}});

    if (validate) {
      newLocation.destroy();
      message('danger', 'Validation error: ', validate);
    } else {
      //**********************************************************
      //       ADD new location (if success, add it to collection)
      //**********************************************************
      newLocation.url = App.Url + '/secureLocations';
      var that = this;
      newLocation.save({name: name, owner: window.profileId, description: description,
                address: {"street1": street1, "street2": street2, "continent": continent, 
                "country": country, "province": province, "region": region, "city": city, 
                "postcode": postcode}}, {
        success: function (data) {
          that.collection.add(data);
          var newReport = new App.Models.UserReport ();
          message('success', 'Success: ', ' Location Is Added');
          newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-home"></span> ' + 'New resource <strong>' + name  + '</strong> added'});
        },
        error: function (data) {
          message('danger', 'Error: ', data);
        }
      });

      $('#user_location_name').val('');
      $('#user_location_description').val('');

      $('#user_location_form').addClass('hide');
      $('.user-location-add').removeClass('hide');
    }
  },
  geolocation: function (e) {
      var location = $(e.currentTarget).attr("id");
      var id = $("#" + location).val();
      var postTo;

      //get the name of the next category and clear every smaller category for new data
      if (location == 'continent') {
          postTo = 'country';
          $('#country, #province, #region, #city').html('');
      } else if (location == 'country') {
          postTo = 'province';
          $('#province, #region, #city').html('');
      } else if (location == 'province') { 
          postTo = 'region';
          $('#region, #city').html('');
      } else if (location == 'region') { 
          postTo = 'city';
          $('#city').html('');
      }
      this.generateLocationList(id, location, postTo);
  },
  generateLocationList: function (id, location, postTo) {
      that = this;
      if (id != '') {
          var url = "http://www.geonames.org/childrenJSON?geonameId="+id;
          $.post(url, function(data) {
              //check if data is not empty
              if (data.status || data['totalResultsCount'] == 0) {
                  $('#' + postTo).append('<option value="">No Data Available</option>')
              } else {
                  $('#' + postTo).append('<option value="">Select ' + postTo + '</option>')
                  for(var i = 0; i < data.geonames.length; i++) {
                      $('#' + postTo).append('<option value="' + data.geonames[i]['geonameId'] + '">' + data.geonames[i]['name'] + '</option>')
                  }
              }
          },"json");
      }
  },
});

//#################################
//             USERS
//#################################

//View for one user
App.Views.UserLocationsUser = Backbone.View.extend({
    tagName: 'tr',
    initialize: function () {
      this.render();
      this.model.on('change', this.render, this);
      this.model.on('change:status', this.render, this);
      this.model.on('destroy', this.remove, this);
      this.model.on('error', this.error, this);
    },
    render: function () {
    var template = render('forms/UserLocationsUser', this.model.toJSON());
      this.$el.html( template );
      if (this.model.get('status') == 'pending' && this.model.get('type') == 'invitation') {
        $("#user_invitations_data").append(this.$el.html( template ));
      } else if (this.model.get('status') =='pending' && this.model.get('type') == 'application') {
        $("#user_applications_data").append(this.$el.html( template ));
      } else if (this.model.get('status') == "accepted") {
        $("#user_users_data").append(this.$el.html( template ));
      }
    },
    events: {
      'click .edit-locations-user'   : 'editUser',
      'click .cancel-locations-user' : 'cancelUser',
      'click .save-locations-user'   : 'saveUser',
      'click .delete-locations-user' : 'deleteUser',
      'click .accept-locations-user' : 'acceptUser',
      'click .restore-locations-user': 'restoreUser',
    },
    editUser: function (e) {
      this.$el.find('.user_content').addClass('hide');
      this.$el.find('.user_form').removeClass('hide');

    },
    cancelUser: function () {
      this.$el.find('.user_form').addClass('hide');
      this.$el.find('.user_content').removeClass('hide');
    },
    saveUser: function () {
      var timeRestriction = this.$el.find('.time-start').val() + ' - ' + this.$el.find('.time-end').val();

      this.model.url = App.Url + '/secureLocations/' + this.model.get('locationId') + '/users/' + this.model.id;
      this.model.save({timeRestriction: timeRestriction}, {
        contentType : 'application/json',
        dataType : 'text',
        success: function (model) {
          message('success', 'Success: ', 'time restricion is updated');
        },
        error: function (data) {
          message('danger', 'Error: ', data);
        }
      });
      this.$el.find('.user_form').addClass('hide');
      this.$el.find('.user_content').removeClass('hide');
    },
    acceptUser: function (e) {
      this.model.url = App.Url + '/secureLocations/' + this.model.get('locationId') + '/users/' + this.model.id;
      this.model.save({status: 'accepted'}, {
        contentType : 'application/json',
        dataType : 'text',
        success: function (model) {
          message('success', 'Success: ', 'User accepted');
        },
        error: function (data) {
          message('danger', 'Error: ', data);
        }
      });
    },
    deleteUser: function (e) {
      var that = this;
      var text = 'Are you sure that you want to delete <b>"' + that.model.get("userName") + '"</b>?';
      bootbox.confirm(text, function(result) {
        that.model.url = App.Url + '/secureLocations/' + that.model.get('locationId') + '/users/' + that.model.id;
        that.model.save({status: 'refused'}, {
          contentType : 'application/json',
          dataType : 'text',
          success: function (model) {
            message('success', '', 'Success');
          },
          error: function (data) {
            message('danger', 'Error: ', data);
          }
        });
      });
    },
    restoreUser: function (e) {
      //get the user's status before deletion
      if ($('#user-users').hasClass('active')) var status = 'accepted';
      else var status = 'pending';
      //update status request
      this.model.url = App.Url + '/secureLocations/' + this.model.get('locationId') + '/users/' + this.model.id;
      this.model.save({status: status}, {
        contentType : 'application/json',
        dataType : 'text',
        success: function (model) {
          message('success', 'Success: ', 'User restored');
        },
        error: function (data) {
          message('danger', 'Error: ', data);
        }
      });
    },
    remove: function () {
      this.$el.remove();
    },
    error: function () {
      message('danger', 'something is wrong', 'or may be not and this just a test alert message');
    }
});

//View of the list of users (tr)
App.Views.UserLocationsUsers = Backbone.View.extend({
    el: $("#user_users_data"),
    initialize: function () {
      this.collection.on('add', this.addOne, this);
    },
    render: function () {
      this.collection.each(this.addOne, this);
      return this;
    },
    addOne: function (user) {
      var userView = new App.Views.UserLocationsUser ({ model: user });
    }
 });

//Add User form
App.Views.UserLocationsAddUser = Backbone.View.extend({
    el: $("#content"),
    initialize: function() {

    },
    events: {
      'click .user-users-invite': 'addUser',
      'click .user-users-cancel': 'cancelForm',
      'click .user-users-submit': 'submitForm',
    },
    addUser: function(e) {
      $('.user-users-invite').addClass('hide');
      $('#user_users_form').removeClass('hide');

    },
    cancelForm: function(e) {
      $('#user_users_form').addClass('hide');
      $('.user-users-invite').removeClass('hide');

    },
    submitForm: function(e) {
      e.preventDefault();
      var userEmail = $('#user_users_email').val();
      var timeRestriction = $('#time_start').val() + ' - ' + $('#time_end').val();
      var locationId = $("#user_selected_location").val();
      var locationName = $("#user_selected_location_name").val();

      var newUser =  new App.Models.UserLocationsUser ();
      validate = newUser.validate({userEmail: userEmail});
      if (validate) {
        newUser.destroy();
        message('danger', 'Validation error: ', validate);
      } else {
      //**********************************************************
      //       ADD new user (if success, add it to collection)
      //**********************************************************
      newUser.url = App.Url + '/secureLocations/' + locationId + '/users';
      var that = this;
      newUser.save({userEmail: userEmail, timeRestriction: timeRestriction, locationId: locationId, ownerId: window.profileId}, {
          success: function (data) {
              that.collection.add(newUser);
              $('.user-invitations-nav').click();
              $('.tab-content div').removeClass('active');
              $('#user-invitations').addClass('active');
          },
          error: function(xhr, status, error) {
            message('danger', 'Error: ', status.responseText);
          }
      });

      $('.user_devices_form').addClass('hide');
      $('.user-devices-invite').removeClass('hide');
      }
    }
 });

//#################################
//             DEVICES
//#################################

//View for one device (td)
App.Views.UserLocationsDevice = Backbone.View.extend({
  tagName: 'tr',
  initialize: function () {
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this);
    this.model.on('error', this.error, this);
  },
  render: function () {
    var template = render('forms/UserLocationsDevice', this.model.toJSON());
    this.$el.html( template );
    return this;
  },
  events: {
    'click .user-locations-update-device': 'updateDevice',
    'click .user-locations-cancel-device': 'cancelDevice',
    'click .user-locations-delete-device': 'deleteDevice',
    'click .user-locations-submit-device': 'submitDevice',
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
    var locationName = $("#user_selected_location_name").val();
    var that = this;
    var text = 'Are you sure that you want to disconnect <b>"' + that.model.get("name") + '"</b> from this location?';
    bootbox.confirm(text, function(result) {
        that.model.url = App.Url + '/devices/'+that.model.id;
        that.model.save({secureLocation: 0}, {
        contentType : 'application/json',
        dataType : 'text',
        success: function (data) {
          message('success', '', 'Success');
          that.$el.remove();
          var newReport = new App.Models.UserReport ();
          newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-home"></span> <span class="glyphicon glyphicon-cog"></span> ' + that.model.get("type") + ' <strong>' + that.model.get("name") + '</strong> removed from <strong>'  + locationName + '</strong>'});
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
App.Views.UserLocationsDevices = Backbone.View.extend({
  el: $(".user_devices"),
  initialize: function () {
      this.collection.on('add', this.addOne, this);
  },
  render: function () {
    this.collection.each(this.addOne, this);
    return this;
  },
  addOne: function (device) {
    var deviceView = new App.Views.UserLocationsDevice ({ model: device });
    $(".user_devices").append(deviceView.render().el);
  }
});

//Add device form
App.Views.UserLocationsAddDevice = Backbone.View.extend({
  el: $("#content"),
  initialize: function() {
  },
  events: {
    'click .user-locations-device-add': 'addDevice',
    'click .user-locations-device-cancel': 'cancelForm',
    'click .user-locations-device-submit': 'submitForm',
  },
  addDevice: function(e) {
      $('.user-device-add').addClass('hide');
      $('.user_devices_form').removeClass('hide');
  },
  cancelForm: function(e) {
      $('.user_devices_form').addClass('hide');
      $('.user-locations-device-add').removeClass('hide');
  },
  submitForm: function(e) {
    e.preventDefault();
    var locationId = $("#user_selected_location").val();
    var locationName = $("#user_selected_location_name").val();
    var deviceId = $('.avaliable-devices').val();

    var newDevice =  new App.Models.UserLocationsDevice ();

    //**********************************************************
    //       ADD new device (if success, add it to collection)
    //**********************************************************
    newDevice.url = App.Url + '/secureLocations/' + locationId + '/devices/' + deviceId;
    var that = this;
    newDevice.save({secureLocation: locationId}, {
        success: function (data) {
          that.collection.add(data);
          $(".avaliable-devices option[value='" + deviceId + "']").remove();
          message('success', 'Success: ', 'Device is successfully added');
          var newReport = new App.Models.UserReport ();
          newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-home"></span> <span class="glyphicon glyphicon-cog"></span> ' + data.get("type") + ' <strong>' + data.get("name")  + '</strong> added to <strong>'  + locationName + '</strong>'});
        },
        error: function (data) {
          message('danger', 'Error: ', data);
        }
    });

    $('.user_devices_form').addClass('hide');
    $('.user-locations-device-add').removeClass('hide');
  }
});