<?php
include 'shows.inc.php';
$showname=$_GET['showname'];
$showdate=$_GET['showdate'];
$showtime=$_GET['showtime'];
$show = new Shows;
$show->ShowName=$showname;
$show->ShowDate=$showdate;
$show->ShowTime=$showtime;
echo $show->deleteShow(); 
