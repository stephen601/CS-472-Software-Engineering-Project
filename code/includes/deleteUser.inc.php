<?php
include 'userProfile.inc.php';
$username = $_GET['username'];
$userPro = new UserProfile;
$userPro->Username=$username;
echo $userPro->deleteUsername(); 
