import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Projeto, FilterState, FaseType, TeamMember } from '../types';
import { TEAM_MEMBERS } from '../types';
import { projetosAGF } from '../data/projects';
import { supabase } from '../lib/supabase';

export const useProjects = () => {
  const [projetos, setProjetos] = useState<Projeto[]>(projetosAGF);
  const [team, setTeam] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    fases: ['gravacao', 'edicao', 'publicacao', 'evento'],
    canal: '',
    search: '',
    tipo: 'all',
    responsavel: '',
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load projects
        const { data: projData } = await supabase.from('projetos').select('*');
      if (projData && projData.length > 0) {
        // Parse dates from JSON
        const parsedProj = projData.map(row => {
          const p = row.data as Projeto;
          if (p.fases.gravacao) {
            if (p.fases.gravacao.inicio) p.fases.gravacao.inicio = new Date(p.fases.gravacao.inicio);
            if (p.fases.gravacao.fim) p.fases.gravacao.fim = new Date(p.fases.gravacao.fim);
          }
          if (p.fases.edicao) {
            if (p.fases.edicao.inicio) p.fases.edicao.inicio = new Date(p.fases.edicao.inicio);
            if (p.fases.edicao.fim) p.fases.edicao.fim = new Date(p.fases.edicao.fim);
          }
          if (p.fases.publicacao?.data) {
            p.fases.publicacao.data = new Date(p.fases.publicacao.data);
          }
          if (p.fases.evento) {
            if (p.fases.evento.inicio) p.fases.evento.inicio = new Date(p.fases.evento.inicio);
            if (p.fases.evento.fim) p.fases.evento.fim = new Date(p.fases.evento.fim);
          }
          return p;
        });
        setProjetos(parsedProj);
      } else {
        // First run, populate DB with default projects
        for (const p of projetosAGF) {
          await supabase.from('projetos').insert({ id: p.id, data: p });
        }
      }

      // Load team
      const { data: teamData } = await supabase.from('team').select('*');
      if (teamData && teamData.length > 0) {
        setTeam(teamData.map(row => row.data as TeamMember));
      } else {
        // Populate DB with default
        for (const m of TEAM_MEMBERS) {
          await supabase.from('team').insert({ id: m.name, data: m });
        }
      }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return projetos.filter((p) => {
      if (filters.canal) {
        const c = Array.isArray(p.canal) ? p.canal.join(', ') : p.canal;
        if (!c.toLowerCase().includes(filters.canal.toLowerCase())) return false;
      }
      if (filters.tipo !== 'all' && p.tipo !== filters.tipo && !(p.formato || []).includes(filters.tipo)) return false;
      if (filters.search && !p.titulo.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.responsavel) {
        const members = [...(p.responsavel || []), ...p.casting];
        if (!members.some(m => m.toLowerCase().includes(filters.responsavel.toLowerCase()))) return false;
      }
      if (filters.fases.length < 3) {
        if (filters.fases.length === 0) return false;
        // Check if the project has at least one of the selected phases
        const hasSelectedFase = filters.fases.some(fase => {
          if (fase === 'gravacao') return !!p.fases.gravacao;
          if (fase === 'edicao') return !!p.fases.edicao;
          if (fase === 'publicacao') return !!p.fases.publicacao;
          if (fase === 'evento') return !!p.fases.evento;
          return false;
        });
        if (!hasSelectedFase) return false;
      }
      return true;
    });
  }, [projetos, filters]);

  const toggleFase = useCallback((fase: FaseType) => {
    setFilters((f) => ({
      ...f,
      fases: f.fases.includes(fase) ? f.fases.filter((ff) => ff !== fase) : [...f.fases, fase],
    }));
  }, []);

  const setCanal = useCallback((canal: string) => {
    setFilters((f) => ({ ...f, canal }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((f) => ({ ...f, search }));
  }, []);

  const setTipo = useCallback((tipo: string) => {
    setFilters((f) => ({ ...f, tipo }));
  }, []);

  const setResponsavel = useCallback((responsavel: string) => {
    setFilters((f) => ({ ...f, responsavel }));
  }, []);

  const updateProjeto = useCallback(async (projetoAtualizado: Projeto) => {
    setProjetos((prev) => prev.map(p => p.id === projetoAtualizado.id ? projetoAtualizado : p));
    await supabase.from('projetos').upsert({ id: projetoAtualizado.id, data: projetoAtualizado });
  }, []);

  const addProjeto = useCallback(async (novoProjeto: Projeto) => {
    setProjetos((prev) => [...prev, novoProjeto]);
    await supabase.from('projetos').insert({ id: novoProjeto.id, data: novoProjeto });
  }, []);

  const deleteProjeto = useCallback(async (id: string) => {
    setProjetos((prev) => prev.filter(p => p.id !== id));
    await supabase.from('projetos').delete().eq('id', id);
  }, []);

  const addTeamMember = useCallback(async (member: TeamMember) => {
    setTeam((prev) => [...prev, member]);
    await supabase.from('team').insert({ id: member.name, data: member });
  }, []);

  const saveAll = useCallback(async () => {
    const projPromises = projetos.map(p => supabase.from('projetos').upsert({ id: p.id, data: p }));
    const teamPromises = team.map(t => supabase.from('team').upsert({ id: t.name, data: t }));
    await Promise.all([...projPromises, ...teamPromises]);
  }, [projetos, team]);

  return { 
    projetos: filtered, 
    allProjetos: projetos,
    team, 
    setProjetos, 
    updateProjeto, 
    addProjeto,
    deleteProjeto,
    filters, 
    toggleFase, 
    setCanal, 
    setSearch, 
    setTipo,
    setResponsavel,
    addTeamMember,
    saveAll,
    loading
  };
};
