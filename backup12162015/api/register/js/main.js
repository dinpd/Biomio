check = '';

/*
// This code can be used to check if extension is verified

var port = chrome.runtime.connect('lgefcndmlikkmgielaeiflkmmgboljhm');
port.postMessage({command: "is_registered"});
port.onMessage.addListener(function(response){
    if (response.is_registered) {
        $('.verify-extention').addClass('hide');
        $('.verify-header').addClass('hide');
    } else {
      alert('you need a registered biomio extension to use biometrics login');
    }
});

*/



$(document).on('submit', "form", function (e) {
  e.preventDefault();
  var email = $(this).find('input').val();
  $.ajax({
      url: 'php/api.php',
      type: 'POST',
      dataType: "json",
      data: {cmd: 'check_email', email: email},
      success: function(data) {
       if (data.response == '#not-found') alert('user with this email address is not registered in BIOMIO');
       else if (data.response == '#no-bio') alert('biometrics data is not registered for this BIOMIO user');
       else if (data.response == '#error') alert('system error occured; please try again');
       else if (data.response == '#exists') {
          bioauth(data.code, email);
          // data element also contains firstName, lastName and id of the user in case you want to greet him or her
       }
      },
      error: function(data) {
        console.log('error');
      }
  });
});

function bioauth (code, email) {
  var port = chrome.runtime.connect('lgefcndmlikkmgielaeiflkmmgboljhm'); // BIOMIO extension ID
  port.postMessage({command: "run_auth", email: email, auth_code: code.toString()});
  port.onMessage.addListener(function(response) {
      console.log(response);
      console.log(response.timeout);

      // extension provides 4 statuses: error, success and two in-progress
      if (response.status == 'error') {
        clearInterval(check);
        $('.message').addClass('text-warning').removeClass('text-success').removeClass('text-primary').text(response.error);
      } else if (response.status == 'in_progress' && response.timeout != undefined) {
          clearInterval(check);
          check = setInterval(function() {
              check_bioauth(code);
          }, 1000);
          $('.message').removeClass('text-warning').removeClass('text-success').addClass('text-primary').text(response.message);
      } else if (response.status == 'in_progress' && response.timeout == undefined) {   
          clearInterval(check);
          check = setInterval(function() {
              check_bioauth(code);
          }, 1000);
          $('.message').removeClass('text-warning').removeClass('text-success').addClass('text-primary').text(response.message);
      } else if (response.status == 'completed') {
          $('.message').removeClass('text-warning').addClass('text-success').removeClass('text-primary').text(response.message);
      }
          
  });
}

function check_bioauth (code) {
    console.log('verification call for ' + code);
    if (code != '' && code != undefined)
        $.ajax({
            type: 'POST',
            url: 'php/api.php',
            dataType: "json",
            data: {cmd: "check_code", code: code},
            success: function(data) {
                if (data.response == '#verified') {
                  clearInterval(check);
                  alert('Hello ' + data.firstName + ' ' + data.lastName + '. Your identity was successfully verified with BIOMIO');
                  $('form input, form button').addClass('hide');
                } else if (data.response == '#no-code') {
                  clearInterval(check);
                  alert('Session aborted'); // user is trying to login from different places
                }
            }
        });
    else clearInterval(check);
}
