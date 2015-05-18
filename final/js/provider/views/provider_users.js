//View for Provider Users
App.Views.ProviderUsersMain = Backbone.View.extend({
	el: $("#content"),
  initialize:function () {
  },
  render:function () {
      var template = render('ProviderUsersView', {});
      this.$el.html( template );
  },
  events: {
      'change .avaliable-locations': 'selectResource'
  },
  selectResource: function () {
    this.getUsers();
  },
  getUsers:function (locationId) {
      $('#provider_users_data, #provider_invitations_data, #provider_applications_data').html('');
      
      if (locationId == null) var locationId = this.$el.find(".avaliable-locations").val();
      else this.$el.find(".avaliable-locations").val(locationId);

      if (!this.providerUsersCollection) this.providerUsersCollection = new App.Collections.ProviderUsers();
      else this.providerUsersCollection.reset();
      if (!this.providerUsersView) this.providerUsersView = new App.Views.ProviderUsers({collection: this.providerUsersCollection});
      if (!this.addProviderUserView) this.addProviderUserView = new App.Views.ProviderAddUser({ collection: this.providerUsersCollection });

      this.providerUsersCollection.url = App.Url + '/secureLocations/' + locationId + '/users';
      this.providerUsersCollection.fetch();
  }
});


//View for SELECT resource
App.Views.ProviderGetResource = Backbone.View.extend({
    el: $("#content"),
    events: {
      'change .avaliable-locations': 'selectResource'
    },
    selectResource: function () {
      var resource = $('.avaliable-locations').val();
      //call get Users function on select of a new resource
      this.model.getUsers(resource);
    }
});

//View for one user
App.Views.ProviderUser = Backbone.View.extend({
    tagName: 'tr',
    initialize: function () {
      this.render();
    	this.model.on('change', this.render, this);
      this.model.on('change:status', this.render, this);
    	this.model.on('destroy', this.remove, this);
      this.model.on('error', this.error, this);
    },
    render: function () {
	  var template = render('forms/ProviderResourcesUser', this.model.toJSON());
      this.$el.html( template );
      if (this.model.get('status') == 'pending' && this.model.get('type') == 'invitation') {
        $("#provider_invitations_data").append(this.$el.html( template ));
      } else if (this.model.get('status') =='pending' && this.model.get('type') == 'application') {
        $("#provider_applications_data").append(this.$el.html( template ));
      } else if (this.model.get('status') == "accepted") {
        $("#provider_users_data").append(this.$el.html( template ));
      }
    },
    events: {
      'click .edit-resources-user'   : 'editUser',
      'click .cancel-resources-user' : 'cancelUser',
      'click .save-resources-user'   : 'saveUser',
      'click .delete-resources-user' : 'deleteUser',
      'click .accept-resources-user' : 'acceptUser',
      'click .restore-resources-user': 'restoreUser',
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
      if ($('#provider-users').hasClass('active')) var status = 'accepted';
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
App.Views.ProviderUsers = Backbone.View.extend({
    el: $("#provider_users_data"),
    initialize: function () {
    	this.collection.on('add', this.addOne, this);
      this.collection.on('reset', this.render, this);
    },
    render: function () {
      this.collection.each(this.addOne, this);
      return this;
    },
    addOne: function (user) {
      var userView = new App.Views.ProviderUser ({ model: user });
    }
 });

//Add User form
App.Views.ProviderAddUser = Backbone.View.extend({
    el: $("#content"),
    initialize: function() {

    },
    events: {
      'click .provider-users-invite': 'addUser',
      'click .provider-users-cancel': 'cancelForm',
      'click .provider-users-submit': 'submitForm',
    },
    addUser: function(e) {
    	$('.provider-users-invite').addClass('hide');
    	$('#provider_users_form').removeClass('hide');

    },
    cancelForm: function(e) {
    	$('#provider_users_form').addClass('hide');
    	$('.provider-users-invite').removeClass('hide');

    },
    submitForm: function(e) {
      e.preventDefault();
      var userEmail = $('#provider_users_email').val();
      var timeRestriction = $('#time_start').val() + ' - ' + $('#time_end').val();
      var locationId = $('.avaliable-resources').val();
      var locationName = $('.avaliable-resources option:selected').text();

      var newUser =  new App.Models.ProviderUser ();
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
              $('.provider-invitations-nav').click();
              $('.tab-content div').removeClass('active');
              $('#provider-invitations').addClass('active');
              var newReport = new App.Models.UserReport ();
              newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-user"></span> ' + 'You invited <strong>' + data.get("userName")  + '</strong> to <strong>' + locationName + '</strong>'});
              newReport.save({profileId: data.get("userId"), type: 'incoming', description: '<span class="glyphicon glyphicon-user"></span> ' + 'You are invited by <strong>' + window.profileName  + '</strong> to <strong>' + locationName + '</strong>'});
          },
          error: function(xhr, status, error) {
            message('danger', 'Error: ', status.responseText);
          }
      });

      $('.provider_devices_form').addClass('hide');
      $('.provider-devices-invite').removeClass('hide');
      }
    }
 });