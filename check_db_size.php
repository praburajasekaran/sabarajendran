<?php
require 'wp-config.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, 8889);
if ($conn->connect_error) {
    // try default port
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
}

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT table_name AS `Table`, round(((data_length + index_length) / 1024 / 1024), 2) `Size_MB` FROM information_schema.TABLES WHERE table_schema = '" . DB_NAME . "' ORDER BY (data_length + index_length) DESC LIMIT 20;";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "Top 20 Tables by Size:\n";
    echo str_pad("Table", 40) . "Size (MB)\n";
    echo str_repeat("-", 50) . "\n";
    while ($row = $result->fetch_assoc()) {
        echo str_pad($row["Table"], 40) . $row["Size_MB"] . "\n";
    }
} else {
    echo "0 results";
}
$conn->close();
?>