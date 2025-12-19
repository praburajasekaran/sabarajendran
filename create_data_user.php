<?php
require('wp-load.php');

$username = 'data_entry';
$password = 'DataEntry@2025';
$email = 'data_entry@example.com';

if (username_exists($username)) {
    echo "User $username already exists.";
} else {
    $user_id = wp_create_user($username, $password, $email);
    if (is_wp_error($user_id)) {
        echo "Error: " . $user_id->get_error_message();
    } else {
        $user = new WP_User($user_id);
        $user->set_role('administrator');
        echo "User $username created successfully with ID: $user_id";
    }
}
