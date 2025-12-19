<?php
require 'wp-config.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, 8889);
if ($conn->connect_error) {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
}

$sql = "SELECT * FROM wp_usermeta WHERE user_id = 0";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "Found " . $result->num_rows . " orphan meta rows for user_id 0:\n";
    while ($row = $result->fetch_assoc()) {
        echo $row['meta_key'] . "\n";
    }
} else {
    echo "No meta rows found for user_id 0";
}
?>