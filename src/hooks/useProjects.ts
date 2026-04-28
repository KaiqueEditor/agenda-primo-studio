import { useState, useMemo, useCallback } from 'react';
import type { Projeto, FilterState, FaseType, TeamMember } from '../types';
import { TEAM_MEMBERS } from '../types';
import { projetosAGF } from '../data/projects';

export const useProjects = () => {
  const [projetos, setProjetos] = useState<Projeto[]>(projetosAGF);
  const [team, setTeam] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [filters, setFilters] = useState<FilterState>({
    fases: ['planejamento', 'gravacao', 'edicao', 'publicacao'],
    canal: '',
    search: '',
    tipo: 'all',
  });

  const filtered = useMemo(() => {
    return projetos.filter((p) => {
      if (filters.canal && p.canal !== filters.canal) return false;
      if (filters.tipo !== 'all' && p.tipo !== filters.tipo) return false;
      if (filters.search && !p.titulo.toLowerCase().includes(filters.search.toLowerCase())) return false;
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

  const setTipo = useCallback((tipo: 'all' | 'video' | 'podcast') => {
    setFilters((f) => ({ ...f, tipo }));
  }, []);

  const updateProjeto = useCallback((projetoAtualizado: Projeto) => {
    setProjetos((prev) => prev.map(p => p.id === projetoAtualizado.id ? projetoAtualizado : p));
  }, []);

  const addProjeto = useCallback((novoProjeto: Projeto) => {
    setProjetos((prev) => [...prev, novoProjeto]);
  }, []);

  const deleteProjeto = useCallback((id: string) => {
    setProjetos((prev) => prev.filter(p => p.id !== id));
  }, []);

  const addTeamMember = useCallback((member: TeamMember) => {
    setTeam((prev) => [...prev, member]);
  }, []);

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
    setSearch, 
    setTipo,
    addTeamMember
  };
};
