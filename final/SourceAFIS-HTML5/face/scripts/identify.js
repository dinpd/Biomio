var identify_link = "";

var processDaraURL = function(image) {
    $('#portrait img').css('display', 'block');
        $.ajax({
            type: "POST",
            url: identify_link,
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
            $('#response').append("<p>" + data + "</p>");
            continueSnapshots();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            continueSnapshots();
        });
};

function parseHash() {
    continueSnapshots();
}

$(document).ready(function() {
    parseHash();
	startSnapshots();
});

$(window).bind('hashchange', function() { parseHash(); });