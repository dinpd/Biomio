App.Views.User = Backbone.View.extend({
	el: $("#content"),
	initialize:function () {
	},
	render:function () {
		if (this.model.id) {
		    var template = render('UserView', this.model.toJSON());
		    this.$el.html( template );
		    that = this;
		    var time = new Date().getTime();
	        $.ajax({
	            url: 'profileData/profilePicture/' + that.model.get('name') + '.jpg',
	            success: function (data) {
	                $('#user_image_preview').html('<img id="user_image" class="col-sm-12" style="border-radius:5px;" src ="profileData/profilePicture/' + that.model.get('name') + '.jpg?' + time +'">');
	            },
	            error: function (data) {
	                $('#user_image_preview').html('<img id="user_image" class="col-sm-12" style="border-radius:5px;" src ="images/smallLogo.png">');
	            }
	        });

		} else {
			window.location.hash = 'not-found';
		}
	},
});