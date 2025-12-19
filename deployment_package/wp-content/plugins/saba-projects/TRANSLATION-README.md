# Village Translation System

This plugin includes an automated translation system for village names using Claude AI via OpenRouter API.

## Features

- ✅ **Automatic Translation**: New villages are automatically translated when created
- ✅ **Bulk Translation**: Translate all existing villages with one click
- ✅ **Bilingual Support**: Stores both Tamil and English translations
- ✅ **REST API**: Translations are exposed via WordPress REST API
- ✅ **Smart Detection**: Automatically detects if input is Tamil or English
- ✅ **Caching**: Translations are cached to avoid redundant API calls

## Setup

### 1. Configure OpenRouter API Key

Add your OpenRouter API key to `wp-config.php`:

```php
define('OPENROUTER_API_KEY', 'your-openrouter-api-key-here');
```

Alternatively, you can set it via WordPress options:

```php
update_option('saba_projects_openrouter_key', 'your-openrouter-api-key-here');
```

### 2. Access Translation Admin Page

1. Go to **Projects → Translate Villages** in WordPress admin
2. View translation statistics
3. Use the "Translate All Villages" button for bulk translation
4. Configure auto-translation settings

## Usage

### Automatic Translation

When auto-translation is enabled (default), any new village added will automatically be translated:

1. Create a new village in **Projects → Villages**
2. The system detects the language (Tamil or English)
3. Translation is automatically generated for the other language
4. Both translations are stored as term meta

### Manual Translation

1. Go to **Projects → Translate Villages**
2. Scroll to the "Village List" section
3. Click "Translate" next to any village that needs translation

### Bulk Translation

1. Go to **Projects → Translate Villages**
2. Click "Translate All Villages" button
3. Wait for the process to complete (may take several minutes for 800+ villages)

### Standalone Script

For command-line bulk translation:

```bash
php translate-villages-bulk.php
```

The script will:
- Show statistics
- Ask for confirmation
- Translate all villages
- Show progress and results

## REST API

Translations are available via WordPress REST API:

### Get Village with Translations

```
GET /wp-json/wp/v2/project_village/{id}
```

Response includes:
- `name_tamil`: Tamil translation
- `name_english`: English translation
- `name_translated`: Translated name based on `lang` query parameter

### Example

```javascript
// Get village in English
fetch('/wp-json/wp/v2/project_village/123?lang=en')

// Get village in Tamil
fetch('/wp-json/wp/v2/project_village/123?lang=ta')
```

## Functions

### PHP Functions

#### `saba_projects_get_village_name($term, $lang = 'en')`

Get village name in specified language.

```php
$tamil_name = saba_projects_get_village_name($term_id, 'ta');
$english_name = saba_projects_get_village_name($term_id, 'en');
```

#### `saba_projects_translate_village_term($term_id, $village_name = null)`

Translate a village term and save translations.

```php
$result = saba_projects_translate_village_term($term_id);
if ($result['success']) {
    echo "Translated: " . $result['translated'];
}
```

#### `saba_projects_translate_village_name($village_name, $target_lang = 'ta')`

Translate a village name string.

```php
$translated = saba_projects_translate_village_name('Alagappasamuthiram', 'ta');
```

## Storage

Translations are stored as WordPress term meta:

- `_village_name_tamil`: Tamil translation
- `_village_name_english`: English translation

## Settings

### Auto-Translation Toggle

Control whether new villages are automatically translated:

1. Go to **Projects → Translate Villages**
2. Scroll to "Auto-Translation Settings"
3. Check/uncheck "Auto-Translate New Villages"
4. Click "Save Settings"

## Troubleshooting

### API Key Not Working

1. Verify the key is correct in `wp-config.php`
2. Check OpenRouter account for API limits
3. Check WordPress debug log for errors

### Translations Not Appearing

1. Check if translations exist in term meta
2. Verify REST API is enabled for the taxonomy
3. Clear any caching plugins

### Rate Limiting

The system includes:
- 0.5 second delay between translations
- Automatic retry on failures
- Progress tracking for bulk operations

If you hit rate limits:
- Reduce batch size
- Increase delay between requests
- Contact OpenRouter for higher limits

## Notes

- Translations use Claude 3.5 Sonnet via OpenRouter
- Temperature is set to 0.3 for consistent translations
- Existing translations are not overwritten
- Both Tamil and English are stored for each village
- Language detection is based on Unicode character ranges






