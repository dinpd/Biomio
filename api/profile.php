<?php
header('Access-Control-Allow-Origin: *');

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);
require 'vendor/autoload.php';

require ('../php/connect.php');
require ('../php/controllers/EmailController.php');
require ('../php/controllers/UserController.php');
require ('../php/models/User.php');

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->post('/sign_up/', function() use ($app) {
	$post = json_decode(file_get_contents("php://input"));
	
	$hash = $post->hash;
	$time = $post->time;
	$public_key = $post->public_key;
	$email = $post->email;

	if (time() > $time + 5 * 60) {
		echo json_encode(array('response'=>'#time'));
	} else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { 
		echo json_encode(array('response'=>'#not gmail'));
	} else {
		$email = strtolower($email);
		list($user, $domain) = explode('@', $email);
		if (!is_google_mx($domain)) {
			echo json_encode(array('response'=>'#not email'));
		} else {
			$result = UserController::create_user('', '', $email, 'USER', 1);
			if ($result == '#email')
				echo json_encode(array('response'=>'#email exists'));
			else 
				echo json_encode(array('response'=>'#success', 'profileId'=>$result));
		}
	}
});

$app->post('/update_name/', function() use ($app) {
	require ('../php/connect.php');

	$post = json_decode(file_get_contents("php://input"));
	
	$hash = $post->hash;
	$time = $post->time;
	$public_key = $post->public_key;
	$profileId = $post->profileId;
	$first_name = $post->first_name;
	$last_name = $post->last_name;

	if (time() > $time + 5 * 60) {
		echo json_encode(array('response'=>'#time'));
	} else {
		$result = $pdo->prepare("UPDATE UserInfo SET firstName = :firstName, lastName = :lastName  WHERE profileId = :profileId");
  		$result->execute(array('profileId'=>$profileId, 'lastName'=>$last_name, 'firstName'=>$first_name)); 
  		echo json_encode(array('response'=>'#success'));
	}
});

$app->post('/add_mobile_device/', function() use ($app) {
	require ('../php/connect.php');

	$post = json_decode(file_get_contents("php://input"));
	
	$hash = $post->hash;
	$time = $post->time;
	$public_key = $post->public_key;
	$profileId = $post->profileId;
	$device_name = $post->device_name;

	if (time() > $time + 5 * 60) {
		echo json_encode(array('response'=>'#time'));
	} else {
		$result = $pdo->prepare("INSERT INTO UserServices (profileId, serviceId, title) VALUES (:profileId, 1, :name)");
		$result->execute(array('profileId'=>$profileId, 'name'=>$device_name));
		$device_id = $pdo->lastInsertId();

		echo json_encode(array('response'=>'#success', 'device_id'=>$device_id));
	}
});

$app->post('/generate_device_code/', function() use ($app) {
	require ('../php/connect.php');

	$post = json_decode(file_get_contents("php://input"));
	
	$hash = $post->hash;
	$time = $post->time;
	$public_key = $post->public_key;
	$profileId = $post->profileId;
	$device_id = $post->device_id;

	if (time() > $time + 5 * 60) {
		echo json_encode(array('response'=>'#time'));
	} else {
		// update verification codes
		$result = $pdo->prepare("UPDATE VerificationCodes SET status = :status WHERE profileId = :profileId AND application = :application");
		$result->execute(array('status'=>0, 'profileId'=>$profileId, 'application'=>1));

		// generate code and check that code doesn't exist
		do {
			$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
	    	$code =  substr(str_shuffle($code),0,8);
	    	$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE code = :code");
			$result->execute(array('code'=>$code));
    	} while ($result->rowCount() > 0);

    	// insert code
		$result = $pdo->prepare("INSERT INTO VerificationCodes (profileId, device_id, application, status, code, date_created) VALUES (:profileId, :device_id, :application, :status, :code, now())");
		$result->execute(array('profileId'=>$profileId, 'device_id'=>$device_id, 'application'=>1, 'status'=>1, 'code'=>$code));
	
		
		echo json_encode(array('response'=>'#success', 'code'=>$code));
	}
});

$app->post('/check_status/', function() use ($app) {
	require ('../php/connect.php');

	$post = json_decode(file_get_contents("php://input"));
	
	$hash = $post->hash;
	$time = $post->time;
	$public_key = $post->public_key;
	$profileId = $post->profileId;
	$code = $post->code;

	if (time() > $time + 5 * 60) {
		echo json_encode(array('response'=>'#time'));
	} else {
		$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE code = :code");
		$result->execute(array('code'=>$code));
		if ($result->rowCount() > 0) {
			foreach ($result as $row) {
				if ($row['status'] == 5) echo json_encode(array('response'=>'#canceled'));
				if ($row['status'] == 6) echo json_encode(array('response'=>'#failed1'));
				if ($row['status'] == 7) echo json_encode(array('response'=>'#failed2'));
				if ($row['status'] == 8) echo json_encode(array('response'=>'#retry'));

				if ($row['status'] == 4) echo json_encode(array('response'=>'#in-process'));
				if ($row['status'] == 3) echo json_encode(array('response'=>'#verified'));
				else echo json_encode(array('response'=>'#not-verified'));
			}
		} else echo json_encode(array('response'=>'#no-code'));
	}
});

$app->post('/generate_biometrics_code/', function() use ($app) {
	require ('../php/connect.php');

	$post = json_decode(file_get_contents("php://input"));
	
	$hash = $post->hash;
	$time = $post->time;
	$public_key = $post->public_key;
	$profileId = $post->profileId;
	$device_id = $post->device_id;

	if (time() > $time + 5 * 60) {
		echo json_encode(array('response'=>'#time'));
	} else {
		// update verification codes
		$result = $pdo->prepare("UPDATE VerificationCodes SET status = :status WHERE profileId = :profileId AND application = :application");
		$result->execute(array('status'=>0, 'profileId'=>$profileId, 'application'=>1));

		// get device_token
		$result = $pdo->prepare("SELECT id, title, status, device_token FROM UserServices WHERE profileId = :profileId AND serviceId = 1");
		$result->execute(array('profileId'=>$profileId));
		foreach ($result as $row) {
			if ($row['id'] == $device_id) 
				$key = $row['device_token'];
		}

		// generate code and check that code doesn't exist
		do {
			$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
	    	$code =  substr(str_shuffle($code),0,8);
	    	$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE code = :code");
			$result->execute(array('code'=>$code));
    	} while ($result->rowCount() > 0);
		$url = 'http://10.209.33.61/training?device_id=' . $key . '&code=' . $code;
		send_post($url);

    	// insert code
		$result = $pdo->prepare("INSERT INTO VerificationCodes (profileId, device_id, application, status, code, date_created) VALUES (:profileId, :device_id, :application, :status, :code, now())");
		$result->execute(array('profileId'=>$profileId, 'device_id'=>$device_id, 'application'=>1, 'status'=>1, 'code'=>$code));

		echo json_encode(array('response'=>'#success', 'code'=>$code));
	}
});

$app->post('/generate_extension_code/', function() use ($app) {
	require ('../php/connect.php');

	$post = json_decode(file_get_contents("php://input"));
	
	$hash = $post->hash;
	$time = $post->time;
	$public_key = $post->public_key;
	$profileId = $post->profileId;

	if (time() > $time + 5 * 60) {
		echo json_encode(array('response'=>'#time'));
	} else {
		// update verification codes
		$result = $pdo->prepare("UPDATE VerificationCodes SET status = :status WHERE profileId = :profileId AND application = :application");
		$result->execute(array('status'=>0, 'profileId'=>$profileId, 'application'=>1));

		// generate code and check that code doesn't exist
		do {
			$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
	    	$code =  substr(str_shuffle($code),0,8);
	    	$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE code = :code");
			$result->execute(array('code'=>$code));
    	} while ($result->rowCount() > 0);

    	// insert code
		$result = $pdo->prepare("INSERT INTO VerificationCodes (profileId, device_id, application, status, code, date_created) VALUES (:profileId, :device_id, :application, :status, :code, now())");
		$result->execute(array('profileId'=>$profileId, 'device_id'=>0, 'application'=>2, 'status'=>1, 'code'=>$code));

		echo json_encode(array('response'=>'#success', 'code'=>$code));
	}
});

$app->run();
