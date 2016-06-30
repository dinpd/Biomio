App.Views.Signup = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
    },
    render:function (type) {
        var template = render('SignupView', {type: type, typeLower : type.toUpperCase()});
        this.$el.html( template );
    },
    events: {
        "keyup #sign_in_username"         : "verify_username",
        "keyup #sign_in_first_name"       : "verify_name",
        "keyup #sign_in_last_name"        : "verify_name",
        "click .sign-up-name"             : "border_style", //border style (1px to either side)
        "change #sign_in_email"           : "verify_email",
        "click #sign_in_submit"           : "submit_check",
    },
    verify_name: function (e) {
        var id = $(e.currentTarget).attr("id"); //automatically determines whether first_name or last name was changed
        
        var nameRegex = /[^a-z0-9_-]/gi; //allowed symbols for name; the rest will be removed on fly
        var name = $("#" + id).val();
        name = name.replace(nameRegex, "");
        $("#" + id).val(name);

        // Note:
        // Name has no limitation for the number of symbols, 
        // since there are names that has only 2 letters and probably even 1.
        // Some users prefer to hide their last names by typing only the first letters
        // There is an if-empty check on `submit` stage
    },
    border_style: function (e) {
        var id = $(e.currentTarget).attr("id");
        if (id == 'sign_in_first_name') {
            $('#sign_in_first_name').css('border-right-width', '1px');
            $('#sign_in_last_name').css('border-left-width', '0');
        } else {
            $('#sign_in_first_name').css('border-right-width', '0');
            $('#sign_in_last_name').css('border-left-width', '1px');
        }
        $('#' + id + '_group form-control').focus();
    },
    verify_email: function (e) {
        var email = $("#sign_in_email").val();
        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;
        email = emailRegex.test(email)
        
        if (!email) {
            $('#sign_in_email_group').removeClass("has-success").addClass("has-warning");
            $('#sign_in_email_span').text('E-mail has incorrect formatting');
        } else {
            $('#sign_in_email_group').removeClass("has-warning").addClass("has-success");
            $('#sign_in_email_span').text('');

            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                data: {cmd: "verify_email", email: email},
                success: function(data) {
                    if (data.search("#registred")!=-1) {
                        $('#sign_in_email_group').removeClass("has-success").addClass("has-warning");
                        $('#sign_in_email_span').text('This email is already registred in our system');
                    } else if (data.search("#fine")!=-1)  {
                        $('#sign_in_email_group').removeClass("has-warning").addClass("has-success");
                        $('#sign_in_email_span').text('E-mail is not yet registred in BIOMIO');
                    }
                }
            });
        }
    },
    verify_username: function (e) {

        var nameRegex = /[^a-z0-9_-]/gi; //allowed symbols for name; the rest will be removed on fly
        var username = $('#sign_in_username').val();
        username = username.replace(nameRegex, "");
        $('#sign_in_username').val(username);

        if (!username) {
            $('#sign_in_username_group').removeClass("has-success").addClass("has-warning");
            $('#sign_in_username_span').text('Username has incorrect formatting');
        } else {
            $('#sign_in_username_group').removeClass("has-warning").addClass("has-success");
            $('#sign_in_username_span').text('');

            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                data: {cmd: "verify_username", username: username},
                success: function(data) {
                    if (data.search("#registred")!=-1) {
                        $('#sign_in_username_group').removeClass("has-success").addClass("has-warning");
                        $('#sign_in_username_span').text('This username is already registred in our system');
                    } else if (data.search("#fine")!=-1)  {
                        $('#sign_in_username_group').removeClass("has-warning").addClass("has-success");
                        $('#sign_in_username_span').text('Username is free');
                    }
                }
            });
        }
    },
    submit_check: function(e) {
        e.preventDefault(e);
        var username = $('#sign_in_username').val();
        var first_name = $('#sign_in_first_name').val();
        var last_name = $('#sign_in_last_name').val();
        var email = $('#sign_in_email').val();

        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;

        if (first_name.length < 1) {
            $('#sign_in_submit_span').text("The first name can't be empty");
        } else if (last_name.length < 1) {
            $('#sign_in_submit_span').text("The last name can't be empty");
        } else if (!emailRegex.test(email)) {
            $('#sign_in_submit_span').text("Email is in incorrect format");
        } else {
            this.submit(username, first_name, last_name, email);
        }
    },
    submit: function(username, first_name, last_name, email) {
        var type = $("[name='role']").val();
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            dataType: "json",
            data: {cmd: "sign_up", username: username, first_name: first_name, last_name: last_name, email: email, type: type},
            success: function(data) {
                if (data == '#username') $('#sign_in_span_submit').text("this username is already registred in our system");
                else if (data == '#email') $('#sign_in_span_submit').text("this email address is already registred in our system");
                else {
                    var newUser =  new App.Models.UserPersonalInfo();
                    newUser.url = "http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/";
                    var that = this;
                    newUser.save({username: username, emails: email, role: type}, {
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
                                    alert("Welcome to BIOMIO!")
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
                //if error, remove alert after 5 seconds
                setTimeout(function() {
                    $('#span_submit').text('');
                }, 5000);
            }
        });
    },
});