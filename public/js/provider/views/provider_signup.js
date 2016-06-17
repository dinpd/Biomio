App.Views.Signup = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('ProviderSignupView', {});
        this.$el.html( template );
        if (window.profileId == null && window.profileId == undefined) $('.frame').removeClass('hide');
    },
    events: {
        //View-1
        "click .signup .new"           : "new_user",
        "click .signup .returning"     : "returning_user",
        "click .signup .register-provider"           : "register_provider",

        //Signup
        "keyup .signup #sign_in_first_name"       : "verify_name",
        "keyup .signup #sign_in_last_name"        : "verify_name",
        "change .signup #sign_in_email"           : "verify_email",
        "click .signup #sign_in_submit"           : "submit_check",

        //Login
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

        "click .switch_methods"   : "switch_methods",
        "keyup #external_token" : "refresh_methods",
    },
    new_user: function(e) {
        $('.new').addClass('active').addClass('active-menu');
        $('.returning').removeClass('active').removeClass('active-menu');
        $('.new-user').removeClass('hide');
        $('.returning-user, .provider-contact').addClass('hide');
    },
    returning_user: function(e) {
        $('.new').removeClass('active').removeClass('active-menu');
        $('.returning').addClass('active').addClass('active-menu');
        $('.new-user, .provider-contact').addClass('hide');
        $('.returning-user').removeClass('hide');
    },
    user_submit_check: function(e) {
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
                //url: '../php/login.php',
                url: '../login/sign_up',
                data: {cmd: "sign_up", first_name: first_name, last_name: last_name, email: email, type: type},
                success: function(data) {
                    if (data == '#email') $('#sign_in_submit_span').text("this email address is already registered in our system");
                    else {
                        window.profileId = data;
                        window.profileFirstName = first_name;
                        window.profileLastName = last_name;
                        window.profileType = type;
                        
                        provider_contact();
                    }
                    //if error, remove alert after 5 seconds
                    setTimeout(function() {
                        $('#sign_in_submit_span').text('');
                    }, 5000);
                }
            });
    },
    register_provider: function(e) {
        e.preventDefault(e);

        if (window.profileId == null || window.profileId == undefined) message('danger', 'Error: ', 'you need to register a user or login with your account to proceed');
        else {
            var name = $('.provider-name').val();
            var ein = $('.provider-ein').val();
            var phone = $('.provider-phone').val();
            var email = $('.provider-email').val();

            var address = {};
            address['line1'] = $('#address-line1').val();
            address['line2'] = $('#address-line2').val();
            address['city'] = $('#city').val();
            address['region'] = $('#region').val();
            address['code'] = $('#postal-code').val();
            address['country'] = $('#country').val();

            $.ajax({
                type: 'POST',
                //url: '../php/provider.php',
                url: '../provider/register',
                data: {cmd: "register", ein: ein, name: name, phone: phone, email: email, address: address},
                success: function(data) {
                    if (data == '#name') message('danger', 'Error: ', 'this name is already registered');
                    else if (data == '#session') message('danger', 'Error: ', 'sission error. Please log in');
                    else if (data == '#success') window.location.hash = '#provider-info';
                    
                    //if error, remove alert after 5 seconds
                    setTimeout(function() {
                        $('#sign_in_submit_span').text('');
                    }, 5000);
                }
            });
        }
    },
    //Signup
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
                //url: 'php/login.php',
                url: '/login/check_email',
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
                //url: 'php/login.php',
                url: '/login/sign_up',
                data: {cmd: "sign_up", first_name: first_name, last_name: last_name, email: email, type: type},
                success: function(data) {
                    if (data == '#email') $('#sign_in_submit_span').text("this email address is already registered in our system");
                    else {
                        window.profileId = data;
                        window.profileFirstName = first_name;
                        window.profileLastName = last_name;
                        window.profileType = type;
                        
                        provider_contact();
                    }
                    //if error, remove alert after 5 seconds
                    setTimeout(function() {
                        $('#sign_in_submit_span').text('');
                    }, 5000);
                }
            });
    },

    //Login
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
                //url: '../php/login.php',
                url: '../login/login_check',
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
                            //that.biometric_authentication();

                            $('.login-email').val(email);
                            if (profilePhone == 0)
                                $('.login-phone-code').addClass('hide');

                            /*window.location.replace(
                                'http://biom.io:5006/user/authorize' +
                                '?response_type=code' +
                                '&scope=openid' +
                                '&client_id=56ce9a6a93c17d2c867c5c293482b8f9' +
                                //'&external_token=' + email + 
                                '&redirect_uri=https://biom.io:4499/work/login.php' +
                                '&nonce=12p6bfw' +
                                '&state=1slw5l6');*/

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
            //url: '../php/login.php',
            url: '../login/'+cmd,
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
                //url: '../php/login.php',
                url: '../login/check_login_code',
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
                        provider_contact();
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
    biometric_authentication: function () {
        clearInterval(check);
        var email = $('.biomio-email input').val();

        console.log(email);

        var that = this;
        var context = 0;
        $.ajax({
            type: 'POST',
            //url: '../php/login.php',
            url: '../login/generate_bioauth_code',
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
                //url: '../php/login.php',
                url: '../login/check_bioauth_code',
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
                        provider_contact();
                    }
                }
            });
        else clearInterval(check);
    },
    switch_methods: function() {
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
                //url: '../php/login.php',
                url: '../login/login_check',
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
                        
                        $('.login-email').val(email);
                            if (profilePhone == 0)
                                $('.login-phone-code').addClass('hide');

                        clearInterval(check);
                        $('.original-method').addClass('hide');
                        $('.biometrics-login').addClass('hide');
                        $('.login-buttons').removeClass('hide');
                    }
                }
            });
    },
    refresh_methods: function() {
        $('.login-buttons').addClass('hide');  
        $('.login-code').addClass('hide');  
        $('.submit-login-code').addClass('hide');  
        $('.original-method').removeClass('hide');
        $('.biometrics-login').removeClass('hide');
    }
});

function provider_contact() {
    $('.new-user, .returning-user').addClass('hide');
    $('.provider-contact').removeClass('hide');

    $('.provider-contact-name').text(window.profileFirstName + ' ' + window.profileLastName);
}