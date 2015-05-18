<?php
/*
	This is simple getData script, which returns json encoded arrays
*/

require ('controllers/EmailController.php');
require ('controllers/SessionController.php');
require ('controllers/UserController.php');
require ('models/User.php');

if (isset($_POST['cmd'])) {
	$action = $_POST['cmd'];
	switch($action) {
		case 'sign_up':
			//cmd: "sign_up", username: username, email: email, password: password, type: type
			$username = $_POST['username'];
			$email = $_POST['email'];
			$password = $_POST['password'];
			$type = $_POST['type'];
			$result = UserController::sign_up($username, $email, $password, $type);
			if ($result == 'success') $result = SessionController::start_session($username);
			echo $result;
		break;

		case 'sign_up_verify_name':
			//cmd: "sign_up_verify_" + object, data: data
			$fieldname = 'name';
			$value = $_POST['data'];
			$result = UserController::find_user($fieldname, $value);
			echo $result;
		break;

		case 'sign_up_verify_email':
			$value = $_POST['data'];
			$fieldname = 'email';
			$result = UserController::find_user($fieldname, $value);
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

		case 'user_info_save':
			//cmd: "user_info_save", object: 'email', data: email
			echo "done";
		break;

		case 'user_info_change':
			//cmd: "user_info_change", id: id, object: 'email', data: email
			echo "done";
		break;

		case 'user_resources_save_resource':
			//cmd: "user_resources_save", name: name, policy: policy
			echo "done";
		break;

		case 'user_resources_change_policy':
			//cmd: "user_resources_change", old: oldPolicy, object: 'policy', data: policy
			echo "done";
		break;

		case 'user_location_invite':
			//cmd: "user_location_invite", location: location, name: name, time: time
			echo "done";
		break;

		case 'provider_info_save':
			//cmd: "provider_info_save", object: 'email', data: email
			echo "done";
		break;

		case 'provider_info_change':
			//cmd: "provider_info_change", id: id, object: 'email', data: email
			echo "done";
		break;

		case 'provider_resources_save_resource':
			//cmd: "provider_resources_save", name: name, policy: policy
			echo "done";
		break;

		case 'provider_resources_change_policy':
			//cmd: "provider_resources_change", old: oldPolicy, object: 'policy', data: policy
			echo "done";
		break;

		case 'partner_apply':
			//
			echo "done";
		break;

		case 'partner_resources_save_resource':
			//cmd: "partner_resources_save", name: name, policy: policy
			echo "done";
		break;

		case 'partner_resources_change_policy':
			//cmd: "partner_resources_change", old: oldPolicy, object: 'policy', data: policy
			echo "done";
		break;

		default:
			echo 'some other data';
		break;
	}
}
