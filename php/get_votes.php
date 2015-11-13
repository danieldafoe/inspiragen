<?php

$data = $_POST["data"];
$headline_id = $votes = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $headline_id = test_input($_POST["headline_id"]);
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

// Check if the ID exists in the `votes` table.
$votesQuery = 'SELECT * FROM votes WHERE headline_id="' . $headline_id . '";';
$votesResult = mysqli_query($conn, $votesQuery);

if (mysqli_num_rows($votesResult) > 0) {
  while ($row = mysqli_fetch_assoc($votesResult)) {
    $votes = intval($row['num_of_votes']);
    echo $votes;
  }
}
else {
  echo "No rows returned.";
}

mysqli_close($conn);
?>