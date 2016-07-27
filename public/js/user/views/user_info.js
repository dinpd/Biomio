App.Views.UserPersonalInfo = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
        //this.model.on('change', this.render, this);
    },
    render:function () {
        var template = render('UserPersonalInfoView', this.model.toJSON());
        this.$el.html( template );
        var time = new Date().getTime();
        $.ajax({
            url: 'profileData/profilePicture/' + window.profileId + '.jpg',
            success: function (data) {
                $('#user_image_preview').html('<img id="user_image" class="col-sm-12" style="padding: 0px" src ="profileData/profilePicture/' + window.profileId + '.jpg?' + time +'">');
                $("#user_image_delete").removeClass('disabled');
            },
            error: function (data) {
                $('#user_image_preview').html('<img id="user_image" class="col-sm-12" style="padding: 0px" src ="img/smallLogo.png">');
            }
        });

        this.get_user_phones();
        this.get_user_emails();
    },
    events: {
        //profile handling
        'click .user-update-info': 'updateInfo',
        'click .user-save-changes': 'saveChanges',
        'click .edit-name': 'edit_name',
        'click .save-name': 'save_name',
        'click .user-cancel-changes': 'cancelChanges',
        'change .user-geolocation': 'geolocation',
        //webcam image upload
        "click #user_image_webcam": "camera",
        "click #user_info_snap": "snap",
        "click #user_info_snap_again": "again",
        "click #user_info_snap_save": "save",
        "click .webcam_overlay": "done",
        //phones
        "keyup .phone-number .country-code"  : "verify_country_code",
        "keyup .phone-number .region-code"   : "verify_region_code",
        "keyup .phone-number .first-part"    : "verify_first_part",
        "keyup .phone-number .second-part"   : "verify_second_part",

        "click .request-phone-code"  :  "request_phone_code",
        "click .verify-phone"        :  "verify_phone",
        "click .registered-number button" :  "delete_phone",

        //emails
        "click .user-emails .add-email"                  : "add_email",
        "click .user-emails .profile-email .verify" : "send_email_verification_code",
        "click .user-emails .form-2-2 button"         : "verify_email",
        "click .user-emails .profile-email .remove" : "delete_email",
    },
    edit_name: function (e) {
        e.preventDefault();
        $(".content").addClass('hide');
        $(".form").removeClass('hide');
        $('.edit-name').addClass('hide');
        $('.save-name').removeClass('hide');
    },
    save_name: function (e) {
        e.preventDefault();

        var first_name = $('#firstName').val();
        var last_name = $('#lastName').val();

        if (first_name.length < 2 || first_name.length > 10) {
            message('danger', 'Error: ', "First name should be at least 2 symbols or less than 10 symbols");
        } else if (last_name.length < 2 || last_name.length > 10) {
            message('danger', 'Error: ', "Last name should be at least 2 symbols or less than 10 symbols");
        }else {
            $.ajax({
                type: 'POST',
                //url: 'php/login.php',
                url: '/login/update_name',
                data: {cmd: "update_name", first_name: first_name, last_name: last_name},
                success: function(data) {
                    if (data == '#success') {
                        message('danger', 'Success: ', 'name has been successfully updated');

                        window.profileFirstName = first_name;
                        window.profileLastName = last_name;

                        if ((window.profileFirstName == null && window.profileLastName == null) || (window.profileFirstName == '' && window.profileLastName == ''))
                        { $('.profile').html('User'); $('#span_name').html('<p class="content small-align">no information</p>'); }
                        else if (window.profileFirstName == null || window.profileFirstName == '')
                        { $('.profile').html(window.profileLastName); $('#span_name').html(window.profileLastName); }
                        else if (window.profileLastName == null || window.profileLastName == '')
                        { $('.profile').html(window.profileFirstName); $('#span_name').html(window.profileFirstName); }
                        else
                        { $('.profile').html(window.profileFirstName + ' ' + window.profileLastName); $('#span_name').html(window.profileFirstName + ' ' + window.profileLastName); }
                    } else
                        message('danger', 'Error: ', 'reload the page and try again');

                    $(".form").addClass('hide');
                    $(".content").removeClass('hide');
                    $('.save-name').addClass('hide');
                    $('.edit-name').removeClass('hide');

                }
            });
        }

    },
    updateInfo: function (e) {
        e.preventDefault();
        $(".content").addClass('hide');
        $(".form").removeClass('hide');

        this.generateLocationList(6295630,'continent','continent'); //get list of continents to start geolocation
        
        var education = this.model.get('education'); // select real education from the list
        $("#education option").filter(function() { return this.text == education; }).attr('selected', true);
    },
    //save changes for the whole form
    saveChanges: function (e) {
        e.preventDefault();
        var firstName  = $('#firstName').val();
        var lastName   = $('#lastName').val();
        var motto      = $('#motto').val();
        var bday       = $('#bday').val();
        var occupation = $('#occupation').val();
        var education  = $('#education').val();

        var street1   = $('#address_street1').val();
        var street2   = $('#address_street2').val();
        var continent = $('#continent option:selected').text();
            if (continent.search('Select ') != -1 || continent.search('No Data ') != -1) continent = '';
        var country   = $('#country option:selected').text();
            if (country.search('Select ') != -1 || country.search('No Data ') != -1) country = '';
        var province  = $('#province option:selected').text();
            if (province.search('Select ') != -1 || province.search('No Data ') != -1) province = '';
        var region    = $('#region option:selected').text();
            if (region.search('Select ') != -1 || region.search('No Data ') != -1) region = '';
        var city      = $('#city option:selected').text();
            if (city.search('Select ') != -1 || city.search('No Data ') != -1) city = '';
        var postcode  = $('#address_postcode').val();

        var facebook = $('#facebook').val();
        var twitter  = $('#twitter').val();
        var linkedin = $('#linkedin').val();
        var google   = $('#google').val();

        var user_array = {firstName: firstName, lastName: lastName, motto: motto, 
                address: {"street1": street1, "street2": street2, "continent": continent, 
                "country": country, "province": province, "region": region, "city": city, 
                "postcode": postcode}, education: education, 
                occupation: occupation, bday: bday, socialBar: {"facebook": facebook, 
                "twitter": twitter, "linkedin": linkedin, "google": google}};

        console.log(this.model);

        //Update model
        this.model.save(user_array, {
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
    },
    geolocation: function (e) {
        var location = $(e.currentTarget).attr("id");
        var id = $("#" + location).val();
        var postTo;

        //get the name of the next category and clear every smaller category for new data
        if (location == 'continent') {
            postTo = 'country';
            $('#country, #province, #region, #city').html('');
        } else if (location == 'country') {
            postTo = 'province';
            $('#province, #region, #city').html('');
        } else if (location == 'province') { 
            postTo = 'region';
            $('#region, #city').html('');
        } else if (location == 'region') { 
            postTo = 'city';
            $('#city').html('');
        }
        this.generateLocationList(id, location, postTo);
    },
    generateLocationList: function (id, location, postTo) {
        that = this;
        if (id != '') {
            var url = "http://www.geonames.org/childrenJSON?geonameId="+id;
            $.post(url, function(data) {
                //check if data is not empty
                if (data.status || data['totalResultsCount'] == 0) {
                    $('#' + postTo).append('<option value="">No Data Available</option>')
                } else {
                    $('#' + postTo).append('<option value="">Select ' + postTo + '</option>')
                    for(var i = 0; i < data.geonames.length; i++) {
                        $('#' + postTo).append('<option value="' + data.geonames[i]['geonameId'] + '">' + data.geonames[i]['name'] + '</option>')
                    }
                    //for the first run we select values from the profile
                    if (location == postTo) {
                        var address = that.model.get('address');
                        if (address[location] == '') return;


                        $("#" + location + " option").filter(function() { return this.text == address[location]; }).attr('selected', true);
                        var newId = $("#" + location + " option:selected").val();
                        if (location == 'continent') location = 'country';
                        else if (location == 'country') location = 'province';
                        else if (location == 'province') location = 'region';
                        else if (location == 'region') location = 'city';

                        that.generateLocationList(newId, location, location);
                    }
                }
            },"json");
        }
    },
    camera: function(){
        $('.webcam_content, .webcam_overlay').removeClass('hide');

        this.canvas = document.getElementById("user_info_canvas"),
        context = this.canvas.getContext("2d"),
        video = document.getElementById("user_info_video"),
        videoObj = { "video": true },
        errBack = function(error) {
            console.log("Video capture error: ", error.code); 
        };

        if(window.navigator.getUserMedia) {
            window.navigator.getUserMedia(videoObj, function(stream) {
                video.src =window.URL.createObjectURL(stream);
            }, errBack );
        }
        else if(window.navigator.mozGetUserMedia) {
            window.navigator.mozGetUserMedia(videoObj, function(stream) {
                video.mozSrcObject = stream;
            }, errBack );
        }
        else if(window.navigator.webkitGetUserMedia) {
            window.navigator.webkitGetUserMedia(videoObj, function(stream) {
                video.src =window.webkitURL.createObjectURL(stream);
            },  errBack );
        }
    },
    done: function(){
        $('.webcam_content, .webcam_overlay').addClass('hide');

        if(window.navigator.getUserMedia) {
            video.pause();
            video.src=null;
        } 
        else if(window.navigator.mozGetUserMedia) {
            video.pause();
            video.mozSrcObject=null;
        }
        else if(window.navigator.webkitGetUserMedia) {
            video.pause();
            video.src="";
        }  
    },
    snap: function(){
        var context = this.canvas.getContext("2d");
        context.drawImage(video, 140, 0, 640, 480, 0, 0, 640, 480);
        $("#user_info_video").addClass('hide');
        $("#user_info_canvas").removeClass('hide');
        $("#user_info_snap").addClass('hide');
        $("#user_info_snap_again, #user_info_snap_save").removeClass('hide');
    },
    save: function(){
        // Generate the image data
        var image = document.getElementById("user_info_canvas").toDataURL("image/png");
        var image_to_server = image.replace(/^data:image\/(png|jpg);base64,/, "")

        var formdata = new FormData();
        formdata.append("file", image_to_server);
        formdata.append("user", window.profileId);
        formdata.append("cmd", 'profilePictureWebcam');

        that = this;
        that.done();
        
        $.ajax({
            //url:"php/uploadPicture.php",
            url:"/upload/profilePictureWebcam",
            type: "POST",
            data: formdata,
            processData:false,
            contentType:false,
            success:function(data){    
                $("#user_info_video").removeClass('hide');
                $("#user_info_canvas").addClass('hide');
                $("#user_info_snap").removeClass('hide');
                $("#user_info_snap_again, #user_info_snap_save").addClass('hide'); 

                $('#user_image_progress').css("color","green");
                $('#user_image_progress').text("Upload Success!");

                var image = new Image();
                image.src = that.canvas.toDataURL("image/png");
                $("#user_image_preview").html(image);
                $("#user_image_preview img").addClass("col-sm-12").css("border-radius", "5px");
                $("#user_image_preview img").css("padding", "0");
                
                $("#user_image_delete").removeClass('disabled');
            }
        });
    },
    again: function(){
        $("#user_info_video").removeClass('hide');
        $("#user_info_canvas").addClass('hide');
        $("#user_info_snap").removeClass('hide');
        $("#user_info_snap_again, #user_info_snap_save").addClass('hide');
    },

    // Emails
    get_user_emails: function () {
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/get_user_emails',
            dataType: "json",
            data: {cmd: "get_user_emails", extention: 0},
            success: function(data) {
                if (data != null)
                    jQuery.each(data, function(i, email) {
                        var template = render('forms/ProfileEmail', {id: email.id, email: email.email, verified: email.verified, primary: email.primary, extention: email.extention});
                        $('.profile-emails').append(template); 
                    });
            }
        });
    },
    add_email: function (e) {
        e.preventDefault();
        that = this;
        var email = $('.new-email').val();
        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;
        email_check = emailRegex.test(email)
        console.log(email);
        if (!email_check) message('danger', 'Error: ', "Email is in a wrong format");
        else 
            $.ajax({
                type: 'POST',
                //url: 'php/login.php',
                url: '/login/add_email',
                data: {cmd: "add_email", email: email},
                success: function(data) {
                    $('.new-email').val('');

                    var template = render('forms/ProfileEmail', {id: data, email: email, verified: 0, primary: 0, extention: 0});
                    $('.profile-emails').append(template); 
                    $('.profile-emails .form').removeClass('hide');
                }
            });
    },
    send_email_verification_code: function (e) {
        e.preventDefault();

        $that = $(e.target).closest('.profile-email');
        var email = $that.find('p').text();
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/send_email_verification_code',
            data: {cmd: "send_email_verification_code", email: email},
            success: function(data) {
                if (data == '#success') {
                    $('.form-2-2 p strong').text(email);
                    $('.form-2-2').removeClass('hide');
                } else {
                    message('danger', 'Error: ', "please reload the page and try again"); 
                }
            }
        });
    },
    verify_email: function (e) {
        e.preventDefault();
        $that = $('.form-2-2');
        var email = $that.find('p strong').text();
        var code = $that.find('input').val();
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/verify_email',
            data: {cmd: "verify_email", email: email, code: code},
            success: function(data) {
                if (data == '#success') {
                    $('.form-2-2').addClass('hide');
                    $('.profile-email').each(function() {
                        if ($(this).find('.profile-email-name p').text() == email) {
                            $(this).find('.verify').addClass('hide');
                            $(this).find('.verified').removeClass('hide');
                        }
                    });
                } else {
                    message('danger', 'Error: ', "The code is wrong or expired");
                }
            }
        });
    },
    delete_email: function (e) {
        $that = $(e.target).closest('.profile-email');
        var email = $that.find('p').text();
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/delete_email',
            data: {cmd: "delete_email", email: email},
            success: function(data) {
                $that.remove();
            }
        });
    },
    // Phones
    get_user_phones: function (e) {
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/get_phones',
            dataType: "json",
            data: {cmd: "get_phones"},
            success: function(data) {
                if (data.length != 0) {
                    $('.registered').removeClass('hide');
                    jQuery.each(data, function(i, phone) {
                        var text =  '<div class="registered-number col-sm-12">' +
                                        '<div class="number col-sm-10 text-left">' + phone + '</div>' +
                                        '<div class="delete col-sm-2 text-left form hide"><button type="button" class="close" aria-hidden="true">&times;</button></div>' +
                                    '</div>';
                        $('.registered-numbers').append(text);
                    });
                } else $('.not-registered').removeClass('hide');
            }
        });
    },
    verify_region_code: function (e) {
        var phone = $('.region-code').val();
        phone = phone.replace(/\D/g,'');
        $('.region-code').val(phone);

        if (phone.length == 3) $('.first-part').focus();
    },
    verify_first_part: function (e) {
        var phone = $('.first-part').val();
        phone = phone.replace(/\D/g,'');
        $('.first-part').val(phone);

        if (phone.length == 3) $('.second-part').focus();
    },
    verify_second_part: function (e) {
        var phone = $('.second-part').val();
        phone = phone.replace(/\D/g,'');
        $('.second-part').val(phone);

    },
    request_phone_code: function (e) {
        e.preventDefault();
        var phone = String($('.country-code').val()) + String($('.region-code').val()) + String($('.first-part').val()) + String($('.second-part').val());
        $('.invalid-code').addClass('hide');
        if (phone.length < 11) message('danger', 'Error: ', 'phone is in wrong format');
        else 
            $.ajax({
                type: 'POST',
                //url: 'php/login.php',
                url: '/login/send_phone_verification_code',
                data: {cmd: "send_phone_verification_code", phone: phone},
                success: function(data) {
                    if (data = "#success") {
                        $('.phone-step-2').removeClass('hide');
                        $('.invalid-code input').val('');
                    } else $('.error').removeClass('hide');
                }
            });
    },
    verify_phone: function (e) {
        e.preventDefault();
        var code = $('.phone-code').val();
        if (code.length > 0)
            $.ajax({
                type: 'POST',
                //url: 'php/login.php',
                url: '/login/verify_phone_code',
                data: {cmd: "verify_phone_code", code: code},
                success: function(data) {
                    if (data != 0) {
                        $('.registered').removeClass('hide');
                        $('.not-registered').addClass('hide');
                        
                        var text =  '<div class="registered-number col-sm-12">' +
                                        '<div class="number col-sm-10 text-left">' + data + '</div>' +
                                        '<div class="delete col-sm-2 text-left form"><button type="button" class="close" aria-hidden="true">&times;</button></div>' +
                                    '</div>';
                        $('.registered-numbers').append(text);
                                    
                        $('.invalid-code').addClass('hide');
                        $('.phone-step-2').addClass('hide');

                        $('.region-code').val('');
                        $('.first-part').val('');
                        $('.second-part').val('');
                        $('.phone-code').val('');


                    } else $('.invalid-code').removeClass('hide');
                }
            });
    },
    delete_phone: function (e) {
        e.preventDefault();
        $this = $(e.currentTarget).closest('.registered-number');
       
        $this.remove();
        var number = $this.find('.number').text()
        console.log(number);
        $.ajax({
            type: 'POST',
            //url: 'php/login.php',
            url: '/login/delete_phone',
            data: {cmd: "delete_phone", number: number},
            success: function(data) {
                $this.remove();

                var count = 0;
                $('.registered-number').each(function() {
                    count ++;
                });
                if (count == 0) {
                    $('.not-registered').removeClass('hide');
                    $('.registered').addClass('hide');
                }
            }
        });
    },
});

var current;
function userTriggerImageUpload () {
    $("#user_image_input").trigger('click');
}
function userPreviewImage (fileInput) {
    save = true;
    var files = fileInput.files;
    var file = files[0];
    current = file;
    var imageType = /image.*/;
    var img = document.createElement("img");
    
    img.classList.add("obj");
    img.classList.add("preview");
    img.file = file;

    var reader = new FileReader();
    reader.onload = (function(aImg) { 
        return function(e) { 
            aImg.src = e.target.result; 
        }; 
    })(img);
    reader.readAsDataURL(file);
      
    $("#user_image_preview").html(img);
    $("#user_image_preview img").addClass("col-sm-12").css("border-radius", "5px");
    $("#user_image_save").removeClass('disabled');
}
function userSaveImage () {
    var reader;
    if(window.FileReader){
        reader = new FileReader();
        reader.readAsDataURL(current);
    }
    var formdata = new FormData();
    formdata.append("file", current);
    formdata.append("user", window.profileId);
    formdata.append("cmd", 'profilePictureUpload');

    $.ajax({
        //url:"php/uploadPicture.php",
        url:"/upload/profilePictureUpload",
        type: "POST",
        data:formdata,
        processData:false,
        contentType:false,
        success:function(data){
            if(data == "Success"){          
                $('#user_image_progress').css("color","green");
                $('#user_image_progress').text("Upload Success!");
                $("#user_image_delete").removeClass('disabled');
            }
            else{
                $('#user_image_progress').text("File size must be less than 3 mB.");
                $('#user_image_progress').css("color","red");
            }
        }
    });
}
function userDeleteImage () {
    var formdata = new FormData();
    formdata.append("user", window.profileId);
    formdata.append("cmd", 'profilePictureDelete');

    $.ajax({
        //url:"php/uploadPicture.php",
        url:"/upload/profilePictureDelete",
        type: "POST",
        data:formdata,
        processData:false,
        contentType:false,
        success:function(data){
            if(data == "Success"){          
                $('#user_image_progress').css("color","green");
                $('#user_image_progress').text("Delete Success!");
                $('#user_image_preview').html('<img id="user_image" class="col-sm-12" style="padding: 0px" src ="profileData/default-portrait.jpg">');
                $("#user_image_delete").addClass('disabled');
            }
            else{
                $('#user_image_progress').text("Server error. Something is wrong.");
                $('#user_image_progress').css("color","red");
            }
        }
    });
}