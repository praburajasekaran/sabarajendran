#!/usr/bin/env python3
"""
Translate Kurinjipadi projects CSV from Tamil to English using Claude API
Creates a bilingual CSV with English translations for import into WordPress
"""

import csv
import os
import sys
import time
import json
import urllib.request
import urllib.error
import ssl

# Configuration
INPUT_CSV = 'projects_kurinjipadi_gemini.csv'
OUTPUT_CSV = 'projects_kurinjipadi_bilingual.csv'
BATCH_SIZE = 25  # Translate 25 rows per API call
API_KEY = os.environ.get('OPENROUTER_API_KEY')
API_URL = 'https://openrouter.ai/api/v1/chat/completions'
MODEL = 'anthropic/claude-sonnet-4'  # Claude via OpenRouter

if not API_KEY:
    print("Error: OPENROUTER_API_KEY environment variable not set")
    print("Set it with: export OPENROUTER_API_KEY='your-api-key'")
    sys.exit(1)

def call_claude_api(prompt):
    """
    Call Claude API via OpenRouter using urllib (no external dependencies)

    Args:
        prompt: The translation prompt

    Returns:
        Response text from Claude
    """
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {API_KEY}',
        'HTTP-Referer': 'http://localhost',  # Required by OpenRouter
        'X-Title': 'Kurinjipadi CSV Translation'
    }

    data = {
        'model': MODEL,
        'max_tokens': 4096,
        'temperature': 0.3,
        'messages': [{
            'role': 'user',
            'content': prompt
        }]
    }

    req = urllib.request.Request(
        API_URL,
        data=json.dumps(data).encode('utf-8'),
        headers=headers
    )

    try:
        # Disable SSL verification for API calls (macOS certificate issue)
        ssl_context = ssl._create_unverified_context()
        with urllib.request.urlopen(req, timeout=90, context=ssl_context) as response:
            result = json.loads(response.read().decode('utf-8'))
            # OpenRouter format: choices[0].message.content
            return result['choices'][0]['message']['content']
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"HTTP Error {e.code}: {error_body}")
        raise
    except Exception as e:
        print(f"Request error: {e}")
        raise

def translate_batch(rows):
    """
    Translate a batch of rows using Claude API

    Args:
        rows: List of row dicts with Tamil fields

    Returns:
        List of row dicts with added English translations
    """
    # Build translation prompt
    prompt_parts = [
        "You are translating Tamil government project descriptions to English.",
        "Context: These are Tamil Nadu rural development schemes and infrastructure projects from Kurinjipadi block.",
        "",
        "Translation guidelines:",
        "- Use consistent terminology for schemes (e.g., '15-வது நிதிக் குழு மானிய திட்டம்' → '15th Finance Commission Grant Scheme')",
        "- Translate panchayat and village names phonetically (e.g., 'அன்னதானம்பேட்டை' → 'Annadhanampettai')",
        "- Keep project descriptions concise and clear",
        "- Use standard terms: 'panchayat', 'union', 'road', 'school', 'construction', etc.",
        "",
        "Translate the following rows. For each row, provide translations in this exact format:",
        "ROW N: panchayat_english | scheme_english | description_english | village_english",
        "",
        "Input rows:"
    ]

    for i, row in enumerate(rows, 1):
        prompt_parts.append(
            f"\nROW {i}:"
            f"\n  panchayat: {row['panchayat']}"
            f"\n  scheme: {row['scheme']}"
            f"\n  description: {row['description']}"
            f"\n  village: {row['village']}"
        )

    prompt_parts.append("\n\nProvide translations in the format specified above, one row per line.")
    prompt = "\n".join(prompt_parts)

    # Call Claude API
    try:
        response_text = call_claude_api(prompt)

        # Extract translations
        translations = []
        for line in response_text.split('\n'):
            line = line.strip()
            if line.startswith('ROW '):
                # Parse: ROW N: panchayat | scheme | description | village
                try:
                    parts = line.split(':', 1)[1].strip().split('|')
                    if len(parts) >= 4:
                        translations.append({
                            'panchayat_english': parts[0].strip(),
                            'scheme_english': parts[1].strip(),
                            'description_english': parts[2].strip(),
                            'village_english': parts[3].strip()
                        })
                except Exception as e:
                    print(f"Warning: Failed to parse line: {line}")
                    print(f"Error: {e}")
                    # Add empty translations as fallback
                    translations.append({
                        'panchayat_english': '',
                        'scheme_english': '',
                        'description_english': '',
                        'village_english': ''
                    })

        # Verify we got translations for all rows
        if len(translations) != len(rows):
            print(f"Warning: Expected {len(rows)} translations, got {len(translations)}")
            print("Response:")
            print(response_text[:500])  # Print first 500 chars
            # Pad with empty translations if needed
            while len(translations) < len(rows):
                translations.append({
                    'panchayat_english': '',
                    'scheme_english': '',
                    'description_english': '',
                    'village_english': ''
                })

        # Merge translations with original rows
        result = []
        for row, translation in zip(rows, translations):
            result.append({**row, **translation})

        return result

    except Exception as e:
        print(f"Error calling Claude API: {e}")
        # Return rows with empty English fields on error
        for row in rows:
            row.update({
                'panchayat_english': '',
                'scheme_english': '',
                'description_english': '',
                'village_english': ''
            })
        return rows

def main():
    """Main translation workflow"""
    print(f"=== Kurinjipadi CSV Translation ===")
    print(f"Input: {INPUT_CSV}")
    print(f"Output: {OUTPUT_CSV}")
    print(f"Batch size: {BATCH_SIZE} rows")
    print()

    # Read input CSV
    try:
        with open(INPUT_CSV, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
    except FileNotFoundError:
        print(f"Error: {INPUT_CSV} not found")
        sys.exit(1)

    print(f"Loaded {len(rows)} rows")

    # Process in batches
    all_translated = []
    batch_count = (len(rows) + BATCH_SIZE - 1) // BATCH_SIZE

    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i+BATCH_SIZE]
        batch_num = (i // BATCH_SIZE) + 1

        print(f"Translating batch {batch_num}/{batch_count} ({len(batch)} rows)...")

        translated = translate_batch(batch)
        all_translated.extend(translated)

        # Rate limiting - wait 1 second between batches
        if i + BATCH_SIZE < len(rows):
            print("  Waiting 1s before next batch...")
            time.sleep(1)

    # Write output CSV with bilingual columns
    output_headers = [
        'sno', 'panchayat', 'panchayat_english', 'year',
        'scheme', 'scheme_english', 'details',
        'description', 'description_english',
        'village', 'village_english',
        'budget', 'status', 'raw_text'
    ]

    try:
        with open(OUTPUT_CSV, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=output_headers)
            writer.writeheader()
            writer.writerows(all_translated)

        print()
        print(f"✓ Successfully wrote {len(all_translated)} rows to {OUTPUT_CSV}")

        # Validation checks
        print("\n=== Validation ===")
        print(f"Input rows: {len(rows)}")
        print(f"Output rows: {len(all_translated)}")
        print(f"Match: {'✓' if len(rows) == len(all_translated) else '✗'}")

        # Sample check
        print("\n=== Sample Translations (First 3 rows) ===")
        for i, row in enumerate(all_translated[:3], 1):
            print(f"\nRow {i}:")
            print(f"  Tamil Panchayat: {row['panchayat']}")
            print(f"  English Panchayat: {row['panchayat_english']}")
            print(f"  Tamil Description: {row['description'][:60]}...")
            print(f"  English Description: {row['description_english'][:60]}...")

        # Count empty translations
        empty_count = sum(1 for row in all_translated if not row.get('description_english'))
        if empty_count > 0:
            print(f"\n⚠ Warning: {empty_count} rows have empty English translations")

    except Exception as e:
        print(f"Error writing output CSV: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
