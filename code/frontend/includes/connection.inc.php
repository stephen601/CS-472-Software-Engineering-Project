<?php
  $servername = "localhost";

	// WAMP
  $username = "root";
  $password = "";
  $database = "test";
  $port = 3307;
  $conn = mysqli_connect($servername, $username, $password, $database, $port);

	if (!$conn) {
		$username = "jeru";
		$password = "losportales";
		$database = "losportales";
		$port = 3307;
		$conn = mysqli_connect($servername, $username, $password, $database, $port);
	}

	if (!$conn) { // 000webhost
		$username = "id18705581_wp_9602beb976f1a3354f5535db232f0210";
		$password = "ZW5tdQ======";
		$database = "id18705581_wp_9602beb976f1a3354f5535db232f0210";
		$port = 3306;
		$conn = mysqli_connect($servername, $username, $password, $database, $port);
	}

	if (!$conn) {
		die("Database error\n");
	}

	return $conn;
  
	 /*
		 function conn($servername, $username, $password, $database){
			 return $conn = mysqli_connect($servername, $username, $password, $database);;
		 }
	//Check connection
	if (!$conn) {
		die("Connection failed: " . mysqli_connect_error());
	}

	echo "Connected Successfully"; */
