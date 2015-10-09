<?php
//Email controller class

class Email {
	
	public static function welcome_email($email, $first_name, $last_name, $code) {
		$to = $email;

		$from = "BIOMIO service <service@biom.io>";
		$from_name = "BIOMIO service";
		$subject = "BIOMIO: Email Verification";

		$body = file_get_contents("../tpl/emails/WelcomeEmail.html");
		$body = str_replace('%email%',$email,$body);
		$body = str_replace('%first_name%',$first_name,$body);
		$body = str_replace('%last_name%',$last_name,$body);
		$body = str_replace('%code%',$code,$body);

		
		$headers = "From: $from\n";
		        $headers .= "MIME-Version: 1.0\n";
		        $headers .= "Content-type: text/html; charset=iso-8859-1\n";
		mail($to, $subject, $body, $headers);

		//monkey_mail($to, $subject, $body, $from, $from_name);
	}

	public static function send_email_verification_code($email, $first_name, $last_name, $code) {
		$to = $email;
		$from = "BIOMIO login <login@biom.io>";
		$from_name = "BIOMIO login";
		$subject = "BIOMIO: Email Verification";

		$body = file_get_contents("../tpl/emails/EmailVerification.html");
		$body = str_replace('%email%',$email,$body);
		$body = str_replace('%first_name%',$first_name,$body);
		$body = str_replace('%last_name%',$last_name,$body);
		$body = str_replace('%code%',$code,$body);

		
		$headers = "From: $from\n";
		        $headers .= "MIME-Version: 1.0\n";
		        $headers .= "Content-type: text/html; charset=iso-8859-1\n";
		mail($to, $subject, $body, $headers);

		//monkey_mail($to, $subject, $body, $from, $from_name);
	}

	public static function login_code($code, $email) {
		//$to = "ditkis@gmail.com";
		$from = "BIOMIO login <login@biom.io>";
		$from_name = "BIOMIO login";
		$subject = "BIOMIO: Temporary login code";
		$to = $email;

		$body = file_get_contents("../tpl/emails/LoginCode.html");
		$body = str_replace('%code%',$code,$body);

		
		$headers = "From: $from\n";
		        $headers .= "MIME-Version: 1.0\n";
		        $headers .= "Content-type: text/html; charset=iso-8859-1\n";
		mail($to, $subject, $body, $headers);
		
		//monkey_mail($to, $subject, $body, $from, $from_name);
	}

	// -------------------
	public static function contact($name, $email, $message) {
		//$to = "ditkis@gmail.com";
		$from = "BIOMIO service <service@biom.io>";
		$from_name = "BIOMIO service";
		$subject = "BIOMIO: New Message from User";

		$body = file_get_contents("../tpl/emails/ContactEmail.html");
		$body = str_replace('%name%',$name,$body);
		$body = str_replace('%email%',$email,$body);
		$body = str_replace('%message%',$message,$body);

		
		$headers = "From: $from\n";
		        $headers .= "MIME-Version: 1.0\n";
		        $headers .= "Content-type: text/html; charset=iso-8859-1\n";
		$to = "alexander.lomov1@gmail.com";
		mail($to, $subject, $body, $headers);
		

		$to = "alexander.lomov1@gmail.com";
		monkey_mail($to, $subject, $body, $from, $from_name);

		$to = "ditkis@gmail.com";
		monkey_mail($to, $subject, $body, $from, $from_name);
		return '#success';
	}
}


function monkey_mail($to, $subject, $body, $from, $from_name) {

	require_once 'mandrill/Mandrill.php';
	try {
	    $mandrill = new Mandrill('vyS5QUBZJP9bstzF1zeVNA');
	    $message = array(
	        'html' => $body,
	        'subject' => $subject,
	        'from_email' => $from,
	        'from_name' => $from_name,
	        'to' => array(
	            array(
	                'email' => $to,
	                'type' => 'to'
	            )
	        )  
	    );
	    $async = false;
	    $result = $mandrill->messages->send($message, $async);
	} catch(Mandrill_Error $e) {
	    // Mandrill errors are thrown as exceptions
	    //echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
	    // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	    throw $e;
	}

}