App.Views.MobileBeta = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('MobileBeta', {});
        this.$el.html( template );
    },
});