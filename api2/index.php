<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/../api/controllers/EmailController.php';

$path = __DIR__ . "/../php/";
set_include_path(get_include_path() . PATH_SEPARATOR . $path);

$config = require 'config.php';

date_default_timezone_set('UTC');

$app = new Slim\App($config);

$container = $app->getContainer();

if ($config['debug']) {
    ini_set("display_errors", 1);
    error_reporting(E_ALL);

    $container['errorHandler'] = function ($c) {
        return function ($request, $response, $exception) use ($c) {
            $data = [
                'code' => $exception->getCode(),
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => explode("\n", $exception->getTraceAsString()),
            ];

            return $c->get('response')->withStatus(500)
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode($data));
        };
    };

} else {
    ini_set("display_errors", 0);
    error_reporting(0);
}



ORM::configure('mysql:host=' . $config['db']['host'] . ';dbname=' . $config['db']['dbName'] . ';charset=utf8');
ORM::configure('username', $config['db']['user']);
ORM::configure('password', $config['db']['password']);
ORM::configure('return_result_sets', true);
// prevent returning data with string type
ORM::configure('driver_options', array(PDO::ATTR_EMULATE_PREPARES => false));

$container['Models\Helper'] = function ($c) {
    $response = $c->get('response');
    return new \Models\Helper($response);
};


/** Routes */
$app->group('/v1', function () use ($app) {

    $app->post('/sign_up', '\Controllers\Provider:signUp');

    $app->put('/user/{profileId}', '\Controllers\Provider:updateUser');

    $app->post('/user/{profileId}/device', '\Controllers\Provider:addDevice');

    $app->get('/user/{profileId}/device/{deviceId}/code', '\Controllers\Provider:generateDeviceCode');

    $app->get('/user/{profileId}/device/{deviceId}/biometrics-code', '\Controllers\Provider:generateBiometricsCode');

    $app->get('/user/{profileId}/device/{deviceId}/extension-code', '\Controllers\Provider:generateExtensionCode');

    $app->post('/status', '\Controllers\Provider:status');

})->add(new \Middlewares\Hmac);

$app->post('/digest', '\Controllers\Provider:digest');

$app->run();