<?php
namespace App\Controllers;

use Psr\Log\LoggerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \App\Models\User as User;

use ORM;

final class CommandController
{
    private $logger;
    private $settings;

    public function __construct(LoggerInterface $logger, $settings)
    {
        $this->logger = $logger;
        $this->settings = $settings;
    }


    public function get_user(Request $request, Response $response, $args)
    {

        $email = $request->getAttribute('email');
        // 1. check if email is in email format
        // 2. check if domain is gmail or googlemail.com (for Germany)

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->_http_error_responce($response, "not email");
        }


        $email = strtolower($email);
        list($user, $domain) = explode('@', $email);
        if (!is_google_mx($domain)) {
            return $this->_http_error_responce($response, "not gmail");
        }


        //TODO: need to rethink
        /* Creating user */
        $first_name = $last_name = '';
        $type = 'USER';

        if (User::check_email($email))
            return $response->write('#email');


        $profileId = User::add_profile(
            $first_name,
            $last_name,
            $email,
            $type,
            Helper::get_remote_addr(),
            Helper::check_mail_for_google_mx($email),
            $this->settings['gateUri']);

        do {
            $code = Helper::genCode();
            $result = User::select_temp_login_codes($code);
        } while ($result);

        User::insert_temp_login_codes($profileId, $code);

        Email::welcome2_email($email, $first_name, $last_name, $code);

        return $response->write($profileId);

    }

    public function verify_service(Request $request, Response $response, $args)
    {

        $code = $request->getAttribute('code');
        $probe_id = $request->getAttribute('probe_id');

        // 1) check if application code apc_exists;
        $verificationCode = User::select_verification_code_with_status_above($code, 0);

        if (!$verificationCode) {
            $this->_http_error_responce($response, "wrong code");
        }

        $profileId = $verificationCode->profileId;
        $application = $verificationCode->application;
        $device_id = $verificationCode->device_id;

        //2) change status of the application

        if ($probe_id != 0) {
            $userService = ORM::for_table('UserServices')->where(['id' => $device_id, 'profileId' => $profileId])->find_one();
            $userService->device_token = $probe_id;
            $userService->save();
            return $response->write(json_encode(array('response' => '#success', 'probe_id' => $probe_id)));
        }


//TODO: refactor this legacy as well as update User model
        /*There's some dublicate usage for VerificationCodes and UserServices */
        $verificationCode = ORM::for_table('VerificationCodes')
            ->where('code', $code)
            ->find_one();

        if ($verificationCode) {
            $verificationCode->set('status', 3);
            $verificationCode->save();
        }

        // 3 add new service
        if ($application == 1) {
            $userServices = ORM::for_table('UserServices')->where(['id' => $device_id, 'profileId' => $profileId])->find_many();

            foreach ($userServices as $userService) {
                $userService->status = 1;
                $userService->save();
            }
        } else if ($application == 2) {

            $userService = ORM::for_table('UserServices')->create();

            $userService->profileId = $profileId;
            $userService->serviceId = $application;
            $userService->status = 1;
            $userService->save();

        }

        return $response->write(json_encode(array('user_id' => $profileId, 'probe_id' => $probe_id)));
    }


    public function register_biometrics(Request $request, Response $response, $args)
    {

        $code = $request->getAttribute('code');
        $biometrics = json_decode(base64_decode($request->getAttribute('biometrics')));

        //TODO: remove this legacy testing stuff
        if ($code == 'magickey') {
            $profileId = 23;


            $status = $biometrics->status;

            if ($status == "in-progress") {
                return $response->write('#accept in-progress');
            } else if ($status == "verified") {

                //3) update biometrics flags
                $fingerprints = $biometrics->fingerprints;
                $fingerprints = json_encode($fingerprints);
                $face = $biometrics->face;
                $voice = $biometrics->voice;

                $userInfo = ORM::for_table('UserInfo')->where('profileId', $profileId)->find_one();
                $userInfo->fingerprints = $fingerprints;
                $userInfo->face = $face;
                $userInfo->voice = $voice;
                $userInfo->save();

                return $response->write('#accept in-progress');
            }

        }


        //TODO: Repository or model

        $verificationCode = User::select_verification_code_with_status_above($code, 0);

        if (!$verificationCode) {
            return $this->_http_error_responce($response, "wrong code");
        }

        $profileId = $verificationCode->profileId;
        $status = $biometrics->status;

        //TODO: Refactor legacy string comparision
        if ($biometrics->message == "Maximum number of training retries reached.Try to change your location or your device position") {
            $status = "failed-message";
        };

        switch ($status) {
            case "canceled":
                User::update_verification_code_status(5, $code);
                break;
            case "failed-message":
                User::update_verification_code_status(6, $code);
                break;
            case "failed":
                User::update_verification_code_status(7, $code);
                break;
            case "in-progress":
                User::update_verification_code_status(4, $code);
                break;
            case "retry":
                User::update_verification_code_status(8, $code);
                break;
            case "success":
                User::update_verification_code_status(3, $code);
                User::update_user_info($profileId, 'face', 1); // <-- legacy version of function contains an error
                break;

        }

        return $response;


    }


    public function bioauth(Request $request, Response $response, $args)
    {
        $email = $request->getAttribute('email');
        $code = $request->getAttribute('code');

        $userEmail = User::check_email($email);
        if (!$userEmail) {
            return $this->_http_error_responce($response, "wrong email");
        }

        $verificationCode = User::select_verification_code_with_profileId_status_above($code, $userEmail->profileId, 0);

        if (!$verificationCode) {
            return $this->_http_error_responce($response, "wrong code");
        }

        User::update_verification_code_status(3, $code);


        return $response;

    }

    public function save_log(Request $request, Response $response, $args)
    {
        //legacy version does nothing, but send "#success"
        return $response->write('#success');
    }

    public function get_client_info(Request $request, Response $response, $args)
    {
        $public_key = $request->getAttribute('public_key');

        $clientKey = ORM::for_table('ClientKeys')->where('public_key', $public_key)->find_one();

        if (!$clientKey) {
            return $this->_http_error_responce($response, "not recognized");
        }

        $webResource = ORM::for_table('WebResources')->where('id', $clientKey->resourceId)->find_one();

        if (!$webResource) {
            return $response->write('empty WebResource');
        }

        $data = array(
            'title' => $webResource->title,
            'domain' => $webResource->domain,
            'hook' => $webResource->hook,
            //TODO: remove this legacy hardcoded holly crap
            'logo' => 'http://pad2.whstatic.com/images/7/7d/DrawBatman-17.jpg',
            'secret' => $webResource->private_key
        );


        return $response->withHeader('Content-Type', 'application/json')->write($data);

    }


    public function test(Request $request, Response $response, $args)
    {
        $email = $request->getAttribute('email');

        //TODO: figure out for what this legacy stuff and remove it
        if ($email) {
            $myfile = fopen("test.txt", "w") or die("Unable to open file!");
            $txt = $email;
            fwrite($myfile, $txt);
            fclose($myfile);

        }

        return $response->write(json_encode(array('response' => true)));
    }


    private function _http_error_responce(Response $responce, $message = '', $code = 400)
    {
        /*
         *  header("HTTP/1.0 400 not recognized");
            echo "PHP continues.\n";
            die();
         */
        return $responce->withHeader("HTTP/1.0 " + $code + " " + $message)->write("PHP continues.\n");
    }


}