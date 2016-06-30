App.Views.GoogleApp = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('GoogleAppView', {});
        this.$el.html( template );
    },
});