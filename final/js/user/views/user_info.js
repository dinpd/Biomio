App.Views.UserPersonalInfo = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
        this.model.on('change', this.render, this);
    },
    render:function () {
        var template = render('UserPersonalInfoView', this.model.toJSON());
        this.$el.html( template );
        var time = new Date().getTime();
        $.ajax({
            url: 'profileData/profilePicture/' + window.profileName + '.jpg',
            success: function (data) {
                $('#user_image_preview').html('<img id="user_image" class="col-sm-12" style="padding: 0px" src ="profileData/profilePicture/' + window.profileName + '.jpg?' + time +'">');
                $("#user_image_delete").removeClass('disabled');
            },
            error: function (data) {
                $('#user_image_preview').html('<img id="user_image" class="col-sm-12" style="padding: 0px" src ="img/smallLogo.png">');
            }
        });
    },
    events: {
        //profile handling
        'click .user-update-info': 'updateInfo',
        'click .user-save-changes': 'saveChanges',
        'click .user-cancel-changes': 'cancelChanges',
        'click .user-add-email': 'addEmail',
        'change .user-geolocation': 'geolocation',
        //webcam image upload
        "click #user_image_webcam": "camera",
        "click #user_info_snap": "snap",
        "click #user_info_snap_again": "again",
        "click #user_info_snap_save": "save",
        "click .webcam_overlay": "done",
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


        //check which email is selected as primary and put it on the first position in the view
        var primary_email = $('input[name=radios]:checked').val();

        if ($("#email" + primary_email + " span .email").val() == '') {
            message('danger', 'Error: ', "Primary e-mail can't be empty");
            return;
        }
        $("#email" + primary_email).prependTo(".emails");

        //create an array with all the emails (the primary will have the id of 0)
        var count = 0;
        var emails = new Array();

        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;
        $(".email").each(function() {
            if (emailRegex.test($(this).val())) {
                emails[count] = $(this).val();
                count++;
            } else {
                $(this).closest('div').remove();
            }
        });
        //Update model
        this.model.save({firstName: firstName, lastName: lastName, motto: motto, 
                address: {"street1": street1, "street2": street2, "continent": continent, 
                "country": country, "province": province, "region": region, "city": city, 
                "postcode": postcode}, emails: emails, education: education, 
                occupation: occupation, bday: bday, socialBar: {"facebook": facebook, 
                "twitter": twitter, "linkedin": linkedin, "google": google}}, {
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
    //add one email inside the form
    addEmail: function (e) {
        e.preventDefault();
        var new_email = $("#add_email").val();
        var position = this.model.get('emails').length;
        var new_form = "<div id='email" + position + "'>" +
                            "<p class='content form-control-static hide'>" + new_email + "</p>" +
                            "<span class='col-sm-6'><input class='form-control email form' type='text' value='" + new_email +"' /></span> " +
                            "<span class='form help-block col-sm-6'><input name='radios' class='form' value='" + position + "' type='radio'> Set as primary"+
                        "</span></div>";

        var emailRegex = /\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,4}\b/;
        var email = new_email;
        if (!emailRegex.test(email)) {
            message('danger', 'Error: ', "Incorrect email format");
            return;
        } else {
            $(".emails").append(new_form);
            //clear the form
            $("#add_email").val('');
        }
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
        formdata.append("user", window.profileName);
        formdata.append("cmd", 'profilePictureWebcam');

        that = this;
        that.done();
        
        $.ajax({
            url:"php/uploadPicture.php",
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
    }
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
    formdata.append("user", window.profileName);
    formdata.append("cmd", 'profilePictureUpload');

    $.ajax({
        url:"php/uploadPicture.php",
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
                $('#user_image_progress').text("File size must be less than 500 kB.");
                $('#user_image_progress').css("color","red");
            }
        }
    });
}
function userDeleteImage () {
    var formdata = new FormData();
    formdata.append("user", window.profileName);
    formdata.append("cmd", 'profilePictureDelete');

    $.ajax({
        url:"php/uploadPicture.php",
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