<?php
header('Access-Control-Allow-Origin: *');

$pdo = new PDO('mysql:dbname=biomio_db; host=6da7f2ba42c999a5da5b0937632bd595a03f65c1.rackspaceclouddb.com', 'biomio_admin', 'admin');

$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

require_once '../php/NotORM.php';

$db = new NotORM($pdo);

require '../php/Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->post('/check_email(/:email)', function($email) use ($app, $db) {

	$pdo = new PDO('mysql:dbname=biomio_db; host=6da7f2ba42c999a5da5b0937632bd595a03f65c1.rackspaceclouddb.com', 'biomio_admin', 'admin');
	$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	$result = $pdo->prepare("SELECT * FROM Emails WHERE email = :email");
	$result->execute(array('email'=>$email));

	if ($result->rowCount() == 0)
		echo json_encode(array('response'=>'#not-found'));
	else {
		$row = $result->fetch();
		$profileId = $row['profileId'];

		// get first name and last name
		$result3 = $pdo->prepare("SELECT * FROM UserInfo WHERE profileId = :profileId");
		$result3->execute(array('profileId'=>$profileId));
		$row3 = $result3->fetch();
			$first_name = $row3['firstName'];
			$last_name = $row3['lastName'];
			$face = $row3['face'];

		if ($face == 220) echo json_encode(array('response'=>'#no-bio', 'firstName'=>$first_name, 'lastName'=>$last_name));
		else {
			// disable all the codes for this user
			$result = $pdo->prepare("UPDATE VerificationCodes SET status = :status WHERE profileId = :profileId AND application = :application");
			$result->execute(array('status'=>0, 'profileId'=>$profileId, 'application'=>4));

			// generate code and check that code doesn't exist
			do {
				$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
		    	$code =  substr(str_shuffle($code),0,8);
		    	$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE code = :code");
				$result->execute(array('code'=>$code));
	    	} while ($result->rowCount() > 0);

	    	// insert code
			$result = $pdo->prepare("INSERT INTO VerificationCodes (profileId, device_id, application, status, code, date_created) VALUES (:profileId, :device_id, :application, :status, :code, now())");
			$result->execute(array('profileId'=>$profileId, 'device_id'=>0, 'application'=>3, 'status'=>1, 'code'=>$code));

			if ($result) echo json_encode(array('response'=>'#exists', 'code'=>$code, 'firstName'=>$first_name, 'lastName'=>$last_name, 'id'=>$profileId));
			else echo json_encode(array('response'=>'#error'));
		}
	}
});

$app->post('/check_code(/:code)', function($code) use ($app, $db) {

	$pdo = new PDO('mysql:dbname=biomio_db; host=6da7f2ba42c999a5da5b0937632bd595a03f65c1.rackspaceclouddb.com', 'biomio_admin', 'admin');
	$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE code = :code");
	$result->execute(array('code'=>$code));
	if ($result->rowCount() > 0) {
		foreach ($result as $row) {
			if ($row['status'] == 3) {
				// login
				$profileId = $row['profileId'];
				// get first name and last name
				$result3 = $pdo->prepare("SELECT * FROM UserInfo WHERE profileId = :profileId");
				$result3->execute(array('profileId'=>$profileId));
				$row3 = $result3->fetch();
					$first_name = $row3['firstName'];
					$last_name = $row3['lastName'];

				echo json_encode(array('response'=>'#verified', 'firstName'=>$first_name, 'lastName'=>$last_name, 'id'=>$profileId));

			} else echo json_encode(array('response'=>'#not-verified'));
		}
	} else echo json_encode(array('response'=>'#no-code'));
});

$app->run();
