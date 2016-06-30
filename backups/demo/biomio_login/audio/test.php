<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
	<title>Target Login</title>
    <link rel="shortcut icon" href="../favicon.ico" >
  <style>
  </style>
</head>
<body>
Insert BIOMIO Name, Email, or ID <br>
<input class="biomio-name" type="text" placeholder="Name"> <br>
<input class="biomio-email" type="text" placeholder="Email"> <br>
<input class="biomio-id" type="text" placeholder="Id">

<div class="biomio-login"></div>

<div style="width: 400px; height: 20px; font-size: 18px; background: red; font-weight: bold; font-family: Arial;">Extra Security Measure<div>
<div style='width: 400px; height: 70px; font-size: 18px; font-family: Arial;'>
	<div style="width: 100px; height: 100px; display: inline-block">
		<img style="width:70px; height: 70px; margin: 5px" src="http://biom.io/biomio_login/img/fingerprint.png">
	</div>
	<div style="width: 250px; padding: 5px; height: 60px; display: inline-block">
		Confirm that this is you by holding up a finger in front of the webcam!
		<button style="background: green">Go</button>
	</div>
</div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="http://biom.io/biomio_login/biomio-verify.js"></script>
<script>function biomio_success(message){alert(message);}</script>
</body>
</html>