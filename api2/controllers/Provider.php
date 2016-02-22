<?php
namespace Controllers;

require ('../php/controllers/UserController.php');

use ORM;
use Slim\Slim;
use Models;

class Provider
{

    const ERR_CODE_WRONG_HASH = 101;
    const ERR_CODE_REQUIRED = 102;
    const ERR_CODE_EXPIRED = 103;
    const ERR_CODE_INVALID_EMAIL = 104;
    const ERR_CODE_NOT_GMAIL = 105;
    const ERR_CODE_EMAIL_EXIST = 106;

    /**
     * @route: post /api/v1/sign_up
     * @param $request
     * @param $response
     * @return mixed
     */
    public static function signUp($request, $response)
    {
        //$request: {hash: hash, time: time, public_key: public_key, email: email }

        $post = $request->getParsedBody();

        /** validate body params */
        if (!isset($post['hash']) || !isset($post['time']) || !isset($post['public_key']) || !isset($post['email'])) {
            $message = [
                "code" => self::ERR_CODE_REQUIRED,
                "message" => "hash, time, public_key, email are required!"
            ];
            return $response->withStatus(400)
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode($message));
        }

        $provider = Models\Provider::getProviderByPublicKey($post['public_key']);
        $currentTime = time();



        $hashIsValid = validateHash($post, $provider->private_key);

        if (!$hashIsValid) {
            $message = [
                "code" => self::ERR_CODE_WRONG_HASH,
                "message" => "Hash is wrong!"
            ];
            return $response->withStatus(401)
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode($message));
        }

        $expired = ($currentTime > $post['time'] + 5 * 60);

        if ($expired) {
            $message = [
                "code" => self::ERR_CODE_EXPIRED,
                "message" => "time is wrong or request is expired!"
            ];
            return $response->withStatus(400)
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode($message));
        }

        if (!filter_var($post['email'], FILTER_VALIDATE_EMAIL)) {
            $message = [
                "code" => self::ERR_CODE_INVALID_EMAIL,
                "message" => "email is in a wrong format!"
            ];
            return $response->withStatus(400)
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode($message));
        }

        list($user, $domain) = explode('@', strtolower($post['email']));

        if (!is_google_mx($domain)) {
            $message = [
                "code" => self::ERR_CODE_NOT_GMAIL,
                "message" => "provided email is not gmail or gmail associated!"
            ];
            return $response->withStatus(400)
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode($message));
        }

        $profileId = UserController::create_user('', '', $post['email'], 'USER', 1);

        if ($profileId == '#email') {

            $message = [
                "code" => self::ERR_CODE_EMAIL_EXIST,
                "message" => "we already have a user registered with this email!"
            ];
            return $response->withStatus(400)
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode($message));

        } else {
            $result = Models\Provider::addUser($provider->id, $profileId);

            if (!$result) {
                $message = [
                    "code" => self::ERR_CODE_EMAIL_EXIST,
                    "message" => "we already have a user registered with this email!"
                ];
                return $response->withStatus(400)
                    ->withHeader('Access-Control-Allow-Origin', '*')
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode($message));
            } else {
                $message = [
                    "profileId" => $profileId
                ];
                return $response->withStatus(200)
                    ->withHeader('Access-Control-Allow-Origin', '*')
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode($message));
            }
        }

    }

    /**
     * @route put /api/v1/user
     * @param $request
     * @param $response
     */
    public static function updateUser($request, $response) {
//        $post = json_decode(file_get_contents("php://input"));
//
//        $hash = $post->hash;
//        $time = $post->time;
//        $public_key = $post->public_key;
//        $profileId = $post->profileId;
//        $first_name = $post->first_name;
//        $last_name = $post->last_name;
//
//        if (time() > $time + 5 * 60) {
//            echo json_encode(array('response'=>'#time'));
//        } else {
//            $result = $pdo->prepare("UPDATE UserInfo SET firstName = :firstName, lastName = :lastName  WHERE profileId = :profileId");
//            $result->execute(array('profileId'=>$profileId, 'lastName'=>$last_name, 'firstName'=>$first_name));
//            echo json_encode(array('response'=>'#success'));
//        }
    }

    /**
     * @route post /api/v1/device
     * @param $request
     * @param $response
     */
    public static function addDevice($request, $response) {
        $message = [
            "error" => "Not implemented"
        ];
        return $response->withStatus(200)
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode($message));
    }

    /**
     * @route post /api/v1/generate_device_code
     * @param $request
     * @param $response
     */
    public static function generateDeviceCode($request, $response) {
        $message = [
            "error" => "Not implemented"
        ];
        return $response->withStatus(200)
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode($message));
    }

    /**
     * @route post /api/v1/generate_biometrics_code
     * @param $request
     * @param $response
     */
    public static function generateBiometricsCode($request, $response) {
        $message = [
            "error" => "Not implemented"
        ];
        return $response->withStatus(200)
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode($message));
    }

    /**
     * @route post /api/v1/generate_extension_code
     * @param $request
     * @param $response
     */
    public static function generateExtensionCode($request, $response) {
        $message = [
            "error" => "Not implemented"
        ];
        return $response->withStatus(200)
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode($message));
    }

    /**
     * @route post /api/v1/status
     * @param $request
     * @param $response
     */
    public static function status($request, $response) {
        $message = [
            "error" => "Not implemented"
        ];
        return $response->withStatus(200)
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Content-Type', 'application/json')
            ->write(json_encode($message));
    }
}