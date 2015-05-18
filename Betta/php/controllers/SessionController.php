<?php
//Session controller class
session_start();

class SessionController {
	
	public static function start_session($id, $type, $first_name, $last_name) {
		$_SESSION['id'] = $id;
		$_SESSION['type'] = $type;
		$_SESSION['first_name'] = $first_name;
		$_SESSION['last_name'] = $last_name;
	}

	public static function get_user_session() {
		$result = array('id'=>$_SESSION['id'], 'type'=>$_SESSION['type'], 'first_name'=>$_SESSION['first_name'], 'last_name'=>$_SESSION['last_name']);
		return $result;
	}

	public static function destroy_session() {
		session_destroy();
		return 'You are successfully logged out';
	}

}