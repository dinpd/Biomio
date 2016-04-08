<?php

namespace App\Controllers;

use Psr\Log\LoggerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

final class IndexController
{

    private $logger;
    private $user;
    private $renderer;

    public function __construct($renderer, LoggerInterface $logger, $user)
    {
        $this->renderer = $renderer;
        $this->logger = $logger;
        $this->model = $user;
    }

    public function tryout(Request $request, Response $responce,$args){

        $this->logger->info("tryouted");

        return $responce;

    }

    public function dispatch(Request $request, Response $response, $args)
    {
        $this->logger->info("Index page action dispatched");

        $this->renderer->render($response,'/index.php');
        return $response;
    }
}