<?php
//Provider controller class

class ProviderController {

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

	public static function add_user($provider_id, $user_id) {
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

	public static function load_provider_users() {
		if (!isset($_SESSION['id']) || !isset($_SESSION['providerId'])) {echo json_encode(array('response'=>'#session')); break;}
		else {
			$providerId = $_SESSION['providerId'];

			$result = Provider::load_provider_users($providerId);
			$data = array();
			foreach ($result as $row) {
				$data[] = array('id'=>$row['user_id'], 'first_name'=>$row['firstName'], 'last_name'=>$row['lastName'], 'email'=>$row['email'], 'status'=>$row['status']);
			}
			echo json_encode($data);
		}
	}

	public static function add_provider_user($user_email) {
		if (!isset($_SESSION['id']) || !isset($_SESSION['providerId'])) {echo '#session'; break;}
		else {
			$providerId = $_SESSION['providerId'];

			// check if user exists in a system
			$result = Provider::check_email($user_email);
			if ($result->rowCount() != 0) {
				// if user exists add user as an invitation
				$row = $result->fetch();
				$userId = $row['profileId'];
				$result = Provider::check_provider_user($providerId, $userId);

				if ($userId == $_SESSION['id']) {
					echo '#mine';
				} else if ($result->rowCount() == 0) {

					$result = Provider::add_provider_user($providerId, $userId, 'invitation');

					// send the invitation email to the user

					echo '#invited';
				} else {
					echo '#exists';
				}
			} else {
				// if user does not exist, add user to our system

				// add user as invitation 

				// send welcome from provider email to the user

				echo '#not-found';
			}
		}
	}

	public static function delete_provider_user($userId) {
		if (!isset($_SESSION['id']) || !isset($_SESSION['providerId'])) {echo '#session'; break;}
		else {
			$providerId = $_SESSION['providerId'];

			// check if user belongs to provider
			$result = Provider::check_provider_user($providerId, $userId);
			if ($result->rowCount() != 0) {

				$result = Provider::delete_provider_user($providerId, $userId);

				echo '#success';
			} else {
				echo '#wrong-user';
			}
			// delete user
		}
	}

}