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
			echo "New record created successfully !\n";

			// Insert the new seats
			$sql = "INSERT INTO Seats ";
			$sql .= "(ShowID, SeatID, SeatPrice, UserID) ";
			$sql .= "VALUES ";
			$SEATS_MAX = 96;
			for ($i = 0; $i < $SEATS_MAX; $i++) {
				$sql .= "(";
				$sql .= $conn->insert_id . ",";
				$sql .= $i . ",";
				$sql .= "5,";
				$sql .= "0)";
				if ($i == $SEATS_MAX-1) {
					$sql .= ";";
				} else {
					$sql .= ",";
				}
			}
			if (!mysqli_query($conn, $sql)) {
				echo "Error: Failed to make seats";
			}

		} else {
			echo "Error: " . $sql . " " . mysqli_error($conn);
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
			echo "Error: " . $sql . " " . mysqli_error($conn);
		}
	}
	public function newDeleteShow($ShowID){
		$conn=require'connection.inc.php';
		$sql="DELETE FROM `Event` WHERE `Event`.`ShowID`=$ShowID;";
		if (mysqli_query($conn, $sql)) {
			echo "Record deleted successfully !";

			// Delete shows
			$sql = "DELETE FROM Seats WHERE ShowID=$ShowID;";
			if (!mysqli_query($conn, $sql)) echo "Warning: Failed to delete seats!";
		} else {
			echo "Error: " . $sql . " " . mysqli_error($conn);
		}
	}
	public function checkShowOld(){
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
	public function checkShow(){
		$conn=require'connection.inc.php';
		$sql = "SELECT * FROM `Event` WHERE `ShowName` LIKE '$this->ShowName' AND `ShowDate` = '$this->ShowDate' AND `ShowTime` = '$this->ShowTime'";
		$result=mysqli_query($conn, $sql);
		$row=mysqli_fetch_assoc($result);

		if ($result && $row && $row["ShowName"]==$this->ShowName) {
			return FALSE;
		} else {
			return TRUE;
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
	public function getShows() {
		$conn=require'connection.inc.php';
		$sql = "SELECT * FROM `Event` WHERE `ShowName` LIKE '$this->ShowName' AND `ShowDate` >= '$this->ShowDateMin' AND `ShowDate` <= '$this->ShowDateMax'";
		$result = mysqli_query($conn, $sql);
		$error_msg= ' Username does not exist.';
		$resultCheck=mysqli_num_rows($result);
		if ($resultCheck > 0) {
			// output data of each row
			while($row = $result->fetch_assoc()){
				// echo "Show ID: ".$row['ShowID']. " - Show Name:". $row['ShowName']. " - Date:". $row['ShowDate']. " - Time:". $row['ShowTime']. " - Price:". $row['ShowPrice'];
				echo $row['ShowID']. "|". $row['ShowName']. "|". $row['ShowDate']. "|". $row['ShowTime']. "|". $row['ShowPrice'];
				echo "<br />";
			}
		}
		Else{
		echo "No data found.";
		}
	}
}
