<?php function autoVer($url){ echo $url.'?v='.filemtime($url); } ?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
	<title>BIOMIO</title>

  <meta name="Description" CONTENT="Complete, enterprise and cloud-ready, password-less access control.  Any device, anywhere. Drop it in into your active directory infrastructure or plug it into web or mobile application.">
  
  <link rel="shortcut icon" href="favicon.ico" >
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <!--
	<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />
  <link rel="stylesheet" type="text/css" href="css/bootstrap-theme.min.css">-->
  
  <link rel="stylesheet" type="text/css" href="<?php autoVer('css/css.css'); ?>" />
  <link rel="stylesheet" type="text/css" href="<?php autoVer('css/fingerprint-style.css'); ?>" />
  <link rel="stylesheet" type="text/css" href="css/bootstrap-datetimepicker.min.css" />
  <link rel="stylesheet" type="text/css" href="css/tooltipster.css" />
  <link rel="stylesheet" type="text/css" href="css/bootstrap-switch.min.css" />
  
  <!--<link rel="stylesheet" type="text/css" href="css/biomio-style.css" />-->

  <!-- Demid's Design -->
  <link rel='stylesheet' type='text/css' href='css/themes/default/default.css'>
  <link rel="stylesheet" type="text/css" href="<?php autoVer('css/animate.css'); ?>" />
  <link rel="stylesheet" type="text/css" href="<?php autoVer('css/style.css'); ?>">

  <link rel="stylesheet" type="text/css" href="<?php autoVer('css/style2.css'); ?>" />

  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

  <!-- Google Analytics &  ClickDesk Live Chat Service for websites -->
 <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-56617539-1', 'auto');
    ga('send', 'pageview');
  </script>
<!-- 
  <script type='text/javascript'>
    var _glc =_glc || []; _glc.push('all_ag9zfmNsaWNrZGVza2NoYXRyDwsSBXVzZXJzGO-W_aECDA');
    var glcpath = (('https:' == document.location.protocol) ?
    'https://my.clickdesk.com/clickdesk-ui/browser/' : 'http://my.clickdesk.com/clickdesk-ui/browser/');
    var glcp = (('https:' == document.location.protocol) ? 'https://' : 'http://');
    var glcspt = document.createElement('script'); glcspt.type = 'text/javascript'; 
    glcspt.async = true; glcspt.src = glcpath + 'livechat-new.js';
    var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(glcspt, s);
  </script>
   End of Google Analytics & ClickDesk -->
  </head>
<body>

<div id="alert" style="position: fixed; z-index: 100000; margin: 0 auto" class="col-md-12"></div>

<div class='sticker'>
  <a href='https://www.facebook.com/biomio123'>
    <img src='img/home/facebook.png'></a>
  <a href='https://twitter.com/_biomio_'>
    <img src='img/home/twitter.png'></a>
  <a href="./#contact"><img src='img/home/sociallabel.png'></a>
</div>

<div class="header"></div>

<div class="container">
	<div class="row">
		<div id="sidebar" class="col-md-3">
			
		</div>

		<div id="content" class="col-md-9">

    </div>
		
	</div>

</div> <!-- /container -->

<footer class="footer"></footer>

<div class="white_content hide">
  <span class="close-box">x</span>
  <div class="content-div"></div>
</div>
<div id="fade" class="black_overlay hide"></div>

<div class="enable-media hide"></div>

<script src="//code.jquery.com/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="js/libs/moment.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<!--
<script type="text/javascript" src="js/libs/bootstrap.min.js"></script>
-->
<script type="text/javascript" src="js/libs/underscore.js"></script>
<script type="text/javascript" src="js/libs/backbone.js"></script>
<script type="text/javascript" src="js/libs/backbone-validation.js"></script>
<script type="text/javascript" src="js/libs/backbone-paginator.js"></script>
<script type="text/javascript" src="js/libs/bootbox.min.js"></script>
<script type="text/javascript" src="js/libs/bootstrap-datetimepicker.min.js"></script>
<!--<script type="text/javascript" src="js/libs/biomio-style.js"></script>-->
<script type="text/javascript" src="js/libs/jquery.qrcode.min.js"></script>
<script type="text/javascript" src="js/libs/jquery.tooltipster.min.js"></script>
<script type="text/javascript" src="js/libs/bootstrap-switch.min.js"></script>
<script type="text/javascript" src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
<script type="text/javascript" src="js/libs/unslider.js"></script>

<!-- Demid's Design -->
<script src="js/libs/jquery.viewportchecker.js"></script>

<!-- App -->
<script src="<?php autoVer('js/home/app.js'); ?>"></script>

<!-- Views -->
<script src="<?php autoVer('js/home/views/home.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/about.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/googleapp.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/developers.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/mobilebeta.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/contact.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/login.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/settings.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/signup.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/wizard.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/header.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/footer.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/apis.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/splash.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/user.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/provider.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/location.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/website.js'); ?>"></script>
<script src="<?php autoVer('js/home/views/page404.js'); ?>"></script>

<script src="<?php autoVer('js/user/views/user_info.js'); ?>"></script>
<script src="<?php autoVer('js/user/views/user_phone.js'); ?>"></script>
<script src="<?php autoVer('js/user/views/user_services.js'); ?>"></script>
<script src="<?php autoVer('js/user/views/user_mobile_devices.js'); ?>s"></script>
<script src="<?php autoVer('js/user/views/user_fingerprints.js'); ?>"></script>
<script src="<?php autoVer('js/user/views/user_face.js'); ?>"></script>
<script src="<?php autoVer('js/user/views/user_iris.js'); ?>"></script>
<script src="<?php autoVer('js/user/views/user_voice.js'); ?>"></script>
<script src="<?php autoVer('js/user/views/user_resources.js'); ?>"></script>
<script src="<?php autoVer('js/user/views/user_locations.js'); ?>"></script>
<script src="<?php autoVer('js/user/views/user_devices.js'); ?>"></script>
<script src="<?php autoVer('js/user/views/user_reporting.js'); ?>"></script>
<script src="<?php autoVer('js/user/views/user_websites.js'); ?>"></script>

<script src="<?php autoVer('js/provider/views/provider_info.js'); ?>"></script>
<script src="<?php autoVer('js/provider/views/provider_locations.js'); ?>"></script>
<script src="<?php autoVer('js/provider/views/provider_websites.js'); ?>"></script>
<script src="<?php autoVer('js/provider/views/provider_policies.js'); ?>"></script>
<script src="<?php autoVer('js/provider/views/provider_users.js'); ?>"></script>
<script src="<?php autoVer('js/provider/views/provider_devices.js'); ?>"></script>
<script src="<?php autoVer('js/provider/views/provider_reporting.js'); ?>"></script>
<script src="<?php autoVer('js/provider/views/login_implementation.js'); ?>"></script>
<script src="<?php autoVer('js/provider/views/captcha_implementation.js'); ?>"></script>
<script src="<?php autoVer('js/provider/views/provider_api.js'); ?>"></script>

<!-- Models -->
<script src="<?php autoVer('js/home/models/home.js'); ?>"></script>
<script src="<?php autoVer('js/home/models/about.js'); ?>"></script>
<script src="<?php autoVer('js/home/models/contact.js'); ?>"></script>
<script src="<?php autoVer('js/home/models/settings.js'); ?>"></script>
<script src="<?php autoVer('js/home/models/apis.js'); ?>"></script>

<script src="<?php autoVer('js/user/models/user_info.js'); ?>"></script>
<script src="<?php autoVer('js/user/models/user_fingerprints.js'); ?>"></script>
<script src="<?php autoVer('js/user/models/user_face.js'); ?>"></script>
<script src="<?php autoVer('js/user/models/user_iris.js'); ?>"></script>
<script src="<?php autoVer('js/user/models/user_voice.js'); ?>"></script>
<script src="<?php autoVer('js/user/models/user_resources.js'); ?>"></script>
<script src="<?php autoVer('js/user/models/user_locations.js'); ?>"></script>
<script src="<?php autoVer('js/user/models/user_devices.js'); ?>"></script>
<script src="<?php autoVer('js/user/models/user_reporting.js'); ?>"></script>
<script src="<?php autoVer('js/user/models/user_websites.js'); ?>"></script>

<script src="<?php autoVer('js/provider/models/provider_info.js'); ?>"></script>
<script src="<?php autoVer('js/provider/models/provider_locations.js'); ?>"></script>
<script src="<?php autoVer('js/provider/models/provider_websites.js'); ?>"></script>
<script src="<?php autoVer('js/provider/models/provider_policies.js'); ?>"></script>
<script src="<?php autoVer('js/provider/models/provider_users.js'); ?>"></script>
<script src="<?php autoVer('js/provider/models/provider_devices.js'); ?>"></script>
<script src="<?php autoVer('js/provider/models/provider_reporting.js'); ?>"></script>

<!-- Collections -->
<script src="<?php autoVer('js/user/collections/user_info.js'); ?>"></script>
<script src="<?php autoVer('js/user/collections/user_fingerprints.js'); ?>"></script>
<script src="<?php autoVer('js/user/collections/user_face.js'); ?>"></script>
<script src="<?php autoVer('js/user/collections/user_iris.js'); ?>"></script>
<script src="<?php autoVer('js/user/collections/user_voice.js'); ?>"></script>
<script src="<?php autoVer('js/user/collections/user_resources.js'); ?>"></script>
<script src="<?php autoVer('js/user/collections/user_locations.js'); ?>"></script>
<script src="<?php autoVer('js/user/collections/user_devices.js'); ?>"></script>
<script src="<?php autoVer('js/user/collections/user_reporting.js'); ?>"></script>
<script src="<?php autoVer('js/user/collections/user_websites.js'); ?>"></script>

<script src="<?php autoVer('js/provider/collections/provider_info.js'); ?>"></script>
<script src="<?php autoVer('js/provider/collections/provider_locations.js'); ?>"></script>
<script src="<?php autoVer('js/provider/collections/provider_websites.js'); ?>"></script>
<script src="<?php autoVer('js/provider/collections/provider_policies.js'); ?>"></script>
<script src="<?php autoVer('js/provider/collections/provider_users.js'); ?>"></script>
<script src="<?php autoVer('js/provider/collections/provider_devices.js'); ?>"></script>
<script src="<?php autoVer('js/provider/collections/provider_reporting.js'); ?>"></script>

<!-- Supporting files -->
<script src="<?php autoVer('js/forms/avaliable-devices.js'); ?>"></script>
<script src="<?php autoVer('js/forms/avaliable-policies.js'); ?>"></script>
<script src="<?php autoVer('js/forms/avaliable-locations.js'); ?>"></script>
<script src="<?php autoVer('js/forms/paginator.js'); ?>"></script>
<!--<script src="js/forms/biomio-verify.js"></script>-->
<!--<script src="js/forms/fingerprint-common.js"></script>-->
<!--<script src="js/forms/register-fingerprint.js"></script>-->
<!--<script src="js/forms/verify-fingerprint.js"></script>-->

<!-- Routers -->
<script src="<?php autoVer('js/home/main.js'); ?>"></script>
<script src="<?php autoVer('js/home/support.js'); ?>"></script>

<!--<script src="biomio_login/audio/js/audiodisplay.js"></script>-->
<!--<script src="biomio_login/audio/js/recorder.js"></script>-->
<!--<script src="biomio_login/audio/js/main.js"></script>-->

</body>
</html>
