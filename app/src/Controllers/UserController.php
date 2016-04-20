<?php

namespace App\Controllers;

use Psr\Log\LoggerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \App\Models\User as User;
use \App\Models\Helper as Helper;

final class UserController
{
    private $renderer;
    private $logger;
    private $session;

    public function __construct(\Slim\Views\PhpRenderer $renderer, LoggerInterface $logger, \RKA\Session $session)
    {
        $this->renderer = $renderer;
        $this->logger = $logger;
        $this->session = $session;
    }

//    public function dispatch(Request $request, Response $response, $args)
//    {
//        $this->logger->info("Home page action dispatched");
//
//        $users = $this->model->show();
//
//        return $this->view->render($response, 'users.twig', ["data" => $users]);
//    }


    public function tryx(Request $request, Response $response, $args)
    {

        $textoutput = $request->getParam('textinput');

        //$textoutput = $input['textinput'];
        if ($this->session->get('wow'))
            $this->session->wow = $this->session->wow + 1;
        else
            $this->session->wow = 22;
        //$this->session->set('wow',1);

        //return $response->write('hii ja!:' . $this->session->wow);

        return $this->renderer->render($response, '/tmp.php', ['wow' => $this->session->wow, 'textoutput' => $textoutput]);
    }

    private function _start_session($id, $type, $first_name, $last_name)
    {
        $this->session->id = $id;
        $this->session->type = $type;
        $this->session->first_name = $first_name;
        $this->session->last_name = $last_name;
    }


    public function get_user_session(Request $request, Response $response, $args)
    {
        return $response->write(json_encode($this->_get_user_session()));
    }

    private function _get_user_session()
    {
        return array(
            "id" => $this->session->get('id'),
            "type" => $this->session->get('type'),
            "first_name" => $this->session->get('first_name'),
            "last_name" => $this->session->get('last_name'));
    }


    public function logout(Request $request, Response $response, $args)
    {
        $this->session->destroy();
        return $response->write('You are successfully logged out');
    }

    public function check_email(Request $request, Response $response, $args)
    {
        if (User::check_email("email here")) {
            return $response->write('#registered');
        } else {
            return $response->write('#fine');
        }
    }


    public function create_user(Request $request, Response $response, $args)
    {

        $type = $request->getParam('type');
        $first_name = $request->getParam('first_name');
        $last_name = $request->getParam('last_name');
        $email = $request->getParam('email');
        $extension = 0;

        if (!User::check_email($email))
            return '#email';

        $profileId = User::add_profile(
            $first_name,
            $last_name,
            $email,
            $type,
            Helper::get_remote_addr(),
            Helper::check_mail_for_google_mx($email));

        //legacy code Looks like workaround for async send mail
        //TODO: Refactor is required, async send email
        /*new email key (we still create user if email is not gmail, just don't create the key)*/
        if ($extension == 0 && Helper::check_mail_for_google_mx($email)) {
            $url = 'http://10.209.33.61:90/new_email/' . $email;
            Helper::send_post($url);
        }

        do {
            $code = Helper::genCode();
            $result = User::select_temp_login_codes($code);
        } while ($result);
        User::insert_temp_login_codes($profileId, $code);

        //TODO: Refactor is required, for email provider
        if ($extension == 0) {

            $this->_start_session($profileId, $type, $first_name, $last_name);

            Email::welcome_email($email, $first_name, $last_name, $code);
        } else {
            Email::welcome2_email($email, $first_name, $last_name, $code);
        }
        //return $profileId;
        return $response->write($profileId);
    }


    public function signup_check(Request $request, Response $response, $args)
    {
        $email = $request->getParam('email');
        $user = User::check_email($email);

        if (!$user)
            return $response->write(json_encode(array('response' => '#fine')));

        $profileId = $user->profileId;
        User::update_user($profileId, 'last_ip', Helper::get_remote_addr());

        $data = array();
        $data['id'] = $profileId;
        $data['phone'] = 0;

        $phones = User::get_phones($profileId);
        if ($phones) {
            $data['phone'] = 1;
        }

        $user = User::get_user_info($profileId);
        $data['face'] = $user->face;

        return $response->write(json_encode($data));

    }


    public function generate_bioauth_code(Request $request, Response $response, $args)
    {

        $email = $request->getParam('email');
        $email = User::check_email($email);

        if (!$email)
            return $response->write('#email');

        $profileId = $email->profileId;

        User::update_verification_codes(0, $profileId, 3);

        do {
            $code = Helper::genCode();
            $verificationCode = User::select_verification_codes($code);
        } while ($verificationCode);

        $result = User::insert_verification_codes($profileId, 0, 3, 1, $code);

        if ($result) return $code;
        else return $response->write('#error');
    }


    public function check_bioauth_code(Request $request, Response $response, $args)
    {
        $code = $request->getParam('code');

        $verificationCode = User::select_verification_codes($code);

        if (!$verificationCode)
            return $response->write(json_encode(array('response' => '#no-code')));

        if ($verificationCode->status != 3)
            return $response->write(json_encode(array('response' => '#not-verified')));


        $profileId = $verificationCode->profileId;
        $userProfile = User::find_user('id', $profileId);

        //TODO: require optimization to update_user_last_ip method
        User::update_user($profileId, 'last_ip', Helper::get_remote_addr());

        $userInfo = User::get_user_info($profileId);


        $this->_start_session($profileId,
            $userProfile->type,
            $userInfo->firstName,
            $userInfo->lastName);

        $sessionData = $this->_get_user_session();

        $sessionData['responce'] = '#verified';

        return $response->write(json_encode($sessionData));

    }


    public function update_name(Request $request, Response $response, $args)
    {

        $first_name = $request->getParam('first_name');
        $last_name = $request->getParam('last_name');

        if ($this->session->get('id') === null)
            return $response->write('#no-session');

        $profileId = $this->session->id;

        User::update_profile('first_name', $first_name, $profileId);
        User::update_profile('last_name', $last_name, $profileId);

        $this->session->first_name = $first_name;
        $this->session->last_name = $last_name;

        return $response->write('#success');

    }

    public function send_phone_login_code(Request $request, Response $response, $args)
    {
        $profileId = $request->getParam('profileId');
        $phone = $request->getParam('value');

        $tempLoginPhone = User::select_temp_login_phone($profileId, $phone);

        if (!$tempLoginPhone)
            return $response->write('#not-found');

        User::update_temp_login_code($profileId, 0);

        do {
            $code = Helper::genCode();
            $tempLoginCode = User::select_temp_login_codes($code);
        } while ($tempLoginCode);

        User::insert_temp_login_codes($profileId, $code);

        /* START Some legacy stuff */
        //TODO: find out what to do with that legacy things
        // send code
        $user = "biomio";
        $password = "JFAOSMGDHfKcWR";
        $api_id = "3524018";
        $baseurl = "http://api.clickatell.com";
        $text = urlencode("BIOMIO temporary login code: " . $code);
        $to = $phone;
        $from = "17577932772";
        $mo = "1";

        $url = "$baseurl/http/sendmsg?user=$user&password=$password&api_id=$api_id&to=$to&text=$text&mo=$mo&from=$from";
        $ret = file($url);

        // send success message
        $send = explode(":", $ret[0]);
        if ($send[0] == "ID")
            return $response->write("#success");
        else
            return $response->write("send message failed");
        /* END Some legacy stuff */
    }


    public function send_email_login_code(Request $request, Response $response, $args)
    {
        $profileId = $request->getParam('profileId');
        $email = $request->getParam('value');

        $tempLoginEmail = User::select_temp_login_email($profileId, $email);

        if (!$tempLoginEmail)
            return $response->write('#not-found');

        User::update_temp_login_code($profileId, 0);

        do {
            $code = Helper::genCode();
            $tempLoginCode = User::select_temp_login_codes($code);
        } while ($tempLoginCode);

        User::insert_temp_login_codes($profileId, $code);

        Email::login_code($code, $email);

        return $response->write('#success');
    }


    public function check_login_code(Request $request, Response $response, $args)
    {

        $profileId = $request->getParam('profileId');
        $code = $request->getParam('code');
        $tempLoginCode = User::select_temp_login_code($profileId, $code);

        if (!$tempLoginCode)
            return $response->write(json_encode(array('response' => '#code')));

        User::update_temp_login_code($profileId, 0);

        $user = User::find_user('id', $profileId);
        if ($user) {

            User::update_user($profileId, 'last_ip', Helper::get_remote_addr());

            $userInfo = User::get_user_info($profileId);


            $this->_start_session($profileId,
                $user->type,
                $userInfo->first_name,
                $userInfo->last_name);

            return $response->write(json_encode($this->_get_user_session()));
        }

    }

    public function guest_login(Request $request, Response $response, $args)
    {
        /* WTF Legacy stuff*/
        $profileId = 11;
        $type = "USER";
        $first_name = "Guest";
        $last_name = "User";


        $this->_start_session($profileId, $type, $first_name, $last_name);
        return $response->write(json_encode($this->_get_user_session()));
    }

    public function test_login(Request $request, Response $response, $args)
    {
        /* WTF Legacy stuff*/
        $profileId = 23;
        $type = "USER";
        $first_name = "Test";
        $last_name = "Acc";


        $this->_start_session($profileId, $type, $first_name, $last_name);
        $result = $this->_get_user_session();

        return $response->write(json_encode($result));
    }


    public function get_state(Request $request, Response $response, $args)
    {
        $type = $request->getParam('type');

        if ($this->session->id !== null) {
            $profileId = $this->session->id;

            // get state
            $user = User::get_profile($profileId);
            $state = json_decode($user->training);

            $result = 0;
            foreach ($state as $id => $s) {
                if ($id == $type) $result = $s;
            }

            return $response->write($result);
        }
    }


    public function save_state(Request $request, Response $response, $args)
    {
        $type = $request->getParam('type');
        $s = $request->getParam('s');


        if ($this->session->id !== null) {
            $profileId = $this->session->id;

            // get state
            $user = User::get_profile($profileId);
            $state = json_decode($user->training);
            $state[$type] = $s;

            User::update_profile('training', json_encode($state), $profileId);

            return $response->write('#success');
        }
    }


    public function change_type(Request $request, Response $response, $args)
    {
        $type = $request->getParam('type');


        $profileId = $this->session->id;

        User::update_user($profileId, 'type', $type);

        return $response->write('#success');
    }

    public function get_phones(Request $request, Response $response, $args)
    {

        $profileId = $this->session->id;

        $phones = User::get_phones($profileId);
        $data = array();
        foreach ($phones as $phone) {
            $data[] = $phone['phone'];
        }
        return $response->write(json_encode($data));
    }


    public function send_phone_verification_code(Request $request, Response $response, $args)
    {

        $phone = $request->getParam('phone');

        $profileId = $this->session->id;

        // inactivate all the previous codes
        User::update_temp_phone_codes($profileId, 0);


        do {
            $code = Helper::genCode();
            $result = User::check_temp_phone_codes($code);
        } while ($result);


        User::insert_temp_phone_codes($profileId, $code, $phone);

        // send code
        $user = "biomio";
        $password = "JFAOSMGDHfKcWR";
        $api_id = "3524018";
        $baseurl = "http://api.clickatell.com";
        $text = urlencode("BIOMIO verification code: " . $code);
        $to = $phone;
        $from = "17577932772";
        $mo = "1";

        $url = "$baseurl/http/sendmsg?user=$user&password=$password&api_id=$api_id&to=$to&text=$text&mo=$mo&from=$from";
        $ret = file($url);

        $send = explode(":", $ret[0]);
        if ($send[0] == "ID")
            return $response->write("#success");
        else
            return $response->write("send message failed");
    }


    public function verify_phone_code(Request $request, Response $response, $args)
    {
        $code = $request->getParam('code');

        $profileId = $this->session->id;

        $tempPhoneCodes = User::select_temp_phone_codes($profileId, $code);

        if (!$tempPhoneCodes)
            return $response->write(0);

        $phone = $tempPhoneCodes[0]->phone;

        User::update_temp_phone_codes($profileId, 0);
        User::add_phone($profileId, $phone);

        return $response->write($phone);

    }

    public function delete_phone(Request $request, Response $response, $args)
    {
        $number = $request->getParam('number');
        $profileId = $this->session->id;
        User::delete_phone($profileId, $number);
        return $response->write("#success");
    }


    // User Services
    // --- Applications --- //
    public function get_mobile_devices(Request $request, Response $response, $args)
    {
        $profileId = $this->session->id;
        $mobileDevices = User::get_mobile_devices($profileId);

        $data = array();
        foreach ($mobileDevices as $mobileDevice)
            $data[] = array('id' => $mobileDevice->id, 'title' => $mobileDevice->title, 'status' => $mobileDevice->status);

        return $response->write(json_encode($data));
    }

    public function add_mobile_device(Request $request, Response $response, $args)
    {
        $name = $request->getParam('name');
        $profileId = $this->session->id;
        $device_id = User::add_mobile_device($profileId, $name);
        return $response->write($device_id);
    }


    public function generate_qr_code(Request $request, Response $response, $args)
    {
        $device_id = $request->getParam('id');
        $application = $request->getParam('application');

        if ($this->session->get('id') === null)
            return $response->write('#no-session');

        $profileId = $this->session->id;

        // disable all the codes for this user
        User::update_verification_codes(0, $profileId, $application);

        do {
            $code = Helper::genCode();
            $verificationCode = User::select_verification_codes($code);
        } while ($verificationCode);


        $result = User::insert_verification_codes($profileId, $device_id, $application, 1, $code);
        if ($result) {
            return $response->write($code);
        } else return $response->write('#error');
    }


    public function generate_biometrics_code(Request $request, Response $response, $args)
    {

        $device_id = $request->getParam('device_id');
        $application = $request->getParam('application');


        if ($this->session->get('id') === null)
            return $response->write('#no-session');

        $profileId = $this->session->id;

        // disable all the codes for this user
        User::update_verification_codes(0, $profileId, $application);


        $mobileDevices = User::get_mobile_devices($profileId);

        foreach ($mobileDevices as $mobileDevice) {
            if ($mobileDevice->id == $device_id)
                $key = $mobileDevice->device_token;
        }

        do {
            $code = Helper::genCode();
            $verificationCode = User::select_verification_codes($code);
        } while ($verificationCode);

        /*Legacy  stuff*/
        $url = 'http://10.209.33.61:90/training?device_id=' . $key . '&code=' . $code;
        send_post($url);

        // insert code
        $result = User::insert_verification_codes($profileId, $device_id, $application, 1, $code);
        if ($result) return $response->write($code);
        else return $response->write('#error');

    }


    public function rename_mobile_device(Request $request, Response $response, $args)
    {
        $device_id = $request->getParam('device_id');
        $name = $request->getParam('name');
        $profileId = $this->session->id;
        User::rename_mobile_device($profileId, $device_id, $name);
        return $response->write("#success");
    }


    public function delete_mobile_device(Request $request, Response $response, $args)
    {
        $device_id = $request->getParam('device_id');
        $profileId = $this->session->id;
        User::delete_mobile_device($profileId, $device_id);
        return $response->write("#success");
    }


    public function get_biometrics(Request $request, Response $response, $args)
    {
        $biometrics = $request->getParam('biometrics');
        $profileId = $this->session->id;
        $biometrics = User::get_biometrics($profileId, $biometrics);
        return $response->write(json_encode($biometrics));
    }


    // --- Chrome Extention --- //
    public function get_user_extensions(Request $request, Response $response, $args)
    {
        $profileId = $this->session->id;
        return $response->write(User::count_user_extensions($profileId));
    }


    public function get_user_emails(Request $request, Response $response, $args)
    {
        $extention = $request->getParam('extention');
        $profileId = $this->session->id;
        $userEmails = User::get_user_emails($profileId);
        $data = array();


        foreach ($userEmails as $userEmail) {

            $data[] = array(
                'id' => $userEmail->id,
                'email' => $userEmail->email,
                'verified' => $userEmail->verified,
                'primary' => $userEmail->primary,
                'extention' => $userEmail->extention);

            if ($extention == 1) {
                list($user, $domain) = explode('@', $userEmail->email);
                if (!Helper::is_google_mx($domain)) {
                    array_pop($data);
                }
            }
        }

        return $response->json_encode($data);
    }


    public function add_email(Request $request, Response $response, $args)
    {
        $profileId = $this->session->id;
        $email = $request->getParam('email');
        $emailObject = User::check_email($email);

        if ($emailObject)
            return $response->write('#registered');

        list($user, $domain) = explode('@', $email);
        if (Helper::is_google_mx($domain)) {
            //TODO: legacy method had echo 'gmail'
            $response->write('gmail');
            User::add_gmail_email($profileId, $email);
        } else {
            //TODO: legacy method had echo 'not gmail'
            $response->write('not gmail');
            User::add_not_gmail_email($profileId, $email);
        }

        return $response;

    }


    public function delete_email(Request $request, Response $response, $args)
    {
        $email = $request->getParam('email');
        $profileId = $this->session->id;
        User::delete_email($profileId, $email);
        return $response->write("#success");
    }


    public function generate_image_code(Request $request, Response $response, $args)
    {
        $application = $request->getParam('application');
        $profileId = $this->session->id;
        /* Legacy comments below
           looks like method is not implemented*/

        // bla bla work
        // return picture
        //  return $result;
    }



    // ------ //


    /**
     * TODO: Legacy code contain execution error
     * @param Request $request
     * @param Response $response
     * @param $args
     * @return mixe
     */
    public function check_code_status(Request $request, Response $response, $args)
    {
//        $code = $request->getParam('code');
//        $profileId = $_SESSION['id'];
//        $result = User::update_email($profileId, $email); //,<-- here
//        return $response->write($result);
    }


    /**
     * TODO: Legacy code contain execution error
     * @param Request $request
     * @param Response $response
     * @param $args
     */
    public function code_verified(Request $request, Response $response, $args)
    {
//        $code = $request->getParam('code');
//        $profileId = $_SESSION['id'];
//        $result = User::update_email($profileId, $email);
//        return $result;
    }


    public function send_email_verification_code(Request $request, Response $response, $args)
    {
        $email = $request->getParam('email');

        $profileId = $this->session->id;
        $first_name = $this->session->first_name;
        $last_name = $this->session->last_name;

        // inactivate all the previous codes
        User::update_temp_email_codes($profileId, 0);

        $code = Helper::genCode();

        // put code to the database
        User::insert_temp_email_codes($profileId, $code, $email);

        // send code
        Email::send_email_verification_code($email, $first_name, $last_name, $code);

        return $response->write("#success");
    }


    public function verify_email(Request $request, Response $response, $args)
    {
        $email = $request->getParam('email');
        $code = $request->getParam('code');
        $profileId = $this->session->id;

        $emailCodes = User::select_temp_email_codes($profileId, $email, $code);

        if (!$emailCodes)
            return $response->write(0);

        User::update_email($profileId, $email, 'verified', 1);

        User::update_temp_email_codes($profileId, 3);
        return $response->write("#success");

    }

    public function verify_extention(Request $request, Response $response, $args)
    {
        if ($this->session->get('id') === null)
            return $response->write('#no-session');


        $profileId = $this->session->id;
        // disable all the codes for this user
        User::update_verification_codes(0, $profileId, 2);

        do {
            $code = Helper::genCode();
            $verificationCode = User::select_verification_codes($code);
        } while ($verificationCode);

        $verificationCodeId = User::insert_verification_codes($profileId, 0, 2, 1, $code);
        if (!$verificationCodeId)
            return $response->write('#error');

        return $response->write(json_encode(array('code' => $code, 'image' => create_image_code($code))));

    }

    public function get_extension_settings(Request $request, Response $response, $args)
    {

        if ($this->session->get('id') === null)
            return $response->write(json_encode(array('response' => '#no-session')));

        $profileId = $this->session->id;
        $extensionSettings = User::get_extension_settings($profileId);

        if (!$extensionSettings)
            return $response->write(json_encode(array('response' => '#no-data')));

        return $response->write($extensionSettings->settings);
    }


    public function change_extention_settings(Request $request, Response $response, $args)
    {

        if ($this->session->get('id') === null)
            return $response->write('#no-session');

        $condition = $request->getParam('condition');
        $auth_types = $request->getParam('auth_types');
        $profileId = $this->session->id;

        $settings = array("condition" => $condition, "auth_types" => $auth_types, "user_id" => $profileId);
        // echo json_encode($data);


        $extensionSettings = User::get_extension_settings($profileId);
        if ($extensionSettings) {
            User::save_extension_settings($profileId, $settings);
        } else {
            User::insert_extension_settings($profileId, $settings);
        }


        /* Legacy code
            TODO: Refactor below code to appropriate
        */
        // Send request
        $url = "http://gate.biom.io:90/set_condition/";
        $content = json_encode($settings);
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER,
            array("Content-type: application/json"));
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $content);

        $json_response = curl_exec($curl);

        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if ($status != 200) {
            die("Error: call to URL $url failed with status $status, response $json_response, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
        }

        $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);
        $response = json_decode($json_response, true);

        echo $response;
        echo '<br>HTTP code: ' . $httpcode . '<br>';

    }


    public function check_status(Request $request, Response $response, $args)
    {
        if ($this->session->get('id') === null)
            return $response->write('#no-session');

        $code = $request->getParam('code');

        $verificationCode = User::select_verification_codes($code);
        if (!$verificationCode)
            return $response->write('#no-code');

        $statuses = array(
            3 => '#verified',
            4 => '#in-process',
            5 => '#canceled',
            6 => '#failed1',
            7 => '#failed2',
            8 => '#retry'
        );

        if (!array_key_exists($verificationCode->status, $statuses))
            return $response->write('#not-verified');

        return $response->write($statuses[$verificationCode->status]);
    }


    public function get_gate_keys(Request $request, Response $response, $args)
    {
        /* Not Implemented */
    }


    /* API */
    public function get_api_keys(Request $request, Response $response, $args)
    {

        if ($this->session->providerId === null)
            return $response->write('#no-session');

        $providerId = $this->session->providerId;

        $apiKeys = User::select_api_keys('providerId', $providerId);
        $data = array();
        foreach ($apiKeys as $apiKey) {
            $data[] = array('pub' => $apiKey->public_key, 'priv' => $apiKey->private_key);
        }

        return $response->write(json_encode($data));
    }


    public function generate_api_key(Request $request, Response $response, $args)
    {

        if ($this->session->providerId === null)
            return $response->write('#no-session');

        $providerId = $this->session->providerId;

        do {
            $publicKey = Helper::genApiCode();
        } while (User::select_api_keys('public_key', $publicKey));

        do {
            $privateKey = Helper::genApiCode();
        } while (User::select_api_keys('private_key', $privateKey));


        User::save_api_keys($providerId, $publicKey, $privateKey);

        $data = array('pub' => $publicKey, 'priv' => $privateKey);
        return $response->write(json_encode($data));

    }


    public function delete_api_key(Request $request, Response $response, $args)
    {
        $key = $response->write('key');

        if ($this->session->providerId === null)
            return $response->write('#no-session');

        $providerId = $this->session->providerId;

        User::delete_api_key($providerId, $key);

        return $response->write('#success');
    }

}