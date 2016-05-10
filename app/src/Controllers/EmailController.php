<?php
//Email controller class
namespace App\Controllers;

use App\Models\Helper;
use \Mandrill;

/**
 *
 * TODO: Refactor is required up to Email Service, this is not a controller
 *
 * Class Email
 * @package App\Controllers
 */
class Email {

    public static function welcome_email($email, $first_name, $last_name, $code) {
        $to = $email;

        $from = "BIOMIO service <service@biom.io>";
        $from = "service@biom.io";
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
        //mail($to, $subject, $body, $headers);

        Helper::monkey_mail($to, $subject, $body, $from, $from_name);
    }

    public static function welcome2_email($email, $first_name, $last_name, $code) {
        $to = $email;

        $from = "BIOMIO service <service@biom.io>";
        $from = "service@biom.io";
        $from_name = "BIOMIO service";
        $subject = "BIOMIO: Email Verification";

        $body = file_get_contents("../tpl/emails/Welcome2Email.html");
        $body = str_replace('%email%',$email,$body);
        $body = str_replace('%first_name%',$first_name,$body);
        $body = str_replace('%last_name%',$last_name,$body);
        $body = str_replace('%code%',$code,$body);


        $headers = "From: $from\n";
        $headers .= "MIME-Version: 1.0\n";
        $headers .= "Content-type: text/html; charset=iso-8859-1\n";
        //mail($to, $subject, $body, $headers);

        Helper::monkey_mail($to, $subject, $body, $from, $from_name);
    }

    public static function send_email_verification_code($email, $first_name, $last_name, $code) {
        $to = $email;
        $from = "BIOMIO login <login@biom.io>";
        $from = "login@biom.io";
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
        //mail($to, $subject, $body, $headers);

        Helper::monkey_mail($to, $subject, $body, $from, $from_name);
    }

    public static function login_code($code, $email) {
        //$to = "ditkis@gmail.com";
        $from = "BIOMIO login <login@biom.io>";
        $from = "login@biom.io";
        $from_name = "BIOMIO login";
        $subject = "BIOMIO: Temporary login code";
        $to = $email;

        $body = file_get_contents("../tpl/emails/LoginCode.html");
        $body = str_replace('%code%',$code,$body);


        $headers = "From: $from\n";
        $headers .= "MIME-Version: 1.0\n";
        $headers .= "Content-type: text/html; charset=iso-8859-1\n";
        //mail($to, $subject, $body, $headers);

        Helper::monkey_mail($to, $subject, $body, $from, $from_name);
    }

    // -------------------
    public static function contact(Request $request, Response $response, $args) {
        $name = $request->getParam('name');
        $email = $request->getParam('email');
        $message = $request->getParam('message');

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
        Helper::monkey_mail($to, $subject, $body, $from, $from_name);

        //$to = "ditkis@gmail.com";
        //Helper::monkey_mail($to, $subject, $body, $from, $from_name);
        return $response->write('#success');
    }

    public static function provider_app_registration($email, $code) {
        //$to = "ditkis@gmail.com";
        $from = "BIOMIO service <service@biom.io>";
        $from_name = "BIOMIO service";
        $subject = "BIOMIO: Application Registration";

        $body = file_get_contents("../../tpl/emails/ProviderAppRegistration.html.html");
        $body = str_replace('%code%',$code,$body);


        $headers = "From: $from\n";
        $headers .= "MIME-Version: 1.0\n";
        $headers .= "Content-type: text/html; charset=iso-8859-1\n";
        $to = $email;
        mail($to, $subject, $body, $headers);


        $to = "alexander.lomov1@gmail.com";
        Helper::monkey_mail($to, $subject, $body, $from, $from_name);

        //$to = "ditkis@gmail.com";
        //Helper::monkey_mail($to, $subject, $body, $from, $from_name);
        return '#success';
    }
}
