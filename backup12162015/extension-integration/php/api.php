<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

if (isset($_POST['cmd'])) {
	
	$cmd = $_POST['cmd'];
	
	switch ($cmd) {

		case 'check_email':
			$email = $_POST['email'];

			$url = "https://biom.io/api/login.php/check_email/" . $email;
			$curl = curl_init($url);
			curl_setopt($curl, CURLOPT_HEADER, false);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl, CURLOPT_HTTPHEADER,
			        array("Content-type: application/json"));
			curl_setopt($curl, CURLOPT_POST, true);

			$json_response = curl_exec($curl);

			$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

			if ( $status != 200 ) {
			    die("Error: call to URL $url failed with status $status, response $json_response, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
			}

			$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

			echo $json_response;
		break;

		case 'check_code':
			$code = $_POST['code'];

			$url = "https://biom.io/api/login.php/check_code/" . $code;    
			$curl = curl_init($url);
			curl_setopt($curl, CURLOPT_HEADER, false);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl, CURLOPT_HTTPHEADER,
			        array("Content-type: application/json"));
			curl_setopt($curl, CURLOPT_POST, true);

			$json_response = curl_exec($curl);

			$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

			if ( $status != 200 ) {
			    die("Error: call to URL $url failed with status $status, response $json_response, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
			}

			$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

			echo $json_response;
		break;

		default: 
			echo 'Something is wrong';
		break;
	}
}
