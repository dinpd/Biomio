App.Views.Contact = Backbone.View.extend({
    initialize:function () {
        this.render();
    },
    render:function () {
        $(this.el).html( render('ContactView', {}) );
        return this;
    }
});