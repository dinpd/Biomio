<?php
include ('connect.php');
if (isset($_POST['cmd'])) {

	switch ($_POST['cmd']) {

		case 'create':

			$domain = $_POST['domain'];
			$result = mysqli_query($db_conx, "SELECT * FROM TempWebsiteCodes WHERE domain = '$domain'") or die (mysqli_error());

			if (mysqli_num_rows($result) != 0) {
				$row = mysqli_fetch_array($result);
				$filename = $row['filename'];
				$code = $row['code'];

			} else {
				$charset = array('0', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
				$code = '';
					for ($i=0; $i<15; $i++) { $code = $code . $charset[rand(0, count($charset))-1]; }
				$code =  $code;

				$filename = '';
					for ($i=0; $i<15; $i++) { $filename = $filename . $charset[rand(0, count($charset))-1]; }
				$filename = 'BIOMIO_' . $filename . '.txt';

				mysqli_query($db_conx, "INSERT INTO TempWebsiteCodes (domain, code, filename) VALUES ('$domain', '$code', '$filename')") or die (mysqli_error());
				
				//Adding file
				$fh = fopen('../profileData/tempWebsiteFiles/' . $filename, 'w') or die("can't open file");
				fwrite($fh, $code);
				fclose($fh);
			}
			echo $filename . '|' . $code;

		break;

		case 'verify':

			$domain = $_POST['domain'];
			
			$result = mysqli_query($db_conx, "SELECT * FROM TempWebsiteCodes WHERE domain = '$domain'") or die (mysqli_error());
			$row = mysqli_fetch_array($result);
			$code = $row['code'];
			$filename = $row['filename'];

			$url = 'http://' . $domain . '/' . $filename;

			$file_headers = @get_headers($url);
			if($file_headers[0] == 'HTTP/1.1 404 Not Found') {
			    $exists = false;
			}
			else {
			    $fh = fopen($url, 'r');
				$theData = fread($fh, 15);
				fclose($fh);
				if ($theData == $code) {
					echo 'approved';
				}
			}
		break;

		case 'createScreenshot':
			$filename = $_POST['domain'];
			if ( gethostbyname($filename) == $filename ) {
			  echo "NO DNS Record found";
			} else {
				$sites = "http://" . $filename;
				 
				$sites = preg_split('/\r\n|\r|\n/', $sites);

				foreach($sites as $site) {
					//cache image
					$image = file_get_contents("https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=$site&screenshot=true");
					$image = json_decode($image, true);
					$image = $image['screenshot']['data'];
					$image = str_replace(array('_','-'),array('/','+'),$image);

					$file = "../profileData/websiteScreenshot/". $filename .".png";

					if (file_exists($file)) { unlink ($file); }

					$img = str_replace('data:image/png;base64,', '', $image);
					$img = str_replace(' ', '+', $img);
					$data = base64_decode($img);
					$file = "../profileData/websiteScreenshot/". $filename .".png";
					
					if (file_exists($file)) { unlink ($file); }

					$success = file_put_contents($file, $data);
				}
			}
		break;
	}
}