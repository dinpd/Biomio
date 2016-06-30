<?php
namespace App\Controllers;

use Psr\Log\LoggerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \App\Models\User as User;

use ORM;

final class SplashController
{
    private $logger;
    private $settings;

    public function __construct(LoggerInterface $logger, $settings)
    {
        $this->logger = $logger;
        $this->settings = $settings;
    }

    public function not_implemented(Request $request, Response $responce){
        return $responce->write('Not implemented');
    }

}