var userId = "";

var processDaraURL = function(image) {
    if (userId != "") {
        $.ajax({
            type: "POST",
            url: 'http://ec2-54-187-197-187.us-west-2.compute.amazonaws.com/api/users/' + userId + '/verify',
            contentType: 'application/octet-stream',
            data: image.split(',')[1]
        }).done(function(data) {
            console.log(data);
            var score = parseFloat(data);
            if (score >= 50) {
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
