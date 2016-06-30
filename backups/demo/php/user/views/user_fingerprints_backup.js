navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL;

//View for one Fingerprint
App.Views.UserFingerprints = Backbone.View.extend({
    el: $("body"),
    initialize: function () {
        this.model.on('change', this.render, this);
    },
    render: function () {
        var template = render('UserFingerprintsView', this.model.toJSON());
        $("#content").html( template );
    },
    events: {
        'click .finger div'         : 'trainFingerprint',
        'click .black_overlay'      : 'done',
        'click #start-registration' : 'startRegistration',
        'click #stop-registration'  : 'stopRegistration'
    },
    trainFingerprint: function (e) {
        e.preventDefault();

        var template = render('forms/RegisterFingeprintCam', {});
        $(".white_content").html( template );

        $('#file-input').change(this.uploadSelected);
        $('body').addClass('camerasetup');
        this.startCamera();

        $('#hand-position').html(this.model.get('hand'));
        $('#finger-position').html(this.model.get('finger'));
        $('#first-name').html(window.profileName);

        this.parseHash();

        $('.white_content').removeClass('hide');
        $('.black_overlay').removeClass('hide');
    },
    done: function(){
        $('.white_content').addClass('hide');
        $('.black_overlay').addClass('hide');
        $('.white_content').html('');
        /*
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
        */
        this.stopSnapshots();
    },
    // Registration Client
    samples: 0,
    maxSamples: 5,
    userId: "",

    // 1. Camera Control (Common.js) for fingerprint Registration
    localMediaStream: null,
    snapshotTimer: null,
    snapshotInProgress: false,

    snapshot: function() {
        if (window.localMediaStream && !this.snapshotInProgress) {
            $('#scratchpad').attr('width', $('#capture-frame').prop('videoWidth'));
            $('#scratchpad').attr('height', $('#capture-frame').prop('videoHeight'));
            $('#scratchpad')[0].getContext('2d').drawImage($('#capture-frame')[0], 0, 0);
            this.snapshotInProgress = true;
            this.processDaraURL($('#scratchpad')[0].toDataURL('image/jpeg'));
        }
    },
    startSnapshots: function() {
        this.snapshotInProgress = false;
        this.snapshotTimer = setInterval(this.snapshot, 1000);
        $('body').addClass('capturing');
    },
    stopSnapshots: function() {
        window.clearInterval(this.snapshotTimer);
        $('body').removeClass('capturing');
    },
    continueSnapshots: function() {
        this.snapshotInProgress = false;
    },
    cameraAvailable: function(stream) {
        if (window.URL) {
            $('#preview').attr('src', window.URL.createObjectURL(stream));
            $('#capture-frame').attr('src', window.URL.createObjectURL(stream));
        } else {
            $('#preview').prop('src', stream);
            $('#capture-frame').prop('src', stream);
        }
        $('body').removeClass('camerasetup');
        window.localMediaStream = stream;
    },
    cameraFailed: function(e) {
        console.log('camera failed',e);
        $('body').removeClass('camerasetup');
        $('body').addClass('nocam');
        $('body').addClass('noimage');
    },
    uploadSelected: function() {
        var files = $('#file-input').prop('files');
        if (files.length > 0) {
            var reader = new FileReader();
            reader.onload = function(event) {
                $('#image-preview').attr('src', event.target.result);
                $('body').removeClass('noimage');
                this.processDaraURL(event.target.result);
            };
            reader.readAsDataURL(files[0]);
        }
    },
    startCamera: function() {
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true}, this.cameraAvailable, this.cameraFailed);
        } else {
            this.cameraFailed('No navigator.getUserMedia');
        }
    },
    loadUser: function() {
        if (this.userId != "") {
            $.ajax({
                url: 'http://biomapi-env.elasticbeanstalk.com/api/users/' + this.userId
            }).done(function(data) {
                $('#first-name').text(data.firstname);
                $('#last-name').text(data.lastname);
                $('#email').text(data.emails);
                $('body').addClass('user-loaded');
            });
        }
    },
    // 2. Fingerprint regisration functions
    processDaraURL: function(image) {
        alert('here');
        if (this.samples < this.maxSamples) {
            $.ajax({
                type: "POST",
                url: 'http://biomapi-env.elasticbeanstalk.com/api/fingerprints',
                contentType: 'application/json',
                data: JSON.stringify({
                    "fingerPrintString": image.split(',')[1],
                    "hand": hand,
                    "finger": finger,
                    "captureType": "WEBCAM"
                })
            }).done(function(data) {
                var sampleId = data.id;
                $.ajax({
                    type: "PUT",
                    url: 'http://biomapi-env.elasticbeanstalk.com/api/users/' + this.userId + '/fingerprint/' + sampleId
                }).done(function(data) {
                    console.log('registered', sampleId);
                    ++this.samples;
                    $('#progress-value').css('width', this.samples / this.maxSamples * 100 + '%');
                    if (this.samples >= this.maxSamples){
                        this.stopRegistration();
                        alert("success");
                        hand = $('#hand-position').html();
                        finger = $('#finger-position').html();
                        $('#' + hand + finger + ' div div').removeClass('off').addClass('on');

                        $('.white_content').addClass('hide');
                        $('.black_overlay').addClass('hide');
                    }
                    this.continueSnapshots();
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                    this.continueSnapshots();
                });
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                this.continueSnapshots();
            });
        }
    },
    startRegistration: function() {
        if (this.userId != "") {
            $('#progress-value').css('width', '0%');
            this.samples = 0;
            this.startSnapshots();
        }
    },
    stopRegistration: function() {
        this.stopSnapshots();
    },
    parseHash: function() {
        finger = $('#finger-position').html();
        hand = $('#hand-position').html();
        this.userId = window.profileApiId;
        this.loadUser();
    },
});
