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

$(document).ready(function() {
    render_button();
});

$(document).on('click touchend', "#biomio-button", function () {    
    render_form();
    $('#file-input').change(uploadSelected);
    $('body').addClass('camerasetup');
    startCamera();
 });

$(document).on('click touchend', "#fade", function () {    
    $('.white_content').addClass('hide');
    $('.black_overlay').addClass('hide');
 });


//VERIFY.js
var userId = 4;

var processDaraURL = function(image) {
    if($("log_in_email")=="admin@admin.com") {

    }
    if (userId != "") {
        $.ajax({
            type: "POST",
            url: 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + 4 + '/verify',
            contentType: 'application/octet-stream',
            data: image.split(',')[1]
        }).done(function(data) {
            console.log(data);
            var score = parseFloat(data);
            if (score >= 43) {
                $('body').addClass('match');
                stopSnapshots();
                submit ('charles@biom.com', 'charles123', 1)
            }
            continueSnapshots();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            continueSnapshots();
        });
    }
};

function parseHash() {
    userId = window.location.hash.substring(1);
    loadUser();
    continueSnapshots();
}

$(document).ready(function() {
    parseHash();
    startSnapshots();
});

$(window).bind('hashchange', function() { parseHash(); });


//SUPPORTING FUNCTIONS
function render_button() {
    $.ajax({
        url: "http://biom.io/biomio_implementation/button-template.html",
        method: 'GET',
        async: false,
        success: function(data) {
            $('#biomio-verify').html(data);
        }
    });
}

function render_form() {
    $.ajax({
        url: "http://biom.io/biomio_implementation/biomio-verify.html",
        method: 'GET',
        async: false,
        success: function(data) {
            $('.content-div').html(data);
            $('#first-name').text(window.FirstName);
            $('#last-name').text(window.LastName);
            $('#email').text(window.Email);
            $('.white_content').removeClass('hide');
            $('.black_overlay').removeClass('hide');
        }
    });
}

function submit (email, password, remember) {

    $.ajax({
        type: 'POST',
        url: 'php/login.php',
        data: {cmd: "login", email: email, password: password, remember: remember},
        success: function(data) {
            if (data == '#email') $('#log_in_span_submit').text("we don't have this email address in our system");
            else if (data == '#password') $('#log_in_span_submit').text("password is incorrect");
            else {
                var data = jQuery.parseJSON( data );
                window.profileName = data.username;
                window.profileId = data.id;
                alert('Welcome back!')
                if (data.type == 'USER') window.location.hash = 'user-info';
                else if (data.type == 'PROVIDER') window.location.hash = 'provider-info';
                else if (data.type == 'PARTNER') window.location.hash = 'partner-how';

                $('.white_content').removeClass('hide');
                $('.black_overlay').removeClass('hide');
            }
            //if error remove alert after 5 seconds
            setTimeout(function() {
                $('#log_in_span_submit').text('');
            }, 5000);
        }
    });
}