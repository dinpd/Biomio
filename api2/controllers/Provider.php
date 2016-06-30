<?php
namespace Controllers;

require_once(__DIR__ . "/../../php/controllers/UserController.php");
require_once(__DIR__ . '/../../php/models/User.php');

use ORM;
use Slim\Slim;
use Models;

class Provider
{

    const ERR_CODE_REQUIRED = 101;
    const ERR_CODE_EXPIRED = 102;
    const ERR_CODE_INVALID_EMAIL = 103;
    const ERR_CODE_NOT_GMAIL = 104;
    const ERR_CODE_EMAIL_EXIST = 105;
    const ERR_CODE_USER_NOT_FOUND = 106;

    public $helper;

    public function __construct($c) {
        $this->helper = $c->get('Models\Helper');
    }

    public function digest($request, $response) {

        $body = $request->getParsedBody();

        $provider = Models\Provider::getProviderByPublicKey($body['publicKey']);

        $digest = '';
        if ($provider) {

            $encoded_body = ($body===null? '' : json_encode($body));

            $hash = $body['method'];
            $hash .= $body['uri'];
            $hash .= $encoded_body;
            $hash .= $body['nonce'];

            $digest = hash_hmac('sha256', $hash, $provider->private_key);
        }

        $uri = '';
        $uri .= $request->getUri()->getScheme() . "://";
        $uri .= $request->getUri()->getHost();

        $uri .= ":" . $request->getUri()->getPort();
        $uri .= $request->getUri()->getBasePath();
        $uri .= "/" . $request->getUri()->getPath();
        $uri .= "?" . $request->getUri()->getQuery();

        return $this->helper
            ->jsonResponse(200, ["digest" => $digest, "body" => $body, "method" => $request->getMethod(), "URI" => $uri]);
    }

    /**
     * @route: post /api/v1/sign_up
     * @param $request
     * @param $response
     * @return mixed
     */
    public function signUp($request, $response)
    {
        //$request: {email: email }

        $post = $request->getParsedBody();
        $provider = $request->getAttribute('provider');

        /** validate body params */
        if (!isset($post['email'])) {
            return $this->helper
                ->jsonResponse(400, ["code" => self::ERR_CODE_REQUIRED, "message" => "email is required"]);
        }

        if (!filter_var($post['email'], FILTER_VALIDATE_EMAIL)) {
            return $this->helper
                ->jsonResponse(400, ["code" => self::ERR_CODE_INVALID_EMAIL, "message" => "email is in a wrong format"]);
        }

        list($user, $domain) = explode('@', strtolower($post['email']));

        if (!is_google_mx($domain)) {
            return $this->helper
                ->jsonResponse(400, ["code" => self::ERR_CODE_NOT_GMAIL, "message" => "provided email is not gmail or gmail associated"]);
        }

        $profileId = \UserController::create_user('', '', $post['email'], 'USER', 1);

        if ($profileId == '#email') {
            return $this->helper
                ->jsonResponse(400, ["code" =>  self::ERR_CODE_EMAIL_EXIST, "message" => "we already have a user registered with this email"]);

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
     * @route put /api/v1/user/:profileId
     * @param $request
     * @param $response
     */
    public function updateUser($request, $response, $args) {

        $post = $request->getParsedBody();

        $profileId = $args['profileId'];

        /** validate body params */
        if (!isset($post['first_name']) && !isset($post['last_name'])) {
            return $this->helper->jsonResponse(400, [
                "code" => self::ERR_CODE_REQUIRED,
                "message" => "first_name or last_name is required!"
            ]);
        }

        $user = Models\User::update($profileId, $post);

        if ($user) {
            return $this->helper->jsonResponse(200);
        } else {
            return $this->helper->jsonResponse(404, [
                "code" => self::ERR_CODE_USER_NOT_FOUND,
                "message" => "user not found"
            ]);
        }

    }

    /**
     * @route post /api/v1/user/{profileId}/device
     * @param $request
     * @param $response
     */
    public function addDevice($request, $response, $args) {

        $profileId = $args['profileId'];
        $body = $request->getParsedBody();

        if (!isset($body['title'])) {
            return $this->helper->jsonResponse(400, [
                "code" => self::ERR_CODE_REQUIRED,
                "message" => "name is required!"
            ]);
        }

        $deviceName = $body['title'];
        $result = Models\User::addDevice($profileId, $deviceName);

        if ($result) {
            return $this->helper->jsonResponse(201, ["deviceId" => $result]);
        } else {
            return $this->helper->jsonResponse(500);
        }

    }

    /**
     * @route get /api/v1/user/{profileId}/device/{deviceId}/code
     * @param $request
     * @param $response
     */
    public function generateDeviceCode($request, $response, $args) {

        $profileId = $args['profileId'];
        $deviceId = $args['deviceId'];

        $code = Models\User::generateDeviceCode($profileId, $deviceId);

        $primaryEmail = Models\User::getPrimaryEmail($profileId);

        // Sending Email with extension registration to this user
        \Email::provider_app_registration($primaryEmail, $code);

        return $this->helper->jsonResponse(201, ["code" => $code]);
    }

    /**
     * @route get /api/v1/user/{profileId}/device/{deviceId}/biometrics-code
     * @param $request
     * @param $response
     */
    public function generateBiometricsCode($request, $response, $args) {

        $profileId = $args['profileId'];
        $deviceId = $args['deviceId'];

        $code = Models\User::createBiometricsVerificationCode($profileId, $deviceId);
        return $this->helper->jsonResponse(201, ["code" => $code]);

    }


    /**
     * @route post /api/v1/generate_extension_code
     * @param $request
     * @param $response
     */
    public function generateExtensionCode($request, $response, $args) {

        $profileId = $args['profileId'];

        $code = Models\User::generateExtensionCode($profileId);
        return $this->helper->jsonResponse(201, ["code" => $code]);

    }


    /**
     * @route post /api/v1/status
     * @param $request
     * @param $response
     */
    public function VerificationCodeStatus($request, $response,$args) {

        $code= $args['verificationCode'];

        $status = Models\Status::getVerificationCodeStatus($code);
        return $this->helper->jsonResponse(201, ["status" => $status]);
    }

}