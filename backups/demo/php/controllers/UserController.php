<?php
//User controller class

class UserController {

	public static function create_user($username, $first_name, $last_name, $email, $password, $type) {
		$check_email = User::find_user('emails', $email);
		if (mysqli_num_rows($check_email) != 0) {
			return '#email';
		} else {
			$ip = getenv('REMOTE_ADDR');
			$email = json_encode(array($email));
			$add_user = User::add_user($username, $email, $password, $type, $ip);

			$profile = User::find_user('emails', $email);
			$row = mysqli_fetch_array($profile);
			$profileId = $row['id'];
			$api_id = $row['api_id'];
			$type = $row['type'];
			$add_user_info = User::add_user_info($profileId, $first_name, $last_name);
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

	public static function get_phones() {
		include ('connect.php');
		session_start();
		$profile_id = $_SESSION['id'];

		$result = User::find_user('id', $profile_id);
		$row = mysqli_fetch_array($result);
		$data = json_decode($row['phones']);
		return json_encode($data);
	}

	public static function send_code($phone) {
		include ('connect.php');
		session_start();
		$profileId = $_SESSION['id'];

		// inactivate all the previous codes
		User::update_temp_phone_codes($profileId, 0);

		// generate code
		$code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    	$code =  substr(str_shuffle($code),0,10);

    	// put code to the database
    	User::insert_temp_phone_codes($profileId, $code, $phone);

		// send code
		$user = "biomio";
		$password = "JFAOSMGDHfKcWR";
		$api_id = "3524018";
		$baseurl ="http://api.clickatell.com";
		$text = urlencode("BIOMIO verification code: " . $code);
		$to = $phone;
		$from="17577932772";
		$mo="1";

		$url = "$baseurl/http/sendmsg?user=$user&password=$password&api_id=$api_id&to=$to&text=$text&mo=$mo&from=$from";
		$ret = file($url);

		$send = explode(":",$ret[0]);
		if ($send[0] == "ID")
		    return "#success";
		else
		    return "send message failed";
	}

	public static function verify_code($code) {
		include ('connect.php');
		session_start();
		$profileId = $_SESSION['id'];

		$result =  User::select_temp_phone_codes($profileId, $code);

		if (mysqli_num_rows($result) == 0) return 0;
		else {
			$row = mysqli_fetch_array($result);
			$phone = $row['phone'];

			User::update_temp_phone_codes($profileId, 0);

			// get phones array
			$result = User::find_user('id', $profileId);

			if (mysqli_num_rows($result) == 0) return '#error - user is not found / session has been expired';
			else {
				$row = mysqli_fetch_array($result);
				$phones = json_decode($row['phones']);
				$phones[] = $phone;

				$phones = json_encode($phones);
				// store new phones array
				$result = User::update_user($profileId, 'phones', $phones);

				return $phone;
			}
		}
	}

	public static function signup_check($username) {
		include ('connect.php');
		$data = array();
		// check if user exists
		$verify = User::find_user('name', $username);
		if (mysqli_num_rows($verify) == 0) {
			$data['id'] = null;
		} else {
			$row = mysqli_fetch_array($verify);
		
		// get id
			$data['id'] = $row['id'];
		
		// get phone
			if ($row['phone'] == '')
				$data['phone'] = 0;
			else 
				$data['phone'] = 1;

		// get fingerprints
			$data['fingerprints'] = 0;

			$profileId = $row['id'];

			$result = User::get_user_info($profileId);

			$row = mysqli_fetch_array($result);
			$fingerprints = json_decode($row['fingerprints']);
			foreach ($fingerprints as $finger)
				if ($finger > 0) $data['fingerprints'] = 1;
		}
		
		// send data
		return json_encode($data);
	}

	public static function send_phone_login_code($profileId, $phone) {
		include ('connect.php');
		// inactivate all the previous codes
		User::update_temp_login_code($profileId, 0);
	
		// generate code
		$code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    	$code =  substr(str_shuffle($code),0,10);

		// save code in the table
		User::insert_temp_login_codes($profileId, $code);

		// check phone
		$result = User::select_temp_login_phone($profileId, $phone);

		if (mysqli_num_rows($result) == 0) return '#not-found';
		else {

			// send code
			$user = "biomio";
			$password = "JFAOSMGDHfKcWR";
			$api_id = "3524018";
			$baseurl ="http://api.clickatell.com";
			$text = urlencode("BIOMIO temporary login code: " . $code);
			$to = $phone;
			$from="17577932772";
			$mo="1";

			$url = "$baseurl/http/sendmsg?user=$user&password=$password&api_id=$api_id&to=$to&text=$text&mo=$mo&from=$from";
			$ret = file($url);

			// send success message
			$send = explode(":",$ret[0]);
			if ($send[0] == "ID")
			    return "#success";
			else
			    return "send message failed";
		}
	}

	public static function send_email_login_code($profileId, $email) {
		include ('connect.php');
		// inactivate all the previous codes

		User::update_temp_login_code($profileId, 0);

		// generate code
		$code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    	$code =  substr(str_shuffle($code),0,10);

		// save code in the table
    	User::insert_temp_login_codes($profileId, $code);

    	// check phone
    	$result = User::select_temp_login_email($profileId, $email);

		if (mysqli_num_rows($result) == 0) return '#not-found';
		else { 
			// send code
	    	$result = Email::login_code($code, $email);

			// send success message
			return '#success';
		}
	}

	public static function check_login_code($profileId, $code) {
		include ('connect.php');
		// check code
		$result = User::select_temp_login_code($profileId, $code);

		if (mysqli_num_rows($result) == 0) return '#code';
		else {
			User::update_temp_login_code($profileId, 0);

			// login
			$result = User::find_user('id', $profileId);
			$row = mysqli_fetch_array($result);
			
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

	public static function delete_phone($number) {
		include ('connect.php');
		session_start();
		$profile_id = $_SESSION['id'];

		$result = User::find_user('id', $profile_id);
		if (mysqli_num_rows($result) == 0) return '#error - user is not found / session has been expired';
		else {
			$row = mysqli_fetch_array($result);
			$phones = json_decode($row['phones']);
			$phones = array_diff($phones, array($number));
			$phones = json_encode($phones);

			$result = User::update_user($profile_id, 'phones', $phones);

			return "#success";
		}
	}

	public static function generate_qr_code($application) {
		include ('connect.php');
		session_start();
		if (isset($_SESSION['id'])) {
			$profile_id = $_SESSION['id'];

			// disable all the codes for this user
			$result = mysqli_query($db_conx, "UPDATE VerificationCodes SET status = 0 WHERE user_id = $profile_id AND application = $application") or die (mysqli_error());

			// generate code and check that code doesn't exist
			do {
				$code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		    	$code =  substr(str_shuffle($code),0,8);
		    	$result = mysqli_query($db_conx, "SELECT * FROM VerificationCodes WHERE code = '$code'") or die (mysqli_error());
	    	} while (mysqli_num_rows($result) > 0);

			// insert code
	    	$result = mysqli_query($db_conx, "INSERT INTO VerificationCodes (user_id, application, status, code, date_created) VALUES ($profile_id, $application, 1, '$code', now())") or die (mysqli_error());

			if ($result) return $code;
			else return '#error';
		} else return '#no-session';
	}
}
