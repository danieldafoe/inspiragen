<?php

$data = $_POST["data"];
//echo "Data: " . $data;
$headline = $creator = $votes = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $headline = test_input($_POST["headline"]);
  $creator = test_input($_POST["creator"]);
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

// Grab the ID of the headline from the headlines table
$query = 'SELECT * FROM headlines';
$result = mysqli_query($conn, $query);
$headline_id = "";


// Check if the headline exists in the votes table
if (mysqli_num_rows($result) > 0) {
  //echo "Get successful.";
  while ($row = mysqli_fetch_assoc($result)) {
    //echo $row['headline'];
    if ($row['headline'] == $headline) {
      //echo "Match";
      $headline_id = $row['id'];

      // Check if the ID exists in the `votes` table.
      $votesQuery = 'SELECT * FROM votes WHERE headline_id="' . $headline_id . '"';
      $votesResult = mysqli_query($conn, $votesQuery);
      if (mysqli_num_rows($votesResult) > 0) {
        while ($row = mysqli_fetch_assoc($votesResult)) {
          $current_votes = intval($row['num_of_votes']);
          //echo $current_votes;
          // Increase votes by 1
          $current_votes += 1;
          echo $current_votes;

          // Insert the new value back into the `votes` table
          $update = 'UPDATE votes SET num_of_votes=' . $current_votes . ' WHERE headline_id="' . $headline_id . '";';
          if (mysqli_query($conn, $update)) {
            echo "Update successful.";
          }
          else {
            echo "Update not successful.";
          }
        }
      }
      else {
        echo "The headline ID already exists.";
      }
    }
    else {
      //echo "Do not match";
    }
  }

  /*
  // Compare each text column's value in the DB to the headline
  foreach ($resultArr as $result) {
    // If the comparison is true, assign the value of the row's ID
    if ($result => $text == $headline) {
      $headline_id = $result => $id;
    }
  }
  */
  //echo json_encode($resultArr);
} else {
  echo mysqli_error($conn);
}

/*
// Insert the increased votes amount into the votes table
// if the headline ID does not exist
$insert = "INSERT INTO votes(headline_id, num_of_votes) VALUES('" . $headline_id . "','" . $votes . "');";
if (mysqli_query($conn, $insert)) {
  //echo "Insert successful.";
} else {
  echo mysqli_error($conn);
}

// if the headline ID does exist
$insert = "INSERT INTO votes(num_of_votes) VALUES('" . $votes . "');";
if (mysqli_query($conn, $insert)) {
  //echo "Insert successful.";
} else {
  echo mysqli_error($conn);
}
*/

mysqli_close($conn);
?>