<?php
//User model class

class User {
  
  // ------ SIGN UP -------

  public static function check_email($email) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM Emails WHERE email = :email");
	$result->execute(array('email'=>$email));
	return $result;
  }

  public static function add_profile($first_name, $last_name, $email, $type, $ip) {
  	include ('connect.php');
  	// insert basic info into Profile
  	$result = $pdo->prepare("INSERT INTO Profiles (last_ip, type) VALUES (:ip, :type)");
  	$result->execute(array('ip'=>$ip, 'type'=>$type));
  	$profileId = $pdo->lastInsertId();

  	// insert user infor into UserInfo
  	$result = $pdo->prepare("INSERT INTO UserInfo (profileId, firstName, lastName) VALUES (:profileId, :first_name, :last_name)");
  	$result->execute(array('profileId'=>$profileId, 'first_name'=>$first_name, 'last_name'=>$last_name));

  	// insert user infor into UserInfo
  	$result = $pdo->prepare("INSERT INTO ProviderInfo (profileId) VALUES (:profileId)");
  	$result->execute(array('profileId'=>$profileId));

  	// insert email into Emails
  	$result = $pdo->prepare("INSERT INTO Emails (profileId, email, `primary`) VALUES (:profileId, :email, :primary)");
  	$result->execute(array('profileId'=>$profileId, 'email'=>$email, 'primary'=>1));

  	return $profileId;
  }

  // --------LOGIN ---------

  public static function get_phones($profileId) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM Phones WHERE profileId = :profileId");
	$result->execute(array('profileId'=>$profileId));
	return $result;
  }

  public static function get_user_info($profileId) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM UserInfo WHERE profileId = :profileId");
	$result->execute(array('profileId'=>$profileId));
	return $result;
  }

  public static function update_temp_login_code($profileId, $status) {
	include ('connect.php');
	$result = $pdo->prepare("UPDATE TempLoginCodes SET status = :status WHERE profileId = :profileId");
	$result->execute(array('status'=>$status, 'profileId'=>$profileId));
	return $result;
  }

  public static function insert_temp_login_codes($profileId, $code) {
	include ('connect.php');
	$result = $pdo->prepare("INSERT INTO TempLoginCodes (profileId, code, date_created) VALUES (:profileId, :code, now())");
	$result->execute(array('profileId'=>$profileId, 'code'=>$code));
	return $result;
  }

  public static function select_temp_login_phone($profileId, $phone) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM Phones WHERE profileId = :profileId AND phone = :phone");
	$result->execute(array('profileId'=>$profileId, 'phone'=>$phone));
	return $result;
  }

  public static function select_temp_login_email($profileId, $email) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM Emails WHERE profileId = :profileId AND email = :email");
	$result->execute(array('profileId'=>$profileId, 'email'=>$email));
	return $result;
  }

  public static function select_temp_login_code($profileId, $code) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM TempLoginCodes WHERE profileId = :profileId AND code = :code AND status = 1 /*AND date_created > DATE_SUB(now(), INTERVAL 15 MINUTE*/)");
	$result->execute(array('profileId'=>$profileId, 'code'=>$code));
	return $result;
  }

  public static function find_user($fieldname, $value) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM Profiles WHERE " . $fieldname . " = :value");
	$result->execute(array('value'=>$value));
	return $result;
  }

  public static function update_user($profileId, $fieldname, $value) {
  	include ('connect.php');
	$result = $pdo->prepare("UPDATE Profiles SET " . $fieldname . " = :value WHERE id = :profileId");
	$result->execute(array('value'=>$value, 'profileId'=>$profileId));
	return $result;
  }

  // ------ Other cool stuff -------
  public static function update_verification_codes($status, $profileId, $application) {
  	include ('connect.php');
	$result = $pdo->prepare("UPDATE VerificationCodes SET status = :status WHERE profileId = :profileId AND application = :application");
	$result->execute(array('status'=>$status, 'profileId'=>$profileId, 'application'=>$application));
	return $result;
  }

  public static function select_verification_codes($code) {
  	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE code = :code");
	$result->execute(array('code'=>$code));
	return $result;
  }

  public static function insert_verification_codes($profileId, $device_id, $application, $status, $code) {
  	include ('connect.php');
	$result = $pdo->prepare("INSERT INTO VerificationCodes (profileId, device_id, application, status, code, date_created) VALUES (:profileId, :device_id, :application, :status, :code, now())");
	$result->execute(array('profileId'=>$profileId, 'device_id'=>$device_id, 'application'=>$application, 'status'=>$status, 'code'=>$code));
	return $result;
  }

  // -------- Phone registration ----------
  public static function update_temp_phone_codes($profileId, $status) {
	include ('connect.php');
	$result = $pdo->prepare("UPDATE TempPhoneCodes SET status = :status WHERE profileId = :profileId");
	$result->execute(array('status'=>$status, 'profileId'=>$profileId));
	return $result;
  }

  public static function insert_temp_phone_codes($profileId, $code, $phone) {
	include ('connect.php');
	$result = $pdo->prepare("INSERT INTO TempPhoneCodes (profileId, code, phone, date_created) VALUES (:profileId, :code, :phone, now())");
	$result->execute(array('profileId'=>$profileId, 'code'=>$code, 'phone'=>$phone));
	return $result;
  }

  public static function select_temp_phone_codes($profileId, $code) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM TempPhoneCodes WHERE profileId = :profileId AND code = :code AND status = 1 AND date_created > DATE_SUB(now(), INTERVAL 15 MINUTE)");
	$result->execute(array('profileId'=>$profileId, 'code'=>$code));
	return $result;
  }

  public static function add_phone($profileId, $phone) {
	include ('connect.php');
	$result = $pdo->prepare("INSERT INTO Phones (profileId, phone) VALUES (:profileId, :phone)");
	$result->execute(array('profileId'=>$profileId, 'phone'=>$phone));
	return $result;
  }

  public static function delete_phone($profileId, $phone) {
	include ('connect.php');
	$result = $pdo->prepare("DELETE FROM Phones WHERE profileId = :profileId AND phone = :phone");
	$result->execute(array('profileId'=>$profileId, 'phone'=>$phone));
	return $result;
  }

// User Services
	// --- Applications --- //
  public static function get_mobile_devices($profileId) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT id, title, status FROM UserServices WHERE profileId = :profileId AND serviceId = 1");
	$result->execute(array('profileId'=>$profileId));
	return $result;
  }

  public static function add_mobile_device($profileId, $name) {
	include ('connect.php');
	$result = $pdo->prepare("INSERT INTO UserServices (profileId, serviceId, title) VALUES (:profileId, 1, :name)");
	$result->execute(array('profileId'=>$profileId, 'name'=>$name));
	return $result = $pdo->lastInsertId();
  }

  public static function rename_mobile_device($profileId, $device_id, $title) {
	include ('connect.php');
	$result = $pdo->prepare("UPDATE UserServices SET title = :title WHERE profileId = :profileId AND id = :device_id");
	$result->execute(array('profileId'=>$profileId, 'title'=>$title, 'device_id'=>$device_id));
	return $result;
  }

  public static function delete_mobile_device($profileId, $device_id) {
	include ('connect.php');
	$result = $pdo->prepare("DELETE FROM UserServices WHERE profileId = :profileId AND id = :device_id");
	$result->execute(array('profileId'=>$profileId, 'device_id'=>$device_id));
	return $result;
  }
  	// --- Chrome Extention --- //
  public static function get_user_emails($profileId) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM Emails WHERE profileId = :profileId");
	$result->execute(array('profileId'=>$profileId));
	return $result;
  }

  public static function add_email($profileId, $email) {
	include ('connect.php');
	$result = $pdo->prepare("INSERT INTO Emails (profileId, email) VALUES (:profileId, :email)");
	$result->execute(array('profileId'=>$profileId, 'email'=>$email));
	return $result;
  }

  public static function update_email($profileId, $email, $field, $value) {
	include ('connect.php');
	$result = $pdo->prepare("UPDATE Emails SET $field = :value WHERE profileId = :profileId AND email = :email");
	$result->execute(array('profileId'=>$profileId, 'email'=>$email, 'value'=>$value));
	return $result;
  }

  public static function delete_email($profileId, $email) {
	include ('connect.php');
	$result = $pdo->prepare("DELETE FROM Emails WHERE profileId = :profileId AND email = :email");
	$result->execute(array('profileId'=>$profileId, 'email'=>$email));
	return $result;
  }

  public static function update_temp_email_codes($profileId, $status) {
	include ('connect.php');
	$result = $pdo->prepare("UPDATE TempEmailCodes SET status = :status WHERE profileId = :profileId");
	$result->execute(array('status'=>$status, 'profileId'=>$profileId));
	return $result;
  }

  public static function insert_temp_email_codes($profileId, $code, $email) {
	include ('connect.php');
	$result = $pdo->prepare("INSERT INTO TempEmailCodes (profileId, code, email, date_created) VALUES (:profileId, :code, :email, now())");
	$result->execute(array('profileId'=>$profileId, 'code'=>$code, 'email'=>$email));
	return $result;
  }

  public static function select_temp_email_codes($profileId, $email, $code) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM TempEmailCodes WHERE profileId = :profileId AND email = :email AND code = :code AND status = 1 /*AND date_created > DATE_SUB(now(), INTERVAL 15 MINUTE)*/");
	$result->execute(array('profileId'=>$profileId, 'email'=>$email, 'code'=>$code));
	return $result;
  }

/*
  public static function add_user($email, $password, $type, $ip) {
	include ('connect.php');

	mysqli_query($db_conx, "INSERT INTO Profiles (name, emails, password, type, last_ip) VALUES ('$username', '$email', '$password', '$type', '$ip')") or die (mysqli_error());
	return $result;   
  }

  public static function verify_user($email, $password) {
	include ('connect.php');

	$result = mysqli_query($db_conx, "SELECT * FROM Profiles WHERE emails LIKE '%$email%' AND password = '$password'") or die (mysqli_error());
	return $result;   
  }

  public static function verify_temporary_user($username, $temp_pass) {
	include ($_SERVER["DOCUMENT_ROOT"] . '/php/connect.php');

	$result = mysqli_query($db_conx, "SELECT * FROM Profiles WHERE name = '$username' AND temp_pass = '$temp_pass'") or die (mysqli_error());
	return $result;   
  }

  public static function add_user_info($profileId, $first_name, $last_name) {
	include ('connect.php');

	mysqli_query($db_conx, "INSERT INTO UserInfo (profileId, firstName, lastName) VALUES ($profileId, '$first_name', '$last_name')") or die (mysqli_error());
	return $result;  
  }

  public static function add_provider_info($profileId) {
	include ('connect.php');

	mysqli_query($db_conx, "INSERT INTO ProviderInfo (profileId) VALUES ($profileId)") or die (mysqli_error());
	return $result;  
  }

  public static function get_user_info($profileId) {
	include ('connect.php');

	$result = mysqli_query($db_conx, "SELECT * FROM UserInfo WHERE profileId = $profileId") or die (mysqli_error());
	return $result;   
  }

  public static function update_user_info($profileId, $motto, $address) {
	include ('connect.php');

	mysqli_query($db_conx, "UPDATE UserInfo SET motto = '$motto', address = '$address' WHERE profileId = $profileId") or die (mysqli_error());
	return $result;
  }

  // Email codes

  public static function update_temp_email_codes($profile_id, $status) {
	include ('connect.php');

	$result =  mysqli_query($db_conx, "UPDATE TempPhoneCodes SET status = $status WHERE profile_id = $profile_id") or die (mysqli_error());
	return $result;
  }

  public static function insert_temp_email_codes($profile_id, $code, $phone) {
	include ('connect.php');

	$result =  mysqli_query($db_conx, "INSERT INTO TempPhoneCodes (profile_id, code, email, date_created) VALUES ($profile_id, '$code', '$phone', now())") or die (mysqli_error()); 
	return $result;
  }

  public static function select_temp_email_codes($profile_id, $code) {
	include ('connect.php');

	$result = mysqli_query($db_conx, "SELECT * FROM TempPhoneCodes WHERE profile_id = $profile_id AND code = '$code' AND status = 1 AND date_created > DATE_SUB(now(), INTERVAL 15 MINUTE)") or die (mysqli_error());
	return $result;
  }
 */
}
