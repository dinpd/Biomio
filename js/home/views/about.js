App.Views.About = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
        this.render();
        $(window).on("resize", this.changeVideoHeight);
    },
    render:function () {
        var template = render('AboutView', {});
        this.$el.html( template );
    },
    changeVideoHeight: function() {
    	var width = $(".about-video").width();
        var height = width / 1280 * 720;
        $(".about-video").height(height);
    },

});