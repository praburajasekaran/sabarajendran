#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MySQL Database Description Cleanup Script
Removes redundant village/panchayat/location names from project descriptions
in both English and Tamil languages
"""

import subprocess
import re
import sys
import json
from collections import defaultdict

# Database configuration
MYSQL_PATH = '/Applications/MAMP/Library/bin/mysql80/bin/mysql'
DB_USER = 'root'
DB_PASS = 'root'
DB_NAME = 'sabarajendran'

def clean_tamil_description(description, village, panchayat):
    """
    Clean redundant village/panchayat names from Tamil description.
    Uses comprehensive pattern matching to remove location references
    anywhere in the text since village names are stored in English
    but descriptions use Tamil/transliterated versions.

    Args:
        description: Tamil description text
        village: Village/habitation name (in English)
        panchayat: Panchayat name (in English)

    Returns:
        Cleaned Tamil description
    """
    if not description:
        return description

    original = description

    # Pattern 1: Remove "[location name], [panchayat] பஞ்சாயத்தில்" patterns
    # Examples:
    # - "எரிபாளையம், சிறுவாத்தூர் பஞ்சாயத்தில்" -> ""
    # - "திருவாமூர், திருவாமூர் பஞ்சாயத்தில்" -> ""
    description = re.sub(r',\s*[\u0B80-\u0BFFa-zA-Z\s\.]+\s+பஞ்சாயத்தில்[\s\.]', ' ', description)
    description = re.sub(r',\s*[\u0B80-\u0BFFa-zA-Z\s\.]+\s+பஞ்சாயத்தில்$', '', description)

    # Pattern 2: Remove standalone "பஞ்சாயத்தில்." at the end
    description = re.sub(r',?\s*பஞ்சாயத்தில்\.$', '', description)
    description = re.sub(r'\s+பஞ்சாயத்தில்\.$', '', description)

    # Pattern 3: Remove "[Tamil word/phrase] பஞ்சாயத்தில்" anywhere
    # This handles cases like "வேகாகொள்ளை பஞ்சாயத்தில்"
    description = re.sub(r'[\u0B80-\u0BFFa-zA-Z\.]+\s+பஞ்சாயத்தில்\s+', '', description)
    description = re.sub(r'[\u0B80-\u0BFFa-zA-Z\.]+\s+பஞ்சாயத்தில்,', '', description)

    # Pattern 4: Remove "பாஞ்சாயத்து" variations (alternate spelling)
    description = re.sub(r'[\u0B80-\u0BFFa-zA-Z\.]+\s+பாஞ்சாயத்து\s+', '', description)

    # Pattern 5: Remove at start of sentence
    description = re.sub(r'^[\u0B80-\u0BFFa-zA-Z\s]+\s+ஊராட்சி\s+', '', description)
    description = re.sub(r'^[\u0B80-\u0BFFa-zA-Z\s]+\s+ஊராட்சியில்\s+', '', description)
    description = re.sub(r'^[\u0B80-\u0BFFa-zA-Z\s]+\s+பஞ்சாயத்தில்\s+', '', description)
    description = re.sub(r'^[\u0B80-\u0BFFa-zA-Z\s]+\s+பஞ்சாயத்து\s+', '', description)

    # Pattern 6: Remove standalone patterns
    description = re.sub(r"^ஊராட்சி\s+", "", description)
    description = re.sub(r"^ஊராட்சியில்\s+", "", description)
    description = re.sub(r"^பஞ்சாயத்தில்\s+", "", description)
    description = re.sub(r"^கிராமத்தில்\s+", "", description)

    # Pattern 7: Remove "பண்ருட்டி வட்டம், [location] பஞ்சாயத்தில்" patterns
    description = re.sub(r'பண்ருட்டி\s+வட்டம்,\s*[\u0B80-\u0BFFa-zA-Z\s\.]+\s+பஞ்சாயத்தில்\s+', '', description)

    # Normalize whitespace and clean up commas
    description = re.sub(r'\s+', ' ', description).strip()
    description = re.sub(r'^\s*,\s*', '', description)  # Remove leading comma
    description = re.sub(r'\s*,\s*$', '', description)  # Remove trailing comma
    description = re.sub(r',\s*,', ',', description)    # Remove double commas

    return description

def clean_english_description(description, village, panchayat):
    """
    Clean redundant village/panchayat names from English description.

    Args:
        description: English description text
        village: Village/habitation name
        panchayat: Panchayat name

    Returns:
        Cleaned English description
    """
    if not description:
        return description

    original = description

    # Normalize names
    village = village.strip() if village else ""
    panchayat = panchayat.strip() if panchayat else ""

    # Pattern 1: Remove "in [Location] Panchayat" variations
    for location in [village, panchayat]:
        if location:
            # Case-insensitive patterns
            # "in Location Panchayat"
            pattern1 = f"\\sin\\s+{re.escape(location)}\\s+[Pp]anchayat"
            description = re.sub(pattern1, "", description, flags=re.IGNORECASE)

            # "at Location Panchayat"
            pattern2 = f"\\sat\\s+{re.escape(location)}\\s+[Pp]anchayat"
            description = re.sub(pattern2, "", description, flags=re.IGNORECASE)

            # "@ Location" at the end or before "Panchayat"
            pattern3 = f"\\s*@\\s*{re.escape(location)}(?:\\s+[Pp]anchayat)?"
            description = re.sub(pattern3, "", description, flags=re.IGNORECASE)

    # Pattern 2: Clean up "in Panruti Block" redundancy
    # If both location and "in Panruti Block" exist, keep only "in Panruti Block"
    if village or panchayat:
        # This catches "at X Panchayat in Panruti Block" -> "in Panruti Block"
        description = re.sub(r"\s+in\s+Panruti\s+Block", " in Panruti Block", description, flags=re.IGNORECASE)

    # Pattern 3: Clean up trailing @ with location
    description = re.sub(r"\s*@\s*[A-Za-z\s]+$", "", description)

    # Normalize whitespace and clean up multiple spaces
    description = re.sub(r'\s+', ' ', description).strip()

    # Clean up trailing/leading commas or periods that may be left over
    description = re.sub(r'^[,.\s]+', '', description)
    description = re.sub(r'[,.\s]+$', '', description)

    return description

def run_mysql_query(query):
    """
    Execute a MySQL query and return results.

    Args:
        query: SQL query string

    Returns:
        Query output as string
    """
    cmd = [
        MYSQL_PATH,
        '-u', DB_USER,
        f'-p{DB_PASS}',
        '-e', query,
        DB_NAME
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        raise Exception(f"MySQL query failed: {result.stderr}")

    return result.stdout

def get_project_data(limit=None):
    """
    Fetch all projects with their descriptions and taxonomy terms.

    Args:
        limit: Optional limit for number of projects (for testing)

    Returns:
        List of project dictionaries
    """
    # Build query with optional limit
    query = """
        SELECT
            p.ID,
            COALESCE(MAX(CASE WHEN pm.meta_key = '_project_description_english' THEN pm.meta_value END), '') as english_desc,
            COALESCE(MAX(CASE WHEN pm.meta_key = '_project_description_tamil' THEN pm.meta_value END), '') as tamil_desc,
            COALESCE((SELECT t.name FROM wp_term_relationships tr
             JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
             JOIN wp_terms t ON tt.term_id = t.term_id
             WHERE tr.object_id = p.ID AND tt.taxonomy = 'project_village'
             LIMIT 1), '') as village,
            COALESCE((SELECT t.name FROM wp_term_relationships tr
             JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
             JOIN wp_terms t ON tt.term_id = t.term_id
             WHERE tr.object_id = p.ID AND tt.taxonomy = 'project_panchayat'
             LIMIT 1), '') as panchayat
        FROM wp_posts p
        LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id
        WHERE p.post_type = 'project'
          AND pm.meta_key IN ('_project_description_english', '_project_description_tamil')
        GROUP BY p.ID
    """

    if limit:
        query += f" LIMIT {limit}"

    query += ";"

    output = run_mysql_query(query)

    # Parse the output
    projects = []
    lines = output.strip().split('\n')

    if len(lines) <= 1:
        return projects

    # Skip header row
    for line in lines[1:]:
        fields = line.split('\t')
        if len(fields) >= 5:
            projects.append({
                'id': int(fields[0]),
                'english_desc': fields[1],
                'tamil_desc': fields[2],
                'village': fields[3],
                'panchayat': fields[4]
            })

    return projects

def update_project_description(project_id, meta_key, new_value):
    """
    Update a project's description in the database.

    Args:
        project_id: Project ID
        meta_key: Meta key ('_project_description_english' or '_project_description_tamil')
        new_value: New description value
    """
    # Escape single quotes in the value
    escaped_value = new_value.replace("'", "\\'").replace('"', '\\"')

    query = f"""
        UPDATE wp_postmeta
        SET meta_value = '{escaped_value}'
        WHERE post_id = {project_id} AND meta_key = '{meta_key}';
    """

    run_mysql_query(query)

def process_projects(dry_run=True, limit=None):
    """
    Process all projects and clean their descriptions.

    Args:
        dry_run: If True, don't commit changes to database
        limit: Optional limit for number of projects

    Returns:
        Statistics dictionary
    """
    stats = {
        'total_projects': 0,
        'english_modified': 0,
        'tamil_modified': 0,
        'english_chars_saved': 0,
        'tamil_chars_saved': 0,
        'examples': []
    }

    # Get all projects
    projects = get_project_data(limit)
    stats['total_projects'] = len(projects)

    print(f"Processing {len(projects)} projects...")
    print()

    # Process each project
    for project in projects:
        english_modified = False
        tamil_modified = False

        # Clean English description
        if project['english_desc']:
            cleaned_english = clean_english_description(
                project['english_desc'],
                project['village'],
                project['panchayat']
            )

            if cleaned_english != project['english_desc']:
                english_modified = True
                stats['english_modified'] += 1
                chars_saved = len(project['english_desc']) - len(cleaned_english)
                stats['english_chars_saved'] += chars_saved

                if not dry_run:
                    update_project_description(
                        project['id'],
                        '_project_description_english',
                        cleaned_english
                    )

                # Store examples (first 5 of each language)
                if len([e for e in stats['examples'] if e['lang'] == 'english']) < 5:
                    stats['examples'].append({
                        'lang': 'english',
                        'id': project['id'],
                        'village': project['village'],
                        'panchayat': project['panchayat'],
                        'before': project['english_desc'],
                        'after': cleaned_english,
                        'saved': chars_saved
                    })

        # Clean Tamil description
        if project['tamil_desc']:
            cleaned_tamil = clean_tamil_description(
                project['tamil_desc'],
                project['village'],
                project['panchayat']
            )

            if cleaned_tamil != project['tamil_desc']:
                tamil_modified = True
                stats['tamil_modified'] += 1
                chars_saved = len(project['tamil_desc']) - len(cleaned_tamil)
                stats['tamil_chars_saved'] += chars_saved

                if not dry_run:
                    update_project_description(
                        project['id'],
                        '_project_description_tamil',
                        cleaned_tamil
                    )

                # Store examples (first 5 of each language)
                if len([e for e in stats['examples'] if e['lang'] == 'tamil']) < 5:
                    stats['examples'].append({
                        'lang': 'tamil',
                        'id': project['id'],
                        'village': project['village'],
                        'panchayat': project['panchayat'],
                        'before': project['tamil_desc'],
                        'after': cleaned_tamil,
                        'saved': chars_saved
                    })

    # Show commit status
    if not dry_run:
        print("✓ Changes committed to database")
    else:
        print("DRY RUN - No changes committed")

    return stats

def print_report(stats, dry_run):
    """Print a detailed statistics report."""
    print()
    print("=" * 80)
    print("DATABASE DESCRIPTION CLEANUP REPORT")
    print("=" * 80)
    print()
    print(f"Total projects processed: {stats['total_projects']}")
    print()
    print(f"English descriptions modified: {stats['english_modified']} ({stats['english_modified']/max(stats['total_projects'],1)*100:.1f}%)")
    print(f"English characters saved: {stats['english_chars_saved']:,}")
    if stats['english_modified'] > 0:
        print(f"Average English chars saved: {stats['english_chars_saved']/stats['english_modified']:.1f}")
    print()
    print(f"Tamil descriptions modified: {stats['tamil_modified']} ({stats['tamil_modified']/max(stats['total_projects'],1)*100:.1f}%)")
    print(f"Tamil characters saved: {stats['tamil_chars_saved']:,}")
    if stats['tamil_modified'] > 0:
        print(f"Average Tamil chars saved: {stats['tamil_chars_saved']/stats['tamil_modified']:.1f}")
    print()
    print(f"Total characters saved: {stats['english_chars_saved'] + stats['tamil_chars_saved']:,}")

    if stats['examples']:
        print()
        print("=" * 80)
        print("EXAMPLE CHANGES:")
        print("=" * 80)

        for i, ex in enumerate(stats['examples'], 1):
            print(f"\n--- Example {i} ({ex['lang'].upper()}, ID: {ex['id']}) ---")
            print(f"Village: {ex['village']}")
            print(f"Panchayat: {ex['panchayat']}")
            print(f"BEFORE ({len(ex['before'])} chars): {ex['before']}")
            print(f"AFTER  ({len(ex['after'])} chars): {ex['after']}")
            print(f"Saved: {ex['saved']} characters")

    print()
    print("=" * 80)

    if dry_run:
        print("\n(Dry run complete - no changes were made to the database)")
    else:
        print("\n✓ All changes have been committed to the database")

def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(description='Clean redundant location names from project descriptions')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without modifying database')
    parser.add_argument('--execute', action='store_true', help='Execute changes and commit to database')
    parser.add_argument('--limit', type=int, help='Limit number of projects to process (for testing)')

    args = parser.parse_args()

    # Default to dry-run if neither flag is specified
    dry_run = not args.execute

    if dry_run:
        print("=" * 80)
        print("DRY RUN MODE - No changes will be made to the database")
        print("=" * 80)
        print()
    else:
        print("=" * 80)
        print("EXECUTION MODE - Changes will be committed to the database")
        print("=" * 80)
        print()

        # Confirm before proceeding
        response = input("Are you sure you want to proceed? (yes/no): ")
        if response.lower() != 'yes':
            print("Aborted.")
            sys.exit(0)

    try:
        stats = process_projects(dry_run=dry_run, limit=args.limit)
        print_report(stats, dry_run)
    except Exception as e:
        print(f"\n✗ Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
