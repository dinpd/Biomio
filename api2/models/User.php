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

}
