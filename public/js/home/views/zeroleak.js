App.Views.Zeroleak = Backbone.View.extend({
    captcha: 0,
    initialize:function () {
        this.render();
    },
    render:function () {
        $("#content").html( render('ZeroleakView', {}) );
        //this.captcha_get_image();
    },
    events: {
        //"click #contact_submit": "submit",
        //"click #captcha_refresh": "captcha_get_image",
    },
});