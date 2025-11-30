<?php
/**
 * Project Import Script
 * Import projects from CSV file
 *
 * USAGE:
 * 1. Upload CSV file to the plugin directory
 * 2. Update the $csv_file path below
 * 3. Run this file directly via browser or WP-CLI
 *
 * @package Saba_Projects
 */

// Load WordPress
require_once( dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . '/wp-load.php' );

// Security check
if ( ! current_user_can( 'manage_options' ) && php_sapi_name() !== 'cli' ) {
	wp_die( 'Unauthorized access' );
}

// Configuration
$csv_file = dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . '/projects_data.csv';
$dry_run  = false; // Set to true to test without importing

// Counters
$stats = array(
	'processed'   => 0,
	'imported'    => 0,
	'updated'     => 0,
	'skipped'     => 0,
	'errors'      => 0,
	'error_log'   => array(),
);

/**
 * Import projects from CSV
 */
function import_projects_from_csv( $csv_file, $dry_run = false ) {
	global $stats;

	// Check if file exists
	if ( ! file_exists( $csv_file ) ) {
		echo "Error: CSV file not found at: $csv_file\n";
		return false;
	}

	echo "=== Starting Project Import ===\n";
	echo "CSV File: $csv_file\n";
	echo "Dry Run: " . ( $dry_run ? 'Yes' : 'No' ) . "\n\n";

	// Open CSV file
	$handle = fopen( $csv_file, 'r' );
	if ( ! $handle ) {
		echo "Error: Could not open CSV file\n";
		return false;
	}

	// Skip header rows (based on the CSV structure)
	$line_number = 0;
	$header      = null;
	$current_panchayat = '';

	while ( ( $row = fgetcsv( $handle, 0, ',' ) ) !== false ) {
		$line_number++;

		// Skip empty rows
		if ( empty( array_filter( $row ) ) ) {
			continue;
		}

		// Detect panchayat name rows
		if ( stripos( $row[0], 'PANCHAYAT' ) !== false ) {
			// Extract panchayat name if needed
			continue;
		}

		// Detect header row
		if ( stripos( $row[0], 'S. No' ) !== false || stripos( $row[0], 'S.No' ) !== false ) {
			$header = $row;
			echo "Found header at line $line_number\n";
			continue;
		}

		// Skip summary/total rows
		if ( stripos( $row[0], 'TOTAL' ) !== false ) {
			continue;
		}

		// Skip if no valid S.No (serial number)
		if ( empty( $row[0] ) || ! is_numeric( trim( $row[0] ) ) ) {
			continue;
		}

		// Process project row
		$stats['processed']++;

		try {
			$project_data = parse_project_row( $row, $header );

			if ( $project_data ) {
				if ( ! $dry_run ) {
					$result = create_or_update_project( $project_data );

					if ( $result['success'] ) {
						if ( $result['action'] === 'created' ) {
							$stats['imported']++;
						} else {
							$stats['updated']++;
						}
						echo "."; // Progress indicator
					} else {
						$stats['errors']++;
						$stats['error_log'][] = "Line $line_number: " . $result['message'];
						echo "E";
					}
				} else {
					echo ".";
				}

				// Show progress every 50 projects
				if ( $stats['processed'] % 50 === 0 ) {
					echo " [{$stats['processed']}]\n";
				}
			} else {
				$stats['skipped']++;
				echo "S";
			}
		} catch ( Exception $e ) {
			$stats['errors']++;
			$stats['error_log'][] = "Line $line_number: " . $e->getMessage();
			echo "E";
		}
	}

	fclose( $handle );

	echo "\n\n=== Import Complete ===\n";
	echo "Processed: {$stats['processed']}\n";
	echo "Imported: {$stats['imported']}\n";
	echo "Updated: {$stats['updated']}\n";
	echo "Skipped: {$stats['skipped']}\n";
	echo "Errors: {$stats['errors']}\n";

	if ( ! empty( $stats['error_log'] ) ) {
		echo "\n=== Error Log ===\n";
		foreach ( $stats['error_log'] as $error ) {
			echo "$error\n";
		}
	}

	return true;
}

/**
 * Parse project row from CSV
 */
function parse_project_row( $row, $header ) {
	// Map CSV columns to project data
	// Based on structure: S.No, Habitation Name, Scheme Name, Year, Work Type, Work Description, Estimate Amount, Stage

	$habitation = isset( $row[1] ) ? sanitize_text_field( trim( $row[1] ) ) : '';
	$scheme     = isset( $row[2] ) ? sanitize_text_field( trim( $row[2] ) ) : '';
	$year       = isset( $row[3] ) ? sanitize_text_field( trim( $row[3] ) ) : '';
	$work_type  = isset( $row[4] ) ? sanitize_text_field( trim( $row[4] ) ) : '';
	$work_desc  = isset( $row[5] ) ? sanitize_text_field( trim( $row[5] ) ) : '';
	$budget     = isset( $row[6] ) ? sanitize_text_field( trim( $row[6] ) ) : '';
	$status     = isset( $row[7] ) ? sanitize_text_field( trim( $row[7] ) ) : '';

	// Skip if missing critical data
	if ( empty( $habitation ) || empty( $work_desc ) ) {
		return false;
	}

	// Clean budget amount (remove commas, spaces)
	$budget = preg_replace( '/[^0-9.]/', '', $budget );
	$budget = floatval( $budget );

	// Build project data
	return array(
		'title'       => $work_desc,
		'village'     => $habitation,
		'category'    => $work_type,
		'scheme'      => $scheme,
		'year'        => $year,
		'status'      => $status,
		'budget'      => $budget,
		'description' => $work_desc,
	);
}

/**
 * Create or update project
 */
function create_or_update_project( $data ) {
	// Check if project already exists
	$existing = get_page_by_title( $data['title'], OBJECT, 'project' );

	$post_data = array(
		'post_title'   => $data['title'],
		'post_content' => $data['description'],
		'post_status'  => 'publish',
		'post_type'    => 'project',
	);

	if ( $existing ) {
		// Update existing
		$post_data['ID'] = $existing->ID;
		$post_id         = wp_update_post( $post_data );
		$action          = 'updated';
	} else {
		// Create new
		$post_id = wp_insert_post( $post_data );
		$action  = 'created';
	}

	if ( is_wp_error( $post_id ) ) {
		return array(
			'success' => false,
			'message' => $post_id->get_error_message(),
		);
	}

	// Update post meta
	update_post_meta( $post_id, '_project_budget', $data['budget'] );
	update_post_meta( $post_id, '_project_title_english', $data['title'] );
	update_post_meta( $post_id, '_project_description_english', $data['description'] );

	// Assign taxonomies
	if ( ! empty( $data['village'] ) ) {
		wp_set_object_terms( $post_id, $data['village'], 'project_village', false );
	}

	if ( ! empty( $data['category'] ) ) {
		wp_set_object_terms( $post_id, $data['category'], 'project_category', false );
	}

	if ( ! empty( $data['scheme'] ) ) {
		wp_set_object_terms( $post_id, $data['scheme'], 'project_scheme', false );
	}

	if ( ! empty( $data['year'] ) ) {
		wp_set_object_terms( $post_id, $data['year'], 'project_year', false );
	}

	if ( ! empty( $data['status'] ) ) {
		wp_set_object_terms( $post_id, $data['status'], 'project_status', false );
	}

	return array(
		'success' => true,
		'action'  => $action,
		'post_id' => $post_id,
	);
}

// Run import
import_projects_from_csv( $csv_file, $dry_run );

echo "\n=== Import Script Complete ===\n";
