import json
import os
import time
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    print("Error: OPENROUTER_API_KEY not found in .env file")
    exit(1)

INPUT_FILE = 'kurinjipadi_to_translate.json'
OUTPUT_FILE = 'translated_kurinjipadi_ai.json'
BATCH_SIZE = 10
MODEL = "anthropic/claude-3-haiku" # Cost effective and fast

def load_projects():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_projects(projects):
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(projects, f, ensure_ascii=False, indent=2)

def translate_batch(batch):
    prompt_items = []
    for p in batch:
        prompt_items.append(f"ID: {p['id']}\nTitle: {p['title']}\nContent: {p['description']}")
    
    prompt_text = "\n---\n".join(prompt_items)
    
    system_prompt = """You are a professional translator. Translate the following Tamil project titles and descriptions into clear, professional English. 
    The content is about government infrastructure projects (roads, drains, buildings, water supply).
    
    Rules:
    1. Keep the output in strictly valid JSON format as a list of objects with 'id', 'translated_title', and 'translated_content'.
    2. Maintain the original IDs as 'id'.
    3. 'translated_title': The English translation of the title. Capitalize nicely.
    4. 'translated_content': The English translation of the content. If content is empty or same as title, translate accordingly.
    5. Do not include any introductory or concluding text, ONLY the JSON array.
    6. Translate metadata-like text sensibly.
    7. Retain proper names (village names like 'Kurinjipadi', 'Neyveli', etc.) accurately if possible, or phonetically if unknown.
    """

    user_prompt = f"Translate these items:\n\n{prompt_text}"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", # OpenRouter requires this
        "X-Title": "Kurinjipadi Translator"
    }

    data = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "response_format": {"type": "json_object"} 
    }

    # OpenRouter/Claude sometimes doesn't support response_format json_object strictly like OpenAI, 
    # but we can instruct it in system prompt (which we did).
    # Removing response_format to be safe with all providers via OpenRouter unless sure.
    # Actually Claude 3 supports tool use or just clear prompting. 
    # Let's stick to clear prompting and text extraction for now to be generic.
    del data["response_format"]

    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        content = result['choices'][0]['message']['content']
        
        # Find JSON in content
        start = content.find('[')
        end = content.rfind(']') + 1
        if start != -1 and end != -1:
            json_str = content[start:end]
            return json.loads(json_str)
        else:
            print(f"Error parsing JSON from response: {content[:100]}...")
            return []
    except Exception as e:
        print(f"API Error: {e}")
        return []

def main():
    projects = load_projects()
    total = len(projects)
    print(f"Loaded {total} projects to translate.")

    translated_data = []
    
    # Check if we can resume
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                existing = json.load(f)
                translated_ids = {p['ID'] for p in existing}
                translated_data = existing
                print(f"Resuming... {len(translated_data)} already translated.")
        except:
            pass
    
    # Filter out already translated
    remaining_projects = [p for p in projects if p.get('id') not in {t.get('id') for t in translated_data}]
    print(f"Remaining to translate: {len(remaining_projects)}")

    for i in range(0, len(remaining_projects), BATCH_SIZE):
        batch = remaining_projects[i:i+BATCH_SIZE]
        print(f"Translating batch {i//BATCH_SIZE + 1} ({len(batch)} items)...")
        
        translations = translate_batch(batch)
        
        if translations:
            # Merge translations back
            for t in translations:
                # Find original to preserve other fields if needed, or just append
                translated_data.append(t)
            
            save_projects(translated_data)
            print(f"Saved {len(translated_data)}/{total} projects.")
        else:
            print("Batch failed, skipping...")
        
        time.sleep(1) # Be nice to rate limits

    print("Translation complete.")

if __name__ == "__main__":
    main()
