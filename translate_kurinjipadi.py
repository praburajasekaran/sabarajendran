import json
import re

# Load source data
with open('/Applications/MAMP/htdocs/sabarajendran/kurinjipadi_to_translate.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

# Translation Glossary (Regex -> Replacement)
# Order matters: Specific phrases first, then general terms.
glossary = [
    # Schools & Buildings
    (r'ஊராட்சி ஒன்றிய நடுநிலைப்பள்ளி', 'Panchayat Union Middle School'),
    (r'ஊராட்சி ஒன்றிய தொடக்கப்பள்ளி', 'Panchayat Union Primary School'),
    (r'ஊ\.ஒ\.தொ\.பள்ளி', 'Panchayat Union Primary School'),
    (r'அரசு உயர்நிலைப்பள்ளி', 'Government High School'),
    (r'அரசு மருத்துவமனை', 'Government Hospital'),
    (r'அங்கன்வாடி மையம்', 'Anganwadi Center'),
    (r'அங்கன்வாடி', 'Anganwadi'),
    (r'சமையலறை', 'Kitchen'),
    (r'சமையறை', 'Kitchen'),
    (r'கழிவறை', 'Toilet'),
    (r'கழிப்பறை', 'Toilet'),
    (r'வகுப்பறைகள்', 'Classrooms'),
    (r'சுற்றுச்சுவர்', 'Compound Wall'),
    (r'நியாய விலக்கடை', 'Ration Shop'),
    (r'நியாயவிலைக்கடை', 'Ration Shop'),
    (r'நூலகம்', 'Library'),
    (r'சுகாதார வளாகம்', 'Sanitary Complex'),
    (r'பம்பு ரூம்', 'Pump Room'),
    
    # Infrastructure Works
    (r'பேவர் பிளாக் சாலை அமைத்தல்', 'Construction of Paver Block Road'),
    (r'சிமெண்ட் சாலை அமைத்தல்', 'Construction of Cement Road'),
    (r'தார்சாலை அமைத்தல்', 'Construction of Tar Road'),
    (r'தார் சாலை அமைத்தல்', 'Construction of Tar Road'),
    (r'சாலை அமைத்தல்', 'Construction of Road'),
    (r'சாலை மேம்பாடு செய்தல்', 'Road Improvement Works'),
    (r'வடிகால் வாய்க்கால் அமைத்தல்', 'Construction of Drainage Channel'),
    (r'வடிகால் அமைத்தல்', 'Construction of Drainage'),
    (r'குடிநீர் இணைப்பு வழங்குதல்', 'Providing Water Supply Connection'),
    (r'குடிநீர் குழாய் இணைப்பு', 'Water Pipeline Connection'),
    (r'குடிநீர் குழாய்', 'Water Pipeline'),
    (r'ஆழ்துளை கிணறு', 'Borewell'),
    (r'ஆழ்நீரை கிணறு', 'Borewell'),
    (r'மேல்நிலை நீர்தேக்க தொட்டி', 'Overhead Water Tank'),
    (r'நீர்த்தேக்க தொட்டி', 'Water Tank'),
    (r'தடுப்பு சுவர்', 'Retaining Wall'),
    (r'தடுப்பணைகள்', 'Check Dams'),
    (r'தடுப்பணை', 'Check Dam'),
    (r'ஏரி புனரமைப்பு', 'Lake Rejuvenation'),
    (r'குளம் புனரமைத்தல்', 'Pond Rejuvenation'),
    (r'ஏரி புனரமைத்தல்', 'Lake Rejuvenation'),
    (r'பழுது நீக்கம் செய்தல்', 'Repair Works'),
    (r'பழுது நீக்கம்', 'Repair Works'),
    (r'பழுது நீடிப்பு செய்தல்', 'Repair Works'),
    (r'புதுப்பித்து சீரமைக்கும் செய்தல்', 'Renovation Works'),
    (r'புதுப்பிக்கும் பணிகள்', 'Renovation Works'),
    (r'மரம் நடும் விழா', 'Tree Plantation'),
    (r'மரக்கன்று நடுதல்', 'Planting Saplings'),
    (r'மின்விளக்குகள் அமைத்தல்', 'Installation of Street Lights'),
    (r'தெருவிளக்குகள்', 'Street Lights'),

    # Locations & Modifiers
    (r'ஊராட்சி', 'Panchayat'),
    (r'நகர்', 'Nagar'),
    (r'காலனி', 'Colony'),
    (r'தெரு', 'Street'),
    (r'கோவில்', 'Temple'),
    (r'அருகில்', 'Near'),
    (r'கிழக்கு', 'East'),
    (r'மேற்கு', 'West'),
    (r'வடக்கு', 'North'),
    (r'தெற்கு', 'South'),
    (r'பெண்கள்', 'Women'),
    (r'ஆண்கள்', 'Men'),
    (r'மற்றும்', 'and'),
    (r'வீடுகளுக்கு', 'for houses'),
    
    # Names (Transliteration attempts for common prefixes/suffixes if needed, 
    # but mostly we leave proper names as is or hope they are handled by context)
]

def translate_text(text):
    if not text:
        return text
    
    original = text
    # Apply replacements
    for pattern, replacement in glossary:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    
    # Cleanup
    text = text.replace('  ', ' ').strip()
    
    # Capitalize first letter
    if text:
        text = text[0].upper() + text[1:]
        
    return text

translated_projects = []
for project in projects:
    t_title = translate_text(project['title'])
    t_desc = translate_text(project['description'])
    
    translated_projects.append({
        'id': project['id'],
        'title': t_title,
        'description': t_desc,
        'original_title': project['title'] # Keep for reference/backup
    })

# Save output
with open('/Applications/MAMP/htdocs/sabarajendran/translated_kurinjipadi_final.json', 'w', encoding='utf-8') as f:
    json.dump(translated_projects, f, indent=4, ensure_ascii=False)

print(f"Translated {len(translated_projects)} projects.")
