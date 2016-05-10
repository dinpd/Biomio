App.Views.GoogleApp = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('GoogleAppView', {});
        this.$el.html( template );
    },
    events: {
        //"submit .invitation-form" : "invite",
    },
    invite: function(e) {
        e.preventDefault(e);

        var name = $('.invitation-form .name').val();
        var email = $('.invitation-form .email').val();

        $.ajax({
                type: 'POST',
              //  url: 'php/googleappinvite.php',
                url: '/invite/googleapp_invitation',
                data: {cmd: "googleapp_invitation", name: name, email: email},
                success: function(data) {
                    if (data == '#success') alert('Thank you ' + name + ' for your interest in BIOMIO Email Protector. Your application will be reviewed in 24 hours, and you will recieve further instruction via ' + email);
                    else alert('Something is wrong. Please reload the page and apply again');
                }
            });
    }
});

$(document).on('click touchend', ".faq-header", function (e) {
	if ($(this).find('.glyphicon').hasClass('glyphicon-menu-right'))
		$(this).find('.glyphicon').removeClass('glyphicon-menu-right').addClass('glyphicon-menu-down');
	else
		$(this).find('.glyphicon').removeClass('glyphicon-menu-down').addClass('glyphicon-menu-right');
});