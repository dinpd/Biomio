//Main View for Provider Locations
App.Views.ProviderWebResources = Backbone.View.extend({
    el: $("#content"),
  initialize:function () {
  },
  render:function () {
      var template = render('WebResourcesView', {});
      this.$el.html( template );
      this.loadWebsites();
  },
  events: {
    'click .provider-websites-add'     : 'addWebsite',
    'click .provider-websites-cancel'  : 'cancelForm',
    'click .provider-websites-submit'  : 'submitForm',
    'click .provider-websites-get-code': 'generate_code',
    'click .provider-websites-verify'  : 'verify_code',
    'keyup #provider_websites_domain'  : 'validate_code',

    'click .webresource .remove': 'remove_website'
  },
  addWebsite: function(e) {
      $('.provider-websites-add').addClass('hide');
      $('.provider_websites_form').removeClass('hide');

  },
  cancelForm: function(e) {
      $('.provider_websites_form').addClass('hide');
      $('.provider-websites-add').removeClass('hide');

  },
  loadWebsites: function(e) {
    var that = this;
    $.ajax({
        type: 'POST',
        //url: '../php/provider.php',
        url: '../provider/load_websites',
        dataType: "json",
        data: {cmd: "load_websites"},
        success: function(data) {
            if (data != null)
              jQuery.each(data, function(i, website) {
                that.render_website(website.id, website.title, website.domain, website.hook);
              });
        }
    });
  },
  render_website: function(id, title, domain, hook) {
    $('.web-resources').prepend('<tr id="resource_' + id + '" class="webresource">' +
                                  '<td>' + title + '</td>' +
                                  '<td>' + domain + '</td>' +
                                  '<td>' + hook + '</td>' +
                                  '<td>' +
                                      '<button type="button" class="close control-button remove" aria-hidden="true"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>' +
                                      /*'<button type="button" class="btn btn-success key">api keys</button>' +*/
                                  '</td>' +
                              '</tr>');
  },
  remove_website: function(e) {
    $that = $(e.target).closest('tr');
    var id = $that.attr('id').substring(9);

    $.ajax({
        type: 'POST',
        //url: '../php/provider.php',
        url: '../provider/delete_website',
        data: {cmd: "delete_website", id: id},
        success: function(data) {
          $('#resource_' + id).remove();
        }
    });
  },
  /*generate_keys: function(e) {
    $that = $(e.target).closest('tr');
    var id = $that.attr('id').substring(9);

    $.ajax({
        type: 'POST',
        url: '../php/provider.php',
        dataType: "json",
        data: {cmd: "generate_website_keys", id: id},
        success: function(data) {
          message = '<p><strong>public key:</strong> ' + data.public_key + '</p>' +
                    '<p><strong>private key:</strong> ' + data.private_key + '</p>';

          bootbox.dialog({
            message: message,
            title: "Save your API keys",
            buttons: {
              success: {
                label: "ok",
                className: "btn-success",
                callback: function() {
                  $('.bootbox-close-button').click();
                }
              }
            }
          });
        }
    });
  },*/
  submitForm: function(e) {
    e.preventDefault();
    var that = this;
    var title = $('#provider_websites_title').val();
    var domain = $('#provider_websites_domain').val();
    var hook = $('#provider_websites_hook').val();

    $.ajax({
        type: 'POST',
        //url: '../php/provider.php',
        url: '../provider/save_website',
        data: {cmd: "save_website", title: title, domain: domain, hook: hook},
        success: function(data) {
            if (data == '#exist') message('danger', 'Error: ', 'this domain already exist in our system');
            else {
              that.render_website(data, title, domain, hook);
              $('#provider_websites_title').val('');
              $('#provider_websites_domain').val('');
              $('#provider_websites_hook').val('');
              $('.verification').addClass('hide');

            }
        }
    });
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

    $('.hook-domain').text(domain + '/');
  },
  generate_code: function (e) {
    e.preventDefault();
    $('.verification').addClass('hide');
    var domain  = $('#provider_websites_domain').val();
    var urlRegex = /[^a-z0-9._-]/gi;
    var domain = domain.replace(urlRegex, ""); 
    
    var that = this;
    if (!urlRegex.test(domain)) {

      $.ajax({
         // url: '../php/checkDomain.php',
          url: '../domain/create',
          method: 'POST',
          data: {cmd: 'create', domain: domain},
          success: function(data) {
            data = data.split('|');

            $('#file').text(data[0]);
            $('#code').text(data[1]);
            $('.verification').removeClass('hide');

            $('.file-download').attr('href','../profileData/tempWebsiteFiles/' + data[0]);
          }
      });

      $.ajax({
          //url: '../php/checkDomain.php',
          url: '../domain/createScreenshot',
          method: 'POST',
          data: {cmd: 'createScreenshot', domain: domain},
          success: function(data) {
            if (data == '') {
              var time = new Date().getTime();
              $('#website_screenshot_preview').html('<img id="user_image" class="img-responsive" style="padding: 0px" src ="../profileData/websiteScreenshot/' + domain + '.png?' + time +'">');
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
         // url: '../php/checkDomain.php',
          url: '../domain/verify',
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
  }
});