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
$test=$newShow->checkShow();
//var_dump($test);
if($test==TRUE){
    $results= $newShow->setShow();
}else{
    echo "Event is already in the system. Please select different Event and try again.";
}

