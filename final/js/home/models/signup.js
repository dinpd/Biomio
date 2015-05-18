App.Models.Signup = Backbone.Model.extend({
    defaults: {
    },
    initialize: function () {
    },
    submit: function(username, email, password) {
        var type = $("[name='role']").val();
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "sign_up", username: username, email: email, password: password, type: type},
            success: function(check) {
                if (check == '#username') $('#sign_in_span_submit').text("this username is already registred in our system");
                else if (check == '#email') $('#sign_in_span_submit').text("this email address is already registred in our system");
                else {
                    $.post('php/login.php', 
                    {   cmd : 'is_loged_in' },
                    function(data) {
                        if (data != '') {
                            var newUser =  new App.Models.UserPersonalInfo();
                            newUser.url = "http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/";
                            var that = this;
                            newUser.save({username: username, emails: email, password: password, role: type}, {
                                success: function (data2) {
                                    $.ajax({
                                        type: 'POST',
                                        url: 'php/login.php',
                                        data: {cmd: "update_api_id", profileId: data.id, api_id: data2.id},
                                        success: function(data3) {
                                            window.profileName = data.username;
                                            window.profileId = data.id;
                                            window.profileApiId = data2.id;
                                            window.profileType = type;
                                            alert('Welcome to BIOM!')
                                            if (type == 'USER') window.location.hash = 'user-info';
                                            else if (type == 'PROVIDER') window.location.hash = 'provider-info';
                                            else if (type == 'PARTNER') window.location.hash = 'partner-how';
                                        }
                                    });
                                },
                                error: function (data) {
                                    message('danger', 'Error: ', data);
                                }
                            });
                        }
                    },"json");
                }
                //if error, remove alert after 5 seconds
                setTimeout(function() {
                    $('#span_submit').text('');
                }, 5000);
            }
        });
	},
    verify: function (object, data) {
		$.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "verify_" + object, data: data},
            success: function(data) {
                if (data.search("#registred")!=-1) {
                    $('#sign_in_' + object + '_group').removeClass("has-success").addClass("has-warning");
                    $('#sign_in_span_' + object).text('this ' + object + ' is already registred in our system');
                } else if (data.search("#fine")!=-1)  {
                    $('#sign_in_' + object + '_group').removeClass("has-warning").addClass("has-success");
                    $('#sign_in_span_' + object).text(object + ' is fine');
                }
            }
        });
	},
});