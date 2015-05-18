//Model for one Policy
App.Models.ProviderPolicy = Backbone.Model.extend({
    defaults: {
        owner: 0,
        name: '',
        bioAuth: '',
        minAuth: 1,
        maxAuth: 2,
        matchCertainty: 90,
        geoRestriction: '',
        timeRestriction: '',
    },
    initialize: function(){
      this.on("invalid",function(model,error){
          message('danger', 'Invalid: ', error);
      });
    },
    validate: function(attrs) {
        if ( ! $.trim(attrs.name) ) return "Invalid name";
        //else if ((! $.trim(attrs.matchCertainty)) && (attrs.matchCertainty < 1 || attrs.matchCertainty > 100)) return "Match Certainty should be a number from 1 to 100";
        //else if ((! $.trim(attrs.minAuth)) && (isNaN(attrs.minAuth)) && (attrs.minAuth > 0)) return "Min Auth should be a positive number";
        //else if ((! $.trim(attrs.maxAuth)) && (isNaN(attrs.maxAuth)) && (attrs.maxAuth > 0)) return "Max Auth should be a positive number";
        //else if ((! $.trim(attrs.minAuth)) && (! $.trim(attrs.maxAuth)) && (attrs.maxAuth <= attrs.minAuth)) return "Max Auth should be larger than Min Auth";
    },
});
