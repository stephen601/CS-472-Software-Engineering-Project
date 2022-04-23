<?php

$simulateNoMoney = False;

include 'connection.inc.php';
$UserID=$_GET['UserID'];
$purchaseStr=$_GET['str'];

if ($simulateNoMoney) {
	echo "Error: Could not complete transaction";
} else {
	$stringArray = explode("-", $purchaseStr);
	for ($i = 0; $i < count($stringArray); $i+=2) {
		$ShowID = intval($stringArray[$i]);
		$SeatID = intval($stringArray[$i+1]);
		$sql = "UPDATE Seats SET UserID=$UserID WHERE ShowID = $ShowID AND SeatID = $SeatID" ;

		// echo "Error: Not MasterCard";
		// break;
		if (!$conn->query($sql)) {
			echo "Error: Failed to update seat ". $SeatID . " for show " . $ShowID;
			break;
		}
	}
}
?> 
