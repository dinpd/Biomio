<?php
//Device controller class
//id, owner, name, type, serialNumber, mac, lastPing
class DeviceController {

	public static function add_device($owner, $name, $type, $serialNumber, $mac) {
		Device::add_device($owner, $name, $type, $serialNumber, $mac);
		$device = Device::find_last_device($owner);
		$row = mysql_fetch_array($device);
		$data = array();
		$data['id'] = $row['id'];
		$data['owner'] = $row['owner'];
		$data['name'] = $row['name'];
		$data['type'] = $row['type'];
		$data['serialNumber'] = $row['serialNumber'];
		$data['mac'] = $row['mac'];
		$data['lastPing'] = $row['lastPing'];
		return json_encode($data);
	}

	public static function get_user_devices($profileId) {
		$device = Device::find_device('owner', $profileId);
		if (mysql_num_rows($device) == 0) {
			return '#no_devices';
		} else {
			$data = array();
			$count = 0;
			while($row = mysql_fetch_array($device)) {
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

	public static function get_avaliable_devices($profileId) {
		//so far it returns just all devices
		$device = Device::find_device('owner', $profileId);
		if (mysql_num_rows($device) != 0) {
			$data = array();
			$count = 0;
			while($row = mysql_fetch_array($device)) {
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

	public static function get_device_owner($deviceId) {
		$device = Device::find_device('id', $deviceId);
		$row = mysql_fetch_array($device);
		return $row['owner'];
	}

	public static function delete_device($deviceId) {
		$result = Device::delete_device($deviceId);
		if ($result) return '#success';
		else return '#error';
	}

	public static function update_device($deviceId, $secureLocation, $owner, $name, $type, $serialNumber, $mac) {
		$result = Device::update_device($deviceId, $secureLocation, $owner, $name, $type, $serialNumber, $mac);
		return json_encode($result);
	}

}