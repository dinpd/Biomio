App.Views.userServices = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {

    },
    render:function (type) {

        var that = this;
        var template = render('UserServicesView', {});
        this.$el.html( template );
        this.get_user_extensions();
        this.get_user_emails();
        this.get_extension_settings();
        this.get_gate_keys();

    },
    events: {
        // chrome extention
        "submit .user-services .add-2"                  : "add_email",
        "click .user-services .extention-email .plus"   : "plus_email",
        "click .user-services .extention-email .minus"  : "minus_email",
        "click .user-services .extention-email .remove" : "delete_email",
        "click .user-services .extention-email .verify" : "get_email_for_verification",
        "click .user-services .form-2-2 button"         : "verify_email",
        "click .user-services .verify-extention button" : "verify_extention",
        "click .user-services .form-2-1 button"         : "generate_extention_code"
    },
    // Chrome Extention
    get_extension_settings: function () {
        var that = this;

        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/get_extension_settings',
            dataType: "json",
            data: {cmd: "get_extension_settings"},
            success: function(data) {
                var checkbox_id = true;
                var checkbox_location = true;
                var checkbox_face = true;
                var checkbox_face2 = true;
                var checkbox_secret = true;
                var checkbox_bio = true;
                var checkbox_option = true;

                console.log(data.auth_types);
                console.log(jQuery.inArray( 'fp', data.auth_types));
                console.log(jQuery.inArray( 'face', data.auth_types ));

                if (data.response != '#no-data') {
                    if (jQuery.inArray( 'fp', data.auth_types) == -1)
                        var checkbox_id = false;
                    if (jQuery.inArray( 'face', data.auth_types) == -1)
                        var checkbox_face = false;
                    if (data.condition == 'all')
                        var checkbox_bio = false;
                }
                $(".checkbox-id").bootstrapSwitch({
                  size: 'mini',
                  onText: 'On',
                  offText: 'Off',
                  handleWidth: 20,
                  labelWidth: 20,
                  onColor: 'success',
                  offColor: 'default',
                  state: checkbox_id
                });
                $(".checkbox-face").bootstrapSwitch({
                  size: 'mini',
                  onText: 'On',
                  offText: 'Off',
                  handleWidth: 20,
                  labelWidth: 20,
                  onColor: 'success',
                  offColor: 'default',
                  state: checkbox_face
                });
                $(".checkbox-location, .checkbox-secret").bootstrapSwitch({
                  size: 'mini',
                  onText: 'On',
                  offText: 'Off',
                  handleWidth: 20,
                  labelWidth: 20,
                  onColor: 'success',
                  offColor: 'default',
                  state: true
                });

                $(".checkbox-face2").bootstrapSwitch({
                  size: 'mini',
                  onText: 'yes',
                  offText: 'no',
                  handleWidth: 20,
                  labelWidth: 20,
                  onColor: 'info',
                  offColor: 'default',
                  state: true
                });

                $(".checkbox-bio").bootstrapSwitch({
                  size: 'mini',
                  onText: 'ANY',
                  offText: 'ALL',
                  handleWidth: 25,
                  labelWidth: 25,
                  onColor: 'primary',
                  offColor: 'warning',
                  state: checkbox_bio
                });

                $(".checkbox-option").bootstrapSwitch({
                  size: 'small',
                  onText: 'AND',
                  offText: 'OR',
                  handleWidth: 25,
                  labelWidth: 25,
                  onColor: 'primary',
                  offColor: 'warning',
                  state: true
                });

                $('.user-services input[type="checkbox"]').on('switchChange.bootstrapSwitch', function() {
                  that.change_events();
                });

                var port = chrome.runtime.connect('lgefcndmlikkmgielaeiflkmmgboljhm');
                port.postMessage({command: "is_registered"});
                port.onMessage.addListener(function(response){
                    if (response.is_registered) {
                        $('.verify-extention').addClass('hide');
                        $('.verify-header').addClass('hide');
                        $('.download-protector').addClass('hide');
                    }
                });
            }
        });
    },
    get_gate_keys: function () {
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/get_gate_keys',
            dataType: "json",
            data: {cmd: "get_gate_keys"},
            success: function(data) {
                var text = '<tr><td>' + data.pub + '</td><td>' + data.priv + '</td></tr>';
                $('.service-2-keys').html(text);
            }
        });
    },
    get_user_extensions: function () {
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/get_user_extensions',
            dataType: "json",
            data: {cmd: "get_user_extensions"},
            success: function(data) {
                if (data == 0) $('.verified-extensions').html('<span class="text-info">No extensions yet registered from this account</span>');
                else if (data == 1) $('.verified-extensions').html('<span class="text-success">' + data + ' extension is already registered from this account</span>');
                else if (data > 1) $('.verified-extensions').html('<span class="text-success">' + data + ' extensions are already registered from this account</span>');
            }
        });
    },
    get_user_emails: function () {
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/get_user_emails',
            dataType: "json",
            data: {cmd: "get_user_emails", extention: 1},
            success: function(data) {
                if (data != null)
                    jQuery.each(data, function(i, email) {
                        var template = render('forms/ExtentionEmail', {id: email.id, email: email.email, verified: email.verified, primary: email.primary, extention: email.extention});
                        $('.extention-emails').append(template); 
                    });
            }
        });
    },
    add_email: function (e) {
        e.preventDefault();
        that = this;
        var id = $('.form-2 input').val();
        var email = $('.add-2 input').val();
        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;
        email_check = emailRegex.test(email)
        
        if (!email_check) message('danger', 'Error: ', "Email is in a wrong format");
        else 
            $.ajax({
                type: 'POST',
                //url: 'php/login.php',
                url: '/login/add_email',
                data: {cmd: "add_email", email: email},
                success: function(data) {
                    if (data == 'gmail') {
                        $('.add-2 input').val('');

                        $('.form-2-2 strong').text(email);
                        $('.form-2-2').removeClass('hide');
                        that.send_email_verification_code(email);

                        var template = render('forms/ExtentionEmail', {id: data, email: email, verified: 0, primary: 0, extention: 0});
                        $('.extention-emails').append(template); 
                    } else if (data == 'not gmail') message('info', 'Info: ', "<strong>" + email + "</strong> is added to your account, but it is not eligible for the extension");
                    else if (data == '#registered') message('danger', 'Error: ', "<strong>" + email + "</strong> is already registered in our system"); 
                }
            });
    },
    delete_email: function (e) {
        $that = $(e.target).closest('.extention-email');
        var email = $that.find('p').text();
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/delete_email',
            data: {cmd: "delete_email", email: email},
            success: function(data) {
                $that.remove();
            }
        });
    },
    get_email_for_verification: function (e) {
        e.preventDefault();
        $that = $(e.target).closest('.extention-email');
        var email = $that.find('p').text();
        this.send_email_verification_code(email);
    },
    send_email_verification_code: function (email) {
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/send_email_verification_code',
            data: {cmd: "send_email_verification_code", email: email},
            success: function(data) {
                if (data == '#success') {
                    $('.form-2-2 p strong').text(email);
                    $('.form-2-2').removeClass('hide');

                    $('.form-1-1, .form-2-1').addClass('hide');
                    $('.form-2-2').removeClass('hide');
                } else {
                    message('danger', 'Error: ', "please reload the page and try again"); 
                }
            }
        });
    },
    verify_email: function () {
        $that = $('.form-2-2');
        var email = $that.find('p strong').text();
        var code = $that.find('input').val();
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/verify_email',
            data: {cmd: "verify_email", email: email, code: code},
            success: function(data) {
                if (data == '#success') {
                    $('.form-2-2 p strong').text(email);
                    $('.form-2-2').addClass('hide');
                    $('.extention-email').each(function() {
                        if ($(this).find('.extention-email-name p').text() == email) {
                            $(this).find('.verify').addClass('hide');
                            $(this).find('.verified').removeClass('hide');
                        }
                    });
                } else {
                    message('danger', 'Error: ', "The code is wrong or expired");
                }
            }
        });
    },
    verify_extention: function (e) {
        $('.form-2-2, .form-2-3').addClass('hide');
        $('.form-2-1').removeClass('hide');
        this.generate_extention_code();
    },
    generate_extention_code: function () {
        var that = this;
        var context = 0;
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/verify_extention',
            dataType: "json",
            data: {cmd: "verify_extention"},
            success: function(data) {
                $('.extention-verifcation h2').text(data.code);
                $('.extention-verifcation-code').val(data.code);

                that.check_extension_verification();
            }
        });
    },
    check_extension_verification: function () {
        that = this;

        /*
        var port = chrome.runtime.connect('lgefcndmlikkmgielaeiflkmmgboljhm');
        //lgefcndmlikkmgielaeiflkmmgboljhm
        port.postMessage({command: "is_registered"});
        port.onMessage.addListener(function(response){
            console.log(response);
        });
        */
        var code = $('.extention-verifcation-code').val();
        var port = chrome.runtime.connect('lgefcndmlikkmgielaeiflkmmgboljhm');
        port.postMessage({command: "register_biomio_extension", "data": {"secret_code":code}});
        port.onMessage.addListener(function(response){
            $('.have-extension').removeClass('hide');
            $('.no-extention').addClass('hide');

            if (response.result == true) 
                $.ajax({
                    type: 'POST',
                    //url: 'php/login.php',
                    url: '/login/check_status',
                    data: {cmd: "check_status", code: code},
                    success: function(data) {
                        if (data == '#verified') {
                            $('.form-2-1, .form-2-2').addClass('hide');
                            $('.form-2-3').removeClass('hide');
                            $('.verify-extention').addClass('hide');
                        }
                    }
                });
            else if (response.result == false) {
                alert('registration failure');
                $('.form-2-1, .form-2-2').addClass('hide');
            }
        });
    },
    change_events: function () {
        var checkbox_id = $('.checkbox-id').bootstrapSwitch('state');
        var checkbox_face = $('.checkbox-face').bootstrapSwitch('state');
        var checkbox_face2 = $('.checkbox-face2').bootstrapSwitch('state');
        var checkbox_bio = $('.checkbox-bio').bootstrapSwitch('state');
        var checkbox_option = $('.checkbox-option').bootstrapSwitch('state');
        var checkbox_secret = $('.checkbox-secret').bootstrapSwitch('state');

        if (checkbox_bio == true) var condition = "any";
        else var condition = "all";

        var auth_types = [];

        console.log(checkbox_id);
        console.log(checkbox_face);
        if (checkbox_id == true) auth_types.push("fp");
        if (checkbox_face == true) auth_types.push("face");

        if (!checkbox_id && !checkbox_face) {
            alert("you need to have at least one method selected");
        } else {
            $.ajax({
                type: 'POST',
                //url: 'php/login.php',
                url: '/login/change_extention_settings',
                data: {cmd: "change_extention_settings", condition: condition, auth_types: auth_types},
                success: function(data) {
                    
                }
            });
        }
    }
});


var timer = Math.floor((Math.random() * 6) + 3); 
timer = timer * 1000;
setTimeout(function(){  }, timer);

$(document).on('click touchend', ".service-block button", function (e) {
    $('.service-content').removeClass('in');
    $('.service-content').attr('aria-expanded', "false");
    $('.service-content').css("height", '0px');
});
