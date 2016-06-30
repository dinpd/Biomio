App.Views.ProviderInformation = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
        this.model.on('change', this.render, this);
    },
    render:function () {
        var template = render('ProviderInformationView', this.model.toJSON());
        this.$el.html( template );

        var time = new Date().getTime();
        $.ajax({
            url: 'profileData/companyLogo/' + window.profileId + '.jpg',
            success: function (data) {
                $('#provider_image_preview').html('<img id="provider_image" class="col-sm-12" style="padding: 0px" src ="profileData/companyLogo/' + window.profileId + '.jpg?' + time +'">');
                $("#provider_image_delete").removeClass('disabled');
            },
            error: function (data) {
                $('#provider_image_preview').html('<img id="provider_image" class="col-sm-12" style="padding: 0px" src ="profileData/default-logo.png">');
            }
        });
    },
    events: {
        'click .provider-update-info': 'updateInfo',
        'click .provider-save-changes': 'saveChanges',
        'click .provider-cancel-changes': 'cancelChanges',
        'click .provider-add-email': 'addEmail',
        'change .provider-geolocation': 'geolocation',
    },
    updateInfo: function (e) {
        e.preventDefault();
        $(".content").addClass('hide');
        $(".form").removeClass('hide');

        this.generateLocationList(6295630,'continent','continent'); //get list of continents to start geolocation
        
        var size = this.model.get('size'); // select real size from the list
        $("#size option").filter(function() { return this.text == size; }).attr('selected', true);
    },
    //save changes for the whole form
    saveChanges: function (e) {
        e.preventDefault();
        var title       = $('#title').val();
        var description = $('#description').val();
        var mission     = $('#mission').val();
        var founded     = $('#founded').val();
        var products    = $('#products').val();
        var size        = $('#size').val();

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

        //put
        this.model.save({ title: title, description: description, mission: mission, 
                founded: founded, products: products, size: size, address: 
                {"street1": street1, "street2": street2, "continent": continent, 
                "country": country, "province": province, "region": region, "city": city, 
                "postcode": postcode}, emails: emails, socialBar: {"facebook": facebook, 
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
});

var current;
function providerTriggerImageUpload () {
    $("#provider_image_input").trigger('click');
}
function providerPreviewImage (fileInput) {
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
      
    $("#provider_image_preview").html(img);
    $("#provider_image_preview img").addClass("col-sm-12").css("border-radius", "5px");
    $("#provider_image_save").removeClass('disabled');
}
function providerSaveImage () {
    var reader;
    if(window.FileReader){
        reader = new FileReader();
        reader.readAsDataURL(current);
    }
    var formdata = new FormData();
    formdata.append("file", current);
    formdata.append("provider", window.profileId);
    formdata.append("cmd", 'providerLogoUpload');

    $.ajax({
        url:"php/uploadPicture.php",
        type: "POST",
        data:formdata,
        processData:false,
        contentType:false,
        success:function(data){
            if(data == "Success"){          
                $('#provider_image_progress').css("color","green");
                $('#provider_image_progress').text("Upload Success!");
                $("#provider_image_delete").addClass('disabled');
            }
            else{
                $('#provider_image_progress').text("File size must be less than 500 kB.");
                $('#provider_image_progress').css("color","red");
            }
        }
    });
}
function providerDeleteImage () {
    var formdata = new FormData();
    formdata.append("provider", window.profileId);
    formdata.append("cmd", 'providerLogoDelete');

    $.ajax({
        url:"php/uploadPicture.php",
        type: "POST",
        data:formdata,
        processData:false,
        contentType:false,
        success:function(data){
            if(data == "Success"){          
                $('#provider_image_progress').css("color","green");
                $('#provider_image_progress').text("Delete Success!");
                $('#provider_image_preview').html('<img id="provider_image" class="col-sm-12" style="padding: 0px" src ="profileData/default-logo.png">');
                $("#provider_image_delete").removeClass('disabled');
            }
            else{
                $('#provider_image_progress').text("Server error. Something is wrong.");
                $('#provider_image_progress').css("color","red");
            }
        }
    });
}