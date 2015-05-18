<?php
require ('controllers/EmailController.php');
require ('controllers/SessionController.php');
require ('controllers/UserController.php');
require ('models/User.php');

if (isset($_POST['cmd'])) {
	$action = $_POST['cmd'];
	switch($action) {
		case 'verify_email':
			$email = $_POST['email'];
			$result = UserController::find_user('emails', $email);
			echo $result;
		break;

		case 'verify_username':
			$username = $_POST['username'];
			$result = UserController::find_user('name', $username);
			echo $result;
		break;
		
		case 'sign_up':
			//cmd: "sign_up", first_name: first_name, last_name: last_name, email: email, password: password, type: type
			$type = $_POST['type'];
			if ($type = 'USER') {
				$username = $_POST['username'];
				$first_name = $_POST['first_name'];
				$last_name = $_POST['last_name'];
				$email = $_POST['email'];
				$password = 'qwerty1234';
				$result = UserController::create_user($username, $first_name, $last_name, $email, $password, $type);
			} else if ($type = 'PROVIDER') {
				$username = $_POST['username'];
				$name = $_POST['name'];
				$email = $_POST['email'];
				$password = 'qwerty1234';
				$result = UserController::create_provider($username, $name, $email, $password, $type);
			}
			echo $result;
		break;

		case 'login':
			//cmd: "login", email: email, password: password, remember: remember
			$email = $_POST['email'];
			$password = $_POST['password'];
			$remember = $_POST['remember'];
			$result = UserController::verify_user($email, $password);
			echo $result;
		break;

		case 'is_loged_in':
			//cmd: "is_loged_in"
			$result = SessionController::get_user_session();
			echo json_encode($result);
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

		case 'reset_password':
			//cmd: "reset_password", email: email, username: username
			$email = $_POST['email'];
			$username = $_POST['username'];
			$result = UserController::temp_pass($email, $username);
			echo $result;
		break;

		case 'change_password':
			//cmd: "change_password", old_pass: old_password, new_pass: new_password
			$old_pass = $_POST['old_pass'];
			$new_pass = $_POST['new_pass'];
			$result = UserController::change_pass($old_pass, $new_pass);
			echo $result;
		break;

		case 'update_api_id':
			//cmd: "update_api_id", profileId: profileId, api_id: api_id
			$profileId = $_POST['profileId'];
			$api_id = $_POST['api_id'];
			$result = UserController::update_api_id($profileId, $api_id);
			echo $result;
		break;

		case 'biomio_login':
			//cmd: "biomio_login", api_id: api_id
			$api_id = $_POST['api_id'];
			$result = UserController::biomio_login($api_id);
			echo $result;
		break;

		case 'contact':
			//cmd: "contact", name: name, email: email, message: message
			$name = $_POST['name'];
			$email = $_POST['email'];
			$message = $_POST['message'];
			$result = Email::contact($name, $email, $message);
			echo $result;
		break;

		case 'get_phones':
			//cmd: "send_code", phone: phone
			$result = UserController::get_phones($phone);
			echo $result;
		break;

		case 'send_code':
			//cmd: "send_code", phone: phone
			$phone = $_POST['phone'];
			$result = UserController::send_code($phone);
			echo $result;
		break;

		case 'verify_code':
			//cmd: "verify_code", code: code
			$code = $_POST['code'];
			$result = UserController::verify_code($code);
			echo $result;
		break;

		case 'send_email_code':
			$email = $_POST['email'];
			$result = UserController::send_email_code($email);
			echo $result;
		break;

		case 'verify_email_code':
			$email = $_POST['codecode'];
			$result = UserController::verify_email_code($email);
			echo $result;
		break;

		case 'login_check':
			$username = $_POST['username'];
			$result = UserController::signup_check($username);
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

		case 'delete_phone':
			$number = $_POST['number'];
			$result = UserController::delete_phone($number);
			echo $result;
		break;

		case 'generate_qr_code':
			$application = $_POST['application'];
			$result = UserController::generate_qr_code($application);
			echo $result;
		break;

		default: 
			echo "#error";
		break;
	}
}