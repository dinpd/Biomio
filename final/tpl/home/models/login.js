App.Models.Login = Backbone.Model.extend({
    defaults: {
    },
    initialize: function () {
    },
    submit: function(email, password, remember) {

        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "login", email: email, password: password, remember: remember},
            success: function(data) {
                if (data == '#email') $('#log_in_span_submit').text("we don't have this email address in our system");
                else if (data == '#password') $('#log_in_span_submit').text("password is incorrect");
                else {
                    var data = jQuery.parseJSON( data );
                    window.profileName = data.username;
                    window.profileId = data.id;
                    window.profileApiId = data.api_id;
                    window.profileType = data.type;
                    alert('Wellcome back!')
                    if (data.type == 'USER') window.location.hash = 'user-info';
                    else if (data.type == 'PROVIDER') window.location.hash = 'provider-info';
                    else if (data.type == 'PARTNER') window.location.hash = 'partner-how';
                }
                //if error remove alert after 5 seconds
                setTimeout(function() {
                    $('#log_in_span_submit').text('');
                }, 5000);
            }
        });
	}
});