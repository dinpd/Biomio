<?php
namespace App\Controllers;

use App\Models\Helper;
use Psr\Log\LoggerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \App\Models\User as User;

use ORM;

final class InviteController
{

    private $renderer;
    private $logger;
    private $settings;

    public function __construct(\Slim\Views\PhpRenderer $renderer, LoggerInterface $logger, $settings)
    {
        $this->renderer = $renderer;
        $this->logger = $logger;
        $this->settings = $settings;
    }

    public function googleapp_invitation(Request $request, Response $response, $args)
    {
        $name = $request->getParam('name');
        $email = $request->getParam('email');


        $googleAppInvite = ORM::for_table('GoogleAppInvites')->create();
        $googleAppInvite->name = $name;
        $googleAppInvite->email = $email;
        $googleAppInvite->save();


        //TODO: discuss usage and remove strings hardcode
        $from = "splash@biom.io";
        $from_name = "BIOMIO";
        $subject = "BIOMIO: New Google App Application";

//        $body = file_get_contents("../tpl/emails/NewGoogleAppApplication.html");
//        $body = str_replace('%name%', $name, $body);
//        $body = str_replace('%email%', $email, $body);

        //TODO: require test, because it renders direct to responce body
        $this->renderer->render($response, '/emails/NewGoogleAppApplication.html',
            ['name' => $name, 'email' => $email]);

        $body = $response->getBody()->getContents();

        $to = "alexander.lomov1@gmail.com";
        Helper::monkey_mail($to, $subject, $body, $from, $from_name);

        $to = "ditkis@gmail.com";
        Helper::monkey_mail($to, $subject, $body, $from, $from_name);


        //return $response->write('#success');
        return $response;

    }

    public function send_invitation(Request $request, Response $response, $args)
    {

        $name = $request->getAttribute('name');
        $email = $request->getAttribute('email');

        $googleAppInvite = ORM::for_table('GoogleAppInvites')->where(['name' => $name, 'email' => $email])->order_by_desc('id')->find_one();

        if (!$googleAppInvite)
            return $response->write('provided data doesn\'t match with any of the recieved applications');

        $invitation = $googleAppInvite->invitation;
        if ($invitation === 1)
            return $response->write("invitation has already been sent to this user");


        $from = "splash@biom.io";
        $from_name = "BIOMIO";
        $subject = "BIOMIO: Google App Invitation";


        //        $body = file_get_contents("../tpl/emails/NewGoogleAppInvitation.html");
        //        $body = str_replace('%name%', $name, $body);

        //TODO: require test, because it renders direct to responce body
        $this->renderer->render($response, '/emails/NewGoogleAppInvitation.html',
            ['name' => $name]);

        $body =  $response->getBody()->getContents();
        Helper::monkey_mail($email, $subject, $body, $from, $from_name);


        $googleAppInvite->invitation = 1;
        $googleAppInvite->save();

        return $response->write("invitation has been sent");


    }

}