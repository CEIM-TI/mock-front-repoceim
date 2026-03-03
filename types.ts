export type Role = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface DocumentVersion {
  versionNumber: string;
  date: string;
  modifiedBy: string;
  changes: string;
  fileUrl?: string; // Mock URL
}

export interface DocumentItem {
  id: string;
  sku: string;
  title: string;
  type: string;
  facility: string;
  functionArea: string;
  discipline: string;
  category: string;
  criticality: string;
  owner: string;
  status: 'PUBLICADO' | 'EN REVISION' | 'OBSOLETO';
  completionDate: string;
  reviewerDate: string;
  views: number;
  versions: DocumentVersion[];
}

export interface Area {
  id: string;
  name: string;
  documents: DocumentItem[];
}

export interface Gerencia {
  id: string;
  name: string;
  isActive: boolean;
  areas: Area[];
}
