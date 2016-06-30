//Model for one resource
App.Models.UserReport = Backbone.Model.extend({
  url: App.Url + '/reports',
  defaults: {
    "profileId"     : "",
    "type"          : "",
    "description"   : "",
   },
    initialize: function(){
      this.on("invalid",function(model,error){
        message('danger', 'Invalid: ', error);
      });
    },
    validate: function(attrs) {
    },
});