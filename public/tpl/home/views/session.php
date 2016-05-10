App.Views.Contact = Backbone.View.extend({
    captcha: 0,
    initialize:function () {
        this.render();
    },
    render:function () {
        $("#content").html( render('ContactView', {}) );
        //this.captcha_get_image();
    },
    events: {
        //"click #contact_submit": "submit",
        //"click #captcha_refresh": "captcha_get_image",
    },
    submit: function(e) {
    	e.preventDefault();
        that = this;
        alert('here');

    	var name = $("#contact_name").val();
    	var email = $("#contact_email").val();
    	var message = $("#contact_message").val();
    	var user_answer = $(".input_captcha").val();

        alert(name);
    
        $.ajax({
        //url: 'php/captcha.php',
          url: '/captcha/check_code',
          method: 'POST',
          data: {cmd: 'check_code', user_answer: user_answer, name: name, email: email, message: message},
          async: false,
          success: function(data) {
            if (data == '#success') {
                alert('You message has been successfully sent!');
                $("#contact_name").val('');
                $("#contact_email").val('');
                $("#contact_message").val('');
            } else if (data == '#captcha') {
                alert('Captcha is uncorrect');
                that.captcha_get_image();
            } else if (data == '#session') {
                alert('Captcha is expired');
                that.captcha_get_image();
            }
          }
        }); 
    },
    captcha_get_image: function() {
        $('.captcha_success').addClass('hide');
        $.ajax({
          //url: 'php/captcha.php',
          url: '/captcha/create_image',
          method: 'POST',
          data: {cmd: 'create_image'},
          async: false,
          success: function(data) {
            var img = new Image();
            img.onload = function () {
                context.drawImage(this, 0, 0, canvas.width, canvas.height);
            }
            img.src = "data:image/png;base64," + data;
            $(".image").html(img);
            $(".input_captcha").val('');
            $(".input_captcha").prop('disabled', false);
          }
        });
    }
});