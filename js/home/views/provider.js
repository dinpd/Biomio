App.Views.Provider = Backbone.View.extend({
	el: $("#content"),
	initialize:function () {
	},
	render:function () {
		if (this.model.id) {
		    var template = render('ProviderView', this.model.toJSON());
		    this.$el.html( template );
		    that = this;
		    var time = new Date().getTime();
	        $.ajax({
	            url: 'profileData/companyLogo/' + that.model.get('name') + '.jpg',
	            success: function (data) {
	                $('#provider_image_preview').html('<img id="provider_image" class="col-sm-12" style="border-radius:5px;" src ="profileData/companyLogo/' + that.model.get('name') + '.jpg?' + time +'">');
	            },
	            error: function (data) {
	                $('#provider_image_preview').html('<img id="provider_image" class="col-sm-12" style="border-radius:5px;" src ="profileData/default-logo.png">');
	            }
	        });

		} else {
			window.location.hash = 'not-found';
		}
	},
});