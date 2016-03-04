<?php
namespace Models;

use ORM;
use Slim\Slim;

class User {

    /**
     * Update user info
     * @param $profileId
     * @param $data
     * @return bool|ORM
     */
    public static function update($profileId, $data) {
        $user = ORM::for_table('UserInfo')->where('profileId', $profileId)->find_one();

        if (!$user) {
            return false;
        }

        if (isset($data['first_name'])) {
            $user->firstName = $data['first_name'];
        }

        if (isset($data['last_name'])) {
            $user->lastName = $data['last_name'];
        }

        $user->save();

        return $user;
    }

    /**
     * Add new device (mobile application)
     * @param $profileId
     * @param $deviceName
     * @return array|null
     */
    public static function addDevice($profileId, $deviceName) {
        $userService = ORM::for_table('UserServices')->create();

        $userService->profileId = $profileId;
        $userService->serviceId = 1; // ?
        $userService->title = $deviceName;
        $userService->save();

        return $userService->id();
    }

    /**
     * Create and save in database verification code to verify new devices
     * @param $profileId
     * @param $deviceId
     * @return string
     */
    public static function createVerificationCode($profileId, $deviceId) {

        $vc = ORM::for_table('VerificationCodes')
            ->where(["profileId" => $profileId, "application" => 1])
            ->find_many();

        if ($vc) {
            $vc->status = 0;
            $vc->save();
        }

        // get device_token

        $us = ORM::for_table('UserServices')
            ->where(["profileId" => $profileId, "serviceId" => 1, "id" => $deviceId])
            ->find_one();

        $result = $pdo->prepare("SELECT id, title, status, device_token FROM UserServices WHERE profileId = :profileId AND serviceId = 1");
        $result->execute(array('profileId'=>$profileId));
        foreach ($result as $row) {
            if ($row['id'] == $device_id)
                $key = $row['device_token'];
        }

        $deviceToken = $us->device_token;

        do {
            $code = Helper::genCode();
            $result = ORM::for_table('VerificationCodes')->where(["code" => $code])->find_one();
        } while ($result);

        $newCode = ORM::for_table('VerificationCodes')->create();
        $newCode->profileId = $profileId;
        $newCode->device_id = $deviceId;
        $newCode->application = 1;
        $newCode->status = 1;
        $newCode->code = $code;
        $newCode->save();

        return $code;
    }

    public static function createBiometricsVerificationCode($profileId, $deviceId) {
        $vc = ORM::for_table('VerificationCodes')
            ->where(["profileId" => $profileId, "application" => 1])
            ->find_many();

        if ($vc) {
            $vc->status = 0;
            $vc->save();
        }

        do {
            $code = Helper::genCode();
            $result = ORM::for_table('VerificationCodes')->where(["code" => $code])->find_one();
        } while ($result);

        $newCode = ORM::for_table('VerificationCodes')->create();
        $newCode->profileId = $profileId;
        $newCode->device_id = $deviceId;
        $newCode->application = 1;
        $newCode->status = 1;
        $newCode->code = $code;
        $newCode->save();

        return $code;
    }

    /**
     * Return user's primary email
     * @param $profileId
     * @return bool|ORM
     */
    public static function getPrimaryEmail($profileId) {

        $result = ORM::for_table('Emails')
            ->where(["profileId" => $profileId, "primary" => 1])
            ->find_one();

        return $result->email;
    }

}
