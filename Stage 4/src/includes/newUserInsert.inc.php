<?php
include 'userProfile.inc.php';
$Username=$_GET['Username'];
$Password=$_GET['Password'];
$Dob=$_GET['Dob'];
$Phone=$_GET['Phone'];
$Address=$_GET['Address'];
$Email=$_GET['Email'];

$conn = require'connection.inc.php';

$sql = "SELECT * FROM user_profile WHERE Username LIKE '$Username'";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($result);

if (!$result || !$row) {
	$sql="INSERT INTO user_profile (Username, Password, IsAdmin, Dob, Phone, Address, Email) VALUES ('$Username', '$Password', '0', '$Dob', '$Phone', '$Address', '$Email')";
	if (mysqli_query($conn, $sql)) {
		echo "$conn->insert_id";
	} else {
		echo "Error: " . mysqli_error($conn);
	}
} else {
	echo "Error: User already exists";
}
