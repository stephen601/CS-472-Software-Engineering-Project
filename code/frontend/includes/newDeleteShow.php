<?php
include 'shows.inc.php';
$show = new Shows;
echo $show->newDeleteShow($_GET['ShowID']); 
