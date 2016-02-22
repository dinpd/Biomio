App.Views.ProviderInformation = Backbone.View.extend({
	el: $("#content"),
    initialize:function () {
    },
    render:function () {
        that = this;
        $.ajax({
            type: 'POST',
                url: '../php/provider.php',
                data: {cmd: "provider_info"},
                dataType: "json",
                success: function(data) {
                    var template = render('ProviderInformationView', data);
                    that.$el.html( template );
                
                    var time = new Date().getTime();
                    $.ajax({
                        url: '../profileData/companyLogo/' + window.profileId + '.jpg',
                        success: function (data) {
                            $('#provider_image_preview').html('<img id="provider_image" class="col-sm-12" style="padding: 0px" src ="../profileData/companyLogo/' + window.profileId + '.jpg?' + time +'">');
                            $("#provider_image_delete").removeClass('disabled');
                        },
                        error: function (data) {
                            $('#provider_image_preview').html('<img id="provider_image" class="col-sm-12" style="padding: 0px" src ="../profileData/default-logo.png">');
                        }
                    });
                }
        });
    },
    events: {
        'click .provider-update-info': 'updateInfo',
        'click .provider-save-changes': 'saveChanges',
        'click .provider-cancel-changes': 'cancelChanges'
    },
    updateInfo: function (e) {
        e.preventDefault();
        $(".content").addClass('hide');
        $(".form").removeClass('hide');
    },
    //save changes for the whole form
    saveChanges: function (e) {
        e.preventDefault();
        var name       = $('#name').val();
        var ein        = $('#ein').val();
        var email      = $('#email').val();
        var phone      = $('#phone').val();

        var mission     = $('#mission').val();
        var founded     = $('#founded').val();
        var products    = $('#products').val();
        var size        = $('#size').val();

        var line1   = $('#address_line1').val();
        var line2   = $('#address_line2').val();
        var city   = $('#address_city').val();
        var region   = $('#address_region').val();
        var code   = $('#address_code').val();
        var country   = $('#address_country').val();

        address = {line1: line1, line2: line2, city: city, region: region, code: code, country: country};

        $.ajax({
            type: 'POST',
                url: '../php/provider.php',
                data: {cmd: "update_info", name: name, ein: ein, email: email, phone: phone, address: address},
                success: function(data) {
                    
                    var template = render('ProviderInformationView', {name: name, ein: ein, email: email, phone: phone, address: address});
                    that.$el.html( template );
                
                    var time = new Date().getTime();
                    $.ajax({
                        url: '../profileData/companyLogo/' + window.profileId + '.jpg',
                        success: function (data) {
                            $('#provider_image_preview').html('<img id="provider_image" class="col-sm-12" style="padding: 0px" src ="profileData/companyLogo/' + window.profileId + '.jpg?' + time +'">');
                            $("#provider_image_delete").removeClass('disabled');
                        },
                        error: function (data) {
                            $('#provider_image_preview').html('<img id="provider_image" class="col-sm-12" style="padding: 0px" src ="profileData/default-logo.png">');
                        }
                    });

                    $(".form").addClass('hide');
                    $(".content").removeClass('hide');
                }
        });
        

    },
    cancelChanges: function (e) {
        e.preventDefault();
        $(".form").addClass('hide');
        $(".content").removeClass('hide');
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
        url:"../php/uploadPicture.php",
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
        url:"../php/uploadPicture.php",
        type: "POST",
        data:formdata,
        processData:false,
        contentType:false,
        success:function(data){
            if(data == "Success"){          
                $('#provider_image_progress').css("color","green");
                $('#provider_image_progress').text("Delete Success!");
                $('#provider_image_preview').html('<img id="provider_image" class="col-sm-12" style="padding: 0px" src ="../profileData/default-logo.png">');
                $("#provider_image_delete").removeClass('disabled');
            }
            else{
                $('#provider_image_progress').text("Server error. Something is wrong.");
                $('#provider_image_progress').css("color","red");
            }
        }
    });
}