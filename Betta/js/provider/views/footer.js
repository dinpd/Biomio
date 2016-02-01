App.Views.Footer = Backbone.View.extend({
    el: $(".footer"),
    initialize: function () {
    },
    render: function () {
        var template = render('ProviderFooter');
        this.$el.html( template );
    },
});