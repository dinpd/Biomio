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
        "signup/:type"               : "signup",
        "login"	                     : "login",
        "reset-password"             : "reset",
        "account-settings"           : "settings",
        "about"                      : "about",
        "contact"                    : "contact",
        "apis"                       : "apis",
        "profiles/:id"               : "users",
        "providers/:id"              : "providers",
        "locations/:id"              : "locations",
        "websites/:id"               : "websites",
    //User menu
        "user-info"                  : "user_info",
        "user-fingerprints"          : "user_fingerprints",
        "user-face"                  : "user_face",
        "user-iris"                  : "user_iris",
        "user-voice"                 : "user_voice",
        "user-locations"             : "user_resources",
        "user-websites"              : "user_websites",
        "user-reports"               : "user_reports",
    //Provider menu
        "provider-info"              : "provider_info",
        "provider-locations"         : "provider_locations",
        "provider-websites"          : "provider_websites",
        "provider-policies"          : "provider_policies",
        "provider-users"             : "provider_users",
        "provider-users/:locationId" : "provider_users",
        "provider-devices"           : "provider_devices",
        "provider-reports"           : "provider_reports",
        "login-implementation"       : "login_implementation",
        "captcha-implementation"     : "captcha_implementation",
    //Partner menu
        "partner-how"                : "partner_how",
        "partner-apply"              : "partner_apply",
        "partner-resources"          : "partner_resources",
        "partner-support"            : "partner_support",

        "*other"                     : "page_404"
    },
    //Home menu
    //Note: implement header cashing
    initialize: function () {
        
    },
    home: function () {
        this.main_navigation('home-menu'); 
        if (!this.homeView) this.homeView = new App.Views.Home();
        $('#content').html(this.homeView.el);
        $('body').children(".container").addClass('extraWidth');
        this.footer();
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
    apis: function () {
        this.main_navigation('apis-menu');
        if (!this.apisView) this.apisView = new App.Views.Apis();
        $('#content').html(this.apisView.el);
        this.footer();
    },
    contact: function () {
        this.main_navigation('contact-menu');
        if (!this.contactView) this.contactView = new App.Views.Contact();
        $('#content').html(this.contactView.el);
        this.footer();
    },
	login: function() {
        this.main_navigation('home-menu');
		if (!this.loginModel) this.loginModel = new App.Models.Login();
        if (!this.loginView) this.loginView = new App.Views.Login({model: this.loginModel});
        this.loginView.render();
        this.footer();
	},
    signup: function(type) {
        this.main_navigation('home-menu');
        if (!this.signupModel) this.signupModel = new App.Models.Signup();
        if (!this.signupView) this.signupView = new App.Views.Signup({model: this.signupModel});
        this.signupView.render(type);
        this.footer(); 
    },
    reset: function(type) {
        this.main_navigation('home-menu');
        var model = new App.Models.ResetPassword();
        var view = new App.Views.ResetPassword({model: model});
        this.footer();
    },
    settings: function(type) {
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
    user_fingerprints: function () {
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
        this.interface_navigation('User', 'user-bio-menu');
        if (!this.userFaceModel) this.userFaceModel = new App.Models.UserPersonalInfo();
        if (!this.userFaceView) this.userFaceView = new App.Views.UserFace({model: this.userFaceModel});
        var that = this;
        this.userFaceModel.url = App.Url + '/users/' + window.profileId;
        this.userFaceModel.fetch({
            success: function () {
                that.userFaceView.render();
            }
        });
        this.footer();
    },
    user_iris: function () {
        this.interface_navigation('User', 'user-bio-menu');
        if (!this.irisView) this.irisView = new App.Views.UserIris();
        this.irisView.render();
    },
    user_voice: function () {
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
        this.interface_navigation('User', 'user-websites-menu');
        if (!this.websitesView) this.websitesView = new App.Views.UserWebsites();
        this.websitesView.render();
        this.footer();
    },
    user_reports: function () {
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
    login_implementation: function () {
        this.interface_navigation('Provider', 'login-implementation-menu');
        if (!this.loginImplementationView) this.loginImplementationView = new App.Views.LoginImplementation();
        this.loginImplementationView.render();
        this.footer();
    },
    captcha_implementation: function () {
        this.interface_navigation('Provider', 'captcha-implementation-menu');
        if (!this.captchaImplementationView) this.captchaImplementationView = new App.Views.CaptchaImplementation();
        this.captchaImplementationView.render();
        this.footer();
    },
    //Partner menu
    partner_how: function () {
        this.interface_navigation('Partner', 'partner-how-menu');
        if (!this.partnerHowView) this.partnerHowView = new App.Views.PartnerHow();
        this.partnerHowView.render();
        this.footer();
    },
    partner_apply: function () {
        this.interface_navigation('Partner', 'partner-apply-menu');
        if (!this.partnerApplyView) this.partnerApplyView = new App.Views.PartnerApply();
        this.partnerApplyView.render();
        this.footer();
    },
    partner_resources: function () {
        this.interface_navigation('Partner', 'partner-resources-menu');
        if (!this.partnerResourcesModel) this.partnerResourcesModel = new App.Models.PartnerResources();
        if (!this.partnerResourcesView) this.partnerResourcesView = new App.Views.PartnerResources({model: this.partnerResourcesModel});
        this.partnerResourcesView.render();
        this.footer();
    },
    partner_support: function () {
        this.interface_navigation('Partner', 'partner-support-menu');
        if (!this.partnerSupportView) this.partnerSupportView = new App.Views.PartnerSupport();
        this.partnerSupportView.render();
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
        if (menu_item != 'contact-menu' && menu_item != 'about-menu') {
            $.ajax({
                url: 'php/splash.php',
                method: 'POST',
                data: {check: 1},
                success: function(data) {
                    if (data == '') {
                        if (!window.splashView) window.splashView = new App.Views.Splash();
                        window.splashView.render();
                        $('.footer').addClass('hide');
                        $('.container').addClass('hide');
                        $('.header .container').removeClass('hide');
                        $('.splash-footer').removeClass('hide');
                        $('#login').addClass('hide');
                    } else {
                    }
                }
            });
        }
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
        else if (type == 'PARTNER') $('#partner_header').addClass('hide');
    },
    footer: function() {
        //footer
        if (!this.footerView) this.footerView = new App.Views.Footer();
        this.footerView.render();
    },
    page_404: function () {
        this.main_navigation('home-menu'); 
        if (!this.page404View) this.page404View = new App.Views.Page404();
        $('#content').html(this.page404View.el);
        $('body').children(".container").addClass('extraWidth');
        this.footer();
    },

});

$(document).ready(function() {
    // Main element: gets user ID and starts the router history
    $.post('php/login.php', 
    {   cmd : 'is_loged_in'
    },
    function(data) {
        if (data != '') {
            window.profileName = data.username;
            window.profileId = data.id;
            window.profileApiId = data.api_id;
            window.profileType = data.type;

            var app = new AppRouter();
            Backbone.history.start();
        }
    },"json");
    // END of main element
});

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

function message(type, bold, text) {
    var alert = '<div class="text-center alert alert-dismissable alert-' + type + '">' +
                '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
                '<strong>' + bold + '</strong> ' + text +
            '</div>';
    $('#alert').html(alert);

    setTimeout(function() {
        $('#alert').html('');
    }, 5000);
}

function set_cookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function get_yourself_a_cookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
} 

$(document).on('click touchend', "#fade, .close-box", function () {    
    $('.white_content').addClass('hide');
    $('.black_overlay').addClass('hide');
    $('.content-div').html('');
});

function get_browser_info() {
    var unknown = '-';

    // screen
    var screenSize = '';
    if (screen.width) {
        width = (screen.width) ? screen.width : '';
        height = (screen.height) ? screen.height : '';
        screenSize += '' + width + " x " + height;
    }

    //browser
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browser = navigator.appName;
    var version = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // Opera
    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
        browser = 'Opera';
        version = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
        browser = 'Chrome';
        version = nAgt.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
        browser = 'Safari';
        version = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf('Version')) != -1) {
            version = nAgt.substring(verOffset + 8);
        }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
        browser = 'Firefox';
        version = nAgt.substring(verOffset + 8);
    }
    // MSIE 11+
    else if (nAgt.indexOf('Trident/') != -1) {
        browser = 'Microsoft Internet Explorer';
        version = nAgt.substring(nAgt.indexOf('rv:') + 3);
    }
    // Other browsers
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browser = nAgt.substring(nameOffset, verOffset);
        version = nAgt.substring(verOffset + 1);
        if (browser.toLowerCase() == browser.toUpperCase()) {
            browser = navigator.appName;
        }
    }
    // trim the version string
    if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

    majorVersion = parseInt('' + version, 10);
    if (isNaN(majorVersion)) {
        version = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    // mobile version
    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

    // cookie
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;

    if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
    }

    // system
    var os = unknown;
    var clientStrings = [
        {s:'Windows 3.11', r:/Win16/},
        {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
        {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
        {s:'Windows 98', r:/(Windows 98|Win98)/},
        {s:'Windows CE', r:/Windows CE/},
        {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
        {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
        {s:'Windows Server 2003', r:/Windows NT 5.2/},
        {s:'Windows Vista', r:/Windows NT 6.0/},
        {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
        {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
        {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
        {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
        {s:'Windows ME', r:/Windows ME/},
        {s:'Android', r:/Android/},
        {s:'Open BSD', r:/OpenBSD/},
        {s:'Sun OS', r:/SunOS/},
        {s:'Linux', r:/(Linux|X11)/},
        {s:'iOS', r:/(iPhone|iPad|iPod)/},
        {s:'Mac OS X', r:/Mac OS X/},
        {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
        {s:'QNX', r:/QNX/},
        {s:'UNIX', r:/UNIX/},
        {s:'BeOS', r:/BeOS/},
        {s:'OS/2', r:/OS\/2/},
        {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
    ];
    for (var id in clientStrings) {
        var cs = clientStrings[id];
        if (cs.r.test(nAgt)) {
            os = cs.s;
            break;
        }
    }

    var osVersion = unknown;

    if (/Windows/.test(os)) {
        osVersion = /Windows (.*)/.exec(os)[1];
        os = 'Windows';
    }

    switch (os) {
        case 'Mac OS X':
            osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
            break;

        case 'Android':
            osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
            break;

        case 'iOS':
            osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
            osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
            break;
    }

    // flash (you'll need to include swfobject)
    /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
    var flashVersion = 'no check';
    if (typeof swfobject != 'undefined') {
        var fv = swfobject.getFlashPlayerVersion();
        if (fv.major > 0) {
            flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
        }
        else  {
            flashVersion = unknown;
        }
    }

    var info = {
                screen: screenSize,
                browser: browser,
                browserVersion: version,
                mobile: mobile,
                os: os,
                osVersion: osVersion,
                cookies: cookieEnabled,
                flashVersion: flashVersion
            };
    return info;
}

function enable_media(source){
    var info = get_browser_info();
    var os = info.os;
    var browser = info.browser;
    console.log('OS detected: ' + os);
    console.log('Browser detected: ' + browser);

    var head;

    if (os == 'Windows') {

        if (browser == 'Firefox') head = 'windows-firefox-allow';
        else if (browser == 'Chrome') head = 'windows-chrome-allow';
        else if (browser == 'Opera') head = 'windows-opera-allow';
        else return; // return if OS is Windows and browser is not Chrome, Opera, or Firefox

    } else if (os == 'Mac OS X') {

        if (browser == 'Firefox') head = 'mac-firefox-allow';
        else if (browser == 'Chrome') head = 'mac-chrome-allow';
        else if (browser == 'Opera') head = 'mac-opera-allow';
        else return; // return if OS is Mac and browser is not Chrome, Opera, or Firefox

    } else {
        return; // return if not Mac or Windows
    }

    var message = '<div class="' + head + ' media-allow alert alert-info">' +
                        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
                        '<strong> Please click <img height="30" src="img/' + head + '.png"> to enable ' + source + ' <strong>' +
                    '</div>';

    $('.enable-media').html(message).removeClass('hide');
    setTimeout(function() {
        $('.enable-media').addClass('hide');
    }, 10000);
}

function add_progress(size, div) {
    var progress = '<div class="' + size + '-progress"><img src="img/' + size + '-progress.gif"></div>';
    $(div).append(progress);
}

function remove_progress() {
    $('.progress-animation').remove();
}

function temporary_fade_out() {
    setTimeout(function() {
        $('.temporary_highlight').remove();
    }, 1000);
}