var userId = "";
var verify_link = "";

var processDaraURL = function(image) {
    $('#portrait img').css('display', 'block');
    if (userId != "") {
        $.ajax({
            type: "POST",
            url: verify_link,
            contentType: 'application/json',
            data: JSON.stringify({
                "required": [
                        image.split(',')[1]
                ], 
                "type": "object", 
                "properties": {
                    "image": {
                        "media": {
                            "type": "image/png", 
                            "binaryEncoding": "base64"
                        }, 
                        "type": "WEBCAM"
                    }
                }
            })
        }).done(function(data) {
            console.log(data);
            var score = parseFloat(data);
            if (score >= 40) {
                $('body').addClass('match');
                stopSnapshots();
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

$(document).on('click touchend', "#submit", function () {
    parseHash();
    startSnapshots();
});
