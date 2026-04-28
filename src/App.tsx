import { useState, useCallback } from 'react';
import type { ViewMode, CalendarEvent as CalEvent, Projeto } from './types';
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
  const { projetos, allProjetos, filters, toggleFase, setCanal, setSearch, setTipo, updateProjeto, addProjeto, deleteProjeto, team, addTeamMember } = useProjects();
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);

  const handleEventClick = useCallback((event: CalEvent) => {
    setSelectedProjeto(event.projeto);
  }, []);

  const handleProjectClick = useCallback((projeto: Projeto) => {
    setSelectedProjeto(projeto);
  }, []);

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
        <MetricsHeader projetos={allProjetos} onAddProjeto={handleAddProjeto} />
        <div className="view-area">
          {viewMode === 'calendar' && (
            <CalendarGrid projetos={projetos} fases={filters.fases} onSelectEvent={handleEventClick} />
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
