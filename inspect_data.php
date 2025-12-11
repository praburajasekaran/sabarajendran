<?php
require_once('wp-config.php');
require_once('wp-load.php');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check for post types
$sql = "SELECT DISTINCT post_type FROM wp_posts";
$result = $conn->query($sql);

$types = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $types[] = $row['post_type'];
    }
}

// Get sample posts of type 'project' or 'post'
$target_type = in_array('project', $types) ? 'project' : 'post';
$sql = "SELECT ID, post_title, post_content, post_status FROM wp_posts WHERE post_type = '$target_type' AND post_status = 'publish' LIMIT 5";
$result = $conn->query($sql);

$posts = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
}

echo json_encode(['types' => $types, 'sample_posts' => $posts], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
$conn->close();
?>