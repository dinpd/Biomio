<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

echo 'email sent: <br>';
$to = 'alexander.lomov1@gmail.com';
$from = "system@biom.io";
$subject = "BIOMIO: Test";

$body = 'Test Test Test';

$headers = "Reply-To: BIOMIO system $from\r\n"; 
$headers .= "Return-Path: BIOMIO system $from\r\n"; 
$headers .= "From: $from\n";
$headers .= "Organization: BIOMIO\r\n";
$headers .= "MIME-Version: 1.0\n";
$headers .= "Content-type: text/html; charset=iso-8859-1\n";

mail($to, $subject, $body, $headers);
echo 'to: ' . $to . '<br>';
/*
$to = 'boris.itkis@gmail.com';
mail($to, $subject, $body, $headers);
echo 'to: ' . $to . '<br>';

$to = 'ditkis@gmail.com';
mail($to, $subject, $body, $headers);
echo 'to: ' . $to . '<br>';
*/
echo 'from: ' .  $from . '<br>';

/*
require 'php/mailer/PHPMailerAutoload.php';

$mail = new PHPMailer;

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = '104.130.28.127;104.130.28.127';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'user@example.com';                 // SMTP username
$mail->Password = 'secret';                           // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to

$mail->From = 'from@example.com';
$mail->FromName = 'Mailer';
$mail->addAddress('alexander.lomov1@gmail.com');     // Add a recipient

$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Here is the subject';
$mail->Body    = 'This is the HTML message body <b>in bold!</b>';
$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}
*/


echo 'works';

