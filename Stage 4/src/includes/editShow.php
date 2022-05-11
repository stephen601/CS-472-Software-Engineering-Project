<?php

include 'connection.inc.php';
$ShowID=$_GET['ShowID'];
$ShowName=$_GET['ShowName'];
$ShowDate=$_GET['ShowDate'];
$ShowTime=$_GET['ShowTime'];

$sql="UPDATE event SET ShowName='$ShowName', ShowDate='$ShowDate', ShowTime='$ShowTime' WHERE ShowID=$ShowID";
if (!mysqli_query($conn, $sql)) {
	echo "Error: " . mysqli_error($conn);
} 

// includes/editShow.php?ShowID=32&ShowName=newName&ShowDate=2022-4-25&ShowTime=16:25:00

?> 
