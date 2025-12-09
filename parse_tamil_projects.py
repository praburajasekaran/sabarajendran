#!/usr/bin/env python3
"""
Tamil Project PDF Parser
Extracts project data from Tamil PDFs (Kurinjipadi Block) and generates CSV for WordPress import

Features:
- Bamini to Unicode Tamil conversion
- Structured data extraction (year, budget, status, scheme)
- CSV generation with UTF-8 encoding
- Support for all 11 panchayat PDFs

Usage:
    python3 parse_tamil_projects.py --test <pdf_file>   # Test with single PDF
    python3 parse_tamil_projects.py --all                # Process all PDFs
"""

import os
import sys
import csv
import re
import argparse
from pathlib import Path
from pdfminer.high_level import extract_text
from bamini_unicode_map import convert_bamini_to_unicode, detect_encoding

# Configuration
PDF_DIR = 'docs/kurinjipadi-block-projects'
OUTPUT_CSV = 'projects_kurinjipadi_clean.csv'
BLOCK_NAME = 'Kurinjipadi'

# Data extraction patterns
YEAR_PATTERN = re.compile(r'(20\d{2}-\d{2,4})')
BUDGET_PATTERN = re.compile(r'(\d{3,})')
STATUS_KEYWORDS = {
    'பணி முடிந்தது': 'Completed',
    'பணி முடிவடைந்தது': 'Completed',
    'முடிந்தது': 'Completed',
    'KoÎ': 'Completed',  # Bamini
    'பணி நடைபெறுகிறது': 'In Progress',
    'நடைபெறுகிறது': 'In Progress',
    'பணி நடைபெற்று வருகிறது': 'In Progress',
    'நடைபெற்று வருகிறது': 'In Progress',
    'eilbg‰WtU»wJ': 'In Progress',  # Bamini
    'தருவாயில்': 'In Progress',
}


class TamilProjectParser:
    """Parser for Tamil project PDFs"""

    def __init__(self, pdf_path):
        """
        Initialize parser with PDF path.

        Args:
            pdf_path (str): Path to PDF file
        """
        self.pdf_path = pdf_path
        self.panchayat_name = self.extract_panchayat_from_filename()
        self.projects = []

    def extract_panchayat_from_filename(self):
        """
        Extract panchayat name from PDF filename.

        Returns:
            str: Panchayat name (Tamil)
        """
        filename = Path(self.pdf_path).stem  # Get filename without extension
        return filename

    def extract_text_from_pdf(self):
        """
        Extract raw text from PDF.

        Returns:
            str: Extracted text
        """
        try:
            text = extract_text(self.pdf_path)
            return text
        except Exception as e:
            print(f"Error extracting text from {self.pdf_path}: {e}")
            return ""

    def convert_to_unicode(self, text):
        """
        Convert Bamini-encoded text to Unicode if needed.

        Args:
            text (str): Input text

        Returns:
            str: Unicode Tamil text
        """
        encoding = detect_encoding(text)
        if encoding == 'bamini':
            return convert_bamini_to_unicode(text)
        return text

    def extract_year(self, text):
        """
        Extract year from text.

        Args:
            text (str): Text to search

        Returns:
            str: Year in YYYY-YY or YYYY-YYYY format, or empty string
        """
        matches = YEAR_PATTERN.findall(text)
        if matches:
            return matches[0]
        return ""

    def extract_budget(self, text):
        """
        Extract budget amount from text.

        Args:
            text (str): Text to search

        Returns:
            int: Budget amount, or 0 if not found
        """
        # Clean text: remove commas, spaces, currency symbols
        cleaned = text.replace(',', '').replace(' ', '').replace('₹', '').replace('Rs', '')

        matches = BUDGET_PATTERN.findall(cleaned)
        if matches:
            # Find the largest number (likely the budget)
            numbers = [int(m) for m in matches if len(m) >= 4]  # Only 4+ digit numbers
            if numbers:
                return max(numbers)
        return 0

    def extract_status(self, text):
        """
        Extract project status from text.

        Args:
            text (str): Text to search

        Returns:
            str: Status ('Completed', 'In Progress', or 'Unknown')
        """
        for keyword, status in STATUS_KEYWORDS.items():
            if keyword in text:
                return status
        return "Unknown"

    def extract_scheme(self, text):
        """
        Extract government scheme name from text.

        Args:
            text (str): Text to search

        Returns:
            str: Scheme name or empty string
        """
        # Common scheme patterns
        scheme_patterns = [
            r'பொது நிதி',
            r'15-வது நிதி',
            r'மகாத்மாகாந்தி',
            r'திட்டம்',
            r'மான்ய திட்டம்',
            r'சட்டமன்ற',
            r'வெலை உறுதி',
        ]

        for pattern in scheme_patterns:
            if re.search(pattern, text):
                # Extract surrounding context (up to 50 chars)
                match = re.search(f'.{{0,20}}{pattern}.{{0,30}}', text)
                if match:
                    return match.group(0).strip()

        return ""

    def extract_location(self, text):
        """
        Extract village/location from text.

        Args:
            text (str): Text to search

        Returns:
            str: Village name or empty string
        """
        # Look for patterns like "கிராமம்", "ஊராட்சி", etc.
        location_patterns = [
            r'([^\s]+)\s*கிராமம்',
            r'([^\s]+)\s*ஊராட்சி',
            r'([^\s]+)\s*காலனி',
        ]

        for pattern in location_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1)

        # Fallback: use panchayat name
        return self.panchayat_name

    def parse_projects(self, text):
        """
        Parse project entries from text.

        Args:
            text (str): Extracted text from PDF

        Returns:
            list: List of project dictionaries
        """
        projects = []

        # Split text into lines
        lines = text.split('\n')

        # Try to detect project rows (usually start with serial numbers)
        current_project = []
        sno = 0

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Check if line starts with a number (potential project start)
            if re.match(r'^\d+\.?\s+', line):
                # Save previous project if exists
                if current_project:
                    project_text = ' '.join(current_project)
                    project = self.parse_project_text(project_text, sno)
                    if project:
                        projects.append(project)

                # Start new project
                sno += 1
                current_project = [line]
            else:
                # Continuation of current project
                if current_project:
                    current_project.append(line)

        # Don't forget the last project
        if current_project:
            project_text = ' '.join(current_project)
            project = self.parse_project_text(project_text, sno)
            if project:
                projects.append(project)

        return projects

    def parse_project_text(self, text, sno):
        """
        Parse a single project from text.

        Args:
            text (str): Project text
            sno (int): Serial number

        Returns:
            dict: Project data dictionary
        """
        # Extract data
        year = self.extract_year(text)
        budget = self.extract_budget(text)
        status = self.extract_status(text)
        scheme = self.extract_scheme(text)
        location = self.extract_location(text)

        # Don't create project if text is too short (likely not a real project)
        if len(text) < 20:
            return None

        project = {
            'sno': sno,
            'village': self.panchayat_name,  # Panchayat name
            'year': year,
            'scheme': scheme,
            'details': '',  # Can be filled later if needed
            'description': text[:200],  # First 200 chars as description
            'location': location if location != self.panchayat_name else '',
            'budget': budget,
            'status': status,
            'raw_text': text,  # Full Tamil text
        }

        return project

    def process(self):
        """
        Process PDF and extract projects.

        Returns:
            list: List of project dictionaries
        """
        print(f"Processing: {self.pdf_path}")
        print(f"Panchayat: {self.panchayat_name}")

        # Extract text
        raw_text = self.extract_text_from_pdf()
        if not raw_text:
            print(f"  ⚠ No text extracted from {self.pdf_path}")
            return []

        # Convert to Unicode
        unicode_text = self.convert_to_unicode(raw_text)

        # Parse projects
        projects = self.parse_projects(unicode_text)

        print(f"  ✓ Extracted {len(projects)} projects")

        self.projects = projects
        return projects


def write_to_csv(projects, output_path):
    """
    Write projects to CSV file.

    Args:
        projects (list): List of project dictionaries
        output_path (str): Output CSV file path
    """
    if not projects:
        print("No projects to write.")
        return

    # CSV columns matching import_projects.php expectations
    fieldnames = [
        'sno', 'village', 'year', 'scheme', 'details',
        'description', 'location', 'budget', 'status', 'raw_text'
    ]

    with open(output_path, 'w', newline='', encoding='utf-8-sig') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        for project in projects:
            writer.writerow(project)

    print(f"\n✓ CSV written to: {output_path}")
    print(f"  Total projects: {len(projects)}")


def process_single_pdf(pdf_path):
    """
    Process a single PDF file.

    Args:
        pdf_path (str): Path to PDF file

    Returns:
        list: List of projects
    """
    parser = TamilProjectParser(pdf_path)
    projects = parser.process()
    return projects


def process_all_pdfs(pdf_dir=PDF_DIR):
    """
    Process all PDF files in directory.

    Args:
        pdf_dir (str): Directory containing PDFs

    Returns:
        list: List of all projects from all PDFs
    """
    all_projects = []
    pdf_files = sorted(Path(pdf_dir).glob('*.pdf'))

    if not pdf_files:
        print(f"No PDF files found in {pdf_dir}")
        return []

    print(f"Found {len(pdf_files)} PDF files\n")
    print("=" * 60)

    for pdf_path in pdf_files:
        parser = TamilProjectParser(str(pdf_path))
        projects = parser.process()
        all_projects.extend(projects)
        print("=" * 60)

    return all_projects


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Parse Tamil project PDFs')
    parser.add_argument('--test', type=str, help='Test with single PDF file')
    parser.add_argument('--all', action='store_true', help='Process all PDFs in directory')
    parser.add_argument('--output', type=str, default=OUTPUT_CSV, help='Output CSV file path')

    args = parser.parse_args()

    if args.test:
        # Process single PDF
        pdf_path = args.test if os.path.exists(args.test) else os.path.join(PDF_DIR, args.test)

        if not os.path.exists(pdf_path):
            print(f"Error: PDF file not found: {pdf_path}")
            sys.exit(1)

        projects = process_single_pdf(pdf_path)
        write_to_csv(projects, args.output)

    elif args.all:
        # Process all PDFs
        projects = process_all_pdfs()
        write_to_csv(projects, args.output)

    else:
        parser.print_help()
        print("\nExamples:")
        print(f"  python3 {sys.argv[0]} --test கீழூர்.pdf")
        print(f"  python3 {sys.argv[0]} --all")


if __name__ == '__main__':
    main()
