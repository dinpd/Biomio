App.Views.userServices = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {

    },
    render:function (type) {
        var template = render('UserServicesView', {});
        this.$el.html( template );
        this.get_user_extensions();
        this.get_user_emails();

        $(".checkbox-id, .checkbox-location, .checkbox-face").bootstrapSwitch({
          size: 'mini',
          onText: 'On',
          offText: 'Off',
          handleWidth: 15,
          labelWidth: 15,
          onColor: 'success',
          offColor: 'default',
          state: true
        });

        $(".checkbox-face2").bootstrapSwitch({
          size: 'mini',
          onText: 'yes',
          offText: 'no',
          handleWidth: 15,
          labelWidth: 15,
          onColor: 'info',
          offColor: 'default',
          state: true
        });

        $(".checkbox-bio").bootstrapSwitch({
          size: 'small',
          onText: 'ANY',
          offText: 'ALL',
          handleWidth: 20,
          labelWidth: 20,
          onColor: 'primary',
          offColor: 'warning',
          state: true
        });

        $(".checkbox-option").bootstrapSwitch({
          size: 'small',
          onText: 'AND',
          offText: 'OR',
          handleWidth: 20,
          labelWidth: 20,
          onColor: 'primary',
          offColor: 'warning',
          state: true
        });
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
    get_user_extensions: function () {
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            dataType: "json",
            data: {cmd: "get_user_extensions"},
            success: function(data) {
                if (data == 0) $('.verified-extensions').html('<span class="text-info"><strong>No extensions yet registered from this account</strong></span>');
                else if (data == 1) $('.verified-extensions').html('<span class="text-success"><strong>' + data + ' extension is already registered from this account</strong></span>');
                else if (data > 1) $('.verified-extensions').html('<span class="text-success"><strong>' + data + ' extensions are already registered from this account</strong></span>');
            }
        });
    },
    get_user_emails: function () {
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
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
                url: 'php/login.php',
                data: {cmd: "add_email", email: email},
                success: function(data) {
                    if (data == 'gmail') {
                        $('.add-2 input').val('');

                        $('.form-2-2 strong').text(email);
                        $('.form-2-2').removeClass('hide');
                        that.send_email_verification_code(email);

                        var template = render('forms/ExtentionEmail', {id: data, email: email, verified: 0, primary: 0, extention: 0});
                        $('.extention-emails').append(template); 
                    } else if (data == 'not gmail') message('info', 'Info: ', "<strong>" + email + "</strong> is added to your account, but it can't be used in the extension");
                    else if (data == '#registered') message('danger', 'Error: ', "<strong>" + email + "</strong> is already registered in our system"); 
                }
            });
    },
    delete_email: function (e) {
        $that = $(e.target).closest('.extention-email');
        var email = $that.find('p').text();
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
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
            url: 'php/login.php',
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
            url: 'php/login.php',
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
            url: 'php/login.php',
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

        /*var my_window = window.open('https://gate.biom.io:8080/websocket/', 'newwindow', 'width=300, height=250');*/

        //clearInterval(check);
        //check = setInterval(function(){ 
            // The ID of the extension we want to talk to.
            var editorExtensionId = "lgefcndmlikkmgielaeiflkmmgboljhm";
            var code = $('.extention-verifcation-code').val();

            console.log('verifying code: ' + code);
            if (code != '' && code != undefined) {
                // Make a simple request:
                chrome.runtime.sendMessage(editorExtensionId, {"command":"register_biomio_extension", "data": {"secret_code":code}},
                function(response) {
                    console.log('code' + response);
                    if (!response.success)
                        console.log('error');
                });

                $.ajax({
                    type: 'POST',
                    url: 'php/login.php',
                    data: {cmd: "check_status", code: code},
                    success: function(data) {
                        if (data == '#verified') {
                            clearInterval(check);
                            //my_window.close();
                            $('.form-2-1, .form-2-2').addClass('hide');
                            $('.form-2-3').removeClass('hide');
                        }
                    }
                });
            } else clearInterval(check);
        //}, 3000)
    }
});

var timer = Math.floor((Math.random() * 6) + 3); 
timer = timer * 1000;
setTimeout(function(){  }, timer);