App.Views.Signup = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
    },
    render:function (type) {
        var template = render('SignupView', {type: type, typeLower : type.toUpperCase()});
        this.$el.html( template );
    },
    events: {
        "click #sign_in_submit": "submit",
        "keyup #sign_in_name": "verifyName",
        "change #sign_in_email": "verifyEmail",
        "keyup #sign_in_password": "verifyPassword",
        "change #sign_in_repeat_password": "verifyRepeatPassword",
    },
    submit: function(e) {
        e.preventDefault(e);
        var username = $('#sign_in_name').val();
        var email = $('#sign_in_email').val();
        var password1 = $('#sign_in_password').val();
        var password2 = $('#sign_in_repeat_password').val();

        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;

        if (username.length < 3) {
            $('#sign_in_span-submit').text('The username is not long enough');
        } else if (!emailRegex.test(email)) {
            $('#sign_in_span-submit').text('Email is in incorrect format');
        } else if (password1.length < 7) {
            $('#sign_in_span-submit').text('The password is not long enough');
        } else if (password1 != password2) {
            $('#sign_in_span-submit').text("Passwords don't match");
        } else {
            this.model.submit(username, email, password1);
        }
    },
    verifyName: function (event) {
        var nameRegex = /[^a-z0-9_-]/gi;
        username = $("#sign_in_name").val();
        username = username.replace(nameRegex, "");
        $("#sign_in_name").val(username);

        if (username.length < 3) {
            $('#sign_in_name_group').removeClass("has-success").addClass("has-warning");
            var symbols_left = 3 - username.length;
            $('#sign_in_span_name').text('Symbols left: ' + symbols_left);
        } else {
            $('#sign_in_name_group').removeClass("has-warning").addClass("has-success");
            $('#sign_in_span_name').text('');

            this.model.verify("name", username);
        }
    },
    verifyEmail: function (event) {
        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;

        var email = $("#sign_in_email").val();

        if (!emailRegex.test(email)) {
            $('#sign_in_email_group').removeClass("has-success").addClass("has-warning");
            $('#sign_in_span_email').text('Email is in incorrect format');
        } else {
            $('#sign_in_email_group').removeClass("has-warning").addClass("has-success");
            $('#sign_in_span_email').text('');

            this.model.verify("email", email);
        }
    },
    verifyPassword: function (event) {
        var passwordRegex = /[^a-z0-9]/gi;

        var password = $("#sign_in_password").val();
        var password_check = password.replace(passwordRegex, "");

        if (password_check.length < 7) {
            $('#sign_in_password_group').removeClass("has-success").addClass("has-warning");
            var symbols_left = 7 - password_check.length;
            $('#sign_in_span_password').text("Symbols left: " + symbols_left);
        } else if (password_check != password) {
            $('#sign_in_password_group').removeClass("has-success").addClass("has-warning");
            $('#sign_in_span_password').text("Password may contain letters from 'a' to 'z' and numbers");
        } else {
            $('#sign_in_password_group').removeClass("has-warning").addClass("has-success");
            $('#sign_in_span_password').text('');
        }
    },
    verifyRepeatPassword: function (event) {
        var password1 = $('#sign_in_password').val();
        var password2 = $('#sign_in_repeat_password').val();

        if (password1 != password2) {
            $('#sign_in_repeat_password_group').removeClass("has-success").addClass("has-warning");
            $('#sign_in_span_repeat_password').text("Passwords don't match");
        } else {
            $('#sign_in_repeat_password_group').removeClass("has-warning").addClass("has-success");
            $('#sign_in_span_repeat_password').text('');
        }
    }
});