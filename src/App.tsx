import { useState } from 'react';
import type { ViewMode, CalendarEvent as CalEvent, Projeto, FaseType } from './types';
import { useProjects } from './hooks/useProjects';
import { useAuth } from './hooks/useAuth';
import { Sidebar } from './components/Sidebar/Filters';
import { MetricsHeader } from './components/Dashboard/MetricsHeader';
import { CalendarGrid } from './components/Calendar/CalendarGrid';
import { TimelineView } from './components/Timeline/TimelineView';
import { ProjectList } from './components/ListView/ProjectList';
import { ProjectModal } from './components/Modal/ProjectModal';
import { TeamModal } from './components/Modal/TeamModal';
import { LoginPage } from './components/Auth/LoginPage';
import { ToastContainer, toast } from './components/UI/Toast';
import './index.css';

function App() {
  const { session, user, loading: authLoading, error: authError, signIn, signUp, signOut, isAdmin } = useAuth();
  const { projetos, allProjetos, filters, toggleFase, setCanal, setSearch, setTipo, updateProjeto, addProjeto, deleteProjeto, team, addTeamMember, saveAll } = useProjects();
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Show login if not authenticated
  if (!session) {
    return (
      <>
        <LoginPage onSignIn={signIn} onSignUp={signUp} error={authError} loading={authLoading} />
        <ToastContainer />
      </>
    );
  }

  const handleEventClick = (event: CalEvent) => {
    setSelectedProjeto(event.projeto);
  };

  const handleProjectClick = (projeto: Projeto) => {
    setSelectedProjeto(projeto);
  };

  const handleDropEvent = (projetoId: string, fase: FaseType, oldDateStr: string, newDateStr: string) => {
    if (!isAdmin) {
      toast.error('Apenas admins podem mover eventos');
      return;
    }
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
    toast.success('Evento movido com sucesso');
  };

  const handleAddProjeto = () => {
    if (!isAdmin) {
      toast.error('Apenas admins podem criar projetos');
      return;
    }
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
  };

  const handleSaveAll = async () => {
    await saveAll();
    toast.success('Tudo sincronizado na nuvem');
  };

  return (
    <div className="app-layout">
      <Sidebar
        filters={filters}
        viewMode={viewMode}
        collapsed={sidebarCollapsed}
        user={user}
        onToggleFase={toggleFase}
        onSetCanal={setCanal}
        onSetSearch={setSearch}
        onSetTipo={setTipo}
        onSetView={setViewMode}
        onOpenTeam={() => setShowTeamModal(true)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onSignOut={signOut}
      />
      <main className="main-area">
        <MetricsHeader projetos={allProjetos} onAddProjeto={handleAddProjeto} onSaveAll={handleSaveAll} />
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
            if (!isAdmin) {
              toast.error('Apenas admins podem editar projetos');
              return;
            }
            const exists = allProjetos.some(exist => exist.id === p.id);
            if (exists) {
              updateProjeto(p);
            } else {
              addProjeto(p);
            }
            setSelectedProjeto(null);
            toast.success('Projeto salvo');
          }}
          onDelete={isAdmin ? (id) => {
            deleteProjeto(id);
            setSelectedProjeto(null);
            toast.success('Projeto excluído');
          } : undefined}
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
      <ToastContainer />
    </div>
  );
}

export default App;
