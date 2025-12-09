import os
import google.generativeai as genai
from pdf2image import convert_from_path
from pathlib import Path
import time

# Configure API
API_KEY = "AIzaSyDyRCl5gq6lZh2jGvtmj3gkg0a856TiO4I"
genai.configure(api_key=API_KEY)

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)

SOURCE_DIR = "/Applications/MAMP/htdocs/sabarajendran/docs/kurinjipadi-block-projects"

def convert_pdf_to_tamil(pdf_path):
    print(f"Processing {pdf_path}...")
    try:
        images = convert_from_path(pdf_path)
    except Exception as e:
        print(f"Error converting {pdf_path} to images: {e}")
        print("Make sure poppler is installed (brew install poppler)")
        return

    full_text = ""
    for i, image in enumerate(images):
        print(f"  Processing page {i+1}/{len(images)}...")
        try:
            # Adding a small delay to respect potential rate limits if processing many fast
            if i > 0:
                time.sleep(1) 
            
            prompt = "Convert the content of this image into Tamil Unicode text. Return only the text content. Maintain the structure (tables, lists) as much as possible in text format."
            response = model.generate_content([prompt, image])
            full_text += response.text + "\n\n"
        except Exception as e:
            print(f"  Error processing page {i+1}: {e}")
            full_text += f"[Error processing page {i+1}]\n\n"

    output_filename = f"{Path(pdf_path).stem}.txt"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(full_text)
    print(f"Finished {pdf_path}. Saved to {output_filename}")

def main():
    if not os.path.exists(SOURCE_DIR):
        print(f"Directory not found: {SOURCE_DIR}")
        return

    os.chdir(SOURCE_DIR)
    files = [f for f in os.listdir('.') if f.lower().endswith('.pdf')]
    files.sort()
    
    print(f"Found {len(files)} PDF files in {SOURCE_DIR}")
    
    for pdf_file in files:
        convert_pdf_to_tamil(pdf_file)

if __name__ == "__main__":
    main()
