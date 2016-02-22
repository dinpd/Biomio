App.Views.Apis = Backbone.View.extend({
    initialize:function () {
        this.render();
    },
    render:function () {
        $(this.el).html( render('ApisView', {}) );
        return this;
    }
});