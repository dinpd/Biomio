<?php
//Session controller class
session_start();

class SessionController {
	
	public static function start_session($id, $username, $api_id, $type) {
		$_SESSION['user'] = $username;
		$_SESSION['id'] = $id;
		$_SESSION['api_id'] = $api_id;
		$_SESSION['type'] = $type;
	}

	public static function session_api($api_id) {
		$_SESSION['api_id'] = $api_id;
	}

	public static function destroy_session() {
		session_destroy();
		return 'You are successfully logged out';
	}

	public static function get_user_session() {
		$result = array('id'=>$_SESSION['id'], 'username'=>$_SESSION['user'], 'api_id'=>$_SESSION['api_id'], 'type'=>$_SESSION['type']);
		return $result;
	}
}