var AppRouter = Backbone.Router.extend({
    initialize: function() {
        this.routesHit = 0;
        //keep count of number of routes handled by your application
        Backbone.history.on('route', function() { this.routesHit++; }, this);
    },
    routes: {
    //Home menu
        ""                           : "home",
        "signup"                     : "signup",
        "login"	                     : "login",
        
    //User menu
        "provider-info"              : "provider_info",
        "provider-users"             : "provider_users",
        "provider-api-key"           : "provider_api",
        "provider-api-doc"           : "provider_api_doc",
        "provider-login-doc"         : "provider_login_doc",
        "webresources"               : "webresources",

        "session"                    : "session",
        "thankyou"                   : "thankyou",
        "*other"                     : "page_404"
    },
    //Home menu
    home: function () {
        this.main_navigation('home-menu'); 
        if (!this.homeView) {
            this.homeView = new App.Views.Home();
            $('#content').html(this.homeView.el);
        } else {
           $('#content').html(this.homeView.el); 
        }
        $('body').children(".container").addClass('extraWidth');
        this.footer();

        // demid's design
        $(window).scroll(function () {
            if ($(this).scrollTop() > 0) {$('#scroller').fadeIn();} 
            else {$('#scroller').fadeOut();}
        });
            
        $('#scroller').click(function () {$('body,html').animate({scrollTop: 0}, 400); return false;});
    },
	login: function() {
        this.main_navigation('home-menu');
        if (!this.loginView) this.loginView = new App.Views.Login();
        this.loginView.render();
        this.footer();
	},
    signup: function() {
        this.main_navigation('home-menu');
        if (!this.signupView) this.signupView = new App.Views.Signup();
        this.signupView.render();
        this.footer(); 
    },
    //Provider menu
    provider_info: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'provider-info-menu');
        if (!this.providerInfoView) this.providerInfoView = new App.Views.ProviderInformation();
        this.providerInfoView.render();
        this.footer();
    },
    provider_users: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'provider-users-menu');
        if (!this.providerUsersView) this.providerUsersView = new App.Views.ProviderUsers();
        this.providerUsersView.render();
        this.footer();
    },
    provider_api: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'provider-api-key-menu');
        if (!this.providerApiView) this.providerApiView = new App.Views.ProviderApi();
        this.providerApiView.render();
        this.footer(); 
    },
    provider_api_doc: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'provider-api-doc-menu');
        if (!this.providerApiDocView) this.providerApiDocView = new App.Views.ProviderApiDoc();
        this.providerApiDocView.render();
        this.footer(); 
    },
    provider_login_doc: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'provider-login-doc-menu');
        if (!this.providerLoginDocView) this.providerLoginDocView = new App.Views.ProviderLoginDoc();
        this.providerLoginDocView.render();
        this.footer(); 
    },
    webresources: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'webresources-menu');
        if (!this.providerWebResources) this.providerWebResourcesView = new App.Views.ProviderWebResources();
        this.providerWebResourcesView.render();
        this.footer(); 
    },
    // Header for main pages 
    main_navigation: function (menu_item) {
        $('#content').html('');
        $('.footer').html('');

        // for API we need different width of container, which is .extraWidth class
        $(".container").removeClass('extraWidth');

        if ($('#sidebar').hasClass('col-md-3')) {
            $('#sidebar').removeClass('col-md-3');
            $('#sidebar').html(''); 
            $('#content').removeClass('col-md-9');
            $('#content').addClass('col-md-12');
        }
        //header
        if (!this.header) this.header = new App.Views.Header();
        this.header.render();
        this.header.selectMenuItem(menu_item);
    },
    interface_navigation: function (type, menu_item) {
        $('#content').html('');
        add_progress('large', '#content');
        $('.footer').html('');

        // for API we need different width of container, which is .extraWidth class
        $(".container").removeClass('extraWidth');
        
        if ($('#sidebar').hasClass('col-md-3') == false) {
            $('#sidebar').addClass('col-md-3');
            $('#content').removeClass('col-md-12');
            $('#content').addClass('col-md-9');
        }
        //header
        if (!this.header) this.header = new App.Views.Header();
        this.header.render();

        if (!this.sidebar) this.sidebar = new App.Views.Sidebar();
        this.sidebar.render(type);
        this.sidebar.selectMenuItem(menu_item);

        //so system will know the last user's type for the next login
        type = type.toUpperCase();
        window.profileType = type;

        this.header.changeType(type);
        if (type == 'USER') $('#user_header').addClass('hide');
        else if (type == 'PROVIDER') $('#provider_header').addClass('hide');
    },
    footer: function() {
        //footer
        if (!this.footerView) this.footerView = new App.Views.Footer();
        this.footerView.render();
    },
    session: function () {
        this.main_navigation('home-menu'); 
        if (!this.SessionView) this.SessionView = new App.Views.Session();
        $('#content').html(this.SessionView.el);
        $('body').children(".container").addClass('extraWidth');
        this.footer();
    },
    thankyou: function () {
        this.main_navigation('home-menu'); 
        if (!this.ThankYouView) this.ThankYouView = new App.Views.ThankYou();
        $('#content').html(this.ThankYouView.el);
        $('body').children(".container").addClass('extraWidth');
        this.footer();
    },
    page_404: function () {
        window.location.hash = '#404';
        this.main_navigation('home-menu'); 
        if (!this.page404View) this.page404View = new App.Views.Page404();
        $('#content').html(this.page404View.el);
        $('body').children(".container").addClass('extraWidth');
        this.footer();
    },

});

// Main function that starts the aplication
$(document).ready(function() {
    // Main element: gets user ID and starts the router history
    $.ajax({
        type: 'POST',
        //url: '../php/login.php',
        url: '../login/is_loged_in',
        dataType: "json",
        data: {cmd : 'is_loged_in'},
        success: function(data) {
            if (data.id != null) {
                window.profileId = data.id;
                window.profileFirstName = data.first_name;
                window.profileLastName = data.last_name;
                window.profileType = data.type;

                var app = new AppRouter();
                Backbone.history.start();

                console.log(' ');
                console.log(' ------------------------------------------------------ ');
                console.log('session_checker(). provider/main.js deocument.ready');
                console.log('session_checker_interval is:', session_checker_interval);
                console.log('session_checker:', session_checker);

                session_checker();

            } else {
                if (window.location.hash != '#signup') {
                    
                    hash = window.location.hash;
                    window.location = './#signup';
                }

                var app = new AppRouter();
                Backbone.history.start();

                $('.profile-off').removeClass("hide");
                $('.profile-on').addClass("hide");
            }
            //if error, remove alert after 5 seconds
            setTimeout(function() {
                $('#sign_in_submit_span').text('');
            }, 5000);
        }
    });
    // END of main element
});

function check_session() {
    if (window.profileId == null || window.profileId == undefined) {
        if (window.location.hash != '#signup' &&
                window.location.hash != '#signup') {
                    
                window.location = './#session';

                $('.profile-off').removeClass("hide");
                $('.profile-on').addClass("hide");

                return false;
        }
    }
    return true;
}

// Function render is used to get HTML code out of tpl file using Underscore library
function render(tmpl_name, tmpl_data) {
    if ( !render.tmpl_cache ) { 
        render.tmpl_cache = {};
    }
    var time = new Date().getTime();
    if ( ! render.tmpl_cache[tmpl_name] ) {
        var tmpl_url = '../tpl/' + tmpl_name + '.html?' + time;

        var tmpl_string;
        $.ajax({
            url: tmpl_url,
            method: 'GET',
            async: false,
            success: function(data) {
                tmpl_string = data;
            }
        });

        render.tmpl_cache[tmpl_name] = _.template(tmpl_string);
    }

    return render.tmpl_cache[tmpl_name](tmpl_data);
}

// Session checker - checks every minute that session isn't expired; if expired reloads the page and returns to #home
var session_checker;
function session_checker() {
    clearInterval(session_checker);
    session_checker = setInterval(function(){

        console.log('==setInterval== session_checker');

        $.ajax({
            type: 'POST',
            //url: '../php/login.php',
            url: '../login/is_loged_in',
            dataType: "json",
            data: {cmd : 'is_loged_in'},
            success: function(data) {
                if (data.id == null) {
                    clearInterval(session_checker);
                    alert('Your session expired')
                    window.location = './';
                }
            }
        });
    }, 60000); 
}