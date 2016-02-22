App.Views.Signup = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('SignupView', {});
        this.$el.html( template );
    },
    events: {
        //View-1
        "click .signup .no-application"           : "no_application",
        "click .signup .have-application"         : "have_application",

        "keyup .signup #sign_in_first_name"       : "verify_name",
        "keyup .signup #sign_in_last_name"        : "verify_name",
        "change .signup #sign_in_email"           : "verify_email",
        "click .signup #sign_in_submit"           : "submit_check",
    },
    verify_name: function (e) {
        var id = $(e.currentTarget).attr("id"); //automatically determines whether first_name or last name was changed
        
        var nameRegex = /[^a-z0-9_-]/gi; //allowed symbols for name; the rest will be removed on fly
        var name = $("#" + id).val();
        name = name.replace(nameRegex, "");
        $("#" + id).val(name);
    },
    verify_email: function (e) {
        var email = $("#sign_in_email").val();
        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;
        email_check = emailRegex.test(email)
        
        if (!email_check) {
            $('#sign_in_email_group').removeClass("has-success").addClass("has-warning");
            $('#sign_in_email_span').text('E-mail has incorrect formatting');
        } else {
            $('#sign_in_email_group').removeClass("has-warning").addClass("has-success");
            //$('#sign_in_email_span').text('');

            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                data: {cmd: "check_email", email: email},
                success: function(data) {
                    if (data.search("#registered")!=-1) {
                        $('#sign_in_email_group').removeClass("has-success").addClass("has-warning");
                        $('#sign_in_email_span').text('This email is already registered in our system');
                    } else if (data.search("#fine")!=-1)  {
                        $('#sign_in_email_group').removeClass("has-warning").addClass("has-success");
                        $('#sign_in_email_span').text('This e-mail is available');
                    }
                }
            });
        }
    },
    submit_check: function(e) {
        e.preventDefault(e);
        var first_name = $('#sign_in_first_name').val();
        var last_name = $('#sign_in_last_name').val();
        var email = $('#sign_in_email').val();
        var type = 'USER';

        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;

        if (first_name.length < 1)
            $('#sign_in_submit_span').text("The first name can't be empty");
        else if (last_name.length < 1)
            $('#sign_in_submit_span').text("The last name can't be empty");
        else if (!emailRegex.test(email))
            $('#sign_in_submit_span').text("Email is in incorrect format");
        else
            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                data: {cmd: "sign_up", first_name: first_name, last_name: last_name, email: email, type: type},
                success: function(data) {
                    if (data == '#email') $('#sign_in_submit_span').text("this email address is already registered in our system");
                    else {
                        window.profileId = data;
                        window.profileFirstName = first_name;
                        window.profileLastName = last_name;
                        window.profileType = type;
                        
                        window.location.hash = 'wizard/1';
                        session_checker();
                    }
                    //if error, remove alert after 5 seconds
                    setTimeout(function() {
                        $('#sign_in_submit_span').text('');
                    }, 5000);
                }
            });
    },
    no_application: function() {
        window.location = './#mobilebeta';
    },
    have_application: function() {
        $('.applicatoin-check').addClass('hide');
        $('.signup form').removeClass('hide');
    }

});