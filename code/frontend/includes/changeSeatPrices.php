<?php
$conn=require'connection.inc.php';
$ShowID=$_GET['ShowID'];
$SeatsStr=$_GET['SeatsStr'];
$NewPrice=$_GET['NewPrice'];

$stringArray = explode("-", $SeatsStr);
for ($i = 0; $i < count($stringArray); $i++) {
	$SeatID = intval($stringArray[$i]);
	$sql="UPDATE Seats SET SeatPrice='$NewPrice' WHERE ShowID=$ShowID AND SeatID=$SeatID";
	if (!mysqli_query($conn, $sql)) echo "Error: " . mysqli_error($conn);
}
