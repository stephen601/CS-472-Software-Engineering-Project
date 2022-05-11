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
		$sql="INSERT INTO user_profile (ID, Username, Password, UserStatus) VALUES ($this->Null, '$this->Username', '$this->Password', '$this->UserStatus')";
		if (mysqli_query($conn, $sql)) {
			echo "$conn->insert_id";
		} else {
			echo "Error: " . mysqli_error($conn);
		}
	}
	public function deleteUsername(){
		$conn=require'connection.inc.php';
		$getId="SELECT * FROM `user_profile` WHERE `Username` LIKE '$this->Username'";
		$results=mysqli_query($conn, $getId);
		//var_dump($results);
		$row=mysqli_fetch_assoc($results);
		//var_dump($row[ID]);
		$sql="DELETE FROM `user_profile` WHERE `user_profile`.`ID`=$row[ID];";
		if (mysqli_query($conn, $sql)) {
			echo "Record deleted successfully !";
		} else {
			echo "Error: " . $sql . "
				" . mysqli_error($conn);
		}
	}
	public function checkUsername(){
		$conn=require'connection.inc.php';
		//Template
		$sql = "SELECT * FROM `user_profile` WHERE Username=?;";
		//Prepared Statement
		$stmt=mysqli_stmt_prepare($conn);
		//Prepared statement setup
		if(!mysqli_stmt__prepare($stmt,$sql)){
		    echo "SQL statement failed";
		}else{
		    //Bind
		    mysqli_stmt_bind_param($stmt,"s",$this->Username);
		    //Run
		    mysqli_stmt_execute($stmt);
		    $result=mysqli_stmt_get_result();
		}
		//$result=mysqli_query($conn, $sql);
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
		$sql = "SELECT * FROM `user_profile` WHERE `Username` LIKE '$this->Username'"; //check
		$result = mysqli_query($conn, $sql);
		$resultCheck=mysqli_num_rows($result);
		if ($resultCheck > 0) {
			// output data of each row
			while($row = mysqli_fetch_assoc($result)){
				if($this->Password==$row["Password"]){
					echo $row["ID"] . "|" . $row["IsAdmin"];
					return;
				} else { 
					echo "Error: Bad creds.";
					return;
				}
			}
		} else {
			echo "Error: " . mysqli_error($conn);
		}
	}
}
