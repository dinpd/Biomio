<?php
namespace Controllers;

use ORM;
use Slim\Slim;
//use Services\Activity;

class Provider
{

  public static function signUp($req, $res, $args)
  {
//    $app = Slim::getInstance();
//    $body = $app->request()->getBody();
//
//    $data = json_decode($body, true);


      jsonResponse(200, array(
        "status" => 200,
        "args" => $args
      ));



//    $post = json_decode(file_get_contents("php://input"));
//
//    $hash = $post->hash;
//    $time = $post->time;
//    $public_key = $post->public_key;
//    $email = $post->email;
//
//    $private_key = ProviderController::get_private_key($public_key);
//    $public_key = ProviderController::get_providerId($public_key);
//
//    if (time() > $time + 5 * 60) {
//      echo json_encode(array('response'=>'#time'));
//    } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
//      echo json_encode(array('response'=>'#not gmail'));
//    } else {
//      $email = strtolower($email);
//      list($user, $domain) = explode('@', $email);
//      if (!is_google_mx($domain)) {
//        echo json_encode(array('response'=>'#not email'));
//      } else {
//        $result = UserController::create_user('', '', $email, 'USER', 1);
//
//        if ($result == '#email')
//          echo json_encode(array('response'=>'#email exists'));
//        else {
//          $result = ProviderController::add_user($providerId, $result);
//          echo json_encode(array('response'=>'#success', 'profileId'=>$result));
//        }
//      }
//    }

  }

}