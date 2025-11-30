import { processCsvData } from './utils/csvProcessor';
import { CSV_DATA } from './data/rawData';

// Process the raw CSV data
const { projects, villages } = processCsvData(CSV_DATA);

export const VILLAGES = villages;
export const PROJECTS = projects;
