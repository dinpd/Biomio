App.Views.PartnerHow = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('PartnerHowView', {});
        this.$el.html( template );
    }
});