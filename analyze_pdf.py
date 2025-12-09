from pdfminer.high_level import extract_text
import os

pdf_path = 'docs/kurinjipadi-block-projects/அன்னதானம்பேட்டை.pdf'
try:
    text = extract_text(pdf_path)
    print(f"--- Text from {pdf_path} ---")
    print(text)
    print("------------------------------")
except Exception as e:
    print(f"Error extracting text: {e}")
