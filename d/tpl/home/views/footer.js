App.Views.Footer = Backbone.View.extend({
    el: $(".footer"),
    initialize: function () {
    },
    render: function () {
        var template = render('FooterView');
        this.$el.html( template );
    },
});