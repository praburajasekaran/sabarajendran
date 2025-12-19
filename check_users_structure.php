<?php
require 'wp-config.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, 8889);
if ($conn->connect_error) {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
}

$result = $conn->query("DESCRIBE wp_users");
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>