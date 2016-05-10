$(document).on('submit', ".signup form", function (e) {
  e.preventDefault();
  var email = $(this).find('input').val();
  
  $.ajax({
      url: 'php/api.php',
      type: 'POST',
      dataType: "json",
      data: {cmd: 'sign_up', email: email},
      success: function(data) {
        if (data.response == '#wrong-code') alert("you don't have permissions to create user");
        else if (data.response == '#not_email') alert('email is in a wrong format');
        else if (data.response == '#not_gmail') alert('you need to provide valid gmail');
        else if (data.response == '#success') {
          alert('New BIOMIO user successfully registered.');
          $('.signup').addClass('hide');
          $('.wizard').removeClass('hide');
          get_state();
        }
      },
      error: function(data) {
        console.log('error');
      }
  });
});

$(document).on('click', ".update-qr-code", function (e) {
  generate_code();
});

$(document).on('click', ".activate-biometrics", function (e) {
  check_biometrics_verification();
});

$(document).on('click', ".extension-new-code", function (e) {
  generate_extension_code();
});

function get_state() {
  $.ajax({
      type: 'POST',
      url: 'php/login.php',
      dataType: "json",
      data: {cmd: "get_state"},
      success: function(data) {
          console.log(data);
          
          if (data == 1) {
              $('.div-1').addClass('hide');
              $('.menu-2').addClass('menu-active');

              $('.div-2').removeClass('hide');
              $('.menu-1 span').removeClass('hide');
              $('.menu').removeClass('menu-active');
          } else if (data == 3) {
              $('.div-1').addClass('hide');
              $('.div-2').addClass('hide');
              $('.menu-2').addClass('menu-active');

              $('.div-4').removeClass('hide');
              $('.menu-1 span').removeClass('hide');
              $('.menu-2 span').removeClass('hide');
              $('.menu-3 span').removeClass('hide');
              $('.menu').removeClass('menu-active');
          } else if (data == 4) {
              $('.menu-1 span').removeClass('hide');
              $('.menu-2 span').removeClass('hide');
              $('.menu-3 span').removeClass('hide');
              $('.menu-4 span').removeClass('hide');
              $('.view-2').addClass('hide');
              $('.view-3').removeClass('hide');
          }
      }
  });
}

$(document).on('click', ".next_1", function (e) {
  e.preventDefault(e);
  console.log('next_1');

  var first_name = $('#wizard_first_name').val();
  var last_name = $('#wizard_last_name').val();

  $.ajax({
      type: 'POST',
      url: 'php/login.php',
      data: {cmd: "update_name", first_name: first_name, last_name: last_name},
      success: function(data) {
          if (data == '#success') {
              $('.div-1').addClass('hide');
              $('.div-2').removeClass('hide');
              $('.menu-1 span').removeClass('hide');
              $('.menu').removeClass('menu-active');
              $('.menu-2').addClass('menu-active');
              save_state(1);
          }
      }
  });
}

$(document).on('click', ".next_2", function (e) {
  e.preventDefault(e);
  console.log('next_2');
  
  if (!$('.div-2-1').hasClass('hide')) {
      $('.div-2-1').addClass('hide');
      $('.div-2-2').removeClass('hide');

  } else if (!$('.div-2-2').hasClass('hide')) {
      if ($('.phone-select').val() == '') {
          var device_name = $('.div-2-2 .phone').val();
          if (name.length < 2) message('danger', 'Error: ', "Device name should be at least 2 symbols");
          else 
              $.ajax({
                  type: 'POST',
                  url: 'php/login.php',
                  data: {cmd: "add_mobile_device", device_name: device_name},
                  success: function(data) {
                      $('.device-id').val(data);
                      $('.div-2-2').addClass('hide');
                      $('.div-2-3').removeClass('hide');
                      generate_code();

                      $('.next-2').removeClass('btn-primary');
                  }
              });
      } else {
          $('.device-id').val($('.phone-select').val());
          $('.div-2').addClass('hide');
          $('.div-3').removeClass('hide');
          $('.menu').removeClass('menu-active');
          $('.menu-3').addClass('menu-active');
          register_biometrics();
          $('.next-3').removeClass('btn-primary');
      }

  } else if (!$('.div-2-3').hasClass('hide')) {
      // automatic transition

  } else if (!$('.div-2-4').hasClass('hide')) {
      $('.div-2').addClass('hide');
      $('.div-3').removeClass('hide');
      $('.menu').removeClass('menu-active');
      $('.menu-3').addClass('menu-active');
      register_biometrics();
      $('.next-3').removeClass('btn-primary');
      $('.menu-2 span').removeClass('hide');

  }
}

$(document).on('click', ".next_3", function (e) {
    e.preventDefault(e);
    console.log('next_3');
    
    if (!$('.div-3-1').hasClass('hide')) {
        
    } else if (!$('.div-3-2').hasClass('hide')) {
        $('.div-3').addClass('hide');
        $('.div-4').removeClass('hide');
        $('.menu').removeClass('menu-active');
        $('.menu-4').addClass('menu-active');
        $('.menu-3 span').removeClass('hide');
    }
}

$(document).on('click', ".next_4", function (e) {
    e.preventDefault(e);
    console.log('next_4');
    
    if (!$('.div-4-1').hasClass('hide')) {
        $('.div-4-1').addClass('hide');
        $('.div-4-2').removeClass('hide');

        generate_extension_code();
        $('.next-4').removeClass('btn-primary');

    } else if (!$('.div-4-3').hasClass('hide')) {
        $('.div-4').addClass('hide');
        $('.div-5').removeClass('hide');
        save_state(4);
    }
}

function generate_code() {
    var device_id = $('.device-id').val();
    $('.update-qr-code').addClass('disabled');
    $('#qr_code').html('');
    $('#qr_code_text strong').text('');

    $.ajax({
        type: 'POST',
        url: 'php/login.php',
        data: {cmd: "generate_qr_code", device_id: device_id},
        success: function(data) {
            // returns 8 symbol code which we present as a text and as a qr image
            $('#qr_code').qrcode({
                "width": 150,
                "height": 150,
                "color": "#3a3",
                "text": data
            });
            $('#qr_code_text strong').text(data);
            $('.update-qr-code').removeClass('disabled');

            check_device_verification();
        }
    });
}

register_biometrics: function(e) {
    var device_id = $('.device-id').val();

    // create session code
    $.ajax({
        type: 'POST',
        url: 'php/login.php',
        data: {cmd: "generate_biometrics_code", device_id: device_id},
        success: function(data) {
            $('#biometrics_code').text(data);
            // send rest here
            check_biometrics_verification();
        }
    });
}

check_device_verification: function () {
    var check = setInterval(function(){ 
        var code = $('#qr_code_text strong').text();
        console.log('verification call for ' + code);
        if (code != '' && code != undefined && !$('.div-2-3').hasClass('hide'))
            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                data: {cmd: "check_status", code: code},
                success: function(data) {
                    if (data == '#verified') {
                        clearInterval(check);
                        $('.div-2-3').addClass('hide');
                        $('.div-2-4').removeClass('hide');
                        $('.next-2').addClass('btn-primary');
                    }
                }
            });
        else clearInterval(check);
    }, 3000);
}

check_biometrics_verification: function () {
    var timer = 30000;

    clearInterval(check);
    check = setInterval(function() { 
        var code = $('#biometrics_code').text();
        console.log('verification call for ' + code);
        if (code != '' && code != undefined)
            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                data: {cmd: "check_status", code: code},
                success: function(data) {
                    if (data == '#verified') {
                        clearInterval(check);
                        $('.div-3-1').addClass('hide');
                        $('.div-3-2').removeClass('hide');
                        $('.next-3').addClass('btn-primary');
                        save_state(3);
                    }
                }
            });
        else clearInterval(check);

        timer = timer - 3;
        if (timer <= 0) {
            $('.form-1-1, .form-1-2, .form-1-3, .form-1-4, .form-1-5').addClass('hide');
            alert('Registration session has been expired. Please try again.');
            clearInterval(check);
        }
    }, 3000);
},
generate_extension_code: function () {
    var context = 0;

    var port = chrome.runtime.connect('ooilnppgcbcdgmomhgnbjjkbcpfemlnj');
    port.postMessage({command: "is_registered"});
    port.onMessage.addListener(function(response){
        if (response.is_registered) {
            $('.div-4-2').addClass('hide');
            $('.div-4-3').removeClass('hide');
            $('.menu-4 span').removeClass('hide');
            $('.next-4').text('Finish');
            $('.next-4').addClass('btn-primary');
        } else 
            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                dataType: "json",
                data: {cmd: "verify_extension"},
                success: function(data) {
                    $('.extension-verifcation h2').text(data.code);
                    $('.extension-verifcation-code').val(data.code);

                    check_extension_verification();
                }
            });
    });
},
check_extension_verification: function () {
    var code = $('.extension-verifcation-code').val();
    var port = chrome.runtime.connect('ooilnppgcbcdgmomhgnbjjkbcpfemlnj');
    port.postMessage({command: "register_biomio_extension", "data": {"secret_code":code}});
    port.onMessage.addListener(function(response){
        if (response.result == true) 
            $.ajax({
                type: 'POST',
                url: 'php/login.php',
                data: {cmd: "check_status", code: code},
                success: function(data) {
                    if (data == '#verified') {
                        $('.div-4-2').addClass('hide');
                        $('.div-4-3').removeClass('hide');
                        $('.menu-4 span').removeClass('hide');
                        $('.next-4').text('Finish');
                        $('.next-4').addClass('btn-primary');
                    }
                }
            });
        else if (response.result == false) {
            alert('registration failure');
            generate_extension_code();
        }
    });
}

function save_state(state) {
    $.ajax({
        type: 'POST',
        url: 'php/login.php',
        data: {cmd: "save_state", state: state},
        success: function(data) {
            if (data == '#success') console.log('state is saved');
        }
    });
}