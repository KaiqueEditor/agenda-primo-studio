// Canal → Color mapping for visual differentiation
// Each channel gets a unique, vibrant color

export interface CanalColor {
  bg: string;
  text: string;
  dot: string;
  border: string;
}

const CANAL_COLORS: Record<string, CanalColor> = {
  'O Primo Rico': {
    bg: '#EFF6FF',
    text: '#2563EB',
    dot: '#3B82F6',
    border: '#BFDBFE',
  },
  'Você Mais Rico': {
    bg: '#F5F3FF',
    text: '#7C3AED',
    dot: '#8B5CF6',
    border: '#DDD6FE',
  },
  'PrimoCast': {
    bg: '#FFF7ED',
    text: '#EA580C',
    dot: '#F97316',
    border: '#FED7AA',
  },
  'Finclass': {
    bg: '#FEF2F2',
    text: '#DC2626',
    dot: '#EF4444',
    border: '#FECACA',
  },
  'Os Sócios Podcast': {
    bg: '#F0FDF4',
    text: '#16A34A',
    dot: '#22C55E',
    border: '#BBF7D0',
  },
  'Os Economistas': {
    bg: '#FDF2F8',
    text: '#DB2777',
    dot: '#EC4899',
    border: '#FBCFE8',
  },
  'G4 / PrimoCast': {
    bg: '#FEF2F2',
    text: '#DC2626',
    dot: '#EF4444',
    border: '#FECACA',
  },
  'AGF + Finclass': {
    bg: '#FEF2F2',
    text: '#DC2626',
    dot: '#EF4444',
    border: '#FECACA',
  },
  'O Primo Rico + AGF': {
    bg: '#EFF6FF',
    text: '#2563EB',
    dot: '#3B82F6',
    border: '#BFDBFE',
  },
  'Você Mais Rico + AGF': {
    bg: '#F5F3FF',
    text: '#7C3AED',
    dot: '#8B5CF6',
    border: '#DDD6FE',
  },
};

// Fallback colors for unknown channels
const FALLBACK_COLORS: CanalColor[] = [
  { bg: '#F0F9FF', text: '#0284C7', dot: '#0EA5E9', border: '#BAE6FD' }, // Sky
  { bg: '#FEFCE8', text: '#CA8A04', dot: '#EAB308', border: '#FEF08A' }, // Yellow
  { bg: '#F0FDFA', text: '#0D9488', dot: '#14B8A6', border: '#99F6E4' }, // Teal
];

// Simple hash for consistent fallback color
const hashCode = (s: string): number => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const getCanalColor = (canal: string | string[]): CanalColor => {
  const key = Array.isArray(canal) ? canal[0] || '' : canal;
  if (CANAL_COLORS[key]) return CANAL_COLORS[key];
  // Try partial match
  const match = Object.keys(CANAL_COLORS).find(k => key.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(key.toLowerCase()));
  if (match) return CANAL_COLORS[match];
  // Fallback with consistent hash
  return FALLBACK_COLORS[hashCode(key) % FALLBACK_COLORS.length];
};

// Smart abbreviation for project titles on calendar
export const getShortTitle = (titulo: string, canal: string | string[]): string => {
  const c = Array.isArray(canal) ? canal[0] || '' : canal;
  
  // Channel prefix
  let prefix = '';
  if (c.includes('O Primo Rico')) prefix = 'OPR';
  else if (c.includes('Você Mais Rico')) prefix = 'VMR';
  else if (c.includes('PrimoCast')) prefix = 'PC';
  else if (c.includes('Finclass')) prefix = 'FIN';
  else if (c.includes('Os Sócios')) prefix = 'SOC';
  else if (c.includes('Os Economistas')) prefix = 'ECO';
  else if (c.includes('G4')) prefix = 'G4';
  
  // Extract episode number if present
  const epMatch = titulo.match(/(?:EP\.?\s*|Vídeo\s*|#)(\d+)/i);
  if (epMatch && prefix) {
    return `${prefix} #${epMatch[1]}`;
  }
  
  // For named projects, shorten intelligently
  if (titulo.length > 22) {
    // Known patterns
    if (titulo.startsWith('O Plano Perfeito')) {
      const ep = titulo.match(/EP\.?\s*(\d+)/i);
      return ep ? `Plano P. EP.${ep[1]}` : 'Plano Perfeito';
    }
    if (titulo.startsWith('Por Dentro Do Negócio')) {
      const ep = titulo.match(/EP\.?\s*(\d+)/i);
      return ep ? `PDDN EP.${ep[1]}` : 'PDDN';
    }
    if (titulo.startsWith('Será que Dá Dinheiro')) {
      const suffix = titulo.includes('Ações') ? '- Ações' : titulo.includes('Empreend') ? '- Empreen.' : '';
      return `SDD$ ${suffix}`.trim();
    }
    if (titulo.startsWith('Entrevista mais sincera')) {
      return 'Entrev. Sincera';
    }
    if (titulo.startsWith('Visitando Empresas') || titulo.includes('Visitando Empresas')) {
      return 'Visit. Empresas';
    }
    if (titulo.startsWith('24 horas')) {
      const person = titulo.replace('24 horas com ', '').replace('24 horas trabalhando na ', '');
      return `24h ${person}`;
    }
    if (titulo.startsWith('Mini série')) {
      return 'Mini Série Barsis';
    }
    // Generic truncation
    return titulo.substring(0, 18) + '…';
  }
  
  return titulo;
};

// Get initials for avatar
export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Consistent color from name for avatars
export const getAvatarColor = (name: string): string => {
  const colors = [
    '#007AFF', '#5856D6', '#FF9500', '#FF3B30', '#34C759', 
    '#AF52DE', '#FF2D55', '#5AC8FA', '#FFCC00', '#00C7BE',
  ];
  return colors[hashCode(name) % colors.length];
};

// Get project status label
export type ProjectStatus = 'a_definir' | 'em_gravacao' | 'em_edicao' | 'pronto' | 'publicado';

export interface StatusInfo {
  label: string;
  color: string;
  bg: string;
}

export const getProjectStatus = (projeto: { fases: { gravacao?: { inicio?: Date; fim?: Date }; edicao?: { inicio?: Date; fim?: Date }; publicacao?: { data?: Date } } }): StatusInfo => {
  const now = new Date();
  const pub = projeto.fases.publicacao?.data;
  
  if (pub && pub <= now) {
    return { label: 'Publicado', color: '#34C759', bg: 'rgba(52, 199, 89, 0.1)' };
  }
  
  const ed = projeto.fases.edicao;
  if (ed?.inicio && ed?.fim) {
    if (now >= ed.inicio && now <= ed.fim) {
      return { label: 'Em Edição', color: '#FF9500', bg: 'rgba(255, 149, 0, 0.1)' };
    }
    if (now > ed.fim) {
      return { label: 'Pronto', color: '#5856D6', bg: 'rgba(88, 86, 214, 0.1)' };
    }
  }
  
  const grav = projeto.fases.gravacao;
  if (grav?.inicio && grav?.fim) {
    if (now >= grav.inicio && now <= grav.fim) {
      return { label: 'Em Gravação', color: '#007AFF', bg: 'rgba(0, 122, 255, 0.1)' };
    }
    if (now > grav.fim && !ed?.inicio) {
      return { label: 'Pronto', color: '#5856D6', bg: 'rgba(88, 86, 214, 0.1)' };
    }
  }
  
  if (pub && pub > now) {
    return { label: 'Agendado', color: '#5AC8FA', bg: 'rgba(90, 200, 250, 0.1)' };
  }
  
  return { label: 'A Definir', color: '#8E8E93', bg: 'rgba(142, 142, 147, 0.1)' };
};
