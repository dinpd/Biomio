<?php
namespace Models;

use ORM;
use Slim\Slim;

class Provider
{

    public static function getProviderByPublicKey($public_key) {

        $result = ORM::for_table('ProviderKeys')->where('public_key', $public_key)->find_one();

        if ($result) {
            return $result;
        } else {
            return null;
        }
    }

    public static function addUser($provider_id, $user_id) {
        $result = ORM::for_table('ProviderUsers')
            ->where(['provider_id' => $provider_id, 'user_id' => $user_id])
            ->find_one();

        if ($result) {
            return false; // user is already added
        } else {

            $user = ORM::for_table('ProviderUsers')->create();
            $user->provider_id = $provider_id;
            $user->user_id = $user_id;
            $user->save();

            return $user->id;
        }

    }

}
