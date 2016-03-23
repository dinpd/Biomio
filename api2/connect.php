<?php

require "../connect.php";

	// PDO
	/*$dbhost = $_SERVER['RDS_HOSTNAME'];
	$dbport = $_SERVER['RDS_PORT'];
	$dbname = $_SERVER['RDS_DB_NAME'];

	$dsn = "mysql:host={$dbhost};port={$dbport};dbname={$dbname}";
	$username = $_SERVER['RDS_USERNAME'];
	$password = $_SERVER['RDS_PASSWORD'];

	$dbh = new PDO($dsn, $username, $password);*/
	// -- connect
	
/*
	$pdo = new PDO('mysql:dbname=biom_website;host=localhost', 'biom_admin', 'uFa-rEm-6a8-fuD');

	$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
*/
	// mysqli
	//$link = mysqli_connect($_SERVER['RDS_HOSTNAME'], $_SERVER['RDS_USERNAME'], $_SERVER['RDS_PASSWORD'], $_SERVER['RDS_DB_NAME'], $_SERVER['RDS_PORT']);
	// -- connect
/*
	$db_conx = mysqli_connect ("localhost", "biom_admin", "uFa-rEm-6a8-fuD", "biom_website")
	or die (mysqli_connect_error());
*/


/*

	$pdo = new PDO('mysql:dbname=biomio_db_test; host=6da7f2ba42c999a5da5b0937632bd595a03f65c1.rackspaceclouddb.com', 'biomio_admin', 'admin');

	$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// mysqli
	//$link = mysqli_connect($_SERVER['RDS_HOSTNAME'], $_SERVER['RDS_USERNAME'], $_SERVER['RDS_PASSWORD'], $_SERVER['RDS_DB_NAME'], $_SERVER['RDS_PORT']);
	// -- connect
	$db_conx = mysqli_connect ("6da7f2ba42c999a5da5b0937632bd595a03f65c1.rackspaceclouddb.com", "biomio_admin", "admin", "biomio_db_test")
	or die (mysqli_connect_error());

*/