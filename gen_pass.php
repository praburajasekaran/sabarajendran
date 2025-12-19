<?php
require('wp-load.php');
$password = 'DataEntry@2025';
$hash = wp_hash_password($password);
echo "Hash: " . $hash;
?>