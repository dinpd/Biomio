App.Views.PartnerSupport = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('PartnerSupportView', {});
        this.$el.html( template );
    }
});