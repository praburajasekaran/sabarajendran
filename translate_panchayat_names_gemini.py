import json
import os
import time
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from wp-config.php or .env
API_KEY = os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    # Try reading from wp-config.php
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
    print("Error: OPENROUTER_API_KEY not found")
    exit(1)

INPUT_FILE = 'panchayat_locations.json'
OUTPUT_FILE = 'translated_panchayat_names.json'

# Use the cheapest Gemini model available
# As of now, gemini-flash-1.5-8b is the cheapest option
MODEL = "google/gemini-flash-1.5-8b"

print(f"Using model: {MODEL}")
print(f"API Key: {API_KEY[:20]}...")

def load_panchayat_data():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_translations(translations):
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(translations, f, ensure_ascii=False, indent=2)

def translate_panchayat_names(tamil_names):
    """
    Translate Tamil panchayat names to English using Gemini AI
    """
    if not tamil_names:
        return []
    
    # Prepare the prompt
    names_list = "\n".join([f"{i+1}. {name['tamil']}" for i, name in enumerate(tamil_names)])
    
    system_prompt = """You are a professional translator specializing in Tamil place names. 
Translate the following Tamil panchayat/village names into English. 

IMPORTANT RULES:
1. These are place names (villages/panchayats) in Tamil Nadu, India
2. Provide phonetic English transliterations that preserve the original Tamil pronunciation
3. Use standard romanization conventions for Tamil place names
4. Return ONLY a valid JSON array with objects containing 'tamil' and 'english' keys
5. Do NOT include any explanatory text, markdown formatting, or code blocks
6. The JSON must be parseable directly

Example format:
[
  {"tamil": "வெங்கடாம்பேட்டை", "english": "Vengadampettai"},
  {"tamil": "வடக்குத்து", "english": "Vadakuthu"}
]
"""

    user_prompt = f"""Translate these Tamil panchayat names to English:

{names_list}

Return ONLY the JSON array, nothing else."""

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Panchayat Name Translator"
    }

    data = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.3  # Lower temperature for more consistent translations
    }

    try:
        print(f"\nTranslating {len(tamil_names)} panchayat names...")
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        response.raise_for_status()
        result = response.json()
        
        content = result['choices'][0]['message']['content']
        print(f"\nAPI Response:\n{content}\n")
        
        # Try to parse JSON from the response
        # Remove markdown code blocks if present
        content = content.strip()
        if content.startswith('```'):
            # Remove code block markers
            lines = content.split('\n')
            content = '\n'.join([line for line in lines if not line.startswith('```')])
            content = content.strip()
        
        # Find JSON array in content
        start = content.find('[')
        end = content.rfind(']') + 1
        if start != -1 and end != 0:
            json_str = content[start:end]
            translations = json.loads(json_str)
            return translations
        else:
            print(f"Error: Could not find JSON array in response")
            print(f"Content: {content}")
            return []
            
    except Exception as e:
        print(f"API Error: {e}")
        if hasattr(e, 'response'):
            print(f"Response: {e.response.text if hasattr(e.response, 'text') else e.response}")
        return []

def main():
    # Load the panchayat data
    data = load_panchayat_data()
    
    print("=================================================================")
    print("PANCHAYAT NAME TRANSLATION USING GEMINI AI")
    print("=================================================================\n")
    
    print(f"Total panchayats: {data['metadata']['total_panchayats']}")
    print(f"Already translated: {data['metadata']['already_translated']}")
    print(f"Need translation: {data['metadata']['needs_translation']}\n")
    
    if data['metadata']['needs_translation'] == 0:
        print("No panchayats need translation!")
        
        # But wait - let's check if there are Tamil-named panchayats in the "already_translated" list
        # that actually need English names
        tamil_in_already_translated = []
        for item in data['already_translated']:
            # Check if the "english" field actually contains Tamil characters
            if 'english' in item:
                import re
                if re.search(r'[\u0B80-\u0BFF]', item['english']):
                    tamil_in_already_translated.append({
                        'tamil': item['english'],
                        'count': item.get('count', 0)
                    })
        
        if tamil_in_already_translated:
            print(f"\nFound {len(tamil_in_already_translated)} panchayats with Tamil names that need translation:")
            for item in tamil_in_already_translated:
                print(f"  - {item['tamil']} (used in {item['count']} projects)")
            
            print("\nTranslating these names...")
            translations = translate_panchayat_names(tamil_in_already_translated)
            
            if translations:
                # Save translations
                output_data = {
                    'metadata': {
                        'translated_count': len(translations),
                        'model_used': MODEL,
                        'translation_date': time.strftime('%Y-%m-%d %H:%M:%S')
                    },
                    'translations': translations
                }
                
                save_translations(output_data)
                
                print(f"\n=================================================================")
                print(f"TRANSLATION RESULTS")
                print(f"=================================================================\n")
                
                for t in translations:
                    print(f"Tamil: {t['tamil']}")
                    print(f"English: {t['english']}\n")
                
                print(f"Saved to: {OUTPUT_FILE}")
                print(f"=================================================================")
            else:
                print("Translation failed!")
        else:
            print("All panchayats already have proper English names.")
        
        return
    
    # Translate the names that need translation
    translations = translate_panchayat_names(data['needs_translation'])
    
    if translations:
        # Save translations
        output_data = {
            'metadata': {
                'translated_count': len(translations),
                'model_used': MODEL,
                'translation_date': time.strftime('%Y-%m-%d %H:%M:%S')
            },
            'translations': translations
        }
        
        save_translations(output_data)
        
        print(f"\n=================================================================")
        print(f"TRANSLATION COMPLETE")
        print(f"=================================================================\n")
        
        for t in translations:
            print(f"Tamil: {t['tamil']}")
            print(f"English: {t['english']}\n")
        
        print(f"Saved to: {OUTPUT_FILE}")
    else:
        print("Translation failed!")

if __name__ == "__main__":
    main()
