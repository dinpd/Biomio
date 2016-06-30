#!/usr/bin/php -q
<?php
	include ('../connect.php');

	//1) GETTING EMAIL AS A ROUGH STRING
	//get mail contents
	$fd = fopen("php://stdin", "r");
	$email_content = "";
	while (!feof($fd)) {
		$email_content .= fread($fd, 1024);
	}
	fclose($fd);
	//now parse through email
	//split the string into array of strings, each of the string represents a single line, received
	$lines = explode("\n", $email_content);
	 
	//2) PARSING EMAIL FOR SPESIFIC PARTS
	// initialize variable which will assigned later on
	$from = "";
	$subject = "";
	$headers = "";
	$message = "";
	$is_header= true;
	 
	//loop through each line
	for ($i=0; $i < count($lines); $i++) {
		if ($is_header) {
			// hear information. instead of main message body, all other information are here.
			$headers .= $lines[$i]."\n";
			 
			// Split out the subject portion
			if (preg_match("/^Subject: (.*)/", $lines[$i], $matches)) {
				$subject = $matches[1];
				}
			//Split out the sender information portion
			if (preg_match("/^From: (.*)/", $lines[$i], $matches)) {
				$from = $matches[1];
			}
		} else {
			// content/main message body information
			$message .= $lines[$i]."\n";
			}
		if (trim($lines[$i])=="") {
			// empty line, header section has ended
			$is_header = false;
		}
	}
	//we don't want to accept any deliviries from all but one (two) emails
	if (strpos($headers,'ditkis@gmail.com') || strpos($headers,'alexander.lomov1@gmail.com')) {
		//3) CLEANING EMAIL FROM DIFFERENT HEADERS
		preg_match("/boundary=\".*?\"/i", $headers, $boundary);
		$boundaryfulltext = $boundary[0];

		if ($boundaryfulltext!="") {
			$find = array("/boundary=\"/i", "/\"/i");
			$boundarytext = preg_replace($find, "", $boundaryfulltext);
			$splitmessage = explode("--" . $boundarytext, $message);
			$fullmessage = ltrim($splitmessage[1]);
			preg_match('/\n\n(.*)/is', $fullmessage, $splitmore);

			if (substr(ltrim($splitmore[0]), 0, 2)=="--") {
				$actualmessage = $splitmore[0];
			} else {
				$actualmessage = ltrim($splitmore[0]);
			}

		} else {
			$actualmessage = ltrim($message);
		}

		$clean = array("/\n--.*/is", "/=3D\n.*/s");
		$cleanmessage = trim(preg_replace($clean, "", $actualmessage)); 
		$cleanmessage = preg_replace('#(^\w.+:\n)?(^>.*(\n|$))+#mi', "", $cleanmessage);
		$cleanmessage = explode('charset=UTF-8', $cleanmessage);
		$cleanmessage = $cleanmessage[1];
		// *end formating

		//4) SENSING EMAIL
		//email data
		$emails = array();
		$emails[] = array('email'=>'alexander.lomov1@gmail.com', 'username'=>'Alexander');
		$from = "service@biom.io";
		$subject = $subject;
		$body = file_get_contents("../../tpl/forms/StandartEmail.html");
		$body = str_replace('%body%',$cleanmessage,$body);
		$headers = "From: $from\n";
		        $headers .= "MIME-Version: 1.0\n";
		        $headers .= "Content-type: text/html; charset=iso-8859-1\n";

		//get array of emails for the selected category
		$result = mysqli_query($db_conx, "SELECT * FROM Applications WHERE type = 'Developer'") or die (mysqli_error());
		while ($row = mysqli_fetch_array($result)) {
			$emails[] = array('email'=>$row['email'], 'username'=>$row['name']);
		}

		//send email
		foreach ($emails as $email) {
			$final_body = str_replace('%username%',$email['username'],$body);
			mail($email['email'], $subject, $final_body, $headers);
		}
	} else {
		$email = 'alexander.lomov1@gmail.com';
		$me = "service@biom.io";
		$subject = $subject;
		$body = file_get_contents("../../tpl/forms/StandartEmail.html");
		$body = str_replace('%body%',"Hello, if you have any questions regarding BIOMIO project, please send your message to service@biom.io. Thank you!",$body);
		$headers = "From: $me\n";
		        $headers .= "MIME-Version: 1.0\n";
		        $headers .= "Content-type: text/html; charset=iso-8859-1\n";
		mail($email, $subject, $body, $headers);
	}
?>