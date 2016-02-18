App.Views.Page404 = Backbone.View.extend({
    initialize:function () {
        this.render();
    },
    render:function () {
        $(this.el).html( render('404View', {}) );
        return this;
    }
});

App.Views.Session = Backbone.View.extend({
    initialize:function () {
        this.render();
    },
    render:function () {
        $(this.el).html( render('SessionView', {}) );
        return this;
    }
});