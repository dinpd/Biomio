<?php
namespace Controllers;

use ORM;
use Slim\Slim;
//use Services\Activity;

class Provider
{

  public static function signUp($request, $response)
  {

    $answer = $request->getParsedBody();



    return $response->withStatus(200)
      ->withHeader('Content-Type', 'application/json')
      ->write(json_encode($answer));




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