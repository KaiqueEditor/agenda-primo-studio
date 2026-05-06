import { useState, useCallback, useEffect } from 'react';
import type { ViewMode, CalendarEvent as CalEvent, Projeto, FaseType } from './types';
import { DEFAULT_FORMATOS } from './types';
import { useProjects } from './hooks/useProjects';
import { useAuth } from './hooks/useAuth';
import { Sidebar } from './components/Sidebar/Filters';
import { GlobalActions } from './components/Dashboard/GlobalActions';
import { OverviewView } from './components/Dashboard/OverviewView';
import { MyTasksView } from './components/Dashboard/MyTasksView';
import { AdminPanelView } from './components/Dashboard/AdminPanelView';
import { CalendarGrid } from './components/Calendar/CalendarGrid';
import { TimelineView } from './components/Timeline/TimelineView';
import { ProjectList } from './components/ListView/ProjectList';
import { BoardView } from './components/Board/BoardView';
import { ProjectModal } from './components/Modal/ProjectModal';
import { TeamModal } from './components/Modal/TeamModal';
import { UserProfileModal } from './components/Modal/UserProfileModal';
import { TagManagerModal, type TagCategory } from './components/Modal/TagManagerModal';
import { LoginPage } from './components/Auth/LoginPage';
import { ToastContainer, toast } from './components/UI/Toast';
import { CommandPalette } from './components/UI/CommandPalette';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { FilterBar } from './components/FilterBar/FilterBar';
import './index.css';

function App() {
  const { session, user, loading: authLoading, error: authError, signIn, signUp, signOut, signInWithGoogle, signInWithMagicLink, isAdmin } = useAuth();
  const { projetos, allProjetos, filters, toggleFase, setCanal, setSearch, setTipo, setResponsavel, updateProjeto, addProjeto, deleteProjeto, team, addTeamMember, saveAll, loading } = useProjects();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tagManagerCategory, setTagManagerCategory] = useState<TagCategory | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('agf-theme-apple') === 'dark');

  // Custom tags persisted in localStorage
  const [customFormatos, setCustomFormatos] = useState<string[]>(() => {
    const saved = localStorage.getItem('agf-tags-formatos');
    return saved ? JSON.parse(saved) : DEFAULT_FORMATOS.map(f => f.label);
  });
  const [customCanais, setCustomCanais] = useState<string[]>(() => {
    const saved = localStorage.getItem('agf-tags-canais');
    return saved ? JSON.parse(saved) : ['AGF', 'Finclass', 'G4', 'O Primo Rico', 'Os Economistas', 'Os Sócios Podcast', 'PrimoCast', 'PrimoTech', 'Você Mais Rico'];
  });

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('agf-theme-apple', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAddProjeto: () => handleAddProjeto(),
    onOpenTeam: () => setShowTeamModal(true),
    onSetView: setViewMode,
    onToggleSidebar: toggleSidebar,
  });

  // Show login if not authenticated
  if (!session) {
    return (
      <>
        <LoginPage onSignIn={signIn} onSignUp={signUp} onSignInWithGoogle={signInWithGoogle} onSignInWithMagicLink={signInWithMagicLink} error={authError} loading={authLoading} />
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
      const f = fase as 'gravacao' | 'edicao' | 'evento';
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
        onSetResponsavel={setResponsavel}
        onSetView={setViewMode}
        onOpenTeam={() => setShowTeamModal(true)}
        onToggleCollapse={toggleSidebar}
        onSignOut={signOut}
        teamMembers={team.map(t => t.name)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenTagManager={(cat: TagCategory) => setTagManagerCategory(cat)}
        customFormatos={customFormatos}
        customCanais={customCanais}
        onAddProjeto={handleAddProjeto}
      />
      <main className="main-area">
        <div className="view-area">
          {viewMode === 'dashboard' && (
            <OverviewView projetos={allProjetos} onSelectProject={handleProjectClick} />
          )}
          {viewMode === 'my-tasks' && (
            <MyTasksView projetos={allProjetos} userName={user?.displayName || ''} onSelectProject={handleProjectClick} />
          )}
          {viewMode === 'admin-panel' && user?.email?.includes('kaique') && (
            <AdminPanelView projetos={allProjetos} />
          )}
          {viewMode === 'calendar' && (
            <CalendarGrid 
              projetos={projetos} 
              fases={filters.fases} 
              onSelectEvent={handleEventClick} 
              onDropEvent={handleDropEvent} 
              loading={loading}
              headerActions={
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <FilterBar 
                    filters={filters}
                    onSetCanal={setCanal}
                    onSetTipo={setTipo}
                    onSetResponsavel={setResponsavel}
                    canalOptions={customCanais}
                    formatoOptions={customFormatos}
                    teamOptions={team.map(t => t.name)}
                  />
                  <GlobalActions projetos={allProjetos} onSaveAll={handleSaveAll} onEditProject={handleProjectClick} />
                </div>
              }
            />
          )}
          {viewMode === 'timeline' && (
            <TimelineView 
              projetos={projetos} 
              onSelect={handleProjectClick} 
              loading={loading}
              headerActions={
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <FilterBar 
                    filters={filters}
                    onSetCanal={setCanal}
                    onSetTipo={setTipo}
                    onSetResponsavel={setResponsavel}
                    canalOptions={customCanais}
                    formatoOptions={customFormatos}
                    teamOptions={team.map(t => t.name)}
                  />
                  <GlobalActions projetos={allProjetos} onSaveAll={handleSaveAll} onEditProject={handleProjectClick} />
                </div>
              }
            />
          )}
          {viewMode === 'list' && (
            <ProjectList 
              projetos={projetos} 
              onSelect={handleProjectClick} 
              loading={loading} 
              headerActions={
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <FilterBar 
                    filters={filters}
                    onSetCanal={setCanal}
                    onSetTipo={setTipo}
                    onSetResponsavel={setResponsavel}
                    canalOptions={customCanais}
                    formatoOptions={customFormatos}
                    teamOptions={team.map(t => t.name)}
                  />
                  <GlobalActions projetos={allProjetos} onSaveAll={handleSaveAll} onEditProject={handleProjectClick} />
                </div>
              }
            />
          )}
          {viewMode === 'board' && (
            <BoardView 
              projetos={projetos} 
              onSelect={handleProjectClick} 
              loading={loading} 
              headerActions={
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <FilterBar 
                    filters={filters}
                    onSetCanal={setCanal}
                    onSetTipo={setTipo}
                    onSetResponsavel={setResponsavel}
                    canalOptions={customCanais}
                    formatoOptions={customFormatos}
                    teamOptions={team.map(t => t.name)}
                  />
                  <GlobalActions projetos={allProjetos} onSaveAll={handleSaveAll} />
                </div>
              }
            />
          )}
        </div>
      </main>

      {/* Modais */}
      <CommandPalette projetos={allProjetos} onSelect={setSelectedProjeto} />

      {selectedProjeto && (
        <ProjectModal 
          projeto={selectedProjeto}
          allProjetos={allProjetos}
          team={team}
          isAdmin={isAdmin}
          onClose={() => setSelectedProjeto(null)} 
          onSave={(p) => {
            const exists = allProjetos.some(exist => exist.id === p.id);
            const projectWithEditor = { ...p, updatedBy: user?.displayName || 'Desconhecido' };
            
            // Check if descricao specifically changed
            if (selectedProjeto && selectedProjeto.descricao !== p.descricao) {
              projectWithEditor.descricaoUpdatedBy = user?.displayName || 'Desconhecido';
            }

            if (!isAdmin) {
              // Only allow saving if the only change is the description
              const originalWithoutDesc = { ...selectedProjeto, descricao: undefined, descricaoUpdatedBy: undefined };
              const newWithoutDesc = { ...projectWithEditor, descricao: undefined, descricaoUpdatedBy: undefined, updatedBy: selectedProjeto?.updatedBy };
              
              if (JSON.stringify(originalWithoutDesc) !== JSON.stringify(newWithoutDesc)) {
                toast.error('Apenas admins podem editar os dados principais do projeto');
                return;
              }
            }
            if (exists) {
              updateProjeto(projectWithEditor);
            } else {
              addProjeto(projectWithEditor);
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
      {showProfileModal && user && (
        <UserProfileModal 
          user={user}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {tagManagerCategory && (
        <TagManagerModal
          category={tagManagerCategory}
          tags={tagManagerCategory === 'formato' ? customFormatos : tagManagerCategory === 'canal' ? customCanais : team.map(t => t.name)}
          onClose={() => setTagManagerCategory(null)}
          onSave={(newTags) => {
            if (tagManagerCategory === 'formato') {
              setCustomFormatos(newTags);
              localStorage.setItem('agf-tags-formatos', JSON.stringify(newTags));
            } else if (tagManagerCategory === 'canal') {
              setCustomCanais(newTags);
              localStorage.setItem('agf-tags-canais', JSON.stringify(newTags));
            }
            toast.success('Tags atualizadas');
          }}
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default App;
