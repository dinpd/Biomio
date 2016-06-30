App.Views.PartnerApply = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('PartnerApplyView', {});
        this.$el.html( template );
    },
    events: {
        "click .apply-partner-apply": "Apply"
    },
    Apply: function( event ){
        var apply = new App.Models.PartnerApply();
        apply.saveData();
    }
});
