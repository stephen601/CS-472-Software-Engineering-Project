<?php
 class Shows{
      public $ShowID;
      public $ShowName;
      public $ShowDate;
      public $ShowTime;
      public $ShowPrice;
      public $Null="NULL";
      public $test;
      public $ShowDateMin;
      public $ShowDateMax;
    
    public function setShow(){
      $conn=require'connection.inc.php';
      $sql="INSERT INTO `Event` (`ShowID`, `ShowName`, `ShowDate`, `ShowTime`,`ShowPrice`) VALUES ($this->Null, '$this->ShowName', '$this->ShowDate', '$this->ShowTime', '$this->ShowPrice')";
      if (mysqli_query($conn, $sql)) {
		echo "New record created successfully !";
	  } else {
	 	echo "Error: " . $sql . "
      " . mysqli_error($conn);
     }
    }
    public function deleteShow(){
        $conn=require'connection.inc.php';
        $getID="SELECT * FROM `Event` WHERE `ShowName` LIKE '$this->ShowName' AND `ShowDate` = '$this->ShowDate' AND `ShowTime` = '$this->ShowTime'";
        $results=mysqli_query($conn, $getID);
        $row=mysqli_fetch_assoc($results);
        $sql="DELETE FROM `Event` WHERE `Event`.`ShowID`=$row[ShowID];";
        if (mysqli_query($conn, $sql)) {
		  echo "Record deleted successfully !";
	    } else {
	    	echo "Error: " . $sql . "
        " . mysqli_error($conn);
     }
    }
    public function checkShow(){
      $conn=require'connection.inc.php';
      $sql = "SELECT * FROM `Event` WHERE `ShowName` LIKE '$this->ShowName' AND `ShowDate` = '$this->ShowDate' AND `ShowTime` = '$this->ShowTime'";
      $result=mysqli_query($conn, $sql);
      $row=mysqli_fetch_assoc($result);
      if($result){
          if($row["ShowName"]==$this->ShowName){
              return $test=FALSE;
      }else{
          return $test=TRUE;
      }
     }
    } 
    public function getShow(){
       $conn=require'connection.inc.php';
       $sql = "SELECT * FROM `Event` WHERE `ShowName` LIKE '$this->ShowName' AND `ShowDate` = '$this->ShowDate' AND `ShowTime` = '$this->ShowTime'";
       $result = mysqli_query($conn, $sql);
       //var_dump($sql);
       $error_msg= ' Username does not exist.';
       $resultCheck=mysqli_num_rows($result);
       if ($resultCheck > 0) {
          // output data of each row
          while($row = mysqli_fetch_assoc($result)){
              if($this->ShowName==$row["ShowName"]){
                  if($this->ShowDate==$row["ShowDate"]){
                      if($this->ShowTime==$row["ShowTime"]){
                         $this->userValidation=TRUE;
                         $this->ShowID = $row["ShowID"];
         }
          }
            }
         else{ 
             $error_msg=' Password does not exist.';
         }
        }
       }
       echo $this->userValidation;
       if($this->userValidation==FALSE){
           echo "<br>". $error_msg;
       }else{
           echo "<br>Show ID: ". $this->ShowID;
        }
       }
     public function getShows(){
       $conn=require'connection.inc.php';
       $sql = "SELECT * FROM `Event` WHERE `ShowName` LIKE '$this->ShowName' AND `ShowDate` >= '$this->ShowDateMin' AND `ShowDate` <= '$this->ShowDateMax'";
       $result = mysqli_query($conn, $sql);
       $error_msg= ' Username does not exist.';
       $resultCheck=mysqli_num_rows($result);
       if ($resultCheck > 0) {
          // output data of each row
          while($row = $result->fetch_assoc()){
             echo "Show ID: ".$row['ShowID']. " - Show Name:". $row['ShowName']. " - Date:". $row['ShowDate']. " - Time:". $row['ShowTime']. " - Price:". $row['ShowPrice'];
             echo "<br />";
          }
       }
       Else{
           echo "No data found.";
       }
     }
 }
       
     
        
