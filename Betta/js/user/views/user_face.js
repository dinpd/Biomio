//View for one Face
App.Views.UserFace = Backbone.View.extend({
    el: $("body"),
    initialize: function () {
        this.model.on('change', this.render, this);
    },
    render: function () {
        var template = render('UserFaceView', this.model.toJSON());
        $("#content").html( template );
    },
    events: {
        'click .train-face'         : 'trainFace',
        'click .black_overlay'      : 'done'
    },
    trainFace: function (e) {
        e.preventDefault();

        var template = render('forms/RegisterFaceCam', {});
        $(".white_content").html( template );

        $('#file-input').change(register_face_uploadSelected);
        $('body').addClass('camerasetup');
        register_face_startCamera();

        $('#first-name').html(window.profileName);

        register_face_parseHash();
        $('#start-registration').click(register_face_startRegistration);
        $('#stop-registration').click(register_face_stopRegistration);

        $('.white_content').removeClass('hide');
        $('.black_overlay').removeClass('hide');
    },
    done: function(){
        $('.white_content').addClass('hide');
        $('.black_overlay').addClass('hide');
        $('.white_content').html('');

        if(window.navigator.getUserMedia) {
            video.pause();
            video.src=null;
        } 
        else if(window.navigator.mozGetUserMedia) {
            video.pause();
            video.mozSrcObject=null;
        }
        else if(window.navigator.webkitGetUserMedia) {
            video.pause();
            video.src="";
        }

        stopSnapshots();
        register_face_stopSnapshots();
    },
});
