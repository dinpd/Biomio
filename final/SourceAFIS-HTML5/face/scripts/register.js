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
