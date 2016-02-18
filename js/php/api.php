<?php
session_start();
$session_id = $_SESSION['id'];
if (!isset($_SESSION['id'])) {
	echo json_encode(array('error'=>'session expired'));
} else {

require_once 'NotORM.php';

//$pdo = new PDO('mysql:dbname=biom_website;host=localhost', 'biom_admin', 'uFa-rEm-6a8-fuD');
require_once 'connect.php';

$db = new NotORM($pdo);

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

/********************************************************
********************** USERS **************************
*********************************************************/

	$app->get('/users(/:id)', function($id) use ($app, $db){

		// session check
		if ($id != $_SESSION['id']) {
			echo json_encode(array('error'=>'wrong user'));
			return;
		} else {

			$data = array();
			$profile = $db->Profiles()->where('id', $id)->fetch();
			$info = $db->UserInfo()->where('profileId', $id)->fetch();

			$data = array(
	                            'id'           =>  $profile['id'],
	                            'motto'        =>  $info['motto'],
	                            'address'      =>  json_decode($info['address']),
	                            'firstName'    =>  $info['firstName'],
	                            'lastName'     =>  $info['lastName'],
	                            'fingerprints' =>  json_decode($info['fingerprints']),
	                            'face'         =>  $info['face'],
	                            'voice'        =>  $info['voice'],
	                            'bday'         =>  $info['bday'],
	                            'occupation'   =>  $info['occupation'],
	                            'education'    =>  $info['education'],
	                            'socialBar'    =>  json_decode($info['socialBar']),
	                            'notifications'=>  json_decode($info['notifications']),

	                        );

		    $app->response()->header('content-type','application/json');
		    echo json_encode($data);
		}
	});

	$app->put('/users(/:id)', function ($id) use ($app, $db) {

		// session check
		if ($id != $_SESSION['id']) {
			echo json_encode(array('error'=>'wrong user'));
		} else {

		    $p = json_decode($app->request()->getBody());
		
		    $info = array(
		    			'motto'        =>  $p->motto,
		    			'address'	   =>  json_encode($p->address),
		    			'firstName'    =>  $p->firstName,
	                    'lastName'     =>  $p->lastName,
	                    'fingerprints' =>  json_encode($p->fingerprints),
	                    'face'         =>  $p->face,
	                    'voice'        =>  $p->voice,
	                    'bday'         =>  $p->bday,
	                    'occupation'   =>  $p->occupation,
	                    'education'    =>  $p->education,
	                    'socialBar'    =>  json_encode($p->socialBar),
	                    'notifications'=>  json_encode($p->notifications),
		    		);

		    $table2 = $db->UserInfo()->where('profileId', $id);
		 
		    if ($table2->fetch()) {
		        $data = $table2->update($info);
		    }
		 
		    $app->response()->header('Content-Type', 'application/json');
		    echo json_encode($data);
		}
	});

/********************************************************
********************* PROVIDER INFO *********************
*********************************************************/

	$app->get('/providers(/:id)', function($id) use ($app, $db){

		// session check
		if ($id != $_SESSION['id']) {
			echo json_encode(array('error'=>'wrong user'));
			return;
		} else {
			$data = array();
			$profile = $db->Profiles()->where('id', $id)->fetch();
			$info = $db->ProviderInfo()->where('profileId', $id)->fetch();

			$data = array(
	                            'id'          =>  $profile['id'],
	                            'title'       =>  $info['title'],
	                            'description' =>  $info['description'],
	                            'mission'     =>  $info['mission'],
	                            'address'     =>  json_decode($info['address']),
	                            'founded'     =>  $info['founded'],
	                            'socialBar'   =>  json_decode($info['socialBar']),
	                            'products'    =>  $info['products'],
	                            'size'        =>  $info['size'],
	                            'notifications'	  =>  json_decode($info['notifications']),
	                        );

		    $app->response()->header('content-type','application/json');
		    echo json_encode($data);
		}
	});

	$app->put('/providers(/:id)', function ($id) use ($app, $db) {

		// session check
		if ($id != $_SESSION['id']) {
			echo json_encode(array('error'=>'wrong user'));
		} else {
		    $p = json_decode($app->request()->getBody());

		    $info = array(
		    			'title'       =>  $p->title,
	                    'description' =>  $p->description,
	                    'mission'     =>  $p->mission,
	                    'address'     =>  json_encode($p->address),
	                    'founded'     =>  $p->founded,
	                    'socialBar'   =>  json_encode($p->socialBar),
	                    'products'    =>  $p->products,
	                    'size'        =>  $p->size,
	                    'notifications'    =>  json_encode($p->notifications),
		    		);

		    $table2 = $db->ProviderInfo()->where('profileId', $id);
		 
		    if ($table2->fetch()) {
		        $data = $table2->update($info);
		    }
		 
		    $app->response()->header('Content-Type', 'application/json');
		    echo json_encode($data);
		}
	});

/********************************************************
********************** POLICIES *************************
*********************************************************/

	$app->get('/users(/:id)/policies', function($id) use ($app, $db){

		// session check
		if ($id != $_SESSION['id']) {
			echo json_encode(array('error'=>'wrong user'));
			return;
		} else {

			$data = array();

			foreach($p = $db->Policies()->where('owner', $id) as $p){
				$data[] = array(
		                            'id'              =>  $p['id'],
		                            'owner'           =>  $p['owner'],
		                            'name'            =>  $p['name'],
		                            'bioAuth'         =>  $p['bioAuth'],
		                            'minAuth'         =>  $p['minAuth'],
		                            'maxAuth'         =>  $p['maxAuth'],
		                            'matchCertainty'  =>  $p['matchCertainty'],
		                            'geoRestriction'  =>  $p['geoRestriction'],
		                            'timeRestriction' =>  $p['timeRestriction'],
		                        );
			}
		    
		    $app->response()->header('content-type','application/json');
		    echo json_encode($data);
		}
	});
// !!!!!!!!
	$app->post('/policies', function() use ($app, $db){
	    
	    $array = (array) json_decode($app->request()->getBody());

	    $data = $db->Policies()->insert($array);
	     
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode(array('id'=>$data['id']));
	});

	$app->put('/policies(/:id)', function ($id) use ($app, $db) {
	    
	    $table = $db->Policies()->where('id', $id);
	    $data = null;
	 
	    if ($table->fetch()) {
	        $post = (array) json_decode($app->request()->getBody());
	        $data = $table->update($post);
	    }
	 
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode($data);

	});
// !!!!!!!!!
	$app->delete('/policies/:id', function ($id) use ($app, $db) {
	    
	    $table = $db->Policies()->where('id', $id);
	 
	    $data = null;
	    if ($table->fetch()) {
	        $data = $table->delete();
	    }
	 
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode($data);
	});


/********************************************************
********************** DEVICES **************************
*********************************************************/

	$app->get('/users(/:id)/devices', function($id) use ($app, $db){

		// session check
		if ($id != $_SESSION['id']) {
			echo json_encode(array('error'=>'wrong user'));
			return;
		} else {

			if (isset($_GET['secureLocations'])) $p = $db->Devices()->where('owner', $id)->where('secureLocation', 0);
			else $p = $db->Devices()->where('owner', $id);
			
			$data = array();

			foreach($p as $p){
				$location = $db->SecureLocations()->where('id', $p['secureLocation'])->fetch();
				$locationName = $location['name'];

				$data[] = array(
		                            'id'             =>  $p['id'],
		                            'owner'          =>  $p['owner'],
		                            'name'           =>  $p['name'],
		                            'type'           =>  $p['type'],
		                            'serialNumber'   =>  $p['serialNumber'],
		                            'mac'            =>  $p['mac'],
		                            'lastPing'       =>  $p['lastPing'],
		                            'secureLocation' =>  $p['secureLocation'],
		                            'locationName'   =>  $locationName,
		                        );
			}
		    
		    $app->response()->header('content-type','application/json');
		    echo json_encode($data);
		}
	});

	$app->post('/devices', function() use ($app, $db){
//!!!!!!!!!!!	    
	    $array = (array) json_decode($app->request()->getBody());

	    $data = $db->Devices()->insert($array);
	     
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode(array('id'=>$data['id']));

	});
//!!!!!!!!!!!
	$app->put('/devices(/:id)', function ($id) use ($app, $db) {
	    
	    $p = json_decode($app->request()->getBody());
	
	    $model = array(
                        'owner'          =>  $p->owner,
                        'name'           =>  $p->name,
                        'type'           =>  $p->type,
                        'serialNumber'   =>  $p->serialNumber,
                        'mac'            =>  $p->mac,
                        'lastPing'       =>  $p->lastPing,
                        'secureLocation' =>  $p->secureLocation,
                    );

	    $table = $db->Devices()->where('id', $id);
	    $data = null;
	 
	    if ($table->fetch()) {
	        $data = $table->update($model);
	    }
	 
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode($data);
	});

	$app->delete('/devices/:id', function ($id) use ($app, $db) {
//!!!!!!!!!!!!	    
	    $table = $db->Devices()->where('id', $id);
	 
	    $data = null;
	    if ($table->fetch()) {
	        $data = $table->delete();
	    }
	 
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode($data);
	});


/********************************************************
************** SECURE LOCAIONS DEVICES ******************
*********************************************************/
//!!!!!!!!!!!!!!!
	$app->get('/secureLocations(/:id)/devices', function($id) use ($app, $db){

		$data = array();

		foreach($p = $db->Devices()->where('secureLocation', $id) as $p){
			$data[] = array(
	                            'id'           =>  $p['id'],
	                            'owner'        =>  $p['owner'],
	                            'name'         =>  $p['name'],
	                            'type'         =>  $p['type'],
	                            'serialNumber' =>  $p['serialNumber'],
	                            'mac'          =>  $p['mac'],
	                            'lastPing'     =>  $p['lastPing'],
	                        );
		}
	    
	    $app->response()->header('content-type','application/json');
	    echo json_encode($data);

	});
//!!!!!!!!!!!!!!!
	$app->post('/secureLocations(/:id)/devices(/:deviceId)', function($id, $deviceId) use ($app, $db){
	    
	    $table = $db->Devices()->where('id', $deviceId);
	    $data = null;
	 
	    if ($table->fetch()) {
	        $post = (array) json_decode($app->request()->getBody());
	        $data = $table->update($post);
	    }

	    // return this model
	    foreach($p = $db->Devices()->where('id', $deviceId) as $p){
			$data = array(
	                            'id'           =>  $p['id'],
	                            'owner'        =>  $p['owner'],
	                            'name'         =>  $p['name'],
	                            'type'         =>  $p['type'],
	                            'serialNumber' =>  $p['serialNumber'],
	                            'mac'          =>  $p['mac'],
	                            'lastPing'     =>  $p['lastPing'],
	                        );
		}
	 
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode($data);

	});
//!!!!!!!!!!!!!!!
	$app->delete('/secureLocations(/:id)/devices(/:deviceId)', function ($id, $deviceId) use ($app, $db) {
	    
	    $model = array(
                        'secureLocation'   =>  0,
                    );

	    $table = $db->Devices()->where('id', $deviceId);
	    $data = null;
	 
	    if ($table->fetch()) {
	        $data = $table->update($model);
	    }
	 
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode($data);

	});

/********************************************************
******************** SECURE LOCATIONS *******************
*********************************************************/

	$app->get('/users(/:id)/secureLocations', function($id) use ($app, $db){

		// session check
		if ($id != $_SESSION['id']) {
			echo json_encode(array('error'=>'wrong user'));
			return;
		} else {

			$data = array();

			foreach($p = $db->SecureLocations()->where('owner', $id) as $p){
				//adding policy name to the model
				$policy = $db->Policies()->where('id', $p['policy'])->fetch();
				$policyName = $policy['name'];

				//creating model
				$data[] = array(
		                            'id'          =>  $p['id'],
		                            'name'        =>  $p['name'],
		                            'address'     =>  json_decode($p['address']),
		                            'owner'       =>  $p['owner'],
		                            'description' =>  $p['description'],
		                            'deviceIds'   =>  $p['deviceIds'],
		                            'policy'      =>  $p['policy'],
		                            'policyName'  =>  $policyName,
		                            'map'         =>  $p['map'],
		                        );
			}
		    
		    $app->response()->header('content-type','application/json');
		    echo json_encode($data);
		}
	});

	$app->get('/secureLocations(/:id)', function($id) use ($app, $db){

//!!!!!!!!!!!!!		
		$data = array();

		foreach($p = $db->SecureLocations()->where('id', $id) as $p){
			$data = array(
	                            'id'          =>  $p['id'],
	                            'name'        =>  $p['name'],
	                            'address'     =>  json_decode($p['address']),
	                            'owner'       =>  $p['owner'],
	                            'description' =>  $p['description'],
	                            'deviceIds'   =>  $p['deviceIds'],
	                            'policy'      =>  $p['policy'],
	                            'map'      	  =>  $p['map'],
	                        );
		}
	    
	    $app->response()->header('content-type','application/json');
	    echo json_encode($data);

	});

	$app->post('/secureLocations', function() use ($app, $db){
//!!!!!!!!!!!
		$p = json_decode($app->request()->getBody());
	
	    $array = array(
                        'name'        =>  $p->name,
                        'owner'       =>  $p->owner,
                        'description' =>  $p->description,
                        'deviceIds'   =>  $p->deviceIds,
                        'policy'      =>  $p->policy,
                        'address'	  =>  json_encode($p->address),
                    );

	    $data = $db->SecureLocations()->insert($array);
	     
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode(array('id'=>$data['id']));
	});

	$app->put('/secureLocations(/:id)', function ($id) use ($app, $db) {
//!!!!!!!!!!!!	    
	    $p = json_decode($app->request()->getBody());
	
	    $location = array(
                        'name'         =>  $p->name,
                        'description'  =>  $p->description,
                        'address'	   =>  json_encode($p->address),
                        'deviceIds'	   =>  $p->deviceIds,
                        'map'		   =>  $p->map,
                        'owner'		   =>  $p->owner,
                        'policy'	   =>  $p->policy,
                    );

	    $table = $db->SecureLocations()->where('id', $id);
	    $data = null;
	 
	    if ($table->fetch()) {
	        $data = $table->update($location);
	    }
	    
	    echo json_encode($data);

	});

	$app->delete('/secureLocations/:id', function ($id) use ($app, $db) {
//!!!!!!!!!!!!!!	    
	    $table = $db->SecureLocations()->where('id', $id);
	 
	    $data = null;
	    if ($table->fetch()) {
	        $data = $table->delete();
	    }
	 
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode($data);
	});


/********************************************************
************************ WEBSITES ***********************
*********************************************************/

	$app->get('/users(/:id)/websites', function($id) use ($app, $db){
		// session check
		if ($id != $_SESSION['id']) {
			echo json_encode(array('error'=>'wrong user'));
			return;
		} else {

			$data = array();

			foreach($p = $db->Websites()->where('owner', $id) as $p){
				$data[] = array(
		                            'id'          =>  $p['id'],
		                            'owner'       =>  $p['owner'],
		                            'title'       =>  $p['title'],
		                            'domains'     =>  json_decode($p['domains']),
		                            'categories'  =>  json_decode($p['categories']),
		                            'description' =>  $p['description'],
		                        );
			}
		    
		    $app->response()->header('content-type','application/json');
		    echo json_encode($data);
		}
	});

	$app->get('/websites(/:id)', function($id) use ($app, $db){
//!!!!!!!!!!!!!
		$data = array();

		foreach($p = $db->Websites()->where('id', $id) as $p){
			$data = array(
	                            'id'          =>  $p['id'],
	                            'owner'       =>  $p['owner'],
	                            'title'       =>  $p['title'],
	                            'domains'     =>  json_decode($p['domains']),
	                            'categories'  =>  json_decode($p['categories']),
	                            'description' =>  $p['description'],
	                        );
		}
	    
	    $app->response()->header('content-type','application/json');
	    echo json_encode($data);

	});

	$app->post('/websites', function() use ($app, $db){
//!!!!!!!!!!!!!!!
		$p = json_decode($app->request()->getBody());
	
	    $array = array(
                        'owner'       =>  $p->owner,
                        'title'       =>  $p->title,
                        'domains'     =>  json_encode($p->domains),
                        'categories'  =>  json_encode($p->categories),
                        'description' =>  $p->description,
                    );

	    $data = $db->Websites()->insert($array);
	     
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode(array('id'=>$data['id']));
	});

	$app->put('/websites(/:id)', function ($id) use ($app, $db) {
//!!!!!!!!!!!!!!!!	    
	    $p = json_decode($app->request()->getBody());
	
	    $location = array(
                        'id'          =>  $p->id,
                        'owner'       =>  $p->owner,
                        'title'       =>  $p->title,
                        'domains'     =>  json_encode($p->domains),
                        'categories'  =>  json_encode($p->categories),
                        'description' =>  $p->description,
                    );

	    $table = $db->Websites()->where('id', $id);
	    $data = null;
	 
	    if ($table->fetch()) {
	        $data = $table->update($location);
	    }
	    
	    echo json_encode($data);

	});

	$app->delete('/secureLocations/:id', function ($id) use ($app, $db) {
//!!!!!!!!!!!!	    
	    $table = $db->Websites()->where('id', $id);
	 
	    $data = null;
	    if ($table->fetch()) {
	        $data = $table->delete();
	    }
	 
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode($data);
	});


/********************************************************
********************* LOCATION USERS ********************
*********************************************************/

	$app->get('/secureLocations(/:id)/users', function($id) use ($app, $db){
//!!!!!!!!!!!!!	
		if (isset($_GET['status'])) {
			$status = $_GET['status'];

			if (isset($_GET['type'])) {
				$type = $_GET['type'];
				$data = array();

				foreach($p = $db->ResourceUsers()->where('locationId', $id)->where('status', $status)->where('type', $type) as $p){
					//fetch user data
					$user = $db->Profiles()->where('id', $p['userId'])->fetch();
					
					$userName = $user['name'];
					$userEmail = json_decode($user['emails']);
						$userEmail = $userEmail[0];

					//fetch owner data
					$owner = $db->Profiles()->where('id', $p['ownerId'])->fetch();
					
					$ownerName = $owner['name'];
					$ownerEmail = json_decode($owner['emails']);
						$ownerEmail = $ownerEmail[0];

					$data[] = array(
			                            'id'               =>  $p['id'],
			                            'locationId'       =>  $p['locationId'],
			                            'ownerId'          =>  $p['ownerId'],
			                            'userId'           =>  $p['userId'],
			                            'type'             =>  $p['type'],
			                            'status'           =>  $p['status'],
			                            'timeRestriction'  =>  $p['timeRestriction'],
			                            'userName'         =>  $userName,
			                            'userEmail'        =>  $userEmail,
			                            'ownerName'        =>  $ownerName,
			                            'ownerEmail'       =>  $ownerEmail,
			                        );
				}

			} else {

				$data = array();

				foreach($p = $db->ResourceUsers()->where('locationId', $id)->where('status', $status) as $p){
					//fetch user data
					$user = $db->Profiles()->where('id', $p['userId'])->fetch();
					
					$userName = $user['name'];
					$userEmail = json_decode($user['emails']);
						$userEmail = $userEmail[0];

					//fetch owner data
					$owner = $db->Profiles()->where('id', $p['ownerId'])->fetch();
					
					$ownerName = $owner['name'];
					$ownerEmail = json_decode($owner['emails']);
						$ownerEmail = $ownerEmail[0];

					$data[] = array(
			                            'id'               =>  $p['id'],
			                            'locationId'       =>  $p['locationId'],
			                            'ownerId'          =>  $p['ownerId'],
			                            'userId'           =>  $p['userId'],
			                            'type'             =>  $p['type'],
			                            'status'           =>  $p['status'],
			                            'timeRestriction'  =>  $p['timeRestriction'],
			                            'userName'         =>  $userName,
			                            'userEmail'        =>  $userEmail,
			                            'ownerName'        =>  $ownerName,
			                            'ownerEmail'       =>  $ownerEmail,
			                        );
				}

			}

		} else {

			$data = array();

			foreach($p = $db->ResourceUsers()->where('locationId', $id) as $p){
				//fetch user data
				$user = $db->Profiles()->where('id', $p['userId'])->fetch();
				
				$userName = $user['name'];
				$userEmail = json_decode($user['emails']);
					$userEmail = $userEmail[0];

				//fetch owner data
				$owner = $db->Profiles()->where('id', $p['ownerId'])->fetch();
				
				$ownerName = $owner['name'];
				$ownerEmail = json_decode($owner['emails']);
					$ownerEmail = $ownerEmail[0];

				$data[] = array(
		                            'id'               =>  $p['id'],
		                            'locationId'       =>  $p['locationId'],
		                            'ownerId'          =>  $p['ownerId'],
		                            'userId'           =>  $p['userId'],
		                            'type'             =>  $p['type'],
		                            'status'           =>  $p['status'],
		                            'timeRestriction'  =>  $p['timeRestriction'],
		                            'userName'         =>  $userName,
		                            'userEmail'        =>  $userEmail,
		                            'ownerName'        =>  $ownerName,
		                            'ownerEmail'       =>  $ownerEmail,
		                        );
			}
		}
	    
	    $app->response()->header('content-type','application/json');
	    echo json_encode($data);

	});

	$app->post('/secureLocations(/:id)/users', function($id) use ($app, $db){
//!!!!!!!!!!!!!	    
	    $p = json_decode($app->request()->getBody());
	    $model = array(
                        'locationId'       =>  $p->locationId,
                        'ownerId'          =>  $p->ownerId,
                        'type'             =>  $p->type,
                        'status'           =>  $p->status,
                        'timeRestriction'  =>  $p->timeRestriction,
                    );
		$userEmail = $p->userEmail;
		$locationId = $p->locationId;

		$p = $db->Profiles()->where('emails LIKE?', '%\"'. $userEmail . '\"%');
		if (sizeof($p) == 0)  { echo "User not found"; }
		else if (sizeof($p) > 1) { echo "More than one user found"; }
		else if (sizeof($p) == 1) {

			foreach($p = $db->Profiles()->where('emails LIKE?', '%\"'. $userEmail . '\"%') as $p){
				
				$userId = $p['id'];
				$userName = $p['name'];
				$model['userId'] =  $userId;
				//Check if the user is already added
				$check = $db->ResourceUsers()->where('locationId', $locationId)->where('userId', $userId);
				if (sizeof($check) > 0) { echo "This user is already connected to this location"; }
				else {
					$data = $db->ResourceUsers()->insert($model); 
				    $app->response()->header('Content-Type', 'application/json');
				    echo json_encode(array('id' => $data['id'], 'userName' => $userName, 'userId' => $userId));
				}
			}
		}
	});

	$app->put('/secureLocations(/:id)/users(/:userId)', function ($id, $userId) use ($app, $db) {
//!!!!!!!!!!!!!!!!!!!	    
	    $p = json_decode($app->request()->getBody());
	    $model = array(
                        'id'               =>  $p->id,
                        'locationId'       =>  $p->locationId,
                        'ownerId'          =>  $p->ownerId,
                        'userId'           =>  $p->userId,
                        'type'             =>  $p->type,
                        'status'           =>  $p->status,
                        'timeRestriction'  =>  $p->timeRestriction,
                    );
	    $id = $p->id;
	    $table = $db->ResourceUsers()->where('id', $id);
	    $data = null;
	 
	    if ($table->fetch()) {
	        $data = $table->update($model);
	    }
	 
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode($data);

	});

	$app->delete('/secureLocations/:id', function ($id) use ($app, $db) {
//!!!!!!!!!!!!!!!!	    
	    $table = $db->ResourceUsers()->where('id', $id);
	 
	    $data = null;
	    if ($table->fetch()) {
	        $data = $table->delete();
	    }
	 
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode($data);
	});


/********************************************************
********************* USER RESOURCES ********************
*********************************************************/

	$app->get('/users(/:id)/resources', function($id) use ($app, $db){
		
		// session check
		if ($id != $_SESSION['id']) {
			echo json_encode(array('error'=>'wrong user'));
			return;
		} else {

			$data = array();

			foreach($p = $db->ResourceUsers()->where('userId', $id) as $p){
				//fetch location data
				$location = $db->SecureLocations()->where('id', $p['locationId'])->fetch();
				
				$locationName = $location['name'];
				$locationAddress = $location['address'];

				//fetch owner profile data
				$owner = $db->Profiles()->where('id', $p['ownerId'])->fetch();
				
				$ownerName = $owner['name'];
				$ownerEmail = json_decode($owner['emails']);
									$ownerEmail = $ownerEmail[0];

				$data[] = array(
		                            'id'               =>  $p['id'],
		                            'locationId'       =>  $p['locationId'],
		                            'ownerId'          =>  $p['ownerId'],
		                            'userId'           =>  $p['userId'],
		                            'type'             =>  $p['type'],
		                            'status'           =>  $p['status'],
		                            'timeRestriction'  =>  $p['timeRestriction'],
		                            'locationName'     =>  $locationName,
		                            'locationAddress'  =>  json_decode($locationAddress),
		                            'ownerName'        =>  $ownerName,
		                            'ownerEmail'       =>  $ownerEmail,
		                        );
			}

		    $app->response()->header('content-type','application/json');
		    echo json_encode($data);
		}
	});

	$app->post('/users(/:id)/resources', function($id) use ($app, $db){
	    
	    // session check
		if ($id != $_SESSION['id']) {
			echo json_encode(array('error'=>'wrong user'));
			return;
		} else {

		    $p = json_decode($app->request()->getBody());
		    $model = array(
	                        'userId'   			 =>  $p->userId,
	                        'type'             	 =>  $p->type,
	                        'status'          	 =>  $p->status,
	                        'timeRestriction' 	 =>  $p->timeRestriction,
	                    );
			$ownerEmail = $p->ownerEmail;
			$userId = $p->userId;
			$locationName =  $p->locationName;

			$p = $db->Profiles()->where('emails LIKE?', '%\"'. $ownerEmail . '\"%');

			if (sizeof($p) == 0)  { echo "Owner not found"; }
			else if (sizeof($p) > 1) { echo "More than one owner found"; }
			else if (sizeof($p) == 1) {

				foreach($p = $db->Profiles()->where('emails LIKE?', '%\"'. $ownerEmail . '\"%') as $p){

					$l = $db->SecureLocations()->where('name LIKE?', '%'. $locationName . '%')->where('owner', $p['id']);

					if (sizeof($l) == 0)  { echo "Resource not found"; }
					else if (sizeof($l) > 1) { echo "More than one resource found"; }
					else if (sizeof($l) == 1) {

						foreach($l = $db->SecureLocations()->where('name LIKE?', '%'. $locationName . '%')->where('owner', $p['id']) as $l){

							$ownerId = $p['id'];
							$ownerName = $p['name'];
							$locationId = $l['id'];
							$locationName = $l['name'];
							$locationAddress = $l['address'];
							$model['userId'] =  $userId;
							$model['locationId'] = $locationId;
							//Check if the user is already added
							$check = $db->ResourceUsers()->where('locationId', $locationId)->where('userId', $userId);
							if (sizeof($check) > 0) { echo "You are already connected to this resource"; }
							else {
								$data = $db->ResourceUsers()->insert($model); 
							    $app->response()->header('Content-Type', 'application/json');
							    echo json_encode(array('id' => $data['id'], 'ownerName' => $ownerName, 'ownerId' => $ownerId, 
							    						'locationId' => $locationId, 'locationName' => $locationName, 'locationAddress' => $locationAddress));
							}
						}
					}
				}
			}
		}
	});

	$app->put('/users(/:id)/resources(/:resourceId)', function ($id, $resourceId) use ($app, $db) {
//!!!!!!!!!	    
	    $p = json_decode($app->request()->getBody());
	    $model = array(
                        'id'               =>  $p->id,
                        'locationId'       =>  $p->locationId,
                        'ownerId'          =>  $p->ownerId,
                        'userId'           =>  $p->userId,
                        'type'             =>  $p->type,
                        'status'           =>  $p->status,
                        'timeRestriction'  =>  $p->timeRestriction,
                    );

	    $id = $p->id;
	    $table = $db->ResourceUsers()->where('id', $id);
	    $data = null;
	 
	    if ($table->fetch()) {
	        $data = $table->update($model);
	    }
	 
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode($data);

	});

	$app->delete('/secureLocations/:id', function ($id) use ($app, $db) {
//!!!!!!!!!	    
	    $table = $db->ResourceUsers()->where('id', $id);
	 
	    $data = null;
	    if ($table->fetch()) {
	        $data = $table->delete();
	    }
	 
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode($data);
	});


/********************************************************
************************ REPORTS ************************
*********************************************************/

	$app->get('/users(/:id)/reports', function($id) use ($app, $db){

		// session check
		if ($id != $_SESSION['id']) {
			echo json_encode(array('error'=>'wrong user'));
			return;
		} else {

			$data = array();

			foreach($p = $db->Reports()->where('profileId', $id)->order("dateCreated DESC") as $p){
				$data[] = array(
		                            'id'              =>  $p['id'],
		                            'profileId'       =>  $p['profileId'],
		                            'type'            =>  $p['type'],
		                            'description'     =>  $p['description'],
		                            'dateCreated'     =>  $p['dateCreated'],
		                        );
			}
		    
		    $app->response()->header('content-type','application/json');
		    echo json_encode($data);
		}
	});

	$app->post('/reports', function() use ($app, $db){
//!!!!!!!!!!	    
	    $array = (array) json_decode($app->request()->getBody());

	    $data = $db->Reports()->insert($array);
	     
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode(array('id'=>$data['id']));
	});

	$app->delete('/reports/:id', function ($id) use ($app, $db) {
//!!!!!!!!!!!	    
	    $table = $db->Reports()->where('id', $id);
	 
	    $data = null;
	    if ($table->fetch()) {
	        $data = $table->delete();
	    }
	 
	    $app->response()->header('Content-Type', 'application/json');
	    echo json_encode($data);
	});

$app->run();
}
