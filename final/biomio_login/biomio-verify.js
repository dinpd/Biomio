navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

var localMediaStream = null;
var snapshotTimer = null;
var snapshotInProgress = false;
var biomioId = "";

$(document).ready(function() {
    if($('#biomio-button').length <= 0) render_button();
});

//****************
//**** COMMON *****
//******************

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
    var url = '';
    if ($('.biomio-id').not('.biomio-input').length > 0 && $('.biomio-id').not('.biomio-input').val()!='')
        url = 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + $('.biomio-id').not('.biomio-input').val();
    else if ($('.biomio-name').not('.biomio-input').length > 0 && $('.biomio-name').not('.biomio-input').val()!='')
        url = 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/select?username=' + $('.biomio-name').not('.biomio-input').val();
    else if ($('.biomio-email').not('.biomio-input').length > 0 && $('.biomio-email').not('.biomio-input').val()!='')
        url = 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + $('.biomio-email').not('.biomio-input').val();
    else if ($('.biomio-id.biomio-input').val()!='')
        url = 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + $('.biomio-id.biomio-input').val();
    else if ($('.biomio-name .biomio-input').val()!='')
        url = 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/select?username=' + $('.biomio-name.biomio-input').val();
    else if ($('.biomio-email.biomio-input').val()!='')
        url = 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + $('.biomio-email.biomio-input').val();
    $.ajax({
        url: url,
    }).done(function(data) {
        startCamera();
        startSnapshots();
        $('.biomio_user_form').addClass('hide');
        $('.biomio_body').removeClass('hide');
        $('.biomio_overlay').removeClass('hide');

        $('#biomio-first-name').html(data.firstname);
        $('#biomio-last-name').html(data.lastname);
        $('#biomio-email').html(data.emails);
        biomioId = data.id
        $('body').addClass('user-loaded');
        continueSnapshots();
    }).fail(function(data) {
        $('.biomio-error').html("User is not found");
    });
}

//****************
//**** VERIFY *****
//******************
var processDaraURL = function(image) {
    if($("log_in_email")=="admin@admin.com") {

    }
    if (biomioId != "") {
        $.ajax({
            type: "POST",
            url: 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + biomioId + '/verify',
            contentType: 'application/octet-stream',
            data: image.split(',')[1]
        }).done(function(data) {
            console.log(data);
            var score = parseFloat(data);
            if (score >= 40) {
                $('body').addClass('match');
                stopSnapshots();
                biomio_success ("BIOMIO welcome message");
            }
            continueSnapshots();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            continueSnapshots();
        });
    }
};

$(document).on('click touchend', "#biomio-button", function (event) {    
    event.preventDefault();
    render_form();
    $('#file-input').change(uploadSelected);
    $('body').addClass('camerasetup');
 });

$(document).on('click touchend', ".biomio_overlay, .close-box", function () {
    stopSnapshots(); 
    $('.biomio_body').addClass('hide');
    $('.biomio_overlay').addClass('hide');
    $('.biomio_user_form').addClass('hide');

    if (!$('.biomio_user_form').hasClass('hide')) $('.biomio_user_form').addClass('hide');
    if (!$('.biomio_body').hasClass('hide')) $('.biomio_body').addClass('hide');
    if ($('body').hasClass('match')) $('body').removeClass('match');
    biomioId = '';
});

$(document).on('click touchend', ".biomio-submit", function (event) { 
    event.preventDefault();
    if ($('.biomio-name.biomio-input').val()=='' &&
                    $('.biomio-email.biomio-input').val()=='' &&
                        $('.biomio-id.biomio-input').val()=='') {
        $('.biomio-error').html("Please, enter your BIOMIO Username");
    } else {
        loadUser();
    }
});

$(document).on('click touchend', ".biomio-cancel", function () {    
    $('.biomio_user_form').addClass('hide');
});


//****************
//***** OTHER *****
//******************
function render_button() {
    $.ajax({
        url: "http://biom.io/biomio_login/button-template.html",
        method: 'GET',
        xhrFields: {
            withCredentials: false
        },
        headers: {
        },
        success: function(data) {
            $('.biomio-login').html(data);
        }
    });
}

function render_form() {
    $.ajax({
        url: "http://biom.io/biomio_login/biomio-verify.html",
        type: 'GET',
        xhrFields: {
            withCredentials: false
        },
        headers: {
        },
        success: function(data) {
            if ($('#biomio-content').length <= 0) $('body').append(data);
            if (($('.biomio-name').not('.biomio-input').length > 0 && $('.biomio-name').not('.biomio-input').val()!='') || 
                    ($('.biomio-email').not('.biomio-input').length > 0 && $('.biomio-email').not('.biomio-input').val()!='') || 
                        ($('.biomio-id').not('.biomio-input').length > 0 && $('.biomio-id').not('.biomio-input').val()!='')) {
                loadUser();
                startCamera();
                startSnapshots();
                $('.biomio_body').removeClass('hide');
                $('.biomio_overlay').removeClass('hide');
            } else {
                $('.biomio_user_form').removeClass('hide');
            }
        }
    });
}
