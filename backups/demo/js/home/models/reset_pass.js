App.Models.ResetPassword = Backbone.Model.extend({

    defaults: {
    },

    initialize: function () {

    },

    submit: function(email, username) {

        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "reset_password", email: email, username: username},
            success: function(data) {
                if (data == '#no-user') $('#reset_span_submit').text("we don't have a user with those credentials in our system");
                else if (data == '#success') window.location.href='passwordReset.php';
                //if error remove alert after 5 seconds
                setTimeout(function() {
                    $('#reset_span_submit').text('');
                }, 5000);
            }
        });
	}

});