App.Views.Contact = Backbone.View.extend({
    captcha: 0,
    initialize:function () {
        this.render();
    },
    render:function () {
        $(this.el).html( render('ContactView', {}) );
        return this;

        /*
        var template = render('ContactView', {});
        this.$el.html( template );

        //captcha question
        var cap1 = Math.floor((Math.random() * 20) + 1);
        var cap2 = Math.floor((Math.random() * 20) + 1);
        $("#contact_captcha_question").html("What is " + cap1 + " + " + cap2 + "?");
        this.captcha = cap1 + cap2;
        */
    },
    events: {
        "click #contact_submit": "submit",
    },
    submit: function(e) {
    	e.preventDefault();/*
    	var name = $("#contact_name").val();
    	var email = $("#contact_email").val();
    	var message = $("#contact_message").val();
    	var captcha = $("#contact_captcha_answer").val();

    	if (this.captcha != captcha) {
    		var cap1 = Math.floor((Math.random() * 20) + 1);
	        var cap2 = Math.floor((Math.random() * 20) + 1);
	        $("#contact_captcha_question").html("What is " + cap1 + " + " + cap2 + "?");
	        this.captcha = cap1 + cap2;
	        $(".captcha-form").addClass("has-error");
	        setTimeout(function() {
                $(".captcha-form").removeClass("has-error");
            }, 5000);
    	} else {
    		var that = this;
    		$.ajax({
			    type: 'POST',
			    url: 'php/login.php',
			    data: {cmd: "contact", name: name, email: email, message: message},
			    success: function(data) {
			    	that.render();
			        alert("Thank you! Your message has been successfully sent.");
			    }
			}); 
    	}*/  
    },
});