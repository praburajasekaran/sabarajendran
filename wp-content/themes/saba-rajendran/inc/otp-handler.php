<?php
/**
 * MSG91 OTP Handler
 * Handles OTP sending, verification, and rate limiting
 */

if (!defined('ABSPATH')) {
    exit;
}

// MSG91 Configuration
define('MSG91_AUTH_KEY', '482113AL5vggVqbK693bf446P1');
define('MSG91_TEMPLATE_ID', '693bf2b85039190dff64c134');
define('MSG91_OTP_EXPIRY', 15); // minutes
define('MAX_SUBMISSIONS_PER_DAY', 3);
define('MAX_RESEND_ATTEMPTS', 5);

/**
 * Send OTP via MSG91 API
 */
function msg91_send_otp($phone_number)
{
    // Validate phone number (Indian format: 10 digits, starts with 6-9)
    if (!preg_match('/^[6-9]\d{9}$/', $phone_number)) {
        return new WP_Error('invalid_phone', 'Invalid phone number format', array('status' => 400));
    }

    // Check rate limit
    $rate_limit_check = check_submission_rate_limit($phone_number);
    if (is_wp_error($rate_limit_check)) {
        return $rate_limit_check;
    }

    // Check if there's an existing session
    $existing_session = get_transient('otp_session_' . $phone_number);
    if ($existing_session && isset($existing_session['resend_count']) && $existing_session['resend_count'] >= MAX_RESEND_ATTEMPTS) {
        return new WP_Error('max_resend_exceeded', 'Maximum resend attempts exceeded. Please try again later.', array('status' => 429));
    }

    // Prepare MSG91 API request
    $url = 'https://control.msg91.com/api/v5/otp';

    $body = array(
        'flow_id' => MSG91_TEMPLATE_ID,  // MSG91 now uses flow_id instead of template_id
        'mobile' => '91' . $phone_number,
        'otp_expiry' => MSG91_OTP_EXPIRY
    );

    // Make API request
    $response = wp_remote_post($url, array(
        'headers' => array(
            'authkey' => MSG91_AUTH_KEY,
            'Content-Type' => 'application/json'
        ),
        'body' => json_encode($body),
        'timeout' => 15
    ));

    if (is_wp_error($response)) {
        error_log('MSG91 Send OTP Error: ' . $response->get_error_message());
        return new WP_Error('api_error', 'Failed to send OTP: ' . $response->get_error_message(), array('status' => 500));
    }

    $response_code = wp_remote_retrieve_response_code($response);
    $response_body = json_decode(wp_remote_retrieve_body($response), true);

    // Log the response for debugging
    error_log('MSG91 Send OTP Response Code: ' . $response_code);
    error_log('MSG91 Send OTP Response Body: ' . print_r($response_body, true));

    if ($response_code !== 200) {
        return new WP_Error('msg91_error', 'MSG91 API error: ' . ($response_body['message'] ?? 'Unknown error'), array('status' => $response_code));
    }

    // Store OTP session
    $session_id = $response_body['request_id'] ?? uniqid('otp_', true);
    $expires_at = time() + (MSG91_OTP_EXPIRY * 60);

    $session_data = array(
        'session_id' => $session_id,
        'sent_at' => time(),
        'expires_at' => $expires_at,
        'attempts' => 0,
        'resend_count' => $existing_session ? ($existing_session['resend_count'] + 1) : 0
    );

    set_transient('otp_session_' . $phone_number, $session_data, MSG91_OTP_EXPIRY * 60);

    return array(
        'success' => true,
        'session_id' => $session_id,
        'expires_at' => $expires_at,
        'resend_count' => $session_data['resend_count']
    );
}

/**
 * Verify OTP via MSG91 API
 */
function msg91_verify_otp($phone_number, $otp)
{
    // Validate inputs
    if (!preg_match('/^[6-9]\d{9}$/', $phone_number)) {
        return new WP_Error('invalid_phone', 'Invalid phone number format', array('status' => 400));
    }

    if (!preg_match('/^\d{4,6}$/', $otp)) {
        return new WP_Error('invalid_otp', 'Invalid OTP format', array('status' => 400));
    }

    // Check if session exists
    $session = get_transient('otp_session_' . $phone_number);
    if (!$session) {
        return new WP_Error('session_expired', 'OTP session expired. Please request a new OTP.', array('status' => 400));
    }

    // Check if OTP is expired
    if (time() > $session['expires_at']) {
        delete_transient('otp_session_' . $phone_number);
        return new WP_Error('otp_expired', 'OTP has expired. Please request a new OTP.', array('status' => 400));
    }

    // Increment attempts
    $session['attempts']++;
    set_transient('otp_session_' . $phone_number, $session, MSG91_OTP_EXPIRY * 60);

    // Prepare MSG91 verify request
    $url = 'https://control.msg91.com/api/v5/otp/verify?' . http_build_query(array(
        'mobile' => '91' . $phone_number,
        'otp' => $otp
    ));

    $response = wp_remote_get($url, array(
        'headers' => array(
            'authkey' => MSG91_AUTH_KEY
        ),
        'timeout' => 15
    ));

    if (is_wp_error($response)) {
        return new WP_Error('api_error', 'Failed to verify OTP: ' . $response->get_error_message(), array('status' => 500));
    }

    $response_code = wp_remote_retrieve_response_code($response);
    $response_body = json_decode(wp_remote_retrieve_body($response), true);

    if ($response_code !== 200 || (isset($response_body['type']) && $response_body['type'] === 'error')) {
        return new WP_Error('invalid_otp', 'Invalid OTP. Please try again.', array('status' => 400));
    }

    // OTP verified successfully
    // Generate verification token
    $verification_token = wp_hash($phone_number . time() . wp_generate_password(20, false));

    // Store verification status
    set_transient('otp_verified_' . $phone_number, array(
        'verified_at' => time(),
        'verification_token' => $verification_token
    ), 30 * 60); // Valid for 30 minutes

    // Clean up session
    delete_transient('otp_session_' . $phone_number);

    return array(
        'success' => true,
        'verification_token' => $verification_token
    );
}

/**
 * Resend OTP via MSG91 API
 */
function msg91_resend_otp($phone_number)
{
    // Validate phone number
    if (!preg_match('/^[6-9]\d{9}$/', $phone_number)) {
        return new WP_Error('invalid_phone', 'Invalid phone number format', array('status' => 400));
    }

    // Check existing session
    $session = get_transient('otp_session_' . $phone_number);
    if (!$session) {
        return new WP_Error('no_session', 'No active OTP session. Please request a new OTP.', array('status' => 400));
    }

    // Check resend limit
    if ($session['resend_count'] >= MAX_RESEND_ATTEMPTS) {
        return new WP_Error('max_resend_exceeded', 'Maximum resend attempts (' . MAX_RESEND_ATTEMPTS . ') exceeded. Please try again later.', array('status' => 429));
    }

    // Prepare MSG91 resend request
    $url = 'https://control.msg91.com/api/v5/otp/retry';
    $headers = array(
        'authkey' => MSG91_AUTH_KEY,
        'content-type' => 'application/json'
    );

    $body = json_encode(array(
        'mobile' => '91' . $phone_number,
        'retrytype' => 'text'
    ));

    $response = wp_remote_post($url, array(
        'headers' => $headers,
        'body' => $body,
        'timeout' => 15
    ));

    if (is_wp_error($response)) {
        return new WP_Error('api_error', 'Failed to resend OTP: ' . $response->get_error_message(), array('status' => 500));
    }

    $response_code = wp_remote_retrieve_response_code($response);
    $response_body = json_decode(wp_remote_retrieve_body($response), true);

    if ($response_code !== 200) {
        return new WP_Error('msg91_error', 'MSG91 API error: ' . ($response_body['message'] ?? 'Unknown error'), array('status' => $response_code));
    }

    // Update session with new expiry and increment resend count
    $expires_at = time() + (MSG91_OTP_EXPIRY * 60);
    $session['expires_at'] = $expires_at;
    $session['resend_count']++;
    $session['sent_at'] = time();

    set_transient('otp_session_' . $phone_number, $session, MSG91_OTP_EXPIRY * 60);

    return array(
        'success' => true,
        'expires_at' => $expires_at,
        'resend_count' => $session['resend_count']
    );
}

/**
 * Check submission rate limit (3 submissions per 24 hours)
 */
function check_submission_rate_limit($phone_number)
{
    $transient_key = 'submission_count_' . $phone_number;
    $submission_data = get_transient($transient_key);

    if (!$submission_data) {
        // No previous submissions
        return true;
    }

    // Filter submissions within last 24 hours
    $cutoff_time = time() - (24 * 60 * 60);
    $recent_submissions = array_filter($submission_data['submissions'], function ($timestamp) use ($cutoff_time) {
        return $timestamp > $cutoff_time;
    });

    if (count($recent_submissions) >= MAX_SUBMISSIONS_PER_DAY) {
        return new WP_Error('rate_limit_exceeded', 'You have reached the maximum number of submissions (' . MAX_SUBMISSIONS_PER_DAY . ') for today. Please try again tomorrow.', array('status' => 429));
    }

    return true;
}

/**
 * Increment submission count
 */
function increment_submission_count($phone_number)
{
    $transient_key = 'submission_count_' . $phone_number;
    $submission_data = get_transient($transient_key);

    if (!$submission_data) {
        $submission_data = array(
            'count' => 0,
            'submissions' => array()
        );
    }

    // Add current timestamp
    $submission_data['submissions'][] = time();
    $submission_data['count'] = count($submission_data['submissions']);

    // Store for 24 hours
    set_transient($transient_key, $submission_data, 24 * 60 * 60);
}

/**
 * Validate verification token
 */
function validate_verification_token($phone_number, $verification_token)
{
    $verification_data = get_transient('otp_verified_' . $phone_number);

    if (!$verification_data) {
        return false;
    }

    return $verification_data['verification_token'] === $verification_token;
}

/**
 * Register REST API Endpoints
 */
function saba_rajendran_register_otp_api()
{
    // Send OTP
    register_rest_route('sabarajendran/v1', '/send-otp', array(
        'methods' => array('POST', 'OPTIONS'),
        'callback' => 'saba_rajendran_handle_send_otp',
        'permission_callback' => '__return_true',
    ));

    // Verify OTP
    register_rest_route('sabarajendran/v1', '/verify-otp', array(
        'methods' => array('POST', 'OPTIONS'),
        'callback' => 'saba_rajendran_handle_verify_otp',
        'permission_callback' => '__return_true',
    ));

    // Resend OTP
    register_rest_route('sabarajendran/v1', '/resend-otp', array(
        'methods' => array('POST', 'OPTIONS'),
        'callback' => 'saba_rajendran_handle_resend_otp',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'saba_rajendran_register_otp_api');

/**
 * Handle Send OTP Request
 */
function saba_rajendran_handle_send_otp($request)
{
    if ($request->get_method() === 'OPTIONS') {
        return new WP_REST_Response(null, 200);
    }

    $phone = sanitize_text_field($request->get_param('phone'));

    if (empty($phone)) {
        return new WP_Error('missing_phone', 'Phone number is required', array('status' => 400));
    }

    $result = msg91_send_otp($phone);

    if (is_wp_error($result)) {
        return $result;
    }

    return new WP_REST_Response($result, 200);
}

/**
 * Handle Verify OTP Request
 */
function saba_rajendran_handle_verify_otp($request)
{
    if ($request->get_method() === 'OPTIONS') {
        return new WP_REST_Response(null, 200);
    }

    $phone = sanitize_text_field($request->get_param('phone'));
    $otp = sanitize_text_field($request->get_param('otp'));

    if (empty($phone) || empty($otp)) {
        return new WP_Error('missing_fields', 'Phone number and OTP are required', array('status' => 400));
    }

    $result = msg91_verify_otp($phone, $otp);

    if (is_wp_error($result)) {
        return $result;
    }

    return new WP_REST_Response($result, 200);
}

/**
 * Handle Resend OTP Request
 */
function saba_rajendran_handle_resend_otp($request)
{
    if ($request->get_method() === 'OPTIONS') {
        return new WP_REST_Response(null, 200);
    }

    $phone = sanitize_text_field($request->get_param('phone'));

    if (empty($phone)) {
        return new WP_Error('missing_phone', 'Phone number is required', array('status' => 400));
    }

    $result = msg91_resend_otp($phone);

    if (is_wp_error($result)) {
        return $result;
    }

    return new WP_REST_Response($result, 200);
}
