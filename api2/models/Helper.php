<?php

namespace Models;

class Helper {

    private $response;

    public function __construct($response) {
        $this->response = $response;
    }

    /**
     * Response with json format
     * @param $status
     * @param $data
     * @return mixed
     */
    public function jsonResponse($status, $data = null) {
        $data = ($data == null) ? '' : json_encode($data);

        return $this->response->withStatus($status)
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Content-Type', 'application/json')
            ->write($data);
    }

    public function genCode() {
        $code = "01234567890123456789012345678901234567890123456789012345678901234567890123456789";
        $code = substr(str_shuffle($code), 0, 8);

        return $code;
    }
}
