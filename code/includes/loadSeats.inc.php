<?php

include 'connection.inc.php';
$Showid=$_GET['ShowID'];

$sql="SELECT ShowID, SeatID, SeatPrice, SeatVacancy FROM Seats WHERE ShowID = $Showid";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo " ShowID: " . $row["ShowID"]. "  - SeatID: " . $row["SeatID"]. "S eatPrice: " . $row["SeatPrice"]. " -  SeatVacancy: " . $row["SeatVacancy"]. " <br>";
  }
} else {
  echo "NO Seats created";
}
$conn->close();
?> 
