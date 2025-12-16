#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSV Description Cleanup Script
Removes redundant village/panchayat/location names from project descriptions
"""

import csv
import re
import sys
from collections import defaultdict

def clean_description(description, village, location):
    """
    Clean redundant village/panchayat/location names from description.
    Uses comprehensive pattern matching similar to database cleanup.

    Args:
        description: The description text to clean
        village: Village name from the village column
        location: Location name from the location column

    Returns:
        Cleaned description text
    """
    if not description:
        return description

    original = description

    # Normalize village and location names (remove extra spaces)
    village = village.strip() if village else ""
    location = location.strip() if location else ""

    # Pattern 1: Remove "[location name], [panchayat] பஞ்சாயத்தில்" patterns
    description = re.sub(r',\s*[\u0B80-\u0BFFa-zA-Z\s\.]+\s+பஞ்சாயத்தில்[\s\.]', ' ', description)
    description = re.sub(r',\s*[\u0B80-\u0BFFa-zA-Z\s\.]+\s+பஞ்சாயத்தில்$', '', description)

    # Pattern 2: Remove standalone "பஞ்சாயத்தில்." at the end
    description = re.sub(r',?\s*பஞ்சாயத்தில்\.$', '', description)
    description = re.sub(r'\s+பஞ்சாயத்தில்\.$', '', description)

    # Pattern 3: Remove "[Tamil word/phrase] பஞ்சாயத்தில்" anywhere
    description = re.sub(r'[\u0B80-\u0BFFa-zA-Z\.]+\s+பஞ்சாயத்தில்\s+', '', description)
    description = re.sub(r'[\u0B80-\u0BFFa-zA-Z\.]+\s+பஞ்சாயத்தில்,', '', description)

    # Pattern 4: Remove "பாஞ்சாயத்து" variations (alternate spelling)
    description = re.sub(r'[\u0B80-\u0BFFa-zA-Z\.]+\s+பாஞ்சாயத்து\s+', '', description)

    # Pattern 5: Remove ANY "[Tamil text] ஊராட்சி " pattern
    # This catches cases like "அண்ணாமலைபேட்டை ஊராட்சி முதற்குறிச்சி குப்பம்..."
    description = re.sub(r'[\u0B80-\u0BFFa-zA-Z\.]+\s+ஊராட்சி\s+', '', description)
    description = re.sub(r'[\u0B80-\u0BFFa-zA-Z\.]+\s+ஊராட்சியில்\s+', '', description)

    # Pattern 5b: Remove "{location} ஊராட்சி " patterns - exact match as backup
    if location:
        pattern = f"{re.escape(location)}\\s+ஊராட்சி\\s+"
        description = re.sub(pattern, "", description)

        pattern2 = f"{re.escape(location)}\\s+ஊராட்சியில்\\s+"
        description = re.sub(pattern2, "", description)

    if village and village != location:
        pattern = f"{re.escape(village)}\\s+ஊராட்சி\\s+"
        description = re.sub(pattern, "", description)

        pattern2 = f"{re.escape(village)}\\s+ஊராட்சியில்\\s+"
        description = re.sub(pattern2, "", description)

    # Pattern 6: Remove standalone patterns at start
    description = re.sub(r"^ஊராட்சி\s+", "", description)
    description = re.sub(r"^ஊராட்சியில்\s+", "", description)
    description = re.sub(r"^பஞ்சாயத்தில்\s+", "", description)
    description = re.sub(r"^கிராமத்தில்\s+", "", description)

    # Pattern 7: Remove duplicate location mentions at the beginning
    if location and description.count(location) >= 2:
        first_pos = description.find(location)
        if first_pos != -1 and first_pos < 50:
            second_pos = description.find(location, first_pos + len(location))
            if second_pos != -1 and second_pos < 100:
                # Remove the first occurrence
                description = description[:first_pos] + description[first_pos + len(location):]

    # Normalize whitespace and clean up commas
    description = re.sub(r'\s+', ' ', description).strip()
    description = re.sub(r'^\s*,\s*', '', description)  # Remove leading comma
    description = re.sub(r'\s*,\s*$', '', description)  # Remove trailing comma
    description = re.sub(r',\s*,', ',', description)    # Remove double commas

    return description

def process_csv(input_file, output_file, dry_run=False):
    """
    Process the CSV file and clean descriptions.

    Args:
        input_file: Path to input CSV file
        output_file: Path to output CSV file
        dry_run: If True, don't write output, just show statistics

    Returns:
        Dictionary with statistics
    """
    stats = {
        'total_rows': 0,
        'modified_rows': 0,
        'chars_saved': 0,
        'examples': []
    }

    rows = []

    # Read the CSV file
    with open(input_file, 'r', encoding='utf-8-sig') as f:
        # Use utf-8-sig to handle BOM if present
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

        for row in reader:
            stats['total_rows'] += 1

            original_desc = row.get('description', '')
            village = row.get('village', '')
            location = row.get('location', '')

            cleaned_desc = clean_description(original_desc, village, location)

            if cleaned_desc != original_desc:
                stats['modified_rows'] += 1
                chars_saved = len(original_desc) - len(cleaned_desc)
                stats['chars_saved'] += chars_saved

                # Store first 10 examples
                if len(stats['examples']) < 10:
                    stats['examples'].append({
                        'sno': row.get('sno', ''),
                        'village': village,
                        'location': location,
                        'before': original_desc,
                        'after': cleaned_desc,
                        'saved': chars_saved
                    })

            row['description'] = cleaned_desc
            rows.append(row)

    # Write the cleaned CSV file (if not dry run)
    if not dry_run:
        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)

    return stats

def print_report(stats):
    """Print a summary report of the cleanup."""
    print("=" * 80)
    print("CSV DESCRIPTION CLEANUP REPORT")
    print("=" * 80)
    print(f"\nTotal rows processed: {stats['total_rows']}")
    print(f"Descriptions modified: {stats['modified_rows']} ({stats['modified_rows']/stats['total_rows']*100:.1f}%)")
    print(f"Total characters saved: {stats['chars_saved']:,}")
    print(f"Average chars saved per modified row: {stats['chars_saved']/max(stats['modified_rows'],1):.1f}")

    if stats['examples']:
        print(f"\n{'='*80}")
        print("EXAMPLE CHANGES (First 10):")
        print("=" * 80)
        for i, ex in enumerate(stats['examples'], 1):
            print(f"\n--- Example {i} (Row #{ex['sno']}) ---")
            print(f"Village: {ex['village']}")
            print(f"Location: {ex['location']}")
            print(f"BEFORE ({len(ex['before'])} chars): {ex['before']}")
            print(f"AFTER  ({len(ex['after'])} chars): {ex['after']}")
            print(f"Saved: {ex['saved']} characters")

    print("\n" + "=" * 80)

def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: python3 cleanup_csv_descriptions.py <input_file> [output_file] [--dry-run]")
        print("\nOptions:")
        print("  --dry-run    Show statistics without modifying files")
        sys.exit(1)

    input_file = sys.argv[1]

    # Determine output file
    if len(sys.argv) >= 3 and not sys.argv[2].startswith('--'):
        output_file = sys.argv[2]
    else:
        output_file = input_file

    # Check for dry-run flag
    dry_run = '--dry-run' in sys.argv

    print(f"Processing: {input_file}")
    if not dry_run:
        print(f"Output to: {output_file}")
    else:
        print("DRY RUN MODE - No files will be modified")

    print()

    try:
        stats = process_csv(input_file, output_file, dry_run)
        print_report(stats)

        if not dry_run:
            print(f"\n✓ Successfully wrote cleaned data to: {output_file}")
        else:
            print("\n(Dry run complete - no files were modified)")

    except Exception as e:
        print(f"\n✗ Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
