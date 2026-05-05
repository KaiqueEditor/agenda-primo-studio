import { type Projeto } from '../types';
import { isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';

export const getProjectsDueThisWeek = (projetos: Projeto[]) => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 0 });
  const end = endOfWeek(now, { weekStartsOn: 0 });

  return projetos.filter(p => {
    const pubDate = p.fases.publicacao?.data;
    if (!pubDate) return false;
    return isWithinInterval(pubDate, { start, end });
  });
};

export const getTeamWorkload = (projetos: Projeto[]) => {
  const workload: Record<string, number> = {};
  projetos.forEach(p => {
    if (p.responsavel) {
      p.responsavel.forEach(r => {
        workload[r] = (workload[r] || 0) + 1;
      });
    }
  });
  return Object.entries(workload)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export const getProjectsByChannel = (projetos: Projeto[]) => {
  const channelCounts: Record<string, number> = {};
  projetos.forEach(p => {
    const canais = Array.isArray(p.canal) ? p.canal : [p.canal];
    canais.forEach(c => {
      if (c) {
        channelCounts[c] = (channelCounts[c] || 0) + 1;
      }
    });
  });
  return Object.entries(channelCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export const getActiveProjects = (projetos: Projeto[]) => {
  // Simple check: projects with any date set
  return projetos.filter(p => {
    return p.fases.gravacao?.inicio || p.fases.edicao?.inicio || p.fases.publicacao?.data;
  });
};

export const getProjectsMissingAllocation = (projetos: Projeto[]) => {
  return projetos.filter(p => !p.responsavel || p.responsavel.length === 0 || !p.casting || p.casting.length === 0);
};

export const getProductionFunnel = (projetos: Projeto[]) => {
  let gravacao = 0;
  let edicao = 0;
  let publicacao = 0;

  projetos.forEach(p => {
    // Basic logic: if it has publicacao data and we are past it, it's done (ignore).
    // Let's just count based on presence for now.
    if (p.fases.publicacao?.data) {
      publicacao++;
    } else if (p.fases.edicao?.inicio) {
      edicao++;
    } else if (p.fases.gravacao?.inicio) {
      gravacao++;
    }
  });

  return { gravacao, edicao, publicacao };
};
