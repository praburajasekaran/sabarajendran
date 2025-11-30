<?php
/**
 * Test if WordPress is receiving the request
 * This file will help us determine if Apache is routing to WordPress
 */

// Create a simple test file
file_put_contents(__DIR__ . '/test-rewrite.php', '<?php echo "Rewrite test successful!"; ?>');

echo "Test file created at: " . __DIR__ . "/test-rewrite.php\n";
echo "Try accessing: http://localhost:8118/sabarajendran/test-rewrite.php\n\n";

// Now let's check if we can access index.php with query parameters
echo "Also try: http://localhost:8118/sabarajendran/index.php?post_type=project\n";
echo "This will test if WordPress can handle the project archive directly.\n";
