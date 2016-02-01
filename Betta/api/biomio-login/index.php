<!DOCTYPE html>
<html>
<head>
    <title>BIOMIO Login</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/css.css">
</head>
<body>

<div class="header">

</div>

<div class="container">
    <div class="row">
      <div class="col-sm-12">
      	<h3>Biometrics Login Integration</h3>
        <br><br>
      	<form class="col-sm-5">
      		<input type="email" class="form-control" placeholder="registered biomio email">
      		<button type="submit" class="btn btn-success btn-block">Submit</button>
          <br>
      		<p class="col-sm-12 text-center message"></p>
      	</form>
      </div>
    </div>
    <div class="row" style="margin-top: 20px">
      <div class="well">
        <h4>1. Verify User Registration</h4>
        <p>You require a simple form which takes registered BIOMIO email address</p>
        <p>This address should be sent via POST request to https://biom.io/api/login.php/email_check/[email]</p>
        <p><strong>Possible responses:</strong></p>
        <p>200/JSON {'response': '#not-found'} <span style="color: #bbb">// email not found</span></p>
        <p>200/JSON {'response': '#no-bio', 'firstName': 'John', 'lastName': 'Smith'} <span style="color: #bbb">// email exists, but biometrics is not registered for this account</span></p>
        <p>200/JSON {'response': '#exists', 'firstName': 'John', 'lastName': 'Smith', 'id'=>'1234', code': '12345678'} <span style="color: #bbb">// email exists</span></p>
        <p><strong>id</strong> is unique identifier for the user which can be used in your database</p>
        <p><strong>firstName</strong> and <strong>lastName</strong> can be used to greet user; those fields can be empty</p>
        <p><strong>code</strong> is a special key created for this login session. This code along with user email should be submitted to the extension</p>

        <br>

        <h4>3. Extension Flow</h4>
        <br>
        <p><a href="https://developer.chrome.com/extensions/runtime#method-connect">chrome.runtime</a> is used for communication with extension;</p>
        <br>
        <p>
          3.1 Send request to extension with connected port: <br>
          <code>var port = chrome.runtime.connect(string extension_id)</code> <br>
          <code>port.postMessage({command: "run_auth", email: "user_email"});</code>
        </p>
        <br>
        <p>
          3.2 Setup your messages listener: <br>
          <code>
            port.onMessage.addListener(function(response){ <br>
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;your response handling here&gt; <br>
            });
          </code>
        </p>
        <br>
        <p>
          3.3 Extension will send you more than one response, here is how they will look like:<br>

          a) Error: <br>
          <code>{ result: false, error: &lt;error_message&gt;, status: 'error'}</code><br>

          b) In progress (Two different in_progress responses):<br>
          first that should tell user that bio is required and he has given amount of time.<br>
          <code>{ message: &lt;message_to_show_to_user>&gt;, timeout: &lt;in_seconds_till_auth_expires&gt;, status: 'in_progress' }</code><br>

          second that should tell user that auth verification started on server:<br>

          <code>{ message: &lt;message_to_show_to_user&gt;, status: 'in_progress' }</code><br>

          c) Completed<br>
          <code>{ result: true, status: 'completed' }</code>
        </p>
        
        <br>

        <h4>3. Login Verification</h4>

        <p>After user's identity is verified extension will return the success message</p>
        <p>To secure login use POST request to https://biom.io/api/login.php/code_check/[code]</p>
        <p><strong>Possible responses:</strong></p>
        <p>200/JSON {'response': '#no-code'} <span style="color: #bbb">// the code is wrong or expired; for example user tried to login from another place which destroyed your current login session</span></p>
        <p>200/JSON {'response': '#not-verified'} <span style="color: #bbb">// user identity is not verified yet</span></p>
        <p>200/JSON {'response': '#verified', 'firstName': 'John', 'lastName': 'Smith', 'id'=>'1234'} <span style="color: #bbb">// user identity is verified and you can log in this user</span></p>
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