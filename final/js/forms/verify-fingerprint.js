// Contains all the same parts except turnin the webcam on
// Webcam is getting turned on by the home/views/login.js

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

var localMediaStream = null;
var snapshotTimer = null;
var snapshotInProgress = false;
var block = 0;

function snapshot() {
    if (localMediaStream && !snapshotInProgress && block == 0) {
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
    block = 1;
    snapshotInProgress = true; 
    clearInterval(snapshotTimer);//for some reason this doesn't work, so I use var block to stop
    localMediaStream.stop();
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
    $('.enable-media').addClass('hide');// close 'allow webcam' pop-up
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
    enable_media('webcam'); // open 'allow webcam' pop-up

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, cameraAvailable, cameraFailed);
    } else {
        cameraFailed('No navigator.getUserMedia');
    }
}

function loadUser(username) {
    $.ajax({
        url: 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/select?username=' + username
    }).done(function(data) {
        startSnapshots();
        continueSnapshots();

        if (data.firstname != null) window.FirstName = data.firstname;
        else window.FirstName = "";
        if (data.lastname != null) window.LastName = data.lastname;
        else window.LastName = "";
        window.Email = data.emails;
        $('body').addClass('user-loaded');
        
        userId = data.id;

        render_form();
        startCamera();
    }).fail(function(data) {
        $('.biomio-error').html("User is not found");
    });
}

/*
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


//VERIFY.js
var userId = 0;

var processDaraURL = function(image) {
    if($("log_in_email")=="admin@admin.com") {

    }
    if (userId != "") {
        $.ajax({
            type: "POST",
            url: 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + userId + '/verify',
            contentType: 'application/octet-stream',
            data: image.split(',')[1]
        }).done(function(data) {
            console.log(data);
            var score = parseFloat(data);
            if (score >= 40) {
                $('body').addClass('match');
                stopSnapshots();
                biomio_submit (userId)
            }
            continueSnapshots();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            continueSnapshots();
        });
    }
};

$(document).on('click touchend', ".biomio-button", function (event) {    
    $('.biomio_user_form').removeClass("hide");
});

$(document).on('click touchend', ".biomio-cancel", function (event) {    
    $('.biomio_user_form').addClass("hide");
});

$(document).on('click touchend', ".biomio-submit", function (event) {
    var username = $(".biomio-name").val();
    if (username != '') {
        loadUser(username);
        block = 0;

    } else 
        $('.biomio-error').html("Please, enter your BIOMIO Username");
});

/*
$(document).ready(function() {
    parseHash();
    startSnapshots();
});
*/
/*
$(window).bind('hashchange', function() { parseHash(); });
*/

/*
//SUPPORTING FUNCTIONS
function render_button() {
    $.ajax({
        url: "http://biom.io/SourceAFIS-HTML5/button-template.html",
        method: 'GET',
        async: false,
        success: function(data) {
            $('#biomio-verify').html(data);
        }
    });
}
*/

function render_form() {
    $.ajax({
        url: "http://biom.io/biomio_implementation/biomio-verify.html",
        method: 'GET',
        async: false,
        success: function(data) {
            $('.biomio_user_form').addClass("hide");

            $('.content-div').html(data);
            if (window.FirstName == "" && window.LastName == "")
                $('#first-name').text(" ");
            else {
                $('#first-name').text(window.FirstName);
                $('#last-name').text(window.LastName);
            }
            $('#email').text(window.Email);
            $('.white_content').removeClass('hide');
            $('.black_overlay').removeClass('hide');
        }
    });
}


function biomio_submit (api_id) {
    $.ajax({
        type: 'POST',
        url: 'php/login.php',
        data: {cmd: "biomio_login", api_id: api_id},
        success: function(data) {
            if (data == '#email') $('#log_in_span_submit').text("we don't have this email address in our system");
                else if (data == '#password') $('#log_in_span_submit').text("password is incorrect");
                else {
                    var data = jQuery.parseJSON( data );
                    window.profileName = data.username;
                    window.profileId = data.id;
                    window.profileApiId = data.api_id;
                    window.profileType = data.type;

                    //saving cookies - 30 days expiration
                    set_cookie('biomio_username', window.profileName, 30)

                    //w8 for 2 seconds to enjoy 'Success' sign and redirect the user to the profile page
                    setTimeout(function() {
                        if (data.type == 'USER') window.location.hash = 'user-info';
                        else if (data.type == 'PROVIDER') window.location.hash = 'provider-info';
                        else if (data.type == 'PARTNER') window.location.hash = 'partner-how';

                        stopSnapshots();
                        $('.white_content').addClass('hide');
                        $('.black_overlay').addClass('hide');
                        $('body').removeClass('match');
                        $('.content-div').html('');
                    }, 1500);
                }
        }
    });
}

/*
<script>
    function biomio_success(message){
        alert('Success: ' + message)
        var email = 'charles@biom.com';
        var password = 'charles123';
        var remember = 1;
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

                   
                    stopSnapshots();
                    $('.white_content').addClass('hide');
                    $('.black_overlay').addClass('hide');
                    $('body').removeClass('match');
                    $('.white_content').html('');
                }
                //if error remove alert after 5 seconds
                setTimeout(function() {
                    $('#log_in_span_submit').text('');
                }, 5000);
            }
        });
    }
</script>
*/