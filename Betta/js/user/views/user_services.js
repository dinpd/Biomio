App.Views.userServices = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
        this.render();
    },
    render:function (type) {
        var template = render('UserServicesView', {});
        this.$el.html( template );
        this.get_user_emails();
    },
    events: {
        // chrome extention
        "submit .user-services .add-2"                  : "add_email",
        "click .user-services .extention-email .plus"   : "plus_email",
        "click .user-services .extention-email .minus"  : "minus_email",
        "click .user-services .extention-email .remove" : "delete_email",
        "click .user-services .extention-email .verify" : "send_email_verification_code",
        "click .user-services .form-2-2 button"         : "verify_email",
        "click .user-services .verify-extention button" : "verify_extention",
        "click .user-services .form-2-1"                : "generate_extention_code"
    },
    
    // Chrome Extention
    get_user_emails: function () {
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            dataType: "json",
            data: {cmd: "get_user_emails"},
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
                    $('.add-2 input').val('');

                    $('.form-2-2 strong').text(email);
                    $('.form-2-2').removeClass('hide');
                    that.verify_email();

                    var template = render('forms/ExtentionEmail', {id: data, email: email, verified: 0, primary: 0, extention: 0});
                    $('.extention-emails').append(template); 
                }
            });
    },
    plus_email: function (e) {
        $that = $(e.target).closest('.extention-email');
        var email = $that.find('p').text();
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "update_email", email: email, extention: 1},
            success: function(data) {
                $that.find('p').css('font-weight', 'bold');
                $that.find('.plus').addClass('hide');
                $that.find('.minus').removeClass('hide');
            }
        });
    },
    minus_email: function (e) {
        $that = $(e.target).closest('.extention-email');
        var email = $that.find('p').text();
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "update_email", email: email, extention: 1},
            success: function(data) {
                $that.find('p').css('font-weight', 'normal');
                $that.find('.minus').addClass('hide');
                $that.find('.plus').removeClass('hide');
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
    send_email_verification_code: function (e) {
        e.preventDefault();

        $that = $(e.target).closest('.extention-email');
        var email = $that.find('p').text();
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
                        $(this).find('.extention-email-name p').css('font-weight', 'bold');
                        $(this).find('.verify').addClass('hide');
                        $(this).find('.plus').removeClass('hide');
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
            data: {cmd: "verify_extention"},
            success: function(data) {
                var img = new Image();
                img.onload = function () {
                    context.drawImage(this, 0, 0, canvas.width, canvas.height);
                }
                img.src = "data:image/png;base64," + data;
                $('.extention-verifcation-image').html(img);

                that.check_extension_verification();
            }
        });
    },
    check_extension_verification: function () {
        /*clearInterval(check);
        var check = setInterval(function(){ 
            var code = $('.qr_code_text strong').text();
            console.log('verification call for ' + code);
            if (code != '' || code != undefined)
                $.ajax({
                    type: 'POST',
                    url: 'php/login.php',
                    data: {cmd: "check_status", code: code},
                    success: function(data) {
                        if (data == '#success') {
                            clearInterval(check);
                            $('.form-2-1, .form-2-2').addClass('hide');
                            $('.form-2-3').removeClass('hide');
                        }
                    }
                });
            else clearInterval(check);
        }, 3000);*/
    }
});