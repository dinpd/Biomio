<?php
/*
	Routes
	controller needs to be registered in dependency.php
*/
use \Slim\Http\Uri;

//$app->get('/', 'App\Controllers\HomeController:dispatch')->setName('homepage');
$app->get('/', 'App\Controllers\IndexController:dispatch')->setName('index');

$app->get('/users', 'App\Controllers\UserController:dispatch')->setName('userpage');
