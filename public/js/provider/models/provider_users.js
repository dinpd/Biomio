//Model for one user
App.Models.ProviderUser = Backbone.Model.extend({
  defaults: {
    "ownerName"        : '',
    "ownerEmail"       : '',
    "userName"         : '',
    "userEmail"        : '',
    "type"             : "invitation",
    "status"           : "pending",
    "timeRestriction"  : "00:00:00 - 23:59:59",
   },
  initialize: function(){
    this.on("invalid",function(model,error){
        message('danger', 'Invalid: ', error);
    });
  },
	validate: function(attrs) {
    if ( ! $.trim(attrs.userEmail) ) return "Invalid email";
	},
});
