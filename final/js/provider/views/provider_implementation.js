App.Views.ProviderImplementation = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('ProviderImplementationView', {});
        this.$el.html( template );
    }
});