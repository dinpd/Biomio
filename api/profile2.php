<?php
header('Access-Control-Allow-Origin: *');
require ('connect.php');
require ('controllers/EmailController.php');
require ('models/User.php');

require_once 'NotORM.php';

//$pdo = new PDO('mysql:dbname=biomio_db; host=6da7f2ba42c999a5da5b0937632bd595a03f65c1.rackspaceclouddb.com', 'biomio_admin', 'admin');

$db = new NotORM($pdo);

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->post('/create_user(/:email)', function($email) use ($app, $db) {

	$pdo = new PDO('mysql:dbname=biomio_db; host=6da7f2ba42c999a5da5b0937632bd595a03f65c1.rackspaceclouddb.com', 'biomio_admin', 'admin');
	$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	// 1. check if email is in email format
	// 2. check if domain is gmail or googlemail.com (for Germany)
	
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) echo json_encode(array('response'=>'#not email'));
	else {
		$email = strtolower($email);
		list($user, $domain) = explode('@', $email);
		if (!is_google_mx($domain)) echo json_encode(array('response'=>'#not gmail'));
		else {
			
			$result = User::check_email($email);
			if ($result->rowCount() != 0) echo json_encode(array('response'=>'#email exists'));
			else {
				$ip = getenv('REMOTE_ADDR');
		
				// add user
				$profileId= User::add_profile('', '', $email, 'USER', $ip);

				// new email rest
				if ($extention == 0) {
					//echo 'rest';
					$url = 'http://10.209.33.61:91/new_email/' . $email;
					send_post($url);
				}

				// generate verification code
				$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
		    	$code =  substr(str_shuffle($code),0,8);
		    	// save verification code
		    	// TO DO
		    	// send verification email
				Email::welcome_email($email, $first_name, $last_name, $code);

				echo json_encode(array('profileId'=>$profileId));
			}

		}
	}
});

$app->post('/get_state(/:providerKey)(/:profileId)', function($providerKey, $profileId) use ($app, $db) {

	// get state
	$result = User::get_profile($profileId);
	$row = $result->fetch();
	$state = json_decode($row['training']);

	$result = 0;
	$s = 1;
	foreach ($state as $id=>$s) {
		if ($id == $type) $result = $s;
	}

	echo json_encode('state'=>$result);

});

$app->post('/save_state(/:providerKey)(/:profileId)(/:s)', function($providerKey, $profileId, $s) use ($app, $db) {
	// get state
	$result = User::get_profile($profileId);
	$row = $result->fetch();
	$state = json_decode($row['training']);
	$state[0] = $s;
	$state = json_encode($state);

	$result = User::update_profile('training', $state, $profileId);
	echo json_encode('response'=>'#success');
});

$app->post('/update_name(/:providerKey)(/:profileId)(/:first_name)(/:last_name)', function($providerKey, $profileId, $first_name, $last_name) use ($app, $db) {

	$result = User::update_profile('first_name', $first_name, $profileId);
	$result = User::update_profile('last_name', $last_name, $profileId);

	echo json_encode('response'=>'#success');

});

$app->post('/add_mobile_device(/:providerKey)(/:profileId)(/:device_name)', function($providerKey, $profileId, $device_name) use ($app, $db) {

	$device_id = User::add_mobile_device($profileId, $name);
	echo json_encode('device_id'=>$device_id);
});

$app->post('/generate_device_code(/:providerKey)(/:profileId)(/:device_id)', function($providerKey, $profileId, $device_id) use ($app, $db) {

	// disable all the codes for this user
	User::update_verification_codes(0, $profileId, 1);

	// generate code and check that code doesn't exist
	do {
		$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
    	$code =  substr(str_shuffle($code),0,8);
    	$result = User::select_verification_codes($code);
	} while ($result->rowCount() > 0);

	// insert code
	$result = User::insert_verification_codes($profileId, $device_id, 1, 1, $code);
	echo json_encode('code'=>$code);
});

$app->post('/generate_biometrics_code(/:providerKey)(/:profileId)(/:device_id)', function($providerKey, $profileId, $device_id) use ($app, $db) {

	// disable all the codes for this user
	User::update_verification_codes(0, $profileId, 0);

	// get device_token
	$result = User::get_mobile_devices($profileId);
	foreach ($result as $row) {
		if ($row['id'] == $device_id) 
			$key = $row['device_token'];
	}

	do {
		$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
    	$code =  substr(str_shuffle($code),0,8);
    	$result = User::select_verification_codes($code);
	} while ($result->rowCount() > 0);
		//echo 'key: ' . $key;
		$url = 'http://10.209.33.61:91/training?device_id=' . $key . '&code=' . $code;
		//echo $url;
		send_post($url);

	// insert code
	$result = User::insert_verification_codes($profileId, $device_id, 0, 1, $code);
	echo json_encode('code'=>$code);
});

$app->post('/generate_extension_code(/:providerKey)(/:profileId)', function($providerKey, $profileId) use ($app, $db) {
	// disable all the codes for this user
	User::update_verification_codes(0, $profileId, 2);

	// generate code and check that code doesn't exist
	do {
		$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
    	$code =  substr(str_shuffle($code),0,8);
    	$result = User::select_verification_codes($code);
	} while ($result->rowCount() > 0);

	// insert code
	$result = User::insert_verification_codes($profileId, 0, 2, 1, $code);

	if ($result) echo json_encode(array('code'=>$code));
});

$app->post('/check_status(/:providerKey)(/:profileId)(/:code)', function($providerKey, $profileId, $code) use ($app, $db) {
	$result = User::select_verification_codes($code);
	if ($result->rowCount() > 0) {
		foreach ($result as $row) {
			if ($row['status'] == 4) echo json_encode(array('response'=>'#in-process'));
			if ($row['status'] == 3) echo json_encode(array('response'=>'#verified'));
			else echo json_encode(array('response'=>'#not-verified'));
		}
	} else echo json_encode(array('response'=>'#no-code'));
});

$app->run();

function send_post($url) {
	//echo $url;
	$data = array();

	# Create a connection
	$ch = curl_init($url);

	# Form data string
	$postString = http_build_query($data, '', '&');

	# Setting our options
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $postString);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	# Get the response
	$response = curl_exec($ch);
	curl_close($ch);
}

