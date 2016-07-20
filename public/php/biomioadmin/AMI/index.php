<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>AMI | BIOMIO</title>
	<link rel="shortcut icon" href="favicon.ico" >
	<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
	<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">
	<link rel="stylesheet" href="../../js/libs/tableSorterStyles/blue/style.css">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
</head>
<body style="margin: 0 auto; text-align: center">

<div class="container well">

	<div class="row">
		<div>
			<h2>Applications Management Interface</h2>
		</div>
		<div class="panel-footer table-responsive">

			<?php
			include ('../../connect.php');

			ini_set('display_errors',1);
			ini_set('display_startup_errors',1);
			error_reporting(-1);

			$result = $pdo->prepare("SELECT * FROM Splash ORDER BY id DESC");
			$result->execute();

			echo "<table class='table table-striped panel tablesorter'>";
			echo 	"<thead>";
			echo 		"<th>Name</th>";
			echo 		"<th>Email</th>";
			echo 		"<th>Type</th>";
			echo 		"<th>Code</th>";
			echo 		"<th>Date</th>";
			echo 		"<th>Invitation</th>";

			echo 		"<th></th>";
			echo 	"</thead>";
			echo 	"</tbody>";
			foreach ($result as $row) {
				echo 	"<tr>";
				echo 		"<th>" . $row['name'] . "</th>";
				echo 		"<th>" . $row['email'] . "</th>";
				echo 		"<th>" . $row['type'] . "</th>";
				echo 		"<th>" . $row['code'] . "</th>";
				echo 		"<th>" . $row['date_created'] . "</th>";
				if ($row['invitation'] == 'no') {
					echo 		"<th><a href='http://www.biom.io/php/splash.php?u=" . $row['name'] . "&c=" . $row['code'] . "' class='btn btn-success btn-xs' role='button'>Send Invitation</a></th>";
				} else {
					echo 		"<th>" . $row['invitation'] . "</th>";
				}

				echo 		"<th>
						<button class='close' role='button'>&times;</button>
						<button class='btn btn-default btn-xs options no hide' role='button'>Cancel</button>
						<a href='http://www.biom.io/php/splash.php?u=" . $row['name'] . "&c=" . $row['code'] . "&d=1' class='btn btn-danger options btn-xs hide' role='button'>Delete</a>
					</th>";
				echo 	"</tr>";
			}
			echo 	"</tbody>";
			echo "</table>";

			?>
		</div>
	</div>
</div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
<script src="../../js/libs/jquery.tablesorter.min.js"></script>
<script>
	$(document).ready(function()
		{
			$(".table").tablesorter();
		}
	);
	$(document).on('click touchend', ".close", function () {
		$(this).addClass('hide');
		$(this).siblings('.options').removeClass('hide');
	});
	$(document).on('click touchend', ".no", function () {
		$(this).siblings('.close').removeClass('hide');
		$(this).siblings('.options').addClass('hide');
		$(this).addClass('hide');
	});
</script>
</body>
