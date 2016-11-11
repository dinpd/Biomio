App.Views.Privacy = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
        this.render();
        $(window).on("resize", this.changeVideoHeight);
    },
    render:function () {
        var template = render('PrivacyView', {});
        this.$el.html( template );
    },


});