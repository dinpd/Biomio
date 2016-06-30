<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

/*
$url = 'http://gb.vakoms.com:8888/new_email/qwerty2@gmail.com';
$data = array();

# Create a connection
$ch = curl_init($url);

# Form data string
$postString = http_build_query($data, '', '&');

echo ($url) . '<br>';
echo ($postString) . '<br>';

$c = curl_init();
curl_setopt($c, CURLOPT_URL, $url);
//curl_setopt($c, CURLOPT_RETURNTRANSFER,true);
curl_setopt($c, CURLOPT_POST, true);
curl_setopt($c, CURLOPT_POSTFIELDS, $postString);
$result=curl_exec ($c);

echo curl_exec($c) . '<br>';

if(curl_exec($c) === false) {
    echo "ok";
}
else {
    echo "error";
}

$response = get_web_page("http://gb.vakoms.com:8888/new_email/qwerty2@gmail.com");
$resArr = array();
$resArr = json_decode($response);
echo "<pre>"; print_r($resArr); echo "</pre>blablabla";

function get_web_page($url) {
    $options = array(
        CURLOPT_RETURNTRANSFER => true,   // return web page
        CURLOPT_HEADER         => false,  // don't return headers
        CURLOPT_FOLLOWLOCATION => true,   // follow redirects
        CURLOPT_MAXREDIRS      => 10,     // stop after 10 redirects
        CURLOPT_ENCODING       => "",     // handle compressed
        CURLOPT_USERAGENT      => "test", // name of client
        CURLOPT_AUTOREFERER    => true,   // set referrer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,    // time-out on connect
        CURLOPT_TIMEOUT        => 120,    // time-out on response
    ); 

    $ch = curl_init($url);
    curl_setopt_array($ch, $options);

    $content  = curl_exec($ch);

    curl_close($ch);

    return $content;
}

curl_close ($c);

/*
$url = 'http://gb.vakoms.com:8888/new_email/qwerty2@gmail.com';
print_r(get_headers($url));
print_r(get_headers($url, 1));*/

/*
$url = 'http://gb.vakoms.com:80/new_email/qwerty2@gmail.com';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HEADER, true);    // we want headers
curl_setopt($ch, CURLOPT_NOBODY, true);    // we don't need body
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_TIMEOUT,10);
$output = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo 'HTTP code: ' . $httpcode . '<br>';


$url = 'http://gb.vakoms.com/new_email/qwerty2@gmail.com';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HEADER, true);    // we want headers
curl_setopt($ch, CURLOPT_NOBODY, true);    // we don't need body
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_TIMEOUT,10);
$output = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo 'HTTP code: ' . $httpcode . '<br>';


$url = 'http://gb.vakoms.com';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HEADER, true);    // we want headers
curl_setopt($ch, CURLOPT_NOBODY, true);    // we don't need body
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_TIMEOUT,10);
$output = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo 'HTTP code: ' . $httpcode . '<br>';
*/


$url = 'http://10.209.33.61:90/set_condition/';
$url = 'http://gb.vakoms.com/new_email/qwerty2@gmail.com';
$url = 'http://gate.biom.io/training';
$url = 'https://10.209.33.61:90/set_condition/';
$data = array();

# Create a connection
$ch = curl_init($url);

# Form data string
$postString = http_build_query($data, '', '&');

# Setting our options
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postString);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

# Get the response
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo 'HTTP code: ' . $httpcode . '<br>';



$json = file_get_contents('https://10.209.33.61:90/set_condition/');
print_r ($json);
