Connection.inc.php = This file is just for connection data. 

 

userProfile.inc.php = This file has user classes and functions/methods to be called with the class. 

 

Login.inc.php = This is the file that will be called for the login page. It is using get_ to set the username and password. It will return a Boolean true and the user id if the login is successful. If the login is unsuccessful, it will return false and whether the username or password is wrong. 

$username = $_GET['username'] 

$password = $_GET['password'] 

url:https://losportalestheatre575.000webhostapp.com/includes/login.inc.php
 

newUserInsert.inc.ph = This file is for inserting a new user’s information into the database. It uses get_ to set the username,password,UserStatus, and Guest variables. Then the users information will be input into the database. If successful, you will get a message for new record created successfully. If username already exist it will send a message saying Username is already in the system. Please select different Username and try again. 

$username=$_GET['username']; 

$password=$_GET['password']; 

$UserStatus=$_GET['UserStatus'];   //Customer or Admin 

url:https://losportalestheatre575.000webhostapp.com/includes/newUserInsert.inc.php

newShowInsert.inc.php = This file is for inserting a new show's information to into the database. It uses get_ to set the showname showdate and show time variables. If successfully put into the database a success message will be echoed. If the show already exist, an error message will occur.

$showname=$_GET['showname'];

$showdate=$_GET['showdate'];

$showtime=$_GET['showtime'];

$showprice=$_GET['showprice'];

deleteShow.inc.php = This file is for deleting shows from the database. It uses get_ to set the showname showdate and show time variables. If successfully put into the database a success message will be echoed. If the show already exist, an error message will occur.

$showname=$_GET['showname'];

$showdate=$_GET['showdate'];

$showtime=$_GET['showtime'];

getShow.inc.php = It is using get_ to set the showname showdate and showdate. It will return a Boolean true and the show id if the show is in the database. If the search is unsuccessful, it will return false and an error message.

$showname=$_GET['showname'];

$showdate=$_GET['showdate'];

$showtime=$_GET['showtime'];