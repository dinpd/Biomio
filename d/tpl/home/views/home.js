App.Views.Home = Backbone.View.extend({
    initialize:function () {
        this.render();
    },
    render:function () {
        $(this.el).html( render('HomeView', {}) );
        return this;
    },
    events: {
        "click .user-nav"       : "user_active",
        "click .provider-nav"   : "provider_active",
        "click .solutions-nav"  : "solutions_active",
    },
    user_active: function() {
        $('.divider-box .divider-triangle').css('margin-left', '32%');
    	$('.user-nav, .provider-nav, .solutions-nav').removeClass('active-nav');
    	$('.user-nav').addClass('active-nav');
    	$('.provider-tile, .solutions-tile').addClass('hide');
    	$('.user-tile').removeClass('hide');
        $('.tiles').removeClass('provider-background').removeClass('solutions-background').addClass('user-background');
    },
    provider_active: function() {
        $('.divider-box .divider-triangle').css('margin-left', '48.8%');
    	$('.user-nav, .solutions-nav').removeClass('active-nav');
    	$('.provider-nav').addClass('active-nav');
    	$('.user-tile, .solutions-tile').addClass('hide');
    	$('.provider-tile').removeClass('hide');
        $('.tiles').removeClass('user-background').removeClass('solutions-background').addClass('provider-background');
    },
    solutions_active: function() {
        $('.divider-box .divider-triangle').css('margin-left', '65.6%');
    	$('.user-nav, .provider-nav').removeClass('active-nav');
    	$('.solutions-nav').addClass('active-nav');
    	$('.user-tile, .provider-tile').addClass('hide');
    	$('.solutions-tile').removeClass('hide');
        $('.tiles').removeClass('user-background').removeClass('provider-background').addClass('solutions-background');
    },
});