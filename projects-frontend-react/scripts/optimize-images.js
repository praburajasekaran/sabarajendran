import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

const imagesToOptimize = [
    {
        input: path.join(publicDir, 'assets/images/saba_rajendran.png'),
        output: path.join(publicDir, 'assets/images/saba_rajendran.webp'),
        width: 490, // Based on Lighthouse recommendation
    },
    {
        input: path.join(publicDir, 'assets/placeholders/infrastructure.png'),
        output: path.join(publicDir, 'assets/placeholders/infrastructure.webp'),
        width: 662, // Based on Lighthouse recommendation
    },
];

async function optimizeImages() {
    for (const image of imagesToOptimize) {
        try {
            if (!fs.existsSync(image.input)) {
                console.warn(`Input file not found: ${image.input}`);
                continue;
            }

            console.log(`Optimizing ${path.basename(image.input)}...`);

            await sharp(image.input)
                .resize({ width: image.width })
                .webp({ quality: 80 })
                .toFile(image.output);

            console.log(`Saved to ${path.basename(image.output)}`);
        } catch (error) {
            console.error(`Error optimizing ${path.basename(image.input)}:`, error);
        }
    }
}

optimizeImages();
