App.Views.ProviderApi = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
    },
    render:function () {
        var template = render('ProviderAPIView', {});
        this.$el.html( template );
        this.get_api_keys();
    },
    events: {
      'click .generate-keys': 'generate_keys',
      'click .delete-api-key': 'delete_key',
    },
    get_api_keys:function () {
    	var that = this;
    	$.ajax({
            type: 'POST',
            url: '../php/login.php',
            dataType: "json",
            data: {cmd: "get_api_keys"},
            success: function(data) {
                if (data != null)
                	jQuery.each(data, function(i, keys) {
                        that.render_key(keys.pub);
                    });
            }
        });
    },
    render_key:function(pub) {
    	var text =  '<tr key="' + pub + '">' +
	                	'<td>' + pub + '</td>' +
	                	'<td><button type="button" class="close delete-api-key" aria-hidden="true">&times;</button></td>' +
	                '</tr>';
        $('.api-keys').prepend(text); 
    },
    generate_keys:function () {
    	var that = this;
    	$.ajax({
            type: 'POST',
            url: '../php/login.php',
            dataType: "json",
            data: {cmd: "generate_api_key"},
            success: function(data) {
                $('.new-key').removeClass('hide');
                $('.new-key .pub').text(data.pub);
                $('.new-key .priv').text(data.priv);
                that.render_key(data.pub);
            }
        });
    },
    delete_key:function (e) {
    	$that = $(e.target).closest('tr');
    	var key = $that.attr('key');
    	
    	$.ajax({
            type: 'POST',
            url: '../php/login.php',
            data: {cmd: "delete_api_key", key: key},
            success: function(data) {
            	if (data == '#success')
                	$that.remove();
            }
        });
    }
});


