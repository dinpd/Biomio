<?php
/*echo 'alexander.lomov1@gmail.com: ' . is_google_mx('gmail.com') . '<br/>';
echo 'andriy.lobashchuk@vakoms.com.ua: ' . is_google_mx('vakoms.com.ua') . '<br/>';
echo 'lomov@psu.edu: ' . is_google_mx('psu.edu') . '<br/>';
echo 'tuthm13@mail.ru: ' . is_google_mx('mail.ru') . '<br/>';

function is_google_mx($host) {
    $records = dns_get_record($host, DNS_MX);
    foreach ($records as $record) {
        if (substr(strtolower($record['target']), -11) == '.google.com') return true;
        if (substr(strtolower($record['target']), -15) == '.googlemail.com') return true;
    }
    return false;
}*/
require_once 'php/mandrill/Mandrill.php'; //Not required with Composer
/*
try {
    $mandrill = new Mandrill('vyS5QUBZJP9bstzF1zeVNA');
    $message = array(
        'html' => '<p><strong>BIOMIO</strong> HTML content</p>',
        'text' => 'BIOMIO text content',
        'subject' => 'example subject',
        'from_email' => 'test@biom.io',
        'from_name' => 'BIOMIO service',
        'to' => array(
            array(
                'email' => 'alexander.lomov1@gmail.com',
                'type' => 'to'
            )
        ),
        'important' => false,
        'track_opens' => null,
        'track_clicks' => null,
        'auto_text' => null,
        'auto_html' => null,
        'inline_css' => null,
        'url_strip_qs' => null,
        'preserve_recipients' => null,
        'view_content_link' => null,
        'tracking_domain' => null,
        'signing_domain' => null,
        'return_path_domain' => null,
        'merge' => true
    );
    $async = false;
    $ip_pool = 'Main Pool';

    //$send_at = date("Y-m-d H:i:s", time());
    //echo $send_at;
    $result = $mandrill->messages->send($message, $async, $ip_pool);
    print_r($result);

} catch(Mandrill_Error $e) {
    // Mandrill errors are thrown as exceptions
    echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
    // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    throw $e;
}
*/
?>


<?php
require_once 'php/mandrill/Mandrill.php';
try {
    $mandrill = new Mandrill('vyS5QUBZJP9bstzF1zeVNA');
    $message = array(
        'html' => $body,
        'subject' => $subject,
        'from_email' => $from,
        'from_name' => $from_name,
        'to' => array(
            array(
                'email' => $to,
                'type' => 'to'
            )
        ),   
    );
    $async = false;
    $result = $mandrill->messages->send($message, $async);
} catch(Mandrill_Error $e) {
    // Mandrill errors are thrown as exceptions
    //echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
    // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    //throw $e;
}
?>