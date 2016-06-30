<?php
if(isset($_GET['u']) && isset($_GET['p'])){
  require ($_SERVER["DOCUMENT_ROOT"] . '/php/controllers/UserController.php');
  require ($_SERVER["DOCUMENT_ROOT"] . '/php/controllers/SessionController.php');
  require ($_SERVER["DOCUMENT_ROOT"] . '/php/models/User.php');

  $username = $_GET['u'];
  $temp_pass = $_GET['p'];
  $result = UserController::verify_temporary_user($username, $temp_pass);
  if ($result == 'ADMIN') header("location: /#home");
  else if ($result == 'USER') header ("location: /#user-info");
  else if($result =='PROVIDER') header ("location: /#provider-info");
  else if ($result == 'PARTNER') header ("location: /#partner-how");
  else if ($result == '#no-user') $message = "<h4>There is no match for that username with that temporary password in the system. We cannot proceed.</h4>";
} else $message = "<h4>We've sent password reset instructions to your email address.</h4> If you don't receive instructions within a few minutes, check your email's spam and junk filters.";
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Reset Password</title>
  <link rel="shortcut icon" href="favicon.ico" >
  <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
  <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">
  <link rel="stylesheet" type="text/css" href="css/css.css" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
</head>
<body>

<div class="header">
  <div class="navbar navbar-inverse navbar-static-top" role="banner" style='z-index: 1000;'>
  <div class="container">
    <div class="navbar-header">
      <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#main_menu">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a href="/" class="navbar-brand">BIOMIO</a>
    </div>
    <nav id="main_menu" class="collapse navbar-collapse" role="navigation">
      <ul class="nav navbar-nav">
        <li class='home-menu'><a href="./#">Home</a></li>
        <li class='about-menu'><a href="./#about">About</a></li>
        <li class='contact-menu'><a href="./#contact">Contact</a></li>
        <li class='apis-menu'><a href="./#apis">APIs</a></li>
      </ul>
    </nav>
  </div>
</div>
</div>

<div class="container">

  <div id="content">
    <div class="well col-sm-4 col-sm-offset-4 row">
      <?php echo $message ?>
    </div>
  </div>

</div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
</body>
</html>