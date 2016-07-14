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
			list($user, $domain) = explode('@', $email);
			if (is_google_mx($domain)) $ex = 1;
			else $ex = 0;
	
			// add user
			$profileId= User::add_profile($first_name, $last_name, $email, $type, $ip, $ex);

			// new email key (we still create user if email is not gmail, just don't create the key)
			if ($extention == 0 && is_google_mx($domain)) {
				//echo 'rest';
				$config = include('../../../config/setting.php')
//				$url = 'http://10.209.33.61:91/new_email/' . $email;
				$url = $config['setting']['gateUri'] .'new_email/' . $email;
				send_post($url);
			}

			// generate verification code
			do {
				$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
		    	$code =  substr(str_shuffle($code),0,8);
		    	$result = User::select_temp_login_codes($code);
	    	} while ($result->rowCount() > 0);
	    	User::insert_temp_login_codes($profileId, $code);

			// start session
			if ($extention == 0) {
				$result = SessionController::start_session($profileId, $type, $first_name, $last_name);
				Email::welcome_email($email, $first_name, $last_name, $code);
			} else {
				Email::welcome2_email($email, $first_name, $last_name, $code);
			}
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
				$profileId = $row['profileId'];

				$ip = getenv('REMOTE_ADDR');
				User::update_user($profileId, 'last_ip', $ip);

				$result2 = User::get_user_info($profileId);
				foreach ($result2 as $row2) {
					$first_name = $row2['firstName'];
					$last_name = $row2['lastName'];
				}

				//$result = SessionController::start_session($profileId, 'USER', $first_name, $last_name);
				//$result = SessionController::get_user_session();
				//return json_encode($result);
			
				
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

	public static function generate_bioauth_code($email) {

		$result = User::check_email($email);
		if ($result->rowCount() == 0)
			return '#email';
		else {
			$row = $result->fetch();
			$profileId = $row['profileId'];

			// disable all the codes for this user
			User::update_verification_codes(0, $profileId, 3);

			// generate code and check that code doesn't exist
			do {
				$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
		    	$code =  substr(str_shuffle($code),0,8);
		    	$result = User::select_verification_codes($code);
	    	} while ($result->rowCount() > 0);

	    	// insert code
			$result = User::insert_verification_codes($profileId, 0, 3, 1, $code);

			if ($result) return $code;
			else return '#error';
		}

	}

	public static function check_bioauth_code($code) {
		$result = User::select_verification_codes($code);
		if ($result->rowCount() > 0) {
			foreach ($result as $row) {
				if ($row['status'] == 3) {
					// login
					$profileId = $row['profileId'];
					$result2 = User::find_user('id', $profileId);
					foreach ($result2 as $row2) {
						$type = $row2['type'];

						$ip = getenv('REMOTE_ADDR');
						User::update_user($profileId, 'last_ip', $ip);

						$result3 = User::get_user_info($profileId);
						foreach ($result3 as $row3) {
							$first_name = $row3['firstName'];
							$last_name = $row3['lastName'];
						}

						$result = SessionController::start_session($profileId, $type, $first_name, $last_name);
						$result = SessionController::get_user_session();
						$result['response'] = '#verified';
						return json_encode($result);
					}
				} else return json_encode(array('response'=>'#not-verified'));
			}
		} else return json_encode(array('response'=>'#no-code'));
	}

	public static function update_name($first_name, $last_name) {
		if (isset($_SESSION['id'])) {
			$profileId = $_SESSION['id'];

			$result = User::update_profile('first_name', $first_name, $profileId);
			$result = User::update_profile('last_name', $last_name, $profileId);

			$_SESSION['first_name'] = $first_name;
			$_SESSION['last_name'] = $last_name;

			return '#success';
		} else return '#no-session';
	}

	public static function send_phone_login_code($profileId, $phone) {
		// check phone
		$result = User::select_temp_login_phone($profileId, $phone);

		if ($result->rowCount() == 0) return '#not-found';
		else {
			// inactivate all the previous codes
			User::update_temp_login_code($profileId, 0);

			// generate code
			do {
				$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
		    	$code =  substr(str_shuffle($code),0,8);
		    	$result = User::select_temp_login_codes($code);
	    	} while ($result->rowCount() > 0);

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
			do {
				$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
		    	$code =  substr(str_shuffle($code),0,8);
		    	$result = User::select_temp_login_codes($code);
	    	} while ($result->rowCount() > 0);

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

		if ($result->rowCount() == 0) return json_encode(array('response'=>'#code'));
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

	public static function test_login() {
		$profileId = 23;
		$type = "USER";
		$first_name = "Test";
		$last_name = "Acc";

		$result = SessionController::start_session($profileId, $type, $first_name, $last_name);
		$result = SessionController::get_user_session();
		return json_encode($result);
	}

	public static function get_state($type) {
		if (isset($_SESSION['id'])) {
			$profileId = $_SESSION['id'];

			// get state
			$result = User::get_profile($profileId);
			$row = $result->fetch();
			$state = json_decode($row['training']);

			$result = 0;
			foreach ($state as $id=>$s) {
				if ($id == $type) $result = $s;
			}

			return $result;
		}
	}

	public static function save_state($type, $s) {
		if (isset($_SESSION['id'])) {
			$profileId = $_SESSION['id'];

			// get state
			$result = User::get_profile($profileId);
			$row = $result->fetch();
			$state = json_decode($row['training']);
			$state[$type] = $s;
			$state = json_encode($state);

			$result = User::update_profile('training', $state, $profileId);
			return '#success';
		}
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
		do {
			$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
	    	$code =  substr(str_shuffle($code),0,8);
	    	$result = User::check_temp_phone_codes($code);
    	} while ($result->rowCount() > 0);

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
		if (isset($_SESSION['id'])) {
			$profileId = $_SESSION['id'];

			// disable all the codes for this user
			User::update_verification_codes(0, $profileId, $application);

			// generate code and check that code doesn't exist
			do {
				$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
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

			//if ($profileId == 23)
			// TEST TEST TEST
			//{
				//$url = 'http://10.209.33.61:91/training?device_id=88b960b1c9805fb586810f270def7378&code=magiccode';
				//send_post($url);
			//} else {
			// TEST TEST TEST

			// generate code and check that code doesn't exist
			//{
				do {
					$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
			    	$code =  substr(str_shuffle($code),0,8);
			    	$result = User::select_verification_codes($code);
		    	} while ($result->rowCount() > 0);
		    		//echo 'key: ' . $key;
					$config = include('../../../config/setting.php')
//		    		$url = 'http://10.209.33.61:91/training?device_id=' . $key . '&code=' . $code;
		    		$url = $config['settings']['gateUri'] . 'training?device_id=' . $key . '&code=' . $code;
		    		//echo $url;
		    		send_post($url);
		    //}

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

	public static function get_biometrics($biometrics) {
		$profileId = $_SESSION['id'];
		$result = User::get_biometrics($profileId, $biometrics);
		return $result;
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
				if (is_google_mx($domain))
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
			list($user, $domain) = explode('@', $email);
			if (is_google_mx($domain)) {
				echo 'gmail';
				$result = User::add_gmail_email($profileId, $email);
			} else {
				echo 'not gmail';
				$result = User::add_not_gmail_email($profileId, $email);
			}

			//return '#success';

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
		$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
    	$code =  substr(str_shuffle($code),0,8);

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

			/*list($user, $domain) = explode('@', $email);
			if (is_google_mx($domain)) {
				$url = 'http://10.209.33.61:91/new_email/' . $email;
				send_post($url);
			}*/

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
				$code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
		    	$code =  substr(str_shuffle($code),0,8);
		    	$result = User::select_verification_codes($code);
	    	} while ($result->rowCount() > 0);

	    	// insert code
			$result = User::insert_verification_codes($profileId, 0, 2, 1, $code);

			if ($result) return json_encode(array('code'=>$code, 'image'=>create_image_code($code)));
			else return '#error';
		} else return '#no-session';
	}

	public static function get_extension_settings() {
		if (isset($_SESSION['id'])) {
			$profileId = $_SESSION['id'];
			$result = User::get_extension_settings($profileId);
			if ($result->rowCount() != 0) {
				$row = $result->fetch();
				$data = json_decode($row['settings']);
				return json_encode($data);
			} else {
				return json_encode(array('response'=>'#no-data'));
			}
		} else return json_encode(array('response'=>'#no-session'));
	}

	public static function save_extension_settings($settings) {
		if (isset($_SESSION['id'])) {
			$profileId = $_SESSION['id'];

			$result = User::get_extension_settings($profileId);
			if ($result->rowCount() != 0) {
				$result = User::save_extension_settings($profileId, $settings);
			} else {
				$result = User::insert_extension_settings($profileId, $settings);
			}
		} else return '#no-session';
	}

	public static function check_status($code) {
		if (isset($_SESSION['id'])) {
			$result = User::select_verification_codes($code);
			if ($result->rowCount() > 0) {
				foreach ($result as $row) {
					if ($row['status'] == 5) return '#canceled';
					if ($row['status'] == 6) return '#failed1';
					if ($row['status'] == 7) return '#failed2';
					if ($row['status'] == 8) return '#retry';

					if ($row['status'] == 4) return '#in-process';
					if ($row['status'] == 3) return '#verified';
					else return '#not-verified';
				}
			} else return '#no-code';
		} else return '#no-session';
	}

	/* API */
	public static function get_api_keys() {
		if (isset($_SESSION['providerId'])) {
			$providerId = $_SESSION['providerId'];
			$result = User::select_api_keys('providerId', $providerId);
			$data = array();
			foreach ($result as $row) {
				$data[] = array('pub'=>$row['public_key'], 'priv'=>$row['private_key']);
			}
			return json_encode($data);
		} else return '#no-session';
	}

	public static function generate_api_key() {
		if (isset($_SESSION['providerId'])) {
			$providerId = $_SESSION['providerId'];

			do {
				$pub = "_____-----_____-----ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz01234567890123456789012345678901234567890123456789012345678901234567890123456789";
		    	$pub =  substr(str_shuffle($pub),0,15);
		    	$result = User::select_api_keys('public_key', $pub);
	    	} while ($result->rowCount() > 0);

	    	do {
				$priv = "_____-----_____-----ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz01234567890123456789012345678901234567890123456789012345678901234567890123456789";
		    	$priv =  substr(str_shuffle($priv),0,30);
		    	$result = User::select_api_keys('private_key', $priv);
	    	} while ($result->rowCount() > 0);

			$result = User::save_api_keys($providerId, $pub, $priv);
			
			$data = array('pub'=>$pub, 'priv'=>$priv);
			return json_encode($data);
		
		} else return '#no-session';
	}

	public static function delete_api_key($key) {
		if (isset($_SESSION['providerId'])) {
			$providerId = $_SESSION['providerId'];
			$result = User::delete_api_key($providerId, $key);
			return '#success';
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

function send_get($url) {
	$ch = curl_init();

	// Set query data here with the URL
	curl_setopt($ch, CURLOPT_URL, $url); 

	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_TIMEOUT, '3');
	$content = trim(curl_exec($ch));
	curl_close($ch);
	//print $content;
}
//
//POST http://10.209.33.61:90training?user_id=1&code=code
//POST http://10.209.33.61:90new_email/email

function is_google_mx($host) {
    $records = dns_get_record($host, DNS_MX);
    foreach ($records as $record) {
        if (substr(strtolower($record['target']), -11) == '.google.com') return true;
        if (substr(strtolower($record['target']), -15) == '.googlemail.com') return true;
    }
    return false;
}