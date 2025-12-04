#!/bin/bash

# Script to create plugin ZIP file for deployment
# Run this script from the project root directory

echo "========================================="
echo "Creating Saba Projects Plugin ZIP"
echo "========================================="
echo ""

# Navigate to plugins directory
cd wp-content/plugins || exit 1

# Remove old ZIP if it exists
if [ -f "saba-projects.zip" ]; then
    echo "Removing old saba-projects.zip..."
    rm saba-projects.zip
fi

# Create new ZIP
echo "Creating new saba-projects.zip..."
zip -r saba-projects.zip saba-projects/ -x "*.DS_Store" "*/node_modules/*" "*/.git/*"

# Check if ZIP was created successfully
if [ -f "saba-projects.zip" ]; then
    echo ""
    echo "✅ Success! Plugin ZIP created at:"
    echo "   $(pwd)/saba-projects.zip"
    echo ""
    echo "📦 File size: $(du -h saba-projects.zip | cut -f1)"
    echo ""
    echo "Next steps:"
    echo "1. Navigate to: $(pwd)"
    echo "2. Find the file: saba-projects.zip"
    echo "3. Upload to WordPress at: https://tan-emu-358425.hostingersite.com/wp-admin"
    echo "   (Plugins → Add New → Upload Plugin)"
    echo ""
else
    echo "❌ Error: Failed to create ZIP file"
    exit 1
fi
