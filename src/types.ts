/**
 * Types representing high-security printing corporate structures.
 */

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  image: string;
  iconName: string;
  bullets: string[];
}

export interface TechnologyItem {
  id: string;
  title: string;
  specs: string[];
  description: string;
  origin: string;
  category: 'printing' | 'security' | 'finishing';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'machinery' | 'products' | 'activities' | 'certificates';
  image: string;
}

export interface JobVacancy {
  id: string;
  title: string;
  department: string;
  type: string; // "Toàn thời gian", etc.
  salary: string;
  deadline: string;
  requirements: string[];
  benefits: string[];
  tasks?: string[]; // Optional job descriptions/tasks
}

export interface QuoteRequest {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  serviceType: string;
  quantity: string;
  notes: string;
}
