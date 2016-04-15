<?php

namespace App\Controllers;

use Psr\Log\LoggerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \App\Models\User as User;
use \App\Models\Helper as Helper;

final class CaptchaController
{
    private $view;
    private $logger;
    private $session;

    public function __construct($view, LoggerInterface $logger, \RKA\Session $session)
    {
        $this->view = $view;
        $this->logger = $logger;
        $this->session = $session;
    }

    public function dispatch(Request $request, Response $response, $args)
    {
        $this->logger->info("Home page action dispatched");

        $users = $this->model->show();

        return $this->view->render($response, 'users.twig', ["data" => $users]);
    }


    public function create_image(Request $request, Response $response, $args){

    }

    public function check_code(Request $request, Response $response, $args){

    }

}