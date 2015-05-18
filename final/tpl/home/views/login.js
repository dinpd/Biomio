App.Views.Login = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('LoginView', {});
        this.$el.html( template );
    },
    events: {
        "click #log_in_submit": "submit",
        //"click .biomio-button": "verifyFingerprint",
        //"click .black-overlay": "stopSnapshots",
        /*Popup
        "click .backgroundPopup": "background",
        "mouseenter .close": "tooltipOpen",
        "mouseleave .close": "tooltipClose", 
        "click .close": "disablePopup",
        */
    },
    submit: function(e) {
        e.preventDefault();
    	var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;

        var email = $('#log_in_email').val();
        var password = $('#log_in_password').val();
        var remember=$("#log_in_remember").is(":checked");

        if (!emailRegex.test(email)) $('#log_in_span_submit').text('Email is incorrect');
		else if (password.length < 7) $('#log_in_span_submit').text('Password is not long enough');
		else {

            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                data: {cmd: "login", email: email, password: password, remember: remember},
                success: function(data) {
                    if (data == '#email') $('#log_in_span_submit').text("we don't have this email address in our system");
                    else if (data == '#password') $('#log_in_span_submit').text("password is incorrect");
                    else {
                        var data = jQuery.parseJSON( data );
                        window.profileName = data.username;
                        window.profileId = data.id;
                        window.profileApiId = data.api_id;
                        window.profileType = data.type;
                        alert('Wellcome back!')
                        if (data.type == 'USER') window.location.hash = 'user-info';
                        else if (data.type == 'PROVIDER') window.location.hash = 'provider-info';
                        else if (data.type == 'PARTNER') window.location.hash = 'partner-how';
                    }
                    //if error remove alert after 5 seconds
                    setTimeout(function() {
                        $('#log_in_span_submit').text('');
                    }, 5000);
                }
            });

        }
        //remove alert after 5 seconds
        setTimeout(function() {
            $('#log_in_span_submit').text('');
        }, 5000);
    },
    //Popup handling
    verifyFingerprint: function(){ // trigger popup
        //this.loading();
        // activate snapshots taking
        /*
        var that = this;
        setTimeout(function() {
            that.loadPopup();
        }, 500);
        return false;
        */
    },
    /*
    popupStatus: 0,
    loading: function() {
        this.$el.find(".popup").html( '' );
        this.$el.find(".loader").show();
        var template = render('forms/FingerprintsPopup', {});
        this.$el.find(".popup").html( template );
    },
    closeloading: function() {
        this.$el.find(".loader").fadeOut('normal');
    },
    loadPopup: function() {
        if(this.popupStatus == 0) { //show popup
            this.closeloading();
            this.$el.find(".toPopup").fadeIn(0500);
            this.$el.find(".backgroundPopup").css("opacity", "0.7");
            this.$el.find(".backgroundPopup").fadeIn(0001);
            this.popupStatus = 1;
        }
    },
    tooltipOpen: function() {
        this.$el.find('.ecs_tooltip').show();
    },
    tooltipClose: function() {
        this.$el.find('.ecs_tooltip').addClass('hide');
    },
    closepopup: function() {
        disablePopup();
    },
    disablePopup: function() {
        if(this.popupStatus == 1) { //close popup
            this.$el.find(".toPopup").fadeOut("normal");
            this.$el.find(".backgroundPopup").fadeOut("normal");
            this.popupStatus = 0;
        }
    }
    */
});