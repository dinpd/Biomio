<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

include ('../php/connect.php');
require ('../php/controllers/SessionController.php');

$code = $_GET['code'];
$state = $_GET['state'];

//echo $code . '<br>';

$request = array();
$request['client_id'] = '56ce9a6a93c17d2c867c5c293482b8f9';
$request['client_secret'] = '85a879a19387afe791039a88b354a374';
$request['grant_type'] = 'authorization_code';
$request['code'] = $code;
$request['redirect_uri'] = 'https://biom.io/provider/login.php';

// Send request
$url = "http://biom.io:5001/user/token";    
$content = json_encode($request);
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER,
        array("Content-type: application/json"));
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $content);

$json_response = curl_exec($curl);

$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

if ( $status != 200 ) {
    die("Error: call to URL $url failed with status $status, response $json_response, curl_error " . curl_error($curl) . ", curl_errno " . curl_errno($curl));
}

$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

curl_close($curl);
$response = json_decode($json_response, true);

//print_r($response);
//echo '<br>HTTP code: ' . $httpcode . '<br>';

$id_token = $response['id_token'];
$id_token = explode(".", $id_token);
//echo $id_token[1] . '<br>';

$id_token = json_decode(base64_decode($id_token[1]));
//print_r($id_token);
//print_r ($id_token);
$email = $id_token->sub;

// login user with this email
$result = $pdo->prepare("SELECT profileId FROM Emails WHERE email = :email");
$result->execute(array('email'=>$email));
$row = $result->fetch();
$profileId = $row['profileId'];

$result = $pdo->prepare("SELECT * FROM UserInfo WHERE profileId = :profileId");
$result->execute(array('profileId'=>$profileId));
$row = $result->fetch();
$first_name = $row['firstName'];
$last_name = $row['lastName'];

$result = $pdo->prepare("SELECT * FROM Profiles WHERE id = :profileId");
$result->execute(array('profileId'=>$profileId));
$row = $result->fetch();
$type = $row['type'];

SessionController::start_session($profileId, $type, $first_name, $last_name);

// redirect user to the right place

//echo $email;

if ($profileId) {
?>
<script>
	window.opener.profileId = "<?php echo $profileId; ?>";
    window.opener.profileFirstName = "<?php echo $first_name; ?>";
    window.opener.profileLastName = "<?php echo $last_name; ?>";
    window.opener.profileType = "<?php echo $type; ?>";

    window.parent.provider_contact();

    //if (window.opener.hash != '') window.opener.location.href = './' + window.opener.hash;
    //else window.opener.location.href = './#user-info';

    

    window.close();
</script>
<?php
}
?>
