App.Views.ProviderUsers = Backbone.View.extend({
  el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('ProviderUsersView', {});
        this.$el.html( template );
        this.get_provider_users();
    },
    events: {
        'submit #provider_users #provider_users_form': 'add_users',
        'click #provider_users .delete': 'delete_user',
    },
    get_provider_users: function() {
        that = this;
        $.ajax({
            type: 'POST',
            //url: '../php/provider.php',
            url: '../provider/load_provider_users',
            data: {cmd: "load_provider_users"},
            dataType: "json",
            success: function(data) {
                if (data != '')
                    jQuery.each(data, function(j, user) {
                      that.render_user(user);
                    });
            }
        });
    },
    render_user: function(user) {
        if (user.status == 'user') var div = '#provider_users_data';
        else if (user.status == 'invitation') var div = '#provider_invitations_data';
        else if (user.status == 'applicaiton') var div = '#provider_applications_data';

        var template = render('forms/ProviderUsersTable', user);
        $(div).prepend( template );
    },
    add_users: function(e) {
        e.preventDefault();
        var data = $('#provider_users_emails').val().split(/[ ,\n]+/);

        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;
        var count = 0;
        var emails = [];
        for (i = 0; i < data.length; i++) {
            if (emailRegex.test(data[i])) {
                emails[count] = data[i];
                count++;
            }
        }

        if (emails.length > 0) {
            bootbox.dialog({
              message: "&nbsp;",
              title: "",
            });
            $('.bootbox').css('z-index', '10001');

            for (i = 0; i < emails.length; i++)
                this.add_provider_user(emails[i]);

        } else {
            message('danger', 'Error: ', 'no valid emails have been entered');
        }
    },
    add_provider_user: function(email) {
        that = this;
        $.ajax({
            type: 'POST',
            //url: '../php/provider.php',
            url: '../provider/add_provider_user',
            data: {cmd: "add_provider_user", user_email: email},
            success: function(data) {
                if (data == '#session') {
                    $('.bootbox-body').html('<p class="text-danger">Your session has been expired</p>');
                } else if (data == '#not-found') {
                    $('.bootbox-body').append('<p class="text-warning">' + email + ' is not registered</p>');
                } else if (data == '#mine') {
                    $('.bootbox-body').append('<p class="text-info">' + email + ' is your email</p>');
                } else if (data == '#exists') {
                    $('.bootbox-body').append('<p class="text-primary">' + email + ' is already added to this provider</p>');
                } else if (data == '#invited') {
                    $('.bootbox-body').append('<p class="text-success">' + email + ' successfully invited</p>');
                    //that.render_user({id:data['});
                }
            }
        });
    },
    delete_user: function(e) {
        $that = $(e.target).closest('tr');
        var userId = $that.attr('id').substring(5);

        $.ajax({
            type: 'POST',
            //url: '../php/provider.php',
            url: '../provider/delete_provider_user',
            data: {cmd: "delete_provider_user", userId: userId},
            success: function(data) {
                message('success', 'Success: ', 'the user has been deleted');
                $('#user_' + userId).remove();
            }
        }); 
    }
});