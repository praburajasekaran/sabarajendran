import { Project, ProjectStatus, ProjectType, Village } from '../types';

// Helper to format strings to Title Case
const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => {
    // Handle special characters like brackets if needed, but simple split works for most
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

export const processCsvData = (csvData: string): { projects: Project[], villages: Village[] } => {
  const lines = csvData.trim().split('\n');
  const projects: Project[] = [];
  const villageSet = new Set<string>();

  // Iterate and only process lines starting with a number
  lines.forEach((line, index) => {
    // Robust CSV parsing handling quotes
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());

    if (parts.length < 8) return;

    // Check if first column is a number
    if (!/^\d+$/.test(parts[0])) return;

    const villageNameRaw = parts[1].replace(/^"|"$/g, '');
    const villageName = toTitleCase(villageNameRaw);

    const schemeName = parts[2].replace(/^"|"$/g, '');
    const year = parts[3].replace(/^"|"$/g, '');
    
    const workTypeRaw = parts[4].replace(/^"|"$/g, '');
    const title = toTitleCase(workTypeRaw);

    const description = parts[5].replace(/^"|"$/g, '');
    const amountStr = parts[6].replace(/^"|"$/g, '');
    const stage = parts[7].replace(/^"|"$/g, '');

    // Determine Status
    let status = ProjectStatus.ONGOING;
    const lowerStage = stage.toLowerCase();
    if (lowerStage.includes('completed') && !lowerStage.includes('earthwork') && !lowerStage.includes('wbm')) {
      status = ProjectStatus.COMPLETED;
    } else if (lowerStage.includes('physically completed')) {
      status = ProjectStatus.COMPLETED;
    } else {
      status = ProjectStatus.ONGOING;
    }

    // Determine Type
    let type = ProjectType.INFRASTRUCTURE;
    const combinedText = (schemeName + ' ' + workTypeRaw + ' ' + description).toLowerCase();

    if (combinedText.includes('school') || combinedText.includes('class') || combinedText.includes('bench') || combinedText.includes('desk') || combinedText.includes('anganwadi')) {
      type = ProjectType.EDUCATION;
    } else if (combinedText.includes('water') || combinedText.includes('borewell') || combinedText.includes('pipeline') || combinedText.includes('fhtc') || combinedText.includes('oht') || combinedText.includes('ro plant')) {
      type = ProjectType.WATER;
    } else if (combinedText.includes('health') || combinedText.includes('phc') || combinedText.includes('hospital')) {
      type = ProjectType.HEALTH;
    } else if (combinedText.includes('light')) {
      type = ProjectType.ELECTRICITY;
    } else if (combinedText.includes('threshing') || combinedText.includes('tank') || combinedText.includes('agri')) {
      type = ProjectType.AGRICULTURE;
    } else if (combinedText.includes('hall') || combinedText.includes('stage') || combinedText.includes('shed') || combinedText.includes('toilet') || combinedText.includes('housing') || combinedText.includes('house')) {
      type = ProjectType.COMMUNITY;
    }

    // Format Budget
    const amount = parseFloat(amountStr) || 0;
    let formattedBudget = `₹${amount}`;
    if (amount >= 10000000) {
      formattedBudget = `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      formattedBudget = `₹${(amount / 100000).toFixed(1)} Lakhs`;
    }

    // Randomly assign image for demo purposes (approx 40% chance)
    // This simulates that not all projects have images
    const hasImage = Math.random() > 0.6; 
    const imageUrl = hasImage ? `https://picsum.photos/seed/${index}/800/600` : undefined;

    projects.push({
      id: `p-${index}`,
      title: title,
      description: description,
      village: villageName,
      year: year,
      status: status,
      type: type,
      budget: formattedBudget,
      rawBudget: amount,
      imageUrl: imageUrl
    });

    villageSet.add(villageName);
  });

  const villages = Array.from(villageSet).map((name, idx) => ({
    id: `v-${idx}`,
    name
  })).sort((a, b) => a.name.localeCompare(b.name));

  return { projects, villages };
};