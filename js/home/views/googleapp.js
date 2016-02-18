App.Views.GoogleApp = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('GoogleAppView', {});
        this.$el.html( template );
    },
    events: {
        "click .enable-protector" : "enable",
    },
    enable: function(e) {
        e.preventDefault(e);

        if (window.profileId == null || window.profileId == undefined) {
            window.location = '/#login';
            window.hash1 = '#user-services';
        } else {
            window.location = '/#user-services'
        }
    }
});

$(document).on('click touchend', ".faq-header", function (e) {
	if ($(this).find('.glyphicon').hasClass('glyphicon-menu-right'))
		$(this).find('.glyphicon').removeClass('glyphicon-menu-right').addClass('glyphicon-menu-down');
	else
		$(this).find('.glyphicon').removeClass('glyphicon-menu-down').addClass('glyphicon-menu-right');
});