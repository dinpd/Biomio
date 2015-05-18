<?php
//Device model class
//id, owner, name, type, serialNumber, mac, lastPing
class Device {
  
  public static function find_device($fieldname, $value) {
	include ('connect.php');
	
	switch ($fieldname) {
	  case 'serialNumber':
	    $result=mysql_query ("SELECT * FROM Devices WHERE serialNumber = '$value'") or die (mysql_error());
		return $result;
	    break;

	  case 'type':
	    $result=mysql_query ("SELECT * FROM Devices WHERE type = '$value'") or die (mysql_error());
	    return $result;
	    break;

	  case 'owner':
	    $result=mysql_query ("SELECT * FROM Devices WHERE owner = $value") or die (mysql_error());
	    return $result;
	    break;

	  case 'id':
	    $result=mysql_query ("SELECT * FROM Devices WHERE id = $value") or die (mysql_error());
	    return $result;
	    break;
	}
  }

  public static function find_last_device($owner) {
	include ('connect.php');
	$result=mysql_query ("SELECT * FROM Devices WHERE owner = $owner ORDER BY id DESC LIMIT 1") or die (mysql_error());
	return $result;
  }

  public static function update_device($deviceId, $owner, $secureLocation, $name, $type, $serialNumber, $mac) {
	include ('connect.php');

	$result=mysql_query ("UPDATE Devices SET owner = $owner, secureLocation = $secureLocation, name = '$name', type = '$type', serialNumber = '$serialNumber', mac = '$mac' WHERE id = $deviceId") or die (mysql_error());
	return $result;
  }

  public static function add_device($owner, $name, $type, $serialNumber, $mac) {
	include ('connect.php');

	$result=mysql_query ("INSERT INTO Devices (owner, name, type, serialNumber, mac) VALUES ($owner, '$name', '$type', '$serialNumber', '$mac')") or die (mysql_error());
	return $result;   
  }

  public static function delete_device($deviceId) {
	include ('connect.php');

	$result=mysql_query ("DELETE FROM Devices WHERE id = $deviceId") or die (mysql_error());
	return $result;   
  }
}