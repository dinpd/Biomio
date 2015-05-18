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
	}
	return $result;
  }

  public static function add_user($name, $email, $password, $type, $ip) {
	include ('connect.php');

	mysqli_query($db_conx, "INSERT INTO Profiles (name, emails, password, type, last_ip) VALUES ('$name', '$email', '$password', '$type', '$ip')") or die (mysqli_error());
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

  public static function add_user_info($profileId) {
	include ('connect.php');

	mysqli_query($db_conx, "INSERT INTO UserInfo (profileId) VALUES ($profileId)") or die (mysqli_error());
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
}

