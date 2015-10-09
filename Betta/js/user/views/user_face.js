//View for one Face
App.Views.UserFace = Backbone.View.extend({
    el: $("body"),
    initialize: function () {

    },
    render: function () {
        var template = render('UserFaceView', {});
        $("#content").html( template );
        this.get_face();
        this.get_mobile_devices();
    },
    events: {
        'click .user-face .train-face' : 'register_face'
    },
    get_face: function () {
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            dataType: "json",
            data: {cmd: "get_biometrics", biometrics: 'face'},
            success: function(data) {
                if (data.face == 0) {
                    $('.train-face').text('Train');
                    $('.user-face .face-status').attr('src', 'img/avatar-red.png');
                } else {
                    $('.train-face').text('Retrain');
                    $('.user-face .face-status').attr('src', 'img/avatar-green.png');
                }
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
                        if (device.status == 1) {
                            $('.mobile-devices .no-devices').addClass('hide'); 
                            $('.user-face .devices').append('<option value="' + device.id + '">' + device.title + '</option>');
                            $('.train-face').removeClass('btn-default').addClass('btn-primary').removeClass('disabled');
                        }
                    });
            }
        });
    },
    register_face: function() {
        var that = this;
        var device_id = $('.user-face .devices').val();
        var name = $('.user-face .devices option:selected').text();
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
    check_biometrics_verification: function () {
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
                            $('.form-1-4').removeClass('hide');
                        } else if (data == '#verified') {
                            clearInterval(check);
                            $('.form-1-1, .form-1-2, .form-1-3, .form-1-4').addClass('hide');
                            $('.form-1-5').removeClass('hide');

                            $('.train-face').text('Retrain');
                            $('.user-face .face-status').attr('src', 'img/avatar-green.png');
                        }
                    }
                });
            else clearInterval(check);
        }, 3000);
    }
});
