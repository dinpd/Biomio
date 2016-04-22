App.Views.Wizard = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
    },
    render:function (type) {
        var template = render('Wizard', {});
        this.$el.html( template );

        this.type = type;
        this.get_state();

    },
    events: {
        //View-2
        "click .wizard .next-1"                    : "next_1",
        "click .wizard .next-2"                    : "next_2",
        "click .wizard .next-3"                    : "next_3",
        "click .wizard .next-4"                    : "next_4",
        "click .wizard .skip-4"                    : "skip_4",
        "click .wizard .next-5"                    : "next_5",
        "click .wizard .update-qr-code"            : "generate_code",
        "click .wizard .activate-biometrics"       : "check_biometrics_verification",
        "click .wizard .extention-new-code"        : "generate_extention_code",
        "click .wizard .finish"                    : "finish",

        "click .wizard .prev-2"                    : "prev_2",
        "click .wizard .prev-3"                    : "prev_3",
        "click .wizard .prev-4"                    : "prev_4",
    },
    get_state: function (e) {
        var that = this;
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/get_state',
            dataType: "json",
            data: {cmd: "get_state", type: this.type},
            success: function(data) {
                console.log(data);
                if (that.type == 1) {
                    $('.finish').removeClass('hide');
                    $('.div-1').addClass('hide');
                    $('.div-2').removeClass('hide');
                    //$('.menu-1').addClass('hide');
                    $('.menu-1 span').removeClass('hide');
                    $('.menu').removeClass('menu-active');
                    $('.menu-2').addClass('menu-active');
                } else if (this.type == 2) {
                    this.get_email();
                }

                if (data == 1) {
                    $('.menu').removeClass('menu-active');
                    $('.div-1').addClass('hide');
                    $('.menu-2').addClass('menu-active');

                    $('.div-2').removeClass('hide');
                    $('.menu-1 span').removeClass('hide');
                } else if (data == 3) {
                    $('.menu').removeClass('menu-active');
                    $('.div-1').addClass('hide');
                    $('.div-2').addClass('hide');
                    $('.menu-4').addClass('menu-active');

                    $('.div-4').removeClass('hide');
                    $('.menu-1 span').removeClass('hide');
                    $('.menu-2 span').removeClass('hide');
                    $('.menu-3 span').removeClass('hide');
                } else if (data == 4) {
                    $('.menu').removeClass('menu-active');
                    $('.menu-1 span').removeClass('hide');
                    $('.menu-2 span').removeClass('hide');
                    $('.menu-3 span').removeClass('hide');
                    $('.menu-4 span').removeClass('hide');
                    $('.view-2').addClass('hide');
                    $('.view-3').removeClass('hide');
                }
            }
        });
    },
    get_email: function (e) {
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/get_user_emails',
            dataType: "json",
            data: {cmd: "get_user_emails", extention: 1},
            success: function(data) {
                if (data != null)
                    jQuery.each(data, function(i, email) {
                        $('.welcome-email').text(email.email);
                    });
            }
        });
    },

    // View - 2

    next_1: function(e) {
        e.preventDefault(e);
        console.log('next_1');
        var first_name = $('#wizard_first_name').val();
        var last_name = $('#wizard_last_name').val();
        var that = this;

        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/update_name',
            data: {cmd: "update_name", first_name: first_name, last_name: last_name},
            success: function(data) {
                if (data == '#success') {
                    $('.div-1').addClass('hide');
                    $('.div-2').removeClass('hide');
                    $('.menu-1 span').removeClass('hide');
                    $('.menu').removeClass('menu-active');
                    $('.menu-2').addClass('menu-active');
                    window.profileFirstName = first_name;
                    window.profileLastName = last_name;

                    that.save_state(1);
                }
            }
        });
    },
    next_2: function(e) {
        e.preventDefault(e);
        console.log('next_2');
        
        if (!$('.div-2-1').hasClass('hide')) {
            $('.div-2-1').addClass('hide');
            $('.div-2-2').removeClass('hide');

            if (this.type == 1) {
                $.ajax({
                    type: 'POST',
                    //url: 'php/login.php',
                    url: '/login/get_mobile_devices',
                    dataType: "json",
                    data: {cmd: "get_mobile_devices"},
                    success: function(data) {
                        if (data.length != 0) {
                            jQuery.each(data, function(i, device) {
                                if (device.status == 1) {
                                    $('.phone-select').removeClass('hide');
                                    $('.phone-select').append('<option value="' + device.id + '">' + device.title + '</option>');
                                }
                            });
                        }
                    }
                });
            }

        } else if (!$('.div-2-2').hasClass('hide')) {
            console.log('saving device name');

            if ($('.phone-select').val() == '') {
                var name = $('.div-2-2 .phone').val();
                that = this;
                if (name.length < 2) message('danger', 'Error: ', "Device name should be at least 2 symbols");
                else 
                    $.ajax({
                        type: 'POST',
                        //url: 'php/login.php',
                        url: '/login/add_mobile_device',
                        data: {cmd: "add_mobile_device", name: name},
                        success: function(data) {
                            $('.device-id').val(data);
                            $('.div-2-2').addClass('hide');
                            $('.div-2-3').removeClass('hide');
                            that.generate_code();

                            $('.next-2').removeClass('btn-primary');
                        }
                    });
            } else {
                $('.device-id').val($('.phone-select').val());
                $('.div-2').addClass('hide');
                $('.div-3').removeClass('hide');
                $('.menu').removeClass('menu-active');
                $('.menu-3').addClass('menu-active');
                $('.menu-2 span').removeClass('hide');
                this.register_biometrics();
                $('.next-3').removeClass('btn-primary');
            }
        } else if (!$('.div-2-3').hasClass('hide')) {
            
        } else if (!$('.div-2-4').hasClass('hide')) {
            $('.div-2').addClass('hide');
            $('.div-3').removeClass('hide');
            $('.menu').removeClass('menu-active');
            $('.menu-3').addClass('menu-active');
            this.register_biometrics();
            $('.menu-2 span').removeClass('hide');
        }
    },
    next_3: function(e) {
        e.preventDefault(e);
        console.log('next_3');
        
        $('.div-3').addClass('hide');
        //$('.div-4').removeClass('hide');
        $('.menu').removeClass('menu-active');
        //$('.menu-4').addClass('menu-active');
        $('.menu-3 span').removeClass('hide');
        $('.div-5').removeClass('hide');
    },
    next_4: function(e) {
        e.preventDefault(e);
        console.log('next_4');
        
        if (!$('.div-4-1').hasClass('hide')) {
            $('.div-4-1').addClass('hide');
            $('.div-4-2').removeClass('hide');

            this.generate_extention_code();
            $('.next-4').removeClass('btn-primary');

        } else if (!$('.div-4-3').hasClass('hide')) {
            $('.div-4').addClass('hide');
            $('.div-5').removeClass('hide');
            this.save_state(4);
        }
    },
    skip_4: function(e) {
        $('.div-4').addClass('hide');
        $('.div-5').removeClass('hide');
    },
    next_5: function(e) {
        e.preventDefault(e);
        console.log('next_4');

        if (!$('.div-5-1').hasClass('hide')) {
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
        $('#qr_code_text').text('');
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/generate_qr_code',
            data: {cmd: "generate_qr_code", id: id, application: 1},
            success: function(data) {
                // returns 8 symbol code which we present as a text and as a qr image
                $('#qr_code').qrcode({
                    "width": 120,
                    "height": 120,
                    "color": "#3a3",
                    "text": data
                });
                $('#qr_code_text').text(data);
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
            //url: 'php/login.php',
            url: '/login/generate_biometrics_code',
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
            var code = $('#qr_code_text').text();
            console.log('verification call for ' + code);
            if (code != '' && code != undefined && !$('.div-2-3').hasClass('hide'))
                $.ajax({
                    type: 'POST',
                    //url: 'php/login.php',
                    url: '/login/check_status',
                    data: {cmd: "check_status", code: code},
                    success: function(data) {
                        if (data == '#verified') {
                            clearInterval(check);
                            $('.div-2-3').addClass('hide');
                            $('.div-2-4').removeClass('hide');
                            $('.next-2').addClass('btn-primary');
                        }
                    }
                });
            else clearInterval(check);
        }, 3000);
    },
    check_biometrics_verification: function () {
        var timer = 300;
        var that = this;

        clearInterval(check);
        check = setInterval(function() { 
            var code = $('#biometrics_code').text();
            console.log('verification call for ' + code);
            if (code != '' && code != undefined)
                $.ajax({
                    type: 'POST',
                    //url: 'php/login.php',
                    url: '/login/check_status',
                    data: {cmd: "check_status", code: code},
                    success: function(data) {
                        console.log(data);
                        if (data == '#in-process') {
                            $('.enroll-status').text("Training started").removeClass('text-warning').addClass('text-info').removeClass('hide');
                        } else if (data == '#canceled') {
                            $('.enroll-status').text("Training was canceled").removeClass('text-info').addClass('text-warning').removeClass('hide');
                        } else if (data == '#failed1') {
                            $('.enroll-status').text("Maximum number of training retries reached.Try to change your location or your device position").removeClass('text-info').addClass('text-warning').removeClass('hide');
                        } else if (data == '#failed2') {
                            $('.enroll-status').text("Training failed. Try to change your location or your device position").removeClass('text-info').addClass('text-warning').removeClass('hide');
                        } else if (data == '#retry') {
                            $('.enroll-status').text("Additional data is required, please check your device").removeClass('text-warning').addClass('text-info').removeClass('hide');
                        } else if (data == '#verified') {
                            clearInterval(check);
                            $('.div-3-1').addClass('hide');
                            $('.div-3-2').removeClass('hide');
                            $('.next-3').addClass('btn-primary');
                            that.save_state(3);
                        }
                    }
                });
            else clearInterval(check);

            timer = timer - 3;
            if (timer <= 0) {
                $('.form-1-1, .form-1-2, .form-1-3, .form-1-4, .form-1-5').addClass('hide');
                alert('Registration session has been expired. Please try again.');
                clearInterval(check);
            }
        }, 3000);
    },
    generate_extention_code: function () {
        var that = this;
        var context = 0;

        var port = chrome.runtime.connect('ooilnppgcbcdgmomhgnbjjkbcpfemlnj');
        port.postMessage({command: "is_registered"});
        port.onMessage.addListener(function(response){
            if (response.is_registered) {
                $('.div-4-2').addClass('hide');
                $('.div-4-3').removeClass('hide');
                $('.menu-4 span').removeClass('hide');
                $('.next-4').text('Finish');
                $('.next-4').addClass('btn-primary');
            } else 
                $.ajax({
                    type: 'POST',
                    //url: 'php/login.php',
                    url: '/login/verify_extention',
                    dataType: "json",
                    data: {cmd: "verify_extention"},
                    success: function(data) {
                        //var img = new Image();
                        //img.onload = function () {
                         //   context.drawImage(this, 0, 0, canvas.width, canvas.height);
                        //}
                        //img.src = "data:image/png;base64," + data.image;
                        //$('.extention-verifcation-image').html(img);

                        $('.extention-verifcation h2').text(data.code);
                        $('.extention-verifcation-code').val(data.code);

                        that.check_extension_verification();
                    }
                });
        });
    },
    check_extension_verification: function () {
        that = this;

        var code = $('.extention-verifcation-code').val();
        var port = chrome.runtime.connect('ooilnppgcbcdgmomhgnbjjkbcpfemlnj');
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
                            $('.div-4-2').addClass('hide');
                            $('.div-4-3').removeClass('hide');
                            $('.menu-4 span').removeClass('hide');
                            $('.next-4').text('Finish');
                            $('.next-4').addClass('btn-primary');
                        }
                    }
                });
            else if (response.result == false) {
                alert('registration failure');
                that.generate_extention_code();
            }
        });
    },
    finish: function () {
        window.location.hash = 'user-info';
    },
    save_state: function (state) {
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/save_state',
            data: {cmd: "save_state", type:this.type, s: state },
            success: function(data) {
                if (data == '#success') console.log('state is saved');
            }
        });
    }

});