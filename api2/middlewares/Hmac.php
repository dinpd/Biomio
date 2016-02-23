<?php

namespace Middlewares;

use Models;

class Hmac
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
        // digest = base64encode(hmac("sha256", "privateKey", "GET+/users/johndoe/financialrecords+20apr201312:59:24+123456"))
        // X-Authorization: hmac publicKey:nonce:digest

        $auth = $request->getHeaderLine('X-Authorization');

        if (empty($auth)) {
            return $response->withStatus(401)
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode(["message" => "X-Authorization header is required"]));
        }

        $auth = ltrim($auth, 'hmac ');
        $auth = ltrim($auth, 'HMAC ');

        list($publicKey, $nonce, $digest) = explode(':', $auth);

        if (empty($publicKey) || empty($nonce) || empty($digest)) {
            return $response->withStatus(401)
                ->withHeader('Access-Control-Allow-Origin', '*')
                ->withHeader('Content-Type', 'application/json')
                ->write(json_encode(["message" => "X-Authorization header is invalid"]));
        }

        /** check if digest is valid */
        $provider = Models\Provider::getProviderByPublicKey($publicKey);

        // test
        $request = $request->withAttribute('provider', $provider);
        return $response = $next($request, $response);

        if ($provider) {

            $trueDigest = $this->makeDigest($request, $nonce, $provider->private_key);

            if ($trueDigest === $digest) {
                $request = $request->withAttribute('provider', $provider);
                return $response = $next($request, $response);
            } else {
                $message = [
                    "message" => "Authorization is failed!"
                ];
                return $response
                    ->withStatus(401)
                    ->withHeader('Access-Control-Allow-Origin', '*')
                    ->withHeader('Content-Type', 'application/json')
                    ->write(json_encode($message));
            }
        }

        return $next($request, $response);

    }

    /**
     * Generate digest of data
     * hash = METHOD + URI + Body + nonce
     * @param $request
     * @param $nonce
     * @param $privateKey
     * @return string
     */
    private function makeDigest($request, $nonce, $privateKey) {
        $body = $request->getParsedBody();

        $hash = $request->getMethod();
        $hash .= $request->getUri();
        $hash .= json_encode($body);
        $hash .= $nonce;

        $digest = hash_hmac('sha256', $hash, $privateKey);

        return $digest;
    }

}