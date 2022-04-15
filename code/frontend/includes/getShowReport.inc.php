<?php
include 'shows.inc.php';
$showname = $_GET['showname'];
$showdatemin = $_GET['showdatemin'];
$showdatemax = $_GET['showdatemax'];
$shows = new Shows;
$shows->ShowName=$showname;
$shows->ShowDateMin=$showdatemin;
$shows->ShowDateMax=$showdatemax;
echo $shows->getShows(); 
