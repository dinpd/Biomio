App.Models.ProviderInformation = Backbone.Model.extend({
    defaults: {
		'name': 'Company unknown',
		'email': {}
    },
    initialize: function () {
    },
    validate: function(attrs) {
        if ( ! $.trim(attrs.name) ) return "Invalid name";
    },
});