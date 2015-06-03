<?php
//User controller class

class UserController {

	// ------ SIGN UP -------

	public static function check_email($email) {
		$result = User::check_email($email);
		if ($result->rowCount() == 0)
			return '#fine';
		else
			return '#registered';
	}

	public static function create_user($first_name, $last_name, $email, $type, $extention) {
		$result = User::check_email($email);
		if ($result->rowCount() != 0)
			return '#email';
		else {
			$ip = getenv('REMOTE_ADDR');
	
			// add user
			$profileId= User::add_profile($first_name, $last_name, $email, $type, $ip);

			// new email rest
			if ($extention == 0) {
				echo 'rest';
				$url = 'http://gb.vakoms.com/new_email/' . $email;
				$data = array();
				send_post($url, $data);
			}

			// generate verification code
			$code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	    	$code =  substr(str_shuffle($code),0,10);
	    	// save verification code
	    	// TO DO
	    	// send verification email
			Email::send_email_verification_code($email, $first_name, $last_name, $code);

			// start session
			$result = SessionController::start_session($profileId, $type, $first_name, $last_name);

			// return profileId
			return $profileId;
		}
	}

	// --------LOGIN ---------

	public static function signup_check($email) {
		$result = User::check_email($email);
		if ($result->rowCount() == 0)
			return json_encode(array('response'=>'#fine'));
		else if ($result->rowCount() == 1) {
			foreach ($result as $row) {
				$data = array();
				// get profileId
				$profileId = $row['profileId'];
				$data['id'] = $profileId;
				$data['phone'] = $profileId;
				// get information about user phones
				$result = User::get_phones($profileId);
				if ($result->rowCount() == 0)
					$data['phone'] = 0;
				else 
					$data['phone'] = 1;
				// get information about user biometrics
				$result2 = User::get_user_info($profileId);
				foreach ($result2 as $row2) {
					$data['face'] = $row2['face'];
				}
				return json_encode($data);
			}
		} else return '#something is wroing';
	}

	public static function send_phone_login_code($profileId, $phone) {
		// check phone
		$result = User::select_temp_login_phone($profileId, $phone);

		if ($result->rowCount() == 0) return '#not-found';
		else {
			// inactivate all the previous codes
			User::update_temp_login_code($profileId, 0);

			// generate code
			$code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	    	$code =  substr(str_shuffle($code),0,10);

			// save code in the table
			User::insert_temp_login_codes($profileId, $code);

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
		// check email
    	$result = User::select_temp_login_email($profileId, $email);

		if ($result->rowCount() == 0) return '#not-found';
		else { 
			// inactivate all the previous codes

			User::update_temp_login_code($profileId, 0);

			// generate code
			$code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	    	$code =  substr(str_shuffle($code),0,10);

			// save code in the table
	    	User::insert_temp_login_codes($profileId, $code);

			// send code
	    	$result = Email::login_code($code, $email);

			// send success message
			return '#success';
		}
	}

	public static function check_login_code($profileId, $code) {
		// check code
		$result = User::select_temp_login_code($profileId, $code);

		if ($result->rowCount() == 0) return '#code';
		else {
			User::update_temp_login_code($profileId, 0);

			// login
			$result = User::find_user('id', $profileId);
			foreach ($result as $row) {
				$profileId = $row['id'];
				$type = $row['type'];

				$ip = getenv('REMOTE_ADDR');
				User::update_user($profileId, 'last_ip', $ip);

				$result2 = User::get_user_info($profileId);
				foreach ($result2 as $row2) {
					$first_name = $row2['firstName'];
					$last_name = $row2['lastName'];
				}

				$result = SessionController::start_session($profileId, $type, $first_name, $last_name);
				$result = SessionController::get_user_session();
				return json_encode($result);
			}
		}
	}

	public static function guest_login() {
		$profileId = 11;
		$type = "USER";
		$first_name = "Guest";
		$last_name = "User";

		$result = SessionController::start_session($profileId, $type, $first_name, $last_name);
		$result = SessionController::get_user_session();
		return json_encode($result);
	}

	// ------ Other cool stuff -------

	public static function change_type($type) {
		$session = SessionController::get_user_session();
		$profileId = $session['id'];

		$result = User::update_user($profileId, 'type', $type);
		return '#success';
	}

	// -------- Phone registration ----------

	public static function get_phones() {
		$session = SessionController::get_user_session();
		$profileId = $session['id'];

		$result = User::get_phones($profileId);
		$data = array();
		foreach ($result as $row) {
			$data[] = $row['phone'];
		}
		return json_encode($data);
	}

	public static function send_phone_verification_code($phone) {

		// Here we need to check if phone already registered

		$session = SessionController::get_user_session();
		$profileId = $session['id'];

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

	public static function verify_phone_code($code) {
		$session = SessionController::get_user_session();
		$profileId = $session['id'];

		$result =  User::select_temp_phone_codes($profileId, $code);

		if ($result->rowCount() == 0) return 0;
		else {
			$row = $result->fetch();
			$phone = $row['phone'];

			User::update_temp_phone_codes($profileId, 0);
			$result = User::add_phone($profileId, $phone);

			return $phone;
		}
	}

	public static function delete_phone($phone) {
		$profileId = $_SESSION['id'];
		$result = User::delete_phone($profileId, $phone);
		return "#success";
	}

	// User Services
			// --- Applications --- //
	public static function get_mobile_devices() {
		$profileId = $_SESSION['id'];
		$result = User::get_mobile_devices($profileId);
		$data = array();
		foreach ($result as $row)
			$data[] = array('id'=>$row['id'], 'title'=>$row['title'], 'status'=>$row['status']);
		return json_encode($data);
	}

	public static function add_mobile_device($name) {
		$profileId = $_SESSION['id'];
		$device_id = User::add_mobile_device($profileId, $name); // returns device id
		return $device_id;
	}

	public static function generate_qr_code($device_id, $application) {
		session_start();
		if (isset($_SESSION['id'])) {
			$profileId = $_SESSION['id'];

			// disable all the codes for this user
			User::update_verification_codes(0, $profileId, $application);

			// generate code and check that code doesn't exist
			do {
				$code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		    	$code =  substr(str_shuffle($code),0,8);
		    	$result = User::select_verification_codes($code);
	    	} while ($result->rowCount() > 0);

	    	// insert code
			$result = User::insert_verification_codes($profileId, $device_id, $application, 1, $code);
			if ($result) return $code;
			else return '#error';
		} else return '#no-session';
	}

	public static function generate_biometrics_code($device_id, $application) {
		session_start();
		if (isset($_SESSION['id'])) {
			$profileId = $_SESSION['id'];

			// disable all the codes for this user
			User::update_verification_codes(0, $profileId, $application);

			// get device_token
			$result = User::get_mobile_devices($profileId);
			foreach ($result as $row) {
				if ($row['id'] == $device_id) 
					$key = $row['device_token'];
			}


			// generate code and check that code doesn't exist
			do {
				$code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		    	$code =  substr(str_shuffle($code),0,8);
		    	$result = User::select_verification_codes($code);
	    	} while ($result->rowCount() > 0);

	    		$url = 'http://gb.vakoms.com/training?device_id=' . $key . '&code=' . $code;
	    		echo $url;
	    		$data = array();
	    		send_post($url, $data);

	    	// insert code
			$result = User::insert_verification_codes($profileId, $device_id, $application, 1, $code);
			if ($result) return $code;
			else return '#error';
		} else return '#no-session';
	}

	public static function rename_mobile_device($device_id, $name) {
		$profileId = $_SESSION['id'];
		$result = User::rename_mobile_device($profileId, $device_id, $name);
		return "#success";
	}

	public static function delete_mobile_device($device_id) {
		$profileId = $_SESSION['id'];
		$result = User::delete_mobile_device($profileId, $device_id);
		return "#success";
	}

	// --- Chrome Extention --- //
	public static function get_user_extensions() {
		$profileId = $_SESSION['id'];
		$result = User::get_user_extensions($profileId);
		return $result->rowCount();
	}
	public static function get_user_emails($extention) {
		$profileId = $_SESSION['id'];
		$result = User::get_user_emails($profileId);
		$data = array();
		foreach ($result as $row) {
			if ($extention == 1) {
				$email = $row['email'];

				list($user, $domain) = explode('@', $email);
				if ($domain == 'gmail.com' || $domain == 'googlemail.com')
					$data[] = array('id'=>$row['id'], 'email'=>$row['email'], 'verified'=>$row['verified'], 'primary'=>$row['primary'], 'extention'=>$row['extention']);
			} else $data[] = array('id'=>$row['id'], 'email'=>$row['email'], 'verified'=>$row['verified'], 'primary'=>$row['primary'], 'extention'=>$row['extention']);
		}
		return json_encode($data);
	}

	public static function add_email($email) {
		$profileId = $_SESSION['id'];
		// check if email is unique
		$result = User::check_email($email);
		if ($result->rowCount() == 0) {
			
			$result = User::add_email($profileId, $email);
			// new email rest
			$url = 'http://gb.vakoms.com/new_email/' . $email;
			//$url = 'http://biom.io/backups/beta3/php/commands.php/test/alexander.lomov1@gmail.com';
			$data = array();
			send_post($url, $data);

			return '#success';

		} else
			return '#registered';
	}

	public static function delete_email($email) {
		$profileId = $_SESSION['id'];
		$result = User::delete_email($profileId, $email);
		return "#success";
	}

	public static function generate_image_code($application) {
		$profileId = $_SESSION['id'];
		// bla bla work
		// return picture
		return $result;
	}
		// ------ //

	public static function check_code_status($code) {
		$profileId = $_SESSION['id'];
		$result = User::update_email($profileId, $email);
		return $result;
	}

	public static function code_verified($code) {
		$profileId = $_SESSION['id'];
		$result = User::update_email($profileId, $email);
		return $result;
	}

	public static function send_email_verification_code($email) {
		$profileId = $_SESSION['id'];
		$first_name = $_SESSION['first_name'];
		$last_name = $_SESSION['last_name'];

		// inactivate all the previous codes
		User::update_temp_email_codes($profileId, 0);

		// generate code
		$code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    	$code =  substr(str_shuffle($code),0,10);

    	// put code to the database
    	User::insert_temp_email_codes($profileId, $code, $email);

		// send code
		Email::send_email_verification_code($email, $first_name, $last_name, $code);
		
		return "#success";
	}

	public static function verify_email($email, $code) {
		$profileId = $_SESSION['id'];

		$result =  User::select_temp_email_codes($profileId, $email, $code);

		if ($result->rowCount() == 0) return 0;
		else {
			$row = $result->fetch();
			$email = $row['email'];

			$result = User::update_email($profileId, $email, 'verified', 1);

			User::update_temp_email_codes($profileId, 3);
			return "#success";
		}
	}

	public static function verify_extention() {
		if (isset($_SESSION['id'])) {
			$profileId = $_SESSION['id'];

			// disable all the codes for this user
			User::update_verification_codes(0, $profileId, 2);

			// generate code and check that code doesn't exist
			do {
				$code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		    	$code =  substr(str_shuffle($code),0,8);
		    	$result = User::select_verification_codes($code);
	    	} while ($result->rowCount() > 0);

	    	// insert code
			$result = User::insert_verification_codes($profileId, 0, 2, 1, $code);

			if ($result) return json_encode(array('code'=>$code, 'image'=>create_image_code($code)));
			else return '#error';
		} else return '#no-session';
	}

	public static function check_status($code) {
		if (isset($_SESSION['id'])) {
			$result = User::select_verification_codes($code);
			if ($result->rowCount() > 0) {
				foreach ($result as $row) {
					if ($row['status'] == 3) return '#verified';
					else return '#not-verified';
				}
			} else return '#no-code';
		} else return '#no-session';
	}
}

function create_image_code($code) {
	$image = imagecreatetruecolor(260, 40); // creating an image

	$background_color = imagecolorallocate($image, 255, 255, 255); // white background 
	imagefilledrectangle($image,0,0,260,40,$background_color); // rectangular shape

	// 2) Adding horizontal line
	$line_color = imagecolorallocate($image, 255,96,0); // black line color
	for($i=0;$i<10;$i++) {
		$line_start = rand()%40;
		$line_end = $line_start + rand(-20, 20);
	    imageline($image,0,$line_start,260,$line_end,$line_color); // adding 10 lines (x1, y1, x2, y2)
	}

	// 3) Adding vertical line
	$line_color = imagecolorallocate($image, 255,96,0); // black line color
	for($i=0;$i<20;$i++) {
		$line_start = rand()%260;
		$line_end = $line_start + rand(-20, 20);
	    imageline($image,$line_start,0,$line_end,40,$line_color); // adding 10 lines (x1, y1, x2, y2)
	}

	// 4) Adding dots
	$pixel_color = imagecolorallocate($image, 30,71,183); // dot color
	for($i=0;$i<1000;$i++) {
	    imagesetpixel($image,rand()%260,rand()%40,$pixel_color); // add 1000 dots
	}  

	// 5) Adding text
	$len = strlen($code);
	$text_color = imagecolorallocate($image, 0,0,0);
	$text_shadow = imagecolorallocate($image, 128, 128, 128);
	$font = 'fonts/Arial.ttf';

	for ($i = 0; $i< 8;$i++) {
	    $letter = $code[$i];
	    $angle = rand(-5, 5);
	    imagettftext($image, 20, $angle, 19+($i*30), 31, $text_shadow, $font, $letter); // add shadow
	    imagettftext($image, 20, $angle, 18+($i*30), 30, $text_color, $font, $letter); //add text
	}

	ob_start();
	imagepng($image);
	$buffer = ob_get_clean();
	ob_end_clean();
	return base64_encode($buffer);
}

function send_post($url, $data) {
	echo $url;
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
//
//POST http://gb.vakoms.comtraining?user_id=1&code=code
//POST http://gb.vakoms.comnew_email/email