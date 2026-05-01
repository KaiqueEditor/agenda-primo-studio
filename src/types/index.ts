export type FaseType = 'gravacao' | 'edicao' | 'publicacao' | 'evento';

export interface FasePeriodo {
  inicio?: Date;
  fim?: Date;
  aoVivo?: boolean;
}

// Formato do conteúdo — extensível via tags livres
export type FormatoType = 'youtube' | 'youtube_shorts' | 'reels' | 'ao_vivo' | 'anuncio' | 'quadros' | 'podcast' | string;

export interface Projeto {
  id: string;
  numero: number;
  titulo: string;
  canal: string | string[];
  tipo: string; // 'video' | 'podcast' | custom
  formato?: FormatoType[]; // Multiple format tags: ['youtube', 'ao_vivo']
  descricao?: string; // Caminho do servidor / observações
  episodios?: number;
  casting: string[];
  responsavel?: string[];
  updatedBy?: string;
  fases: {
    gravacao?: FasePeriodo;
    edicao?: FasePeriodo;
    publicacao?: { data?: Date };
    evento?: FasePeriodo;
  };
}

export interface CalendarEvent {
  projeto: Projeto;
  fase: FaseType;
  date: Date;
  isStart?: boolean;
  isEnd?: boolean;
  isSingle?: boolean;
}

export type ViewMode = 'calendar' | 'timeline' | 'list' | 'board';

export interface FilterState {
  fases: FaseType[];
  canal: string;
  search: string;
  tipo: string; // 'all' | 'video' | 'podcast' | any formato
  responsavel: string;
}

export type TeamRole = 'editor' | 'supervisor_edicao' | 'motion' | 'designer' | 'supervisor_producao' | 'cinegrafista' | 'filmmaker' | 'gerente_producao' | 'produtora';

export interface TeamMember {
  name: string;
  role: TeamRole;
  canMultitask: boolean;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Cristiano', role: 'editor', canMultitask: false },
  { name: 'Leonardo', role: 'editor', canMultitask: false },
  { name: 'Leandro', role: 'editor', canMultitask: false },
  { name: 'Davi', role: 'editor', canMultitask: false },
  { name: 'Ana Luiza', role: 'editor', canMultitask: false },
  { name: 'Luiza', role: 'editor', canMultitask: false },
  { name: 'Renan', role: 'supervisor_edicao', canMultitask: true },
  { name: 'Juan', role: 'motion', canMultitask: false },
  { name: 'Gianluca', role: 'motion', canMultitask: false },
  { name: 'Fernanda', role: 'designer', canMultitask: true },
  { name: 'Isadora', role: 'supervisor_producao', canMultitask: true },
  { name: 'Gabriel', role: 'cinegrafista', canMultitask: false },
  { name: 'Gustavo', role: 'filmmaker', canMultitask: false },
  { name: 'Nathan', role: 'filmmaker', canMultitask: false },
  { name: 'Itala', role: 'gerente_producao', canMultitask: true },
  { name: 'Ana Paula', role: 'produtora', canMultitask: true },
  { name: 'Caroline', role: 'produtora', canMultitask: true },
];

export const FASE_CONFIG: Record<FaseType, { label: string; color: string; colorLight: string; icon?: string }> = {
  gravacao: {
    label: 'Gravação',
    color: '#007AFF',
    colorLight: 'rgba(0, 122, 255, 0.1)',
  },
  edicao: {
    label: 'Edição',
    color: '#FF9500',
    colorLight: 'rgba(255, 149, 0, 0.1)',
  },
  publicacao: {
    label: 'Publicação',
    color: '#34C759',
    colorLight: 'rgba(52, 199, 89, 0.1)',
  },
  evento: {
    label: 'Evento',
    color: '#A855F7',
    colorLight: 'rgba(168, 85, 247, 0.1)',
  },
};

// Default formato options (user can add custom ones)
export const DEFAULT_FORMATOS: { value: FormatoType; label: string }[] = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'youtube_shorts', label: 'Shorts' },
  { value: 'reels', label: 'Reels / Instagram' },
  { value: 'ao_vivo', label: 'Ao Vivo' },
  { value: 'anuncio', label: 'Anúncio' },
  { value: 'quadros', label: 'Quadros' },
  { value: 'podcast', label: 'Podcast' },
];
