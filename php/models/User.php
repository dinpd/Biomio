<?php
//User model class

class User {
  
  public static function find_user($fieldname, $value) {
	include ('connect.php');
	//include ($_SERVER["DOCUMENT_ROOT"] . '/php/connect.php');
	switch ($fieldname) {
	  case 'name':
	    $result = mysqli_query($db_conx, "SELECT * FROM Profiles WHERE name = '$value'") or die (mysqli_error());
		return $result;
	    break;

	  case 'emails':
	    $result = mysqli_query($db_conx, "SELECT * FROM Profiles WHERE emails LIKE '%$value%'") or die (mysqli_error());
	    return $result;
	    break;

	  case 'id':
	    $result = mysqli_query($db_conx, "SELECT * FROM Profiles WHERE id = $value") or die (mysqli_error());
	    return $result;
	    break;
	  case 'api_id':
	    $result = mysqli_query($db_conx, "SELECT * FROM Profiles WHERE api_id = $value") or die (mysqli_error());
	    return $result;
	    break;
	}
  }

  public static function update_user($profileId, $index, $value) {
	include ($_SERVER["DOCUMENT_ROOT"] . '/php/connect.php');

	switch ($index) {
	  case 'api_id':
	  		mysqli_query($db_conx, "UPDATE Profiles SET api_id = '$value' WHERE id = $profileId") or die (mysqli_error());
	    break;
	  case 'name':
			mysqli_query($db_conx, "UPDATE Profiles SET name = '$value' WHERE id = $profileId") or die (mysqli_error());
	    break;
	  case 'emails': 
	  		mysqli_query($db_conx, "UPDATE Profiles SET emails = '$value' WHERE id = $profileId") or die (mysqli_error());
	    break;
	  case 'password':
	  		mysqli_query($db_conx, "UPDATE Profiles SET password = '$value' WHERE id = $profileId") or die (mysqli_error());
	    break;
	  case 'temp_pass':
	  		mysqli_query($db_conx, "UPDATE Profiles SET temp_pass = '$value' WHERE id = $profileId") or die (mysqli_error());
	    break;
	  case 'type':
	  		mysqli_query($db_conx, "UPDATE Profiles SET type = '$value' WHERE id = $profileId") or die (mysqli_error());
	    break;
	  case 'last_ip':
	  		mysqli_query($db_conx, "UPDATE Profiles SET last_ip = '$value' WHERE id = $profileId") or die (mysqli_error());
	    break;
	  case 'phones':
	  		mysqli_query($db_conx, "UPDATE Profiles SET phones = '$value' WHERE id = $profileId") or die (mysqli_error());
	    break;
	}
	return $result;
  }

  public static function add_user($username, $email, $password, $type, $ip) {
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

  // Login codes
  public static function update_temp_login_code($profile_id, $status) {
	include ('connect.php');

	$result =  mysqli_query($db_conx, "UPDATE TempLoginCodes SET status = $status WHERE profile_id = $profile_id") or die (mysqli_error());
	return $result;
  }

  public static function insert_temp_login_codes($profileId, $code) {
	include ('connect.php');

	$result =  mysqli_query($db_conx, "INSERT INTO TempLoginCodes (profile_id, code, date_created) VALUES ($profileId, '$code', now())") or die (mysqli_error()); 
	return $result;
  }

  public static function select_temp_login_phone($profile_id, $phone) {
	include ('connect.php');

	$result = mysqli_query($db_conx, "SELECT * FROM Profiles WHERE id = $profile_id AND phones LIKE '%$phone%'") or die (mysqli_error());
	return $result;
  }

  public static function select_temp_login_email($profile_id, $email) {
	include ('connect.php');

	$result = mysqli_query($db_conx, "SELECT * FROM Profiles WHERE id = $profile_id AND emails LIKE '%$email%'") or die (mysqli_error());
	return $result;
  }

  public static function select_temp_login_code($profile_id, $code) {
	include ('connect.php');

	$result = mysqli_query($db_conx, "SELECT * FROM TempLoginCodes WHERE profile_id = $profile_id AND code = '$code' AND status = 1 AND date_created > DATE_SUB(now(), INTERVAL 15 MINUTE)") or die (mysqli_error());
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

  // Phone codes

  public static function update_temp_phone_codes($profile_id, $status) {
	include ('connect.php');

	$result =  mysqli_query($db_conx, "UPDATE TempPhoneCodes SET status = $status WHERE profile_id = $profile_id") or die (mysqli_error());
	return $result;
  }

  public static function insert_temp_phone_codes($profile_id, $code, $phone) {
	include ('connect.php');

	$result =  mysqli_query($db_conx, "INSERT INTO TempPhoneCodes (profile_id, code, phone, date_created) VALUES ($profile_id, '$code', '$phone', now())") or die (mysqli_error()); 
	return $result;
  }

  public static function select_temp_phone_codes($profile_id, $code) {
	include ('connect.php');

	$result = mysqli_query($db_conx, "SELECT * FROM TempPhoneCodes WHERE profile_id = $profile_id AND code = '$code' AND status = 1 AND date_created > DATE_SUB(now(), INTERVAL 15 MINUTE)") or die (mysqli_error());
	return $result;
  }
}