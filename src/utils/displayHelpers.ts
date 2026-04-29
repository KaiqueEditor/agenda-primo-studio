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
    bg: 'rgba(0, 122, 255, 0.10)',
    text: '#0062CC',
    dot: '#007AFF',
    border: 'rgba(0, 122, 255, 0.25)',
  },
  'Você Mais Rico': {
    bg: 'rgba(88, 86, 214, 0.10)',
    text: '#4B49B6',
    dot: '#5856D6',
    border: 'rgba(88, 86, 214, 0.25)',
  },
  'PrimoCast': {
    bg: 'rgba(255, 149, 0, 0.10)',
    text: '#CC7700',
    dot: '#FF9500',
    border: 'rgba(255, 149, 0, 0.25)',
  },
  'Finclass': {
    bg: 'rgba(255, 59, 48, 0.10)',
    text: '#CC2F26',
    dot: '#FF3B30',
    border: 'rgba(255, 59, 48, 0.25)',
  },
  'Os Sócios Podcast': {
    bg: 'rgba(52, 199, 89, 0.10)',
    text: '#248A3D',
    dot: '#34C759',
    border: 'rgba(52, 199, 89, 0.25)',
  },
  'Os Economistas': {
    bg: 'rgba(175, 82, 222, 0.10)',
    text: '#8944AB',
    dot: '#AF52DE',
    border: 'rgba(175, 82, 222, 0.25)',
  },
  'G4 / PrimoCast': {
    bg: 'rgba(255, 45, 85, 0.10)',
    text: '#CC2445',
    dot: '#FF2D55',
    border: 'rgba(255, 45, 85, 0.25)',
  },
  'AGF + Finclass': {
    bg: 'rgba(255, 59, 48, 0.10)',
    text: '#CC2F26',
    dot: '#FF3B30',
    border: 'rgba(255, 59, 48, 0.25)',
  },
  'O Primo Rico + AGF': {
    bg: 'rgba(0, 122, 255, 0.10)',
    text: '#0062CC',
    dot: '#007AFF',
    border: 'rgba(0, 122, 255, 0.25)',
  },
  'Você Mais Rico + AGF': {
    bg: 'rgba(88, 86, 214, 0.10)',
    text: '#4B49B6',
    dot: '#5856D6',
    border: 'rgba(88, 86, 214, 0.25)',
  },
};

// Fallback colors for unknown channels
const FALLBACK_COLORS: CanalColor[] = [
  { bg: 'rgba(90, 200, 250, 0.10)', text: '#2DA8D8', dot: '#5AC8FA', border: 'rgba(90, 200, 250, 0.25)' },
  { bg: 'rgba(255, 204, 0, 0.10)', text: '#BF9900', dot: '#FFCC00', border: 'rgba(255, 204, 0, 0.25)' },
  { bg: 'rgba(0, 199, 190, 0.10)', text: '#009E97', dot: '#00C7BE', border: 'rgba(0, 199, 190, 0.25)' },
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
