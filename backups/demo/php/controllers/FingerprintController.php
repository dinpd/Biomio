<?php/*
//Fingerprints controller class
//id, date, fingerPrintString, templateHeader, hand, finger, captureType
class FingerprintController {

	public static function add_fingerprint($fingerPrintString, $templateHeader, $hand, $finger, $captureType) {
		//we create empty templates for 4 fingerprints when we create a new user
		//we create a new fingerprint, then return it's id and then sends this id to the add_user script
		Fingerprint::add_fingerprint($fingerPrintString, $templateHeader, $hand, $finger, $captureType);
		$fingerprint = Fingerprint::find_last_fingerprint($hand, $finger, $fingerPrintString);
		$row = mysql_fetch_array($fingerprint);
		return $row['id'];
	}

	public static function get_user_fingerprints($profileId) {
		//we get a list of user fingerprints and then generate an array that will be sent to the database
		$fingerprint = fingerprint::find_fingerprint('owner', $profileId);
		if (mysql_num_rows($fingerprint) == 0) {
			return '#no_fingerprints';
		} else {
			$data = array();
			$count = 0;
			while($row = mysql_fetch_array($fingerprint)) {
				$temp = array();
				$temp['id'] = $row['id'];
				$temp['owner'] = $row['owner'];
				$temp['name'] = $row['name'];
				$temp['type'] = $row['type'];
				$temp['serialNumber'] = $row['serialNumber'];
				$temp['mac'] = $row['mac'];
				$temp['lastPing'] = $row['lastPing'];

				$data[$count] = $temp;
				$count++;
			}
			return json_encode($data);
		}
	}

	public static function get_fingerprint_owner($fingerprintId) {
		$fingerprint = fingerprint::find_fingerprint('id', $fingerprintId);
		$row = mysql_fetch_array($fingerprint);
		return $row['owner'];
	}

	public static function delete_fingerprint($fingerprintId) {
		$result = fingerprint::delete_fingerprint($fingerprintId);
		if ($result) return '#success';
		else return '#error';
	}

	public static function update_fingerprint($fingerprintId, $owner, $name, $type, $serialNumber, $mac) {
		$result = fingerprint::update_fingerprint($fingerprintId, $owner, $name, $type, $serialNumber, $mac);
		return json_encode($result);
	}

}
*/
?>