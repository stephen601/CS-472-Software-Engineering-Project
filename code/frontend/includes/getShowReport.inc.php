<?php
include 'shows.inc.php';
$showdatemin = $_GET['showdatemin'];
$showdatemax = $_GET['showdatemax'];
$shows = new Shows;
$shows->ShowDateMin=$showdatemin;
$shows->ShowDateMax=$showdatemax;
echo $shows->getShows(); 
