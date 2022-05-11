<?php
include 'shows.inc.php';
$showname=$_GET['showname'];
$showdate=$_GET['showdate'];
$showtime=$_GET['showtime'];
$showprice=$_GET['showprice'];
$newShow=new Shows;
$newShow->ShowName=$showname;
$newShow->ShowDate=$showdate;
$newShow->ShowTime=$showtime;
$newShow->ShowPrice=$showprice;
// $test=$newShow->checkShow();
// if($test==0){
$results = $newShow->setShow();
// }else{
// 	echo $test;
// }

