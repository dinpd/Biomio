<?php
//Policy model class
//id, owner, name, bioAuth, minAuth, maxAuth, matchCertainty, geoRestriction, timeRestriction
class Policy {
  
  public static function find_policy($fieldname, $value) {
	include ('connect.php');

	switch ($fieldname) {
	  case 'name':
	    $result=mysql_query ("SELECT * FROM Policies WHERE name = '$value'") or die (mysql_error());
		return $result;
	    break;

	  case 'owner':
	    $result=mysql_query ("SELECT * FROM Policies WHERE owner = $value") or die (mysql_error());
	    return $result;
	    break;

	  case 'id':
	    $result=mysql_query ("SELECT * FROM Policies WHERE id = $value") or die (mysql_error());
	    return $result;
	    break;
	}
  }

  public static function find_last_policy($owner) {
	include ('connect.php');
	$result=mysql_query ("SELECT * FROM Policies WHERE owner = $owner ORDER BY id DESC LIMIT 1") or die (mysql_error());
	return $result;
  }

  public static function update_policy($policyId, $name, $owner, $bioAuth, $minAuth, $maxAuth, $matchCertainty, $geoRestriction, $timeRestriction) {
	include ('connect.php');

	$result=mysql_query ("UPDATE Policies SET name = '$name', owner = $owner, bioAuth = '$bioAuth', minAuth = '$minAuth', maxAuth = '$maxAuth', matchCertainty = '$matchCertainty', geoRestriction = '$geoRestriction', timeRestriction = '$timeRestriction' WHERE id = $policyId") or die (mysql_error());
	return $result;
  }

  public static function add_policy($name, $owner, $bioAuth, $minAuth, $maxAuth, $matchCertainty, $geoRestriction, $timeRestriction) {
	include ('connect.php');

	$result=mysql_query ("INSERT INTO Policies (name, owner, bioAuth, minAuth, maxAuth, matchCertainty, geoRestriction, timeRestriction) 
									VALUES ('$name', $owner, 'bioAuth', $minAuth, $maxAuth, $matchCertainty, '$geoRestriction', '$timeRestriction')") or die (mysql_error());
	return $result;   
  }

  public static function delete_policy($policyId) {
	include ('connect.php');

	$result=mysql_query ("DELETE FROM Policies WHERE id = $policyId") or die (mysql_error());
	return $result;   
  }
}