<?php

namespace App\Controllers;

use Psr\Log\LoggerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \App\Models\User as User;

//TODO: move to separate model
use ORM;

final class ProviderController
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


    public function dispatch(Request $request, Response $response, $args)
    {
        $this->logger->info("Provider Index page action dispatched");

        $this->renderer->render($response, '/provider_index.php');
        return $response;
    }


    public function get_session(Request $request, Response $response, $args)
    {

        if (!isset($_SESSION['id'])) {
            return $response->withRedirect('../index#signup');
        }

        $providerId = $request->getAttribute('provider_id');
        $profileId = $_SESSION['id'];

        $providerAdmin = \ORM::for_table('ProviderAdmins')
            ->where(['providerId' => $providerId, 'profileId' => $profileId])
            ->find_one();

        if (!$providerAdmin) {
            return $response->withRedirect('../index#signup');
        }

        $_SESSION['providerId'] = $providerId;
        return $response->withRedirect('../index#provider-info');
    }


    public function register(Request $request, Response $response, $args)
    {

        if ($this->session->get('id') === null)
            return $response->write('#session');


        $name = $request->getParam('name');
        $ein = $request->getParam('ein');
        $email = $request->getParam('email');
        $phone = $request->getParam('phone');
        $address = json_encode($request->getParam('address'));


        $provider = ORM::for_table('Providers')->create();
        $provider->name = $name;
        $provider->ein = $ein;
        $provider->phone = $phone;
        $provider->email = $email;
        $provider->address = $address;
        $provider->save();

        $providerId = $provider->id();

        $providerAdmin = ORM::for_table('ProviderAdmins')->create();
        $providerAdmin->profileId = $this->session->id;
        $providerAdmin->providerId = $providerId;
        $providerAdmin->save();

        $this->session->providerId = $providerId;

        return $response->write('#success');

    }

    public function load_providers(Request $request, Response $response, $args)
    {

        if ($this->session->get('id') === null)
            return $response->write('#session');

        $profileId = $this->session->id;

        $results = ORM::for_table('ProviderAdmins')
            ->table_alias('pa')
            ->select('p.id', 'providerId')
            ->select('p.name', 'providerName')
            ->join('Providers', array('pa.providerId', '=', 'p.id'), 'p')
            ->where('pa.profileId', $profileId)
            ->find_many();

        $data = array();
        foreach ($results as $result) {
            $data[] = array('id' => $result->providerId, 'name' => $result->providerName);
        }

        return $response->write(json_encode($data));

    }

    public function provider_info(Request $request, Response $response, $args)
    {

        if (($this->session->get('id') === null) || ($this->session->get('providerId') === null))
            return $response->write('#session');

        $provider = ORM::for_table('Providers')->where('id', $this->session->providerId)->find_one();

        $data = array(
            'id' => $provider->id,
            'name' => $provider->name,
            'address' => json_decode($provider->address),
            'ein' => $provider->ein,
            'phone' => $provider->phone,
            'email' => $provider->email,
        );

        return $response->write(json_encode($data));

    }


    public function update_info(Request $request, Response $response, $args)
    {

        if (($this->session->get('id') === null) || ($this->session->get('providerId') === null))
            return $response->write('#session');

        $profileId = $this->session->id;
        $providerId = $this->session->providerId;


        $providerAdmin = ORM::for_table('ProviderAdmins')->where(['providerId' => $providerId, 'profileId' => $profileId])->find_one();
        if (!$providerAdmin)
            return $response->write('#session');

        $provider = ORM::for_table('Providers')->where('id', $providerId)->find_one();
        $provider->name = $request->getParam('name');
        $provider->ein = $request->getParam('ein');
        $provider->email = $request->getParam('email');
        $provider->phone = $request->getParam('phone');
        $provider->address = json_encode($request->getParam('address'));

        $provider->save();

        return $response->write('#success');

    }


    public function save_website(Request $request, Response $response, $args)
    {

        if (($this->session->get('id') === null) || ($this->session->get('providerId') === null))
            return $response->write('#session');


        $domain = $request->getParam('domain');

        $webResource = ORM::for_table('WebResources')->where('domain', $domain)->find_one();
        if ($webResource)
            return $response->write('#exist');

        $webResource = ORM::for_table('WebResources')->create();
        $webResource->title = $request->getParam('title');
        $webResource->domain = $domain;
        $webResource->hook = $request->getParam('hook');
        $webResource->providerId = $this->session->providerId;
        $webResource->save();

        return $response->write($webResource->id());

    }

    public function load_websites(Request $request, Response $response, $args)
    {

        if (($this->session->get('id') === null) || ($this->session->get('providerId') === null))
            return $response->write('#session');

        $providerId = $this->session->providerId;

        $webResources = ORM::for_table('WebResources')->where('providerId', $providerId)->find_many();

        $data = array();
        foreach ($webResources as $webResource) {
            $data[] = array(
                'id' => $webResource->id,
                'title' => $webResource->title,
                'domain' => $webResource->domain,
                'hook' => $webResource->hook
            );
        }

        return $response->write(json_encode($data));

    }

    public function delete_website(Request $request, Response $response, $args)
    {
        if (($this->session->get('id') === null) || ($this->session->get('providerId') === null))
            return $response->write('#session');

        $providerId = $this->session->providerId;
        $id = $request->getParam('id');

        $webResource = ORM::for_table('WebResources')->where(['id' => $id, 'providerId' => $providerId])->find_one();
        $webResource->delete();
    }


    public function load_provider_users(Request $request, Response $response, $args)
    {

        if (($this->session->get('id') === null) || ($this->session->get('providerId') === null))
            return $response->write('#session');

        $providerId = $this->session->providerId;

        //load_provider_users - from Provider::
        $results = ORM::for_table('ProviderUsers')
            ->table_alias('p')
            ->select('p.*')
            ->join('Emails', array('e.profileId', '=', 'p.user_id'), 'e')
            ->join('UserInfo', array('u.profileId', '=', 'p.user_id'), 'u')
            ->where(['e.primary' => 1, 'p.provider_id' => $providerId])
            ->find_many();

        $data = array();
        foreach ($results as $result) {
            $data[] = array(
                'id' => $result->user_id,
                'first_name' => $result->firstName,
                'last_name' => $result->lastName,
                'email' => $result->email,
                'status' => $result->status
            );
        }

        return $response->write(json_encode($data));

    }

    //TODO: move this to model or helper
    private function _check_provider_user($providerId, $userId)
    {
        return ORM::for_table('ProviderUsers')->where(['provider_id' => $providerId, 'user_id' => $userId])->find_one();
    }

    //TODO: may require some checks
    public function add_provider_user(Request $request, Response $response, $args)
    {
        if (($this->session->get('id') === null) || ($this->session->get('providerId') === null))
            return $response->write('#session');

        $user_email = $request->getParam('user_email');

        $providerId = $this->session->providerId;


        $email = User::check_email($user_email);
        if (!$email)
            return $response->write('#not-found');


        $userId = $email->profileId;

        $providerUser = $this->_check_provider_user($providerId, $userId);


        if ($userId == $this->session->id) {
            return $response->write('#mine');
        } elseif (!$providerUser) {

            $pUser = ORM::for_table('ProviderUsers')->create();
            $pUser->provider_id = $providerId;
            $pUser->user_id = $userId;
            $pUser->status = 'invitation';
            $pUser->save();

            return $response->write('#invited');
        } else {
            return $response->write('#exists');
        }

    }

    public function delete_provider_user(Request $request, Response $response, $args)
    {

        if (($this->session->get('id') === null) || ($this->session->get('providerId') === null))
            return $response->write('#session');

        $userId = $request->getParam('userId');
        $providerId = $this->session->id;


        $providerUser = $this->_check_provider_user($providerId, $userId);
        if (!$providerUser)
            return $response->write('#wrong-user');


        $providerUser = ORM::for_table('ProviderUsers')->where(['provider_id' => $providerId, 'user_id' => $userId])->find_one();
        $providerUser->delete();

        return $response->write('#success');


    }


}
