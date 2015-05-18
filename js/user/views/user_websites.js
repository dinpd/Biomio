App.Views.UserWebsites = Backbone.View.extend({
  el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('UserWebsitesView', {});
        this.$el.html( template );
    }
});