App.Views.Developers = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('Developers', {});
        this.$el.html( template );
    },
    events: {
        "click .developer-apply": "apply",
    },
    apply: function(e) {
        e.preventDefault(e);
        var username = $('.splash-name').val();
        var email = $('.splash-email').val();
        var type = 'Developer';

        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;

        if (username.length < 3) {
            $('.splash-apply-group').addClass("has-warning");
            $('.splash-apply-help').text('The username is not long enough');
        } else if (!emailRegex.test(email)) {
            $('.splash-apply-group').addClass("has-warning");
            $('.splash-apply-help').text('Email is in incorrect format');
        } else {
            $('.splash-apply-group').removeClass("has-warning");
            $('.splash-apply-help').text('');

            $.ajax({
                url: 'php/splash.php',
                method: 'POST',
                data: {name: username, email: email, type: type},
                success: function(data) {
                    if (data == 'success') {
                        alert('Thank you ' + username + '. Your application will be reviewed in 24 hours, and you will recieve developer documentation code via ' + email);
                    } else {
                        alert('something is wrong, please try again');
                    }
                }
            });
        }
    },

});