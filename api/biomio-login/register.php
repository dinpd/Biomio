<!DOCTYPE html>
<html>
<head>
    <title>BIOMIO Wizard</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/css.css">
    <link rel="stylesheet" href="css/prettify/prettify.css">

    <style>
      .public_key { width: 150px; }
      .private_key { width: 150px; }
      .email { width: 150px; }
      .profileId { width: 150px; }
      .first_name { width: 150px; }
      .last_name { width: 150px; }
      .device_name { width: 150px; }
      .device_id { width: 150px; }
      .code { width: 150px; }
      .code-2 { width: 150px; }
      .code-3 { width: 150px; }
      
      
    </style>

</head>
<body>

<div class="header">

</div>

<div class="container">

  <h2 class="col-sm-12 text-center" style="margin: 40px">BIOMIO Registration API</h2>

  <div class="row">
      <div class="well">
        <h4>1. Start working with BIOMIO API</h4>
        <p>To begin with BIOMIO API you need to register as Provider at <a href="https://biom.io">biom.io</a> and generate your API keys at <a href="https://biom.io/#provider-api">biom.io/#provider-api</a></p>
        
        <button class="btn btn-primary try doc">try it yourself</button>
        <button class="btn btn-default try-hide test hide">hide forms</button><br>
        <input type="text" class="public_key test hide" placeholder="public key"><br>
        <input type="text" class="private_key test hide" placeholder="private key">

        <br>

        <h4>2. Register a new user</h4>
        <p class="text-primary">Before making the REST API call, hash (HMAC-SHA1) all the data in the request with provider private key.</p>
        <p>To register a new user you need to user gmail associated email address</p>
        <p><code>POST: https://biom.io/api/register/sign_up/</code></p>
        <p><code>{hash: hash, time: time, 
            public_key: <span class="doc">public_key</span><input type="text" class="public_key test hide" placeholder="public key">, 
            email: <span class="doc">email</span><input type="text" class="email test hide" placeholder="user email">
            }</code><button type="button" class="btn btn-success send-1 test hide">send</button></p>
        <div class="response test hide"><pre class="prettyprint response-1">...</pre></div>
        <br>
        <p><strong>Possible responses:</strong></p>
        <p>{'response': '#not email'} <span style="color: #bbb">// email is in a wrong format</span></p>
        <p>{'response': '#not gmail'} <span style="color: #bbb">// provided email is not gmail or gmail associated</span></p>
        <p>{'response': '#email exists'} <span style="color: #bbb">// we already have a user registered with this email</span></p>
        <p>{'response': '#success', 'profileId': '12345678'} <span style="color: #bbb">// BIOMIO unique user id</span></p>

        <br>

        <h4>3. Update user information</h4>
        <br>
          <p>3.1 Update name:</p>
          <p><code>POST: https://biom.io/api/register/update_name/</code></p>
          <p><code>{hash: hash, time: time, 
              public_key: <span class="doc">public_key</span><input type="text" class="public_key test hide" placeholder="user public key">, 
              profileId: <span class="doc">profileId</span><input type="text" class="profileId test hide" placeholder="user id">, 
              first_name: <span class="doc">first_name</span><input type="text" class="first_name test hide" placeholder="user first name">, 
              last_name: <span class="doc">last_name</span><input type="text" class="last_name test hide" placeholder="user last name">
            }</code><button type="button" class="btn btn-success send-2 test hide">send</button></p>
          <div class="response test hide"><pre class="prettyprint response-2">...</pre></div>
          <br>
          <p><strong>Possible responses:</strong></p>
          <p>{'response': '#success'} <span style="color: #bbb">// name is updated</span></p>
          <p>{'response': '#user'} <span style="color: #bbb">// this user is not associated with you</span></p>
        <br>
          <p>3.2 Add new mobile device:</p>
          <p><code>POST: https://biom.io/api/register/add_mobile_device/</code></p>
          <p><code>{hash: hash, time: time, 
              public_key: <span class="doc">public_key</span><input type="text" class="public_key test hide" placeholder="user public key">, 
              profileId: <span class="doc">profileId</span><input type="text" class="profileId test hide" placeholder="user id">, 
              device_name: <span class="doc">device_name</span><input type="text" class="device_name test hide" placeholder="device name">
            }</code></p><button type="button" class="btn btn-success send-3 test hide">send</button></p>
          <div class="response test hide"><pre class="prettyprint response-3">...</pre></div>
          <br>
          <p><strong>Possible responses:</strong></p>
          <p>{'response': '#success', 'device_id': '12345678'} <span style="color: #bbb">// id of registered device (unverified)</span></p>
          <p>{'response': '#user'} <span style="color: #bbb">// this user is not associated with you</span></p>
        <br>
          <p>3.3 Register mobile device:</p>
          <p><code>POST: https://biom.io/api/register/generate_device_code/</code></p>
          <p><code>{hash: hash, time: time, 
              public_key: <span class="doc">public_key</span><input type="text" class="public_key test hide" placeholder="user public key">, 
              profileId: <span class="doc">profileId</span><input type="text" class="profileId test hide" placeholder="user id">, 
              device_id: <span class="doc">device_id</span><input type="text" class="device_id test hide" placeholder="device id">
            }</code></p><button type="button" class="btn btn-success send-4 test hide">send</button></p>
          <div class="response test hide"><pre class="prettyprint response-4">...</pre></div>
          <br>
          <p><strong>Possible responses:</strong></p>
          <p>{'response': '#success', 'code': '12345678'} <span style="color: #bbb">// code to check device verification</span></p>
          <p>{'response': '#user'} <span style="color: #bbb">// this user is not associated with you</span></p>
          <p>User need to open BIOMIO application and enter the code or you can use qrcode.js library to create a qr code that can be scanned by the application.
        <br>
          <p>3.4 Check the status of device verification:</p>
          <p><code>POST: https://biom.io/api/register/check_status/</code></p>
          <p><code>{hash: hash, time: time, 
              public_key: <span class="doc">public_key</span><input type="text" class="public_key test hide" placeholder="user public key">, 
              profileId: <span class="doc">profileId</span><input type="text" class="profileId test hide" placeholder="user id">, 
              code: <span class="doc">code</span><input type="text" class="code test hide" placeholder="code">
            }</code></p><button type="button" class="btn btn-success send-5 test hide">send</button></p>
          <div class="response test hide"><pre class="prettyprint response-5">...</pre></div>
          <br>
          <p><strong>Possible responses:</strong></p>
          <p>{'response': '#user'} <span style="color: #bbb">// this user is not associated with you</span></p>
          <p>{'response': '#no-code'} <span style="color: #bbb">// code is invalid</span></p>
          <p>{'response': '#in-process'} <span style="color: #bbb">// code is not verified, but the session is active</span></p>
          <p>{'response': '#not-verified'} <span style="color: #bbb">// code is not verified and the session is timed out</span></p>
          <p>{'response': '#verified'} <span style="color: #bbb">// code is verified; the device now can be used for BIOMIO</span></p>
        <br>

        <h4>4. Biometrics data registration </h4>
        <br>
          <p>4.1 Start registration:</p>
          <p><code>POST: https://biom.io/api/register/generate_biometrics_code/</code></p>
          <p><code>{hash: hash, time: time, 
              public_key: <span class="doc">public_key</span><input type="text" class="public_key test hide" placeholder="user public key">, 
              profileId: <span class="doc">profileId</span><input type="text" class="profileId test hide" placeholder="user id">, 
              device_id: <span class="doc">device_id</span><input type="text" class="device_id test hide" placeholder="device id">
            }</code></p><button type="button" class="btn btn-success send-6 test hide">send</button></p>
          <div class="response test hide"><pre class="prettyprint response-6">...</pre></div>
          <br>
          <p><strong>Possible responses:</strong></p>
          <p>{'code': '12345678'} <span style="color: #bbb">// code to check the status of registration; biometrics registration will start automatically on the selected device</span></p>
          <p>{'response': '#user'} <span style="color: #bbb">// this user is not associated with you</span></p>
        <br>
          <p>4.2 Check the status of biometrics verification:</p>
          <p><code>POST: https://biom.io/api/register/check_status/</code></p>
          <p><code>{hash: hash, time: time, 
              public_key: <span class="doc">public_key</span><input type="text" class="public_key test hide" placeholder="user public key">, 
              profileId: <span class="doc">profileId</span><input type="text" class="profileId test hide" placeholder="user id">, 
              code: <span class="doc">code</span><input type="text" class="code-2 test hide" placeholder="code">
            }</code></p><button type="button" class="btn btn-success send-7 test hide">send</button></p>
          <div class="response test hide"><pre class="prettyprint response-7">...</pre></div>
          <br>
          <p><strong>Possible responses:</strong></p>
          <p>{'response': '#user'} <span style="color: #bbb">// this user is not associated with you</span></p>
          <p>{'response': '#no-code'} <span style="color: #bbb">// code is invalid</span></p>
          <p>{'response': '#in-process'} <span style="color: #bbb">// code is not verified, but the session is active</span></p>
          <p>{'response': '#not-verified'} <span style="color: #bbb">// code is not verified and the session is timed out; registration failed - restart the registration</span></p>
          <p>{'response': '#verified'} <span style="color: #bbb">// code is verified; biometrics data is successfully registered</span></p>
        <br>

        <h4>5. Extension registration </h4>
        <br>
          <p>5.1 Start registration:</p>
          <p><code>POST: https://biom.io/api/register/generate_extension_code/</code></p>
          <p><code>{hash: hash, time: time, 
              public_key: <span class="doc">public_key</span><input type="text" class="public_key test hide" placeholder="user public key">, 
              profileId: <span class="doc">profileId</span><input type="text" class="profileId test hide" placeholder="user id">, 
            }</code></p><button type="button" class="btn btn-success send-8 test hide">send</button></p>
          <div class="response test hide"><pre class="prettyprint response-8">...</pre></div>
          <br>
          <p><strong>Possible responses:</strong></p>
          <p>{'code': '12345678'} <span style="color: #bbb">// code to check the status of registration</span></p>
          <p>{'response': '#user'} <span style="color: #bbb">// this user is not associated with you</span></p>
          <p><a href="https://developer.chrome.com/extensions/runtime#method-connect">chrome.runtime</a> is used for communication with extension;</p>
          <p></p>
        <br>
          <p>5.2 Check the status of biometrics verification:</p>
          <p><code>POST: https://biom.io/api/register/check_status/</code></p>
          <p><code>{hash: hash, time: time, 
              public_key: <span class="doc">public_key</span><input type="text" class="public_key test hide" placeholder="user public key">, 
              profileId: <span class="doc">profileId</span><input type="text" class="profileId test hide" placeholder="user id">, 
              code: <span class="doc">code</span><input type="text" class="code-3 test hide" placeholder="code">
            }</code></p><button type="button" class="btn btn-success send-9 test hide">send</button></p>
          <div class="response test hide"><pre class="prettyprint response-9">...</pre></div>
          <br>
          <p><strong>Possible responses:</strong></p>
          <p>{'response': '#user'} <span style="color: #bbb">// this user is not associated with you</span></p>
          <p>{'response': '#no-code'} <span style="color: #bbb">// code is invalid</span></p>
          <p>{'response': '#in-process'} <span style="color: #bbb">// code is not verified, but the session is active</span></p>
          <p>{'response': '#not-verified'} <span style="color: #bbb">// code is not verified and the session is timed out; registration failed - restart the registration</span></p>
          <p>{'response': '#verified'} <span style="color: #bbb">// code is verified; biometrics data is successfully registered</span></p>
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
<script src="css/prettify/prettify.js"></script>

</body>
</html>



