<?php
require ('controllers/EmailController.php');
require ('controllers/SessionController.php');
require ('controllers/UserController.php');
require ('models/User.php');

if (isset($_POST['cmd'])) {
	$action = $_POST['cmd'];
	switch($action) {
		case 'sign_up':
			//cmd: "sign_up", username: username, email: email, password: password, type: type
			$username = escape($_POST['username']);
			$email = escape($_POST['email']);
			$password = escape($_POST['password']);
			$type = escape($_POST['type']);
			$result = UserController::sign_up($username, $email, $password, $type);
			echo $result;
		break;

		case 'verify_name':
			//cmd: "sign_up_verify_" + object, data: data
			$fieldname = 'name';
			$value = escape($_POST['data']);
			$result = UserController::find_user($fieldname, $value);
			echo $result;
		break;

		case 'verify_email':
			$value = escape($_POST['data']);
			$fieldname = 'emails';
			$result = UserController::find_user($fieldname, $value);
			echo $result;
		break;

		case 'login':
			//cmd: "login", email: email, password: password, remember: remember
			$email = escape($_POST['email']);
			$password = escape($_POST['password']);
			$remember = escape($_POST['remember']);
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
			$type = escape($_POST['type']);
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
			$email = escape($_POST['email']);
			$username = escape($_POST['username']);
			$result = UserController::temp_pass($email, $username);
			echo $result;
		break;

		case 'change_password':
			//cmd: "change_password", old_pass: old_password, new_pass: new_password
			$old_pass = escape($_POST['old_pass']);
			$new_pass = escape($_POST['new_pass']);
			$result = UserController::change_pass($old_pass, $new_pass);
			echo $result;
		break;

		case 'update_api_id':
			//cmd: "update_api_id", profileId: profileId, api_id: api_id
			$profileId = escape($_POST['profileId']);
			$api_id = escape($_POST['api_id']);
			$result = UserController::update_api_id($profileId, $api_id);
			echo $result;
		break;

		case 'biomio_login':
			//cmd: "biomio_login", api_id: api_id
			$api_id = escape($_POST['api_id']);
			$result = UserController::biomio_login($api_id);
			echo $result;
		break;

		case 'contact':
			//cmd: "contact", name: name, email: email, message: message
			$name = escape($_POST['name']);
			$email = escape($_POST['email']);
			$message = escape($_POST['message']);
			$result = Email::contact($name, $email, $message);
			echo $result;
		break;

		default: 
			echo "#error";
		break;
	}
}

function escape($variable) {
	return $variable;
}