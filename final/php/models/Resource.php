<?php
//Resource model class
//id, name, address, owner, description, deviceIds, policy
class Resource {
  
  public static function find_resource($fieldname, $value) {
	include ('connect.php');

	switch ($fieldname) {
	  case 'name':
	    $result=mysql_query ("SELECT * FROM SecureLocations WHERE name = '$value'") or die (mysql_error());
		return $result;
	    break;

	  case 'policy':
	    $result=mysql_query ("SELECT * FROM SecureLocations WHERE policy = $value") or die (mysql_error());
	    return $result;
	    break;

	  case 'owner':
	    $result=mysql_query ("SELECT * FROM SecureLocations WHERE owner = $value") or die (mysql_error());
	    return $result;
	    break;

	  case 'id':
	    $result=mysql_query ("SELECT * FROM SecureLocations WHERE id = $value") or die (mysql_error());
	    return $result;
	    break;
	}
  }

  public static function find_last_resource($owner) {
	include ('connect.php');
	$result=mysql_query ("SELECT * FROM SecureLocations WHERE owner = $owner ORDER BY id DESC LIMIT 1") or die (mysql_error());
	return $result;
  }

  public static function update_resource($resourceId, $index, $value) {
	include ('connect.php');

	switch ($index) {
	  case 'name':
			$result=mysql_query ("UPDATE SecureLocations SET name = '$value' WHERE id = $resourceId") or die (mysql_error());
	    break;
	  case 'address': 
	  	$result=mysql_query ("UPDATE SecureLocations SET address = '$value' WHERE id = $resourceId") or die (mysql_error());
	    break;
	  case 'description': 
	  	$result=mysql_query ("UPDATE SecureLocations SET description = '$value' WHERE id = $resourceId") or die (mysql_error());
	    break;
	  case 'deviceIds': 
	  	$result=mysql_query ("UPDATE SecureLocations SET deviceIds = '$value' WHERE id = $resourceId") or die (mysql_error());
	    break;
	  case 'policy': 
	  	$result=mysql_query ("UPDATE SecureLocations SET policy = '$value' WHERE id = $resourceId") or die (mysql_error());
	    break;
	}
	return $result;
  }

  public static function add_resource($name, $address, $owner, $description, $deviceIds, $policy) {
	include ('connect.php');

	$result=mysql_query ("INSERT INTO SecureLocations (name, address, owner, description, deviceIds, policy) VALUES ('$name', '$address', $owner, '$description', '$deviceIds', '$policy')") or die (mysql_error());
	return $result;   
  }

  public static function delete_resource($resourceId) {
	include ('connect.php');

	$result=mysql_query ("DELETE FROM SecureLocations WHERE id = $resourceId") or die (mysql_error());
	return $result;   
  }
}