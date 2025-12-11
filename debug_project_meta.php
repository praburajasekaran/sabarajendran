<?php
require_once('wp-load.php');

$args = array(
    'post_type' => 'project',
    'posts_per_page' => 1,
);

$query = new WP_Query($args);

if ($query->have_posts()) {
    while ($query->have_posts()) {
        $query->the_post();
        $id = get_the_ID();
        echo "ID: " . $id . "\n";
        echo "Title: " . get_the_title() . "\n";
        echo "Content: " . get_the_content() . "\n";
        echo "Meta _project_description_english: " . get_post_meta($id, '_project_description_english', true) . "\n";
        echo "Meta _project_description_tamil: " . get_post_meta($id, '_project_description_tamil', true) . "\n";
        echo "Meta _project_title_english: " . get_post_meta($id, '_project_title_english', true) . "\n";
        echo "Meta _project_title_tamil: " . get_post_meta($id, '_project_title_tamil', true) . "\n";
    }
} else {
    echo "No projects found.\n";
}
