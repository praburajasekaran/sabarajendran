<?php
require 'wp-config.php';
$mysqldump = '/Applications/MAMP/Library/bin/mysql80/bin/mysqldump';
if (!file_exists($mysqldump)) {
    $mysqldump = '/Applications/MAMP/Library/bin/mysql57/bin/mysqldump';
}

$db_user = DB_USER;
$db_password = DB_PASSWORD;
$db_name = DB_NAME;

// Handle Host and Port
$host = DB_HOST;
$port = 8889; // MAMP default
if (strpos($host, ':') !== false) {
    $parts = explode(':', $host);
    $host = $parts[0];
    if (isset($parts[1]) && is_numeric($parts[1])) {
        $port = $parts[1];
    }
}
if ($host === 'localhost') {
    $host = '127.0.0.1'; // Force TCP/IP to use port
}

$conf = "[client]\nuser=\"$db_user\"\npassword=\"$db_password\"\n";
$confFile = tempnam(sys_get_temp_dir(), 'mycnf');
file_put_contents($confFile, $conf);

$cmd = "$mysqldump --defaults-extra-file=$confFile -h $host -P $port $db_name > sabarajendran_live_dump.sql";

echo "Running: $cmd\n";
system($cmd, $retval);
unlink($confFile);

if ($retval === 0) {
    echo "Database dumped successfully to sabarajendran_live_dump.sql";
} else {
    echo "Database dump failed with code $retval";
}
?>