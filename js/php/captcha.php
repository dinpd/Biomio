<?php
session_start();

if (isset($_POST['cmd'])) {
	$cmd = $_POST['cmd'];

	switch ($cmd) {
		case 'create_image':
			// 1) Creating an image
			$image = imagecreatetruecolor(200, 40); // creating an image

			$background_color = imagecolorallocate($image, 255, 255, 255); // white background 
			imagefilledrectangle($image,0,0,200,40,$background_color); // rectangular shape

			// 2) Adding horizontal line
			$line_color = imagecolorallocate($image, 255,96,0); // black line color
			for($i=0;$i<10;$i++) {
				$line_start = rand()%40;
				$line_end = $line_start + rand(-20, 20);
			    imageline($image,0,$line_start,200,$line_end,$line_color); // adding 10 lines (x1, y1, x2, y2)
			}

			// 3) Adding vertical line
			$line_color = imagecolorallocate($image, 255,96,0); // black line color
			for($i=0;$i<20;$i++) {
				$line_start = rand()%200;
				$line_end = $line_start + rand(-20, 20);
			    imageline($image,$line_start,0,$line_end,40,$line_color); // adding 10 lines (x1, y1, x2, y2)
			}

			// 4) Adding dots
			$pixel_color = imagecolorallocate($image, 30,71,183); // dot color
			for($i=0;$i<1000;$i++) {
			    imagesetpixel($image,rand()%200,rand()%40,$pixel_color); // add 1000 dots
			}  

			// 5) Adding text
			$letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890123456789';
			$len = strlen($letters);
			$text_color = imagecolorallocate($image, 0,0,0);
			$text_shadow = imagecolorallocate($image, 128, 128, 128);
			$font = 'fonts/Arial.ttf';

			for ($i = 0; $i< 6;$i++) {
			    $letter = $letters[rand(0, $len-1)];
			    $angle = rand(-5, 5);
			    imagettftext($image, 20, $angle, 19+($i*30), 31, $text_shadow, $font, $letter); // add shadow
			    imagettftext($image, 20, $angle, 18+($i*30), 30, $text_color, $font, $letter); //add text
			    $word.=$letter;
			}
			$_SESSION['captcha'] = $word;
			$_SESSION['bio_captcha'] = 0;

        	ob_start();
			imagepng($image);
			$buffer = ob_get_clean();
			ob_end_clean();
			echo base64_encode($buffer);


		break;

		case 'check_code':
			if (isset($_SESSION['captcha'])) {
				if ($_SESSION['bio_captcha'] == 1) {
					//check if bio captcha success is not expired
					if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 20)) {
					    // last request was more than 30 minutes ago
					    session_unset();     // unset $_SESSION variable for the run-time 
					    session_destroy();   // destroy session data in storage
					    echo 2; // session expired
					} else {
						echo 1;
					}
				} else {
					$user_answer = $_POST['user_answer'];
					$real_answer = $_SESSION['captcha'];
					if ($user_answer == $real_answer) {
						echo 1;
						session_unset();     // unset $_SESSION variable for the run-time 
					    session_destroy();   // destroy session data in storage
					} else {
						echo 0;
						session_unset();     // unset $_SESSION variable for the run-time 
					    session_destroy();   // destroy session data in storage
					}
				}
			} else {
				echo 0;
			}

		break;

		case 'bio_success':
			$_SESSION['bio_captcha'] = 1;
			// after bio captcha success, this success will be effective only for a shirt period of time untill the session is destroyed
			$_SESSION['LAST_ACTIVITY'] = time();
		break;
	}
}
