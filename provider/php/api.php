<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

if (isset($_POST['cmd'])) {
	
	$cmd = $_POST['cmd'];
	
	switch ($cmd) {

		case 'sign_up':
			$public_key = $_POST['public_key'];
			$private_key = $_POST['private_key'];
			$email = $_POST['email'];
			$time = time();

			$hash = array();
			$hash['time'] = time();
			$hash['public_key'] = $public_key;
			$hash['email'] = $email;
			$hash = json_encode($hash);

			$hash = hash_hmac('sha256', $hash, $private_key);

			$data = array();
			$data['hash'] = $hash;
			$data['time'] = $time;
			$data['public_key'] = $public_key;
			$data['email'] = $email;
			
			$url = "https://biom.io/api/profile.php/sign_up/";
			$content = json_encode($data);

			echo send_post($url, $content);
			
		break;

		case 'update_name':
			$public_key = $_POST['public_key'];
			$private_key = $_POST['private_key'];
			$first_name = $_POST['first_name'];
			$last_name = $_POST['last_name'];
			$profileId = $_POST['profileId'];
			$time = time();

			$hash = array();
			$hash['time'] = time();
			$hash['public_key'] = $public_key;
			$hash['first_name'] = $first_name;
			$hash['last_name'] = $last_name;
			$hash['profileId'] = $profileId;

			$hash = json_encode($hash);

			$hash = hash_hmac('sha256', $hash, $private_key);

			$data = array();
			$data['hash'] = $hash;
			$data['time'] = $time;
			$data['public_key'] = $public_key;
			$data['first_name'] = $first_name;
			$data['last_name'] = $last_name;
			$data['profileId'] = $profileId;
			
			$url = "https://biom.io/api/profile.php/update_name/";
			$content = json_encode($data);

			echo send_post($url, $content); 
			
		break;

		case 'add_mobile_device':
			$public_key = $_POST['public_key'];
			$private_key = $_POST['private_key'];
			$device_name = $_POST['device_name'];
			$profileId = $_POST['profileId'];
			$time = time();

			$hash = array();
			$hash['time'] = time();
			$hash['public_key'] = $public_key;
			$hash['device_name'] = $device_name;
			$hash['profileId'] = $profileId;

			$hash = json_encode($hash);

			$hash = hash_hmac('sha256', $hash, $private_key);

			$data = array();
			$data['hash'] = $hash;
			$data['time'] = $time;
			$data['public_key'] = $public_key;
			$data['device_name'] = $device_name;
			$data['profileId'] = $profileId;
			
			$url = "https://biom.io/api/profile.php/add_mobile_device/";
			$content = json_encode($data);

			echo send_post($url, $content); 
			
		break;

		case 'generate_device_code':
			$public_key = $_POST['public_key'];
			$private_key = $_POST['private_key'];
			$device_id = $_POST['device_id'];
			$profileId = $_POST['profileId'];
			$time = time();

			$hash = array();
			$hash['time'] = time();
			$hash['public_key'] = $public_key;
			$hash['device_id'] = $device_id;
			$hash['profileId'] = $profileId;

			$hash = json_encode($hash);

			$hash = hash_hmac('sha256', $hash, $private_key);

			$data = array();
			$data['hash'] = $hash;
			$data['time'] = $time;
			$data['public_key'] = $public_key;
			$data['device_id'] = $device_id;
			$data['profileId'] = $profileId;
			
			$url = "https://biom.io/api/profile.php/generate_device_code/";
			$content = json_encode($data);

			echo send_post($url, $content); 
			
		break;

		case 'check_status':
			$public_key = $_POST['public_key'];
			$private_key = $_POST['private_key'];
			$code = $_POST['code'];
			$profileId = $_POST['profileId'];
			$time = time();

			$hash = array();
			$hash['time'] = time();
			$hash['public_key'] = $public_key;
			$hash['code'] = $code;
			$hash['profileId'] = $profileId;

			$hash = json_encode($hash);

			$hash = hash_hmac('sha256', $hash, $private_key);

			$data = array();
			$data['hash'] = $hash;
			$data['time'] = $time;
			$data['public_key'] = $public_key;
			$data['code'] = $code;
			$data['profileId'] = $profileId;
			
			$url = "https://biom.io/api/profile.php/check_status/";
			$content = json_encode($data);

			echo send_post($url, $content); 
			
		break;

		case 'generate_biometrics_code':
			$public_key = $_POST['public_key'];
			$private_key = $_POST['private_key'];
			$device_id = $_POST['device_id'];
			$profileId = $_POST['profileId'];
			$time = time();

			$hash = array();
			$hash['time'] = time();
			$hash['public_key'] = $public_key;
			$hash['device_id'] = $device_id;
			$hash['profileId'] = $profileId;

			$hash = json_encode($hash);

			$hash = hash_hmac('sha256', $hash, $private_key);

			$data = array();
			$data['hash'] = $hash;
			$data['time'] = $time;
			$data['public_key'] = $public_key;
			$data['device_id'] = $device_id;
			$data['profileId'] = $profileId;
			
			$url = "https://biom.io/api/profile.php/generate_biometrics_code/";
			$content = json_encode($data);

			echo send_post($url, $content); 
			
		break;

		case 'generate_extension_code':
			$public_key = $_POST['public_key'];
			$private_key = $_POST['private_key'];
			$profileId = $_POST['profileId'];
			$time = time();

			$hash = array();
			$hash['time'] = time();
			$hash['public_key'] = $public_key;
			$hash['profileId'] = $profileId;

			$hash = json_encode($hash);

			$hash = hash_hmac('sha256', $hash, $private_key);

			$data = array();
			$data['hash'] = $hash;
			$data['time'] = $time;
			$data['public_key'] = $public_key;
			$data['profileId'] = $profileId;
			
			$url = "https://biom.io/api/profile.php/generate_extension_code/";
			$content = json_encode($data);

			echo send_post($url, $content); 
			
		break;

		default: 
			echo 'Something is wrong';
		break;
	}
}

function send_post($url, $content) {  

	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_HEADER, false);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPHEADER,
	        array("Content-type: application/json"));
	curl_setopt($curl, CURLOPT_POST, true);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $content);

	$json_response = curl_exec($curl);

	$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

	if ( $status != 200 ) {
	    die("Error: call to URL $url failed with status $status, response $json_response, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
	}


	curl_close($curl);

	return $json_response;
}