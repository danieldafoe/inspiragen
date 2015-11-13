<?php

$data = $_POST["data"];
echo $data;
$headline = $creator = $url = $createDate = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $headline = test_input($_POST["headline"]);
  //echo $user;
  $creator = test_input($_POST["creator"]);
  $url = test_input($_POST["url"]);
  $createDate = test_input($_POST["createDate"]);
}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

$servername = "localhost";
$username = "main";
$password = "Qpalzm190";

// Create connection
$conn = new mysqli($servername, $username, $password, 'inspiragen');
// Select a DB
mysqli_select_db('inspiragen', $conn);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
echo "Connected successfully";

// Input the data into the `headlines` table
$insert = "INSERT INTO headlines(headline, creator, url, createDate) VALUES('" . $headline . "','" . $creator . "','" . $url . "','" . $createDate . "');";
if (mysqli_query($conn, $insert)) {
  echo "\nInsert successful.";

  // Get the id of the last added row
  $query = 'SELECT * FROM headlines';
  $result = mysqli_query($conn, $query);
  $headline_id = "";


  // Check if the headline exists in the votes table
  if (mysqli_num_rows($result) > 0) {
    //echo "Get successful.";
    while ($row = mysqli_fetch_assoc($result)) {
      echo $row['headline'];
      if ($row['headline'] == $headline) {
        //echo "Match";
        $headline_id = $row['id'];
      }
      else {
        echo "Does not match.";
      }
    }
  }
  else {
    echo "No rows returned.";
  }

  // Input the data into the `votes` table
  $votesInsert = "INSERT INTO votes(headline_id, num_of_votes) VALUES('" . $headline_id . "',0);";
  if (mysqli_query($conn, $votesInsert)) {
    echo "Votes insert successful.";
  } else {
    echo mysqli_error($conn);
  }
} else {
  echo "<br/>" . mysqli_error($conn);
}

mysqli_close($conn);
/*
header("Location: " . "http://" . $_SERVER['HTTP_HOST'] . $location);
die();
*/
?>