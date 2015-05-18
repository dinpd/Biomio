<?php
//Resource controller class
//id, name, address, owner, description, deviceIds, policy
class ResourceController {

	public static function add_resource($name, $address, $owner, $description, $deviceIds, $policy) {
		Resource::add_resource($name, $address, $owner, $description, $deviceIds, $policy);
		$resource = Resource::find_last_resource($owner);
		$row = mysql_fetch_array($resource);
		$data = array();
		$data['id'] = $row['id'];
		$data['name'] = $row['name'];
		$data['address'] = $row['address'];
		$data['owner'] = $row['owner'];
		$data['description'] = $row['description'];
		$data['deviceIds'] = $row['deviceIds'];
		$data['policy'] = $row['policy'];
		return json_encode($data);
	}

	public static function get_user_secure_locations($profileId) {
		$resource = Resource::find_resource('owner', $profileId);
		if (mysql_num_rows($resource) == 0) {
			return '#no_resources';
		} else {
			$data = array();
			$count = 0;
			while($row = mysql_fetch_array($resource)) {
				$temp = array();
				$temp['id'] = $row['id'];
				$temp['name'] = $row['name'];
				$temp['address'] = $row['address'];
				$temp['owner'] = $row['owner'];
				$temp['description'] = $row['description'];
				$temp['deviceIds'] = $row['deviceIds'];
				$temp['policy'] = $row['policy'];

				$data[$count] = $temp;
				$count++;
			}
			return json_encode($data);
		}
	}

	public static function get_avaliable_resources($profileId) {
		//so far it returns just all resources
		$resource = Resource::find_resource('owner', $profileId);
		if (mysql_num_rows($resource) != 0) {
			$data = array();
			$count = 0;
			while($row = mysql_fetch_array($resource)) {
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

	public static function get_resource_owner($resourceId) {
		$resource = Resource::find_resource('id', $resourceId);
		$row = mysql_fetch_array($resource);
		return $row['owner'];
	}

	public static function delete_resource($resourceId) {
		$result = Resource::delete_resource($resourceId);
		if ($result) return '#success';
		else return '#error';
	}

	public static function update_resource($resourceId, $owner, $name, $type, $serialNumber, $mac) {
		$result = Resource::update_resource($resourceId, $owner, $name, $type, $serialNumber, $mac);
		return json_encode($result);
	}

}
