<?php

require __DIR__ . '/vendor/autoload.php';

$config = require 'config.php';

date_default_timezone_set('UTC');

if ($config['debug']) {
    ini_set("display_errors", 1);
    error_reporting(E_ALL);
} else {
    ini_set("display_errors", 0);
    error_reporting(0);
}

$app = new Slim\App();

ORM::configure('mysql:host=' . $config['db']['host'] . ';dbname=' . $config['db']['dbName'] . ';charset=utf8');
ORM::configure('username', $config['db']['user']);
ORM::configure('password', $config['db']['password']);
ORM::configure('return_result_sets', true);
// prevent returning data with string type
ORM::configure('driver_options', array(PDO::ATTR_EMULATE_PREPARES => false));


/** Routes */

$app->group('/v1', function () use ($app) {

    $app->post('/sign_up', '\Controllers\Provider:signUp');

    $app->put('/user', '\Controllers\Provider:updateUser');

    $app->post('/device', '\Controllers\Provider:addDevice');

    $app->post('/generate_device_code', '\Controllers\Provider:generateDeviceCode');

    $app->post('/generate_biometrics_code', '\Controllers\Provider:generateBiometricsCode');

    $app->post('/generate_extension_code', '\Controllers\Provider:generateExtensionCode');

    $app->post('/status', '\Controllers\Provider:status');

});

$app->run();