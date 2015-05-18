//Main View for Provider Locations
App.Views.ProviderLocationsMain = Backbone.View.extend({
    el: $("#content"),
  initialize:function () {
  },
  render:function () {
      var template = render('ProviderLocationsView', {});
      this.$el.html( template );
  }
});

//Load the main device template
App.Views.ProviderLocationsDetails = Backbone.View.extend({
  initialize:function () {
    this.render();
  },
  render:function () {
    var template = render('forms/ProviderLocationsDetails', {});
    return template;
  }
});

//#################################
//           LOCATIONS
//#################################

//View for one location (td)
App.Views.ProviderLocation = Backbone.View.extend({
    tagName: "tbody",
    initialize: function () {
      this.model.on('destroy', this.remove, this);
      this.model.on('error', this.error, this);
      this.model.on('change', this.reset, this);
    },
    render: function () {
      var template = render('forms/ProviderLocationsList', this.model.toJSON());
      $("#provider_locations").append(this.$el.html( template ));
      this.getPolicies();
    },
    reset: function () {
      var template = render('forms/ProviderLocationsList', this.model.toJSON());
      this.$el.html( template );
      this.getPolicies();
    },
    getPolicies: function () {
      if (!this.avaliablePoliciesView) this.avaliablePoliciesView = new App.Views.AvaliablePolicies ({ collection: window.avaliablePoliciesCollection });
      this.avaliablePoliciesView.render('policy-' + this.model.id, this.model.get('policy'));
    },
    events: {
      'click .provider-locations-edit'       : 'editLocation',
      'click .provider-locations-cancel'     : 'cancelLocation',
      'click .provider-locations-delete'     : 'deleteLocation',
      'click .provider-locations-save'       : 'saveLocation',
      'click .provider-show-devices'         : 'showDevices',
      'change .provider-location-geolocation': 'geolocation',
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
              message('success', 'Success: ', 'Location is deleted');
              var newReport = new App.Models.UserReport ();
              newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-home"></span> ' + 'Location <strong>' + that.model.get("name")  + '</strong> deleted'});
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

        var policy = this.$el.find('.location_policy').val();
        var policyName = this.$el.find('.location_policy option:selected').text();
        //if (policy != 0) this.$el.find(".policy-show").html(policy_name);
        //else this.$el.find(".policy-show").html("");

        this.model.url = App.Url + '/secureLocations/' + this.model.id;
        this.model.save({name: name, policy: policy, policyName: policyName, address: {"street1": street1, 
                "street2": street2, "continent": continent, "country": country, 
                "province": province, "region": region, "city": city, "postcode": postcode}}, {
          success: function (model) {
              message('success', 'Sussess', '');
              var newReport = new App.Models.UserReport ();
              newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-home"></span> ' + 'Location <strong>' + that.model.get("name")  + '</strong> updated'});
          }
        });
        
        this.$el.find('.form').addClass('hide');
        this.$el.find('.content').removeClass('hide');
    },
    showDevices: function (e) {
      if (this.$el.find('.list').hasClass("hide")) {
        $('.list').addClass("hide");
        this.$el.find('.list').removeClass("hide");

        //Preload details form
        var detailsView = new App.Views.ProviderLocationsDetails ();
        this.$el.find('.location-details').html(detailsView.render());

        //Trigger Device Collection
        $(".provider_devices").html('');

        //Add location ID to the hidden field for later use
        $("#provider_selected_location").val(this.model.id);
        $("#provider_selected_location_name").val(this.model.get("name"));

        if (!this.providerLocationDevicesCollection) this.providerLocationDevicesCollection = new App.Collections.ProviderLocationsDevice();
        else this.providerLocationDevicesCollection.reset();
        if (!this.providerLocationDevicesView) this.providerLocationDevicesView = new App.Views.ProviderLocationsDevices ({ collection: this.providerLocationDevicesCollection });
        if (!this.addProviderLocationsDeviceView) this.addProviderLocationsDeviceView = new App.Views.ProviderLocationsAddDevice({ collection: this.providerLocationDevicesCollection });

        this.providerLocationDevicesCollection.url = App.Url + '/secureLocations/' + this.model.id + '/devices';
        this.providerLocationDevicesCollection.fetch();
        
        $('.provider_devices').html(this.providerLocationDevicesView.render().el);
        that = this;
        setInterval(function(){ that.providerLocationDevicesCollection.fetch(); }, 180000);

        //Trigger avaliable devices collection
        if (!this.providerAvaliableDevicesCollection) this.providerAvaliableDevicesCollection = new App.Collections.AvaliableDevice();
        if (!this.providerAvaliableDevicesView) this.providerAvaliableDevicesView = new App.Views.AvaliableDevices ({ collection: this.providerAvaliableDevicesCollection });
        this.providerAvaliableDevicesCollection.url = App.Url + '/users/' + window.profileId + '/devices?secureLocations=none';
        this.providerAvaliableDevicesCollection.fetch();
      } else {
        this.$el.find('.list').addClass("hide");
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
App.Views.ProviderLocations = Backbone.View.extend({
    el: $("#provider_locations"),
      initialize: function () {
      this.collection.on('add', this.addOne, this);
      this.collection.on('reset', this.render, this);
    },
    render: function () {
      this.collection.each(this.addOne, this);
      return this;
    },
    addOne: function (location) {
      var locationView = new App.Views.ProviderLocation ({ model: location });
      locationView.render();
    }
 });
//Add Location form
App.Views.ProviderAddLocation = Backbone.View.extend({
    el: $("#content"),
      initialize: function() {
    },
    events: {
      'click .provider-locations-add': 'addLocation',
      'click .provider-locations-cancel': 'cancelForm',
      'click .provider-locations-submit': 'submitForm',
      'change .provider-add-location-geolocation': 'geolocation',
    },
    addLocation: function(e) {
        $('.provider-locations-add').addClass('hide');
        $('#provider_locations_form').removeClass('hide');
        this.generateLocationList(6295630,'continent','continent'); //get list of continents to start geolocation
    },
    cancelForm: function(e) {
        $('#provider_locations_form').addClass('hide');
        $('.provider-locations-add').removeClass('hide');
    },
    submitForm: function(e) {
      e.preventDefault();
      var name = $('#provider_locations_name').val();
      var description = $('#provider_locations_description').val();

      var street1   = $('#address_street1').val();
      var street2   = $('#address_street2').val();
      var continent = $('#continent option:selected').text();
          if (continent.search('Select ') != -1 || continent.search('No Data ') != -1) continent = '';
      var country   = $('#country option:selected').text();
          if (country.search('Select ') != -1 || country.search('No Data ') != -1) country = '';
      var province  = $('#province option:selected').text();
          if (province.search('Select ') != -1 || province.search('No Data ') != -1) province = '';
      var region    = $('#region option:selected').text();
          if (region.search('Select ') != -1 || region.search('No Data ') != -1) region = '';
      var city      = $('#city option:selected').text();
          if (city.search('Select ') != -1 || city.search('No Data ') != -1) city = '';
      var postcode  = $('#address_postcode').val();

      var newLocation =  new App.Models.ProviderLocation ();
      validate = newLocation.validate({name: name, owner: window.profileId, description: description,
                address: {"street1": street1, "street2": street2, "continent": continent, 
                "country": country, "province": province, "region": region, "city": city, 
                "postcode": postcode}});

      if (validate) {
        newLocation.destroy();
        message('danger', 'Validation error: ', validate);
      } else {
        newLocation.url = App.Url + '/secureLocations';
        var that = this;
        newLocation.save({name: name, owner: window.profileId, description: description,
                address: {"street1": street1, "street2": street2, "continent": continent, 
                "country": country, "province": province, "region": region, "city": city, 
                "postcode": postcode}}, {
          success: function (data) {
            that.collection.add(data);
            var newReport = new App.Models.UserReport ();
            message('success', 'Success: ', 'Location Is Added');
            newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-home"></span> ' + 'New location <strong>' + name  + '</strong> added'});
          },
          error: function (data) {
            message('danger', 'Error: ', data);
          }
        });

        $('#provider_locations_name').val('');
        $('#provider_locations_address').val('');

        $('#provider_locations_form').addClass('hide');
        $('.provider-locations-add').removeClass('hide');
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
//             DEVICES
//#################################

//View for one device (td)
App.Views.ProviderLocationsDevice = Backbone.View.extend({
  tagName: 'tr',
  initialize: function () {
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this);
    this.model.on('error', this.error, this);
  },
  render: function () {
    var template = render('forms/ProviderLocationsDevice', this.model.toJSON());
    this.$el.html( template );
    return this;
  },
  events: {
    'click .provider-locations-update-device': 'updateDevice',
    'click .provider-locations-cancel-device': 'cancelDevice',
    'click .provider-locations-delete-device': 'deleteDevice',
    'click .provider-locations-submit-device': 'submitDevice',
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
    var locationName = $("#provider_selected_location_name").val();
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
App.Views.ProviderLocationsDevices = Backbone.View.extend({
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
    var deviceView = new App.Views.ProviderLocationsDevice ({ model: device });
    $(".provider_devices").append(deviceView.render().el);
  }
});

//Add device form
App.Views.ProviderLocationsAddDevice = Backbone.View.extend({
  el: $("#content"),
  initialize: function() {
  },
  events: {
    'click .provider-locations-device-add': 'addDevice',
    'click .provider-locations-device-cancel': 'cancelForm',
    'click .provider-locations-device-submit': 'submitForm',
  },
  addDevice: function(e) {
      $('.provider-device-add').addClass('hide');
      $('.provider_devices_form').removeClass('hide');
  },
  cancelForm: function(e) {
      $('.provider_devices_form').addClass('hide');
      $('.provider-locations-device-add').removeClass('hide');
  },
  submitForm: function(e) {
    e.preventDefault();
    var locationId = $("#provider_selected_location").val();
    var locationName = $("#provider_selected_location_name").val();
    var deviceId = $('.avaliable-devices').val();

    var newDevice =  new App.Models.ProviderLocationsDevice ();

    //**********************************************************
    //       ADD new Device (if success, add it to collection)
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
        error: function(xhr, status, error) {
          message('danger', 'Error: ', status.responseText);
        }
    });

    $('.provider_devices_form').addClass('hide');
    $('.provider-locations-device-add').removeClass('hide');
  }
});