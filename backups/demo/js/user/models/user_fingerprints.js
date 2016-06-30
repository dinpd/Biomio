//Model for one Fingerprint
App.Models.UserFingerprint = Backbone.Model.extend({
    defaults: {
        date: '',
        hand: '',
        finger: '',
        captureType: '',
        templateHeader: '',
        fingerPrintString: ''
    },
    initialize: function(){
        this.on("invalid",function(model,error){
            message('danger', 'Invalid: ', error);
        });
    },
});