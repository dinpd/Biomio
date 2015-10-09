App.Views.Header = Backbone.View.extend({
    el: $(".header"),
    initialize: function () {
    },
    render: function () {
        var template = render('HeaderView');
        this.$el.html( template );

        $('.tooltipster-dev').tooltipster({'maxWidth': 250, theme: 'tooltipster-light', delay: 50, content: $('<p>This page is in development</p>')});

        if (window.profileId != '' && window.profileId != null) {
            $('.profile-on').removeClass("hide");
            $('.profile-off').addClass("hide");
            if ((window.profileFirstName == null && window.profileLastName == null) || (window.profileFirstName == '' && window.profileLastName == '')) $('.profile').html('User');
            else if (window.profileFirstName == null || window.profileFirstName == '') $('.profile').html(window.profileLastName);
            else if (window.profileLastName == null || window.profileLastName == '') $('.profile').html(window.profileFirstName);
            else $('.profile').html(window.profileFirstName + ' ' + window.profileLastName);
        } else {
            $('.profile-off').removeClass("hide");
            $('.profile-on').addClass("hide");
        }
    },
    events: {
        "click .logout-menu": "logout",
    },
    logout: function (event) {
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "logout"},
            success: function(data) {
                if (data.search("out")!=-1) {
                    $('.logout-menu').addClass("hide");
                    window.profileId = undefined;
                    window.profileFirstName = undefined;
                    window.profileLastName = undefined;
                    window.profileType = undefined;
                    window.location.hash = 'home';

                    //switching tabs in pannel view
                    $('.profile-off').removeClass("hide");
                    $('.profile-on').addClass("hide");
                }
            }
        });
    },
    changeType: function (type) {
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
            data: {cmd: "change_type", type: type},
            success: function(data) {

            }
        });
    },
    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }
});

App.Views.Sidebar = Backbone.View.extend({
    el: $("#sidebar"),
    initialize: function () {
    },
    render: function (type) {
        var template = render(type + 'HeaderView');
        this.$el.html( template );
    },
    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }
});
