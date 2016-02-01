/*App.Views.UserPhone = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
        this.render();
        $('.region-code').focus();
    },
    render:function (type) {
        var template = render('PhoneView', {});
        this.$el.html( template );
        this.get_user_phones();
    },
    events: {
        "keyup .phone-number .country-code"  : "verify_country_code",
        "keyup .phone-number .region-code"   : "verify_region_code",
        "keyup .phone-number .first-part"    : "verify_first_part",
        "keyup .phone-number .second-part"   : "verify_second_part",

        "click .request-phone-code"  :  "request_phone_code",
        "click .verify-phone"        :  "verify_phone",
        "click .registered-number button" :  "delete_phone",
    },
    get_user_phones: function (e) {
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            dataType: "json",
            data: {cmd: "get_phones"},
            success: function(data) {
                if (data != null) {
                    $('.registered').removeClass('hide');
                    jQuery.each(data, function(i, phone) {
                        var text =  '<div class="registered-number col-sm-12">' +
                                        '<div class="number col-sm-3 text-right">' + phone + '</div>' +
                                        '<div class="delete col-sm-1 text-left"><button type="button" class="close" aria-hidden="true">&times;</button></div>' +
                                    '</div>';
                        $('.registered-numbers').append(text);
                    });
                } else $('.not-registered').removeClass('hide');
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
    request_phone_code: function (e) {
        var phone = String($('.country-code').val()) + String($('.region-code').val()) + String($('.first-part').val()) + String($('.second-part').val());
        $('.invalid-code').addClass('hide');
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "send_phone_verification_code", phone: phone},
            success: function(data) {
                if (data = "#success") {
                    $('.phone-step-2').removeClass('hide');
                    $('.invalid-code input').val('');
                } else $('.error').removeClass('hide');
            }
        });
    },
    verify_phone: function (e) {
        var code = $('.phone-code').val();
        if (code.length > 0)
            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                data: {cmd: "verify_phone_code", code: code},
                success: function(data) {
                    if (data != 0) {
                        $('.registered').removeClass('hide');
                        $('.not-registered').addClass('hide');
                        
                        var text =  '<div class="registered-number col-sm-12">' +
                                        '<div class="number col-sm-3 text-right">' + data + '</div>' +
                                        '<div class="delete col-sm-1 text-left"><button type="button" class="close" aria-hidden="true">&times;</button></div>' +
                                    '</div>';
                        $('.registered-numbers').append(text);
                                    
                        $('.invalid-code').addClass('hide');
                        $('.phone-step-2').addClass('hide');

                        $('.region-code').val('');
                        $('.first-part').val('');
                        $('.second-part').val('');
                        $('.phone-code').val('');


                    } else $('.invalid-code').removeClass('hide');
                }
            });
    },
    delete_phone: function (e) {
        $this = $(e.currentTarget).closest('.registered-number');
       
        $this.remove();
        var number = $this.find('.number').text()
        console.log(number);
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "delete_phone", number: number},
            success: function(data) {
                $this.remove();
            }
        });
    },
});*/
