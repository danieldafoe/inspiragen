<?php
// define variables and set to empty values
$headline = $creator = $url = $createDate = "";

$servername = "localhost";
$username = "main";
$password = "Qpalzm190";
//echo $_SERVER['REMOTE_ADDR'];

// Create connection
$conn = new mysqli($servername, $username, $password, 'inspiragen');
// Select a DB
mysqli_select_db('inspiragen', $conn);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
//echo "Connected successfully";

// Grab the data
$query = 'SELECT * FROM headlines';
$result = mysqli_query($conn, $query);
$resultArr = [];

if (mysqli_num_rows($result) > 0) {
  //echo "Get successful.";
  while ($row = mysqli_fetch_assoc($result)) {
    //echo $row;
    $resultArr[] = $row;
  }
  echo json_encode($resultArr);
} else {
  echo mysqli_error($conn);
}

mysqli_close($conn);
?>