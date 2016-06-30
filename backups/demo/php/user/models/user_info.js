App.Models.UserPersonalInfo = Backbone.Model.extend({
    defaults: {
        'name': 'User unknown',
        'motto': 'Let it be',
        'emails': {}
    },
    initialize: function () {

    },
    validate: function(attrs) {
        if ( ! $.trim(attrs.name) ) return "Invalid name";
    },
});