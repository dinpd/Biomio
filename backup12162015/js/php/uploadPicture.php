<?php
if (isset($_POST['cmd'])) {
	switch ($_POST['cmd']) {
		// Option to upload/overwrite profile picture via webcam
		case 'profilePictureWebcam':
			$img = $_POST['file'];
			$img = str_replace('data:image/png;base64,', '', $img);
			$img = str_replace(' ', '+', $img);
			$data = base64_decode($img);
			$file = "../profileData/profilePicture/".$_POST['user'].".jpg";
			
			if (file_exists($file)) { unlink ($file); }

			$success = file_put_contents($file, $data);
			echo "Webcam upload Success";
		break;
		// Upload/overwrite profile picture as a file
		case 'profilePictureUpload':
			if ($_FILES["file"]["error"] > 0) //checks if theres a file
	  			echo "Error: " . $_FILES["file"]["error"] . "<br>";
	  		else if($_FILES["file"]["size"] < 500000) {
				$temp = explode(".", $_FILES["file"]["name"]);
				$extension = end($temp);
				move_uploaded_file($_FILES["file"]["tmp_name"], "../profileData/profilePicture/".$_POST['user'].".jpg");
				echo "Success";
			}
			else echo "file is too big";
		break;
		// Delete/overwrite profile picture as a file
		case 'profilePictureDelete':
			if (unlink("../profileData/profilePicture/".$_POST['user'].".jpg"))
				echo "Success";
		break;
		// Upload/overwrite company logo
		case 'providerLogoUpload':
			if ($_FILES["file"]["error"] > 0) //checks if theres a file
	  			echo "Error: " . $_FILES["file"]["error"] . "<br>";
	  		else if ($_FILES["file"]["size"] < 500000) {
				$temp = explode(".", $_FILES["file"]["name"]);
				$extension = end($temp);
				move_uploaded_file($_FILES["file"]["tmp_name"], "../profileData/companyLogo/".$_POST['provider'].".jpg");
				echo "Success";
			}
			else echo "file is too big";
		break;
		// Delete company logo
		case 'providerLogoDelete':
			if (unlink("../profileData/companyLogo/".$_POST['provider'].".jpg"))
				echo "Success";
		break;
		// Upload/overwrite location picture
		case 'locationPictureUpload':
			if ($_FILES["file"]["error"] > 0) //checks if theres a file
	  			echo "Error: " . $_FILES["file"]["error"] . "<br>";
	  		else if($_FILES["file"]["size"] < 500000){
				$temp = explode(".", $_FILES["file"]["name"]);
				$extension = end($temp);
				move_uploaded_file($_FILES["file"]["tmp_name"], "../profileData/locationPicture/".$_POST['location'].".jpg");
				echo "Success";
			} 
			else echo "file is too big";
		break;
		// Delete location picture
		case 'locationPictureDelete':
			if (unlink("../profileData/locationPicture/".$_POST['location'].".jpg"))
				echo "Success";
		break;

		default:
			echo 'Something is wrong';
		break;
	}
}
?>