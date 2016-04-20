<?php
/*
	Routes
	controller needs to be registered in dependency.php
*/
use \Slim\Http\Uri;

//$app->get('/', 'App\Controllers\HomeController:dispatch')->setName('homepage');
$app->get('/', 'App\Controllers\IndexController:dispatch')->setName('index');

$app->get('/users', 'App\Controllers\UserController:dispatch')->setName('userpage');
$app->get('/tryx', 'App\Controllers\UserController:tryx')->setName('tryx');
$app->post('/tryx', 'App\Controllers\UserController:tryx')->setName('tryxPost');

$app->group('/captcha/', function() use ($app){
    $app->post('create_image','App\Controllers\CaptchaController:create_image');
    $app->post('check_code','App\Controllers\CaptchaController:check_code');
});

$app->group('/login/',function() use($app){

    $app->post('check_email','App\Controllers\UserController:check_email');
    $app->post('sign_up','App\Controllers\UserController:create_user');
    $app->post('login_check','App\Controllers\UserController:signup_check');
    $app->post('generate_bioauth_code','App\Controllers\UserController:generate_bioauth_code');
    $app->post('check_bioauth_code','App\Controllers\UserController:check_bioauth_code');
    $app->post('update_name','App\Controllers\UserController:update_name');
    $app->post('send_phone_login_code','App\Controllers\UserController:send_phone_login_code');
    $app->post('send_email_login_code','App\Controllers\UserController:send_email_login_code');
    $app->post('check_login_code','App\Controllers\UserController:check_login_code');

    /*Legacy method TODO: Check Usages*/
    $app->post('guest_login','App\Controllers\UserController:guest_login');
    /*Legacy method TODO: Check Usages*/
    $app->post('test_login','App\Controllers\UserController:test_login');

    /*TODO: Keep in mind for session middleware refactor*/
    $app->post('is_loged_in','App\Controllers\UserController:get_user_session');
    $app->post('get_state','App\Controllers\UserController:get_state');
    $app->post('save_state','App\Controllers\UserController:save_state');
//
//    // ------- Other cool stuff ---------
    $app->post('contact','App\Controllers\Email:contact');
    $app->post('change_type','App\Controllers\UserController:change_type');
    $app->post('logout','App\Controllers\UserController:logout');
//
//    // -------- Phone registration ----------
    $app->post('get_phones','App\Controllers\UserController:get_phones');
    $app->post('send_phone_verification_code','App\Controllers\UserController:send_phone_verification_code');
    $app->post('verify_phone_code','App\Controllers\UserController:verify_phone_code');
    $app->post('delete_phone','App\Controllers\UserController:delete_phone');
//
//    // User Services
//    // --- Applications --- //
    $app->post('get_mobile_devices','App\Controllers\UserController:get_mobile_devices');
    $app->post('add_mobile_device','App\Controllers\UserController:add_mobile_device');
    $app->post('generate_qr_code','App\Controllers\UserController:generate_qr_code');
    $app->post('generate_biometrics_code','App\Controllers\UserController:generate_biometrics_code');

    /* Warning: Following Legacy implementations has of methods with possible errors */
    $app->post('rename_mobile_device','App\Controllers\UserController:rename_mobile_device');
    $app->post('delete_mobile_device','App\Controllers\UserController:delete_mobile_device');
    $app->post('get_biometrics','App\Controllers\UserController:get_biometrics');
//
//    // --- Chrome Extention --- //
    $app->post('get_user_extensions','App\Controllers\UserController:get_user_extensions');
    $app->post('get_user_emails','App\Controllers\UserController:get_user_emails');
    $app->post('add_email','App\Controllers\UserController:add_email');
    $app->post('delete_email','App\Controllers\UserController:delete_email');
    $app->post('generate_image_code','App\Controllers\UserController:generate_image_code');
//
//    // ------ //
    $app->post('check_code_status','App\Controllers\UserController:check_code_status');
    $app->post('code_verified','App\Controllers\UserController:code_verified');
    $app->post('send_email_verification_code','App\Controllers\UserController:send_email_verification_code');
    $app->post('verify_email','App\Controllers\UserController:verify_email');
    $app->post('verify_extention','App\Controllers\UserController:verify_extention');
    $app->post('get_extension_settings','App\Controllers\UserController:get_extension_settings');
    $app->post('change_extention_settings','App\Controllers\UserController:change_extention_settings'); //<--need more improvement there's curl
    $app->post('check_status','App\Controllers\UserController:check_status');
//
//    /* Gate */
    $app->post('get_gate_keys','App\Controllers\UserController:get_gate_keys');
//
//    /* API */
    $app->post('get_api_keys','App\Controllers\UserController:get_api_keys');
    $app->post('generate_api_key','App\Controllers\UserController:generate_api_key');
    $app->post('delete_api_key','App\Controllers\UserController:delete_api_key');

});