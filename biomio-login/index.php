<!DOCTYPE html>
<html>
<head>
    <title>Title</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/css.css">
</head>
<body>

<div class="header">

</div>

<div class="container">
    <div class="row">
      <div class="col-sm-8 col-sm-offset-2">
      	<h3>Biometrics Login Integration</h3>
      	<form>
      		<input type="email" class="form-control" placeholder="registered biomio email">
      		<button type="submit" class="btn btn-success btn-block">Submit</button>
          <br>
      		<p class="col-sm-12 text-center message"></p>
      	</form>
        <div class="hide">
      	<p>User is asked to enter registered BIOMIO email address</p>
      	<p>This address shoud be sent via POST request to https://biom.io/api/login.php/email_check/[email]</p>
      	<p><strong>Possible responses:</strong></p>
      	<p>200/{'response': '#not-found'} <span style="color: #bbb">// email not found</span></p>
      	<p>200/{'response': '#no-bio', 'name': 'John Smith'} <span style="color: #bbb">// email exists, but biometrics is not registered for this account</span></p>
      	<p>200/{'response': '#valid', 'firstName': 'John', 'lastName': 'Smith', 'login_code': '12345678'} <span style="color: #bbb">// email exists</span></p>
        </div>
      </div>
    </div>
</div>

<div class="footer hide">
    <p>&copy; COPYRIGHT 2015, BIOMIO </p>
    <p>ALL RIGHTS RESERVED.</p>
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
<script src="js/libs/bootstrap.min.js"></script>

<script src="js/main.js"></script>

</body>
</html>