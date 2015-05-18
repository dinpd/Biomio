<?php

if (isset($_GET['cmd'])) {
	$action = $_GET['cmd'];
	switch($action) {
//################################
//********************************
//########### GENERAL ############
//********************************
//################################

		case 'avaliable_devices':
			$arr = array();
			$arr[0] = array("id" => "1", "type" => "Finger scan");
			$arr[1] = array("id" => "2", "type" => "Voice scan");
			$arr[2] = array("id" => "3", "type" => "Iris scan");
			
			echo json_encode($arr);
		break;

//################################
//********************************
//############ USERS #############
//********************************
//################################
		case 'user_info':
			$arr = array();
			$arr["name"] = "Homer Simpson";
			$arr["motto"] = "Son, if you really want something in this life, you have to work for it. Now quiet! They're about to announce the lottery numbers.";
			$arr["address"] = array("line1" => "742 Evergreen Terrace", "line2" => "", "city" => "Springfield", "state" => "OR", "country" => "USA", "zip" => "98128");
			$arr["email"] = array("homer@simpsons.com", "x@gmail.com", "homer1@simpsons.com");

			echo json_encode($arr);
		break;
		case 'user_fingerprints':
			$arr = array();
				$arr[0] = array("status" => "green", "id" => 84333, "name" => "Right Thumb", "image" => "");
				$arr[1] = array("status" => "red", "id" => 49453, "name" => "Right Index", "image" => "");
				$arr[2] = array("status" => "red", "id" => 49943, "name" => "Left Thumb", "image" => "");
				$arr[3] = array("status" => "green", "id" => 94953, "name" => "Left Index", "image" => "");
				echo json_encode($arr);
		break;
		case 'user_resources':
			$arr = array();
			$arr[0] = array("id" => 1, "name" => "Bank of America", "policy" => "Online access, after hour branch ATM access");
			$arr[1] = array("id" => 2, "name" => "John Travolta's Summer House", "policy" => "Any time");
			$arr[2] = array("id" => 3, "name" => "BMW 328i, SN…", "policy" => "Any time");
			echo json_encode($arr);
		break;

		case 'user_locations':
			$arr = array();
			$arr[0] = array("id" => 1, "name" => "My House", "address" => "Baker Street 221a");
			$arr[1] = array("id" => 2, "name" => "Friend's House", "address" => "Baker Street 221b");
			echo json_encode($arr);
		break;

		case 'user_locations_devices':
			$id = $_GET['id'];
			if ($id == 1) {
				$arr = array();
				$arr[0] = array("lastPing" => 1, "id" => 123443, "type" => "Finger scan", "name" => "Samson Finger scan", "description" => "1.02", "serialNumber"=>"ljsdlfj2", "mac" => 'MAC1');
				$arr[1] = array("lastPing" => 1, "id" => 223444, "type" => "Voice scan", "name" => "Sonny Voice scan", "description" => "2.01", "serialNumber"=>"12lj4lj", "mac" => 'MAC1');
				$arr[2] = array("lastPing" => 1, "id" => 323444, "type" => "Iris scan", "name" => "Papple Iris scan", "description" => "1.00", "serialNumber"=>"ljaj23j", "mac" => 'MAC1');
				echo json_encode($arr);
			} else if ($id == 2) {
				$arr = array();
				$arr[0] = array("lastPing" => 1, "id" => 454333, "type" => "Finger scan", "name" => "Tosiba Finger scan", "description" => "3.02", "serialNumber"=>"jflj234", "mac" => 'MAC1');
				$arr[1] = array("lastPing" => 1, "id" => 499453, "type" => "Voice scan", "name" => "Isio Voice scan", "description" => "2.20", "serialNumber"=>"lsjlj234", "mac" => 'MAC1');
				echo json_encode($arr);
			}
		break;

		case 'user_devices':
			$arr = array();
			$arr[0] = array("lastPing" => 1, "id" => 123443, "type" => "Finger scan", "name" => "Samson Finger scan", "description" => "1.02", "serialNumber"=>"ljsdlfj2", "mac" => 'MAC1');
			$arr[1] = array("lastPing" => 1, "id" => 223444, "type" => "Voice scan", "name" => "Sonny Voice scan", "description" => "2.01", "serialNumber"=>"12lj4lj", "mac" => 'MAC1');
			$arr[2] = array("lastPing" => 1, "id" => 323444, "type" => "Iris scan", "name" => "Papple Iris scan", "description" => "1.00", "serialNumber"=>"ljaj23j", "mac" => 'MAC1');
			$arr[3] = array("lastPing" => 1, "id" => 454333, "type" => "Finger scan", "name" => "Tosiba Finger scan", "description" => "3.02", "serialNumber"=>"jflj234", "mac" => 'MAC1');
			$arr[4] = array("lastPing" => 1, "id" => 499453, "type" => "Voice scan", "name" => "Isio Voice scan", "description" => "2.20", "serialNumber"=>"lsjlj234", "mac" => 'MAC1');
			for ($i=0;$i<5; $i++){
				$rand = rand(0,1);
				if ($rand == 0) $arr[$i]['lastPing'] = 0;
				else $arr[$i]['lastPing'] = 1;
			}
			echo json_encode($arr);
		break;

		case 'user_locations_users':
			$id = $_GET['id'];
				if ($id == 1) {
					$arr = array();
					$arr[0] = array("id" => 1, "name" => "George Sanders", "email" => "jsanders@gmail.com", "policy" => "Enter Any Time");
					$arr[1] = array("id" => 2, "name" => "Jessica Moyer", "email" => "jsanders@gmailcom", "policy" => "Enter Any Time");
					$arr[2] = array("id" => 3, "name" => "My Facebook Friends", "email" => "", "policy" => "Approval via SMS");
					echo json_encode($arr);
				} else if ($id == 2) {
					$arr = array();
					$arr[0] = array("id" => 4, "name" => "Brad Pitt", "email" => "bpitt@gmail.com", "policy" => "10am-3pm");
					$arr[1] = array("id" => 5, "name" => "Leonardo Di Caprio", "email" => "ldcaprio@gmail.com", "policy" => "10am-10pm");
					echo json_encode($arr);
				}
		break;


//################################
//********************************
//########## PROVIDERS ###########
//********************************
//################################

		case 'provider_info':
			$arr = array(
				'id'=>102030,
				'name'=>'Wells Fargo',
				'email'=>'very@well.com'
			);
			echo json_encode($arr);
		break;

		case 'provider_list_of_resources':
		    $arr = array();
		    	$arr[0] = array('id'=>1, 'name'=>'Building 1');
				$arr[1] = array('id'=>2, 'name'=>'Building 2');
				$arr[2] = array('id'=>3, 'name'=>'Website');
			echo json_encode($arr);
		break;

		case 'provider_users':
	    	$resource_id = $_GET['resource_id'];
	    	switch ($resource_id) {
	    		case 1:
		    		$arr = array(
		    			array('id'=>1, 'username'=>'admin', 'email'=>'admin@biom.com', 'role'=>'ADMIN'),
						array('id'=>2, 'username'=>'misha', 'email'=>'misha@biom.com', 'role'=>'USER'),
						array('id'=>3, 'username'=>'dima', 'email'=>'dima@biom.com', 'role'=>'USER'),
						array('id'=>9, 'username'=>'vova', 'email'=>'vova@biom.com', 'role'=>'USER')
					);
	    		break;
	    		case 2:
	    			$arr = array(
		    			array('id'=>4, 'username'=>'sasha', 'email'=>'sasha@biom.com', 'role'=>'USER'),
						array('id'=>5, 'username'=>'vova', 'email'=>'vova@biom.com', 'role'=>'USER'),
						array('id'=>6, 'username'=>'grisha', 'email'=>'grisha@biom.com', 'role'=>'USER')
					);
	    		break;
	    		case 3:
		    		$arr = array(
		    			array('id'=>7, 'username'=>'masha', 'email'=>'masha@biom.com', 'role'=>'ADMIN'),
						array('id'=>8, 'username'=>'dasha', 'email'=>'dasha@biom.com', 'role'=>'USER')
					);
	    		break;
	    	}
			echo json_encode($arr);
		break;

		case 'provider_resources':
			$arr = array();
			$arr[0] = array('id' => 1, "name" => "Online access only", "policy" => "Member access only");
			$arr[1] = array('id' => 2, "name" => "Corporate building on 2nd and Broadway", "policy" => "Stuff with adress match");
			$arr[2] = array('id' => 3, "name" => "After-hour ATM @ Branches", "policy" => "standart");
			$arr[3] = array('id' => 4, "name" => "POS systems in Large Stores", "policy" => "standart");
			$arr[4] = array('id' => 5, "name" => "POS systems in mom-and-pops", "policy" => "standart");
			echo json_encode($arr);
		break;

		case 'provider_resources_devices':
			$id = $_GET['id'];
			if ($id == 1) {
				$arr = array();
				$arr[0] = array("lastPing" => 1, "id" => 123443, "type" => "Finger scan", "name" => "Samson Finger scan", "description" => "1.02", "serialNumber"=>"ljsdlfj2", "mac" => 'MAC1');
				$arr[1] = array("lastPing" => 1, "id" => 223444, "type" => "Voice scan", "name" => "Sonny Voice scan", "description" => "2.01", "serialNumber"=>"12lj4lj", "mac" => 'MAC1');
				$arr[2] = array("lastPing" => 1, "id" => 323444, "type" => "Iris scan", "name" => "Papple Iris scan", "description" => "1.00", "serialNumber"=>"ljaj23j", "mac" => 'MAC1');
				echo json_encode($arr);
			} else if ($id > 1) {
				$arr = array();
				$arr[0] = array("lastPing" => 1, "id" => 454333, "type" => "Finger scan", "name" => "Tosiba Finger scan", "description" => "3.02", "serialNumber"=>"jflj234", "mac" => 'MAC1');
				$arr[1] = array("lastPing" => 1, "id" => 499453, "type" => "Voice scan", "name" => "Isio Voice scan", "description" => "2.20", "serialNumber"=>"lsjlj234", "mac" => 'MAC1');
				echo json_encode($arr);
			}
		break;

		case 'provider_policies':
			$arr = array();
			$arr[0] = array('id' => 13455, "name" => "Primary: Member Access, 90%",
				'bio_auth' => 'Webcam based fingerprints, dedicated fingerprints scanner, voice',
				'min_auth' => 'Min 1',
				'max_auth' => 'Max 2',
				'match_certainty' => '90%',
				'geo_restr' => 'Worldwide',
				'time_restr' => ''
				);
			$arr[1] = array('id' => 23455, "name" => "Member Access, 95%",
				'bio_auth' => 'Webcam based fingerprints, dedicated fingerprints scanner, voice',
				'min_auth' => 'Min 2',
				'max_auth' => 'Max 8',
				'match_certainty' => '90%',
				'geo_restr' => 'Worldwide',
				'time_restr' => ''
				);
			$arr[2] = array('id' => 33455, "name" => "Stuff Access Only, 90% match",
				'bio_auth' => 'Webcam based fingerprints, dedicated fingerprints scanner, voice',
				'min_auth' => 'Min 50',
				'max_auth' => 'Max 60',
				'match_certainty' => '90%',
				'geo_restr' => 'Worldwide',
				'time_restr' => '');
			echo json_encode($arr);
		break;

		case 'provider_devices':
			$arr = array();
			$arr[0] = array("lastPing" => 1, "id" => 123443, "type" => "Finger scan", "name" => "Samson Finger scan", "description" => "1.02", "serialNumber"=>"ljsdlfj2", "mac" => 'MAC1');
			$arr[1] = array("lastPing" => 1, "id" => 223444, "type" => "Voice scan", "name" => "Sonny Voice scan", "description" => "2.01", "serialNumber"=>"12lj4lj", "mac" => 'MAC1');
			$arr[2] = array("lastPing" => 1, "id" => 323444, "type" => "Iris scan", "name" => "Papple Iris scan", "description" => "1.00", "serialNumber"=>"ljaj23j", "mac" => 'MAC1');
			$arr[3] = array("lastPing" => 1, "id" => 454333, "type" => "Finger scan", "name" => "Tosiba Finger scan", "description" => "3.02", "serialNumber"=>"jflj234", "mac" => 'MAC1');
			$arr[4] = array("lastPing" => 1, "id" => 499453, "type" => "Voice scan", "name" => "Isio Voice scan", "description" => "2.20", "serialNumber"=>"lsjlj234", "mac" => 'MAC1');
			echo json_encode($arr);
		break;

		default:
			echo 'some other data';
		break;
	}
}

if (isset($_POST['cmd'])) {
	$action = $_POST['cmd'];
	switch($action) {
		case 'user_personal_info':
			$arr = array();
			$arr["name"] = "Homer Simpson";
			$arr["email"] = array(0 => "homer@simpsons.com", 1 => "x@gmail.com", 2 => "homer1@simpsons.com");

			echo json_encode($arr);
		break;
		case 'user_iris':
			//Comming soon
		break;
		case 'user_voice':
			//Comming soon
		break;
		case 'provider_reporting':
			//Comming soon
		break;
		case 'partner_how':
			//Comming soon
		break;
		case 'partner_apply':
			//Comming soon
		break;
		break;
		case 'partner_support':
			//Comming soon
		break;
		default:
			echo 'some other data';
		break;
	}
}