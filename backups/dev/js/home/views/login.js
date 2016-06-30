App.Views.Login = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('LoginView', {});
        this.$el.html( template );

        //put stored value
        var email = get_yourself_a_cookie('biomio_email');

        $('.biomio-email input').val(email);
    },
    events: {
        "keyup .biomio-email input": "clear_notifications",
        "click .biomio-submit": "submit",
        "keyup .login-buttons .login-phone": "biomio_login_phone",
        "keyup .login-buttons .login-email": "biomio_login_email",
        "click .login-send-code": "login_send_code",
        "click .submit-login-code button": "submit_login_code",

        "keyup .login-phone .country-code"  : "verify_country_code",
        "keyup .login-phone .region-code"   : "verify_region_code",
        "keyup .login-phone .first-part"    : "verify_first_part",
        "keyup .login-phone .second-part"   : "verify_second_part",

        "click .guest-login button": "guest_login",
        "click .test-login button": "test_login",
    },
    clear_notification: function() {
        $('.biomio-email span').text();
    },
    submit: function(e) {
        e.preventDefault();

        $('.biomio-email span').text('');
        $('#sign_in_email_span').text('');


        $('.login-buttons').addClass('hide');
        $('.login-phone-code').removeClass('hide');
        // 1) check if email exists in a system
        var email = $('.biomio-email input').val();
        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;

        if (!emailRegex.test(email))
            $('.biomio-email span').text('email is in a wrong format');
        else
            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                dataType: "json",
                data: {cmd: "login_check", email: email},
                success: function(data) {
                    if (data.response == "#fine") {
                        $('.biomio-email span').text('This email is not registered in our system');
                    } else {
                        set_cookie('biomio_email', email, 360);
                        $('#sign_in_email_group').removeClass("has-success").addClass("has-warning");

                        window.profileId = data.id;
                        var face = data.face; // 1 or 0
                        var profilePhone = data.phone; // number of phones

                        $('.login-phone-code').removeClass('hide');
                        
                        if (face == 12341234) {
                            // check for fingerprints
                            //biomio_verify();
                        } else {
                            alert('Biometrics Login is coming soon');
                            // open buttons
                            $('.login-buttons').removeClass('hide');
                            $('.login-email').val(email);
                            // disable phone button if user doesn't have phone
                            if (profilePhone == 0)
                                $('.login-phone-code').addClass('hide');
                        }
                    }
                }
            });
    },
    biomio_login_phone: function() {
        console.log('here');
        $('.login-buttons .login-email').val('');
        $('#login-buttons').html('');
    },
    biomio_login_email: function() {
        console.log('here1');
        $('.region-code').val('');
        $('.first-part').val('');
        $('.second-part').val('');

        $('#login-buttons').html('');
    },
    login_send_code: function() {
        var phone = String($('.country-code').val()) + String($('.region-code').val()) + String($('.first-part').val()) + String($('.second-part').val());
        var email = $('.login-buttons .login-email').val();

        if (phone.length != 1) { var cmd = 'send_phone_login_code'; var message = 'phone'; value = phone; }
        else if (email.length != 0) { var cmd = 'send_email_login_code'; var message = 'email'; value = email; }
        else alert('you should enter phone or email');

        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: cmd, profileId: window.profileId, value: value},
            success: function(data) {
                if (data == "#success") {
                    $('.login-buttons span').removeClass('text-danger').addClass('text-success').text('Login code has been texted to your ' + message);
                    $('.login-code').removeClass('hide');
                    $('.submit-login-code').removeClass('hide');
                } else if (data =="#not-found") {
                    $('.login-buttons span').removeClass('hide').removeClass('text-success').addClass('text-danger').html("Entered " + message + " doesn't belong to this account");
                }
            }
        });
    },

    // 4) submit entered code
    submit_login_code: function(e) {
        e.preventDefault();
        var code = $('.login-code input').val();
        if (window.profileId == null || window.profileId == undefined) {
            alert('something is wrong, please reload the page and try again');
        } else {
            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                dataType: "json",
                data: {cmd: "check_login_code", profileId: window.profileId, code: code},
                success: function(data) {
                    if (data == '#code') {
                        $('.submit-login-code span').text("the code is incorrect or expired");
                    } else {
                        window.profileId = data.id;
                        window.profileFirstName = data.first_name;
                        window.profileLastName = data.last_name;
                        window.profileType = data.type;
                        alert("Welcome to BIOMIO!")
                        window.location.hash = 'user-info';
                    }
                    //if error remove alert after 5 seconds
                    setTimeout(function() {
                        $('.submit-login-code span').text('');
                    }, 5000);
                }
            });
        }
    },
    guest_login: function() {
        $.ajax({
                type: 'POST',
                url: 'php/login.php',
                dataType: "json",
                data: {cmd: "guest_login"},
                success: function(data) {
                    
                    window.profileId = data.id;
                    window.profileFirstName = data.first_name;
                    window.profileLastName = data.last_name;
                    window.profileType = data.type;
                    alert("Welcome to BIOMIO!")
                    window.location.hash = 'user-info';

                    //if error remove alert after 5 seconds
                    setTimeout(function() {
                        $('.submit-login-code span').text('');
                    }, 5000);
                }
            });
    },
    test_login: function() {
        $.ajax({
                type: 'POST',
                url: 'php/login.php',
                dataType: "json",
                data: {cmd: "test_login"},
                success: function(data) {
                    
                    window.profileId = data.id;
                    window.profileFirstName = data.first_name;
                    window.profileLastName = data.last_name;
                    window.profileType = data.type;
                    alert("Welcome to BIOMIO!")
                    window.location.hash = 'user-info';

                    //if error remove alert after 5 seconds
                    setTimeout(function() {
                        $('.submit-login-code span').text('');
                    }, 5000);
                }
            });
    },
    verify_region_code: function (e) {
        var phone = $('.region-code').val();
        phone = phone.replace(/\D/g,'');
        $('.region-code').val(phone);

        if (phone.length == 3) $('.first-part').focus();
    },
    verify_first_part: function (e) {
        var phone = $('.first-part').val();
        phone = phone.replace(/\D/g,'');
        $('.first-part').val(phone);

        if (phone.length == 3) $('.second-part').focus();
    },
    verify_second_part: function (e) {
        var phone = $('.second-part').val();
        phone = phone.replace(/\D/g,'');
        $('.second-part').val(phone);

    },
});