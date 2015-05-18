App.Views.UserVoice = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('UserVoiceView', this.model.toJSON());
        this.$el.html( template );
    },
    events: {
        'click .train-voice': 'trainVoice',
    },
    trainVoice: function() {
        var template = render('forms/VoiceRecord', {});
        $(".content-div").html( template );

        initAudio();

        $('.white_content').removeClass('hide');
        $('.black_overlay').removeClass('hide');
    }
});

