var samples = 0;
var maxSamples = 5;
var userId = "";
var hand = "RIGHT";
var finger = "THUMB";

// 1. Camera Control (Common.js) for fingerprint Registration

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

var localMediaStream = null;
var snapshotTimer = null;
var snapshotInProgress = false;

function register_snapshot() {
    if (localMediaStream && !snapshotInProgress) {
        $('#scratchpad').attr('width', $('#capture-frame').prop('videoWidth'));
        $('#scratchpad').attr('height', $('#capture-frame').prop('videoHeight'));
        $('#scratchpad')[0].getContext('2d').drawImage($('#capture-frame')[0], 0, 0);
        snapshotInProgress = true;
        register_processDaraURL($('#scratchpad')[0].toDataURL('image/jpeg'));
    }
}

function register_startSnapshots() {
    snapshotInProgress = false;
    snapshotTimer = setInterval(register_snapshot, 1000);
    $('body').addClass('capturing');
}

function register_stopSnapshots() {
    window.clearInterval(snapshotTimer);
    $('body').removeClass('capturing');
}

function register_continueSnapshots() {
    snapshotInProgress = false;
}

function register_cameraAvailable(stream) {
    if (window.URL) {
        $('#preview').attr('src', window.URL.createObjectURL(stream));
        $('#capture-frame').attr('src', window.URL.createObjectURL(stream));
    } else {
        $('#preview').prop('src', stream);
        $('#capture-frame').prop('src', stream);
    }
    $('body').removeClass('camerasetup');
    localMediaStream = stream;
}

function register_cameraFailed(e) {
    console.log('camera failed',e);
    $('body').removeClass('camerasetup');
    $('body').addClass('nocam');
    $('body').addClass('noimage');
};

function register_uploadSelected() {
    var files = $('#file-input').prop('files');
    if (files.length > 0) {
        var reader = new FileReader();
        reader.onload = function(event) {
            $('#image-preview').attr('src', event.target.result);
            $('body').removeClass('noimage');
            register_processDaraURL(event.target.result);
        };
        reader.readAsDataURL(files[0]);
    }
};

function register_startCamera() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, register_cameraAvailable, register_cameraFailed);
    } else {
        register_cameraFailed('No navigator.getUserMedia');
    }
}

function register_loadUser() {
    if (userId != "") {
        $.ajax({
            url: 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + userId
        }).done(function(data) {
            $('#first-name').text('');
            $('#last-name').text('');
            $('#email').text(data.emails);
            $('body').addClass('user-loaded');
        });
    }
}

// 2. Fingerprint regisration functions

var register_processDaraURL = function(image) {
    if (samples < maxSamples) {
        $.ajax({
            type: "POST",
            url: 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/fingerprints',
            contentType: 'application/json',
            data: JSON.stringify({
                "fingerPrintString": image.split(',')[1],
                "hand": "RIGHT",
                "finger": "INDEX",
                "captureType": "WEBCAM"
            })
        }).done(function(data) {
            var sampleId = data.id;
            $.ajax({
                type: "PUT",
                url: 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + userId + '/fingerprint/' + sampleId
            }).done(function(data) {
                $('#finger_status').val('1');
                console.log('registered', sampleId);
                ++samples;
                $('#progress-value').css('width', samples / maxSamples * 100 + '%');
                if (samples >= maxSamples){
                    $('#finger_status').val('2');
                    register_stopRegistration();
                    alert("success");
                    hand = $('#hand-position').html();
                    finger = $('#finger-position').html();
                    $('#' + hand + finger + ' div div').removeClass('off').addClass('on');
                }
                register_continueSnapshots();
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                register_continueSnapshots();
            });
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            register_continueSnapshots();
        });
    }
};

var register_startRegistration = function() {
    if (userId != "") {
        $('#progress-value').css('width', '0%');
        samples = 0;
        register_startSnapshots();
    }
}

var register_stopRegistration = function() {
    register_stopSnapshots();
}

function register_parseHash() {
    finger = $('#finger-position').html();
    hand = $('#hand-position').html();
    userId = window.profileApiId;
    register_loadUser();
}
