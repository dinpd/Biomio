App.Views.ChangePassword = Backbone.View.extend({
    el: $("#content"),

    initialize:function () {
      this.render();
    },

    render:function () {
        var template = render('ChangePasswordView', {});
        this.$el.html( template );
    },

    events: {
        "click #change_submit": "submit",
        "keyup #change_new_password": "verifyPassword",
        "change #change_repeat_password": "verifyRepeatPassword",
    },

    submit: function(event) {
        var old_password = $('#change_old_password').val();
        var new_password = $('#change_new_password').val();
        var new_password2 = $('#change_repeat_password').val();
        
        if (new_password.length < 7) {
            $('#change_span_submit').text('The new password is not long enough');
        } else if (new_password != new_password2) {
            $('#change_span_submit').text("Passwords don't match");
        } else {
            this.model.submit(old_password, new_password);
        }
    },

    verifyPassword: function (event) {
        var passwordRegex = /[^a-z0-9]/gi;

        var new_password = $("#change_new_password").val();
        var password_check = new_password.replace(passwordRegex, "");

        if (password_check.length < 7) {
            $('#change_new_password_group').removeClass("has-success").addClass("has-warning");
            var symbols_left = 7 - password_check.length;
            $('#change_span_new_password').text("Symbols left: " + symbols_left);
        } else if (password_check != new_password) {
            $('#change_new_password_group').removeClass("has-success").addClass("has-warning");
            $('#change_span_new_password').text("Password may contain letters from 'a' to 'z' and numbers");
        } else {
            $('#change_new_password_group').removeClass("has-warning").addClass("has-success");
            $('#change_span_new_password').text('');
        }
    },

    verifyRepeatPassword: function (event) {
        var password1 = $('#change_new_password').val();
        var password2 = $('#change_repeat_password').val();

        if (password1 != password2) {
            $('#change_repeat_password_group').removeClass("has-success").addClass("has-warning");
            $('#change_span_repeat_password').text("Passwords don't match");
        } else {
            $('#change_repeat_password_group').removeClass("has-warning").addClass("has-success");
            $('#change_span_repeat_password').text('');
        }
    }

});