//View for one Fingerprint
App.Views.UserFingerprints = Backbone.View.extend({
    el: $("body"),
    finger: 0,
    initialize: function () {
        //this.model.on('change', this.render, this);
    },
    render: function () {
        var template = render('UserFingerprintsView', this.model.toJSON());
        $("#content").html( template );
    },
    events: {
        'click .finger'         : 'trainFingerprint',
        'click .black_overlay'  : 'done',
        'click .close-box'      : 'done',
        'change #finger_status' : 'updateStatus'
    },
    trainFingerprint: function (e) {
        var element = $(e.currentTarget);
        var id = element.attr('id');
        e.preventDefault();
             if (id == "LEFTTHUMB") {var hand = "LEFT"; var finger = "THUMB"; this.finger = 0; alert("multiple fingerprints are not supported")}
        else if (id == "LEFTINDEX") {var hand = "LEFT"; var finger = "INDEX"; this.finger = 1; alert("multiple fingerprints are not supported")}
        else if (id == "LEFTMIDDLE") {var hand = "LEFT"; var finger = "MIDDLE"; this.finger = 2; alert("multiple fingerprints are not supported")}
        else if (id == "LEFTRING") {var hand = "LEFT"; var finger = "RING"; this.finger = 3; alert("multiple fingerprints are not supported")}
        else if (id == "LEFTPINKY") {var hand = "LEFT"; var finger = "PINKY"; this.finger = 4; alert("multiple fingerprints are not supported")}
        else if (id == "RIGHTTHUMB") {var hand = "RIGHT"; var finger = "THUMB"; this.finger = 5; alert("multiple fingerprints are not supported")}
        else if (id == "RIGHTMIDDLE") {var hand = "RIGHT"; var finger = "MIDDLE"; this.finger = 7; alert("multiple fingerprints are not supported")}
        else if (id == "RIGHTRING") {var hand = "RIGHT"; var finger = "RING"; this.finger = 8; alert("multiple fingerprints are not supported")}
        else if (id == "RIGHTPINKY") {var hand = "RIGHT"; var finger = "PINKY"; this.finger = 9; alert("multiple fingerprints are not supported")}
        else if (id == "RIGHTINDEX") {var hand = "RIGHT"; var finger = "INDEX"; this.finger = 6;

            var template = render('forms/RegisterFingeprintCam', {});
            $(".content-div").html( template );

            $('#file-input').change(register_uploadSelected);
            $('body').addClass('camerasetup');
            register_startCamera();

            $('#hand-position').html(hand);
            $('#finger-position').html(finger);
            $('#first-name').html(window.profileName);

            register_parseHash();
            $('#start-registration').click(register_startRegistration);
            $('#stop-registration').click(register_stopRegistration);

            $('.white_content').removeClass('hide');
            $('.black_overlay').removeClass('hide');

        }
    },
    done: function(){

        $('.white_content').addClass('hide');
        $('.black_overlay').addClass('hide');
        $('.content-div').html('');

        stopSnapshots();
        register_stopSnapshots();

        var status = $('#finger_status').val();

        if(this.model.get('fingerprints')[this.finger] <= status && status != 0) {
            this.model.get('fingerprints')[this.finger] = status;
            var that = this;
            this.model.save({fingeprints: this.model.get('fingerprints')}, {
                success: function (data) {
                    if (status == 1) 
                        message('warning', 'Success: ', 'Fingerprint is registered with an error');
                    else if (status == 2)
                        message('success', 'Success: ', 'Fingerprint is successfully registered');
                    that.render();
                },
                error: function (data) {
                }
            });
        }
    },
    updateStatus: function() {
        var status = $('#finger_status').val();
        var fingeprints = this.model.get("fingerprints");
        
        if(fingerprints[this.finger] < status) {
            fingerprints[this.finger] = status;
            alert(status);
            this.model.save({fingeprints: fingerprints}, {
                success: function (data) {
                    alert(status);
                    if (status == 1) 
                        message('success', 'Success: ', 'Fingerprint is registered with error');
                    else if (status == 2)
                        message('success', 'Success: ', 'Fingerprint is registered successfully');
                },
                error: function (data) {
                }
            });
        }
    }
});
