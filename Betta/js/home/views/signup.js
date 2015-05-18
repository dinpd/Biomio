App.Views.Signup = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('SignupView', {});
        this.$el.html( template );
    },
    events: {
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
                    if (data.search("#registred")!=-1) {
                        $('#sign_in_email_group').removeClass("has-success").addClass("has-warning");
                        $('#sign_in_email_span').text('This email is already registred in our system');
                    } else if (data.search("#fine")!=-1)  {
                        $('#sign_in_email_group').removeClass("has-warning").addClass("has-success");
                        $('#sign_in_email_span').text('This e-mail is free');
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
                    if (data == '#email') $('#sign_in_submit_span').text("this email address is already registred in our system");
                    else {
                        window.profileId = data;
                        window.profileFirstName = first_name;
                        window.profileLastName = last_name;
                        window.profileType = type;
                        alert("Welcome to BIOMIO!")
                        window.location.hash = 'user-info';
                    }
                    //if error, remove alert after 5 seconds
                    setTimeout(function() {
                        $('#sign_in_submit_span').text('');
                    }, 5000);
                }
            });
    },
});