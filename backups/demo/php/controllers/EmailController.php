<?php
//Email controller class

class Email {
	
	public static function temp_pass($username, $email, $password) {
		$to = $email;
		$from = "password@biom.io";
		$subject = "BIOMIO: Retrieve your Password";

		$body = file_get_contents("../tpl/forms/ResetPasswordEmail.html");
		$body = str_replace('%username%',$username,$body);
		$body = str_replace('%temp_pass%',$password,$body);

		$headers = "From: $from\n";
		        $headers .= "MIME-Version: 1.0\n";
		        $headers .= "Content-type: text/html; charset=iso-8859-1\n";
		mail($to, $subject, $body, $headers);
		return '#success';
	}
	public static function contact($name, $email, $message) {
		//$to = "ditkis@gmail.com";
		$from = "contact@biom.io";
		$subject = "BIOMIO: New Message from User";

		$body = file_get_contents("../tpl/forms/ContactEmail.html");
		$body = str_replace('%name%',$name,$body);
		$body = str_replace('%email%',$email,$body);
		$body = str_replace('%message%',$message,$body);

		$headers = "From: $from\n";
		        $headers .= "MIME-Version: 1.0\n";
		        $headers .= "Content-type: text/html; charset=iso-8859-1\n";
		//mail($to, $subject, $body, $headers);

		$to = "alexander.lomov1@gmail.com";
		mail($to, $subject, $body, $headers);
		return '#success';
	}
	public static function login_code($code, $email) {
		//$to = "ditkis@gmail.com";
		$from = "contact@biom.io";
		$subject = "BIOMIO: Temporary login code";

		$body = file_get_contents("../tpl/forms/LoginCode.html");
		$body = str_replace('%code%',$code,$body);

		$headers = "From: $from\n";
		        $headers .= "MIME-Version: 1.0\n";
		        $headers .= "Content-type: text/html; charset=iso-8859-1\n";
		//mail($to, $subject, $body, $headers);

		$to = $email;
		mail($to, $subject, $body, $headers);
	}
}