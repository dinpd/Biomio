<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

require ('controllers/EmailController.php');
require ('controllers/ProviderController.php');
require ('models/Provider.php');
require ('../php/connect.php');
session_start();


if (isset($_POST['cmd'])) {
	$action = $_POST['cmd'];
	switch($action) {
		case 'register':
			if (!isset($_SESSION['id'])) {echo '#session'; break;}
			else {
				$name = $_POST['name'];
				$ein = $_POST['ein'];
				$email = $_POST['email'];
				$phone = $_POST['phone'];
				$address = json_encode($_POST['address']);

				$profileId = $_SESSION['id'];

				// add provider information to Provider
				$result = $pdo->prepare("INSERT INTO Providers (name, ein, email, phone, address) 
										VALUES (:name, :ein, :email, :phone, :address)");
				$result->execute(array('name'=>$name, 'ein'=>$ein, 'email'=>$email, 'phone'=>$phone, 'address'=>$address));
				$providerId = $pdo->lastInsertId();

				// add provider to user connection
				$result = $pdo->prepare("INSERT INTO ProviderAdmins (profileId , providerId) 
										VALUES (:profileId, :providerId)");
				$result->execute(array('profileId'=>$profileId, 'providerId'=>$providerId));

				$_SESSION['providerId'] = $providerId;
				echo '#success';
			}
		break;
		
		case 'load_providers':
			if (!isset($_SESSION['id'])) {echo '#session'; break;}
			else {
				$profileId = $_SESSION['id'];
				$result = $pdo->prepare("SELECT p.id as 'p.id', p.name as 'p.name'
										FROM ProviderAdmins pa
										LEFT JOIN Providers p ON (pa.providerId = p.id)
										WHERE pa.profileId = :profileId");

				$result->execute(array('profileId'=>$profileId));
				$data = array();
				foreach ($result as $row) {
					$data[] = array('id'=>$row['p.id'], 'name'=>$row['p.name']);
				}

				echo json_encode($data);
			}
		break;

		case 'provider_info':
			if (!isset($_SESSION['id']) || !isset($_SESSION['providerId'])) {echo '#session'; break;}
			else {
				$profileId = $_SESSION['id'];
				$providerId = $_SESSION['providerId'];

				$result = $pdo->prepare("SELECT * FROM Providers WHERE id = :providerId");
				$result->execute(array('providerId'=>$providerId));
				$row = $result->fetch();
				$data = array('id'=>$row['id'], 'name'=>$row['name'], 
									'address'=>json_decode($row['address']), 
									'ein'=>$row['ein'],
									'phone'=>$row['phone'], 'email'=>$row['email']);
				echo json_encode($data);
			}
		break;

		case 'update_info':
			if (!isset($_SESSION['id']) || !isset($_SESSION['providerId'])) {echo '#session'; break;}
			else {
				$profileId = $_SESSION['id'];
				$providerId = $_SESSION['providerId'];
				$name = $_POST['name'];
				$ein = $_POST['ein'];
				$email = $_POST['email'];
				$phone = $_POST['phone'];
				$address = json_encode($_POST['address']);

				$result = $pdo->prepare("SELECT * FROM ProviderAdmins WHERE providerId = :providerId AND profileId = :profileId");
				$result->execute(array('providerId'=>$providerId, 'profileId'=>$profileId));
				if ($result->rowCount() == 0) {echo '#session'; break;}
				else {
					$result = $pdo->prepare("UPDATE Providers SET name=:name, ein=:ein, email=:email, phone=:phone, address=:address WHERE id = :providerId");
					$result->execute(array('providerId'=>$providerId, 'name'=>$name, 'ein'=>$ein,
							'email'=>$email, 'phone'=>$phone, 'address'=>$address));

					echo '#success';
				}
			}
		break;

		case 'save_website':
			if (!isset($_SESSION['id']) || !isset($_SESSION['providerId'])) {echo '#session'; break;}
			else {
				$title = $_POST['title'];
				$domain = $_POST['domain'];
				$hook = $_POST['hook'];
				$providerId = $_SESSION['providerId'];

				$result = $pdo->prepare("SELECT * FROM WebResources WHERE domain = :domain");
				$result->execute(array('domain'=>$domain));
				if ($result->rowCount() != 0) {echo '#exist'; break;}
				else {
					$result = $pdo->prepare("INSERT INTO WebResources (title, domain, hook, providerId) VALUES (:title, :domain, :hook, :providerId)");
					$result->execute(array('title'=>$title, 'domain'=>$domain, 'hook'=>$hook, 'providerId'=>$providerId));
					$id = $pdo->lastInsertId();
					echo $id;
				}
			}
		break;

		case 'load_websites':
			if (!isset($_SESSION['id']) || !isset($_SESSION['providerId'])) {echo '#session'; break;}
			else {
				$providerId = $_SESSION['providerId'];

				$result = $pdo->prepare("SELECT * FROM WebResources WHERE providerId = :providerId");
				$result->execute(array('providerId'=>$providerId));

				$data = array();

				foreach ($result as $row) {
					$data[] = array('id'=>$row['id'], 'title'=>$row['title'], 'domain'=>$row['domain'], 'hook'=>$row['hook']);
				}
				echo json_encode($data);
			}
		break;

		case 'delete_website':
			if (!isset($_SESSION['id']) || !isset($_SESSION['providerId'])) {echo '#session'; break;}
			else {
				$providerId = $_SESSION['providerId'];

				$id = $_POST['id'];

				$result = $pdo->prepare("DELETE FROM WebResources WHERE id = :id AND providerId = :providerId");
				$result->execute(array('id'=>$id, 'providerId'=>$providerId));
			}
		break;

		/*case 'generate_website_keys':
			if (!isset($_SESSION['id']) || !isset($_SESSION['providerId'])) {echo '#session'; break;}
			else {
				$providerId = $_SESSION['providerId'];

				$id = $_POST['id'];

				do {
					$pub = "_____-----_____-----ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz01234567890123456789012345678901234567890123456789012345678901234567890123456789";
			    	$pub =  substr(str_shuffle($pub),0,15);
			    	
			    	$result = $pdo->prepare("SELECT * FROM ClientKeys WHERE public_key = :public_key");
					$result->execute(array('public_key'=>$pub));
		    	} while ($result->rowCount() > 0);

		    	do {
					$priv = "_____-----_____-----ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz01234567890123456789012345678901234567890123456789012345678901234567890123456789";
			    	$priv =  substr(str_shuffle($priv),0,30);
			    	
			    	$result = $pdo->prepare("SELECT * FROM ClientKeys WHERE private_key = :private_key");
					$result->execute(array('private_key'=>$priv));
		    	} while ($result->rowCount() > 0);

				$result = $pdo->prepare("INSERT INTO ClientKeys (public_key, private_key, resourceId, providerId) VALUES (:public_key, :private_key, :resourceId, :providerId)");
				$result->execute(array('public_key'=>$pub, 'private_key'=>$priv, 'resourceId'=>$id, 'providerId'=>$providerId));
				
				$data = array('public_key'=>$pub, 'private_key'=>$priv);
				echo json_encode($data);
			}
		break;*/

		case 'load_provider_users':
			$result = ProviderController::load_provider_users();
			echo $result;
		break;
		case 'add_provider_user':
			$user_email = $_POST['user_email'];
			$result = ProviderController::add_provider_user($user_email);
			echo $result;
		break;
		case 'delete_provider_user':
			$userId = $_POST['userId'];
			$result = ProviderController::delete_provider_user($userId);
			echo $result;
		break;
	}
}


// users