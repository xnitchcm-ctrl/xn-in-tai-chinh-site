/**
 * Types representing high-security printing corporate structures & CMS administration.
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
  image?: string;
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
  isClosed?: boolean;
}

export interface QuoteRequest {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  serviceType: string;
  quantity: string;
  notes: string;
  createdAt?: string;
  status?: 'pending' | 'contacted' | 'processed' | 'archived';
  internalNotes?: string;
}

// --- CMS RBAC & USER SYSTEM ---
export type UserRole = 'admin' | 'approver' | 'editor' | 'super_admin';

export type ArticleWorkflowStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'hidden';

export interface CMSUser {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: 'active' | 'locked';
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  createdAt: string;
  lastLoginAt?: string;
  avatarUrl?: string;
}

// --- BRAND & VISUAL CONFIGURATION ---
export interface CMSBrand {
  id: string;
  desktopLogoUrl: string;
  mobileLogoUrl: string;
  footerLogoUrl: string;
  cmsLogoUrl: string;
  loginLogoUrl: string;
  faviconUrl: string;
  ogImageUrl: string;
  primaryColor: string;
  hoverColor: string;
  activeColor: string;
  accentColor: string;
  pageBgColor: string;
  cardBgColor: string;
  borderColor: string;
  textColor: string;
}

// --- SEO CONFIGURATION ---
export interface CMSSEO {
  id: string;
  siteTitle: string;
  titleTemplate: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robotsTxt: string;
}

// --- CMS CATEGORY ---
export interface CMSCategory {
  id: string;
  name: string;
  slug: string;
  type: 'post' | 'page' | 'media';
  description: string;
  createdAt: string;
}

// --- MEDIA ITEM ---
export interface CMSMedia {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: string;
  category: string;
  createdAt: string;
  uploadedBy: string;
}

// --- AUDIT LOG ITEM ---
export interface CMSAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  userName: string;
  userRole: UserRole;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure';
}

// --- ACTIVE SESSION ITEM ---
export interface CMSSession {
  id: string;
  userId: string;
  userEmail: string;
  deviceName: string;
  browser: string;
  ipAddress: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

// --- ALIASES FOR CMS VIEWS ---
export type PrintingTechnology = TechnologyItem;

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
  isActive?: boolean;
}

