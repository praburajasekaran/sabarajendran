#!/usr/bin/env python3
"""
Tamil Project PDF Parser with Google Gemini Pro
Uses Gemini Vision API to extract Tamil text and structured project data from PDFs

Features:
- Google Gemini Pro Vision for OCR (proper Tamil Unicode)
- Structured data extraction via AI
- CSV generation for WordPress import
- Retry logic with exponential backoff
- Structured logging with progress tracking
- Data validation and sanitization
- Resume capability for interrupted processing

Usage:
    python3 parse_tamil_projects_gemini.py --test <pdf_file>
    python3 parse_tamil_projects_gemini.py --all
    python3 parse_tamil_projects_gemini.py --all --resume
    python3 parse_tamil_projects_gemini.py --all --limit 3
"""

import os
import sys
import csv
import json
import time
import argparse
import logging
import re
import functools
from pathlib import Path
from datetime import datetime
from pdf2image import convert_from_path
import google.generativeai as genai
from dotenv import load_dotenv
from tqdm import tqdm

# Load environment variables
load_dotenv()

# Configuration from environment variables
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-1.5-flash')
PDF_DIR = os.getenv('PDF_DIR', 'docs/kurinjipadi-block-projects')
OUTPUT_CSV = os.getenv('OUTPUT_CSV', 'projects_kurinjipadi_gemini.csv')
BLOCK_NAME = os.getenv('BLOCK_NAME', 'Kurinjipadi')
PDF_DPI = int(os.getenv('PDF_DPI', '300'))
RATE_LIMIT_PAGE_DELAY = float(os.getenv('RATE_LIMIT_PAGE_DELAY', '1.0'))
RATE_LIMIT_PDF_DELAY = float(os.getenv('RATE_LIMIT_PDF_DELAY', '2.0'))
MAX_RETRIES = int(os.getenv('MAX_RETRIES', '3'))
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_DIR = os.getenv('LOG_DIR', 'logs')
ENABLE_FILE_LOGGING = os.getenv('ENABLE_FILE_LOGGING', 'true').lower() == 'true'
VALIDATE_BUDGET_MIN = int(os.getenv('VALIDATE_BUDGET_MIN', '1000'))
VALIDATE_BUDGET_MAX = int(os.getenv('VALIDATE_BUDGET_MAX', '100000000'))
REQUIRE_TAMIL_TEXT = os.getenv('REQUIRE_TAMIL_TEXT', 'true').lower() == 'true'

# Checkpoint configuration
CHECKPOINT_DIR = 'checkpoints'
CHECKPOINT_FILE = os.path.join(CHECKPOINT_DIR, 'processing_state.json')

# Validate API key
if not GEMINI_API_KEY or GEMINI_API_KEY == 'your_api_key_here':
    print("ERROR: GEMINI_API_KEY not set in environment variables!")
    print("Please create a .env file (use .env.example as template) and add your API key.")
    sys.exit(1)

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(GEMINI_MODEL)

# Setup logging
def setup_logging():
    """Configure logging with console and file handlers"""
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, LOG_LEVEL.upper()))

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_formatter = logging.Formatter('%(levelname)s: %(message)s')
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)

    # File handler
    if ENABLE_FILE_LOGGING:
        os.makedirs(LOG_DIR, exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        log_file = os.path.join(LOG_DIR, f'parser_{timestamp}.log')
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(logging.DEBUG)
        file_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)
        logger.info(f"Logging to file: {log_file}")

    return logger

logger = setup_logging()

# Statistics tracking
class ProcessingStats:
    """Track processing statistics"""
    def __init__(self):
        self.start_time = time.time()
        self.total_pdfs = 0
        self.successful_pdfs = 0
        self.failed_pdfs = 0
        self.total_projects = 0
        self.total_api_calls = 0
        self.validation_warnings = 0
        self.pdf_projects = {}  # PDF name -> project count

    def add_pdf(self, pdf_name, projects_count, success=True):
        """Record PDF processing result"""
        self.total_pdfs += 1
        if success:
            self.successful_pdfs += 1
            self.total_projects += projects_count
            self.pdf_projects[pdf_name] = projects_count
        else:
            self.failed_pdfs += 1

    def add_api_call(self):
        """Increment API call counter"""
        self.total_api_calls += 1

    def add_validation_warning(self):
        """Increment validation warning counter"""
        self.validation_warnings += 1

    def get_summary(self):
        """Get processing summary"""
        elapsed = time.time() - self.start_time
        return {
            'elapsed_time': elapsed,
            'total_pdfs': self.total_pdfs,
            'successful_pdfs': self.successful_pdfs,
            'failed_pdfs': self.failed_pdfs,
            'total_projects': self.total_projects,
            'total_api_calls': self.total_api_calls,
            'validation_warnings': self.validation_warnings,
            'pdf_projects': self.pdf_projects
        }

stats = ProcessingStats()

# Retry decorator with exponential backoff
def retry_with_backoff(max_retries=MAX_RETRIES, initial_delay=1):
    """Decorator for API calls with exponential backoff"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            delay = initial_delay
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    error_msg = str(e).lower()

                    # Check for specific error types
                    if 'rate limit' in error_msg or '429' in error_msg:
                        logger.warning(f"Rate limit hit on attempt {attempt + 1}/{max_retries}")
                    elif 'timeout' in error_msg:
                        logger.warning(f"Timeout on attempt {attempt + 1}/{max_retries}")
                    elif 'api key' in error_msg:
                        logger.error(f"Invalid API key: {e}")
                        raise  # Don't retry invalid API key
                    else:
                        logger.warning(f"Error on attempt {attempt + 1}/{max_retries}: {e}")

                    if attempt < max_retries - 1:
                        logger.info(f"Retrying in {delay} seconds...")
                        time.sleep(delay)
                        delay *= 2  # Exponential backoff
                    else:
                        logger.error(f"Failed after {max_retries} attempts")
                        raise

            return None
        return wrapper
    return decorator

# Validation functions
def validate_year(year):
    """Validate year format (YYYY-YY or YYYY-YYYY)"""
    if not year:
        return False
    pattern = r'^\d{4}-(\d{2}|\d{4})$'
    return bool(re.match(pattern, str(year)))

def validate_budget(budget):
    """Validate budget is numeric and within reasonable range"""
    try:
        budget_val = float(budget)
        return VALIDATE_BUDGET_MIN <= budget_val <= VALIDATE_BUDGET_MAX
    except (ValueError, TypeError):
        return False

def validate_status(status):
    """Validate status is one of known values"""
    valid_statuses = ['Completed', 'In Progress', 'Unknown', 'completed', 'in progress', 'unknown']
    return str(status).strip() in valid_statuses

def validate_tamil_text(text):
    """Check if text contains Tamil Unicode characters (U+0B80-U+0BFF)"""
    if not text:
        return False
    tamil_count = sum(1 for char in text if '\u0B80' <= char <= '\u0BFF')
    # At least 10% Tamil characters
    return tamil_count >= len(text) * 0.1

def sanitize_year(year):
    """Normalize year format to YYYY-YYYY"""
    if not year:
        return ''
    year = str(year).strip()
    # Convert 2021-22 to 2021-2022
    match = re.match(r'^(\d{4})-(\d{2})$', year)
    if match:
        return f"{match.group(1)}-20{match.group(2)}"
    return year

def sanitize_text(text):
    """Clean text by removing excessive whitespace"""
    if not text:
        return ''
    # Replace multiple spaces with single space
    text = re.sub(r'\s+', ' ', str(text))
    return text.strip()

# Checkpoint management
def load_checkpoint():
    """Load processing checkpoint"""
    if not os.path.exists(CHECKPOINT_FILE):
        return []
    try:
        with open(CHECKPOINT_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('processed_pdfs', [])
    except Exception as e:
        logger.warning(f"Could not load checkpoint: {e}")
        return []

def save_checkpoint(processed_pdfs):
    """Save processing checkpoint"""
    try:
        os.makedirs(CHECKPOINT_DIR, exist_ok=True)
        with open(CHECKPOINT_FILE, 'w', encoding='utf-8') as f:
            json.dump({'processed_pdfs': processed_pdfs}, f, ensure_ascii=False, indent=2)
        logger.debug(f"Checkpoint saved: {len(processed_pdfs)} PDFs processed")
    except Exception as e:
        logger.warning(f"Could not save checkpoint: {e}")

def clean_checkpoint():
    """Remove checkpoint file"""
    if os.path.exists(CHECKPOINT_FILE):
        os.remove(CHECKPOINT_FILE)
        logger.info("Checkpoint cleared")

# Prompt for Gemini to extract structured project data
EXTRACTION_PROMPT = """
You are analyzing a Tamil language PDF containing government project information.

Extract ALL projects from this image and return them as a JSON array. For each project, extract:
- year: Project year (format: YYYY-YY or YYYY-YYYY)
- scheme: Government scheme name in Tamil
- description: Project description in Tamil (full text)
- location: Village/location name in Tamil
- budget: Budget amount (numeric only, no currency symbols)
- status: Project status (Completed/In Progress/Unknown)

Return ONLY valid JSON array format, no other text:
[
  {
    "year": "2021-22",
    "scheme": "பொது நிதி",
    "description": "தார்சாலை அமைத்தல்",
    "location": "கீழூர்",
    "budget": 500000,
    "status": "Completed"
  }
]

If no clear projects are found, return empty array: []

Important: Use proper Tamil Unicode text. Extract ALL visible projects from the image.
"""


class GeminiProjectParser:
    """Parser using Google Gemini Pro Vision"""

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
        filename = Path(self.pdf_path).stem
        return filename

    def convert_pdf_to_images(self):
        """
        Convert PDF pages to images.

        Returns:
            list: List of PIL Image objects
        """
        try:
            logger.debug(f"Converting PDF to images at {PDF_DPI} DPI...")
            images = convert_from_path(self.pdf_path, dpi=PDF_DPI)
            logger.info(f"Converted {len(images)} pages")
            return images
        except Exception as e:
            logger.error(f"Error converting PDF: {e}", exc_info=True)
            return []

    @retry_with_backoff()
    def extract_with_gemini(self, image):
        """
        Extract project data from image using Gemini with retry logic.

        Args:
            image: PIL Image object

        Returns:
            list: List of project dictionaries
        """
        try:
            # Send image to Gemini
            stats.add_api_call()
            response = model.generate_content([EXTRACTION_PROMPT, image])

            # Parse JSON response
            text = response.text.strip()

            # Extract JSON from markdown code blocks if present
            if '```json' in text:
                text = text.split('```json')[1].split('```')[0].strip()
            elif '```' in text:
                text = text.split('```')[1].split('```')[0].strip()

            # Parse JSON
            projects = json.loads(text)

            if isinstance(projects, list):
                return projects
            else:
                logger.warning(f"Unexpected response format (not a list)")
                return []

        except json.JSONDecodeError as e:
            logger.warning(f"JSON parse error: {e}")
            logger.debug(f"Response text: {text[:200]}")
            return []
        except Exception as e:
            # This will be caught by retry decorator
            logger.debug(f"Gemini API error: {e}")
            raise

    def process(self, show_progress=True):
        """
        Process PDF and extract projects using Gemini.

        Args:
            show_progress (bool): Whether to show progress bar

        Returns:
            list: List of project dictionaries
        """
        logger.info(f"Processing: {Path(self.pdf_path).name}")
        logger.info(f"Panchayat: {self.panchayat_name}")

        # Convert PDF to images
        images = self.convert_pdf_to_images()
        if not images:
            logger.error("Failed to convert PDF to images")
            return []

        all_projects = []

        # Process each page with progress bar
        page_iterator = enumerate(images, 1)
        if show_progress:
            page_iterator = tqdm(
                list(page_iterator),
                desc=f"Pages ({self.panchayat_name})",
                unit="page",
                leave=False
            )

        for page_num, image in page_iterator:
            logger.debug(f"Analyzing page {page_num}/{len(images)} with Gemini...")

            try:
                projects = self.extract_with_gemini(image)

                if projects:
                    logger.debug(f"Found {len(projects)} projects on page {page_num}")
                    all_projects.extend(projects)
                else:
                    logger.debug(f"No projects found on page {page_num}")

            except Exception as e:
                logger.error(f"Failed to process page {page_num}: {e}")
                continue

            # Rate limiting: wait between API calls
            if page_num < len(images):
                time.sleep(RATE_LIMIT_PAGE_DELAY)

        # Process and validate projects
        sno = 1
        for project in all_projects:
            project['sno'] = sno
            project['village'] = self.panchayat_name
            project['details'] = ''  # Not extracted separately

            # Ensure all required fields exist with defaults
            if 'scheme' not in project:
                project['scheme'] = ''
            if 'location' not in project:
                project['location'] = ''
            if 'budget' not in project:
                project['budget'] = 0
            if 'status' not in project:
                project['status'] = 'Unknown'
            if 'year' not in project:
                project['year'] = ''

            # Sanitize data
            project['year'] = sanitize_year(project['year'])
            project['scheme'] = sanitize_text(project['scheme'])
            project['location'] = sanitize_text(project['location'])
            project['description'] = sanitize_text(project.get('description', ''))

            # Store full description as raw_text
            project['raw_text'] = project.get('description', '')

            # Validate fields and log warnings
            if project['year'] and not validate_year(project['year']):
                logger.warning(f"Project {sno}: Invalid year format '{project['year']}'")
                stats.add_validation_warning()

            if project['budget'] and not validate_budget(project['budget']):
                logger.warning(f"Project {sno}: Budget {project['budget']} out of expected range")
                stats.add_validation_warning()

            if project['status'] and not validate_status(project['status']):
                logger.warning(f"Project {sno}: Unknown status '{project['status']}'")
                stats.add_validation_warning()

            if REQUIRE_TAMIL_TEXT and not validate_tamil_text(project['raw_text']):
                logger.warning(f"Project {sno}: Missing or invalid Tamil text")
                stats.add_validation_warning()

            sno += 1

        logger.info(f"Extracted {len(all_projects)} projects from {self.panchayat_name}")
        self.projects = all_projects
        return all_projects


def write_to_csv(projects, output_path):
    """
    Write projects to CSV file.

    Args:
        projects (list): List of project dictionaries
        output_path (str): Output CSV file path
    """
    if not projects:
        logger.warning("No projects to write to CSV")
        return

    # CSV columns matching import_projects.php expectations
    fieldnames = [
        'sno', 'village', 'year', 'scheme', 'details',
        'description', 'location', 'budget', 'status', 'raw_text'
    ]

    try:
        with open(output_path, 'w', newline='', encoding='utf-8-sig') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()

            for project in projects:
                # Map fields correctly
                row = {
                    'sno': project.get('sno', 0),
                    'village': project.get('village', ''),
                    'year': project.get('year', ''),
                    'scheme': project.get('scheme', ''),
                    'details': project.get('details', ''),
                    'description': project.get('description', '')[:200],  # First 200 chars
                    'location': project.get('location', ''),
                    'budget': project.get('budget', 0),
                    'status': project.get('status', 'Unknown'),
                    'raw_text': project.get('raw_text', ''),
                }
                writer.writerow(row)

        logger.info(f"CSV written to: {output_path}")
        logger.info(f"Total projects: {len(projects)}")
    except Exception as e:
        logger.error(f"Failed to write CSV: {e}", exc_info=True)


def process_single_pdf(pdf_path, show_progress=True):
    """
    Process a single PDF file.

    Args:
        pdf_path (str): Path to PDF file
        show_progress (bool): Whether to show progress bar

    Returns:
        list: List of projects
    """
    try:
        parser = GeminiProjectParser(pdf_path)
        projects = parser.process(show_progress=show_progress)

        pdf_name = Path(pdf_path).name
        stats.add_pdf(pdf_name, len(projects), success=True)

        return projects
    except Exception as e:
        logger.error(f"Failed to process PDF {pdf_path}: {e}", exc_info=True)
        pdf_name = Path(pdf_path).name
        stats.add_pdf(pdf_name, 0, success=False)
        return []


def process_all_pdfs(pdf_dir=PDF_DIR, resume=False, limit=None, dry_run=False):
    """
    Process all PDF files in directory.

    Args:
        pdf_dir (str): Directory containing PDFs
        resume (bool): Resume from checkpoint
        limit (int): Maximum number of PDFs to process
        dry_run (bool): Show what would be processed without actual processing

    Returns:
        list: List of all projects from all PDFs
    """
    all_projects = []
    pdf_files = sorted(Path(pdf_dir).glob('*.pdf'))

    if not pdf_files:
        logger.error(f"No PDF files found in {pdf_dir}")
        return []

    logger.info(f"Found {len(pdf_files)} PDF files in {pdf_dir}")

    # Load checkpoint if resuming
    processed_pdfs = []
    if resume:
        processed_pdfs = load_checkpoint()
        if processed_pdfs:
            logger.info(f"Resuming: {len(processed_pdfs)} PDFs already processed")

    # Filter out already processed PDFs
    pdfs_to_process = []
    for pdf_path in pdf_files:
        pdf_name = str(pdf_path.name)
        if resume and pdf_name in processed_pdfs:
            logger.info(f"Skipping (already processed): {pdf_name}")
            continue
        pdfs_to_process.append(pdf_path)

    # Apply limit
    if limit and limit > 0:
        pdfs_to_process = pdfs_to_process[:limit]
        logger.info(f"Limiting processing to {limit} PDFs")

    if not pdfs_to_process:
        logger.info("No PDFs to process")
        return []

    logger.info(f"Processing {len(pdfs_to_process)} PDFs...")

    if dry_run:
        logger.info("DRY RUN - Would process:")
        for pdf_path in pdfs_to_process:
            logger.info(f"  - {pdf_path.name}")
        return []

    # Process PDFs with progress bar
    for pdf_path in tqdm(pdfs_to_process, desc="PDFs", unit="file"):
        try:
            logger.info(f"\n{'='*60}")
            parser = GeminiProjectParser(str(pdf_path))
            projects = parser.process(show_progress=True)
            all_projects.extend(projects)

            # Update checkpoint
            processed_pdfs.append(pdf_path.name)
            save_checkpoint(processed_pdfs)

            # Track statistics
            stats.add_pdf(pdf_path.name, len(projects), success=True)

            logger.info(f"{'='*60}")

            # Rate limiting between PDFs
            time.sleep(RATE_LIMIT_PDF_DELAY)

        except Exception as e:
            logger.error(f"Failed to process {pdf_path.name}: {e}", exc_info=True)
            stats.add_pdf(pdf_path.name, 0, success=False)
            continue

    return all_projects


def print_summary():
    """Print processing summary statistics"""
    summary = stats.get_summary()

    logger.info("\n" + "=" * 60)
    logger.info("PROCESSING SUMMARY")
    logger.info("=" * 60)
    logger.info(f"Elapsed time: {summary['elapsed_time']:.2f} seconds")
    logger.info(f"Total PDFs processed: {summary['total_pdfs']}")
    logger.info(f"  - Successful: {summary['successful_pdfs']}")
    logger.info(f"  - Failed: {summary['failed_pdfs']}")
    logger.info(f"Total projects extracted: {summary['total_projects']}")
    logger.info(f"Total API calls made: {summary['total_api_calls']}")
    logger.info(f"Validation warnings: {summary['validation_warnings']}")

    if summary['pdf_projects']:
        logger.info("\nProjects per PDF:")
        for pdf_name, count in summary['pdf_projects'].items():
            logger.info(f"  {pdf_name}: {count} projects")

    logger.info("=" * 60)


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='Parse Tamil project PDFs with Google Gemini Vision API',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Test with single PDF
  python3 %(prog)s --test கீழூர்.pdf

  # Process all PDFs
  python3 %(prog)s --all

  # Process specific PDF
  python3 %(prog)s --pdf வடக்குமேலூர்.pdf

  # Resume interrupted processing
  python3 %(prog)s --all --resume

  # Process first 3 PDFs (testing)
  python3 %(prog)s --all --limit 3

  # Dry run (show what would be processed)
  python3 %(prog)s --all --dry-run
        """
    )

    parser.add_argument('--test', type=str, help='Test with single PDF file')
    parser.add_argument('--all', action='store_true', help='Process all PDFs in directory')
    parser.add_argument('--pdf', type=str, help='Process specific PDF by name')
    parser.add_argument('--output', type=str, default=OUTPUT_CSV, help='Output CSV file path')
    parser.add_argument('--resume', action='store_true', help='Resume from checkpoint')
    parser.add_argument('--force', action='store_true', help='Ignore checkpoint and reprocess all')
    parser.add_argument('--limit', type=int, help='Limit number of PDFs to process')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be processed without API calls')
    parser.add_argument('--clean-checkpoint', action='store_true', help='Remove checkpoint file')

    args = parser.parse_args()

    # Log configuration
    logger.info("=" * 60)
    logger.info("Tamil Project PDF Parser - Google Gemini Vision API")
    logger.info("=" * 60)
    logger.info(f"Gemini Model: {GEMINI_MODEL}")
    logger.info(f"PDF Directory: {PDF_DIR}")
    logger.info(f"Output CSV: {args.output}")
    logger.info(f"PDF DPI: {PDF_DPI}")
    logger.info(f"Max Retries: {MAX_RETRIES}")
    logger.info("=" * 60)

    try:
        if args.clean_checkpoint:
            clean_checkpoint()
            logger.info("Checkpoint cleaned")
            return

        if args.force and args.resume:
            logger.warning("Both --force and --resume specified, --force takes precedence")
            args.resume = False

        if args.force:
            clean_checkpoint()
            logger.info("Checkpoint cleared (--force mode)")

        if args.test:
            # Process single PDF
            pdf_path = args.test if os.path.exists(args.test) else os.path.join(PDF_DIR, args.test)

            if not os.path.exists(pdf_path):
                logger.error(f"PDF file not found: {pdf_path}")
                sys.exit(1)

            projects = process_single_pdf(pdf_path)
            write_to_csv(projects, args.output)

        elif args.pdf:
            # Process specific PDF
            pdf_path = args.pdf if os.path.exists(args.pdf) else os.path.join(PDF_DIR, args.pdf)

            if not os.path.exists(pdf_path):
                logger.error(f"PDF file not found: {pdf_path}")
                sys.exit(1)

            projects = process_single_pdf(pdf_path)
            write_to_csv(projects, args.output)

        elif args.all:
            # Process all PDFs
            projects = process_all_pdfs(
                pdf_dir=PDF_DIR,
                resume=args.resume,
                limit=args.limit,
                dry_run=args.dry_run
            )

            if not args.dry_run:
                write_to_csv(projects, args.output)

        else:
            parser.print_help()
            return

        # Print summary
        if not args.dry_run and not args.clean_checkpoint:
            print_summary()

    except KeyboardInterrupt:
        logger.warning("\n\nProcessing interrupted by user")
        logger.info("Progress saved to checkpoint. Use --resume to continue.")
        print_summary()
        sys.exit(1)
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        sys.exit(1)


if __name__ == '__main__':
    main()
