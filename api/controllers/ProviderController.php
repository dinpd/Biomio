<?php
//Provider controller class

class UserController {

	// ------ SIGN UP -------

	public static function get_private_key($public_key) {
		include ('connect.php');

		$result = $pdo->prepare("SELECT * FROM ProviderKeys WHERE public_key = :public_key");
		$result->execute(array('public_key'=>$public_key));
		if ($result->rowCount() == 0) return 0;
		else {
			$row = $result->fetch();
			return $row['private_key'];
		}
	}

	public static function get_providerId($public_key) {
		include ('connect.php');

		$result = $pdo->prepare("SELECT * FROM ProviderKeys WHERE public_key = :public_key");
		$result->execute(array('public_key'=>$public_key));
		if ($result->rowCount() == 0) return 0;
		else {
			$row = $result->fetch();
			// Return providerId
			return $row['id'];
		}
	}

	public static function add_user($provider_id, user_id) {
		include ('connect.php');

		$result = $pdo->prepare("SELECT * FROM ProviderUsers WHERE provider_id = :provider_id AND user_id = :user_id");
		$result->execute(array('provider_id'=>$provider_id, 'user_id'=>$user_id));
		if ($result->rowCount() != 0) return 0;
		else {
			$result = $pdo->prepare("INSERT INTO ProviderUsers (provider_id, user_id) VALUES (:provider_id, :user_id)");
			$result->execute(array('provider_id'=>$provider_id, 'user_id'=>$user_id));
			return '#success';
		}
	}

}