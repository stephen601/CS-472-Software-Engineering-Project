<?php

include 'connection.inc.php';
$UserID=$_GET['UserID'];
$purchaseStr=$_GET['str'];

$stringArray = explode("-", $purchaseStr);
for ($i = 0; $i < count($stringArray)/2; $i++) {
	$ShowID = intval($stringArray[$i*2 + 0]);
	$SeatID = intval($stringArray[$i*2 + 1]);
	$sql = "UPDATE Seats SET UserID=$UserID WHERE ShowID = $ShowID AND SeatID = $SeatID" ;
	if (!$conn->query($sql)) {
		echo "Error: Failed to update seat ". $SeatID . " for show " . $ShowID;
		break;
	}
}

echo "Success";

?> 
