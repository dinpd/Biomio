App.Views.CaptchaImplementation = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('CaptchaImplementationView', {});
        this.$el.html( template );
    }
});