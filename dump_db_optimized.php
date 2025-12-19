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
$port = 8889;
if (strpos($host, ':') !== false) {
    $parts = explode(':', $host);
    $host = $parts[0];
    if (isset($parts[1]) && is_numeric($parts[1])) {
        $port = $parts[1];
    }
}
if ($host === 'localhost') {
    $host = '127.0.0.1';
}

$conf = "[client]\nuser=\"$db_user\"\npassword=\"$db_password\"\n";
$confFile = tempnam(sys_get_temp_dir(), 'mycnf');
file_put_contents($confFile, $conf);

// Tables to exclude (data only, keep structure if needed, but for logs usually structure is standard or recreated by plugin)
// Actually better to ignore-table completely for logs to keep file small
$ignore = "--ignore-table=$db_name.wp_itsec_logs --ignore-table=$db_name.wp_actionscheduler_logs --ignore-table=$db_name.wp_actionscheduler_claims --ignore-table=$db_name.wp_itsec_distributed_storage";
// Add other Wordfence stuff if present, but itsec (iThemes Security) seems to be the culprit.

$cmd = "$mysqldump --defaults-extra-file=$confFile -h $host -P $port --hex-blob --opt $ignore $db_name | gzip > sabarajendran_live_dump_optimized.sql.gz";

echo "Running: $cmd\n";
system($cmd, $retval);
unlink($confFile);

if ($retval === 0) {
    echo "Database dumped and zipped successfully to sabarajendran_live_dump_optimized.sql.gz";
} else {
    echo "Database dump failed with code $retval";
}
?>