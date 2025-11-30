<?php
if (function_exists('apache_get_modules')) {
    $modules = apache_get_modules();
    if (in_array('mod_rewrite', $modules)) {
        echo "mod_rewrite is ENABLED";
    } else {
        echo "mod_rewrite is DISABLED";
    }
} else {
    echo "apache_get_modules() not available. PHP might be running as CGI/FPM.";
}
