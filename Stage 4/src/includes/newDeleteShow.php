<?php
$conn=require'connection.inc.php';

$ShowID = $_GET['ShowID']; 

$sql="DELETE FROM `event` WHERE `event`.`ShowID`=$ShowID;";
if (mysqli_query($conn, $sql)) {
	echo "Record deleted successfully !";

	// Delete shows
	$sql = "DELETE FROM Seats WHERE ShowID=$ShowID;";
	if (!mysqli_query($conn, $sql)) echo "Error: Failed to delete seats: " . $sql . " " . mysqli_error($conn);
} else {
	echo "Error: " . $sql . " " . mysqli_error($conn);
}
