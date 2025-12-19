<?php
require('wp-load.php');

$username = 'data_entry';
$user = get_user_by('login', $username);
if ($user) {
    echo "User exists. ID: " . $user->ID . "\n";
    // Reset password to be sure
    wp_set_password('DataEntry@2025', $user->ID);
    echo "Password reset.\n";
} else {
    echo "User does not exist. Creating...\n";
    $user_id = wp_create_user('data_entry', 'DataEntry@2025', 'data_entry@example.com');
    if (is_wp_error($user_id)) {
        echo "Error: " . $user_id->get_error_message() . "\n";
    } else {
        echo "User created. ID: " . $user_id . "\n";
        $u = new WP_User($user_id);
        $u->set_role('administrator');
    }
}
