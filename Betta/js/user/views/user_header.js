App.Views.UserHeader = Backbone.View.extend({
    el: $(".header"),

    initialize: function () {
        this.render();
    },

    render: function () {
        var template = render('UserHeaderView', {});
        this.$el.html( template );

        $.ajax({
            type: 'POST',
            url: 'php/updateData.php',
            data: {cmd: "is_loged_in"},
            success: function(data) {
                if (data != '') {
                    $('.profile-menu').removeClass("hide");
                    $('.profile').html(data);
                }
            }
        });
    },

    events: {
        "click .logout-menu": "logout",
    },

    logout: function (event) {
        $.ajax({
            type: 'POST',
            url: 'php/updateData.php',
            data: {cmd: "logout"},
            success: function(data) {
                if (data.search("done")!=-1)
                    window.location.href = '#';
            }
        });
    },

    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }
   
 

});