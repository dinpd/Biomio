App.Views.VerifyApplication = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
        this.render();
    },
    render:function (type) {
        var template = render('VerifyApplicationView', {});
        this.$el.html( template );
    },
    events: {
        "click .get-qr-code button" :  "generate_code",
        "click .update-qr-code" :  "generate_code",
    },
    generate_code: function (e) {
        $('.update-qr-code').addClass('disabled');
        $('.get-qr-code').addClass('hide');
        $('#qr_div').removeClass('hide');
        $('#qr_code').html('');
        $('#qr_code_text strong').text('');
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "generate_qr_code", application: 1},
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
            }
        });
    },
});
