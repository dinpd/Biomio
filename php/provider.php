<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

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
	}
}
