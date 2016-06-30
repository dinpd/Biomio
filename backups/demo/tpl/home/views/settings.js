App.Views.AccountSettings = Backbone.View.extend({
    el: $("#content"),
    initialize: function () {
    },
    render: function (type) {
        if (type == 'USER') var template = render('UserSettingsView', this.model.toJSON());
        else if (type == 'PROVIDER') var template = render('ProviderSettingsView', this.model.toJSON());
        this.$el.html( template );
    },
    events: {
        'click .notifications-checkbox [type="checkbox"]' : 'notifications',
        "click #change_submit"                       : "submit",
        "keyup #change_new_password"                 : "verifyPassword",
        "change #change_repeat_password"             : "verifyRepeatPassword",
    },
    notifications: function(event) {
        var notifications = new Array(0,0,0);
        if($('#notifications-0').is(":checked")) notifications[0] = 1;
        if($('#notifications-1').is(":checked")) notifications[1] = 1;
        if($('#notifications-2').is(":checked")) notifications[2] = 1;

        this.model.save({notifications: notifications}, {
            success: function (data) {
                message('success', 'Success: ', 'Notifications successfully changed');
            },
            error: function (data) {
                message('danger', 'Error: ', 'try again');
            }
        });
    },
    submit: function(event) {
        var old_password = $('#change_old_password').val();
        var new_password = $('#change_new_password').val();
        var new_password2 = $('#change_repeat_password').val();
        
        if (new_password.length < 7) {
            $('#change_span_submit').text('The new password is not long enough');
        } else if (new_password != new_password2) {
            $('#change_span_submit').text("Passwords don't match");
        } else {
            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                data: {cmd: "change_password", old_pass: old_password, new_pass: new_password},
                success: function(data) {
                    if (data == '#password-error') $('#reset_span_submit').text("Old password is incorrect");
                    else {
                        alert('Password was successfuly changed')
                        if (data == 'USER') window.location.hash = 'user-info';
                        else if (data == 'PROVIDER') window.location.hash = 'provider-info';
                        else if (data == 'PARTNER') window.location.hash = 'partner-how';
                    }
                }
            });
        }
    },
    verifyPassword: function (event) {
        var passwordRegex = /[^a-z0-9]/gi;

        var new_password = $("#change_new_password").val();
        var password_check = new_password.replace(passwordRegex, "");

        if (password_check.length < 7) {
            $('#change_new_password_group').removeClass("has-success").addClass("has-warning");
            var symbols_left = 7 - password_check.length;
            $('#change_span_new_password').text("Symbols left: " + symbols_left);
        } else if (password_check != new_password) {
            $('#change_new_password_group').removeClass("has-success").addClass("has-warning");
            $('#change_span_new_password').text("Password may contain letters from 'a' to 'z' and numbers");
        } else {
            $('#change_new_password_group').removeClass("has-warning").addClass("has-success");
            $('#change_span_new_password').text('');
        }
    },
    verifyRepeatPassword: function (event) {
        var password1 = $('#change_new_password').val();
        var password2 = $('#change_repeat_password').val();

        if (password1 != password2) {
            $('#change_repeat_password_group').removeClass("has-success").addClass("has-warning");
            $('#change_span_repeat_password').text("Passwords don't match");
        } else {
            $('#change_repeat_password_group').removeClass("has-warning").addClass("has-success");
            $('#change_span_repeat_password').text('');
        }
    }

});