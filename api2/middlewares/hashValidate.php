<?php
namespace Middleware;

use Models;

class HashMiddleware
{
    /**
     * Example middleware invokable class
     *
     * @param  \Psr\Http\Message\ServerRequestInterface $request  PSR7 request
     * @param  \Psr\Http\Message\ResponseInterface      $response PSR7 response
     * @param  callable                                 $next     Next middleware
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function __invoke($request, $response, $next)
    {
        $post = $request->getParsedBody();

        $provider = Models\Provider::getProviderByPublicKey($post['public_key']);

        if ($provider) {
            $hash = [];
            $hash['time'] = $post['time'];
            $hash['public_key'] = $post['public_key'];
            $hash['email'] = $post['email'];
            $hash = json_encode($hash);

            $hash = hash_hmac('sha256', $hash, $provider->private_key);

            if ($hash === $post['hash']) {
                $response = $next($request, $response);
            }
        }


        return $response;
    }
}