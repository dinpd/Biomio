var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "signup/:type"       : "signup",
        "login"	             : "login",
//        "wines/page/:page"	: "list",
//        "wines/add"         : "addWine",
//        "wines/:id"         : "wineDetails",
        "about"             : "about",
        "apis"             : "apis"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },
    
    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!this.homeView) {
            this.homeView = new HomeView();
            this.homeView.render();
        } else {
            this.homeView.delegateEvents(); // delegate events when the view is recycled
        }
        $("#content").html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');       
        
    },

//	list: function(page) {
//        var p = page ? parseInt(page, 10) : 1;
//        var wineList = new WineCollection();
//        wineList.fetch({success: function(){
//            $("#content").html(new WineListView({model: wineList, page: p}).el);
//        }});
//        this.headerView.selectMenuItem('home-menu');
//    },

//    wineDetails: function (id) {
//        var wine = new Wine({id: id});
//        wine.fetch({success: function(){
//            $("#content").html(new WineView({model: wine}).el);
//        }});
//        this.headerView.selectMenuItem();
//    },
//
//	addWine: function() {
//        var wine = new Wine();
//        $('#content').html(new WineView({model: wine}).el);
//        this.headerView.selectMenuItem('add-menu');
//	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    },
    
    api: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    },
    
    contact: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    },
	
	login: function() {
		if (!this.loginView) {
			this.loginView = new LoginView();
		}
			
		$('#content').html(this.loginView.render().el);
	},
    
    signup: function(type) {
    	if (!this.signupView) {
    		this.signupView = new SignupView();
    	}
    	    	
    	this.signupView.setType(type);
    	$('#content').html(this.signupView.render().el);
    	
    }

});

utils.loadTemplate(['HeaderView', 'AboutView', 'HomeView', 'LoginView', 'SignupView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});