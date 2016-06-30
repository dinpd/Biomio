<?php
namespace Models;

use ORM;
use Slim\Slim;

class Status
{


    public static function getVerificationCodeStatus($code)
    {

        $result = ORM::for_table('VerificationCodes')->where(["code" => $code])->find_one();

        if (!$result) {
            return '#no-code';
        };

        $statusCodes =
            [   3 => '#verified',
                4 => '#in-process',
                5 => '#canceled',
                6 => '#failed1',
                7 => '#failed2',
                8 => '#retry',
            ];

        if (array_key_exists($result->status, $statusCodes)) {
            return $statusCodes[$result->status];
        } else {
            return '#not-verified';
        };
    }

}