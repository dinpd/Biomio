<!DOCTYPE html>
<html>
<head>
    <title>BIOMIO Wizard</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/css.css">

    <style>
      .menu {
        background: #EEE;
        font-size: ;
        cursor: default;
        width: 100%;
        height: 46px;
        padding-top: 10px;
        padding-right: 10px;
        padding-left: 10px;
        font-size: 20px;
      }

      .menu-active {
        background: #FF6000;
        color: #FFF;
      }
      .div-1, .div-2, .div-3, .div-4, .div-5 {
        height: 370px;
        width: 450px;
        border-radius: 5px;
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 20px;
      }

      .next-1, .next-2, .next-3, .next-4, .next-5 {
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    </style>

</head>
<body>

<div class="header">

</div>

<div class="container">
  <div class="row">

    <h3 class="col-sm-8 col-sm-offset-2">BIOMIO Wizard Integration</h3>
    <br><br>

    <div class="well col-sm-8 col-sm-offset-2 row signup">
      <form>
        <input type="email" class="form-control" placeholder="user gmail">
        <button type="submit" class="btn btn-success btn-block">Submit</button>
      </form>
    </div>

    <div class="well col-sm-8 col-sm-offset-2 row wizard">
      
      <div class="view-2 text-center">
        <div class="col-sm-4 text-left">
          <div class="menu menu-1 menu-active">
            <span class="glyphicon glyphicon-ok hide text-success pull-right" aria-hidden="true"></span>
            BIOMIO User
          </div>

          <div class="menu menu-2">
            <span class="glyphicon glyphicon-ok hide text-success pull-right" aria-hidden="true"></span>
            Phone
          </div>

          <div class="menu menu-3">
            <span class="glyphicon glyphicon-ok hide text-success pull-right" aria-hidden="true"></span>
            Enroll
          </div>

          <div class="menu menu-4">
            <span class="glyphicon glyphicon-ok hide text-success pull-right" aria-hidden="true"></span>
            Extension
          </div>
        </div>

        <div class="col-sm-8 divs">
          <!-- Div for User Info -->
          <div class="col-sm-12 div-1">
            <div class="col-sm-12" style="padding: 0">
              <h2 class="text-success" style="margin-top: 40px">Welcome</h2>
              <h3 class="text-success"><span class="welcome-email"></span></h3>
              <p style="margin-top: 20px"><strong>Please introduce yourself:</strong></p>

              <div id = "wizard_first_name_group" class="form-group col-sm-8 col-sm-offset-2">
                <input id="wizard_first_name" type="text" value="" class="form-control wizard-name" autofocus="" maxlength="50" placeholder="First Name">
                <span id="wizard_first_name_span" class="help-block"></span>
              </div>

              <div id = "wizard_last_name_group" class="form-group col-sm-8 col-sm-offset-2">
                <input id="wizard_last_name" type="text" value="" class="form-control wizard-name" maxlength="50" placeholder="Last Name">
                <span id="wizard_last_name_span" class="help-block"></span>
              </div>
            </div>

            <button class="next-1 btn btn-primary pull-right">Next</button>
          </div>

          <!-- Div for Phone -->
          <div class="col-sm-12 div-2 hide">
            <div class="div-2-1 col-sm-12" style="padding: 0;">
              <h3 class="text-success">Please, download</h3>
              <h3 class="text-success" style="margin-top: 5px">BIOMIO mobile APP:</h3>
              <p style="margin-top: 20px"><a href="#" target="_blank"><img width="190" height="190" src='https://biom.io/img/smallLogo.png'></a></p>
            </div>

            <div class="div-2-2 col-sm-12 hide" style="padding: 0; margin-top: 40px">
              <h3 class="text-success">Give identification</h3>
              <h3 class="text-success" style="margin-top: 5px">name to your phone:</h3>
              <p class="col-sm-8 col-sm-offset-2" style="margin-top: 20px">
                <input type="text" class="phone form-control" placeholder="new device name">
                <select class="phone-select hide form-control"><option value="">select existing device</option></select>
                <input type="text" class="device-id hide">
              </p>
            </div>

            <div class="div-2-3 col-sm-12 hide" style="padding: 0">
              <h3 class="text-success">Verify your mobile phone:</h3>
              

              <div id="qr_div" class="col-sm-12" style="margin-top: 20px">
                <div id="qr_code" style="height: 205px"></div>
                <br>
                <div class="col-sm-10 col-sm-offset-2 col-xs-10 col-xs-offset-2">
                  <div class="col-sm-7 col-sm-offset-1 col-xs-7 col-xs-offset-1 text-center" id="qr_code_text"><strong></strong></div>
                  <div class="col-sm-3 col-xs-3">
                    <button type="button" class="close update-qr-code" aria-hidden="true">
                      <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <div class="div-2-4 col-sm-12 hide" style="padding: 0; margin-top: 110px">
              <h3 class="text-success">Your phone has been</h3>
              <h3 class="text-success" style="margin-top: 5px">successfully registered</h3>
            </div>

            <!--<button class="prev-2 btn btn-default pull-left">Previous</button>-->
            <button class="next-2 btn btn-primary pull-right">Next</button>
          </div>

          <!-- Div for Biometrics -->
          <div class="col-sm-12 div-3 hide">
            <div class="div-3-1 col-sm-12" style="padding: 0;  margin-top: 20px">
              <h3 class="text-success">Enroll your bimetric data</h3>
              <h3 class="text-success" style="margin-top: 5px">using Mobile Application</h3>

              <p style="margin: 70px" class="gif"><img src="https://biom.io/img/large-progress.gif"></p>

              <p><strong>If enrollment is not started, <a class="activate-biometrics" style="cursor: pointer">click to reactivate it</a></strong></p>
              <input id="biometrics_code" class="hide">
            </div>

            <div class="div-3-2 col-sm-12 hide" style="padding: 0; margin-top: 110px">
              <h3 class="text-success">Your biometric has been</h3>
              <h3 class="text-success" style="margin-top: 5px">successfully enrolled</h3>
            </div>

            <!--<button class="prev-3 btn btn-default pull-left">Previous</button>-->
            <button class="next-3 btn btn-primary pull-right">Next</button>
          </div>

          <!-- Div for Extension -->
          <div class="col-sm-12 div-4 hide">
            <div class="div-4-1 col-sm-12" style="padding: 0">
              <h3 class="text-success">Please, download</h3>
              <h3 class="text-success" style="margin-top: 5px">BIOMIO Extension:</h3>
              <p style="margin-top: 20px"><a href="#" target="_blank"><img width="190" height="190" src='https://biom.io/img/smallLogo.png'></a></p>
            </div>

            <div class="div-4-2 col-sm-12 hide" style="padding: 0">
              <h3 class="text-success" style="margin-top: 70px">Verify Chrome Extension</h3>

              <!--<div class="col-sm-12 extension-verifcation-image" style="margin-bottom: 15px">image</div>-->
              <div class="col-sm-6 col-sm-offset-3 extension-verifcation" style="margin-top: 20px; padding: 5px; border-radius: 5px; border: 1px solid #eee; margin-bottom: 15px"><h2 style="margin-top: 10px"></h2></div>
              <button type="button" class="btn btn-success extension-new-code">Get a new code</button>
              <input type="text" class="hide extension-verifcation-code">
            </div>

            <div class="div-4-3 col-sm-12 hide" style="padding: 0; margin-top: 110px">
              <h3 class="text-success">Your extension has been</h3>
              <h3 class="text-success" style="margin-top: 5px">successfully registered</h3>
            </div>

            <!--<button class="prev-4 btn btn-default pull-left">Previous</button>-->
            <button class="next-4 btn btn-primary pull-right">Next</button>
          </div>

          <div class="col-sm-12 div-5 hide">
            <div class="div-5-1 col-sm-12" style="padding: 0; margin-top: 110px">
              <h3>
                <h3 class="text-success">Congratulations!</h3>
                <h3 class="text-success" style="margin-top: 5px">Your BIOMIO account is setup</h3>
              </h3>
            </div>
            <button class="next-5 btn btn-primary pull-right">Proceed to the Account</button>
          </div>

          <button class="finish btn btn-block btn-primary hide col-sm-12">Finish and Proceed to the Account</button>

        </div>
      </div>

      <div class="view-3 text-center hide">
        <h2 class="col-sm-12 text-success">Your account is set up and ready to use</h2>
      </div>
    </div>
  </div>

  <div class="row" style="margin-top: 20px">
      <div class="well">
        <h4>1. Register a new user</h4>
        <p>To register a new user user you need to user gmail associated email address</p>
        <p>This address should be sent via POST request to https://biom.io/api/wizard.php/sign_up/[providerKey]/[email]</p>

        <p><strong>Possible responses:</strong></p>
        <p>200/JSON {'response': '#not email'} <span style="color: #bbb">// email is in a wrong format</span></p>
        <p>200/JSON {'response': '#not gmail'} <span style="color: #bbb">// provided email is not gmail or gmail associated</span></p>
        <p>200/JSON {'response': '#email exists'} <span style="color: #bbb">// we already have a user registered with this email</span></p>
        <p>200/JSON {'profileId': '12345678'} <span style="color: #bbb">// BIOMIO unique user id</span></p>

        <br>

        <h4>2. Update user information</h4>
        <br>
          <p>2.1 Update name:</p>
          <p>POST to https://biom.io/api/wizard.php/update_name/[providerKey]/[profileId]/[first_name]/[last_name]</p>
          <p><strong>Possible responses:</strong></p>
          <p>200/JSON {'response': '#success'} <span style="color: #bbb">// name is updated</span></p>
        <br>
          <p>2.2 Add new mobile device:</p>
          <p>POST to https://biom.io/api/wizard.php/add_mobile_device/[providerKey]/[profileId]/[device_name]</p>
          <p><strong>Possible responses:</strong></p>
          <p>200/JSON {'device_id': '12345678'} <span style="color: #bbb">// id of registered device (unverified)</span></p>
        <br>
          <p>2.3 Register mobile device:</p>
          <p>POST to https://biom.io/api/wizard.php/generate_device_code/[providerKey]/[profileId]/[device_id]</p>
          <p><strong>Possible responses:</strong></p>
          <p>200/JSON {'code': '12345678'} <span style="color: #bbb">// code to check device verification</span></p>
          <p>User need to open BIOMIO application and enter the code or you can use qrcode.js library to create a qr code that can be scanned by the application.
        <br>
          <p>2.4 Check the status of device verification:</p>
          <p>POST to https://biom.io/api/wizard.php/check_status/[providerKey]/[profileId]/[code]</p>
          <p><strong>Possible responses:</strong></p>
          <p>200/JSON {'response'=>'#no-code'} <span style="color: #bbb">// code is invalid</span></p>
          <p>200/JSON {'response'=>'#in-process'} <span style="color: #bbb">// code is not verified, but the session is active</span></p>
          <p>200/JSON {'response'=>'#not-verified'} <span style="color: #bbb">// code is not verified and the session is timed out</span></p>
          <p>200/JSON {'response'=>'#verified'} <span style="color: #bbb">// code is verified; the device now can be used for BIOMIO</span></p>
        
        <br>

        <h4>3. Biometrics data registration </h4>
        <br>
          <p>3.1 Start registration:</p>
          <p>POST to https://biom.io/api/wizard.php/generate_biometrics_code/[providerKey]/[profileId]/[device_id]</p>
          <p><strong>Possible responses:</strong></p>
          <p>200/JSON {'code': '12345678'} <span style="color: #bbb">// code to check the status of registration; biometrics registration will start automatically on the selected device</span></p>
        <br>
          <p>3.2 Check the status of biometrics verification:</p>
          <p>POST to https://biom.io/api/wizard.php/check_status/[providerKey]/[profileId]/[code]</p>
          <p><strong>Possible responses:</strong></p>
          <p>200/JSON {'response'=>'#no-code'} <span style="color: #bbb">// code is invalid</span></p>
          <p>200/JSON {'response'=>'#in-process'} <span style="color: #bbb">// code is not verified, but the session is active</span></p>
          <p>200/JSON {'response'=>'#not-verified'} <span style="color: #bbb">// code is not verified and the session is timed out; registration failed - restart the registration</span></p>
          <p>200/JSON {'response'=>'#verified'} <span style="color: #bbb">// code is verified; biometrics data is successfully registered</span></p>
        <br>

        <h4>4. Extension registration </h4>
        <br>
          <p>4.1 Start registration:</p>
          <p>POST to https://biom.io/api/wizard.php/generate_extension_code/[providerKey]/[profileId]</p>
          <p><strong>Possible responses:</strong></p>
          <p>200/JSON {'code': '12345678'} <span style="color: #bbb">// code to check the status of registration</span></p>
          <p><a href="https://developer.chrome.com/extensions/runtime#method-connect">chrome.runtime</a> is used for communication with extension;</p>
          <p></p>
        <br>
          <p>4.2 Check the status of biometrics verification:</p>
          <p>POST to https://biom.io/api/wizard.php/check_status/[providerKey]/[profileId]/[code]</p>
          <p><strong>Possible responses:</strong></p>
          <p>200/JSON {'response'=>'#no-code'} <span style="color: #bbb">// code is invalid</span></p>
          <p>200/JSON {'response'=>'#in-process'} <span style="color: #bbb">// code is not verified, but the session is active</span></p>
          <p>200/JSON {'response'=>'#not-verified'} <span style="color: #bbb">// code is not verified and the session is timed out; registration failed - restart the registration</span></p>
          <p>200/JSON {'response'=>'#verified'} <span style="color: #bbb">// code is verified; biometrics data is successfully registered</span></p>
        <br>
      </div>
    </div>
</div>


<hr>

<footer class="text-right" style="padding: 0 20px">
    <p>&copy; COPYRIGHT 2015, BIOMIO </p>
    <p>ALL RIGHTS RESERVED</p>
</footer>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
<script src="js/libs/bootstrap.min.js"></script>

<script src="js/main.js"></script>

</body>
</html>