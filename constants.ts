import { Gerencia, User, DocumentItem } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Administrador Sistema', email: 'admin@gestor.local', role: 'admin' },
  { id: 'u2', name: 'Editor Documentos', email: 'editor@gestor.local', role: 'editor' },
  { id: 'u3', name: 'Usuario Lector', email: 'lector@gestor.local', role: 'viewer' },
];

const generateVersions = (baseDate: string, count: number, author: string) => {
  const versions = [];
  for (let i = 1; i <= count; i++) {
    versions.push({
      versionNumber: `${i}.0`,
      date: `2024-0${i}-15`,
      modifiedBy: author,
      changes: i === 1 ? 'Creación inicial' : 'Actualización de procedimiento según nueva normativa',
    });
  }
  return versions.reverse();
};

const generateMockDocs = (count: number, startIndex: number, facility: string): DocumentItem[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `d-gen-${startIndex + i}`,
    sku: `E-GEN-${(startIndex + i).toString().padStart(3, '0')}`,
    title: `Documento Operativo de Prueba ${startIndex + i}`,
    type: i % 2 === 0 ? 'Procedimiento Específico' : 'Estándar',
    facility,
    functionArea: 'Operaciones',
    discipline: 'General',
    category: 'Operativo',
    criticality: i % 3 === 0 ? 'Alta' : 'Media',
    owner: 'Sistema Auto',
    status: i % 5 === 0 ? 'EN REVISION' : 'PUBLICADO',
    completionDate: '2024-01-01',
    reviewerDate: '2025-01-01',
    views: Math.floor(Math.random() * 500),
    versions: generateVersions('2024-01-01', 1, 'Sistema Auto')
  }));
};

export const MOCK_DATA: Gerencia[] = [
  {
    id: 'gdc',
    name: 'Gerencia Desarrollo Competencias (GDC)',
    isActive: true,
    areas: [
      {
        id: 'a-seg',
        name: 'Seguridad y Psicolaboral',
        documents: [
          {
            id: 'd1', sku: 'E-SEG-CRF-001', title: 'Aislamiento y Bloqueo de Energías', type: 'Procedimiento Específico',
            facility: 'Planta Principal', functionArea: 'Operaciones', discipline: 'Seguridad', category: 'Crítico', criticality: 'Alta',
            owner: 'Juan Pérez', status: 'PUBLICADO', completionDate: '2024-01-10', reviewerDate: '2025-01-10', views: 342,
            versions: generateVersions('2024-01-10', 3, 'Juan Pérez')
          },
          {
            id: 'd2', sku: 'E-SEG-CRF-002', title: 'Trabajo en Altura Física', type: 'Estándar',
            facility: 'Mina', functionArea: 'Mantenimiento', discipline: 'Seguridad', category: 'Crítico', criticality: 'Alta',
            owner: 'María López', status: 'EN REVISION', completionDate: '2023-11-05', reviewerDate: '2024-11-05', views: 120,
            versions: generateVersions('2023-11-05', 2, 'María López')
          },
          {
            id: 'd3', sku: 'E-SEG-BRE-010', title: 'Respuesta ante Incendios', type: 'Manual',
            facility: 'Todas', functionArea: 'Emergencias', discipline: 'Seguridad', category: 'Operativo', criticality: 'Media',
            owner: 'Carlos Ruiz', status: 'OBSOLETO', completionDate: '2022-05-20', reviewerDate: '2023-06-01', views: 45,
            versions: generateVersions('2022-01-10', 1, 'Carlos Ruiz')
          },
          ...generateMockDocs(25, 100, 'Planta Principal') // Genera 25 documentos extra para probar paginación
        ]
      },
      {
        id: 'a-ep',
        name: 'Equipo Pesado',
        documents: [
          {
            id: 'd4', sku: 'E-MIN-GMEM-MO-281', title: 'Cambio cilindro de inclinación de hoja V3', type: 'Procedimiento Específico',
            facility: 'Mina', functionArea: 'Mina', discipline: 'Mantención Equipos Mina', category: 'Equipos Móviles', criticality: 'Alta',
            owner: 'Manuel MT', status: 'PUBLICADO', completionDate: '2024-05-22', reviewerDate: '2026-05-12', views: 315,
            versions: generateVersions('2024-05-22', 3, 'Manuel MT')
          },
          {
            id: 'd5', sku: 'E-MIN-GMEM-MO-367', title: 'Cambio cilindro de volteo cargador frontal 994 F V3', type: 'Instructivo',
            facility: 'Mina', functionArea: 'Mina', discipline: 'Mantención Equipos Mina', category: 'Equipos Móviles', criticality: 'Media',
            owner: 'Trigo MT', status: 'PUBLICADO', completionDate: '2024-05-13', reviewerDate: '2026-05-13', views: 89,
            versions: generateVersions('2024-05-13', 2, 'Trigo MT')
          }
        ]
      },
      { id: 'a-pi', name: 'Procesos Industriales', documents: [] },
      { id: 'a-el', name: 'Electricidad', documents: [] },
      { id: 'a-inn', name: 'Innovación y tecnología instruccional', documents: [] },
      { id: 'a-di', name: 'Diseño instruccional', documents: [] },
    ]
  },
  { id: 'g-gaf', name: 'Gerencia Administración y Finanzas (GAF)', isActive: false, areas: [] },
  { id: 'g-grh', name: 'Gerencia Recursos Humanos (GRH)', isActive: false, areas: [] },

  { id: 'g-co', name: 'Gerencia Comercial (GC)', isActive: false, areas: [] },
];
