<?php
//Provider controller class

class Provider {
  
  public static function load_provider_users($providerId) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM ProviderUsers p
							INNER JOIN Emails e ON e.profileId=p.user_id 
							INNER JOIN UserInfo u ON u.profileId=p.user_id
							WHERE e.primary = 1 AND p.provider_id = :provider_id");
	$result->execute(array('provider_id'=>$providerId));
	return $result;
  }

  public static function check_email($email) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM Emails WHERE email = :email");
	$result->execute(array('email'=>$email));
	return $result;
  }

  public static function add_provider_user($providerId, $userId, $status) {
	include ('connect.php');
	$result = $pdo->prepare("INSERT INTO ProviderUsers (provider_id, user_id, status) VALUES (:provider_id, :user_id, :status)");
	$result->execute(array('provider_id'=>$providerId, 'user_id'=>$userId, 'status'=>$status));
	return $result;
  }

  public static function check_provider_user($providerId, $userId) {
	include ('connect.php');
	$result = $pdo->prepare("SELECT * FROM ProviderUsers WHERE provider_id = :provider_id AND user_id = :user_id");
	$result->execute(array('provider_id'=>$providerId, 'user_id'=>$userId));
	return $result;
  }

  public static function delete_provider_user($providerId, $userId) {
	include ('connect.php');
	$result = $pdo->prepare("DELETE FROM ProviderUsers WHERE provider_id = :provider_id AND user_id = :user_id");
	$result->execute(array('provider_id'=>$providerId, 'user_id'=>$userId));
	return $result;
  }

}