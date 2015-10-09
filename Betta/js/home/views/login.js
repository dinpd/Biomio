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
        "keyup .biomio-email input"         : "clear_notifications",
        "click .biomio-submit"              : "submit",
        "keyup .login-buttons .login-phone" : "biomio_login_phone",
        "keyup .login-buttons .login-email" : "biomio_login_email",
        "click .login-send-code"            : "login_send_code",
        "click .submit-login-code button"   : "submit_login_code",

        "keyup .login-phone .country-code"  : "verify_country_code",
        "keyup .login-phone .region-code"   : "verify_region_code",
        "keyup .login-phone .first-part"    : "verify_first_part",
        "keyup .login-phone .second-part"   : "verify_second_part",

        "click .guest-login button": "guest_login",
        "click .test-login button": "test_login",
        "click .switch_methods"   : "switch_methods",
    },
    clear_notification: function() {
        $('.biomio-email span').text();
    },
    submit: function(e) {
        e.preventDefault();
        var that = this;

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

                        window.tempId = data.id;
                        var face = data.face; // 1 or 0
                        var profilePhone = data.phone; // number of phones

                        $('.login-phone-code').removeClass('hide');
                        
                        console.log(face);
                        if (face != 999) {
                            $('.biometrics-login').removeClass('hide');
                            that.biometric_authentication();

                            $('.login-email').val(email);
                            if (profilePhone == 0)
                                $('.login-phone-code').addClass('hide');

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
            data: {cmd: cmd, profileId: window.tempId, value: value},
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
        if (window.tempId == null || window.tempId == undefined) {
            alert('something is wrong, please reload the page and try again');
        } else {
            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                dataType: "json",
                data: {cmd: "check_login_code", profileId: window.tempId, code: code},
                success: function(data) {
                    if (data.response == '#code') {
                        $('.submit-login-code span').text("the code is incorrect or expired");
                    } else {
                        window.profileId = data.id;
                        window.profileFirstName = data.first_name;
                        window.profileLastName = data.last_name;
                        window.profileType = data.type;
                        //alert("Welcome to BIOMIO!")
                        window.location.hash = 'user-info';
                        session_checker();
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
                    //alert("Welcome to BIOMIO!")
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
                    //alert("Welcome to BIOMIO!")
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
    biometric_authentication: function () {
        clearInterval(check);
        var email = $('.biomio-email input').val();

        console.log(email);

        var that = this;
        var context = 0;
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            dataType: "json",
            data: {cmd: "generate_bioauth_code", email: email},
            success: function(code) {
                $('.bioauth-code').val(code);

                //clearInterval(check);
                //check = setInterval(function() {
                    //that.check_bioauth();
                //}, 3000);

                var port = chrome.runtime.connect('ooilnppgcbcdgmomhgnbjjkbcpfemlnj');
                port.postMessage({command: "run_auth", email: email, auth_code: code.toString()});
                port.onMessage.addListener(function(response){
                    console.log(response);
                    console.log(response.timeout);

                    if (response.status == 'error') {
                        $('.biometrics-login > div').addClass('hide');
                        $('.biometrics-login .error-block').removeClass('hide');
                        $('.biometrics-login .error-block .message').text(response.error);
                    } else if (response.status == 'in_progress' && response.timeout != undefined) {
                        $('.biometrics-login > div').addClass('hide');
                        $('.biometrics-login .in-progress-1-block').removeClass('hide');
                        $('.biometrics-login .in-progress-1-block .message').text(response.message);
                        $('.biometrics-login .in-progress-1-block .timeout').text(response.timeout);

                        clearInterval(check);
                        check = setInterval(function() {
                            var text = parseInt($('.biometrics-login .in-progress-1-block .timeout').text());
                            var text = text - 1;
                            $('.biometrics-login .in-progress-1-block .timeout').text(text)
                            if (text <= 0)
                                clearInterval(check);
                        }, 1000);
                    } else if (response.status == 'in_progress' && response.timeout == undefined) {
                        clearInterval(check);
                        check = setInterval(function() {
                            that.check_bioauth();
                        }, 3000);
                        $('.biometrics-login > div').addClass('hide');
                        $('.biometrics-login .in-progress-2-block').removeClass('hide');
                        $('.biometrics-login .in-progress-2-block .message').text(response.message);
                    } else if (response.status == 'completed') {
                        $('.biometrics-login > div').addClass('hide');
                        $('.biometrics-login .biometrics-success').removeClass('hide');
                        that.check_bioauth();
                    }
                        
                });
            }
        });
    },
    check_bioauth: function () {
        var code = $('.bioauth-code').val();
        console.log('verification call for ' + code);
        if (code != '' && code != undefined)
            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                dataType: "json",
                data: {cmd: "check_bioauth_code", code: code},
                success: function(data) {
                    console.log(data);
                    if (data.response == '#verified') {
                        clearInterval(check);
                        $('.biometrics-login > div').addClass('hide');
                        $('.biometrics-login .biometrics-success').removeClass('hide');

                        window.profileId = data.id;
                        window.profileFirstName = data.first_name;
                        window.profileLastName = data.last_name;
                        window.profileType = data.type;
                        //alert("Welcome to BIOMIO!")
                        window.location.hash = 'user-info';
                        session_checker();
                    }
                }
            });
        else clearInterval(check);
    },
    switch_methods: function() {
        $('.biometrics-login').addClass('hide');
        $('.login-buttons').removeClass('hide');
    }
});