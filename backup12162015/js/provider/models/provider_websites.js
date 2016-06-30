//Model for one website
App.Models.ProviderWebsite = Backbone.Model.extend({
  defaults: {
    "title"          : "",
    "domains"        : {},
    'categories'     : {},
    "description"    : "",
   },
  initialize: function(){
    this.on("invalid",function(model,error){
      message('danger', 'Invalid: ', error);
    });
  },
  validate: function(attrs) {
    if ( ! $.trim(attrs.title) ) return "Invalid title";
    else if ( ! $.trim(attrs.domains) ) return "Invalid domain";
  }
});
