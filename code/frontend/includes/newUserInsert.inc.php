<?php
include 'userProfile.inc.php';
$username=$_GET['username'];
$password=$_GET['password'];
$UserStatus=$_GET['UserStatus'];
$Guest=$_GET['Guest'];
$newUser=new UserProfile;
$newUser->Username=$username;
$newUser->Password=$password;
$newUser->UserStatus=$UserStatus;
//$newUser->Guest=$Guest;
$test=$newUser->checkUsername();
if($test==TRUE){
    $results= $newUser->setUsername();
}else{
    echo "Username is already in the system. Please select different Username and try again.";
}



