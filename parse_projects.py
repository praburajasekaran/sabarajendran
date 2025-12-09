
import os
import re
import csv
import glob
from pdfminer.high_level import extract_text

# Bamini Dictionary from research
bamini_dict = {}

# Populate dictionary (pasted from research)
bamini_dict["sp"] = "ளி"
bamini_dict["hp"] = "ரி"
bamini_dict["hP"] = "ரீ"
bamini_dict["uP"] = "ரீ"
bamini_dict["u;"] = "ர்"
bamini_dict["h;"] = "ர்"
bamini_dict["H"] = "ர்"
bamini_dict["nfs"] = "கௌ"
bamini_dict["Nfh"] = "கோ"
bamini_dict["nfh"] = "கொ"
bamini_dict["fh"] = "கா"
bamini_dict["fp"] = "கி"
bamini_dict["fP"] = "கீ"
bamini_dict["F"] = "கு"
bamini_dict["$"] = "கூ"
bamini_dict["nf"] = "கெ"
bamini_dict["Nf"] = "கே"
bamini_dict["if"] = "கை"
bamini_dict["f;"] = "க்"
bamini_dict["f"] = "க"
bamini_dict["nqs"] = "ஙௌ"
bamini_dict["Nqh"] = "ஙோ"
bamini_dict["nqh"] = "ஙொ"
bamini_dict["qh"] = "ஙா"
bamini_dict["qp"] = "ஙி"
bamini_dict["qP"] = "ஙீ"
bamini_dict["nq"] = "ஙெ"
bamini_dict["Nq"] = "ஙே"
bamini_dict["iq"] = "ஙை"
bamini_dict["q;"] = "ங்"
bamini_dict["q"] = "ங"
bamini_dict["nrs"] = "சௌ"
bamini_dict["Nrh"] = "சோ"
bamini_dict["nrh"] = "சொ"
bamini_dict["rh"] = "சா"
bamini_dict["rp"] = "சி"
bamini_dict["rP"] = "சீ"
bamini_dict["R"] = "சு"
bamini_dict["#"] = "சூ"
bamini_dict["nr"] = "செ"
bamini_dict["Nr"] = "சே"
bamini_dict["ir"] = "சை"
bamini_dict["r;"] = "ச்"
bamini_dict["r"] = "ச"
bamini_dict["n[s"] = "ஜௌ"
bamini_dict["N[h"] = "ஜோ"
bamini_dict["n[h"] = "ஜொ"
bamini_dict["[h"] = "ஜா"
bamini_dict["[p"] = "ஜி"
bamini_dict["[P"] = "ஜீ"
bamini_dict["[{"] = "ஜு"
bamini_dict["[_"] = "ஜூ"
bamini_dict["n["] = "ஜெ"
bamini_dict["N["] = "ஜே"
bamini_dict["i["] = "ஜை"
bamini_dict["[;"] = "ஜ்"
bamini_dict["["] = "ஜ"
bamini_dict["nQs"] = "ஞௌ"
bamini_dict["NQh"] = "ஞோ"
bamini_dict["nQh"] = "ஞொ"
bamini_dict["Qh"] = "ஞா"
bamini_dict["Qp"] = "ஞி"
bamini_dict["QP"] = "ஞீ"
bamini_dict["nQ"] = "ஞெ"
bamini_dict["NQ"] = "ஞே"
bamini_dict["iQ"] = "ஞை"
bamini_dict["Q;"] = "ஞ்"
bamini_dict["Q"] = "ஞ"
bamini_dict["nls"] = "டௌ"
bamini_dict["Nlh"] = "டோ"
bamini_dict["nlh"] = "டொ"
bamini_dict["lp"] = "டி"
bamini_dict["lP"] = "டீ"
bamini_dict["lh"] = "டா"
bamini_dict["b"] = "டி"
bamini_dict["B"] = "டீ"
bamini_dict["L"] = "டு"
bamini_dict["^"] = "டூ"
bamini_dict["nl"] = "டெ"
bamini_dict["Nl"] = "டே"
bamini_dict["il"] = "டை"
bamini_dict["l;"] = "ட்"
bamini_dict["l"] = "ட"
bamini_dict["nzs"] = "ணௌ"
bamini_dict["Nzh"] = "ணோ"
bamini_dict["nzh"] = "ணொ"
bamini_dict["zh"] = "ணா"
bamini_dict["zp"] = "ணி"
bamini_dict["zP"] = "ணீ"
bamini_dict["Zh"] = "ணூ"
bamini_dict["Z}"] = "ணூ"
bamini_dict["nz"] = "ணெ"
bamini_dict["Nz"] = "ணே"
bamini_dict["iz"] = "ணை"
bamini_dict["z;"] = "ண்"
bamini_dict["Z"] = "ணு"
bamini_dict["z"] = "ண"
bamini_dict["njs"] = "தௌ"
bamini_dict["Njh"] = "தோ"
bamini_dict["njh"] = "தொ"
bamini_dict["jh"] = "தா"
bamini_dict["jp"] = "தி"
bamini_dict["jP"] = "தீ"
bamini_dict["Jh"] = "தூ"
bamini_dict["Jh"] = "தூ"
bamini_dict["J}"] = "தூ"
bamini_dict["J"] = "து"
bamini_dict["nj"] = "தெ"
bamini_dict["Nj"] = "தே"
bamini_dict["ij"] = "தை"
bamini_dict["j;"] = "த்"
bamini_dict["j"] = "த"
bamini_dict["nes"] = "நௌ"
bamini_dict["Neh"] = "நோ"
bamini_dict["neh"] = "நொ"
bamini_dict["eh"] = "நா"
bamini_dict["ep"] = "நி"
bamini_dict["eP"] = "நீ"
bamini_dict["E}"] = "நூ"
bamini_dict["Eh"] = "நூ"
bamini_dict["E"] = "நு"
bamini_dict["ne"] = "நெ"
bamini_dict["Ne"] = "நே"
bamini_dict["ie"] = "நை"
bamini_dict["e;"] = "ந்"
bamini_dict["e"] = "ந"
bamini_dict["nds"] = "னௌ"
bamini_dict["Ndh"] = "னோ"
bamini_dict["ndh"] = "னொ"
bamini_dict["dh"] = "னா"
bamini_dict["dp"] = "னி"
bamini_dict["dP"] = "னீ"
bamini_dict["D}"] = "னூ"
bamini_dict["Dh"] = "னூ"
bamini_dict["D"] = "னு"
bamini_dict["nd"] = "னெ"
bamini_dict["Nd"] = "னே"
bamini_dict["id"] = "னை"
bamini_dict["d;"] = "ன்"
bamini_dict["d"] = "ன"
bamini_dict["ngs"] = "பௌ"
bamini_dict["Ngh"] = "போ"
bamini_dict["ngh"] = "பொ"
bamini_dict["gh"] = "பா"
bamini_dict["gp"] = "பி"
bamini_dict["gP"] = "பீ"
bamini_dict["G"] = "பு"
bamini_dict["ng"] = "பெ"
bamini_dict["Ng"] = "பே"
bamini_dict["ig"] = "பை"
bamini_dict["g;"] = "ப்"
bamini_dict["g"] = "ப"
bamini_dict["nks"] = "மௌ"
bamini_dict["Nkh"] = "மோ"
bamini_dict["nkh"] = "மொ"
bamini_dict["kh"] = "மா"
bamini_dict["kp"] = "மி"
bamini_dict["kP"] = "மீ"
bamini_dict["K"] = "மு"
bamini_dict["%"] = "மூ"
bamini_dict["nk"] = "மெ"
bamini_dict["Nk"] = "மே"
bamini_dict["ik"] = "மை"
bamini_dict["k;"] = "ம்"
bamini_dict["k"] = "ம"
bamini_dict["nas"] = "யௌ"
bamini_dict["Nah"] = "யோ"
bamini_dict["nah"] = "யொ"
bamini_dict["ah"] = "யா"
bamini_dict["ap"] = "யி"
bamini_dict["aP"] = "யீ"
bamini_dict["A"] = "யு"
bamini_dict["A+"] = "யூ"
bamini_dict["na"] = "யெ"
bamini_dict["Na"] = "யே"
bamini_dict["ia"] = "யை"
bamini_dict["a;"] = "ய்"
bamini_dict["a"] = "ய"
bamini_dict["nus"] = "ரௌ"
bamini_dict["Nuh"] = "ரோ"
bamini_dict["nuh"] = "ரொ"
bamini_dict["uh"] = "ரா"
bamini_dict["up"] = "ரி"
bamini_dict["U"] = "ரு"
bamini_dict["&"] = "ரூ"
bamini_dict["nu"] = "ரெ"
bamini_dict["Nu"] = "ரே"
bamini_dict["iu"] = "ரை"
bamini_dict["u"] = "ர"
bamini_dict["nys"] = "லௌ"
bamini_dict["Nyh"] = "லோ"
bamini_dict["nyh"] = "லொ"
bamini_dict["yh"] = "லா"
bamini_dict["yp"] = "லி"
bamini_dict["yP"] = "லீ"
bamini_dict["Yh"] = "லூ"
bamini_dict["Y}"] = "லூ"
bamini_dict["Y"] = "லு"
bamini_dict["ny"] = "லெ"
bamini_dict["Ny"] = "லே"
bamini_dict["iy"] = "லை"
bamini_dict["y;"] = "ல்"
bamini_dict["y"] = "ல"
bamini_dict["nss"] = "ளௌ"
bamini_dict["Nsh"] = "ளோ"
bamini_dict["nsh"] = "ளொ"
bamini_dict["sh"] = "ளா"
bamini_dict["sP"] = "ளீ"
bamini_dict["Sh"] = "ளூ"
bamini_dict["S"] = "ளு"
bamini_dict["ns"] = "ளெ"
bamini_dict["Ns"] = "ளே"
bamini_dict["is"] = "ளை"
bamini_dict["s;"] = "ள்"
bamini_dict["s"] = "ள"
bamini_dict["ntt"] = "வௌ"
bamini_dict["Nth"] = "வோ"
bamini_dict["nth"] = "வொ"
bamini_dict["th"] = "வா"
bamini_dict["tp"] = "வி"
bamini_dict["tP"] = "வீ"
bamini_dict["nt"] = "வெ"
bamini_dict["Nt"] = "வே"
bamini_dict["it"] = "வை"
bamini_dict["t;"] = "வ்"
bamini_dict["t"] = "வ"
bamini_dict["noo"] = "ழௌ"
bamini_dict["Noh"] = "ழோ"
bamini_dict["noh"] = "ழொ"
bamini_dict["oh"] = "ழா"
bamini_dict["op"] = "ழி"
bamini_dict["oP"] = "ழீ"
bamini_dict["*"] = "ழூ"
bamini_dict["O"] = "ழு"
bamini_dict["no"] = "ழெ"
bamini_dict["No"] = "ழே"
bamini_dict["io"] = "ழை"
bamini_dict["o;"] = "ழ்"
bamini_dict["o"] = "ழ"
bamini_dict["nws"] = "றௌ"
bamini_dict["Nwh"] = "றோ"
bamini_dict["nwh"] = "றொ"
bamini_dict["wh"] = "றா"
bamini_dict["wp"] = "றி"
bamini_dict["wP"] = "றீ"
bamini_dict["Wh"] = "றூ"
bamini_dict["W}"] = "றூ"
bamini_dict["W"] = "று"
bamini_dict["nw"] = "றெ"
bamini_dict["Nw"] = "றே"
bamini_dict["iw"] = "றை"
bamini_dict["w;"] = "ற்"
bamini_dict["w"] = "ற"
bamini_dict["n``"] = "ஹௌ"
bamini_dict["N`h"] = "ஹோ"
bamini_dict["n`h"] = "ஹொ"
bamini_dict["`h"] = "ஹா"
bamini_dict["`p"] = "ஹி"
bamini_dict["`P"] = "ஹீ"
bamini_dict["n`"] = "ஹெ"
bamini_dict["N`"] = "ஹே"
bamini_dict["i`"] = "ஹை"
bamini_dict["`;"] = "ஹ்"
bamini_dict["`"] = "ஹ"
bamini_dict["n\\s"] = "ஷௌ"
bamini_dict["N\\h"] = "ஷோ"
bamini_dict["n\\h"] = "ஷொ"
bamini_dict["\\h"] = "ஷா"
bamini_dict["\\p"] = "ஷி"
bamini_dict["\\P"] = "ஷீ"
bamini_dict["n\\\\"] = "ஷெ"
bamini_dict["N\\\\"] = "ஷே"
bamini_dict["i\\\\"] = "ஷை"
bamini_dict["\\\\;"] = "ஷ்"
bamini_dict["\\\\"] = "ஷ"
bamini_dict["n]s"] = "ஸௌ"
bamini_dict["N]h"] = "ஸோ"
bamini_dict["n]h"] = "ஸொ"
bamini_dict["]h"] = "ஸா"
bamini_dict["]p"] = "ஸி"
bamini_dict["]P"] = "ஸீ"
bamini_dict["n]"] = "ஸெ"
bamini_dict["N]"] = "ஸே"
bamini_dict["i]"] = "ஸை"
bamini_dict["];"] = "ஸ்"
bamini_dict["]"] = "ஸ"
bamini_dict["m"] = "அ"
bamini_dict["M"] = "ஆ"
bamini_dict["<"] = "ஈ"
bamini_dict["c"] = "உ"
bamini_dict["C"] = "ஊ"
bamini_dict["v"] = "எ"
bamini_dict["V"] = "ஏ"
bamini_dict["I"] = "ஐ"
bamini_dict["x"] = "ஒ"
bamini_dict["X"] = "ஓ"
bamini_dict["xs"] = "ஔ"
bamini_dict["/"] = "ஃ"
bamini_dict[","] = "இ"
bamini_dict["="] = "ஸ்ரீ"
bamini_dict[">"] = ","
bamini_dict["T"] = "வு"
bamini_dict["வு+"] = "வூ"
bamini_dict["பு+"] = "பூ"
bamini_dict["யு+"] = "யூ"
bamini_dict["சு+"] = "சூ"
bamini_dict["+"] = "ooh"
bamini_dict[";"] = "்"
bamini_dict["@"] = ";"
bamini_dict["¿f"] = "கை"

# Deduced High-ASCII mappings
bamini_dict["\u00A3"] = "ட்"
bamini_dict["\u00C1"] = "சி"
bamini_dict["\u00AE"] = "ர்"
bamini_dict["\u2039"] = "ன்"
bamini_dict["\u00AB"] = "ம்"
bamini_dict["\u00A7"] = "ங்"
bamini_dict["\u00AA"] = "ந்"
bamini_dict["\u00A9"] = "ண்"
bamini_dict["\u00A1"] = "க்"
bamini_dict["\u00A2"] = "ச்"
bamini_dict["\u00A5"] = "ப்"
bamini_dict["\u00BB"] = "கி"
bamini_dict["\u00C3"] = "பி"
bamini_dict["\u00CF"] = "இ"
bamini_dict["\u00C2"] = "தி"
bamini_dict["\u00D5"] = "பீ"
bamini_dict["\u00DA"] = "நீ"
bamini_dict["\u00DB"] = "மீ"
bamini_dict["\u00E2"] = "ணி"
bamini_dict["\u00E3"] = "நி"
bamini_dict["\u00E5"] = "னி"
bamini_dict["\u00E6"] = "யி"
bamini_dict["\u00E7"] = "ரி"
bamini_dict["\u00E8"] = "லி"
bamini_dict["\u00E9"] = "வி"
bamini_dict["\u00EB"] = "ளி"
bamini_dict["\u00F2"] = "பு"
bamini_dict["\u00F3"] = "பூ"
bamini_dict["\u00F6"] = "தூ"
bamini_dict["\u00FC"] = "நூ"
bamini_dict["\u00D1"] = "ரி" # Check
bamini_dict["\u00AC"] = "ல" # Check
bamini_dict["\u00AD"] = "ள" # Check
bamini_dict["\u00F1"] = "ஞ" # Check

# Additional standard Bamini high-ascii if any
bamini_dict["Š"] = "ஞ்"
bamini_dict["Œ"] = "ய்"
bamini_dict["œ"] = "ழ்"
bamini_dict["Ÿ"] = "ள்"
bamini_dict["š"] = "ல்"
bamini_dict["ž"] = "ளி" # Rare
bamini_dict["ƒ"] = "ரி" # Rare 
bamini_dict["Å"] = "வீ"
bamini_dict["¿"] = "றி"
bamini_dict["°"] = "ஸ்"

# Correct 'b' mapping logic: 'b' in this PDF seems to be the 'n' (kombu) key
# We assume 'b' followed by chars behaves like 'n' followed by chars
# Copy all 'n' keys to 'b'
n_keys = [k for k in bamini_dict.keys() if k.startswith('n')]
for k in n_keys:
    # Create equivalent 'b' key (replace first 'n' with 'b')
    # But be careful about "nth" where 'n' is the mod.
    # bamini_dict["nkh"] = "மொ". bkh -> மொ.
    bk = 'b' + k[1:]
    bamini_dict[bk] = bamini_dict[k]

# Also 'b' alone might be 'n' (unlikely to appear alone as 'e' sign, but maybe)
# bamini_dict["b"] = "டி" # REMOVED bad mapping
if "b" in bamini_dict: del bamini_dict["b"]
bamini_dict["b"] = bamini_dict.get("n", "") # whatever n maps to (usually nothing/empty string as it is a combiner or mapped in combos)





# Extra mappings for missing chars if any
bamini_dict["B"] = "டீ" # Duplicate? 

# Sorting keys by length descending to ensure longest match is replaced first
sorted_keys = sorted(bamini_dict.keys(), key=len, reverse=True)

def bamini_to_unicode(text):
    for k in sorted_keys:
        text = text.replace(k, bamini_dict[k])
    return text

def parse_pdf_data(text, village_name):
    # Split lines
    lines = text.split('\n')
    
    projects = []
    
    current_project = {}
    
    # Heuristic: Start of project is usually a number followed by Scheme Name
    # But text might be split across lines.
    # Pattern: ^\s*(\d+)\s+(.+)$ 
    # But after conversion, digits are still digits.
    
    # State machine
    # 0: header (ignore until line starting with 1)
    # 1: Reading project
    
    # We will buffer all lines as one text and use regex to split
    # Or iterate line by line.
    
    # Because of the conversion, line breaks might move if we processed the whole text
    # But we processed text after extraction.
    
    # Let's clean empty lines
    lines = [l.strip() for l in lines if l.strip()]
    
    # Skip headers
    start_index = 0
    for i, line in enumerate(lines):
        # Look for "1" and "202x" or scheme name
        # Often row starts with number 1
        if re.match(r'^1\s+', line):
            start_index = i
            break
    
    # Process from start_index
    current_lines = []
    
    for i in range(start_index, len(lines)):
        line = lines[i]
        
        # Check if line starts with a new record number
        # Need to be careful about false positives (e.g. "100m road")
        # Usually sequential numbers: 1, 2, 3...
        # Next expected number tracking
        
        # Or simpler:
        # A new row usually fits the pattern: S.No (int) space Scheme (str)
        
        match = re.match(r'^(\d+)\s+(.*)', line)
        if match:
             # Check if the number is likely a serial number (1 to 2 digits usually, maybe 3)
             # And maybe check if it's the next number?
             # For now, assume any line starting with number is a new entry or continuation?
             # Actually, "15-tJ" (which becomes "15-வது") starts with 15 but is text.
             # So purely number start check is dangerous.
             # "1 Union Fund" -> "1 ஒன்றிய பொது நிதி"
             pass
        
    # Regex Strategy on whole text might be better
    # Re-join lines
    content = '\n'.join(lines[start_index:])
    
    # We need to split by "Start of Row".
    # Pattern: \n(\d+)\s+
    # But we need to distinguish from "2021" inside.
    
    # Let's assume the structure:
    # SNO [Space] Scheme [Space/Newline] Year [Space/Newline] Details ... Status
    
    # It's tricky without visual layout.
    
    # Fallback: Just dump the raw lines and converted lines to CSV for manual check?
    # No, I need structured data.
    
    # Let's try to detect the known columns.
    # Years are 20\d\d-\d\d\d\d or similar.
    # Estimates are numbers.
    
    # Manual state machine on lines is best.
    project = {'village': village_name}
    
    # Buffer for current record
    record_buffer = []
    
    expected_sno = 1
    
    for line in lines[start_index:]:
        # Check if line seems to start a NEW project
        # Criteria: Starts with expected_sno + space?
        # Or just checking if it starts with digit and looks like a row start
        
        # "1 x‹¿a bghJ ãÂ" -> "1 ஒன்றிய பொது நிதி"
        
        # Split by first space
        parts = line.split(maxsplit=1)
        if len(parts) > 0 and parts[0].isdigit():
            num = int(parts[0])
            if num == expected_sno:
                # Save previous project if exists
                if project.get('sno'):
                    projects.append(project)
                
                # Start new project
                project = {
                    'sno': num,
                    'village': village_name,
                    'raw_text': parts[1] if len(parts)>1 else "",
                    'year': "",
                    'budget': "",
                    'scheme': "",
                    'details': "",
                    'location': "",
                    'status': ""
                }
                expected_sno += 1
                continue
        
        # Add line to current project raw text
        if project.get('sno'):
            project['raw_text'] += " " + line

    # Add last project
    if project.get('sno'):
        projects.append(project)
        
    return projects

def parse_project_details(projects):
    # Refine the extracted raw text into fields
    # Use regex to find Year, Budget, Status
    
    processed = []
    
    for p in projects:
        text = p['raw_text']
        
        # Find Year: 20\d\d[-20]\d\d
        year_match = re.search(r'(20\d{2}[-–]\d{2,4})', text)
        if year_match:
            p['year'] = year_match.group(1)
            # Remove year from text to help other parsing
            # text = text.replace(p['year'], " ") # Careful
        
        # Find Status (at the end usually)
        # "பணி முடிவு" or "பணி நடைபெற்று வருகிறது"
        if "பணி முடிவு" in text:
            p['status'] = "Completed"
        elif "பணி நடைபெற்று வருகிறது" in text:
            p['status'] = "In Progress"
        else:
            p['status'] = "Unknown"
            
        # Find Budget
        # Look for numbers (integer) that are not year or sno
        # Usually at the end before status?
        # "200000"
        # Regex for large number?
        
        numbers = re.findall(r'\b\d+\b', text)
        # Filter out SNO and Year parts
        candidates = []
        for n in numbers:
            if n == str(p['sno']): continue
            if p['year'] and (n in p['year'] or n == p['year'][:4] or n == p['year'][-4:]): continue
            if len(n) >= 4: # Budget usually > 1000
                candidates.append(n)
        
        if candidates:
            # Pick the largest one? Or last one before status?
            # Usually budget is the last numeric value.
            p['budget'] = candidates[-1]
            
        # Scheme and Details
        # Scheme is usually at the start.
        # Details follow year.
        
        # Heuristic Split:
        # [Scheme] [Year] [Details] [Location] [Budget] [Status]
        
        # We can just leave Scheme/Details mixed in "description" for now.
        p['description'] = text
        
        processed.append(p)
    return processed

# Main execution
all_projects = []
pdf_files = glob.glob('docs/kurinjipadi-block-projects/*.pdf')

print(f"Found {len(pdf_files)} PDF files.")

for pdf_path in pdf_files:
    print(f"Processing {pdf_path}...")
    try:
        raw_text = extract_text(pdf_path)
        # Convert to Unicode
        unicode_text = bamini_to_unicode(raw_text)
        
        # Get village name from filename
        village_name = os.path.basename(pdf_path).replace('.pdf', '')
        
        # Parse
        projs = parse_pdf_data(unicode_text, village_name)
        
        # Refine
        projs = parse_project_details(projs)
        
        all_projects.extend(projs)
        print(f"  Extracted {len(projs)} projects.")
        
    except Exception as e:
        print(f"  Error processing {pdf_path}: {e}")

# Write CSV
with open('projects.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['sno', 'village', 'year', 'scheme', 'details', 'description', 'location', 'budget', 'status', 'raw_text'])
    writer.writeheader()
    for p in all_projects:
        writer.writerow(p)

print(f"Total projects extracted: {len(all_projects)}")
print("Saved to projects.csv")
