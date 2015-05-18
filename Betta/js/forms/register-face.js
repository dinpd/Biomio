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
            $('#first-name').text(data.firstname);
            $('#last-name').text(data.lastname);
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
                "hand": hand,
                "finger": finger,
                "captureType": "WEBCAM"
            })
        }).done(function(data) {
            var sampleId = data.id;
            $.ajax({
                type: "PUT",
                url: 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + userId + '/fingerprint/' + sampleId
            }).done(function(data) {
                console.log('registered', sampleId);
                ++samples;
                $('#progress-value').css('width', samples / maxSamples * 100 + '%');
                if (samples >= maxSamples){
                    register_stopRegistration();
                    alert("success");
                    hand = $('#hand-position').html();
                    finger = $('#finger-position').html();
                    $('#' + hand + finger + ' div div').removeClass('off').addClass('on');

                    $('.white_content').addClass('hide');
                    $('.black_overlay').addClass('hide');
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





// 1. Camera Control (Common.js) for fingerprint Registration
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

var localMediaStream = null;
var snapshotTimer = null;
var snapshotInProgress = false;

function snapshot() {
    if (localMediaStream && !snapshotInProgress) {
        $('#scratchpad').attr('width', $('#capture-frame').prop('videoWidth'));
        $('#scratchpad').attr('height', $('#capture-frame').prop('videoHeight'));
        $('#scratchpad')[0].getContext('2d').drawImage($('#capture-frame')[0], 0, 0);
        snapshotInProgress = true;
        processDaraURL($('#scratchpad')[0].toDataURL('image/jpeg'));
    }
}

function startSnapshots() {
    snapshotInProgress = false;
    snapshotTimer = setInterval(snapshot, 1000);
    $('body').addClass('capturing');
}

function stopSnapshots() {
    window.clearInterval(snapshotTimer);
    $('body').removeClass('capturing');
}

function continueSnapshots() {
    snapshotInProgress = false;
}

function cameraAvailable(stream) {
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

function cameraFailed(e) {
    console.log('camera failed',e);
    $('body').removeClass('camerasetup');
    $('body').addClass('nocam');
    $('body').addClass('noimage');
};

function uploadSelected() {
    var files = $('#file-input').prop('files');
    if (files.length > 0) {
        var reader = new FileReader();
        reader.onload = function(event) {
            $('#image-preview').attr('src', event.target.result);
            $('body').removeClass('noimage');
            processDaraURL(event.target.result);
        };
        reader.readAsDataURL(files[0]);
    }
};

function startCamera() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, cameraAvailable, cameraFailed);
    } else {
        cameraFailed('No navigator.getUserMedia');
    }
}

function loadUser() {
    if (userId != "") {
        $.ajax({
            url: 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + userId
        }).done(function(data) {
            $('#first-name').text(data.firstname);
            $('#last-name').text(data.lastname);
            $('#email').text(data.emails);
            $('body').addClass('user-loaded');
        });
    }
}

$(document).ready(function() {
    $('#file-input').change(uploadSelected);
    $('body').addClass('camerasetup');
    startCamera();
});




// 2. Fingerprint regisration functions

var samples = 0;
var maxSamples = 5;
var userId = "";
var face_link = "";
var user_link = "";

var processDaraURL = function(image) {
    if (samples < maxSamples) {
        $.ajax({
            type: "POST",
            url: face_link,
            contentType: 'application/json',
            data: JSON.stringify({
                "fingerPrintString": image.split(',')[1],
                "captureType": "WEBCAM",
            })
        }).done(function(data) {
            var sampleId = data.id;
            $.ajax({
                type: "PUT",
                url: 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + userId + '/' + user_link + '/' + sampleId
            }).done(function(data) {
                console.log('registered', sampleId);
                ++samples;
                $('.progress-bar').css('width', samples / maxSamples * 100 + '%');
                $('#progress-value').html(samples / maxSamples * 100 + '%');
                if (samples >= maxSamples)
                    stopRegistration();
                continueSnapshots();
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                continueSnapshots();
            });
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            continueSnapshots();
        });
    }
};

var startRegistration = function() {
    if (userId != "") {
         $('.progress-bar').css('width', '0%');
        samples = 0;
        startSnapshots();
    }
}

var stopRegistration = function() {
    stopSnapshots();
}

$(document).on('click touchend', "#submit", function () {
    userId = $('#user_id').val();
    face_link = $('#face_link').val();
    user_link = $('#user_link').val();
    
    if (userId != '' && face_link != '' && user_link != '') {
        $('#start-registration').click(startRegistration);
        $('#stop-registration').click(stopRegistration);
        loadUser();
        $('#portrait img').css('display', 'block');

    } else {
        alert("user id, face_link, and user_link can't be empty");
    }
});


