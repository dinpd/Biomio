App.Views.ProviderReporting = Backbone.View.extend({
	el: $("#content"),

    initialize:function () {
        this.render();
    },

    render:function () {
        var template = render('ProviderReportingView', {});
        this.$el.html( template );
    }

});