<?php

namespace App\Models;

use ORM;

class User
{


    public static function check_email($email)
    {
        $email = ORM::for_table('Emails')->where('email', $email)->find_one();
        if (!$email) {
            return false;
        }
        return $email;
    }


    public static function add_profile($first_name, $last_name, $email, $type, $ip, $extention, $gateUri)
    {

        $profile = ORM::for_table('Profiles')->create();
        $profile->last_ip = $ip;
        $profile->type = $type;
        $profile->save();

        $userInfo = ORM::for_table('UserInfo')->create();
        $userInfo->profileId = $profile->id();
        $userInfo->firstName = $first_name;
        $userInfo->lastName = $last_name;
        $userInfo->save();

        $providerInfo = ORM::for_table('ProviderInfo')->create();
        $providerInfo->profileId = $profile->id();
        $providerInfo->save();

        $userEmail = ORM::for_table('Emails')->create();
        $userEmail->profileId = $profile->id();
        $userEmail->email = $email;
        $userEmail->primary = 1;
        $userEmail->extention = $extention;
        $userEmail->save();

        $pgpKeysData = ORM::for_table('PgpKeysData')->create();
        $pgpKeysData->user = $profile->id();
        $pgpKeysData->email = $email;
        $pgpKeysData->save();

        //legacy things
       // $url = 'http://10.209.33.61:90/new_email/' . $email;
        $url = $gateUri.'/new_email/' . $email;
        Helper::send_post($url);

        return $profile->id();
    }


    public static function select_temp_login_codes($code)
    {
        return ORM::for_table('TempLoginCodes')->where(['code' => $code, 'status' => 1])->find_one();
    }


    public static function insert_temp_login_codes($profileId, $code)
    {
        $tempLoginCode = ORM::for_table('TempLoginCodes')->create();
        $tempLoginCode->profileId = $profileId;
        $tempLoginCode->code = $code;
        $tempLoginCode->set_expr('date_created', 'NOW()');
        $tempLoginCode->save();
        return $tempLoginCode->id();
    }


    public static function update_user($profileId, $fieldname, $value)
    {
        $profile = ORM::for_table('Profiles')->where('id', $profileId)->find_one();
        if ($profile) {
            $profile->set($fieldname, $value);
            $profile->save();
        }
        return $profile;
    }

    /**
     * @param $profileId
     * @return array|\IdiormResultSet
     */
    public static function get_phones($profileId)
    {
        return ORM::for_table('Phones')->where('profileId', $profileId)->find_many();
    }

    public static function get_user_info_shitty($profileId)
    {
        return ORM::for_table('UserInfo')->where('profileId', $profileId)->find_one();
    }

    public static function update_user_info($profileId,$field,$value){
        $userInfo = ORM::for_table('UserInfo')->where('profileId',$profileId)->find_one();
        $userInfo->set($field,$value);
        $userInfo->save();
        return $userInfo;
    }

    public static function update_verification_codes($status, $profileId, $application)
    {
        $verificationCode = ORM::for_table('VerificationCodes')
            ->where(['status' => $status, 'profileId' => $profileId, 'application' => $application])
            ->find_one();

        if ($verificationCode) {
            $verificationCode->set('status', $status);
            $verificationCode->save();
        }
        return $verificationCode;
    }

    public static function update_verification_code_status($status,$code)
    {
        $verificationCode = ORM::for_table('VerificationCodes')
            ->where('code',$code)
            ->find_one();

        if ($verificationCode) {
            $verificationCode->set('status', $status);
            $verificationCode->save();
        }
        return $verificationCode;
    }

    public static function select_verification_code($code)
    {
        return ORM::for_table('VerificationCodes')->where('code', $code)->find_one();
    }



    public static function select_verification_code_with_status_above($code,$status=0)
    {
        return ORM::for_table('VerificationCodes')
            ->where('code', $code)
            ->where_raw('`status` > ?',[$status])
            ->find_one();
    }

    public static function select_verification_code_with_profileId_status_above($code,$profileId,$status=0)
    {
        return ORM::for_table('VerificationCodes')
            ->where('code', $code)
            ->where('profileId', $profileId)
            ->where_raw('`status` > ?',[$status])
            ->find_one();
    }



    public static function insert_verification_codes($profileId, $device_id, $application, $status, $code)
    {
        $verificationCode = ORM::for_table('VerificationCodes')->create();
        $verificationCode->profileId = $profileId;
        $verificationCode->device_id = $device_id;
        $verificationCode->application = $application;
        $verificationCode->status = $status;
        $verificationCode->code = $code;
        $verificationCode->set_expr('date_created', 'NOW()');
        $verificationCode->save();
        return $verificationCode->id();
    }


    public static function find_user($fieldname, $value)
    {
        return ORM::for_table('Profiles')->where($fieldname, $value)->find_one();
    }

    public static function get_user_info($profileId)
    {
        return ORM::for_table('UserInfo')->where('profileId', $profileId)->find_one();
    }


    public static function update_profile($index, $value, $profileId)
    {

        if ($index == 'training') {
            $userProfile = ORM::for_table('Profiles')->where('id', $profileId)->find_one();
            if ($userProfile) {
                $userProfile->training = $value;
                $userProfile->save();
            }
            return $userProfile;
        }

        $userInfo = ORM::for_table('UserInfo')->where('profileId', $profileId)->find_one();
        if ($userInfo) {
            switch ($index) {
                case 'first_name':
                    $userInfo->firstName = $value;
                    break;
                case 'last_name':
                    $userInfo->lastName = $value;
                    break;
            }
            $userInfo->save();
        }
        return $userInfo;

    }

    public static function select_temp_login_phone($profileId, $phone)
    {
        return ORM::for_table('Phones')->where(['profileId' => $profileId, 'phone' => $phone])->find_one();
    }


    public static function update_temp_login_code($profileId, $status)
    {
        $tempLoginCode = ORM::for_table('TempLoginCodes')->where('profileId', $profileId)->find_one();
        $tempLoginCode->status = $status;
        $tempLoginCode->save();
        return $tempLoginCode;
    }

    public static function select_temp_login_email($profileId, $email)
    {
        //TODO:find out is there need to find many
        return ORM::for_table('Emails')->where(['profileId' => $profileId, 'email' => $email])->find_one();
    }

    public static function select_temp_login_code($profileId, $code)
    {
        return ORM::for_table('TempLoginCodes')->where(['profileId' => $profileId, 'code' => $code, 'status' => 1])->find_one();
    }

    public static function get_profile($profileId)
    {
        return ORM::for_table('Profiles')->where('id', $profileId)->find_one();
    }

    public static function check_temp_phone_codes($code)
    {
        return ORM::for_table('TempPhoneCodes')->where(['code' => $code, 'status' => 1])->find_one();
    }

    public static function update_temp_phone_codes($profileId, $status)
    {
        //TODOs: may it need to use raw query
        $tempPhoneCodes = ORM::for_table('TempPhoneCodes')->where('profileId', $profileId)->find_many();
        foreach ($tempPhoneCodes as $tempPhoneCode) {
            $tempPhoneCode->status = $status;
            $tempPhoneCode->save();
        }

    }


    public static function insert_temp_phone_codes($profileId, $code, $phone)
    {
        $tempPhoneCode = ORM::for_table('TempPhoneCodes')->create();
        $tempPhoneCode->profileId = $profileId;
        $tempPhoneCode->code = $code;
        $tempPhoneCode->phone = $phone;
        $tempPhoneCode->set_expr('date_created', 'NOW()');
        $tempPhoneCode->save();
        return $tempPhoneCode->id();

    }

    /**
     * @param $profileId
     * @param $code
     * @return array|\IdiormResultSet
     */
    public static function select_temp_phone_codes($profileId, $code)
    {
        return ORM::for_table('TempPhoneCodes')
            ->raw_query('SELECT * FROM TempPhoneCodes WHERE profileId = :profileId AND code = :code AND status = 1 AND date_created > DATE_SUB(now(), INTERVAL 15 MINUTE)', array('profileId' => $profileId, 'code' => $code, 'status' => 1))
            ->find_many();
    }

    public static function add_phone($profileId, $phoneNum)
    {
        $phone = ORM::for_table('Phones')->create();
        $phone->profileId = $profileId;
        $phone->phone = $phoneNum;
        $phone->save();

        return $phone;
    }

    public static function delete_phone($profileId, $phone)
    {
        return ORM::for_table('Phones')->where(['profileId' => $profileId, 'phone' => $phone])->delete();
    }


    // User Services
    // --- Applications --- //
    /**
     * @param $profileId
     * @return array|\IdiormResultSet
     */
    public static function get_mobile_devices($profileId)
    {
        return ORM::for_table('UserServices')->where(['profileId' => $profileId, 'serviceId' => 1])->find_many();
    }


    public static function add_mobile_device($profileId, $name)
    {
        $userService = ORM::for_table('UserServices')->create();
        $userService->profileId = $profileId;
        $userService->serviceId = 1;
        $userService->title = $name;
        $userService->save();

        return $userService->id();
    }

    public static function rename_mobile_device($profileId, $device_id, $title)
    {
        /*
           Legacy implementation has an error!
           We select from UserServices by `id`, using variable named `$device_id`,
           so primary key for UserServices cannot be an device_id respectively.
        */

        $userServices = ORM::for_table('UserServices')->where(['profileId' => $profileId, 'id' => $device_id])->find_many();
        foreach ($userServices as $userService) {
            $userService->title = $title;
            $userService->save();
        }

    }


    public static function delete_mobile_device($profileId, $device_id)
    {


        $userServices = ORM::for_table('UserServices')->where(['profileId' => $profileId, 'id' => $device_id])->find_many();

        foreach ($userServices as $userService) {
            $token = $userService->device_token;

            $us=ORM::for_table('UserServices')->where(['profileId' => $profileId, 'id' => $device_id])->find_one();
	    $us->delete();

           $app_uinf=ORM::for_table('application_userinformation')->where('application', $token)->find_one();
	   $app_uinf->delete();

           $apps=ORM::for_table('Applications')->where('app_id', $token)->find_one();
	   $apps->delete();

            save_log('Applications', $token);
        }

    }


    public static function get_biometrics($profileId, $biometrics)
    {
        /*
          TODO: requires debug for incomming $biometrics value
          meanwhile legacy implementation has an security issues, near SELECT:
         "SELECT $biometrics FROM UserInfo WHERE profileId = :profileId"
        */

        return ORM::for_table('UserInfo')->select($biometrics)->where('profileId', $profileId)->find_one();
    }

    // --- Chrome Extention --- //


    /**
     * @param $profileId
     * @return array|\IdiormResultSet
     */
    public static function get_user_extensions($profileId)
    {
        return ORM::for_table('UserServices')->where(['profileId' => $profileId, 'serviceId' => 2])->find_many();
    }

    public static function count_user_extensions($profileId)
    {
        return ORM::for_table('UserServices')->where(['profileId' => $profileId, 'serviceId' => 2])->count();
    }

    public static function get_user_emails($profileId)
    {
        return ORM::for_table('Emails')->where('profileId', $profileId)->find_many();
    }


    public static function add_gmail_email($profileId, $email)
    {
        $email = ORM::for_table('Emails')->create();
        $email->profileId = $profileId;
        $email->email = $email;
        $email->set_expr('date_created', 'NOW()');
        $email->save();

        return $email->id();
    }

    /**
     * This may be silly,
     * but this legacy method repeat add_gmail_email method fully
     *  TODO: Delete obsolete method
     *
     * @param $profileId
     * @param $email
     * @return array|null
     */
    public static function add_not_gmail_email($profileId, $email)
    {
        return self::add_gmail_email($profileId, $email);
    }

    public static function delete_email($profileId, $email)
    {

        ORM::for_table('Emails')->where(['profileId' => $profileId, 'email' => $email])->delete();
        ORM::for_table('PgpKeysData')->where(['user' => $profileId, 'email' => $email])->delete();

        self::save_log('PgpKeysData', $email);
    }

    function save_log($table_name, $record_id)
    {
        $log = ORM::for_table('UILog')->create();
        $log->table_name = $table_name;
        $log->record_id = $record_id;
        $log->set_expr('change_time', 'NOW()');
        $log->save();
    }



    public static function update_temp_email_codes($profileId, $status)
    {
        $emailTempCodes = ORM::for_table('TempEmailCodes')->where(['profileId' => $profileId, 'status' => 1])->find_many();

        foreach ($emailTempCodes as $emailTempCode) {
            $emailTempCode->status = $status;
            $emailTempCode->save();
        }
    }


    public static function insert_temp_email_codes($profileId, $code, $email)
    {
        $emailTempCode = ORM::for_table('TempEmailCodes')->create();
        $emailTempCode->profileId = $profileId;
        $emailTempCode->code = $code;
        $emailTempCode->email = $email;
        $emailTempCode->set_expr('date_created', 'NOW()');
        $emailTempCode->save();
    }


    /**
     * @param $profileId
     * @param $email
     * @param $code
     * @return array|\IdiormResultSet
     */
    public static function select_temp_email_codes($profileId, $email, $code)
    {
        return ORM::for_table('TempEmailCodes')->where(['profileId' => $profileId, 'email' => $email, 'code' => $code, 'status' => 1])->find_many();
    }

    public static function update_email($profileId, $email, $field, $value)
    {
        $emails = ORM::for_table('Emails')->where(['profileId' => $profileId, 'email' => $email])->find_many();

        foreach ($emails as $email) {
            $email->set($field, $value);
            $email->save();
        }
    }


    public static function get_extension_settings($profileId)
    {
        return ORM::for_table('Extension_Settings')->where('profileId', $profileId)->find_one();
    }

    public static function save_extension_settings($profileId, $settings)
    {
        $extensionSetting = ORM::for_table('Extension_Settings')->where('profileId', $profileId)->find_one();
        $extensionSetting->settings = $settings;
        $extensionSetting->save();
    }

    public static function insert_extension_settings($profileId, $settings)
    {
        $extensionSetting = ORM::for_table('Extension_Settings')->create();
        $extensionSetting->settings = $settings;
        $extensionSetting->save();
    }

    /* API */

    public static function select_api_keys($field, $value)
    {
        return ORM::for_table('ProviderKeys')->where($field, $value)->find_many();
    }

    public static function save_api_keys($providerId, $pub, $priv)
    {
        $keys = ORM::for_table('ProviderKeys')->create();
        $keys->providerId = $providerId;
        $keys->public_key = $pub;
        $keys->private_key = $priv;
        $keys->save();
    }

    /**
     *
     * Original Legacy method has an error ($profileId not $providerId in parameter list )
     * @param $profileId
     * @param $key
     * @return bool
     */
    public static function delete_api_key($providerId, $key)
    {
        return ORM::for_table('ProviderKeys')->where(['providerId' => $providerId, 'key' => $key])->delete();

    }

}


