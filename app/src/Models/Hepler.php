<?php

namespace App\Models;
use \Mandrill;
use Mailgun\Mailgun;

class Helper
{

    public static function genCode()
    {
        $code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
        $code = substr(str_shuffle($code), 0, 8);
        return $code;
    }

    public static function genApiCode()
    {
        $code = "_____-----_____-----ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz01234567890123456789012345678901234567890123456789012345678901234567890123456789";
        $code = substr(str_shuffle($code), 0, 15);
        return $code;
    }

    /**
     * Check whenever $host is google mx
     *  TODO: Refactoring is required
     *
     * @param $host
     * @return bool
     */
    public static function is_google_mx($host)
    {
        $records = dns_get_record($host, DNS_MX);
        foreach ($records as $record) {
            if (substr(strtolower($record['target']), -11) == '.google.com') return true;
            if (substr(strtolower($record['target']), -15) == '.googlemail.com') return true;
        }
        return false;
    }


    public static function check_mail_for_google_mx($email)
    {
        list($user, $domain) = explode('@', $email);
        if (self::is_google_mx($domain)) {
            return 1;
        } else
            return 0;

    }


    public static function send_post($url)
    {
        //echo $url;
        $data = array();

        # Create a connection
        $ch = curl_init($url);

        # Form data string
        $postString = http_build_query($data, '', '&');

        # Setting our options
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postString);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        # Get the response
        $response = curl_exec($ch);
        curl_close($ch);
        return $response;
    }

    public static function get_remote_addr()
    {
        return getenv('REMOTE_ADDR');
    }


    public static function send_phone_clickatel($phone, $code)
    {
        /* START Some legacy stuff */
        //TODO: find out what to do with that legacy things
        // send code
        $user = "biomio";
        $password = "JFAOSMGDHfKcWR";
        $api_id = "3524018";
        $baseurl = "http://api.clickatell.com";
        $text = urlencode("BIOMIO temporary login code: " . $code);
        $to = $phone;
        $from = "17577932772";
        $mo = "1";

        $url = "$baseurl/http/sendmsg?user=$user&password=$password&api_id=$api_id&to=$to&text=$text&mo=$mo&from=$from";
        return file($url);
        /* END Some legacy stuff */
    }


    public static function monkey_mail($to, $subject, $body, $from, $from_name)
    {
        # Instantiate the client.
        $mgClient = new Mailgun('key-cb667b91a9b8d25a56fbb32cc9f1d684');
        $domain = "sandbox540ad903206e4c7e9314d92e16dec8b9.mailgun.org";

        return $mgClient->sendMessage("$domain",
            array('from'    => $from_name.' <'.$from.'>',
                'to'      => $to,
                'subject' => $subject,
                'text'    => $body));



//        //require_once 'mandrill/Mandrill.php';
//        try {
//            $mandrill = new Mandrill('vyS5QUBZJP9bstzF1zeVNA');
//            $message = array(
//                'html' => $body,
//                'subject' => $subject,
//                'from_email' => $from,
//                'from_name' => $from_name,
//                'to' => array(
//                    array(
//                        'email' => $to,
//                        'type' => 'to'
//                    )
//                )
//            );
//            $async = false;
//            return $mandrill->messages->send($message, $async);
//        } catch (Mandrill_Error $e) {
//            // Mandrill errors are thrown as exceptions
//            //echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
//            // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
//            throw $e;
//        }

    }


}