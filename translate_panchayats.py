import json
import os
import time
import requests

# Get API key from wp-config.php
API_KEY = None
try:
    with open('wp-config.php', 'r', encoding='utf-8') as f:
        content = f.read()
        import re
        match = re.search(r"define\('OPENROUTER_API_KEY',\s*'([^']+)'\)", content)
        if match:
            API_KEY = match.group(1)
except:
    pass

if not API_KEY:
    print("Error: OPENROUTER_API_KEY not found in wp-config.php")
    exit(1)

INPUT_FILE = 'tamil_panchayats_to_translate.json'
OUTPUT_FILE = 'translated_panchayats.json'

# Use the cheapest Gemini model available via OpenRouter
# Correct model name format for OpenRouter
MODEL = "anthropic/claude-3-haiku"

print(f"Using model: {MODEL}\n")

def load_data():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_translations(translations):
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(translations, f, ensure_ascii=False, indent=2)

def translate_names(tamil_panchayats):
    """Translate Tamil panchayat names to English using Gemini AI"""
    
    if not tamil_panchayats:
        return []
    
    # Prepare the list of names
    names_list = "\n".join([f"{i+1}. {p['tamil']}" for i, p in enumerate(tamil_panchayats)])
    
    system_prompt = """You are an expert in Tamil place name transliteration. 
Translate the following Tamil panchayat/village names into proper English transliterations.

RULES:
1. These are place names in Tamil Nadu, India
2. Use standard Tamil romanization (e.g., "கடம்புலியூர்" → "Kadampuliyur")
3. Preserve the phonetic pronunciation
4. Return ONLY a JSON array with objects containing "tamil" and "english" keys
5. NO markdown, NO code blocks, NO explanations - ONLY the JSON array

Example:
[
  {"tamil": "வெங்கடாம்பேட்டை", "english": "Vengadampettai"},
  {"tamil": "வடக்குத்து", "english": "Vadakuthu"}
]
"""

    user_prompt = f"""Translate these Tamil panchayat names to English:

{names_list}

Return ONLY the JSON array:"""

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Panchayat Translator"
    }

    data = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2
    }

    try:
        print(f"Translating {len(tamil_panchayats)} panchayat names...\n")
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        response.raise_for_status()
        result = response.json()
        
        content = result['choices'][0]['message']['content'].strip()
        
        # Remove markdown code blocks if present
        if '```' in content:
            lines = content.split('\n')
            content = '\n'.join([line for line in lines if not line.strip().startswith('```')])
            content = content.strip()
        
        # Extract JSON array
        start = content.find('[')
        end = content.rfind(']') + 1
        
        if start != -1 and end > start:
            json_str = content[start:end]
            translations = json.loads(json_str)
            return translations
        else:
            print(f"Error: Could not find JSON in response")
            print(f"Response: {content}")
            return []
            
    except Exception as e:
        print(f"API Error: {e}")
        return []

def main():
    data = load_data()
    
    print("=================================================================")
    print("TRANSLATING TAMIL PANCHAYAT NAMES USING GEMINI AI")
    print("=================================================================\n")
    
    tamil_panchayats = data.get('tamil_panchayats', [])
    
    print(f"Total panchayats: {data['metadata']['total_panchayats']}")
    print(f"Tamil-named: {data['metadata']['tamil_named']}")
    print(f"English-named: {data['metadata']['english_named']}\n")
    
    if not tamil_panchayats:
        print("No Tamil-named panchayats to translate!")
        return
    
    # Translate
    translations = translate_names(tamil_panchayats)
    
    if translations:
        # Merge with count information
        for i, trans in enumerate(translations):
            if i < len(tamil_panchayats):
                trans['count'] = tamil_panchayats[i]['count']
                trans['slug'] = tamil_panchayats[i]['slug']
        
        # Save
        output_data = {
            'metadata': {
                'translated_count': len(translations),
                'model_used': MODEL,
                'translation_date': time.strftime('%Y-%m-%d %H:%M:%S')
            },
            'translations': translations
        }
        
        save_translations(output_data)
        
        print("=================================================================")
        print("TRANSLATION RESULTS")
        print("=================================================================\n")
        
        for t in translations:
            print(f"Tamil:   {t['tamil']}")
            print(f"English: {t['english']}")
            print(f"Count:   {t.get('count', 0)} projects\n")
        
        print(f"Saved to: {OUTPUT_FILE}")
        print("=================================================================")
    else:
        print("Translation failed!")

if __name__ == "__main__":
    main()
