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

		if (!$conn->query($sql)) {
			echo "Error: Failed to update seat ". $SeatID . " for show " . $ShowID;
			break;
		}
	}

	$dt = date('Y-m-d H:i:s');
	$sql = "INSERT INTO Receipt (UserID, Purchase, FinalPrice, DateTime) VALUES ('$UserID', '$purchaseStr', 0, '$dt')";
	if (!$conn->query($sql)) {
		echo "Error: " . mysqli_error($conn);
	}
}
?> 
