App.Views.PartnerResources = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('PartnerResourcesView', {});
        this.$el.html( template );
    },
    events: {
        "click .partner-resources-add": "add",
        "click .partner-resources-save": "save",
        "click .partner-resources-change": "change",
        "click .partner-resources-submit": "submit",
        "click .partner-resources-cancel": "cancel"
    },
    add: function( event ){
        $(".partner-resources-add").addClass('hide');
        $("#partner_resources_form").removeClass('hide');

    },
    save: function( event ){
        this.model.saveData();
    },
    change: function( event ){
        event.preventDefault();
        var id = $(event.currentTarget).attr("id");
        $('#'+id).addClass('hide');
        $('#'+id+"_form").removeClass('hide');

    },
    submit: function( event ){
        event.preventDefault();
        var id = $(event.currentTarget).attr("id");
        var id = id.replace('_submit','');
        this.model.changeData(id);
    },
    cancel: function( event ){
        event.preventDefault();
        var id = $(event.currentTarget).attr("id");
        var id = id.replace('_cancel','');
        $('#'+id).removeClass('hide');
        $('#'+id+"_form").addClass('hide');
    },
});