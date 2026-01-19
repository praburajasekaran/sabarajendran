import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS_FILE = path.join(__dirname, '../public/data/projects.json');
const OUTPUT_DIR = path.join(__dirname, '../panchayat_pdfs');

async function generatePDFs() {
    try {
        const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
        const projects = JSON.parse(data).projects;
        console.log(`Total projects loaded: ${projects.length}`);

        // Group by Panchayat
        const panchayats = {};
        projects.forEach(project => {
            const pName = project.panchayat || 'Unknown';
            if (!panchayats[pName]) {
                panchayats[pName] = [];
            }
            panchayats[pName].push(project);
        });

        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
        }

        const browser = await puppeteer.launch({
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ],
            dumpio: true
        });

        for (const [panchayatName, pProjects] of Object.entries(panchayats)) {
            const page = await browser.newPage();

            // Generate HTML content
            const htmlContent = `
                <!DOCTYPE html>
                <html lang="ta">
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Arial', sans-serif; padding: 20px; }
                        h1 { text-align: center; color: #333; }
                        .project { border-bottom: 1px solid #ccc; padding: 10px 0; margin-bottom: 10px; page-break-inside: avoid; }
                        .project:last-child { border-bottom: none; }
                        .title-ta { font-size: 1.2em; font-weight: bold; color: #2c3e50; }
                        .details { margin-top: 5px; font-size: 0.9em; color: #555; }
                        .label { font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h1>${panchayatName} Panchayat Projects</h1>
                    <div style="text-align: center; margin-bottom: 20px; font-weight: bold;">Total Projects: ${pProjects.length}</div>
                    ${pProjects.map((p, index) => `
                        <div class="project">
                            <div class="title-ta">${index + 1}. ${p.title_ta || p.title}</div>
                            <div class="details">
                                <span class="label">Project ID:</span> ${p.id} <br>
                                <span class="label">Budget:</span> ${p.budget} <br>
                                <span class="label">Status:</span> ${p.status === 'Completed' ? 'முடிவுற்றது' : (p.status === 'Ongoing' ? 'நடைபெறுகிறது' : p.status)} <br>
                                <span class="label">Village:</span> ${p.village_ta ? p.village_ta + ' (' + p.village + ')' : p.village}
                            </div>
                        </div>
                    `).join('')}
                </body>
                </html>
            `;

            await page.setContent(htmlContent);
            await page.pdf({
                path: path.join(OUTPUT_DIR, `${panchayatName}.pdf`),
                format: 'A4',
                printBackground: true,
                margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
            });

            console.log(`Generated PDF for ${panchayatName}`);
            await page.close();
        }

        await browser.close();
        console.log('All PDFs generated successfully.');

    } catch (error) {
        console.error('Error generating PDFs:', error);
    }
}

generatePDFs();
