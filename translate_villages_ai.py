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

INPUT_FILE = 'villages_to_translate.json'
OUTPUT_FILE = 'translated_villages_ai.json'
BATCH_SIZE = 10
MODEL = "anthropic/claude-3-haiku"  # Cost effective and fast

def load_villages():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
        return data['needs_translation']

def save_translations(translations):
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(translations, f, ensure_ascii=False, indent=2)

def translate_batch(batch):
    """Translate a batch of Tamil village names to English"""
    prompt_items = []
    for v in batch:
        prompt_items.append(f"Tamil: {v['tamil']}\nSlug: {v['slug']}")
    
    prompt_text = "\n---\n".join(prompt_items)
    
    system_prompt = """You are a professional translator specializing in Tamil to English place name translation.
    
    Rules:
    1. Translate Tamil village names to English using standard transliteration rules
    2. Maintain phonetic accuracy and readability
    3. Use proper capitalization (e.g., "Vadakkuvelur", "Indhiranagar")
    4. For common words, use standard translations:
       - நகர் → "Nagar"
       - பேட்டை → "pettai" or "Pettai"
       - குப்பம் → "kuppam"
       - பாளையம் → "palayam"
       - காலனி → "Colony"
       - தெரு → "Street" or "Theru"
       - புரம் → "puram"
    5. Return ONLY a valid JSON array with objects containing 'tamil' and 'english' fields
    6. Do not include any explanatory text, only the JSON array
    """

    user_prompt = f"Translate these Tamil village names to English:\n\n{prompt_text}"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Village Name Translator"
    }

    data = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    }

    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        content = result['choices'][0]['message']['content']
        
        # Find JSON in content
        start = content.find('[')
        end = content.rfind(']') + 1
        if start != -1 and end != 0:
            json_str = content[start:end]
            return json.loads(json_str)
        else:
            print(f"Error parsing JSON from response: {content[:200]}...")
            return []
    except Exception as e:
        print(f"API Error: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"Response: {e.response.text[:500]}")
        return []

def main():
    villages = load_villages()
    total = len(villages)
    print(f"Loaded {total} villages to translate.")

    translated_data = []
    
    # Check if we can resume
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                existing = json.load(f)
                translated_tamil = {t['tamil'] for t in existing}
                translated_data = existing
                print(f"Resuming... {len(translated_data)} already translated.")
        except:
            pass
    
    # Filter out already translated
    remaining_villages = [v for v in villages if v['tamil'] not in {t.get('tamil') for t in translated_data}]
    print(f"Remaining to translate: {len(remaining_villages)}")

    for i in range(0, len(remaining_villages), BATCH_SIZE):
        batch = remaining_villages[i:i+BATCH_SIZE]
        print(f"\nTranslating batch {i//BATCH_SIZE + 1} ({len(batch)} items)...")
        
        translations = translate_batch(batch)
        
        if translations:
            # Merge with original data to preserve count and slug
            for t in translations:
                # Find original village data
                original = next((v for v in batch if v['tamil'] == t['tamil']), None)
                if original:
                    translated_data.append({
                        'tamil': t['tamil'],
                        'english': t['english'],
                        'count': original['count'],
                        'slug': original['slug']
                    })
            
            save_translations(translated_data)
            print(f"Saved {len(translated_data)}/{total} villages.")
        else:
            print("Batch failed, skipping...")
        
        time.sleep(1)  # Be nice to rate limits

    print(f"\n✅ Translation complete! {len(translated_data)} villages translated.")
    print(f"Output saved to: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
