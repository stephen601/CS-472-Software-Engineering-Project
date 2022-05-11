<?php
$conn=require'connection.inc.php';

$ReceiptDateMin = $_GET['ReceiptDateMin'];
$ReceiptDateMax = $_GET['ReceiptDateMax'];

$sql = "SELECT * FROM receipt WHERE DateTime >= '$ReceiptDateMin' AND DateTime <= '$ReceiptDateMax'";

// getReport.php?ReceiptDateMin=2020-1-1&ReceiptDateMax=2025-1-1

$result = mysqli_query($conn, $sql);
if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		echo $row["ReceiptID"] . "|" . $row["UserID"] . "|" . $row["Purchase"] . "|" . $row["FinalPrice"] . "|" . $row["DateTime"];
		echo "<br />";
	}
}
