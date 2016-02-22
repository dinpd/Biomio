//Main view for User Resources
App.Views.UserResourcesMain = Backbone.View.extend({
  el: $("#content"),
  initialize:function () {
  },
  render:function () {
      var template = render('UserResourcesView', {});
      this.$el.html( template );
  }
});

//View for one resource
App.Views.UserResource = Backbone.View.extend({
    tagName: 'tr',
    initialize: function () {
      this.render();
      this.model.on('change', this.render, this);
      this.model.on('change:status', this.render, this);
      this.model.on('destroy', this.remove, this);
      this.model.on('error', this.error, this);
    },
    render: function () {
      var template = render('forms/UserResourcesList', this.model.toJSON());
      this.$el.html( template );
      if (this.model.get('status') == 'pending' && this.model.get('type') == 'invitation') {
        $("#invitations_resources_data").append(this.$el.html( template ));
      } else if (this.model.get('status') =='pending' && this.model.get('type') == 'application') {
        $("#applications_resources_data").append(this.$el.html( template ));
      } else if (this.model.get('status') == "accepted") {
        $("#user_resources_data").append(this.$el.html( template ));
      }
    },
    events: {
      'click .accept-user-resources' : 'acceptResource',
      'click .delete-user-resources' : 'deleteResource',
      'click .restore-user-resources': 'restoreResource',
    },
    acceptResource: function (e) {
      this.model.url = App.Url + '/users/' + this.model.id + '/resources/' + this.model.get('locationId');
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
    deleteResource: function (e) {
      var that = this;
      var text = 'Are you sure that you want to delete <b>"' + that.model.get("locationName") + '"</b>?';
      bootbox.confirm(text, function(result) {
        that.model.url = App.Url + '/users/' + that.model.id + '/resources/' + that.model.get('locationId');
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
    restoreResource: function (e) {
      //get the user's status before deletion
      if ($('#user-resources').hasClass('active')) var status = 'accepted';
      else var status = 'pending';
      //update status request
      this.model.url = App.Url + '/users/' + this.model.id + '/resources/' + this.model.get('locationId');
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

//View of the list of resources
App.Views.UserResources = Backbone.View.extend({
    initialize: function () {
      this.collection.on('add', this.addOne, this);
      this.collection.on('reset', this.render, this);
    },
    render: function () {
      this.collection.each(this.addOne, this);
      return this;
    },
    addOne: function (resource) {
      var resourceView = new App.Views.UserResource ({ model: resource });
    }
 });
//Add Resource form
App.Views.UserAddResource = Backbone.View.extend({
    el: $("#content"),
    initialize: function() {
    },
    events: {
      'click .user-resources-add'    : 'addResource',
      'click .user-resources-cancel' : 'cancelForm',
      'click .user-resources-apply' : 'submitForm',
    },
    addResource: function(e) {
        $('.user-resources-add').addClass('hide');
        $('#user_resources_form').removeClass('hide');

    },
    cancelForm: function(e) {
        $('#user_resources_form').addClass('hide');
        $('.user-resources-add').removeClass('hide');

    },
    submitForm: function(e) {
      e.preventDefault();
      var ownerEmail = $('#user_resources_owner').val();
      var locationName = $('#user_resources_location').val();

      var newResource =  new App.Models.UserResource ();
      validate = newResource.validate({ownerEmail: ownerEmail, locationName: locationName});
      if (validate) {
        newResource.destroy();
        message('danger', 'Validation error: ', validate);
      } else {
      //**********************************************************
      //       ADD new Resource (if success, add it to collection)
      //**********************************************************
      newResource.url = App.Url + '/users/' + window.profileId + '/resources';
      var that = this;
      newResource.save({ownerEmail: ownerEmail, locationName: locationName, userId: window.profileId}, {
          success: function (data) {
            that.collection.add(newResource);
            $('.applications-users-nav').click();
            $('.tab-content div').removeClass('active');
            $('#applications-resources').addClass('active');
          },
          error: function(xhr, status, error) {
            message('danger', 'Error: ', status.responseText);
          }
      });

        $('#user_resources_form').addClass('hide');
        $('.user-resources-add').removeClass('hide');
      }
    }
 });