export enum ProjectStatus {
  COMPLETED = 'Completed',
  ONGOING = 'Ongoing',
  PLANNED = 'Planned',
  HALTED = 'Halted'
}

export enum ProjectType {
  INFRASTRUCTURE = 'Infrastructure',
  WATER = 'Water Supply',
  EDUCATION = 'Education',
  HEALTH = 'Health',
  ELECTRICITY = 'Electricity',
  COMMUNITY = 'Community Hall',
  AGRICULTURE = 'Agriculture'
}

export interface Project {
  id: string;
  title: string;
  title_ta?: string; // Tamil Title
  description: string;
  description_ta?: string; // Tamil Description
  village: string;
  year: string; // Changed to string to support "2020-2021" format
  status: ProjectStatus;
  type: ProjectType;
  budget: string; // Display string e.g., "₹50 Lakhs"
  rawBudget: number; // Numeric value for calculations
  completionDate?: string;
  imageUrl?: string;
}

export interface Village {
  id: string;
  name: string;
  population?: number;
}