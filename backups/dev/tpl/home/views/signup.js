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
        "keyup .signup #sign_in_first_name"       : "verify_name",
        "keyup .signup #sign_in_last_name"        : "verify_name",
        "click .signup .sign-up-name"             : "border_style", //border style (1px to either side)
        "change .signup #sign_in_email"           : "verify_email",
        "click .signup #sign_in_submit"           : "submit_check",

        //View-2
        "click .signup .view-2 .btn-block"         : "finish_registration",
        "click .signup .next-1"                    : "next_1",
        "click .signup .next-2"                    : "next_2",
        "click .signup .next-3"                    : "next_3",
        "click .signup .next-4"                    : "next_4",
        "click .signup .update-qr-code"            : "generate_code",
        "click .signup .activate-biometrics"       : "check_biometrics_verification",
        "click .signup .extention-new-code"        : "generate_extention_code",

        "click .signup .prev-2"                    : "prev_2",
        "click .signup .prev-3"                    : "prev_3",
        "click .signup .prev-4"                    : "prev_4",
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
                        
                        $('.view-1').addClass('hide');
                        $('.view-2').removeClass('hide');

                        $('.welcome-email').text(email);
                    }
                    //if error, remove alert after 5 seconds
                    setTimeout(function() {
                        $('#sign_in_submit_span').text('');
                    }, 5000);
                }
            });
    },

    // View - 2

    finish_registration: function(e) {
        e.preventDefault(e);
        window.location.hash = 'user-info';
    },
    next_1: function(e) {
        e.preventDefault(e);
        console.log('next_1');
        
        $('.div-1').addClass('hide');
        $('.div-2').removeClass('hide');

        console.log('saving name');
        $('.menu-1 span').removeClass('hide');
        $('.menu').removeClass('menu-active');
        $('.menu-2').addClass('menu-active');
    },
    next_2: function(e) {
        e.preventDefault(e);
        console.log('next_2');
        
        if (!$('.div-2-1').hasClass('hide')) {
            $('.div-2-1').addClass('hide');
            $('.div-2-2').removeClass('hide');
        } else if (!$('.div-2-2').hasClass('hide')) {
            console.log('saving device name');

            var name = $('.div-2-2 .phone').val();
            that = this;
            if (name.length < 2) message('danger', 'Error: ', "Device name should be at least 2 symbols");
            else 
                $.ajax({
                    type: 'POST',
                    url: 'php/login.php',
                    data: {cmd: "add_mobile_device", name: name},
                    success: function(data) {
                        $('.device-id').val(data);
                        $('.div-2-2').addClass('hide');
                        $('.div-2-3').removeClass('hide');
                        that.generate_code();
                    }
                });
        } else if (!$('.div-2-3').hasClass('hide')) {
            
        } else if (!$('.div-2-4').hasClass('hide')) {
            $('.div-2').addClass('hide');
            $('.div-3').removeClass('hide');
            $('.menu').removeClass('menu-active');
            $('.menu-3').addClass('menu-active');
            this.register_biometrics();
        }
    },
    next_3: function(e) {
        e.preventDefault(e);
        console.log('next_3');
        
        if (!$('.div-3-1').hasClass('hide')) {
            
        } else if (!$('.div-3-2').hasClass('hide')) {
            $('.div-3').addClass('hide');
            $('.div-4').removeClass('hide');
            $('.menu').removeClass('menu-active');
            $('.menu-4').addClass('menu-active');
        }
    },
    next_4: function(e) {
        e.preventDefault(e);
        console.log('next_4');
        
        if (!$('.div-4-1').hasClass('hide')) {
            $('.div-4-1').addClass('hide');
            $('.div-4-2').removeClass('hide');

            this.generate_extention_code();

        } else if (!$('.div-4-3').hasClass('hide')) {
            window.location.hash = 'user-info';
        }
    },
    prev_2: function(e) {
        e.preventDefault(e);
        
    },
    prev_3: function(e) {
        e.preventDefault(e);
        
    },
    prev_4: function(e) {
        e.preventDefault(e);
        
    },
    generate_code: function (e) {
        that = this;
        var id = $('.device-id').val();
        $('.update-qr-code').addClass('disabled');
        $('#qr_code').html('');
        $('#qr_code_text strong').text('');
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "generate_qr_code", id: id, application: 1},
            success: function(data) {
                // returns 8 symbol code which we present as a text and as a qr image
                $('#qr_code').qrcode({
                    "width": 150,
                    "height": 150,
                    "color": "#3a3",
                    "text": data
                });
                $('#qr_code_text strong').text(data);
                $('.update-qr-code').removeClass('disabled');

                that.check_device_verification();
            }
        });
    },
    register_biometrics: function(e) {
        var that = this;

        var device_id = $('.device-id').val();

        // create session code
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "generate_biometrics_code", application: 0, device_id: device_id},
            success: function(data) {
                $('#biometrics_code').text(data);
                // send rest here
                that.check_biometrics_verification();
            }
        });
    },
    check_device_verification: function () {
        that = this;
        var check = setInterval(function(){ 
            var code = $('#qr_code_text strong').text();
            console.log('verification call for ' + code);
            if (code != '' && code != undefined && !$('.div-2-3').hasClass('hide'))
                $.ajax({
                    type: 'POST',
                    url: 'php/login.php',
                    data: {cmd: "check_status", code: code},
                    success: function(data) {
                        if (data == '#verified') {
                            clearInterval(check);
                            $('.div-2-3').addClass('hide');
                            $('.div-2-4').removeClass('hide');
                            $('.menu-2 span').removeClass('hide');
                        }
                    }
                });
            else clearInterval(check);
        }, 3000);
    },
    check_biometrics_verification: function () {
        clearInterval(check);
        check = setInterval(function() { 
            var code = $('#biometrics_code').text();
            console.log('verification call for ' + code);
            if (code != '' && code != undefined)
                $.ajax({
                    type: 'POST',
                    url: 'php/login.php',
                    data: {cmd: "check_status", code: code},
                    success: function(data) {
                        if (data == '#verified') {
                            clearInterval(check);
                            $('.div-3-1').addClass('hide');
                            $('.div-3-2').removeClass('hide');
                            $('.menu-3 span').removeClass('hide');
                        }
                    }
                });
            else clearInterval(check);
        }, 3000);
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
                var img = new Image();
                img.onload = function () {
                    context.drawImage(this, 0, 0, canvas.width, canvas.height);
                }
                img.src = "data:image/png;base64," + data.image;
                $('.extention-verifcation-image').html(img);
                $('.extention-verifcation-code').val(data.code);

                that.check_extension_verification();
            }
        });
    },
    check_extension_verification: function () {
        that = this;
        clearInterval(check);
        check = setInterval(function(){ 
            var code = $('.extention-verifcation-code').val();
            console.log('verification call for ' + code);
            if (code != '' && code != undefined)
                $.ajax({
                    type: 'POST',
                    url: 'php/login.php',
                    data: {cmd: "check_status", code: code},
                    success: function(data) {
                        if (data == '#verified') {
                            clearInterval(check);
                            $('.div-4-2').addClass('hide');
                            $('.div-4-3').removeClass('hide');
                            $('.menu-4 span').removeClass('hide');
                            $('.next-4').text('Finish');
                            $('.menu-4 span').removeClass('hide');
                        }
                    }
                });
            else clearInterval(check);
        }, 3000);
    }

});