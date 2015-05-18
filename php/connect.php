<?php 
	//$db_conx = mysql_connect ("localhost", "biomio_alex", "uFa-rEm-6a8-fuD")
	//or die (mysql_error());
	//mysql_select_db("biomio_website", $db_conx);

	$db_conx = mysqli_connect ("localhost", "biom_admin", "uFa-rEm-6a8-fuD", "biom_website")
	or die (mysqli_connect_error());

	$pdo = new PDO('mysql:dbname=biom_website;host=localhost', 'biom_admin', 'uFa-rEm-6a8-fuD');
