<?php
include 'userProfile.inc.php';
$username = $_GET['username'];
$password = $_GET['password'];
$userPro = new UserProfile;
$userPro->Username=$username;
$userPro->Password=$password;
$userPro->getUsername(); 
