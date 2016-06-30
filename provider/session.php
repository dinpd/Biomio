<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

require ('../php/connect.php');
session_start();

if (!isset($_GET['p']) || !isset($_SESSION['id'])) header( 'Location: ./#signup' );
else {

	$providerId = $_GET['p'];
	$profileId = $_SESSION['id'];

	$result = $pdo->prepare("SELECT * FROM ProviderAdmins WHERE providerId = :providerId AND profileId = :profileId");
	$result->execute(array('providerId'=>$providerId, 'profileId'=>$profileId));
	if ($result->rowCount() == 0) header( 'Location: ./#signup' );
	else {
		$_SESSION['providerId'] = $providerId;
		header( 'Location: ./#provider-info' );
	}

}