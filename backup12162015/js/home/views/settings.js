App.Views.AccountSettings = Backbone.View.extend({
    el: $("#content"),
    initialize: function () {
    },
    render: function (type) {
        if (type == 'USER') var template = render('UserSettingsView', this.model.toJSON());
        else if (type == 'PROVIDER') var template = render('ProviderSettingsView', this.model.toJSON());
        this.$el.html( template );
    },
    events: {
        'click .notifications-checkbox [type="checkbox"]' : 'notifications',
    },
    notifications: function(event) {
        var notifications = new Array(0,0,0);
        if($('#notifications-0').is(":checked")) notifications[0] = 1;
        if($('#notifications-1').is(":checked")) notifications[1] = 1;
        if($('#notifications-2').is(":checked")) notifications[2] = 1;

        this.model.save({notifications: notifications}, {
            success: function (data) {
                message('success', 'Success: ', 'Notifications successfully changed');
            },
            error: function (data) {
                message('danger', 'Error: ', 'try again');
            }
        });
    },
});