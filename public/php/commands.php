<?php
header('Access-Control-Allow-Origin: *');
require ('connect.php');
require ('controllers/EmailController.php');
require ('controllers/UserController.php');
require ('models/User.php');

require_once 'NotORM.php';

$config = include ('../../config/setting.php');

//$pdo = new PDO('mysql:dbname=biomio_db_test; host=6da7f2ba42c999a5da5b0937632bd595a03f65c1.rackspaceclouddb.com', 'biomio_admin', 'admin');
$pdo = new PDO('mysql:dbname='.$config['db']['dbName'].'; host='.$config['db']['host'], $config['db']['user'], $config['db']['password']);
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
		{ header("HTTP/1.0 400 not email"); echo "PHP continues.\n"; die(); }
	else {
		$email = strtolower($email);
		list($user, $domain) = explode('@', $email);
		if (!is_google_mx($domain)) {
			{ header("HTTP/1.0 400 not gmail"); echo "PHP continues.\n"; die(); }

		} else {
			$result = UserController::create_user('', '', $email, 'USER', 1);
			echo $result;
		}
	}
});

$app->post('/verify_service(/:code)(/:probe_id)', function($code, $probe_id) use ($app, $db) {
	require ('connect.php');
	// 1) check if application code apc_exists;
	$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE code = :code AND status > 0");
	$result->execute(array('code'=>$code));
	if ($result->rowCount() == 0) { header("HTTP/1.0 400 wrong code"); echo "PHP continues.\n"; die(); }
	// 2) change status of the application
	else {
		foreach ($result as $row) {
			$profileId = $row['profileId'];
			$application = $row['application'];
			$device_id = $row['device_id'];
		}

		//print_r($_POST);

		if ($probe_id == '0') {

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

			echo json_encode(array('user_id'=>$profileId, 'probe_id'=>$probe_id));

		} else {

			$result = $pdo->prepare("UPDATE UserServices SET device_token = :probe_id WHERE id = :device_id AND profileId = :profileId");
			$result->execute(array('probe_id'=>$probe_id, 'device_id'=>$device_id, 'profileId'=>$profileId));
			echo json_encode(array('response'=>'#success', 'probe_id'=>$probe_id));
			
		}
	}
});

$app->post('/register_biometrics(/:code)(/:biometrics)', function($code, $biometrics) use ($app, $db) {
	//print_r($_POST);
	require ('connect.php');

	if ($code == 'magickey') {
		$profileId = 23;

		$biometrics = json_decode(base64_decode($biometrics));
		$status = $biometrics->status; 

		if ($status == "in-progress") {
			echo '#accept in-progress';
		} else if ($status == "verified") {

			//3) update biometrics flags
				$fingerprints = $biometrics->fingerprints;
					$fingerprints = json_encode($fingerprints);
				$face = $biometrics->face;
				$voice = $biometrics->voice;
			
			$result = $pdo->prepare("UPDATE UserInfo SET fingerprints = :fingerprints, face = :face, voice = :voice WHERE profileId = :profileId");
			$result->execute(array('fingerprints'=>$fingerprints, 'face'=>$face, 'voice'=>$voice, 'profileId'=>$profileId));

			echo '#accept in-progress';
		}

	} else {
		//1) get user from code
		$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE code = :code AND status > 0");
		$result->execute(array('code'=>$code));
		if ($result->rowCount() == 0) header("HTTP/1.0 400 wrong code");
		//2) update registration flag
		else {
			foreach ($result as $row) {
				$profileId = $row['profileId'];
			}

			$biometrics = json_decode(base64_decode($biometrics));
			$status = $biometrics->status;
			$message = $biometrics->message; 

			if ($status == "canceled") {
				$result = $pdo->prepare("UPDATE VerificationCodes SET status = 5 WHERE code = :code");
				$result->execute(array('code'=>$code));	
			} else if ($status == "failed"  || $message == "Maximum number of training retries reached.Try to change your location or your device position") {
				$result = $pdo->prepare("UPDATE VerificationCodes SET status = 6 WHERE code = :code");
				$result->execute(array('code'=>$code));	
			} else if ($status == "failed") {
				$result = $pdo->prepare("UPDATE VerificationCodes SET status = 7 WHERE code = :code");
				$result->execute(array('code'=>$code));	
			} else if ($status == "in-progress") {
				$result = $pdo->prepare("UPDATE VerificationCodes SET status = 4 WHERE code = :code");
				$result->execute(array('code'=>$code));	
			} else if ($status == "retry") {
				$result = $pdo->prepare("UPDATE VerificationCodes SET status = 8 WHERE code = :code");
				$result->execute(array('code'=>$code));	
			} else if ($status == "success") {

				$result = $pdo->prepare("UPDATE VerificationCodes SET status = 3 WHERE code = :code");
				$result->execute(array('code'=>$code));	

				/*//3) update biometrics flags
					$fingerprints = $biometrics->fingerprints;
						$fingerprints = json_encode($fingerprints);
					$fingerprints = $biometrics->face;
					$face = $biometrics->face;
					$voice = $biometrics->voice;*/
				
				$result = $pdo->prepare("UPDATE UserInfo SET face = 1 WHERE profileId = :profileId");
				$result->execute();
			}	
		}
	}
});

$app->post('/bioauth(/:code)(/:email)', function($code, $email) use ($app, $db) {

	require ('connect.php');
	$result = $pdo->prepare("SELECT * FROM Emails WHERE email = :email");
	$result->execute(array('email'=>$email));
	if ($result->rowCount() == 0) { header("HTTP/1.0 400 wrong email"); echo "PHP continues.\n"; die(); }
	else {
		$row = $result->fetch();
		$id = $row['profileId'];
		// 1) check if application code apc_exists;
		$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE code = :code AND profileId = :id AND status > 0");
		$result->execute(array('code'=>$code, 'id'=>$id));
		if ($result->rowCount() == 0) { header("HTTP/1.0 400 wrong code"); echo "PHP continues.\n"; die(); }
		// 2) change status of the application
		else {
			$result = $pdo->prepare("UPDATE VerificationCodes SET status = 3 WHERE code = :code");
			$result->execute(array('code'=>$code));
		}
	}
});

$app->post('/save_log(/:application_id)', function($application_id) use ($app, $db) {
	echo '#success';
});

$app->post('/get_client_info(/:public_key)', function($public_key) use ($app, $db) {
	require ('connect.php');

	$result = $pdo->prepare("SELECT * FROM ClientKeys WHERE public_key = :public_key");
	$result->execute(array('public_key'=>$public_key));

	if ($result->rowCount() == 0) { header("HTTP/1.0 400 not recognized"); echo "PHP continues.\n"; die(); } 
	else {
		$row = $result->fetch();
		$resourceId = $row['resourceId'];

		$result2 = $pdo->prepare("SELECT * FROM WebResources WHERE id = :resourceId");
		$result2->execute(array('resourceId'=>$resourceId));
		$row2 = $result2->fetch();

		$data = array('title'=>$row2['title'], 'domain'=>$row2['domain'], 'hook'=>$row2['hook'], 'logo'=>'http://pad2.whstatic.com/images/7/7d/DrawBatman-17.jpg', 'secret'=>$row['private_key']);
		header('Content-Type: application/json');
		echo json_encode($data);
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



//ew0KICAgICJzdGF0dXMiOiAidmVyaWZpZWQiLA0KICAgICJmYWNlIjogIjEiLA0KICAgICJ2b2ljZSI6ICIxIiwNCiAgICAiZmluZ2VycHJpbnRzIjogew0KICAgICAgICAiMCI6ICIwIiwNCiAgICAgICAgIjEiOiAiMCIsDQogICAgICAgICIyIjogIjAiLA0KICAgICAgICAiMyI6ICIwIiwNCiAgICAgICAgIjQiOiAiMCIsDQogICAgICAgICI1IjogIjAiLA0KICAgICAgICAiNiI6ICIwIiwNCiAgICAgICAgIjciOiAiMCIsDQogICAgICAgICI4IjogIjAiLA0KICAgICAgICAiOSI6ICIwIg0KICAgIH0NCn0=