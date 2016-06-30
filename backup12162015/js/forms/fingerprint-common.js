// all common functions for verify-fingeprint.js and register-fingeprint.js

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
            url: 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + 4
        }).done(function(data) {
            window.Name = data.firstname;
            window.LastName = data.lastname;
            window.Email = data.emails;
            $('body').addClass('user-loaded');
        });
    }
}

/* remove later
$(document).ready(function() {
    render_button();
});

$(document).on('click touchend', "#biomio-button", function () {    
    render_form();
    $('#file-input').change(uploadSelected);
    $('body').addClass('camerasetup');
    startCamera();
 });
*/