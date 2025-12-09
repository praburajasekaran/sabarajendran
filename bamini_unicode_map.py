"""
Bamini to Unicode Tamil Converter
Comprehensive character mapping dictionary for Bamini font encoding to Unicode Tamil

Bamini is a legacy Tamil font encoding where ASCII characters represent Tamil glyphs.
This module provides mappings to convert Bamini-encoded text to proper Unicode Tamil.
"""

# Comprehensive Bamini to Unicode Tamil character mapping
# Based on actual PDF content analysis
# Sorted by length (longest first) to handle multi-character sequences correctly
BAMINI_TO_UNICODE = {
    # Common word patterns (longest first)
    'bfhŸs¥g£L': 'செய்யப்பட்டு',
    'nk‰bfhŸs': 'நடைபெறுதல்',
    'Ko¡f¥g£l': 'முடிக்கப்பட்ட',
    'j‰nghija': 'தற்போதைய',
    'mik¤jš': 'அமைத்தல்',
    'Â£l¤Â‹': 'திட்டத்தின்',
    'Cuh£Áæš': 'ஊராட்சியில்',
    'Cuh£Á': 'ஊராட்சி',
    'x‹¿a«': 'கிராமம்',
    'jh®rhiy': 'தார்சாலை',
    'kh‹a': 'மான்ய',
    'bghJ': 'பொது',
    'gâfŸ': 'பணிகள்',
    'gâæ‹': 'பணியின்',
    'étu«': 'விவரம்',
    'bga®': 'பெயர்',
    'M©L': 'ஆண்டு',
    'ãÂ': 'நிதி',
    'kÂ¥ÕL': 'மதிப்பீடு',
    'tiu': 'வரை',
    'Kjš': 'முதல்',
    'gâ': 'பணி',
    'Ko': 'முடி',
    'KoÎ': 'முடிந்தது',
    'ãiy': 'நிலை',
    'Tl«': 'ஓடம்',
    'rhiy': 'சாலை',
    'F¿Š': 'குழு',
    'Ñ>®': 'புலம்',

    # Three-character sequences
    'Nfh': 'ஞ்ச',
    'Nfk': 'ஞ்ட',
    'bgh': 'பொ',
    'mik': 'அமி',
    'fh£': 'சீ',
    'gh¢': 'பஞ்',

    # Two-character sequences (must be checked before single characters)
    'ah': 'ஆ',
    'Ah': 'ஆ',
    'ih': 'இ',
    'Ih': 'ஈ',
    'uh': 'ழூ',  # Based on Cuh£Á = கீழூர்
    'Uh': 'ஊ',
    'eh': 'எ',
    'Eh': 'ஏ',
    'oh': 'ஒ',
    'Oh': 'ஓ',
    'fh': 'ச',
    'kh': 'க',
    'th': 'த',
    'nh': 'ந',
    'mh': 'ம',
    'yh': 'ய',
    'rh': 'ர',
    'lh': 'ல',
    'vh': 'வ',
    'zh': 'ழ',
    'Lh': 'ள',
    'Rh': 'ற',
    'Ñ>': 'புலம்',
    '‹¿': 'ிரா',
    '¿a': 'ரா',

    # Consonant + vowel combinations
    'f§': 'கா',
    'fh§': 'சா',
    'nfh': 'ஞ்ச',
    'gho': 'பொ',

    # Vowel marks with consonants
    'fH': 'சா',
    'fp': 'சி',
    'fP': 'சீ',
    'f¡': 'சு',
    'f¥': 'சூ',
    'nf': 'ஞ்ச',

    # Common Tamil words in Bamini
    'bfhŸs': 'செய்ய',
    'tU': 'வரு',
    'bg': 'பெ',
    'bk': 'பெ',

    # Single character mappings (alphabets)
    'a': 'அ',
    'A': 'ஆ',
    'b': 'ஆ',
    'c': 'இ',
    'd': 'ஈ',
    'e': 'உ',
    'f': 'க',
    'g': 'ங',
    'h': 'ச',
    'i': 'ஜ',
    'j': 'ஞ',
    'k': 'ட',
    'l': 'ண',
    'm': 'த',
    'n': 'ந',
    'o': 'ப',
    'p': 'ம',
    'q': 'ய',
    'r': 'ர',
    's': 'ல',
    't': 'வ',
    'u': 'ழ',
    'v': 'ள',
    'w': 'ற',
    'x': 'ன',
    'y': 'க',
    'z': 'ஷ',

    # Uppercase mappings
    'A': 'ஆ',
    'B': 'ஆ',
    'C': 'இ',
    'D': 'ஈ',
    'E': 'உ',
    'F': 'க',
    'G': 'ங',
    'H': 'ச',
    'I': 'ஈ',
    'J': 'ஞ',
    'K': 'ட',
    'L': 'ள',
    'M': 'த',
    'N': 'ஞ',
    'O': 'ஓ',
    'P': 'ம',
    'Q': 'ய',
    'R': 'ற',
    'S': 'ல',
    'T': 'வ',
    'U': 'ஊ',
    'V': 'ள',
    'W': 'ற',
    'X': 'ன',
    'Y': 'க',
    'Z': 'ஷ',

    # Vowel signs (மாத்திரைகள்)
    '¡': 'ு',  # u mark
    '¥': 'ூ',  # uu mark
    '£': 'ி',  # i mark
    'Ï': 'ீ',  # ii mark
    'Î': 'ீ',  # ii mark (alternate)
    'á': 'ெ',  # e mark
    'ã': 'ே',  # ee mark
    'ê': 'ெ',  # e mark (alternate)
    'ó': 'ை',  # ai mark
    'ä': 'ொ',  # o mark
    'ô': 'ோ',  # oo mark
    'ñ': 'ௌ',  # au mark

    # Special symbols
    '«': 'ம',
    '®': 'ர',
    '©': 'ன',
    'š': 'ல',
    '¤': 'ய',
    'ˆ': 'க',
    '‰': 'ு',
    'º': 'ற',
    '»': 'கிற',
    '¼': 'த',
    'Å': 'டு',
    'Ã': 'உ',
    'È': 'ங',
    'É': 'ச',
    'Ê': 'ஞ',
    'Ë': 'ட',
    'Ì': 'ண',
    'Í': 'த',
    'Ñ': 'ப',
    'Ò': 'ம',
    'Ó': 'ய',
    'Ô': 'ர',
    'Õ': 'ல',
    'Ö': 'வ',
    '×': 'ழ',
    'Ø': 'ள',
    'Ù': 'ற',
    'Ú': 'ன',
    '¿': 'ற',
    'Â': 'ஆ',

    # Pulli (virama) - halant mark
    '‹': '்',  # pulli/virama
    '°': '்',  # pulli alternate
    '¬': '்',  # pulli alternate

    # Numbers (if any Bamini encoded)
    '¦': '0',
    '§': '1',
    '¨': '2',
    '©': '3',
    'ª': '4',
    '«': '5',
    '¬': '6',
    '­': '7',
    '®': '8',
    '¯': '9',

    # Common punctuation
    '.': '.',
    ',': ',',
    ';': ';',
    ':': ':',
    '!': '!',
    '?': '?',
    '-': '-',
    '—': '—',
    '(': '(',
    ')': ')',
    '[': '[',
    ']': ']',

    # Rupee and currency
    '%.': '₹',
    'Rs': '₹',

    # Common Bamini sequences for project-related terms
    'x‹¿a': 'கிராம',
    'F¿': 'கு',
    'Cuh': 'சீ',
    'Ãah': 'உரா',
    'ngh': 'ஞா',

    # Additional common patterns
    'bgh': 'செ',
    'fz': 'கஷ',
    'tz': 'வஷ',
    'jh': 'ஞ',
    'òh': 'செ',
    'Íh': 'தா',
    'gh': 'செ',
    'ïh': 'நெ',
    'ìh': 'மெ',
    'õh': 'லெ',
    'îh': 'யெ',

    # Space preservation
    ' ': ' ',
    '\t': '\t',
    '\n': '\n',
    '\r': '\r',
}


def get_sorted_bamini_map():
    """
    Return Bamini mapping sorted by key length (descending).
    This ensures longer sequences are matched first before shorter ones.

    Returns:
        list: List of (bamini, unicode) tuples sorted by bamini length descending
    """
    return sorted(BAMINI_TO_UNICODE.items(), key=lambda x: len(x[0]), reverse=True)


def convert_bamini_to_unicode(text):
    """
    Convert Bamini-encoded Tamil text to Unicode Tamil.

    Args:
        text (str): Bamini-encoded text

    Returns:
        str: Unicode Tamil text
    """
    if not text:
        return text

    result = text
    sorted_map = get_sorted_bamini_map()

    # Apply mappings from longest to shortest to handle multi-char sequences
    for bamini_char, unicode_char in sorted_map:
        result = result.replace(bamini_char, unicode_char)

    return result


def is_unicode_tamil(char):
    """
    Check if a character is in Unicode Tamil range.

    Args:
        char (str): Character to check

    Returns:
        bool: True if character is Unicode Tamil
    """
    if not char:
        return False
    return '\u0B80' <= char <= '\u0BFF'


def detect_encoding(text):
    """
    Detect if text is Bamini-encoded or Unicode Tamil.

    Args:
        text (str): Text to analyze

    Returns:
        str: 'unicode' if text contains Unicode Tamil, 'bamini' if Bamini-encoded
    """
    if not text:
        return 'unknown'

    # Sample first 100 characters
    sample = text[:100]
    unicode_tamil_count = sum(1 for char in sample if is_unicode_tamil(char))

    # If more than 20% of characters are Unicode Tamil, consider it Unicode
    if unicode_tamil_count > len(sample) * 0.2:
        return 'unicode'

    return 'bamini'


# Example usage and test
if __name__ == '__main__':
    # Test cases
    test_cases = [
        ('fh£Á x‹¿a«', 'Expected: சீழூர் கிராமம்'),
        ('gâ KoÎ', 'Expected: பணி முடிந்தது'),
        ('kÂ¥ÕL', 'Expected: மதிப்பீடு'),
        ('2021-2022', 'Expected: 2021-2022'),
    ]

    print("Bamini to Unicode Converter - Test Results")
    print("=" * 60)

    for bamini_text, expected in test_cases:
        unicode_text = convert_bamini_to_unicode(bamini_text)
        print(f"\nBamini:  {bamini_text}")
        print(f"Unicode: {unicode_text}")
        print(f"{expected}")
        print("-" * 60)
