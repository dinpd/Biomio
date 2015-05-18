App.Views.Home = Backbone.View.extend({
    initialize:function () {
        this.render();
    },
    render:function () {
        $(this.el).html( render('HomeView', {}) );
        return this;
    }
});