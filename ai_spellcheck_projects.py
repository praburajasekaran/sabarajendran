import json
import os
import time
import requests
from dotenv import load_dotenv

# Load environment variables for API key
load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    # Try to find key in wp-config if not in env
    try:
        with open('wp-config.php', 'r') as f:
            content = f.read()
            if 'OPENROUTER_API_KEY' in content:
                import re
                match = re.search(r"define\('OPENROUTER_API_KEY',\s*'([^']+)'\);", content)
                if match:
                    API_KEY = match.group(1)
                    print("Found API Key in wp-config.php")
    except:
        pass

if not API_KEY:
    print("Error: OPENROUTER_API_KEY not found.")
    exit(1)

INPUT_FILE = 'projects_to_spellcheck.json'
OUTPUT_FILE = 'spellchecked_projects.json'
BATCH_SIZE = 15 # Slightly larger batch for efficiency
MODEL = "google/gemini-2.0-flash-exp" # Using Flash Exp for best performance/cost ratio, or fallback to 1.5-flash

def load_projects():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_projects(projects):
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(projects, f, ensure_ascii=False, indent=2)

def check_batch(batch):
    prompt_items = []
    for p in batch:
        # Only sending fields that need checking to save tokens
        item_text = f"ID: {p['id']}\nEnglish Title: {p['title_en']}\nEnglish Content: {p['content_en']}\nTamil Title: {p['title_ta']}\nTamil Content: {p['content_ta']}"
        prompt_items.append(item_text)
    
    prompt_text = "\n---\n".join(prompt_items)
    
    system_prompt = """You are an expert editor and translator for government infrastructure projects in Tamil Nadu.
    Your task is to correct spelling and formatting mistakes in both English and Tamil project titles and descriptions.

    Specific Rules & Examples:
    1. Expand abbreviations:
       - "Const" -> "Construction"
       - "Prov" -> "Provision" or "Providing" (context dependent)
       - "Imp" -> "Improvement"
       - "Addl" -> "Additional"
    2. Correct specific Tamil/English mismatches or typos:
       - "Vallam - Nadukuppam Road (0/0-1.200)" -> "Laying of Vallam - Nadukuppam Road (0/0-1.200)" (Add descriptive action if missing)
       - "Arasadikuppam - A.puthur Road" -> "Laying of Arasadikuppam - A.Puthur Road"
       - "Class Room" -> "Classroom"
    3. Tamil Corrections:
       - Ensure proper spelling in Tamil (e.g., 'பானருட்டி' -> 'பண்ருட்டி' if seen).
       - Ensure "Laying of Road" context is reflected in Tamil if it's just a place name.
    4. Do NOT change proper names of villages unless they are obviously misspelled (e.g., 'Kurinjipadi', 'Neyveli').
    5. Output JSON ONLY.
    
    Output Format:
    Return a valid JSON array of objects. Each object must have:
    - "id": The original ID (Integer)
    - "title_en": Corrected English Title
    - "content_en": Corrected English Content
    - "title_ta": Corrected Tamil Title
    - "content_ta": Corrected Tamil Content
    
    If no correction is needed, return the original text exactly.
    """

    user_prompt = f"Correct these items:\n\n{prompt_text}"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Project Spellchecker"
    }

    data = {
        "model": "google/gemini-2.0-flash-exp:free", # Using free router model or just standard
        # Actually let's use a very standard one to avoid 404s
        "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
        # Wait, simple is better.
        "model": "google/gemini-2.0-pro-exp-02-05:free",
        # Let's stick to what works usually.
        "model": "google/gemini-2.0-flash-001",
        
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "response_format": {"type": "json_object"}
    }
    
    # Overriding model locally to be safe
    # Using a known working model from OpenRouter docs
    data["model"] = "google/gemini-2.0-flash-001" 

    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        
        if response.status_code != 200:
             print(f"Error Status: {response.status_code}")
             print(response.text)
             # Fallback to Haiku if Gemini fails
             print("Falling back to Claude 3 Haiku...")
             data["model"] = "anthropic/claude-3-haiku"
             del data["response_format"] # Claude might not like strict json_object mode via some routers
             response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        
        response.raise_for_status()
        result = response.json()
        content = result['choices'][0]['message']['content']
        
        # Robust JSON extraction
        start = content.find('[')
        end = content.rfind(']') + 1
        if start != -1 and end != -1:
            json_str = content[start:end]
            return json.loads(json_str)
        else:
            print(f"Error parsing JSON from response: {content[:100]}...")
            return None
    except Exception as e:
        print(f"API Error: {e}")
        return None

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"Input file {INPUT_FILE} not found.")
        return

    projects = load_projects()
    total = len(projects)
    print(f"Loaded {total} projects to check.")

    corrected_data = []
    
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                existing = json.load(f)
                corrected_data = existing
                print(f"Resuming... {len(corrected_data)} already processed.")
        except:
            pass
    
    processed_ids = {p['id'] for p in corrected_data}
    remaining_projects = [p for p in projects if p['id'] not in processed_ids]
    print(f"Remaining to process: {len(remaining_projects)}")

    for i in range(0, len(remaining_projects), BATCH_SIZE):
        batch = remaining_projects[i:i+BATCH_SIZE]
        print(f"Processing batch {i//BATCH_SIZE + 1} ({len(batch)} items)...")
        
        result = check_batch(batch)
        
        if result:
            count = 0
            for item in result:
                if 'id' in item:
                    corrected_data.append(item)
                    count += 1
            
            save_projects(corrected_data)
            print(f"Saved {count} items. Total: {len(corrected_data)}/{total}")
        else:
            print("Batch failed, skipping...")
        
        time.sleep(2)

    print("Spellcheck processing complete.")

if __name__ == "__main__":
    main()
