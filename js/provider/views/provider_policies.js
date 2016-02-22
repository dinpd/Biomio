//Main view for Policies
App.Views.ProviderPoliciesMain = Backbone.View.extend({
  el: $("#content"),
  initialize:function () {
  },
  render:function () {
      var template = render('ProviderPoliciesView', {});
      this.$el.html( template );
  }
});

//View for one Policy
App.Views.ProviderPolicy = Backbone.View.extend({
    tagName: 'tr',
    initialize: function () {
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
        this.model.on('error', this.error, this);
    },
    render: function () {
        var template = render('forms/ProviderPoliciesList', this.model.toJSON());
        this.$el.html( template );
        return this;
    },
    events: {
      'click .show-info': 'showList',
      'click .hide-list': 'hideList',
      'click .edit'     : 'editPolicy',
      'click .cancel'   : 'cancelPolicy',
      'click .delete'   : 'deletePolicy',
      'click .save'     : 'savePolicy',
    },
    showList: function (e) {
        e.preventDefault();
        this.$el.find('.show-info').addClass('hide');
        this.$el.find('.list').removeClass('hide');

    },
    hideList: function (e) {
        e.preventDefault();
        this.$el.find('.show-info').removeClass('hide');
        this.$el.find('.list').addClass('hide');

    },
    editPolicy: function (e) {
        e.preventDefault();
        this.$el.find('.content').addClass('hide');
        this.$el.find('.form').removeClass('hide');

    },
    cancelPolicy: function (e) {
        e.preventDefault();
        this.$el.find('.form').addClass('hide');
        this.$el.find('.content').removeClass('hide');

    },
    deletePolicy: function (e) {
        e.preventDefault();
        that = this;
        var text = 'Are you sure that you want to delete <b>"' + this.model.get("name") + '"</b>?';
        bootbox.confirm(text, function(result) {
          that.model.url = App.Url + '/policies/' + that.model.id;
          if(result) that.model.destroy({
            contentType : 'application/json',
            dataType : 'text',
            success: function (data) {
              message('success', 'Success: ', 'the policy has been deleted');
              var newReport = new App.Models.UserReport ();
              newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-list-alt"></span> Policy <strong>' + that.model.get("name") + '</strong> deleted'});
            },
            error: function (data) {
              message('danger', 'Error: ', data);
            }
          });
        }); 
    },
    savePolicy: function (e) {
        e.preventDefault();
        that = this;
        var name = this.$el.find('.provider_policies_name input').val();
        var bioAuth = this.$el.find('.provider_policies_bio select').val();
        var minAuth = this.$el.find('.provider_policies_min input').val();
        var maxAuth = this.$el.find('.provider_policies_max input').val();
        var matchCertainty = this.$el.find('.provider_policies_certainty div input').val();
        var geoRestriction = this.$el.find('.provider_policies_geo select').val();
        var timeRestriction = this.$el.find('.provider_policies_time select').val();

        this.model.url = App.Url + '/policies/'+this.model.id;
        this.model.save({name: name, bioAuth: bioAuth, minAuth: minAuth, maxAuth: maxAuth, matchCertainty: matchCertainty, geoRestriction: geoRestriction, timeRestriction: timeRestriction}, {
          success: function (model) {
            message('success', 'Success: ', 'the policy has been changed');
            var newReport = new App.Models.UserReport ();
            newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-list-alt"></span> Policy <strong>' + that.model.get("name") + '</strong> added'});
          },
          error: function (data) {
            message('danger', 'Error: ', data);
          }
        });

        this.$el.find('.form').addClass('hide');
        this.$el.find('.content').removeClass('hide');
    },
    remove: function () {
        this.$el.remove();
    },
    error: function () {
      message('danger', 'something is wrong', 'or may be not and this just a test alert message');
    }
});

//View of the list of policies
App.Views.ProviderPolicies = Backbone.View.extend({
    el: $("#provider_policies"),
    initialize: function () {
        this.collection.on('add', this.addOne, this);
        this.collection.on('reset', this.render, this);
    },
    render: function () {
      this.collection.each(this.addOne, this);
      return this;
    },
    addOne: function (policy) {
      var policyView = new App.Views.ProviderPolicy ({ model: policy });
      $("#provider_policies").append(policyView.render().el);
    }
 });

//Add Policy form
App.Views.ProviderAddPolicy = Backbone.View.extend({
    el: $("#content"),
    initialize: function() {

    },
    events: {
      'click .provider-policies-add': 'addPolicy',
      'click .provider-policies-cancel': 'cancelForm',
      'click .provider-policies-submit': 'submitForm',
    },
    addPolicy: function(e) {
        $('.provider-policies-add').addClass('hide');
        $('#provider_policies_form').removeClass('hide');
    },
    cancelForm: function(e) {
        $('#provider_policies_form').addClass('hide');
        $('.provider-policies-add').removeClass('hide');
    },
    submitForm: function(e) {
      e.preventDefault();
      var name = $('#provider_policies_name').val();

      var newPolicy =  new App.Models.ProviderPolicy ();
      validate = newPolicy.validate({name: name});

      if (validate) {
        newPolicy.destroy();
        message('danger', 'Validation error:', validate);
      } else {
        //**********************************************************
        //       ADD new policy (if success, add it to collection)
        //**********************************************************
        newPolicy.url = App.Url + '/policies';
        var that = this;
        newPolicy.save({name:name, owner: window.profileId}, {
          success: function (data) {
            that.collection.add(data);
            var newReport = new App.Models.UserReport ();
            newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-list-alt"></span> New policy <strong>' + name + '</strong> added'});
          },
          error: function (data) {
            message('danger', 'Error: ', data);
          }
        });

        $('#provider_policies_name').val('');
        $('#provider_policies_form').addClass('hide');
        $('.provider-policies-add').removeClass('hide');
      }
    }
 });