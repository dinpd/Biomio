//Main View for Provider Resources
App.Views.ProviderResourcesMain = Backbone.View.extend({
    el: $("#content"),
  initialize:function () {
  },
  render:function () {
      var template = render('ProviderResourcesView', {});
      this.$el.html( template );
  }
});

//Load the main device template
App.Views.ProviderResourcesDetails = Backbone.View.extend({
  initialize:function () {
    this.render();
  },
  render:function () {
    var template = render('forms/ProviderResourcesDetails', {});
    return template;
  }
});

//#################################
//           RESOURCES
//#################################

//View for one resource (td)
App.Views.ProviderResource = Backbone.View.extend({
    tagName: 'tbody',
    initialize: function () {
        this.model.on('destroy', this.remove, this);
        this.model.on('error', this.error, this);
    },
    render: function () {
        var template = render('forms/ProviderResourcesList', this.model.toJSON());
        this.$el.html( template );
        return this;
    },
    events: {
      'click .provider-resources-edit': 'editResource',
      'click .provider-resources-cancel': 'cancelResource',
      'click .provider-resources-delete': 'deleteResource',
      'click .provider-resources-save': 'saveResource',
      'click .provider-resources-show': 'showDevices',
    },
    editResource: function (e) {
        this.$el.find('.content').addClass('hide');
        this.$el.find('.form').removeClass('hide');
    },
    cancelResource: function (e) {
        e.preventDefault();
        this.$el.find('.form').addClass('hide');
        this.$el.find('.content').removeClass('hide');
    },
    deleteResource: function (e) {
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
              newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-home"></span> ' + 'Resource <strong>' + that.model.get("name")  + '</strong> deleted'});
            },
            error: function (data) {
              message('danger', 'Error: ', data);
            }
          });
        }); 
    },
    saveResource: function (e) {
        e.preventDefault();
        that = this;
        var name = this.$el.find('.resource_name').val();
        var address = this.$el.find('.resource_address').val();
        var policy = this.$el.find('.resource_policy').val();
        var policy_name = this.$el.find('.resource_policy option:selected').text();
        //if (policy != 0) this.$el.find(".policy-show").html(policy_name);
        //else this.$el.find(".policy-show").html("");

        this.model.url = App.Url + '/secureLocations/' + this.model.id;
        this.model.save({name: name, policy: policy, address: address}, {
          success: function (model) {
              that.$el.find('.resource_name_show').text(name);
              that.$el.find('.resource_address_show').text(address);
              that.$el.find('.policy-show').text(policy_name);

              message('success', 'Sussess', '');
              var newReport = new App.Models.UserReport ();
              newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-home"></span> ' + 'Resource <strong>' + that.model.get("name")  + '</strong> updated'});
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
        var detailsView = new App.Views.ProviderResourcesDetails ();
        this.$el.find('.resource-details').html(detailsView.render());

        //Trigger Device Collection
        $(".provider_devices").html('');

        //Add resource ID to the hidden field for later use
        $("#provider_selected_resource").val(this.model.id);
        $("#provider_selected_resource_name").val(this.model.get("name"));

        if (!this.providerResourceDevicesCollection) this.providerResourceDevicesCollection = new App.Collections.ProviderResourcesDevice();
        else this.providerResourceDevicesCollection.reset();
        if (!this.providerResourceDevicesView) this.providerResourceDevicesView = new App.Views.ProviderResourcesDevices ({ collection: this.providerResourceDevicesCollection });
        if (!this.addProviderResourcesDeviceView) this.addProviderResourcesDeviceView = new App.Views.ProviderResourcesAddDevice({ collection: this.providerResourceDevicesCollection });

        this.providerResourceDevicesCollection.url = App.Url + '/secureLocations/' + this.model.id + '/devices';
        this.providerResourceDevicesCollection.fetch();
        
        $('.provider_devices').html(this.providerResourceDevicesView.render().el);
        that = this;
        setInterval(function(){ that.providerResourceDevicesCollection.fetch(); }, 180000);

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
    }
});

//View of the list of resources
App.Views.ProviderResources = Backbone.View.extend({
    el: $("#provider_resources"),
      initialize: function () {
      this.collection.on('add', this.addOne, this);
    },
    render: function () {
      this.collection.each(this.addOne, this);
      return this;
    },
    addOne: function (resource) {
      var resourceView = new App.Views.ProviderResource ({ model: resource });
      $("#provider_resources").append(resourceView.render().el);
    }
 });
//Add Resource form
App.Views.ProviderAddResource = Backbone.View.extend({
    el: $("#content"),
      initialize: function() {
    },
    events: {
      'click .provider-resources-add': 'addResource',
      'click .provider-resources-cancel': 'cancelForm',
      'click .provider-resources-submit': 'submitForm',
      'change .provider-location-geolocation': 'geolocation',
    },
    addResource: function(e) {
        $('.provider-resources-add').addClass('hide');
        $('#provider_resources_form').removeClass('hide');
        this.generateLocationList(6295630,'continent','continent'); //get list of continents to start geolocation
    },
    cancelForm: function(e) {
        $('#provider_resources_form').addClass('hide');
        $('.provider-resources-add').removeClass('hide');
    },
    submitForm: function(e) {
      e.preventDefault();
      var name = $('#provider_resources_name').val();
      var description = $('#provider_resources_description').val();

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


      var newResource =  new App.Models.ProviderResource ();
      validate = newResource.validate({name: name, owner: window.profileId, description: description,
                address: {"street1": street1, "street2": street2, "continent": continent, 
                "country": country, "province": province, "region": region, "city": city, 
                "postcode": postcode}});

      if (validate) {
        newResource.destroy();
        message('danger', 'Validation error: ', validate);
      } else {
        newResource.url = App.Url + '/secureLocations';
        var that = this;
        newResource.save({name: name, owner: window.profileId, description: description,
                address: {"street1": street1, "street2": street2, "continent": continent, 
                "country": country, "province": province, "region": region, "city": city, 
                "postcode": postcode}}, {
          success: function (data) {
            that.collection.add(data);
            var newReport = new App.Models.UserReport ();
            message('success', 'Success: ', 'Location Is Added');
            newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-home"></span> ' + 'New resource <strong>' + name  + '</strong> added'});
          },
          error: function (data) {
            message('danger', 'Error: ', data);
          }
        });

        $('#provider_resources_name').val('');
        $('#provider_resources_address').val('');

        $('#provider_resources_form').addClass('hide');
        $('.provider-resources-add').removeClass('hide');
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
App.Views.ProviderResourcesDevice = Backbone.View.extend({
  tagName: 'tr',
  initialize: function () {
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this);
    this.model.on('error', this.error, this);
  },
  render: function () {
    var template = render('forms/ProviderResourcesDevice', this.model.toJSON());
    this.$el.html( template );
    return this;
  },
  events: {
    'click .provider-resources-update-device': 'updateDevice',
    'click .provider-resources-cancel-device': 'cancelDevice',
    'click .provider-resources-delete-device': 'deleteDevice',
    'click .provider-resources-submit-device': 'submitDevice',
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
    var locationName = $("#provider_selected_resource_name").val();
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
App.Views.ProviderResourcesDevices = Backbone.View.extend({
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
    var deviceView = new App.Views.ProviderResourcesDevice ({ model: device });
    $(".provider_devices").append(deviceView.render().el);
  }
});

//Add device form
App.Views.ProviderResourcesAddDevice = Backbone.View.extend({
  el: $("#content"),
  initialize: function() {
  },
  events: {
    'click .provider-resources-device-add': 'addDevice',
    'click .provider-resources-device-cancel': 'cancelForm',
    'click .provider-resources-device-submit': 'submitForm',
  },
  addDevice: function(e) {
      $('.provider-device-add').addClass('hide');
      $('.provider_devices_form').removeClass('hide');
  },
  cancelForm: function(e) {
      $('.provider_devices_form').addClass('hide');
      $('.provider-resources-device-add').removeClass('hide');
  },
  submitForm: function(e) {
    e.preventDefault();
    var locationId = $("#provider_selected_resource").val();
    var locationName = $("#provider_selected_resource_name").val();
    var deviceId = $('.avaliable-devices').val();

    var newDevice =  new App.Models.ProviderResourcesDevice ();

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
    $('.provider-resources-device-add').removeClass('hide');
  }
});