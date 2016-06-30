App.Views.userMobileDevices = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {

    },
    render:function (type) {
        var template = render('UserMobileDevicesView', {});
        this.$el.html( template );
        this.get_face();
    },
    events: {
        // mobile application
        "submit .add-1"                        :  "add_application",
        "click .update-qr-code"                :  "generate_code",
        "click .mobile-device .update"         :  "update_mobile_device",
        "submit .mobile-device form"           :  "submit_mobile_device",
        "click .mobile-device .remove"         :  "delete_mobile_device",
        "click .mobile-device-verify"          :  "mobile_device_verify",
        "click .mobile-device-face"            :  "register_face",
    },
    get_face: function () {
        that = this;
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            dataType: "json",
            data: {cmd: "get_biometrics", biometrics: 'face'},
            success: function(data) {
                window.face = data.face;
                that.get_mobile_devices();
            }
        });
    },
    get_mobile_devices: function () {
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            dataType: "json",
            data: {cmd: "get_mobile_devices"},
            success: function(data) {
                if (data != null)
                    jQuery.each(data, function(i, device) {
                        var template = render('forms/MobileDevice', {id: device.id, title: device.title, status: device.status, face: window.face});
                        $('.mobile-devices').append(template); 
                    });
            }
        });
    },
    add_application: function (e) {
        e.preventDefault();
        $('.form-1-2, .form-1-3, .form-1-4, .form-1-5').addClass('hide');
        $('.form-1-1').removeClass('hide');

        that = this;
        var id = $('.form-1-1 input').val();
        var name = $('.add-1 input').val();
        if (name.length < 2) message('danger', 'Error: ', "Device name should be at least 2 symbols");
        else 
            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                data: {cmd: "add_mobile_device", name: name},
                success: function(data) {
                    $('.add-1 input').val('');

                    $('.form-1-1 strong').text(name);
                    $('.form-1-1 input').val(data);
                    $('.form-1-1').removeClass('hide');
                    that.generate_code();

                    var template = render('forms/MobileDevice', {id: data, title: name, status: 0});
                    $('.mobile-devices').append(template); 
                }
            });
    },
    generate_code: function (e) {
        var that = this;
        $('.update-qr-code').addClass('disabled');
        var id = $('.form-1-1 input').val();
        $('#qr_div').removeClass('hide');
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
    update_mobile_device: function(e) {
        $that = $(e.target).closest('.mobile-device');
        $that.find('.mobile-device-name p').addClass('hide');
        $that.find('form').removeClass('hide');
    },
    submit_mobile_device: function(e) {
        $that = $(e.target).closest('.mobile-device');
        var id = $that.attr('id').substring(7);

        var id = $(e.target).closest('.mobile-device').attr('id').substring(7);
        var name = $(e.target).find('input').val();
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "rename_mobile_device", device_id: id, name: name},
            success: function(data) {
                $that.find('form').addClass('hide');
                $that.find('.mobile-device-name p').text(name).removeClass('hide');
            }
        });
    },
    delete_mobile_device: function(e) {
        var id = $(e.target).closest('.mobile-device').attr('id').substring(7);
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "delete_mobile_device", device_id: id},
            success: function(data) {
                $('#device_' + id).remove();
            }
        });
    },
    mobile_device_verify: function(e) {
        $('.form-1-2, .form-1-3, .form-1-4, .form-1-5').addClass('hide');
        $('.form-1-1').removeClass('hide');

        var id = $(e.target).closest('.mobile-device').attr('id').substring(7);
        var name = $(e.target).closest('.mobile-device').find('.mobile-device-name p').text();

        $('.form-1-1 input').val(id);
        $('.form-1-1 p strong').text(name);

        this.generate_code();
    },

    register_face: function(e) {
        var that = this;

        var device_id = $(e.target).closest('.mobile-device').attr('id').substring(7);
        var name = $(e.target).closest('.mobile-device').find('.mobile-device-name p').text();
        $('.form-1-2 p strong').text(name);

        // create session code
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "generate_biometrics_code", application: 0, device_id: device_id},
            success: function(data) {
                $('.form-1-1, .form-1-3, .form-1-4, .form-1-5').addClass('hide');
                $('.form-1-2').removeClass('hide');
                $('.form-1-2 input').val(data);
                // send rest here
                that.check_biometrics_verification();
            }
        });
    },
    check_device_verification: function () {
        var check = setInterval(function(){ 
            var code = $('#qr_code_text strong').text();
            console.log('verification call for ' + code);
            if (code != '' && code != undefined)
                $.ajax({
                    type: 'POST',
                    url: 'php/login.php',
                    data: {cmd: "check_status", code: code},
                    success: function(data) {
                        if (data == '#verified') {
                            clearInterval(check);
                            $('.form-1-1, .form-1-2, .form-1-4, .form-1-5').addClass('hide');
                            $('.form-1-3').removeClass('hide');
                            var id = $('.form-1-1 input').val();
                            $('#device_' + id + ' .mobile-device-verify').addClass('hide');
                            $('#device_' + id + ' .mobile-device-face').removeClass('hide');
                        }
                    }
                });
            else clearInterval(check);
        }, 3000);
    },
    check_biometrics_verification: function () {
        var timer = 300;

        clearInterval(check);
        check = setInterval(function(){ 
            var code = $('.form-1-2 input').val();
            console.log('verification call for ' + code);
            if (code != '' && code != undefined)
                $.ajax({
                    type: 'POST',
                    url: 'php/login.php',
                    data: {cmd: "check_status", code: code},
                    success: function(data) {
                        if (data == '#in-process') {
                            $('.form-1-1, .form-1-2, .form-1-3, .form-1-5').addClass('hide');
                            $('.form-1-4').text("Training started").removeClass('text-warning').addClass('text-info').removeClass('hide');
                        } else if (data == '#canceled') {
                            $('.form-1-1, .form-1-2, .form-1-3, .form-1-5').addClass('hide');
                            $('.form-1-4').text("Training was canceled").removeClass('text-info').addClass('text-warning').removeClass('hide');
                        } else if (data == '#failed1') {
                            $('.form-1-1, .form-1-2, .form-1-3, .form-1-5').addClass('hide');
                            $('.form-1-4').text("Maximum number of training retries reached.Try to change your location or your device position").removeClass('text-info').addClass('text-warning').removeClass('hide');
                        } else if (data == '#failed2') {
                            $('.form-1-1, .form-1-2, .form-1-3, .form-1-5').addClass('hide');
                            $('.form-1-4').text("Training failed. Try to change your location or your device position").removeClass('text-info').addClass('text-warning').removeClass('hide');
                        } else if (data == '#retry') {
                            $('.form-1-1, .form-1-2, .form-1-3, .form-1-5').addClass('hide');
                            $('.form-1-4').text("Additional data is required, please check your device").removeClass('text-warning').addClass('text-info').removeClass('hide');
                        } else if (data == '#verified') {
                            clearInterval(check);
                            $('.form-1-1, .form-1-2, .form-1-3, .form-1-4').addClass('hide');
                            $('.form-1-5').text("Our recognition algorithm was successfully trained with your face data").removeClass('hide');
                        }
                    }

                });
            else clearInterval(check);

            console.log(timer);
            timer = timer - 3;
            if (timer <= 0) {
                $('.form-1-1, .form-1-2, .form-1-3, .form-1-4, .form-1-5').addClass('hide');
                alert('Registration session has been expired. Please try again.');
                clearInterval(check);
            }
        }, 3000);
    }
});
