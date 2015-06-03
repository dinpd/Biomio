<?php
header('Access-Control-Allow-Origin: *');
require ('connect.php');
require ('controllers/EmailController.php');
require ('controllers/UserController.php');
require ('models/User.php');

require_once 'NotORM.php';

$pdo = new PDO('mysql:dbname=biom_website;host=localhost', 'biom_admin', 'uFa-rEm-6a8-fuD');

$db = new NotORM($pdo);

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();
/*
// Verify Applicaton
$app->get('/verify_application(/:code)', function($code) use ($app, $db) {
	// select from Applications getting user_id
	$result = $pdo->prepare("SELECT profileId, application, device_id FROM VerificationCodes WHERE code = :code AND status = 1 AND date_created > DATE_SUB(now(), INTERVAL 15 MINUTE)");
	$result->execute(array('code'=>$code));
	if ($result->rowCount() == 0) return json_encode(array('response'=>false);
	else {
		$row = $result->fetch();
		$profileId = $row['profileId'];
		$application = $row['application'];
		$device_id = $row['application'];
		
		if ($application_id == 1) {
			// for mobile application we update status of the existing row
			$result = $pdo->prepare("UPDATE UserServices SET status = 1 WHERE id = :device_id");
			$result->execute(array(':device_id'));
		} else if ($application_id == 2) {
			// for chrome extention we create a new row
			$result = $pdo->prepare("INSERT INTO UserServices (profileId, serviceId, title) VALUES (:profileId, :application_id, 'Chrome Extention')");
			$result->execute(array('profileId'=>$profileId, 'application_id'=>$application_id));
		}

		return json_encode(array('response'=>true, 'user_id'=>$profileId);
	}

	// update Applications setting status to 2

	$result = $pdo->prepare("UPDATE TempEmailCodes (profileId, code, email, date_created) VALUES (:profileId, :code, :email, now())");
	$result->execute(array('profileId'=>$profileId, 'code'=>$code, 'email'=>$email));
	return $result;
});

// Accept Biometrics
$app->post('/add_face(/:user_id)', function($user_id) use ($app, $db) {
	$biometrics = $_POST['biometrics'];

	$result = $pdo->prepare("INSERT INTO TempEmailCodes (profileId, code, email, date_created) VALUES (:profileId, :code, :email, now())");
	$result->execute(array('profileId'=>$profileId, 'code'=>$code, 'email'=>$email));
	return $result;
});
*/
$app->post('/get_user(/:email)', function($email) use ($app, $db) {
	// 1. check if email is in email format
	// 2. check if domain is gmail or googlemail.com (for Germany)
	
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) 
		header("HTTP/1.0 400 not email");
	else {
		$email = strtolower($email);
		list($user, $domain) = explode('@', $email);
		if ($domain != 'gmail.com' && $domain != 'googlemail.com') {
			header("HTTP/1.0 400 not gmail");
		} else {
			$result = UserController::create_user('', '', $email, 'USER', 1);
			echo $result;
		}
	}
});

$app->post('/verify_service(/:code)', function($code) use ($app, $db) {
	require ('connect.php');
	// 1) check if application code apc_exists;
	$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE code = :code AND status > 0");
	$result->execute(array('code'=>$code));
	if ($result->rowCount() == 0) header("HTTP/1.0 400 wrong code");
	// 2) change status of the application
	else {
		foreach ($result as $row) {
			$profileId = $row['profileId'];
			$application = $row['application'];
			$device_id = $row['device_id'];
		}

		if (isset($_POST['probe_id'])) {
			$key = $_POST['probe_id'];
			$result = $pdo->prepare("UPDATE UserServices SET device_token = :key WHERE id = :device_id AND profileId = :profileId");
			$result->execute(array('key'=>$key, 'device_id'=>$device_id, 'profileId'=>$profileId));
			echo json_encode(array('response'=>'#success'));
		} else {

			$result = $pdo->prepare("UPDATE VerificationCodes SET status = 3 WHERE code = :code");
			$result->execute(array('code'=>$code));

			// 3 add new service

			if ($application == 1) {
				$result = $pdo->prepare("UPDATE UserServices SET status = 1 WHERE id = :device_id AND profileId = :profileId");
				$result->execute(array('device_id'=>$device_id, 'profileId'=>$profileId));
			} else if ($application == 2) {
				$result = $pdo->prepare("INSERT INTO UserServices (profileId, serviceId, status) VALUES (:profileId, :serviceId, 1)");
				$result->execute(array('profileId'=>$profileId, 'serviceId'=>$application));
			}

			echo json_encode(array('user_id'=>$profileId));
		}
	}
});

$app->post('/register_biometrics(/:code)', function($code) use ($app, $db) {
	require ('connect.php');
	//1) get user from code
	$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE code = :code AND status = 1");
	$result->execute(array('code'=>$code));
	if ($result->rowCount() == 0) header("HTTP/1.0 400 wrong code");
	//2) update registration flag
	else {
		foreach ($result as $row) {
			$profileId = $row['profileId'];
		}

		$result = $pdo->prepare("UPDATE VerificationCodes SET status = 3 WHERE code = :code");
		$result->execute(array('code'=>$code));	

		//3) update biometrics flags
			$fingerprints = json_encode($_POST['fingerprints']);
			$face = $_POST['face'];
			$voice = $_POST['voice'];
		
		$result = $pdo->prepare("UPDATE UserInfo SET fingerprints = :fingerprints, face = :face, voice = :voice WHERE profileId = :profileId");
		$result->execute(array('fingerprints'=>$fingerprints, 'face'=>$face, 'voice'=>$voice, 'profileId'=>$profileId));	
	}

	
});

$app->get('/test', function() use ($app, $db) {
	echo json_encode(array('response'=>true));
});

$app->post('/test(/:email)', function($email) use ($app, $db) {
	echo json_encode(array('response'=>true));

	$myfile = fopen("test.txt", "w") or die("Unable to open file!");
	$txt = $email;
	fwrite($myfile, $txt);
	fclose($myfile);
});

$app->run();

/*
$application_id = 2;
$code = '0EaUgjKW';

$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE status = 1 AND application_id = :application_id AND code = :code AND date_created > DATE_SUB(now(), INTERVAL 15 MINUTE");
$result->execute(array('application_id' => $application_id, 'code' => $code));

$data = array('result' => false);

foreach ($result as $row) {
	$data['user_id'] = $row['user_id'];
	$data['result'] = true;
}
*/

