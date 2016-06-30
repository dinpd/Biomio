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


    public static  function create_image_code($code)
    {
		$image = imagecreatetruecolor(260, 40); // creating an image

		$background_color = imagecolorallocate($image, 255, 255, 255); // white background
		imagefilledrectangle($image,0,0,260,40,$background_color); // rectangular shape

		// 2) Adding horizontal line
		$line_color = imagecolorallocate($image, 255,96,0); // black line color
		for($i=0;$i<10;$i++) {
			$line_start = rand()%40;
			$line_end = $line_start + rand(-20, 20);
			imageline($image,0,$line_start,260,$line_end,$line_color); // adding 10 lines (x1, y1, x2, y2)
		}

		// 3) Adding vertical line
		$line_color = imagecolorallocate($image, 255,96,0); // black line color
		for($i=0;$i<20;$i++) {
			$line_start = rand()%260;
			$line_end = $line_start + rand(-20, 20);
			imageline($image,$line_start,0,$line_end,40,$line_color); // adding 10 lines (x1, y1, x2, y2)
		}

		// 4) Adding dots
		$pixel_color = imagecolorallocate($image, 30,71,183); // dot color
		for($i=0;$i<1000;$i++) {
			imagesetpixel($image,rand()%260,rand()%40,$pixel_color); // add 1000 dots
		}

		// 5) Adding text
		$len = strlen($code);
		$text_color = imagecolorallocate($image, 0,0,0);
		$text_shadow = imagecolorallocate($image, 128, 128, 128);
		$font = 'fonts/Arial.ttf';

		for ($i = 0; $i< 8;$i++) {
			$letter = $code[$i];
			$angle = rand(-5, 5);
			imagettftext($image, 20, $angle, 19+($i*30), 31, $text_shadow, $font, $letter); // add shadow
			imagettftext($image, 20, $angle, 18+($i*30), 30, $text_color, $font, $letter); //add text
		}

		ob_start();
		imagepng($image);
		$buffer = ob_get_clean();
		ob_end_clean();
		return base64_encode($buffer);
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
