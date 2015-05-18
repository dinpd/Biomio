<?php
require_once 'NotORM.php';

$pdo = new PDO('mysql:dbname=biom_website;host=localhost', 'biom_admin', 'uFa-rEm-6a8-fuD');

$db = new NotORM($pdo);

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();


$app->get('/verify_application(/:application_id)/code(/:code)', function($application_id, $code) use ($app, $db) {

	
});

$app->run();

$application_id = 2;
$code = '0EaUgjKW';

$result = $pdo->prepare("SELECT * FROM VerificationCodes WHERE status = 1 AND application_id = :application_id AND code = :code AND date_created > DATE_SUB(now(), INTERVAL 15 MINUTE");
$result->execute(array('application_id' => $application_id, 'code' => $code));

$data = array('result' => false);

foreach ($result as $row) {
	$data['user_id'] = $row['user_id'];
	$data['result'] = true;
}

