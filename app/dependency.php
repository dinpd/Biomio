<?php
// DIC configuration

$container = $app->getContainer();

// view renderer
$container['renderer'] = function ($c) {
    $settings = $c->get('settings')['renderer'];
    return new Slim\Views\PhpRenderer($settings['template_path']);
};

// Register component on container
$container['view'] = function ($c) {
    $settings = $c->get('settings')['view'];
    $view = new \Slim\Views\Twig($settings['template_path'], [
        'debug' => $settings['debug'],
        'cache' => $settings['cache_path']
    ]);
	// Add extensions
    $view->addExtension(new \Slim\Views\TwigExtension(
        $c['router'],
        $c['request']->getUri()
    ));
    $view->addExtension(new Twig_Extension_Debug());
	
    return $view;
};

// Flash messages
$container['flash'] = function ($c) {
    return new \Slim\Flash\Messages;
};

// monolog
$container['logger'] = function ($c) {
    $settings = $c->get('settings')['logger'];
    $logger = new Monolog\Logger($settings['name']);
    $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], Monolog\Logger::DEBUG));
    return $logger;
};

// sessions
$container['session'] = function($c){
    return new \RKA\Session();
};


// error handle
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


# -----------------------------------------------------------------------------
# Action factories Controllers
# -----------------------------------------------------------------------------

$container['App\Controllers\IndexController'] = function ($c) {
    return new App\Controllers\IndexController(
        $c->get('renderer'),
        $c->get('logger')
    );
};


$container['App\Controllers\HomeController'] = function ($c) {
    return new App\Controllers\HomeController(
		$c->get('view'), 
		$c->get('logger')
    );
};


$container['App\Controllers\UserController'] = function ($c) {
    return new App\Controllers\UserController(
		$c->get('renderer'),
		$c->get('logger'),
        $c->get('session'),
        $c->get('settings'),
        $c->get('mailer')
    );
};


$container['App\Controllers\ProviderController'] = function ($c) {
    return new App\Controllers\ProviderController(
		$c->get('renderer'),
		$c->get('logger'),
        $c->get('session')
    );
};

$container['App\Controllers\UploadController'] = function ($c) {
    return new App\Controllers\UploadController(
        $c->get('logger'),
        $c->get('settings')
    );
};


$container['App\Controllers\DomainController'] = function ($c) {
    return new App\Controllers\DomainController(
        $c->get('logger'),
        $c->get('settings')
    );
};



$container['App\Controllers\CommandController'] = function ($c) {
    return new App\Controllers\CommandController(
        $c->get('logger'),
        $c->get('settings'),
        $c->get('mailer')

    );
};


$container['App\Controllers\SplashController'] = function ($c) {
    return new App\Controllers\SplashController(
        $c->get('logger'),
        $c->get('settings')
    );
};

$container['App\Controllers\InviteController'] = function ($c) {
    return new App\Controllers\InviteController(
        $c->get('renderer'),
        $c->get('logger'),
        $c->get('settings'),
        $c->get('mailer')
    );
};

$container['App\Controllers\CaptchaController'] = function ($c) {
    return new App\Controllers\UserController(
        $c->get('view'),
        $c->get('logger'),
        $c->get('session')
    );
};

# -----------------------------------------------------------------------------
# Factories Models
# -----------------------------------------------------------------------------

$container['Model\User'] = function ($c) {
    return new App\Models\User;
};


# -----------------------------------------------------------------------------
# Factories Services
# -----------------------------------------------------------------------------

$container['mailer'] = function ($c) {
    return new App\Services\Mailer(
        $c->get('view'),
        $c->get('logger'),
        $c->get('settings')
    );
};