App.Views.LoginImplementation = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('LoginImplementationView', {});
        this.$el.html( template );
    }
});