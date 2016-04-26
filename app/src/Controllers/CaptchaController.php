<?php

namespace App\Controllers;

use Psr\Log\LoggerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \App\Models\User as User;
use \App\Models\Helper as Helper;

final class CaptchaController
{
    private $view;
    private $logger;
    private $session;

    public function __construct($view, LoggerInterface $logger, \RKA\Session $session)
    {
        $this->view = $view;
        $this->logger = $logger;
        $this->session = $session;
    }

    public function dispatch(Request $request, Response $response, $args)
    {
        $this->logger->info("Home page action dispatched");

        $users = $this->model->show();

        return $this->view->render($response, 'users.twig', ["data" => $users]);
    }


    public function create_image(Request $request, Response $response, $args)
    {
        //TODO: this is totaly wrong, require to put it separate

        // 1) Creating an image
        $image = imagecreatetruecolor(200, 40); // creating an image

        $background_color = imagecolorallocate($image, 255, 255, 255); // white background
        imagefilledrectangle($image, 0, 0, 200, 40, $background_color); // rectangular shape

        // 2) Adding horizontal line
        $line_color = imagecolorallocate($image, 255, 96, 0); // black line color
        for ($i = 0; $i < 10; $i++) {
            $line_start = rand() % 40;
            $line_end = $line_start + rand(-20, 20);
            imageline($image, 0, $line_start, 200, $line_end, $line_color); // adding 10 lines (x1, y1, x2, y2)
        }

        // 3) Adding vertical line
        $line_color = imagecolorallocate($image, 255, 96, 0); // black line color
        for ($i = 0; $i < 20; $i++) {
            $line_start = rand() % 200;
            $line_end = $line_start + rand(-20, 20);
            imageline($image, $line_start, 0, $line_end, 40, $line_color); // adding 10 lines (x1, y1, x2, y2)
        }

        // 4) Adding dots
        $pixel_color = imagecolorallocate($image, 30, 71, 183); // dot color
        for ($i = 0; $i < 1000; $i++) {
            imagesetpixel($image, rand() % 200, rand() % 40, $pixel_color); // add 1000 dots
        }

        // 5) Adding text
        $letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890123456789';
        $len = strlen($letters);
        $text_color = imagecolorallocate($image, 0, 0, 0);
        $text_shadow = imagecolorallocate($image, 128, 128, 128);
        $font = 'fonts/Arial.ttf';

        $word = '';
        for ($i = 0; $i < 6; $i++) {
            $letter = $letters[rand(0, $len - 1)];
            $angle = rand(-5, 5);
            imagettftext($image, 20, $angle, 19 + ($i * 30), 31, $text_shadow, $font, $letter); // add shadow
            imagettftext($image, 20, $angle, 18 + ($i * 30), 30, $text_color, $font, $letter); //add text
            $word .= $letter;
        }
        $this->session->captcha = $word;
        $this->session->bio_captcha = 0;

        ob_start();
        imagepng($image);
        $buffer = ob_get_clean();
        ob_end_clean();

        return $response->write(base64_encode($buffer));

    }

    public function check_code(Request $request, Response $response, $args)
    {
        if ($this->session->captcha === null)
            return $response->write('#session');

        $user_answer = $request->getParam('user_answer');

        $real_answer = $this->session->captcha;

        if ($user_answer == $real_answer) {

            /* // following method "contact" is not implemented in legacy version
            $name = $request->getParam('name');
            $email = $request->getParam('email');
            $message = $request->getParam('message');
             contact($name, $email, $message); // <-- method contact is not implemented
            */

            $this->session->destroy();
            return $response->write('#success');

        } else {
            $this->session->destroy();
            return $response->write('#captcha');
        }
    }

}