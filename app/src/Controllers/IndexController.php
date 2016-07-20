<?php

namespace App\Controllers;

use Psr\Log\LoggerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \App\Models\User as User;

final class IndexController
{

    private $logger;
    private $renderer;

    public function __construct($renderer, LoggerInterface $logger)
    {
        $this->renderer = $renderer;
        $this->logger = $logger;
    }
   

    public function get_all_users(Request $request, Response $response, $args){
	$users = User::get_all_users();
	$this->renderer->render($response, '/users.php', array("users" => $users));
	return $response;
    }

    public function dispatch(Request $request, Response $response, $args)
    {
        $this->logger->info("Index page action dispatched");

        $this->renderer->render($response,'/index.php');
        return $response;
    }
}