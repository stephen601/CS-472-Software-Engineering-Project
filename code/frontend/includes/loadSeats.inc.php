<?php

include 'connection.inc.php';
$ShowID=$_GET['ShowID'];

$sql="SELECT UserID, SeatPrice FROM seats WHERE ShowID = $ShowID ORDER BY SeatID ASC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
	$output = "";
	$count = 0;
	while($row = $result->fetch_assoc()) {
		$output .= $row["UserID"] . "-" . $row["SeatPrice"];
		if ($count != 95) $output .= "-";
		$count += 1;
	}
	echo $output;
}
$conn->close();
?> 
