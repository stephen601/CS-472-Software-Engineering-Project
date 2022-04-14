<?php

include 'connection.inc.php';
$Showid=$_GET['ShowID'];
$Seatid=$_GET['SeatID'];


$sql = "UPDATE Seats SET ShowID='$Showid',SeatID='$Seatid',SeatPrice='5',SeatVacancy='1' WHERE ShowID = $Showid AND SeatID =$Seatid " ;


if ($conn->query($sql) === TRUE) {
  echo "Record updated successfully";
  }
 else {
  echo "Error updating record: " . $conn->error;
}
?> 
