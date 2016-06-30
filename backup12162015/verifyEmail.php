<?php

if (isset($_GET['e']) && isset($_GET['c'])) {
	include ('php/connect.php');
	
	$email = $_GET['e'];
	$code = $_GET['c'];

	$result = $pdo->prepare("SELECT * FROM TempEmailCodes WHERE email = :email AND code = :code /*AND date_created > DATE_SUB(now(), INTERVAL 15 MINUTE)*/");
	$result->execute(array('email'=>$email, 'code'=>$code));

	if ($result->rowCount() == 0) echo 'Wrong information provided';
	else {
		foreach ($result as $row) {
			if ($row['status'] == 0) echo 'Code is expired';
			else if ($row['status'] == 2) echo 'Code is already verified';
			else {
				$profileId = $row['profileId'];

				$result = $pdo->prepare("UPDATE Emails SET verified = 1 WHERE profileId = :profileId AND email = :email");
				$result->execute(array('profileId'=>$profileId, 'email'=>$email));

				$result = $pdo->prepare("UPDATE TempEmailCodes SET status = 2 WHERE code = :code AND email = :email");
				$result->execute(array('email'=>$email, 'code'=>$code));

				echo 'Code successfully verified';
			}
		}
	}

} else {
	echo "Wrong information provided";
}