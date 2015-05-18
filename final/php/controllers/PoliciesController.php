<?php
//Policies controller class
//id, owner, name, bioAuth, minAuth, maxAuth, matchCertainty, geoRestriction, timeRestriction
class PoliciesController {

	public static function add_policy($name, $owner, $bioAuth, $minAuth, $maxAuth, $matchCertainty, $geoRestriction, $timeRestriction) {
		Policy::add_policy($name, $owner, $bioAuth, $minAuth, $maxAuth, $matchCertainty, $geoRestriction, $timeRestriction);
		$policy = Policy::find_last_policy($owner);
		$row = mysql_fetch_array($policy);
		$data = array();
		$data['id'] = $row['id'];
		$data['owner'] = $row['owner'];
		$data['bioAuth'] = $row['bioAuth'];
		$data['minAuth'] = $row['minAuth'];
		$data['maxAuth'] = $row['maxAuth'];
		$data['matchCertainty'] = $row['matchCertainty'];
		$data['geoRestriction'] = $row['geoRestriction'];
		$data['timeRestriction'] = $row['timeRestriction'];
		return json_encode($data);
	}

	public static function get_user_policies($profileId) {
		$policy = Policy::find_policy('owner', $profileId);
		if (mysql_num_rows($policy) == 0) {
			return '#no_policies';
		} else {
			$data = array();
			$count = 0;
			while($row = mysql_fetch_array($policy)) {
				$temp = array();
				$temp['id'] = $row['id'];
				$temp['name'] = $row['name'];
				$temp['owner'] = $row['owner'];
				$temp['bioAuth'] = $row['bioAuth'];
				$temp['minAuth'] = $row['minAuth'];
				$temp['maxAuth'] = $row['maxAuth'];
				$temp['matchCertainty'] = $row['matchCertainty'];
				$temp['geoRestriction'] = $row['geoRestriction'];
				$temp['timeRestriction'] = $row['timeRestriction'];

				$data[$count] = $temp;
				$count++;
			}
			return json_encode($data);
		}
	}

	public static function delete_policy($policyId) {
		$result = Policy::delete_policy($policyId);
		if ($result) return '#success';
		else return '#error';
	}

	public static function update_policy($policyId, $name, $owner, $bioAuth, $minAuth, $maxAuth, $matchCertainty, $geoRestriction, $timeRestriction) {
		$result = Policy::update_policy($policyId, $name, $owner, $bioAuth, $minAuth, $maxAuth, $matchCertainty, $geoRestriction, $timeRestriction);
		return json_encode($result);
	}

}