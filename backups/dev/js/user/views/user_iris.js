App.Views.UserIris = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('UserIrisView', {});
        this.$el.html( template );
    }
});