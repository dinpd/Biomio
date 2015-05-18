<?php
//User controller class

class UserController {

	public static function sign_up($username, $email, $password, $type) {
		$check_username = User::find_user('name', $username);
		$check_email = User::find_user('emails', $email);
		if (mysqli_num_rows($check_username) != 0) {
			return '#username';
		} else if (mysqli_num_rows($check_email) != 0) {
			return '#email';
		} else {
			$ip = getenv('REMOTE_ADDR');
			$email = json_encode(array($email));
			$add_user = User::add_user($username, $email, $password, $type, $ip);

			$profile = User::find_user('name', $username);
			$row = mysqli_fetch_array($profile);
			$profileId = $row['id'];
			$api_id = $row['api_id'];
			$type = $row['type'];
			$add_user_info = User::add_user_info($profileId);
			$add_provider_info = User::add_provider_info($profileId);

			$result = SessionController::start_session($profileId, $username, $api_id, $type);
			$result = SessionController::get_user_session();
			return json_encode($result);
		}
	}

	public static function change_type($type) {
		$session = SessionController::get_user_session();
		$username = $session['username'];

		$profile = User::find_user('name', $username);
		$row = mysqli_fetch_array($profile);
		$profileId = $row['id'];

		$result = User::update_user($profileId, 'type', $type);
		echo $result;
	}

	public static function find_user($fieldname, $value) {
		$check = User::find_user($fieldname, $value);
		if (mysqli_num_rows($check) != 0) {
			return '#registred';
		} else {
			return '#fine';
		}
	}

	public static function verify_user($email, $password) {
		$check_email = User::find_user('emails', $email);
		if (mysqli_num_rows($check_email) == 0) {
			return "#email";
		} else {
			$verify = User::verify_user($email, $password);
			if (mysqli_num_rows($verify) == 0) {
				return "#password";
			} else {
				$row = mysqli_fetch_array($verify);
				$username = $row['name'];
				$type = $row['type'];
				$profileId = $row['id'];
				$api_id = $row['api_id'];
				$ip = getenv('REMOTE_ADDR');
				$result = User::update_user($profileId, 'last_ip', $ip);
				$result = SessionController::start_session($profileId, $username, $api_id, $type);
				$result = SessionController::get_user_session();
				$result['type'] = $type;
				return json_encode($result);
			}
		}
	}

	public static function biomio_login($api_id) {
		$get_user = User::find_user('api_id', $api_id);
			$row = mysqli_fetch_array($get_user);
			$username = $row['name'];
			$type = $row['type'];
			$profileId = $row['id'];
			$api_id = $row['api_id'];
			$ip = getenv('REMOTE_ADDR');
			$result = User::update_user($profileId, 'last_ip', $ip);
			$result = SessionController::start_session($profileId, $username, $api_id, $type);
			$result = SessionController::get_user_session();
			$result['type'] = $type;
			return json_encode($result);
	}

	public static function verify_temporary_user($username, $temp_pass) {
		$verify = User::verify_temporary_user($username, $temp_pass);
		if (mysqli_num_rows($verify) == 0) {
			return "#no-user";
		} else {
			$row = mysqli_fetch_array($verify);
			$username = $row['name'];
			$type = $row['type'];
			$profileId = $row['id'];
			$api_id = $row['api_id'];
			$result = SessionController::start_session($profileId, $username, $api_id, $type);
			//Rewrite temporary passwod into normal password
			User::update_user($profileId, 'password', $temp_pass);
			User::update_user($profileId, 'temp_pass', '');
			return $type;
		}
	}

	public static function temp_pass($email, $username) {
		$check = 0;
		if ($email!='') {
			$check_email = User::find_user('emails', $email);
			$check = mysqli_num_rows($check_email);
		} 
		$charset = array('0', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
		$temp_pass = '';
			for ($i=0; $i<11; $i++) { $temp_pass = $temp_pass . $charset[rand(0, count($charset))-1]; }

		if ($check != 0) { 
			//Reset password by email address
			$row = mysqli_fetch_array($check_email);
			$username = $row['name'];
			$profileId = $row['id'];
			User::update_user($profileId, 'temp_pass', $temp_pass);
			$result = Email::temp_pass($username, $email, $temp_pass);
			return $result;
		} else {
			if ($username!='') {
				$check_username = User::find_user('name', $username);
				$check = mysqli_num_rows($check_username);
			} 
			if ($check != 0) {
				//Reset password by username
				$row = mysqli_fetch_array($check_username);
				$email = $row['email'];
				$profileId = $row['id'];
				User::update_user($profileId, 'temp_pass', $temp_pass);
				$result = Email::temp_pass($username, $email, $temp_pass);
				return $result;
			} else {
				//If neither email nor username found, return error
				return '#no-user';
			}
		}
	}

	public static function change_pass($old_pass, $new_pass) {
		$session = SessionController::get_user_session();
		$username = $session['username'];
		$profile = User::find_user('name', $username);
		$row = mysqli_fetch_array($profile);
		$real_pass = $row['password'];

		if($real_pass != $old_pass) return '#password-error';
		else {
			$profileId = $row['id'];
			$type = $row['type'];
			User::update_user($profileId, 'password', $new_pass);
			return $type;
		}
	}

	public static function get_user_info($profileId) {
		$data = array();
		$data['id'] = $profileId;

		$profile = User::find_user('id', $profileId);
		$row = mysqli_fetch_array($profile);
		$data['name'] = $row['name'];
		$data['emails'] = json_decode($row['emails']);

		$info = User::get_user_info($profileId);
		$row = mysqli_fetch_array($info);
		$data['motto'] = $row['motto'];
		$data['address'] = json_decode($row['address']);

		return json_encode($data);
	}

	public static function update_user_info($profileId, $name, $emails, $motto, $address) {
		User::update_user($profileId, 'name', $name);
		User::update_user($profileId, 'emails', json_encode($emails));
		User::update_user_info($profileId, $motto, json_encode($address));
		return "#success";
	}

	public static function update_api_id($profileId, $api_id) {
		User::update_user($profileId, 'api_id', $api_id);
		$result = SessionController::session_api($api_id);
		return "#success";
	}
}