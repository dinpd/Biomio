App.Views.Header = Backbone.View.extend({
    el: $(".header"),
    initialize: function () {
    },
    render: function () {
        var template = render('ProviderHeader');
        this.$el.html( template );

        $('.tooltipster-dev').tooltipster({'maxWidth': 250, theme: 'tooltipster-light', delay: 50, content: $('<p>This page is in development</p>')});

        if (window.profileId != '' && window.profileId != null) {
            $('.profile-on').removeClass("hide");
            $('.profile-off').addClass("hide");
            if ((window.profileFirstName == null && window.profileLastName == null) || (window.profileFirstName == '' && window.profileLastName == '')) $('.profile').html('User');
            else if (window.profileFirstName == null || window.profileFirstName == '') $('.profile').html(window.profileLastName);
            else if (window.profileLastName == null || window.profileLastName == '') $('.profile').html(window.profileFirstName);
            else $('.profile').html(window.profileFirstName + ' ' + window.profileLastName);

            $.ajax({
            type: 'POST',
            //url: '../php/provider.php',
            url: '../provider/load_providers',
            data: {cmd: "load_providers"},
            dataType: "json",
            success: function(data) {
                if (data != null)
                    jQuery.each(data, function(j, provider) {
                        $( ".provider-header" ).after('<li><a href="./session.php?p=' + provider.id + '">' + provider.name + '</a></li>');
                    });
            }
        });

        } else {
            $('.profile-off').removeClass("hide");
            $('.profile-on').addClass("hide");
        }
    },
    events: {
        "click .logout-menu": "logout",
        "click #login .login": "login",
    },
    logout: function (event) {
        $.ajax({
            type: 'POST',
            //url: '../php/login.php',
            url: '../login/logout',
            data: {cmd: "logout"},
            success: function(data) {
                if (data.search("out")!=-1) {
                    //document.cookie = 'connect.sid' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                    //set_cookie('connect.sid', '', 200);

                    $('.logout-menu').addClass("hide");
                    window.profileId = undefined;
                    window.profileFirstName = undefined;
                    window.profileLastName = undefined;
                    window.profileType = undefined;
                    window.location = '../#home';

                    clearInterval(session_checker);
                    
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
            //url: '../php/login.php',
            url: '../login/change_type',
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
    },
    login: function () {
        hash = '';
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
