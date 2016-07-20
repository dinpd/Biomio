App.Views.Website = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
        this.model.on('change', this.render, this);
    },
    render:function () {
        if (this.model.id) {
            if (this.model.get('owner') == window.profileId)
                var template = render('MyWebsiteView', this.model.toJSON());
            else
                var template = render('WebsiteView', this.model.toJSON());

            this.$el.html( template );
            that = this;
            var time = new Date().getTime();
            $.ajax({
                url: 'profileData/websiteScreenshot/' + that.model.get('domains')[0] + '.png',
                success: function (data) {
                    $('#website_screenshot_preview').html('<img id="website_image" class="col-sm-12" style="padding: 0px" src ="profileData/websiteScreenshot/' + that.model.get('domains')[0] + '.png?' + time +'">');
                    $("#website_screenshot_preview").removeClass('disabled');
                },
                error: function (data) {
                    $('#website_screenshot_preview').html('<img id="website_image" class="col-sm-12" style="padding: 0px" src ="profileData/default-website.png">');
                }
            });
        } else {
            window.website.hash = 'not-found';
        }
    },
    events: {
        'click .website-update-info'   : 'updateInfo',
        'click .website-save-changes'  : 'saveChanges',
        'click .website-cancel-changes': 'cancelChanges',
        'click #website_update_picture': 'updateScreenshot',
        'click .website-checkbox [type="checkbox"]': 'categories',
    },
    updateInfo: function (e) {
        e.preventDefault();
        $(".content").addClass('hide');
        $(".form").removeClass('hide');
    },
    //save changes for the whole form
    saveChanges: function (e) {
        e.preventDefault();
        var title       = $('#title').val();
        var description = $('#description').val();

        var categories = new Array();
        $('.provider-website-checkbox [type="checkbox"]:checked').each(function() {
            categories.push(this.value);
        });

        //put
        this.model.save({ title: title, description: description, categories: categories}, {
            success: function (data) {
                message('success', 'Success: ', 'Information successfully changed');

                $(".form").addClass('hide');
                $(".content").removeClass('hide');
            },
            error: function (data) {
                message('danger', 'Error: ', data);
            }
        });
    },
    cancelChanges: function (e) {
        e.preventDefault();
        $(".form").addClass('hide');
        $(".content").removeClass('hide');
        $('#website_screenshot_preview').text('');
    },
    updateScreenshot: function (e) {
        e.preventDefault();
        that = this;
        $.ajax({
            //url: 'php/checkDomain.php',
            url: '/domain/createScreenshot',
            method: 'POST',
            data: {cmd: 'createScreenshot', domain: that.model.get('domains')[0]},
            success: function(data) {
                if (data == '') {
                    var time = new Date().getTime();
                    $('#website_screenshot_preview').html('<img id="website_image" class="col-sm-12" style="padding: 0px" src ="profileData/websiteScreenshot/' + that.model.get('domains')[0] + '.png?' + time +'">');
                } else {
                    $('#website_screenshot_progress').removeClass('green').addClass('red').text(data);
                }
            }
        });
    },
    categories: function (e) {
        if ($('.website-checkbox [type="checkbox"]:checked').length >= 5) {
            $('.website-checkbox [type="checkbox"]:not(:checked)').attr('disabled' , 'disabled');
        } else {
            $('.website-checkbox [type="checkbox"]:not(:checked)').removeAttr('disabled');
        }
    },
});