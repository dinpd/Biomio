<?php

require_once 'NotORM.php';

$pdo = new PDO('mysql:dbname=alexa449_backbone;host=localhost', 'alexa449_Alt', 'fkmntdhbn13');

$db = new NotORM($pdo);

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

//Get Method to get the data from database

$app->get('/person(/:id)', function($id=null) use ($app, $db){
    
    if($id == null){
        $data = array();
        foreach($db->person() as $row){
            $data[] = array(
                            'id' =>   $p['id'],
                            'name' => $p['name'],
                            'age' =>  $p['age'],
                            'job' =>  $p['job']
                        );
        }
    } else {
        
        $data = null;
        
        if($p = $db->person()->where('id', $id)->fetch()){
            $data = array(
                           'id' =>   $p['id'],
                            'name' => $p['name'],
                            'age' =>  $p['age'],
                            'job' =>  $p['job'] 
                        );
        }
    }
    
    $app->response()->header('content-type','application/json');
    
    echo json_encode($data);
    
});

//Post method to insert data into database

$app->post('/person', function() use ($app, $db){
    
    $array = (array) json_decode($app->request()->getBody());

     $data = $db->person()->insert($array);
     
     $app->response()->header('Content-Type', 'application/json');
 
     echo json_encode($data['id']);
     
});



//Put method to update the data into database

$app->put('/person/:id', function ($id) use ($app, $db) {
    
    $person = $db->person()->where('id', $id);
    $data = null;
 
    if ($person->fetch()) {
        /*
         * We are reading JSON object received in HTTP request body and converting it to array
         */
        $post = (array) json_decode($app->request()->getBody());
 
        /*
         * Updating Person
         */
        $data = $person->update($post);
    }
 
    $app->response()->header('Content-Type', 'application/json');
    echo json_encode($data);
});

//Delete method to delete the data into database
$app->delete('/person/:id', function ($id) use ($app, $db) {
    /*
     * Fetching Person for deleting
     */
    $person = $db->person()->where('id', $id);
 
    $data = null;
    if ($person->fetch()) {
        /*
         * Deleting Person
         */
        $data = $person->delete();
    }
 
    $app->response()->header('Content-Type', 'application/json');
    echo json_encode($data);
});


$app->run();