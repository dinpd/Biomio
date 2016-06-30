App.Models.AccountSettings = Backbone.Model.extend({

    defaults: {
    },

    initialize: function () {

    },

    submit: function(old_password, new_password) {
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/change_password',
            data: {cmd: "change_password", old_pass: old_password, new_pass: new_password},
            success: function(data) {
                if (data == '#password-error') $('#reset_span_submit').text("Old password is incorrect");
                else {
                    alert('Password was successfuly changed')
                    if (data == 'USER') window.location.hash = 'user-info';
                    else if (data == 'PROVIDER') window.location.hash = 'provider-info';
                }
            }
        });
	},

});