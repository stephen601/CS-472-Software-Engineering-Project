<?php
  $servername = "localhost";
// if (isLocal) {
// } else {
// }
  // $username = "id18705581_wp_9602beb976f1a3354f5535db232f0210";
  // $password = "ZW5tdQ======";
  // $database = "id18705581_wp_9602beb976f1a3354f5535db232f0210";
  // $port = 3306;

  $username = "root";
  $password = "";
  $database = "test";
  $port = 3307;

  return $conn = mysqli_connect($servername, $username, $password, $database, $port);
  
	 /*
		 function conn($servername, $username, $password, $database){
			 return $conn = mysqli_connect($servername, $username, $password, $database);;
		 }
	//Check connection
	if (!$conn) {
		die("Connection failed: " . mysqli_connect_error());
	}

	echo "Connected Successfully"; */
