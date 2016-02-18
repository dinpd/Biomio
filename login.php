<?php

//ini_set('display_errors',1);
//ini_set('display_startup_errors',1);
//error_reporting(-1);

require ('controllers/EmailController.php');
require ('controllers/SessionController.php');
require ('controllers/UserController.php');
require ('models/User.php');

if (isset($_POST['cmd'])) {
	$action = $_POST['cmd'];
	switch($action) {
		case 'check_email':
			$email = $_POST['email'];
			$result = UserController::check_email($email);
			echo $result;
		break;
		
		case 'sign_up':
			//cmd: "sign_up", first_name: first_name, last_name: last_name, email: email
			$type = $_POST['type'];
			$first_name = $_POST['first_name'];
			$last_name = $_POST['last_name'];
			$email = $_POST['email'];
			$result = UserController::create_user($first_name, $last_name, $email, $type, 0);
			echo $result;
		break;

		case 'login_check':
			//cmd: "login_check", email: email
			$email = $_POST['email'];
			$result = UserController::signup_check($email);
			echo $result;
		break;

		case 'generate_bioauth_code':
			$email = $_POST['email'];
			$result = UserController::generate_bioauth_code($email);
			echo $result;
		break;

		case 'check_bioauth_code':
			$code = $_POST['code'];
			$result = UserController::check_bioauth_code($code);
			echo $result;
		break;

		case 'update_name':
			//cmd: "login_check", email: email
			$first_name = $_POST['first_name'];
			$last_name = $_POST['last_name'];
			$result = UserController::update_name($first_name, $last_name);
			echo $result;
		break;


		case 'send_phone_login_code':
			$profileId = $_POST['profileId'];
			$value = $_POST['value'];
			$result = UserController::send_phone_login_code($profileId, $value);
			echo $result;
		break;

		case 'send_email_login_code':
			$profileId = $_POST['profileId'];
			$value = $_POST['value'];
			$result = UserController::send_email_login_code($profileId, $value);
			echo $result;
		break;

		case 'check_login_code':
			$profileId = $_POST['profileId'];
			$code = $_POST['code'];
			$result = UserController::check_login_code($profileId, $code);
			echo $result;
		break;

		case 'guest_login':
			$result = UserController::guest_login();
			echo $result;
		break;

		case 'test_login':
			$result = UserController::test_login();
			echo $result;
		break;

		case 'is_loged_in':
			//cmd: "is_loged_in"
			$result = SessionController::get_user_session();
			echo json_encode($result);
		break;

		case 'get_state':
			$type = $_POST['type'];
			$result = UserController::get_state($type);
			echo $result;
		break;

		case 'save_state':
			$type = $_POST['type'];
			$s = $_POST['s'];
			$result = UserController::save_state($type, $s);
			echo $result;
		break;

		// ------- Other cool stuff ---------

		case 'contact':
			//cmd: "contact", name: name, email: email, message: message
			$name = $_POST['name'];
			$email = $_POST['email'];
			$message = $_POST['message'];
			$result = Email::contact($name, $email, $message);
			echo $result;
		break;

		case 'change_type':
			//cmd: "change_type", type: type
			$type = $_POST['type'];
			$result = UserController::change_type($type);
			echo $result;
		break;

		case 'logout':
			//cmd: "logout"
			$result = SessionController::destroy_session();
			echo $result;
		break;

		// -------- Phone registration ----------

		case 'get_phones':
			//cmd: "send_code", phone: phone
			$result = UserController::get_phones();
			echo $result;
		break;

		case 'send_phone_verification_code':
			//cmd: "send_code", phone: phone
			$phone = $_POST['phone'];
			$result = UserController::send_phone_verification_code($phone);
			echo $result;
		break;

		case 'verify_phone_code':
			//cmd: "verify_code", code: code
			$code = $_POST['code'];
			$result = UserController::verify_phone_code($code);
			echo $result;
		break;

		case 'delete_phone':
			$number = $_POST['number'];
			$result = UserController::delete_phone($number);
			echo $result;
		break;

		// User Services
			// --- Applications --- //
		case 'get_mobile_devices':
			$result = UserController::get_mobile_devices();
			echo $result;
		break;

		case 'add_mobile_device':
			$name = $_POST['name'];
			$result = UserController::add_mobile_device($name);
			echo $result;
		break;

		case 'generate_qr_code':
			$device_id = $_POST['id'];
			$application = $_POST['application'];
			$result = UserController::generate_qr_code($device_id, $application);
			echo $result;
		break;

		case 'generate_biometrics_code':
			$device_id = $_POST['device_id'];;
			$application = $_POST['application'];
			$result = UserController::generate_biometrics_code($device_id, $application);
			echo $result;
		break;

		case 'rename_mobile_device':
			$device_id = $_POST['device_id'];
			$name = $_POST['name'];
			$result = UserController::rename_mobile_device($device_id, $name);
			echo $result;
		break;

		case 'delete_mobile_device':
			$device_id = $_POST['device_id'];
			$result = UserController::delete_mobile_device($device_id);
			echo $result;
		break;

		case 'get_biometrics':
			$biometrics = $_POST['biometrics'];
			$result = UserController::get_biometrics($biometrics);
			echo json_encode($result);
		break;
			// --- Chrome Extention --- //
		case 'get_user_extensions':
			$result = UserController::get_user_extensions();
			echo $result;
		break;
		case 'get_user_emails':
			$extention = $_POST['extention'];
			$result = UserController::get_user_emails($extention);
			echo $result;
		break;

		case 'add_email':
			$email = $_POST['email'];
			$result = UserController::add_email($email);
			echo $result;
		break;

		case 'delete_email':
			$email = $_POST['email'];
			$result = UserController::delete_email($email);
			echo $result;
		break;

		case 'generate_image_code':
			$application = $_POST['application'];
			$result = UserController::generate_image_code($application);
			echo $result;
		break;

			// ------ //

		case 'check_code_status':
			$code = $_POST['code'];

			$result = UserController::check_code_status($code);
			echo $result;
		break;

		case 'code_verified':
			$code = $_POST['code'];
			$result = UserController::code_verified($code);
			echo $result;
		break;

		case 'send_email_verification_code':
			$email = $_POST['email'];
			$result = UserController::send_email_verification_code($email);
			echo $result;
		break;

		case 'verify_email':
			$email = $_POST['email'];
			$code = $_POST['code'];
			$result = UserController::verify_email($email, $code);
			echo $result;
		break;

		case 'verify_extention':
			$result = UserController::verify_extention();
			echo $result;
		break;

		case 'get_extension_settings':
			$result = UserController::get_extension_settings();
			echo $result;
		break;

		case 'change_extention_settings':
			$condition = $_POST['condition'];
			$auth_types = $_POST['auth_types'];
			$user_id = $_SESSION['id'];

			$data = array("condition"=>$condition, "auth_types"=>$auth_types, "user_id"=>$user_id);
			echo json_encode($data);

			// Save settings
			$result = UserController::save_extension_settings(json_encode($data));

			// Send request
			$url = "http://gate.biom.io:90/set_condition/";    
			$content = json_encode($data);
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

			$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

			curl_close($curl);
			$response = json_decode($json_response, true);

			echo $response;
			echo '<br>HTTP code: ' . $httpcode . '<br>';
		break;

		case 'check_status':
			$code = $_POST['code'];

			$result = UserController::check_status($code);
			echo $result;
		break;

		/* API */
		case 'get_api_keys':
			$result = UserController::get_api_keys();
			echo $result;
		break;

		case 'generate_api_key':
			$result = UserController::generate_api_key();
			echo $result;
		break;

		case 'delete_api_key':
			$key = $_POST['key'];

			$result = UserController::delete_api_key($key);
			echo $result;
		break;

		default: 
			echo "#error";
		break;
	}
}