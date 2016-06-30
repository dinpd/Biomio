$(document).on('click touchend', '.try', function () {
  $('.doc').addClass('hide');
  $('.test').removeClass('hide');
});

$(document).on('click touchend', '.try-hide', function () {
  $('.doc').removeClass('hide');
  $('.test').addClass('hide');
});


$(document).on('keyup', ".public_key", function (e) {
  $('.public_key').val($(this).val());
});
$(document).on('keyup', ".private_key", function (e) {
  $('.private_key').val($(this).val());
});
$(document).on('keyup', ".profileId", function (e) {
  $('.profileId').val($(this).val());
});
$(document).on('keyup', ".device_id", function (e) {
  $('.device_id').val($(this).val());
});
$(document).on('keyup', ".code", function (e) {
  $('.code').val($(this).val());
});


// 2. Register a new user
$(document).on('click touchend', ".send-1", function () {
  
  var private_key = $('.private_key').val();
  var public_key = $('.public_key').val();
  var email = $('.email').val();

  if (private_key.length != 0 && public_key.length != 0 && email.length != 0)
    $.ajax({
        url: 'php/api.php',
        type: 'POST',
        dataType: "json",
        data: {cmd: 'sign_up', private_key: private_key, public_key: public_key, email: email},
        success: function(data) {
          if (data.response == '#success')
            $('.profileId').val(data.profileId);

          $('.response-1').html(JSON.stringify(data, null, 4));
        },
        error: function(data) {
          console.log('error');
        }
    });
});

// 2. Update name
$(document).on('click touchend', ".send-2", function () {
  
  var private_key = $('.private_key').val();
  var public_key = $('.public_key').val();
  var profileId = $('.profileId').val();
  var first_name = $('.first_name').val();
  var last_name = $('.last_name').val();

  if (private_key.length != 0 && public_key.length != 0 && first_name.length != 0 && last_name.length != 0)
    $.ajax({
        url: 'php/api.php',
        type: 'POST',
        dataType: "json",
        data: {cmd: 'update_name', private_key: private_key, public_key: public_key, profileId: profileId, first_name: first_name, last_name: last_name},
        success: function(data) {
          $('.response-2').html(JSON.stringify(data, null, 4));
        },
        error: function(data) {
          console.log('error');
        }
    });
});

// 3.2 Add new mobile device:
$(document).on('click touchend', ".send-3", function () {
  
  var private_key = $('.private_key').val();
  var public_key = $('.public_key').val();
  var profileId = $('.profileId').val();
  var device_name = $('.device_name').val();

  if (private_key.length != 0 && public_key.length != 0 && device_name.length)
    $.ajax({
        url: 'php/api.php',
        type: 'POST',
        dataType: "json",
        data: {cmd: 'add_mobile_device', private_key: private_key, public_key: public_key, profileId: profileId, device_name: device_name},
        success: function(data) {
          if (data.response == '#success')
            $('.device_id').val(data.device_id);

          $('.response-3').html(JSON.stringify(data, null, 4));
        },
        error: function(data) {
          console.log('error');
        }
    });
});

// 3.3 Register mobile device:
$(document).on('click touchend', ".send-4", function () {
  
  var private_key = $('.private_key').val();
  var public_key = $('.public_key').val();
  var profileId = $('.profileId').val();
  var device_id = $('.device_id').val();

  if (private_key.length != 0 && public_key.length != 0 && device_id.length)
    $.ajax({
        url: 'php/api.php',
        type: 'POST',
        dataType: "json",
        data: {cmd: 'generate_device_code', private_key: private_key, public_key: public_key, profileId: profileId, device_id: device_id},
        success: function(data) {
          if (data.response == '#success')
            $('.code').val(data.code);

          $('.response-4').html(JSON.stringify(data, null, 4));
        },
        error: function(data) {
          console.log('error');
        }
    });
});

// 3.4 Check the status of device verification:
$(document).on('click touchend', ".send-5", function () {
  
  var private_key = $('.private_key').val();
  var public_key = $('.public_key').val();
  var profileId = $('.profileId').val();
  var code = $('.code').val();

  if (private_key.length != 0 && public_key.length != 0 && code.length)
    $.ajax({
        url: 'php/api.php',
        type: 'POST',
        dataType: "json",
        data: {cmd: 'check_status', private_key: private_key, public_key: public_key, profileId: profileId, code: code},
        success: function(data) {
          $('.response-5').html(JSON.stringify(data, null, 4));
        },
        error: function(data) {
          console.log('error');
        }
    });
});

// 4.1 Start biometrics registration:
$(document).on('click touchend', ".send-6", function () {
  
  var private_key = $('.private_key').val();
  var public_key = $('.public_key').val();
  var profileId = $('.profileId').val();
  var device_id = $('.device_id').val();

  if (private_key.length != 0 && public_key.length != 0 && device_id.length)
    $.ajax({
        url: 'php/api.php',
        type: 'POST',
        dataType: "json",
        data: {cmd: 'generate_biometrics_code', private_key: private_key, public_key: public_key, profileId: profileId, device_id: device_id},
        success: function(data) {
          if (data.response == '#success')
            $('.code-2').val(data.code);

          $('.response-6').html(JSON.stringify(data, null, 4));
        },
        error: function(data) {
          console.log('error');
        }
    });
});

// 4.2 Check the status of biometrics verification:
$(document).on('click touchend', ".send-7", function () {
  
  var private_key = $('.private_key').val();
  var public_key = $('.public_key').val();
  var profileId = $('.profileId').val();
  var code = $('.code-2').val();

  if (private_key.length != 0 && public_key.length != 0 && code.length)
    $.ajax({
        url: 'php/api.php',
        type: 'POST',
        dataType: "json",
        data: {cmd: 'check_status', private_key: private_key, public_key: public_key, profileId: profileId, code: code},
        success: function(data) {
          $('.response-7').html(JSON.stringify(data, null, 4));
        },
        error: function(data) {
          console.log('error');
        }
    });
});

// 5.1 Start extension registration:
$(document).on('click touchend', ".send-8", function () {
  
  var private_key = $('.private_key').val();
  var public_key = $('.public_key').val();
  var profileId = $('.profileId').val();

  if (private_key.length != 0 && public_key.length != 0)
    $.ajax({
        url: 'php/api.php',
        type: 'POST',
        dataType: "json",
        data: {cmd: 'generate_extension_code', private_key: private_key, public_key: public_key, profileId: profileId},
        success: function(data) {
          if (data.response == '#success')
            $('.code-3').val(data.code);

          $('.response-8').html(JSON.stringify(data, null, 4));
        },
        error: function(data) {
          console.log('error');
        }
    });
});

// Check the status of biometrics verification:
$(document).on('click touchend', ".send-9", function () {
  
  var private_key = $('.private_key').val();
  var public_key = $('.public_key').val();
  var profileId = $('.profileId').val();
  var code = $('.code-3').val();

  if (private_key.length != 0 && public_key.length != 0 && code.length)
    $.ajax({
        url: 'php/api.php',
        type: 'POST',
        dataType: "json",
        data: {cmd: 'check_status', private_key: private_key, public_key: public_key, profileId: profileId, code: code},
        success: function(data) {
          $('.response-9').html(JSON.stringify(data, null, 4));
        },
        error: function(data) {
          console.log('error');
        }
    });
});