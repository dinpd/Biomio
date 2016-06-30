<?php
namespace App\Controllers;

/**
 * Class SessionController
 *
 * TODO: Refactor for session is required, for example up to session middleware or service
 *
 * @package App\Controllers
 */
class SessionController {

    public static function start_session($id, $type, $first_name, $last_name) {
        $_SESSION['id'] = $id;
        $_SESSION['type'] = $type;
        $_SESSION['first_name'] = $first_name;
        $_SESSION['last_name'] = $last_name;
    }

    public static function get_user_session() {
        if (!isset($_SESSION['id']))
            return array("id"=>null,"type"=>null,"first_name"=>null,"last_name"=>null);
        else {
            $result = array('id'=>$_SESSION['id'], 'type'=>$_SESSION['type'], 'first_name'=>$_SESSION['first_name'], 'last_name'=>$_SESSION['last_name']);
            return $result;
        }
    }

    public static function destroy_session(Request $request, Response $response, $args) {
        session_unset();
        session_destroy();
        return $response->write('You are successfully logged out');
    }

}