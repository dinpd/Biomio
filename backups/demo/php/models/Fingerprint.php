<?php/*
//Fingerprint model class
//id, date, fingerPrintString, templateHeader, hand, finger, captureType
class Fingerprint {
  
  public static function find_fingerprint($fieldname, $value) {
	include ('connect.php');
	//include ($_SERVER["DOCUMENT_ROOT"] . '/php/connect.php');
	switch ($fieldname) {
	  case 'id':
	    $result=mysql_query ("SELECT * FROM Fingerprints WHERE id = $value") or die (mysql_error());
	    return $result;
	    break;
	}
  }

  public static function find_last_fingerprint($hand, $finger, $fingerPrintString) {
	include ('connect.php');

    $result=mysql_query ("SELECT * FROM Fingerprints WHERE hand = '$hand', finger = '$finger', fingerPrintString = 'fingerPrintString' ORDER BY id DESC LIMIT 1") or die (mysql_error());
    return $result;
  }

  public static function update_fingerprint($fingerprintId, $index, $value) {
	include ('connect.php');

	switch ($index) {
	  case 'fingerPrintString':
			$result=mysql_query ("UPDATE Fingerprints SET fingerPrintString = '$value' WHERE id = $fingerprintId") or die (mysql_error());
	    break;
	  case 'templateHeader':
			$result=mysql_query ("UPDATE Fingerprints SET templateHeader = '$value' WHERE id = $fingerprintId") or die (mysql_error());
	    break;
	  case 'captureType':
			$result=mysql_query ("UPDATE Fingerprints SET captureType = '$value' WHERE id = $fingerprintId") or die (mysql_error());
	    break;
	}
	return $result;
  }

  public static function add_fingerprint($fingerPrintString, $templateHeader, $hand, $finger, $captureType) {
	include ('connect.php');

	$result=mysql_query ("INSERT INTO Fingerprints (fingerPrintString, templateHeader, hand, finger, captureType) VALUES ('$fingerPrintString', '$templateHeader', '$hand', '$finger', '$captureType')") or die (mysql_error());
	return $result;   
  }

  public static function delete_fingerprint($fingerprintId) {
	include ('connect.php');

	$result=mysql_query ("DELETE FROM Fingerprints WHERE id = $fingerprintId") or die (mysql_error());
	return $result;   
  }
}
*/
?>