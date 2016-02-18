<?php

/**
 * Send headers and response data for request
 * @param $status
 * @param $data
 */
function jsonResponse($status, $data = '') {
  $app = \Slim\Slim::getInstance();
  $app->response->setStatus($status);
  $app->response->headers->set('Access-Control-Allow-Origin', '*');
  $app->response->headers->set('Content-Type', 'application/json');

  echo json_encode($data);
  $app->stop();
}