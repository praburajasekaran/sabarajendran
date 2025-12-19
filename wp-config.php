<?php

define('ITSEC_ENCRYPTION_KEY', 'JEZOdW1Ue0ZdUWhQcXtAelF1I1B0PXpnYmFYKkBEQVpxVmVXYk14X0ojQGdPZzBJfSUyTCsoSXIxfmRQcTQtWA==');

/**
 * WordPress Configuration for Saba Rajendran MLA Project
 */

// ** Database settings - MAMP ** //
// define('WPCACHEHOME', '/Applications/MAMP/htdocs/sabarajendran/wp-content/plugins/wp-super-cache/');
define('DB_NAME', 'sabarajendran');
define('DB_USER', 'root');
define('DB_PASSWORD', 'root');
define('DB_HOST', '127.0.0.1:8889');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

/**#@+
 * Authentication unique keys and salts.
 */
define('AUTH_KEY', 'J,2.!JK{BV=IIhC8>3k616g0/=FghMVex-k;(7ZlMJ02<_Ll}Gi387:E:~Wp*TIU');
define('SECURE_AUTH_KEY', 'hMBGdb &W-ttxf#s}!4WRe/WjjOh=Os%Hc&s=x+0#A^(L+G|-j{%2L&9{||PDJe3');
define('LOGGED_IN_KEY', 'D1XR MqJOR>u<G)}=&g.AihkQ{zDY>*5:2]Fdce+|j^86F2561@9wKuP(Ww~ooOb');
define('NONCE_KEY', 'NX3tKx1uSR Rj/IMc~8?R2lK;BJZrk19K#lHVR ^dM$QMeD=1o:2:lXJi?}|8jLr');
define('AUTH_SALT', '3LC-s3;gF5844cg2ckM*|%yN/!IE2t?L% k}XtepmI<-!|mV>mrHEy}3yo>H+w< ');
define('SECURE_AUTH_SALT', 'iYE<A-jZ6uvYH*e&T;;wjHRAUwUN%$(x9r%g4?Bb:M=SS@^Q&M)l23rQ.8+A}[wx');
define('LOGGED_IN_SALT', 'C_7VyvpZZl|QB,Fr;] xt:E&n|bE[vms]{te{S]DRBd.|8lZ#y?VGonk2+o;1A?>');
define('NONCE_SALT', 'S1jFNEZ5oKf=ER+boveiNP}.2m>msQ _)c-Q<=6_tT`yH 3?VJ<54^H3|z@/izpL');

/**#@-*/

/**
 * WordPress database table prefix.
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 */
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Handle PHP built-in server URL
if (php_sapi_name() === 'cli-server') {
    define('WP_SITEURL', 'http://' . $_SERVER['HTTP_HOST']);
    define('WP_HOME', 'http://' . $_SERVER['HTTP_HOST']);
} else {
    // For MAMP/Apache
    define('WP_SITEURL', 'http://localhost:8118/sabarajendran');
    define('WP_HOME', 'http://localhost:8118/sabarajendran');
}

// Suppress deprecation notices to prevent JSON response corruption
@ini_set('display_errors', 0);
// Only log critical errors, warnings, and notices (exclude deprecation notices)
if (WP_DEBUG) {
    error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
}

/* Add any custom values between this line and the "stop editing" line. */

// ===================================================================
// SECURITY HARDENING - DO NOT MODIFY
// ===================================================================

// Note: DISALLOW_FILE_EDIT is already defined by iThemes Security above (line 5)

// Disable File Modifications (Plugin/Theme Install/Update)
define('DISALLOW_FILE_MODS', false); // Set to true for maximum security after site setup

// Force SSL for Admin and Login
define('FORCE_SSL_ADMIN', false); // Set to true when SSL certificate is installed

// Disable XML-RPC (common attack vector) - using constant instead of filter
define('XMLRPC_ENABLED', false);

// Limit Post Revisions
define('WP_POST_REVISIONS', 5);

// Set Autosave Interval (in seconds)
define('AUTOSAVE_INTERVAL', 160);

// Increase Memory Limit for Security Scans
define('WP_MEMORY_LIMIT', '512M');
define('WP_MAX_MEMORY_LIMIT', '1024M');

// Block External HTTP Requests (disabled for local development)
define('WP_HTTP_BLOCK_EXTERNAL', false);
define('WP_ACCESSIBLE_HOSTS', 'api.wordpress.org,*.github.com,tan-emu-358425.hostingersite.com,sabarajendran.com,control.msg91.com,*.msg91.com');

// Disable Plugin and Theme Update/Installation
// define( 'DISALLOW_FILE_MODS', true ); // Uncomment after all plugins installed

define('OPENROUTER_API_KEY', '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');


// Security Headers (additional layer)
header('X-Frame-Options: SAMEORIGIN');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// CORS Headers for React Frontend
header('Access-Control-Allow-Origin: http://localhost:3003');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// ===================================================================

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
