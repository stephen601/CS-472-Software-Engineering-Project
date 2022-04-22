<?php

include 'connection.inc.php';
$UserID=$_GET['UserID'];
$purchaseStr=$_GET['str'];

$stringArray = explode("-", $purchaseStr);
for ($i = 0; $i < count($stringArray); $i+=2) {
	$ShowID = intval($stringArray[$i]);
	$SeatID = intval($stringArray[$i+1]);
	$sql = "UPDATE Seats SET UserID=$UserID WHERE ShowID = $ShowID AND SeatID = $SeatID" ;
	if (!$conn->query($sql)) {
		echo "Error: Failed to update seat ". $SeatID . " for show " . $ShowID;
		break;
	}
}

echo "Success";

?> 
