<?php
class UserProfile{
	public $UID;
	public $Username;
	public $Password;
	public $UserStatus;
	public $userValidation="False";
	public $Null="NULL";

	public function setUsername(){
		$conn=require'connection.inc.php';
		$sql="INSERT INTO User_Profile (ID, Username, Password, UserStatus) VALUES ($this->Null, '$this->Username', '$this->Password', '$this->UserStatus')";
		if (mysqli_query($conn, $sql)) {
			echo "$conn->insert_id";
		} else {
			echo "Error: " . mysqli_error($conn);
		}
	}
	public function deleteUsername(){
		$conn=require'connection.inc.php';
		$getId="SELECT * FROM `User_Profile` WHERE `Username` LIKE '$this->Username'";
		$results=mysqli_query($conn, $getId);
		//var_dump($results);
		$row=mysqli_fetch_assoc($results);
		//var_dump($row[ID]);
		$sql="DELETE FROM `User_Profile` WHERE `User_Profile`.`ID`=$row[ID];";
		if (mysqli_query($conn, $sql)) {
			echo "Record deleted successfully !";
		} else {
			echo "Error: " . $sql . "
				" . mysqli_error($conn);
		}
	}
	public function checkUsername(){
		$conn=require'connection.inc.php';
		$sql = "SELECT * FROM `User_Profile` WHERE `Username` LIKE '$this->Username'";
		$result=mysqli_query($conn, $sql);
		$row=mysqli_fetch_assoc($result);
		if($result){
			if($row["Username"]==$this->Username){
				return $nameVacant=FALSE;
			}else{
				return $nameVacant=TRUE;
			}
		}

	}
	public function getUsername(){
		$conn=require'connection.inc.php';
		$sql = "SELECT * FROM `User_Profile` WHERE `Username` LIKE '$this->Username'"; //check
		$result = mysqli_query($conn, $sql);
		$error_msg= ' Username does not exist.';
		$resultCheck=mysqli_num_rows($result);
		if ($resultCheck > 0) {
			// output data of each row
			while($row = mysqli_fetch_assoc($result)){
				if($this->Password==$row["Password"]){
					echo $row["ID"] . "|" . $row["IsAdmin"];
					return;
				}
				else{ 
					echo "Error: Bad creds.";
					return;
				}
			}
		} else {
			echo "Error: Bad creds.";
		}
	}
}
