<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

include ('connect.php');
require ('controllers/EmailController.php');

if (isset($_POST['cmd'])) {
	$action = $_POST['cmd'];
	switch($action) {
		case 'googleapp_invitation':
			$name = $_POST['name'];
			$email = $_POST['email'];

			$result = $pdo->prepare("INSERT INTO GoogleAppInvites (name, email) VALUES (:name, :email)");
		  	$result->execute(array('name'=>$name, 'email'=>$email));

			$from = "splash@biom.io";
			$from_name = "BIOMIO";
			$subject = "BIOMIO: New Google App Application";

			$body = file_get_contents("../tpl/emails/NewGoogleAppApplication.html");
			$body = str_replace('%name%', $name, $body);
			$body = str_replace('%email%', $email, $body);

			$to = "alexander.lomov1@gmail.com";
			monkey_mail($to, $subject, $body, $from, $from_name);

			$to = "ditkis@gmail.com";
			monkey_mail($to, $subject, $body, $from, $from_name);

			echo '#success';
		break;
	}
}

if (isset($_GET['u']) && isset($_GET['c'])) {
	$name = $_GET['u'];
	$email = $_GET['c'];

	$name = str_replace('%20', ' ', $name);

	// check if name and email are correct
	$result = $pdo->prepare("SELECT * from GoogleAppInvites WHERE name = :name AND email = :email ORDER BY id DESC");
	$result->execute(array('name'=>$name, 'email'=>$email));
	if ($result->rowCount() == 0) echo "provided data doesn't match with any of the recieved applications";
	else {
		// check if invitation isn't sent already
		$row = $result->fetch();
		$invitation = $row['invitation'];
		if ($invitation == 1) echo "invitation has already been sent to this user";
		else {
			// send invitation
			$from = "splash@biom.io";
			$from_name = "BIOMIO";
			$subject = "BIOMIO: Google App Invitation";

			$body = file_get_contents("../tpl/emails/NewGoogleAppInvitation.html");
			$body = str_replace('%name%', $name, $body);
			$body = str_replace('%email%', $email, $body);

			$to = $email;
			monkey_mail($to, $subject, $body, $from, $from_name);

			// save status of invitation
			$result = $pdo->prepare("UPDATE GoogleAppInvites SET invitation = 1 WHERE name = :name AND email = :email");
			$result->execute(array('name'=>$name, 'email'=>$email));

			 echo "invitation has been sent";
		}
	}
}