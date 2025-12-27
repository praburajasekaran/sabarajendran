/**
 * Sync Tamil Spelling Corrections to Live WordPress Database
 *
 * Usage: tsx scripts/sync-live-spellings.ts
 */

import { tamilSpellingCorrections } from './tamil-spelling-corrections';

const WP_BASE_URL = 'https://projects.sabarajendran.com';
const WP_USERNAME = 'data_entry';
const WP_PASSWORD = 'data@123';

interface WPProject {
  id: number;
  meta: {
    _project_title_tamil?: string;
  };
}

interface WPTerm {
  id: number;
  name: string;
  village_name_tamil?: string;
  name_tamil?: string;
  panchayat_name_tamil?: string;
}

async function getAuthToken(): Promise<string> {
  const response = await fetch(`${WP_BASE_URL}/wp-json/jwt-auth/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: WP_USERNAME,
      password: WP_PASSWORD,
    }),
  });

  if (!response.ok) {
    // Try basic auth as fallback
    const basicAuth = Buffer.from(`${WP_USERNAME}:${WP_PASSWORD}`).toString('base64');
    return `Basic ${basicAuth}`;
  }

  const data = await response.json();
  return `Bearer ${data.token}`;
}

async function updateVillages(authToken: string): Promise<number> {
  console.log('\nChecking Villages...');
  let updated = 0;

  try {
    const response = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/project_village?per_page=100`, {
      headers: {
        'Authorization': authToken,
      },
    });

    const villages: WPTerm[] = await response.json();

    for (const village of villages) {
      const currentTamil = village.village_name_tamil || village.name_tamil;

      if (currentTamil && tamilSpellingCorrections[currentTamil]) {
        const corrected = tamilSpellingCorrections[currentTamil];

        // Update term meta
        await fetch(`${WP_BASE_URL}/wp-json/wp/v2/project_village/${village.id}`, {
          method: 'POST',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            village_name_tamil: corrected,
            name_tamil: corrected,
          }),
        });

        console.log(`  [V] ${village.name}: ${currentTamil} -> ${corrected}`);
        updated++;
      }
    }
  } catch (error) {
    console.error('Error updating villages:', error);
  }

  return updated;
}

async function updatePanchayats(authToken: string): Promise<number> {
  console.log('\nChecking Panchayats...');
  let updated = 0;

  try {
    const response = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/project_panchayat?per_page=100`, {
      headers: {
        'Authorization': authToken,
      },
    });

    const panchayats: WPTerm[] = await response.json();

    for (const panchayat of panchayats) {
      const currentTamil = panchayat.panchayat_name_tamil;

      if (currentTamil && tamilSpellingCorrections[currentTamil]) {
        const corrected = tamilSpellingCorrections[currentTamil];

        await fetch(`${WP_BASE_URL}/wp-json/wp/v2/project_panchayat/${panchayat.id}`, {
          method: 'POST',
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            panchayat_name_tamil: corrected,
          }),
        });

        console.log(`  [P] ${panchayat.name}: ${currentTamil} -> ${corrected}`);
        updated++;
      }
    }
  } catch (error) {
    console.error('Error updating panchayats:', error);
  }

  return updated;
}

async function updateProjects(authToken: string): Promise<number> {
  console.log('\nChecking Project Titles...');
  let updated = 0;
  let page = 1;
  const perPage = 100;

  try {
    while (true) {
      const response = await fetch(
        `${WP_BASE_URL}/wp-json/wp/v2/project?per_page=${perPage}&page=${page}`,
        {
          headers: {
            'Authorization': authToken,
          },
        }
      );

      if (!response.ok) break;

      const projects: WPProject[] = await response.json();
      if (projects.length === 0) break;

      for (const project of projects) {
        const titleTa = project.meta?._project_title_tamil;
        if (!titleTa) continue;

        let modified = titleTa;
        let original = titleTa;

        // Multi-pass replacement
        let passes = 0;
        let loopModified = false;

        do {
          loopModified = false;
          passes++;

          for (const [wrong, correct] of Object.entries(tamilSpellingCorrections)) {
            if (modified.includes(wrong)) {
              modified = modified.replace(new RegExp(wrong, 'g'), correct);
              loopModified = true;
            }
          }
        } while (loopModified && passes < 5);

        if (original !== modified) {
          await fetch(`${WP_BASE_URL}/wp-json/wp/v2/project/${project.id}`, {
            method: 'POST',
            headers: {
              'Authorization': authToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              meta: {
                _project_title_tamil: modified,
              },
            }),
          });

          console.log(`  [T] #${project.id}: Corrected spelling in title`);
          updated++;
        }
      }

      page++;
    }
  } catch (error) {
    console.error('Error updating projects:', error);
  }

  return updated;
}

async function main() {
  console.log('🚀 Starting live WordPress spelling corrections sync...\n');
  console.log(`Target: ${WP_BASE_URL}`);
  console.log(`Corrections loaded: ${Object.keys(tamilSpellingCorrections).length}`);
  console.log('---------------------------------------------------');

  try {
    // Get authentication token
    const authToken = await getAuthToken();

    // Apply corrections
    const villagesUpdated = await updateVillages(authToken);
    const panchayatsUpdated = await updatePanchayats(authToken);
    const projectsUpdated = await updateProjects(authToken);

    console.log('\n---------------------------------------------------');
    console.log(`✅ DONE! Updated:`);
    console.log(`   Villages: ${villagesUpdated}`);
    console.log(`   Panchayats: ${panchayatsUpdated}`);
    console.log(`   Project Titles: ${projectsUpdated}`);
    console.log('---------------------------------------------------');
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
