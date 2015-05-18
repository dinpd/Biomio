App.Views.ResetPassword = Backbone.View.extend({
    el: $("#content"),

    initialize:function () {
        this.render();
    },

    render:function () {
        var template = render('ResetPasswordView', {});
        this.$el.html( template );
    },

    events: {
        "click #reset_submit": "submit",
    },

    submit: function(event) {
        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;

        var email = $('#reset_email').val();
        var username = $('#reset_name').val();

        if (email == '' && username == '') $('#reset_span_submit').text('Please enter email or username');
        else if (!emailRegex.test(email) && email != '') $('#reset_span_submit').text('Email is in incorrect format');
        else if (username.length < 3 && username != '') $('#reset_span-username').text('Username is not long enough');
        else {
            this.model.submit(email, username);
        }
        //if error remove alert after 5 seconds
        setTimeout(function() {
            $('#reset_span_submit').text('');
        }, 5000);
    },
});