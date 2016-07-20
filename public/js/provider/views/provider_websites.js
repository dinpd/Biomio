//Main View for Provider Websites
App.Views.ProviderWebsitesMain = Backbone.View.extend({
  el: $("#content"),
  initialize:function () {
  },
  render:function () {
    var template = render('ProviderWebsitesView', {});
    this.$el.html( template );
  }
});

//View for one website
App.Views.ProviderWebsite = Backbone.View.extend({
  tagName: 'tr',
  initialize: function () {
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this);
    this.model.on('error', this.error, this);
  },
  render: function () {
    var template = render('forms/WebsiteList', this.model.toJSON());
    this.$el.html( template );
    return this;
  },
  events: {
    'click .update-website'  : 'updateWebsite',
    'click .cancel-website'  : 'cancelWebsite',
    'click .delete-website'  : 'deleteWebsite',
    'click .submit-website'  : 'submitWebsite',
  },
  updateWebsite: function (e) {
    e.preventDefault();
    this.$el.find(".website_content").addClass('hide');
    this.$el.find(".website_form").removeClass('hide');
  },
  cancelWebsite: function (e) {
    e.preventDefault();
    this.$el.find(".website_form").addClass('hide');
    this.$el.find(".website_content").removeClass('hide');
  },
  deleteWebsite: function (e) {
    e.preventDefault();
    var that = this;
    var text = 'Are you sure that you want to delete <b>"' + that.model.get("name") + '"</b>?';
    bootbox.confirm(text, function(result) {
      that.model.url = App.Url + '/websites/' + that.model.id;
      if(result) that.model.destroy({
        contentType : 'application/json',
        dataType : 'text',
        success: function (data) {
          message('success', '', 'Success');
          var newReport = new App.Models.ProviderReport ();
          newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-cog"></span> ' + that.model.get("type") + ' <strong>' + that.model.get("name") + '</strong> deleted'});
        },
        error: function (data) {
          message('danger', 'Error: ', data);
        }
      });
    });
  },
  submitWebsite: function (e) {
    e.preventDefault();
    var that = this;

    var title = $('#provider_websites_title').val();
    var description = $('#provider_websites_description').val();

    var domains = new Array();
    domains[0] = $('#provider_websites_domain').val();

    this.model.url = App.Url + '/websites/'+this.model.id;
    this.model.save({title: title, description: description, domains: domains}, {
      contentType : 'application/json',
      dataType : 'text',
      success: function (model) {
        message('success', '', 'Success');
        var newReport = new App.Models.ProviderReport ();
        newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-cog"></span> ' + that.model.get("type") + ' <strong>' + that.model.get("name") + '</strong> updated'});
      },
      error: function (data) {
        message('danger', 'Error: ', data);
      }
    });

    this.$el.find(".website_form").addClass('hide');
    this.$el.find(".website_content").removeClass('hide');
  },
  remove: function () {
    this.$el.remove();
  },
  error: function () {
    message('danger', 'something is wrong', 'or may be not and this just a test alert message');
  },
});

//View of the list of websites
App.Views.ProviderWebsites = Backbone.View.extend({
  el: $(".provider_websites"),
  initialize: function () {
    this.collection.on('add', this.addOne, this);
    this.collection.on('reset', this.render, this);
  },
  render: function () {
    this.collection.each(this.addOne, this);
    return this;
  },
  addOne: function (website) {
    var websiteView = new App.Views.ProviderWebsite ({ model: website });
    $(".provider_websites").append(websiteView.render().el);
  }
});

//Add website form
App.Views.ProviderAddWebsite = Backbone.View.extend({
  el: $("#content"),
  initialize: function() {

  },
  events: {
    'click .provider-websites-add'     : 'addWebsite',
    'click .provider-websites-cancel'  : 'cancelForm',
    'click .provider-websites-submit'  : 'submitForm',
    'click .provider-websites-get-code': 'generate_code',
    'click .provider-websites-verify'  : 'verify_code',
    'keyup #provider_websites_domain'  : 'validate_code',
    'click .provider-website-checkbox [type="checkbox"]': 'categories',
  },
  addWebsite: function(e) {
    $('.provider-websites-add').addClass('hide');
    $('.provider_websites_form').removeClass('hide');

  },
  cancelForm: function(e) {
    $('.provider_websites_form').addClass('hide');
    $('.provider-websites-add').removeClass('hide');

  },
  submitForm: function(e) {
    e.preventDefault();
    var verify = $('.span-provider-websites-verify').text();

    var title = $('#provider_websites_title').val();
    var description = $('#provider_websites_description').val();

    var categories = new Array();
    $('.provider-website-checkbox [type="checkbox"]:checked').each(function() {
      categories.push(this.value);
    });

    var domains = new Array();
    domains[0] = $('#provider_websites_domain').val();

    window.newWebsite =  new App.Models.ProviderWebsite ();
    var validate = newWebsite.validate({title: title, description: description, domains: domains, categories: categories, owner: Number(window.profileId)});
    if (validate) {
      message('danger', 'Validation error: ', validate);
    } else {
      //**********************************************************
      //       ADD new website (if success, add it to collection)
      //**********************************************************
      message('danger', 'Validation error: ', verify);
      newWebsite.url = App.Url + '/websites';
      var that = this;
      newWebsite.save({title: title, description: description, domains: domains, categories: categories, owner: Number(window.profileId)}, {
        success: function (data) {
          that.collection.add(data);
          var newReport = new App.Models.ProviderReport ();
          newReport.save({profileId: window.profileId, type: 'outgoing', description: '<span class="glyphicon glyphicon-cog"></span> New ' + type + ' <strong>' + name + '</strong> added'});
        },
        error: function (data) {
          message('danger', 'Error: ', data);
        }
      });

      $('#provider_websites_domain').val('');
      $('#provider_websites_name').val('');
      $('.provider-websites-submit').addClass('disabled');

      $('.provider_websites_form').addClass('hide');
      $('.provider-websites-add').removeClass('hide');
    }
  },
  categories: function (e) {
    if ($('.provider-website-checkbox [type="checkbox"]:checked').length >= 5) {
      $('.provider-website-checkbox [type="checkbox"]:not(:checked)').attr('disabled' , 'disabled');
    } else {
      $('.provider-website-checkbox [type="checkbox"]:not(:checked)').removeAttr('disabled');
    }
  },
  validate_code: function () {
    var urlRegex = /[^a-z0-9._-]/gi;
    var domain  = $('#provider_websites_domain').val();

    if (domain.search( ',' ) != -1 || domain.search( ' ' ) != -1) {
      this.code_generation();
    }

    domain = domain.replace(urlRegex, "");
    $("#provider_websites_domain").val(domain);
    $('.span-provider-websites-verify').text('');
  },
  generate_code: function (e) {
    e.preventDefault();
    var domain  = $('#provider_websites_domain').val();
    var urlRegex = /[^a-z0-9._-]/gi;
    var domain = domain.replace(urlRegex, "");

    var that = this;
    if (!urlRegex.test(domain)) {

      $.ajax({
        // url: 'php/checkDomain.php',
        url: '/domain/create',
        method: 'POST',
        data: {cmd: 'create', domain: domain},
        success: function(data) {
          data = data.split('|');

          $('#file').text(data[0]);
          $('#code').text(data[1]);
          $('.verification').removeClass('hide');

          $('.file-download').attr('href','profileData/tempWebsiteFiles/' + data[0]);
        }
      });

      $.ajax({
        // url: 'php/checkDomain.php',
        url: '/domain/createScreenshot',
        method: 'POST',
        data: {cmd: 'createScreenshot', domain: domain},
        success: function(data) {
          if (data == '') {
            var time = new Date().getTime();
            $('#website_screenshot_preview').html('<img id="user_image" class="img-responsive" style="padding: 0px" src ="profileData/websiteScreenshot/' + domain + '.png?' + time +'">');
          }
        }
      });
    }
  },
  verify_code: function (e) {
    e.preventDefault();
    var domain  = $('#provider_websites_domain').val();
    var that = this;
    if (domain != '') {
      $.ajax({
        //url: 'php/checkDomain.php',
        url: '/domain/verify',
        method: 'POST',
        data: {cmd: 'verify', domain: domain},
        success: function(data) {
          if (data == 'approved') {
            $('.provider-websites-submit').removeClass('disabled');
            $('.span-provider-websites-verify').removeClass('red').addClass('green').text('Website is verified');
          } else {
            $('.span-provider-websites-verify').removeClass('green').addClass('red').text('Website is not verified');
          }
        }
      });
    }
  },
});