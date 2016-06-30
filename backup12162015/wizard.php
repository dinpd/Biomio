<?php 
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);


if (isset($_GET['c'])) {
	$code = $_GET['c'];
	$state = $_GET['s'];

	include ('php/connect.php');

	$result = $pdo->prepare("SELECT * FROM TempLoginCodes WHERE code = :code AND (status = 1 OR status = 0)");
	$result->execute(array('code'=>$code));

	if ($result->rowCount() == 0) echo '<h1>The code is expired or invalid</h1>';
	else {
		$row = $result->fetch();
		$profileId = $row['profileId'];

		//$result = $pdo->prepare("UPDATE TempLoginCodes SET status = 0 WHERE code = :code");
		//$result->execute(array('code'=>$code));

		$result = $pdo->prepare("SELECT * FROM Profiles WHERE id = :profileId");
		$result->execute(array('profileId'=>$profileId));
		$row = $result->fetch();
		$type = $row['type'];

		$result = $pdo->prepare("SELECT * FROM UserInfo WHERE  profileId = :profileId");
		$result->execute(array('profileId'=>$profileId));
		$row2 = $result->fetch();
		$first_name = $row2['firstName'];
		$last_name = $row2['lastName'];

		$result = $pdo->prepare("UPDATE TempLoginCodes SET status = 3 WHERE code = :code");
		$result->execute(array('code'=>$code));

		session_start();
		$_SESSION['id'] = $profileId;
		$_SESSION['type'] = $type;
		$_SESSION['first_name'] = $first_name;
		$_SESSION['last_name'] = $last_name;

		if ($state == 0)
			header('Location: ./#user-info');
		else
			header('Location: ./#wizard/' . $state);
	}
}
