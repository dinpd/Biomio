App.Views.Login = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('LoginView', {});
        this.$el.html( template );

        //put stored value
        var username = get_yourself_a_cookie('biomio_username');
        $('.biomio-name input').val(username);
    },
    events: {
        "keyup .biomio-name input": "clear_notifications",
        "click .biomio-submit": "submit",
        "keyup .login-buttons .login-phone": "biomio_login_phone",
        "keyup .login-buttons .login-email": "biomio_login_email",
        "click .login-send-code": "login_send_code",
        "click .submit-login-code button": "submit_login_code",

        "keyup .login-phone .country-code"  : "verify_country_code",
        "keyup .login-phone .region-code"   : "verify_region_code",
        "keyup .login-phone .first-part"    : "verify_first_part",
        "keyup .login-phone .second-part"   : "verify_second_part"
    },
    clear_notification: function() {
        $('.biomio-name span').text();
    },
    submit: function(e) {
        $('.login-buttons').addClass('hide');
        $('.login-phone-code').removeClass('hide');
        // 1) check if username exists in a system - load user data
        var username = $('.biomio-name input').val();
        if (username.length < 2) {
            $('.biomio-name span').text('Name is too shirt');
        } else {
            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                dataType: "json",
                data: {cmd: "login_check", username: username},
                success: function(data) {
                    if (data.id == null) {
                        $('.biomio-name span').text('Account with this name does not exist');
                    } else {
                        window.profileId = data.id;
                        window.fingerprints = data.fingerprints; // 1 or 0
                        window.profilePhone = data.phone; // 1 or 0

            // 2) check if user has biometrix or phone (disable phone button if not registered)
                        if (window.fingerprints != 0) {
                            // check for fingerprints
                            biomio_verify();
                        } else {
                            // open buttons
                            $('.login-buttons').removeClass('hide');
                            // disable phone button if user doesn't have phone
                            if (window.profilePhone == 0)
                                $('.login-phone-code').addClass('hide');
                        }
                    }
                }
            });
        }
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
                        window.profileName = data.username;
                        window.profileId = data.id;
                        window.profileApiId = data.api_id;
                        window.profileType = data.type;
                        alert('Welcome back!')
                        if (data.type == 'USER') window.location.hash = 'user-info';
                        else if (data.type == 'PROVIDER') window.location.hash = 'provider-info';
                    }
                    //if error remove alert after 5 seconds
                    setTimeout(function() {
                        $('.submit-login-code span').text('');
                    }, 5000);
                }
            });
        }
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