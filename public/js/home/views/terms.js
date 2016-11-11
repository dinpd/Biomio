App.Terms.About = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
        this.render();
        $(window).on("resize", this.changeVideoHeight);
    },
    render:function () {
        var template = render('TermsView', {});
        this.$el.html( template );
    },

});