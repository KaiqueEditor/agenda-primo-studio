import { useState, useCallback } from 'react';
import type { ViewMode, CalendarEvent as CalEvent, Projeto, FaseType } from './types';
import { useProjects } from './hooks/useProjects';
import { Sidebar } from './components/Sidebar/Filters';
import { MetricsHeader } from './components/Dashboard/MetricsHeader';
import { CalendarGrid } from './components/Calendar/CalendarGrid';
import { TimelineView } from './components/Timeline/TimelineView';
import { ProjectList } from './components/ListView/ProjectList';
import { ProjectModal } from './components/Modal/ProjectModal';
import { TeamModal } from './components/Modal/TeamModal';
import './index.css';

function App() {
  const { projetos, allProjetos, filters, toggleFase, setCanal, setSearch, setTipo, updateProjeto, addProjeto, deleteProjeto, team, addTeamMember, saveAll } = useProjects();
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);

  const handleEventClick = useCallback((event: CalEvent) => {
    setSelectedProjeto(event.projeto);
  }, []);

  const handleProjectClick = useCallback((projeto: Projeto) => {
    setSelectedProjeto(projeto);
  }, []);

  const handleDropEvent = useCallback((projetoId: string, fase: FaseType, oldDateStr: string, newDateStr: string) => {
    const p = allProjetos.find(p => p.id === projetoId);
    if (!p) return;

    const oldDate = new Date(oldDateStr);
    const newDate = new Date(newDateStr);
    const diffTime = newDate.getTime() - oldDate.getTime();

    const updated = { ...p, fases: { ...p.fases } };

    if (fase === 'publicacao') {
      updated.fases.publicacao = { data: newDate };
    } else {
      const f = fase as 'gravacao' | 'edicao';
      const periodo = updated.fases[f];
      if (periodo && periodo.inicio && periodo.fim) {
        updated.fases[f] = {
          ...periodo,
          inicio: new Date(periodo.inicio.getTime() + diffTime),
          fim: new Date(periodo.fim.getTime() + diffTime),
        };
      }
    }
    
    updateProjeto(updated);
  }, [allProjetos, updateProjeto]);

  const handleAddProjeto = useCallback(() => {
    const novo: Projeto = {
      id: `p${Date.now()}`,
      numero: allProjetos.length + 1,
      titulo: 'Novo Projeto',
      canal: '',
      tipo: 'video',
      casting: [],
      fases: {}
    };
    setSelectedProjeto(novo);
  }, [allProjetos.length]);

  return (
    <div className="app-layout">
      <Sidebar
        filters={filters}
        viewMode={viewMode}
        onToggleFase={toggleFase}
        onSetCanal={setCanal}
        onSetSearch={setSearch}
        onSetTipo={setTipo}
        onSetView={setViewMode}
        onOpenTeam={() => setShowTeamModal(true)}
      />
      <main className="main-area">
        <MetricsHeader projetos={allProjetos} onAddProjeto={handleAddProjeto} onSaveAll={saveAll} />
        <div className="view-area">
          {viewMode === 'calendar' && (
            <CalendarGrid projetos={projetos} fases={filters.fases} onSelectEvent={handleEventClick} onDropEvent={handleDropEvent} />
          )}
          {viewMode === 'timeline' && (
            <TimelineView projetos={projetos} onSelect={handleProjectClick} />
          )}
          {viewMode === 'list' && (
            <ProjectList projetos={projetos} onSelect={handleProjectClick} />
          )}
        </div>
      </main>
      {selectedProjeto && (
        <ProjectModal 
          projeto={selectedProjeto}
          team={team}
          onClose={() => setSelectedProjeto(null)} 
          onSave={(p) => {
            const exists = allProjetos.some(exist => exist.id === p.id);
            if (exists) {
              updateProjeto(p);
            } else {
              addProjeto(p);
            }
            setSelectedProjeto(null);
          }}
          onDelete={(id) => {
            deleteProjeto(id);
            setSelectedProjeto(null);
          }}
        />
      )}
      {showTeamModal && (
        <TeamModal 
          team={team} 
          projetos={allProjetos}
          onClose={() => setShowTeamModal(false)} 
          onSave={addTeamMember} 
        />
      )}
    </div>
  );
}

export default App;
