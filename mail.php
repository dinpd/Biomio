<html>
<head>
<title>nixCraft PHP: Test mail() </title>
</head>
<body>
<?php
if(isset($_POST['mail'])){
$mail = trim($_POST['mail']);
}else{
$mail = 'test@test.com';
};
?>

<form method=POST>
<input type=text value="<?php echo $mail;?> " name=mail />
<input type=submit>
</form>
<?php
if(!strpos($mail,'@'))
die('wrong format');

$email = $mail;
//$email = "h8221@trbvo.com";
$subject = "Test2: Happy Birthday!";
$msg = "from biomio: Wishing you all the great things in life, hope this day will bring you an extra share of all that makes you happiest.";
try{
if($mail != 'test@test.com'){
$sent = mail($email,$subject,$msg);

if($sent){
  echo "Mail sent.";
}else{
  echo "Mail sending failed."; 
}

}
}catch(Exception $e){
print_r($e);
}
?>
</body>
</html>