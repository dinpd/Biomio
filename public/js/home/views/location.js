App.Views.SecureLocation = Backbone.View.extend({
    el: $("#content"),
    initialize:function () {
        this.model.on('change', this.render, this);
    },
    render:function () {
        if (this.model.id) {
            if (this.model.get('owner') == window.profileId)
                var template = render('MyLocationView', this.model.toJSON());
            else
                var template = render('LocationView', this.model.toJSON());

            this.$el.html( template );
            that = this;
            var time = new Date().getTime();
            $.ajax({
                url: 'profileData/locationPicture/' + that.model.id + '.jpg',
                success: function (data) {
                    $('#location_image_preview').html('<img id="location_image" class="col-sm-12" style="padding: 0px; width: 100%" src ="profileData/locationPicture/' + that.model.id + '.jpg?' + time +'">');
                    $("#location_image_delete").removeClass('disabled');
                },
                error: function (data) {
                    $('#location_image_preview').html('<img id="location_image" class="col-sm-12" style="padding: 0px; width: 100%" src ="img/house.png">');
                }
            });
        } else {
            window.location.hash = 'not-found';
        }
    },
    events: {
        'click .location-update-info'   : 'updateInfo',
        'click .location-save-changes'  : 'saveChanges',
        'click .location-cancel-changes': 'cancelChanges',
        'click .location-add-email'     : 'addEmail',
        'change .location-geolocation'  : 'geolocation',
    },
    updateInfo: function (e) {
        e.preventDefault();
        $(".content").addClass('hide');
        $(".form").removeClass('hide');

        this.generateLocationList(6295630,'continent','continent'); //get list of continents to start geolocation
    },
    //save changes for the whole form
    saveChanges: function (e) {
        e.preventDefault();
        var name        = $('#name').val();
        var description = $('#description').val();
        var map = $('#map').val();
        map = map.substring(map.indexOf('src="') + 5, map.indexOf('" '));
        if (map == '') map = this.model.get('map');


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

        //put
        this.model.save({ name: name, description: description, map: map, address:
        {"street1": street1, "street2": street2, "continent": continent,
            "country": country, "province": province, "region": region, "city": city,
            "postcode": postcode}}, {
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
});

var current;
function locationTriggerImageUpload () {
    $("#location_image_input").trigger('click');
}
function locationPreviewImage (fileInput) {
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

    $("#location_image_preview").html(img);
    $("#location_image_preview img").addClass("col-sm-12").css("border-radius", "5px");
    $("#location_image_save").removeClass('disabled');
}
function locationSaveImage () {
    var reader;
    if(window.FileReader){
        reader = new FileReader();
        reader.readAsDataURL(current);
    }
    var locationId = $('#id').val();
    var formdata = new FormData();
    formdata.append("file", current);
    formdata.append("location", locationId);
    formdata.append("cmd", 'locationPictureUpload');

    $.ajax({
        //url:"php/uploadPicture.php",
        url:"/upload/locationPictureUpload",
        type: "POST",
        data:formdata,
        processData:false,
        contentType:false,
        success:function(data){
            if(data == "Success"){
                $('#location_image_progress').css("color","green");
                $('#location_image_progress').text("Upload Success!");
                $("#location_image_delete").removeClass('disabled');
            }
            else{
                $('#location_image_progress').text("File size must be less than 500 kB.");
                $('#location_image_progress').css("color","red");
            }
        }
    });
}
function locationDeleteImage () {
    var locationId = $('#id').val();
    var formdata = new FormData();
    formdata.append("location", locationId);
    formdata.append("cmd", 'locationPictureDelete');

    $.ajax({
        //url:"php/uploadPicture.php",
        url:"/upload/locationPictureDelete",
        type: "POST",
        data:formdata,
        processData:false,
        contentType:false,
        success:function(data){
            if(data == "Success"){
                $('#location_image_progress').css("color","green");
                $('#location_image_progress').text("Delete Success!");
                $('#location_image_preview').html('<img id="location_image" class="col-sm-12" style="padding: 0px" src ="img/house.png">');
                $("#location_image_delete").addClass('disabled');
            }
            else{
                $('#location_image_progress').text("Server error. Something is wrong.");
                $('#location_image_progress').css("color","red");
            }
        }
    });
}