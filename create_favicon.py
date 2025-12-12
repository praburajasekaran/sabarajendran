from PIL import Image
import os

source_path = "/Users/praburajasekaran/.gemini/antigravity/brain/0be9b401-2e1c-4caa-9d57-4723c1c8c310/uploaded_image_1765536634304.png"
dest_path = "/Applications/MAMP/htdocs/sabarajendran/projects-frontend-react/public/favicon.png"

try:
    img = Image.open(source_path)
    img = img.resize((64, 64), Image.Resampling.LANCZOS)
    img.save(dest_path)
    print(f"Successfully created favicon at {dest_path}")
except Exception as e:
    print(f"Error creating favicon: {e}")
