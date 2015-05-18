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
    render_button();
});

$(document).on('click touchend', "#biomio-button", function () {    
    render_form();
    $('#file-input').change(uploadSelected);
    $('#biomio-verify').addClass('camerasetup');
    startCamera();
 });

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

function render_form() {
    $.ajax({
        url: "http://biom.io/SourceAFIS-HTML5/biomio-verify.html",
        method: 'GET',
        async: false,
        success: function(data) {
            $('#biomio-webcam-div').html(data);
        }
    });
}


//POPUP
popupStatus: 0,
loading: function() {
    this.$el.find(".popup").html( '' );
    this.$el.find(".loader").show();
    var template = render('forms/FingerprintsPopup', {});
    this.$el.find(".popup").html( template );
},
closeloading: function() {
    this.$el.find(".loader").fadeOut('normal');
},
loadPopup: function() {
    if(this.popupStatus == 0) { //show popup
        this.closeloading();
        this.$el.find(".toPopup").fadeIn(0500);
        this.$el.find(".backgroundPopup").css("opacity", "0.7");
        this.$el.find(".backgroundPopup").fadeIn(0001);
        this.popupStatus = 1;
    }
},
tooltipOpen: function() {
    this.$el.find('.ecs_tooltip').show();
},
tooltipClose: function() {
    this.$el.find('.ecs_tooltip').addClass('hide');

},
closepopup: function() {
    disablePopup();
},
disablePopup: function() {
    if(this.popupStatus == 1) { //close popup
        this.$el.find(".toPopup").fadeOut("normal");
        this.$el.find(".backgroundPopup").fadeOut("normal");
        this.popupStatus = 0;
    }
}