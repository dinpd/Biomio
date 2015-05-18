var samples = 0;
var maxSamples = 5;
var userId = "";
var hand = "RIGHT";
var finger = "THUMB";

var processDaraURL = function(image) {
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
        $('#progress-value').css('width', '0%');
        samples = 0;
        startSnapshots();
    }
}

var stopRegistration = function() {
    stopSnapshots();
}

function parseHash() {
    var parts = window.location.hash.substring(1).split(',');
    userId = parts[0];
    hand = parts[1];
    finger = parts[2];
    $('#hand-position').text(hand);
    $('#finger-position').text(finger);
    loadUser();
}

$(document).ready(function() {
    parseHash();
    $('#start-registration').click(startRegistration);
    $('#stop-registration').click(stopRegistration);
});

$(window).bind('hashchange', function() { parseHash(); });
