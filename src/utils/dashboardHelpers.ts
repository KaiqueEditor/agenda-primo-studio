import { type Projeto } from '../types';
import { isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

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

export const getMonthlyStats = (projetos: Projeto[], date: Date = new Date()) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  let gravacoes = 0;
  let edicoes = 0;
  let publicacoes = 0;
  let eventos = 0;

  projetos.forEach(p => {
    // Check Gravação
    if (p.fases.gravacao?.inicio || p.fases.gravacao?.fim) {
      if ((p.fases.gravacao.inicio && isWithinInterval(p.fases.gravacao.inicio, { start, end })) ||
          (p.fases.gravacao.fim && isWithinInterval(p.fases.gravacao.fim, { start, end }))) {
        gravacoes++;
      }
    }
    // Check Edição
    if (p.fases.edicao?.inicio || p.fases.edicao?.fim) {
      if ((p.fases.edicao.inicio && isWithinInterval(p.fases.edicao.inicio, { start, end })) ||
          (p.fases.edicao.fim && isWithinInterval(p.fases.edicao.fim, { start, end }))) {
        edicoes++;
      }
    }
    // Check Evento
    if (p.fases.evento?.inicio || p.fases.evento?.fim) {
      if ((p.fases.evento.inicio && isWithinInterval(p.fases.evento.inicio, { start, end })) ||
          (p.fases.evento.fim && isWithinInterval(p.fases.evento.fim, { start, end }))) {
        eventos++;
      }
    }
    // Check Publicação
    if (p.fases.publicacao?.data) {
      if (isWithinInterval(p.fases.publicacao.data, { start, end })) {
        publicacoes++;
      }
    }
  });

  return { gravacoes, edicoes, publicacoes, eventos };
};
