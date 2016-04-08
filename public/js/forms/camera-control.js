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
