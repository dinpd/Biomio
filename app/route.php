<?php
/*
	Routes
	controller needs to be registered in dependency.php
*/

use \Slim\Http\Uri;

$app->get('/', 'App\Controllers\IndexController:dispatch')->setName('index');

//for testing purposes
$app->get('/tryx[/{wow}[/{xx}]]', 'App\Controllers\UserController:tryx')->setName('tryx');


$app->group('/splash/', function() use ($app){
    /*
    Require full re-implementration for splash.php
    */
    $app->post('not_implemented', 'App\Controllers\SplashController:not_implemented');
    $app->get('not_implemented', 'App\Controllers\SplashController:not_implemented');
});

$app->group('/invite/', function() use ($app){
    $app->post('googleapp_invitation', 'App\Controllers\InviteController:googleapp_invitation');
    $app->get('googleappinvite[/{name}[/{email}]]', 'App\Controllers\InviteController:send_invitation');
});

$app->group('/commands/',function() use ($app){

    $app->post('get_user[/{email}]','App\Controllers\CommandController:get_user');
    $app->post('verify_service[/{code}[/{probe_id}]]','App\Controllers\CommandController:verify_service');
    $app->post('register_biometrics[/{code}[/{biometrics}]]','App\Controllers\CommandController:register_biometrics');
    $app->post('bioauth[/{code}[/{email}]]','App\Controllers\CommandController:bioauth');
    $app->post('save_log[/{application_id}]','App\Controllers\CommandController:save_log');
    $app->post('get_client_info[/{public_key}]','App\Controllers\CommandController:get_client_info');
    $app->post('test[/{email}]','App\Controllers\CommandController:test');

});

$app->group('/domain/', function() use ($app){
   $app->post('create','App\Controllers\DomainController:create');
   $app->post('verify','App\Controllers\DomainController:verify');
   $app->post('createScreenshot','App\Controllers\DomainController:createScreenshot');

});

$app->group('/upload/',function() use ($app){
    $app->post('profilePictureWebcam','App\Controllers\UploadController:profilePictureWebcam');
    $app->post('profilePictureUpload','App\Controllers\UploadController:profilePictureUpload');
    $app->post('profilePictureDelete','App\Controllers\UploadController:profilePictureDelete');
    $app->post('providerLogoUpload','App\Controllers\UploadController:providerLogoUpload');
    $app->post('providerLogoDelete','App\Controllers\UploadController:providerLogoDelete');
    $app->post('locationPictureUpload','App\Controllers\UploadController:locationPictureUpload');
    $app->post('locationPictureDelete','App\Controllers\UploadController:locationPictureDelete');
});

$app->group('/captcha/', function() use ($app){
    $app->post('create_image','App\Controllers\CaptchaController:create_image');
    $app->post('check_code','App\Controllers\CaptchaController:check_code');
});

$app->group('/provider/', function() use ($app){

    $app->post('register','App\Controllers\ProviderController:register');
    $app->post('load_providers','App\Controllers\ProviderController:load_providers');
    $app->post('provider_info','App\Controllers\ProviderController:provider_info');
    $app->post('update_info','App\Controllers\ProviderController:update_info');
    $app->post('save_website','App\Controllers\ProviderController:save_website');
    $app->post('load_websites','App\Controllers\ProviderController:load_websites');
    $app->post('delete_website','App\Controllers\ProviderController:delete_website');
    $app->post('load_provider_users','App\Controllers\ProviderController:load_provider_users');
    $app->post('add_provider_user','App\Controllers\ProviderController:add_provider_user');
    $app->post('delete_provider_user','App\Controllers\ProviderController:delete_provider_user');

});


$app->group('/login/',function() use($app){


    $app->get('openId','App\Controllers\UserController:openid_login');

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

    // ------- Other cool stuff ---------
    $app->post('contact','App\Controllers\UserController:contact');
    $app->post('change_type','App\Controllers\UserController:change_type');
    $app->post('logout','App\Controllers\UserController:logout');

    // -------- Phone registration ----------
    $app->post('get_phones','App\Controllers\UserController:get_phones');
    $app->post('send_phone_verification_code','App\Controllers\UserController:send_phone_verification_code');
    $app->post('verify_phone_code','App\Controllers\UserController:verify_phone_code');
    $app->post('delete_phone','App\Controllers\UserController:delete_phone');

     // User Services
    // --- Applications --- //
    $app->post('get_mobile_devices','App\Controllers\UserController:get_mobile_devices');
    $app->post('add_mobile_device','App\Controllers\UserController:add_mobile_device');
    $app->post('generate_qr_code','App\Controllers\UserController:generate_qr_code');
    $app->post('generate_biometrics_code','App\Controllers\UserController:generate_biometrics_code');

    /* Warning: Following Legacy implementations has of methods with possible errors */
    $app->post('rename_mobile_device','App\Controllers\UserController:rename_mobile_device');
    $app->post('delete_mobile_device','App\Controllers\UserController:delete_mobile_device');
    $app->post('get_biometrics','App\Controllers\UserController:get_biometrics');

     // --- Chrome Extention --- //
    $app->post('get_user_extensions','App\Controllers\UserController:get_user_extensions');
    $app->post('get_user_emails','App\Controllers\UserController:get_user_emails');
    $app->post('add_email','App\Controllers\UserController:add_email');
    $app->post('delete_email','App\Controllers\UserController:delete_email');
    $app->post('generate_image_code','App\Controllers\UserController:generate_image_code');

     // ------ //
    $app->post('check_code_status','App\Controllers\UserController:check_code_status');
    $app->post('code_verified','App\Controllers\UserController:code_verified');
    $app->post('send_email_verification_code','App\Controllers\UserController:send_email_verification_code');
    $app->post('verify_email','App\Controllers\UserController:verify_email');
    $app->post('verify_extention','App\Controllers\UserController:verify_extention');
    $app->post('get_extension_settings','App\Controllers\UserController:get_extension_settings');
    $app->post('change_extention_settings','App\Controllers\UserController:change_extention_settings'); //<--need more improvement there's curl
    $app->post('check_status','App\Controllers\UserController:check_status');

     /* Gate */
    $app->post('get_gate_keys','App\Controllers\UserController:get_gate_keys');

     /* API */
    $app->post('get_api_keys','App\Controllers\UserController:get_api_keys');
    $app->post('generate_api_key','App\Controllers\UserController:generate_api_key');
    $app->post('delete_api_key','App\Controllers\UserController:delete_api_key');

});