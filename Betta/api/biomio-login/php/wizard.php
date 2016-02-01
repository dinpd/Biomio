<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

$providerKey = '7777'; // unique code that connect you to your users
session_start(); // session is used to store profileId

if (isset($_POST['cmd'])) {
	
	$cmd = $_POST['cmd'];
	
	switch ($cmd) {

		case 'sign_up':
			$email = $_POST['email'];

			$command = "sign_up/" . $providerKey . '/' . $email;
			$response = send_post($command);
			$_SESSION['profileId'] = $response['profileId'];
			echo json_encode($response);
		break;

		case 'get_state':
			if (!isset($_SESSION['profileId'])) {echo '#error'; break;}
			else $profileId = $_SESSION['profileId'];

			$command = "get_state/" . $providerKey . '/' . $profileId;
			$response = send_post($command);
			echo json_encode($response);
		break;

		case 'update_name':
			if (!isset($_SESSION['profileId'])) {echo '#error'; break;}
			else $profileId = $_SESSION['profileId'];

			$first_name = $_POST['first_name'];
			$last_name = $_POST['last_name'];

			$command = "update_name/" . $providerKey . '/' . $profileId . '/' . $first_name . '/' . $last_name;
			$response = send_post($command);
			echo json_encode($response);
		break;

		case 'add_mobile_device':
			if (!isset($_SESSION['profileId'])) {echo '#error'; break;}
			else $profileId = $_SESSION['profileId'];

			$device_name = $_POST['device_name'];

			$command = "add_mobile_device/" . $providerKey . '/' . $profileId . '/' . $device_name;
			$response = send_post($command);
			echo json_encode($response);
		break;

		case 'generate_qr_code':
			if (!isset($_SESSION['profileId'])) {echo '#error'; break;}
			else $profileId = $_SESSION['profileId'];

			$device_id = $_POST['device_id'];

			$command = "generate_device_code/" . $providerKey . '/' . $profileId . '/' . $device_id;
			$response = send_post($command);
			echo json_encode($response);
		break;

		case 'generate_biometrics_code':
			if (!isset($_SESSION['profileId'])) {echo '#error'; break;}
			else $profileId = $_SESSION['profileId'];

			$device_id = $_POST['device_id'];

			$command = "generate_biometrics_code/" . $providerKey . '/' . $profileId . '/' . $device_id;
			$response = send_post($command);
			echo json_encode($response);
		break;

		case 'check_status':
			if (!isset($_SESSION['profileId'])) {echo '#error'; break;}
			else $profileId = $_SESSION['profileId'];

			$code = $_POST['code'];

			$command = "check_status/" . $providerKey . '/' . $profileId . '/' . $code;
			$response = send_post($command);
			echo json_encode($response);
		break;

		case 'verify_extension':
			if (!isset($_SESSION['profileId'])) {echo '#error'; break;}
			else $profileId = $_SESSION['profileId'];

			$command = "generate_extension_code/" . $providerKey . '/' . $profileId . '/' . $code;
			$response = send_post($command);
			echo json_encode($response);
		break;

		case 'save_state':
			if (!isset($_SESSION['profileId'])) {echo '#error'; break;}
			else $profileId = $_SESSION['profileId'];

			$state = $_POST['state'];

			$command = "save_state/" . $providerKey . '/' . $profileId . '/' . $state;
			$response = send_post($command);
			echo json_encode($response);
		break;

		default: 
			echo 'Something is wrong';
		break;
	}
}

function send_post($command) {
	$url = "https://biom.io/api/wizard.php/" . $command;

	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_HEADER, false);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPHEADER,
	        array("Content-type: application/json"));
	curl_setopt($curl, CURLOPT_POST, true);

	$json_response = curl_exec($curl);

	$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

	if ( $status != 200 ) {
	    die("Error: call to URL $url failed with status $status, response $json_response, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
	}

	$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

	echo $json_response;
}
