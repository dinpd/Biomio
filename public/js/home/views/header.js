App.Views.Header = Backbone.View.extend({
    el: $(".header"),
    initialize: function () {
    },
    render: function () {
        var template = render('HeaderView');
        this.$el.html( template );

        //put stored value of email
        var email = get_yourself_a_cookie('biomio_email');
        $('.biomio-email input').val(email);

        $('.tooltipster-dev').tooltipster({'maxWidth': 250, theme: 'tooltipster-light', delay: 50, content: $('<p>This page is in development</p>')});

        if (window.profileId != '' && window.profileId != null) {
            $('.profile-on').removeClass("hide");
            $('.profile-off').addClass("hide");
            if ((window.profileFirstName == null && window.profileLastName == null) || (window.profileFirstName == '' && window.profileLastName == '')) $('.profile').html('User');
            else if (window.profileFirstName == null || window.profileFirstName == '') $('.profile').html(window.profileLastName);
            else if (window.profileLastName == null || window.profileLastName == '') $('.profile').html(window.profileFirstName);
            else $('.profile').html(window.profileFirstName + ' ' + window.profileLastName);

            $.ajax({
                type: 'POST',
                //url: './php/provider.php',
                url: '/provider/load_providers',
                data: {cmd: "load_providers"},
                dataType: "json",
                success: function(data) {
                    if (data != null)
                        jQuery.each(data, function(j, provider) {
                            $( ".provider-header" ).after('<li><a href="./provider/session/' + provider.id + '">' + provider.name + '</a></li>');
                        });
                }
            });
        } else {
            $('.profile-off').removeClass("hide");
            $('.profile-on').addClass("hide");
        }
    },
    events: {
        "click .logout-menu": "logout",
        "click .drop-login": "login",

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

        "keyup #external_token" : "refresh_methods",
    },
    logout: function (event) {
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/logout',
            data: {cmd: "logout"},
            success: function(data) {
                if (data.search("out")!=-1) {
                    //document.cookie = 'connect.sid' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                    //set_cookie('connect.sid', '', 200);

                    $('.logout-menu').addClass("hide");
                    window.profileId = undefined;
                    window.profileFirstName = undefined;
                    window.profileLastName = undefined;
                    window.profileType = undefined;
                    window.location.hash = 'home';

                    console.log(' ');
                    console.log(' ------------------------------------------------------ ');
                    console.log('clearInterval(session_checker). header.js logout');
                    console.log('session_checker_interval is:', session_checker_interval);
                    console.log('ession_checker:', session_checker);

                    clearInterval(session_checker);
                    
                    //switching tabs in pannel view
                    $('.profile-off').removeClass("hide");
                    $('.profile-on').addClass("hide");
                }
            }
        });
    },
    changeType: function (type) {
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/change_type',
            data: {cmd: "change_type", type: type},
            success: function(data) {

            }
        });
    },
    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    },
    login: function () {
        if($('.drop-content').hasClass('hide')) $('.drop-content').removeClass('hide');
        else $('.drop-content').addClass('hide');
    },

    // login
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

        if (email.length == 0)
            $('.biomio-email span').text('please enter your email');
        else if (!emailRegex.test(email))
            $('.biomio-email span').text('email is in a wrong format');
        else
            $.ajax({
                type: 'POST',
                //url: 'php/login.php',
                url: '/login/login_check',
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
                                'http://biom.io:5000/user/authorize' +
                                '?response_type=code' +
                                '&scope=openid' +
                                '&client_id=56ce9a6a93c17d2c867c5c293482b8f9' +
                                //'&external_token=' + email + 
                                '&redirect_uri=https://biom.io:4433/work/login.php' +
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
            //url: 'php/login.php',
            url: '/login/'+cmd,
            data: {cmd: cmd, profileId: window.tempId, value: value},
            success: function(data) {
                if (data == "#success") {
                    $('.login-buttons span').removeClass('text-danger').addClass('text-success').text('Sent to your ' + message);
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

        var data =  $('.login-code input');
        var code = $(data[0]).val() ? $(data[0]).val() : $(data[1]).val();

        if (window.tempId == null || window.tempId == undefined) {
            alert('something is wrong, please reload the page and try again');
        } else {
            $.ajax({
                type: 'POST',
                //url: 'php/login.php',
                url: '/login/check_login_code',
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
                        window.location = './#user-info';

                        console.log(' ');
                        console.log(' ------------------------------------------------------ ');
                        console.log('session_checker(). header.js submit_login_code');
                        console.log('session_checker_interval is:', session_checker_interval);
                        console.log('session_checker:', session_checker);

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

        var that = this;
        var context = 0;
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/generate_bioauth_code',
            dataType: "json",
            data: {cmd: "generate_bioauth_code", email: email},
            success: function(code) {
                $('.bioauth-code').val(code);

                //clearInterval(check);
                //check = setInterval(function() {
                    //that.check_bioauth();
                //}, 3000);

                console.log('in header file line 312');
                console.log(chromeRuntimeKey);
                //var port = chrome.runtime.connect('ooilnppgcbcdgmomhgnbjjkbcpfemlnj');
                var port = chrome.runtime.connect(chromeRuntimeKey);
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
               // url: 'php/login.php',
                url: '/login/check_bioauth_code',
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

                        console.log(' ');
                        console.log(' ------------------------------------------------------ ');
                        console.log('session_checker(). header.js check_bioauth');
                        console.log('session_checker_interval is:', session_checker_interval);
                        console.log('session_checker:', session_checker);

                        session_checker();
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
                // url: 'php/login.php',
                url: '/login/login_check',
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

App.Views.Sidebar = Backbone.View.extend({
    el: $("#sidebar"),
    initialize: function () {
    },
    render: function (type) {
        var template = render(type + 'HeaderView');
        this.$el.html( template );
    },
    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }
});
