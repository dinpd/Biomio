App.Models.UserPersonalInfo = Backbone.Model.extend({
    defaults: {
        'motto': 'Let it be',
    },
    initialize: function () {

    },
    validate: function(attrs) {
        if ( ! $.trim(attrs.name) ) return "Invalid name";
    },
});