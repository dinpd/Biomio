<?php
include ('connect.php');

use App\Models\Helper;
include ( dirname(__DIR__) . '/../app/src/Models/Hepler.php');


session_start();
if (isset($_POST['name'])) {
	$name = $_POST['name'];
	$email = $_POST['email'];
	$type = $_POST['type'];


	$charset = array('0', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
		$code = '';
			for ($i=0; $i<15; $i++) { $code = $code . $charset[rand(0, count($charset))-1]; }

	mysqli_query($db_conx, "INSERT INTO Splash (name, email, type, code, date_created) VALUES ('$name', '$email', '$type', '$code', now())") or die (mysqli_error());
	
	$from = "splash@biom.io";
	$from_name = "Splash BIOMIO";
	$subject = "BIOMIO: New application";

	$body = file_get_contents("../tpl/emails/NewApplication.html");
	$body = str_replace('%name%', $name, $body);
	$body = str_replace('%email%', $email, $body);
	$body = str_replace('%type%', $type, $body);
	$body = str_replace('%code%', $code, $body);

	$to = "alexander.lomov1@gmail.com";
	Helper::sent_email($to, $subject, $body, $from, $from_name);


	$to = "ditkis@gmail.com";
	Helper::sent_email($to, $subject, $body, $from, $from_name);

	/*
	$headers = "From: $from\n";
	        $headers .= "MIME-Version: 1.0\n";
	        $headers .= "Content-type: text/html; charset=iso-8859-1\n";
	mail($to, $subject, $body, $headers);

	$to = 'alexander.lomov1@gmail.com';
	mail($to, $subject, $body, $headers);
	*/

	echo 'success';

} else if (isset($_POST['code'])) {
	$code = $_POST['code'];

	//echo $code;

	$result = mysqli_query($db_conx, "SELECT * FROM Splash WHERE code = '$code'") or die (mysqli_error());
	if (mysqli_num_rows($result) == 0) {
		echo "#incorrect";
	} else if (mysqli_num_rows($result) > 1) {
		echo "#error";
	} else if (mysqli_num_rows($result) == 1) {
		$row = mysqli_fetch_array($result);
		$name = $row['name'];

		setcookie('apply', $name, time()+365*24*60*60); //set cookie for a year
		echo $name;
	}

} else if (isset($_POST['check'])) {
	if (isset($_COOKIE['apply'])) echo 'COOKIE:' . $_COOKIE['apply'];
	else echo '';

//For invitations, it will work, only if both code and username are set
} else if (isset($_GET['u']) &&  isset($_GET['c'])  && !isset($_GET['e']) && !isset($_GET['d'])) {
	$name = $_GET['u'];
	$code = $_GET['c'];

	$name = str_replace('%20', ' ', $name);

	//check if the code is valid for this username
	$result = mysqli_query($db_conx, "SELECT * FROM Splash WHERE name = '$name' AND code = '$code'") or die (mysqli_error());
	if (mysqli_num_rows($result) == 0) {
		echo "Username or the invitation code is incorrect";
	} else if (mysqli_num_rows($result) > 1) {
		echo "Something strange is going on, ask Developer for assistance";
	} else {
		$result = mysqli_query($db_conx, "SELECT * FROM Splash WHERE name = '$name' AND code = '$code' AND invitation = 'no'") or die (mysqli_error());
		if (mysqli_num_rows($result) == 0) {
			echo "Invitation has already been sent";
		} else {

			//get additional data from the database
			$row = mysqli_fetch_array($result);
			$email = $row['email'];
			$type = $row['type'];

			echo '<br>email: ' . $email . '<br>';

			//send a message
			$to = $email;	 
			$from = "Splash@biom.io";
			$from_name = "BIOMIO service";
			$subject = "BIOMIO: Application accepted";

			$body = file_get_contents("../tpl/emails/NewInvitation.html");
			$body = str_replace('%name%', $name, $body);
			$body = str_replace('%code%', $code, $body);

			Helper::sent_email($to, $subject, $body, $from, $from_name);

			mysqli_query($db_conx, "UPDATE Splash SET invitation = 'yes' WHERE name = '$name' AND code = '$code'") or die (mysqli_error());

			echo 'Invitation code has been successfully sent';
		}

	}

//In case when user pressed the button -> saving cookies, redirecting him to the main page 
} else if (isset($_GET['u']) &&  isset($_GET['c'])  && isset($_GET['e'])) {
	$name = $_GET['u'];
	$code = $_GET['c'];

	$name = str_replace('%20', ' ', $name);

	//check if the code is valid for this username
	$result = mysqli_query($db_conx, "SELECT * FROM Splash WHERE name = '$name' AND code = '$code'") or die (mysqli_error());
	if (mysqli_num_rows($result) == 0) {
		echo "Username or the invitation code is incorrect";
	} else if (mysqli_num_rows($result) > 1) {
		echo "Something strange is going on, ask Developer for assistance";
	} else {
		setcookie('apply', $name, time()+365*24*60*60); //set cookie for a year

		header("Location: http://biom.io/");
	}
//In case when we want to delete a row
} else if (isset($_GET['u']) &&  isset($_GET['c'])  && isset($_GET['d'])) {
	$name = $_GET['u'];
	$code = $_GET['c'];

	$name = str_replace('%20', ' ', $name);

	//check if the code is valid for this username
	$result = mysqli_query($db_conx, "SELECT * FROM Splash WHERE name = '$name' AND code = '$code'") or die (mysqli_error());
	if (mysqli_num_rows($result) == 0) {
		echo "Username or the invitation code is incorrect";
	} else if (mysqli_num_rows($result) > 1) {
		echo "Something strange is going on, ask Developer for assistance";
	} else {
		$result = mysqli_query($db_conx, "DELETE FROM Splash WHERE name = '$name' AND code = '$code'") or die (mysqli_error());
		echo "Application is removed from the list";
	}
} else {
	echo 'Wrong place to be';
}


