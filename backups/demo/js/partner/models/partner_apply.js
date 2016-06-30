App.Models.PartnerApply = Backbone.Model.extend({

    defaults: {
    },

    initialize: function () {
    },

    saveData: function(){
    	var name = $("#apply_provider_name").val();
    	var email = $("#apply_provider_email").val();
    	var organization = $("#apply_provider_organization").val();
    	var volume = $("#apply_provider_volume").val();

    	alert(name + email + organization + volume);
    }
});