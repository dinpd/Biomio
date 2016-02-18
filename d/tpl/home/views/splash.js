App.Views.Splash = Backbone.View.extend({
    el: 'body',
    initialize:function () {
        $(window).on("resize", this.changeVideoHeight);
    },
    render:function () {
        var template = render('SplashPageView', {});
        $("#content").html( template );
        this.changeVideoHeight();
    },
    events: {
        "keyup .splash-name": "verifyName",
        "change .splash-email": "verifyEmail",
        "click .splash-apply": "apply",
        "keyup .splash-code": "verifyCode",
        "click .splash-submit": "submit",
    },
    apply: function(e) {
        e.preventDefault(e);
        var username = $('.splash-name').val();
        var email = $('.splash-email').val();
        var type = $('.splash-type').val();

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
                        alert('Thank you ' + username + '. Your application will be reviewed in 24 hours, and you will recieve invite code via ' + email);
                    } else {
                        alert('something is wrong, please try again');
                    }
                }
            });
        }
    },
    submit: function(e) {
        e.preventDefault(e);
        var code = $('.splash-code').val();

        $.ajax({
                url: 'php/splash.php',
                method: 'POST',
                data: {code: code},
                success: function(data) {
                    if (data == '#error' || data == '') {
                        alert("error occured, please try again");
                    } else if (data == '#incorrect') {
                        alert("wrong invitation code");
                    } else {
                        alert("Welcome " + data);
                        window.location = './';
                    }
                }
            });
    },
    verifyName: function (event) {
        var nameRegex = /[^ a-z0-9]/gi;
        username = $(".splash-name").val();
        username = username.replace(nameRegex, "");
        $(".splash-name").val(username);

        if (username.length > 2) {
            $('.splash-name-group').removeClass("has-warning").addClass("has-success");
        } else {
            $('.splash-name-group').removeClass("has-success").addClass("has-warning");
        }
        $('.splash-apply-help').text('');
    },
    verifyEmail: function (event) {
        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;

        var email = $(".splash-email").val();

        if (!emailRegex.test(email)) {
            $('.splash-email').removeClass("has-success").addClass("has-warning");
            $('.splash-apply-group').addClass("has-warning");
            $('.splash-apply-help').text('Email is in incorrect format');
        } else {
            $('.splash-email').removeClass("has-warning").addClass("has-success");
            $('.splash-apply-group').removeClass("has-warning");
            $('.splash-apply-help').text('');
        }
    },
    verifyCode: function (event) {
        var nameRegex = /[^a-z0-9_-]/gi;
        code = $(".splash-code").val();
        code = code.replace(nameRegex, "");
        $(".splash-code").val(code);

        if (code.length > 2) {
            $('.splash-code-group').removeClass("has-warning").addClass("has-success");
        } else {
            $('.splash-code-group').removeClass("has-success").addClass("has-warning");
        }
        $('.splash-submit-help').text('');
    },
    changeVideoHeight: function() {
        var width = $(".splash-video").width();
        var height = width / 1280 * 720;
        $(".splash-video").height(height);
    },
});