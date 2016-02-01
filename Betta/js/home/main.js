var AppRouter = Backbone.Router.extend({
    initialize: function() {
        this.routesHit = 0;
        //keep count of number of routes handled by your application
        Backbone.history.on('route', function() { this.routesHit++; }, this);
    },
    routes: {
    //Home menu
        ""                           : "home",
        "home"                       : "home",
        "signup"                     : "signup",
        "wizard/:type"               : "wizard",
        "login"	                     : "login",
        //"account-settings"           : "settings",
        "about"                      : "about",
        "emailprotector"             : "emailprotector",
        "developers"                 : "developers",
        "mobilebeta"                 : "mobilebeta",
        "contact"                    : "contact",
        "apis"                       : "apis",
        "profiles/:id"               : "users",
        "providers/:id"              : "providers",
        "locations/:id"              : "locations",
        "websites/:id"               : "websites",
    //User menu
        "user-info"                  : "user_info",
        "phone"                      : "phone",
        "user-services"              : "user_services",
        "user-mobile-devices"        : "user_mobile_devices",
        "user-fingerprints"          : "user_fingerprints",
        "user-face"                  : "user_face",
        "user-iris"                  : "user_iris",
        "user-voice"                 : "user_voice",
        "user-locations"             : "user_resources",
        "user-websites"              : "user_websites",
        "user-reports"               : "user_reports",
    //Provider menu
        //"provider-info"              : "provider_info",
        //"provider-locations"         : "provider_locations",
        //"provider-websites"          : "provider_websites",
        //"provider-policies"          : "provider_policies",
        //"provider-users"             : "provider_users",
        //"provider-users/:locationId" : "provider_users",
        //"provider-devices"           : "provider_devices",
        //"provider-reports"           : "provider_reports",
        "provider-api"               : "provider_api",
        "login-implementation"       : "login_implementation",
        "captcha-implementation"     : "captcha_implementation",
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

        /*
        $('.post').addClass("hidden").viewportChecker({
        classToAdd: 'visible animated fadeIn',
        offset: 100
        });


        $('.minpost').addClass("hidden").viewportChecker({
        classToAdd: 'visible animated fadeInUp',
        offset: 200
        });
        */

        /*$('#slider').nivoSlider({
            effect:'fade',
            pauseTime: 5000,
            animSpeed: 1000,
            directionNav:false,
            controlNav:true,
            pauseOnHover: false
        });*/
    },
    about: function () {
        this.main_navigation('about-menu');
        if (!this.aboutView) this.aboutView = new App.Views.About();
        this.aboutView.render();
         $('body').children(".container").addClass('extraWidth');
        this.footer();

        //set height of the video
        var width = $(".about-video").width();
        var height = width / 1280 * 720;
        $(".about-video").height(height);
    },
    emailprotector: function () {
        this.main_navigation('home-menu');
        if (!this.googleappView) this.googleappView = new App.Views.GoogleApp();
        this.googleappView.render();
        this.footer();
    },
    developers: function () {
        this.main_navigation('home-menu');
        if (!this.developersView) this.developersView = new App.Views.Developers();
        this.developersView.render();
        this.footer();
    },
    mobilebeta: function () {
        this.main_navigation('home-menu');
        if (!this.mobilebetaView) this.mobilebetaView = new App.Views.MobileBeta();
        this.mobilebetaView.render();
        this.footer();
    },
    apis: function () {
        this.main_navigation('apis-menu');
        if (!this.apisView) this.apisView = new App.Views.Apis();
        $('#content').html(this.apisView.el);
        this.footer();
    },
    contact: function () {
        this.main_navigation('contact-menu');
        if (!this.contactView) this.contactView = new App.Views.Contact();
        this.contactView.render();
        this.footer();
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
    wizard: function(type) {
        this.main_navigation('home-menu');
        if (!this.wizardView) this.wizardView = new App.Views.Wizard();
        this.wizardView.render(type);
        this.footer(); 
    },
    settings: function(type) {
        if (!check_session()) return;
        this.main_navigation('home-menu');
        var type = window.profileType;
        
        if (type == 'USER') {
            //if type is USER, get user-info model and set it for the view
            if (!this.settingsModel) this.settingsModel = new App.Models.UserPersonalInfo();
            this.settingsView = new App.Views.AccountSettings({model: this.settingsModel});
            this.settingsModel.url = App.Url + '/users/' + window.profileId;
            var that = this;
            this.settingsModel.fetch({
                success: function () {
                    that.settingsView.render(type);
                }
            });
        } else if (type == 'PROVIDER') {
            //if type is PROVIDER, get provider-info model and set it for the view
            if (!this.providerInfoModel) this.providerInfoModel = new App.Models.ProviderInformation();
            this.settingsView = new App.Views.AccountSettings({model: this.providerInfoModel});
            this.providerInfoModel.url = App.Url + '/providers/' + window.profileId;
            var that = this;
            this.providerInfoModel.fetch({
                success: function () {
                    that.settingsView.render(type);
                }
            });
        }
        this.footer();
    },
    users: function(id) {
        if (!check_session()) return;
        this.main_navigation('home-menu');
        if (!this.userModel) this.userModel = new App.Models.UserPersonalInfo();
        if (!this.userView) this.userView = new App.Views.User({model: this.userModel});
        var that = this;
        this.userModel.url = App.Url + '/users/' + id;
        this.userModel.fetch({
            success: function () {
                that.userView.render();
            }
        });
        this.footer();
    },
    providers: function(id) {
        if (!check_session()) return;
        this.main_navigation('home-menu');
        if (!this.providerInfoModel) this.providerInfoModel = new App.Models.ProviderInformation();
        if (!this.providerView) this.providerView = new App.Views.Provider({model: this.providerInfoModel});
        var that = this;
        this.providerInfoModel.url = App.Url + '/providers/' + id;
        this.providerInfoModel.fetch({
            success: function () {
                that.providerView.render();
            }
        });
        this.footer();
    },
    locations: function(id) {
        if (!check_session()) return;
        this.main_navigation('home-menu');
        if (!this.locationModel) this.locationModel = new App.Models.ProviderLocation();
        if (!this.locationView) this.locationView = new App.Views.SecureLocation({model: this.locationModel});
        var that = this;
        this.locationModel.url = App.Url + '/secureLocations/' + id;
        this.locationModel.fetch({
            success: function () {
                that.locationView.render();
            }
        });
        this.footer();
    },
    websites: function(id) {
        if (!check_session()) return;
        this.main_navigation('home-menu');
        if (!this.websiteModel) this.websiteModel = new App.Models.ProviderWebsite();
        if (!this.websiteView) this.websiteView = new App.Views.Website({model: this.websiteModel});
        var that = this;
        this.websiteModel.url = App.Url + '/websites/' + id;
        this.websiteModel.fetch({
            success: function () {
                that.websiteView.render();
            }
        });
        this.footer();
    },
    //User menu
    user_info: function () {
        if (!check_session()) return;
        this.interface_navigation('User', 'user-info-menu'); 
        if (!this.userInfoModel) this.userInfoModel = new App.Models.UserPersonalInfo();
        if (!this.userInfoView) this.userInfoView = new App.Views.UserPersonalInfo({model: this.userInfoModel});
        var that = this;
        this.userInfoModel.url = App.Url + '/users/' + window.profileId;
        this.userInfoModel.fetch({
            success: function () {
                that.userInfoView.render();
            }
        });
        this.footer();
    },
    phone: function () {
        if (!check_session()) return;
        this.interface_navigation('User', 'user-info-menu');
        if (!this.userPhoneView) this.userPhoneView = new App.Views.UserPhone();
        this.footer();
    },
    user_services: function () {
        if (!check_session()) return;
        this.interface_navigation('User', 'user-services-menu');
        if (!this.userServices) this.userServices = new App.Views.userServices();
        this.userServices.render();
        this.footer();
    },
    user_mobile_devices: function () {
        if (!check_session()) return;
        this.interface_navigation('User', 'user-mobile-devices-menu');
        if (!this.userMobileDevices) this.userMobileDevices = new App.Views.userMobileDevices();
        this.userMobileDevices.render();
        this.footer();
    },
    user_fingerprints: function () {
        if (!check_session()) return;
        this.interface_navigation('User', 'user-bio-menu');
        if (!this.userFingerprintsModel) this.userFingerprintsModel = new App.Models.UserPersonalInfo();
        if (!this.userFingerprintsView) this.userFingerprintsView = new App.Views.UserFingerprints({model: this.userFingerprintsModel});
        var that = this;
        this.userFingerprintsModel.url = App.Url + '/users/' + window.profileId;
        this.userFingerprintsModel.fetch({
            success: function () {
                that.userFingerprintsView.render();
            }
        });
        this.footer();
    },
    user_face: function () {
        if (!check_session()) return;
        this.interface_navigation('User', 'user-face-menu');
        if (!this.userFace) this.userFace = new App.Views.UserFace();
        this.userFace.render();
        this.footer();
    },
    user_iris: function () {
        if (!check_session()) return;
        this.interface_navigation('User', 'user-bio-menu');
        if (!this.irisView) this.irisView = new App.Views.UserIris();
        this.irisView.render();
    },
    user_voice: function () {
        if (!check_session()) return;
        this.interface_navigation('User', 'user-bio-menu');
        if (!this.userVoiceModel) this.userVoiceModel = new App.Models.UserPersonalInfo();
        if (!this.voiceView) this.voiceView = new App.Views.UserVoice({model: this.userVoiceModel});
        var that = this;
        this.userVoiceModel.url = App.Url + '/users/' + window.profileId;
        this.userVoiceModel.fetch({
            success: function () {
                that.voiceView.render();
            }
        });
        this.footer();
    },
    user_resources: function () {
        if (!check_session()) return;
        this.interface_navigation('User', 'user-locations-menu');
        if (!this.userResourcesMainView) this.userResourcesMainView = new App.Views.UserResourcesMain ();
        this.userResourcesMainView.render();

        if (!this.userResourcesCollection) this.userResourcesCollection = new App.Collections.UserResources();
        else this.userResourcesCollection.reset();
        if (!this.userResourcesView) this.userResourcesView = new App.Views.UserResources({collection: this.userResourcesCollection});
        if (!this.addUserResourceView) this.addUserResourceView = new App.Views.UserAddResource({ collection: this.userResourcesCollection });

        this.userResourcesCollection.url = App.Url + '/users/' + window.profileId + '/resources';
        this.userResourcesCollection.fetch();
        this.footer();
    },
    user_websites: function () {
        if (!check_session()) return;
        this.interface_navigation('User', 'user-websites-menu');
        if (!this.websitesView) this.websitesView = new App.Views.UserWebsites();
        this.websitesView.render();
        this.footer();
    },
    user_reports: function () {
        if (!check_session()) return;
        this.interface_navigation('User', 'user-reports-menu');
        if (!this.userReportsMainView) this.userReportsMainView = new App.Views.UserReportsMain ();
        this.userReportsMainView.render();

        if (!this.userReportsCollection) this.userReportsCollection = new App.Collections.UserReports();
        else this.userReportsCollection.reset();
        if (!this.userReportsView) this.userReportsView = new App.Views.UserReports ({ collection: this.userReportsCollection });
        
        this.userReportsCollection.url = App.Url + '/users/' + window.profileId + '/reports';
        this.userReportsCollection.fetch(); 
        this.footer();
    },
    //Provider menu
    provider_info: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'provider-info-menu');
        if (!this.providerInfoModel) this.providerInfoModel = new App.Models.ProviderInformation();
        if (!this.providerInfoView) this.providerInfoView = new App.Views.ProviderInformation({model: this.providerInfoModel});
        var that = this;
        this.providerInfoModel.url = App.Url + '/providers/' + window.profileId;
        this.providerInfoModel.fetch({
            success: function () {
                that.providerInfoView.render();
            }
        });
        this.footer();
    },
    provider_locations: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'provider-locations-menu');
        if (!this.providerLocationsMainView) this.providerLocationsMainView = new App.Views.ProviderLocationsMain ();
        this.providerLocationsMainView.render();

        //Locations collection
        if (!this.providerLocationsCollection) this.providerLocationsCollection = new App.Collections.ProviderLocations();
        else this.providerLocationsCollection.reset();
        if (!this.providerLocationsView) this.providerLocationsView = new App.Views.ProviderLocations ({ collection: this.providerLocationsCollection });
        if (!this.addProviderLocationView) this.addProviderLocationView = new App.Views.ProviderAddLocation({ collection: this.providerLocationsCollection });
        this.providerLocationsCollection.url = App.Url + '/users/' + window.profileId + '/secureLocations';  

        // fetch or reset avaliable-policies Collection
        if (!window.avaliablePoliciesCollection) window.avaliablePoliciesCollection = new App.Collections.ProviderPolicies();
        else window.avaliablePoliciesCollection.reset();
        window.avaliablePoliciesCollection.url = App.Url + '/users/' + window.profileId + '/policies';
        window.avaliablePoliciesCollection.fetch();
        // avaliable policies

        this.providerLocationsCollection.fetch();
        this.footer();
    },
    provider_websites: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'provider-websites-menu');
        if (!this.providerWebsitesMainView) this.providerWebsitesMainView = new App.Views.ProviderWebsitesMain();
        this.providerWebsitesMainView.render();
        
        if (!this.providerWebsitesCollection) this.providerWebsitesCollection = new App.Collections.ProviderWebsite();
        else this.providerWebsitesCollection.reset();
        if (!this.providerWebsitesView) this.providerWebsitesView = new App.Views.ProviderWebsites ({ collection: this.providerWebsitesCollection });
        if (!this.addProviderWebsiteView) this.addProviderWebsiteView = new App.Views.ProviderAddWebsite({ collection: this.providerWebsitesCollection });

        this.providerWebsitesCollection.url = App.Url + '/users/' + window.profileId + '/websites';
        this.providerWebsitesCollection.fetch();
        this.footer();
    },
    provider_policies: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'provider-policies-menu');
        if (!this.providerPoliciesMainView) this.providerPoliciesMainView = new App.Views.ProviderPoliciesMain ();
        this.providerPoliciesMainView.render();

        if (!this.providerPoliciesCollection) this.providerPoliciesCollection = new App.Collections.ProviderPolicies();
        else this.providerPoliciesCollection.reset();
        if (!this.providerPoliciesView) this.providerPoliciesView = new App.Views.ProviderPolicies ({ collection: this.providerPoliciesCollection });
        if (!this.addProviderPolicyView) this.addProviderPolicyView = new App.Views.ProviderAddPolicy({ collection: this.providerPoliciesCollection });

        this.providerPoliciesCollection.url = App.Url + '/users/' + window.profileId + '/policies';
        this.providerPoliciesCollection.fetch();
        this.footer();
    },
    provider_users: function (locationId) {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'provider-users-menu');                                                   
        if (!this.providerUsersMainView) this.providerUsersMainView = new App.Views.ProviderUsersMain ();
        this.providerUsersMainView.render();

        if (!window.avaliableLocationsCollection) window.avaliableLocationsCollection = new App.Collections.ProviderLocations();
        else window.avaliableLocationsCollection.reset();
        if (!this.avaliableLocationsView) this.avaliableLocationsView = new App.Views.AvaliableLocations ({ collection: window.avaliableLocationsCollection });
        window.avaliableLocationsCollection.url = App.Url + '/users/' + window.profileId + '/secureLocations';
          
        that = this;
        window.avaliableLocationsCollection.fetch({
            success: function () {
                that.avaliableLocationsView.renderForUsers();
                //getting users for the firs location
                that.providerUsersMainView.getUsers(locationId);
            }
        });
        this.footer();
    },
    provider_devices: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'provider-devices-menu');
        if (!this.providerDevicesMainView) this.providerDevicesMainView = new App.Views.ProviderDevicesMain();
        this.providerDevicesMainView.render();
        
        if (!this.providerDevicesCollection) this.providerDevicesCollection = new App.Collections.ProviderDevice();
        else this.providerDevicesCollection.reset();
        if (!this.providerDevicesView) this.providerDevicesView = new App.Views.ProviderDevices ({ collection: this.providerDevicesCollection });
        if (!this.addProviderDeviceView) this.addProviderDeviceView = new App.Views.ProviderAddDevice({ collection: this.providerDevicesCollection });
        this.providerDevicesCollection.url = App.Url + '/users/' + window.profileId + '/devices';

        // fetch or reset avaliable-locations Collection
        if (!window.avaliableLocationsCollection) window.avaliableLocationsCollection = new App.Collections.ProviderLocations();
        else window.avaliableLocationsCollection.reset();
        window.avaliableLocationsCollection.url = App.Url + '/users/' + window.profileId + '/secureLocations';
        window.avaliableLocationsCollection.fetch();
        // end avaliable locations

        this.providerDevicesCollection.fetch();
        that = this;
        setInterval(function(){ that.providerDevicesCollection.fetch(); }, 180000);
        this.footer();
    },
    provider_reports: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'provider-reports-menu');
        if (!this.userReportsMainView) this.userReportsMainView = new App.Views.UserReportsMain ();
        this.userReportsMainView.render();

        if (!this.userReportsCollection) this.userReportsCollection = new App.Collections.UserReports();
        else this.userReportsCollection.reset();
        if (!this.userReportsView) this.userReportsView = new App.Views.UserReports ({ collection: this.userReportsCollection });
        
        this.userReportsCollection.url = App.Url + '/users/' + window.profileId + '/reports';
        this.userReportsCollection.fetch();
        this.footer();
    },
    provider_api: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'provider-api-menu');
        if (!this.providerApiView) this.providerApiView = new App.Views.ProviderApi();
        this.providerApiView.render();
        this.footer(); 
    },
    login_implementation: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'login-implementation-menu');
        if (!this.loginImplementationView) this.loginImplementationView = new App.Views.LoginImplementation();
        this.loginImplementationView.render();
        this.footer();
    },
    captcha_implementation: function () {
        if (!check_session()) return;
        this.interface_navigation('Provider', 'captcha-implementation-menu');
        if (!this.captchaImplementationView) this.captchaImplementationView = new App.Views.CaptchaImplementation();
        this.captchaImplementationView.render();
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

        // Temporary Splash Page
        // For every page we check if the user is invited and then show the actual website
        /*if (menu_item != 'contact-menu' && menu_item != 'about-menu') {
            $.ajax({
                url: 'php/splash.php',
                method: 'POST',
                data: {check: 1},
                success: function(data) {
                    if (data == '') {
                        if (!window.splashView) window.splashView = new App.Views.Splash();
                        window.splashView.render();
                        $('.container').addClass('extraWidth');
                        $('#login').addClass('hide');
                    } else {
                    }
                }
            });
        }*/
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
        url: 'php/login.php',
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

                session_checker();
            } else {
                if (window.location.hash != '' && 
                    window.location.hash != '#home' && 
                    window.location.hash != '#signup' &&
                    window.location.hash != '#login' &&
                    window.location.hash != '#about' &&
                    window.location.hash != '#emailprotector' &&
                    window.location.hash != '#developers' &&
                    window.location.hash != '#mobilebeta' &&
                    window.location.hash != '#404' &&
                    window.location.hash != '#thankyou' &&
                    window.location.hash != '#contact') {
                    
                    window.hash1 = window.location.hash;
                    window.location = './#login';
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
        if (window.location.hash != '' && 
                    window.location.hash != '#home' && 
                    window.location.hash != '#signup' &&
                    window.location.hash != '#login' &&
                    window.location.hash != '#about' &&
                    window.location.hash != '#emailprotector' &&
                    window.location.hash != '#developers' &&
                    window.location.hash != '#mobilebeta' &&
                    window.location.hash != '#404' &&
                    window.location.hash != '#thankyou' &&
                    window.location.hash != '#contact') {
                    
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
        var tmpl_url = 'tpl/' + tmpl_name + '.html?' + time;

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
        $.ajax({
            type: 'POST',
            url: 'php/login.php',
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