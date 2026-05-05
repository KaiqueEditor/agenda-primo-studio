import React, { useMemo } from 'react';
import { type Projeto } from '../../types';
import { ClipboardList, CalendarDays, CheckCircle2 } from 'lucide-react';
import { isBefore, startOfDay, isWithinInterval } from 'date-fns';

interface Props {
  projetos: Projeto[];
  userName: string;
  onSelectProject: (p: Projeto) => void;
}

export const MyTasksView: React.FC<Props> = ({ projetos, userName, onSelectProject }) => {
  
  const myProjects = useMemo(() => {
    if (!userName) return [];
    
    // Simplistic match: check if userName is in responsavel or casting array, or partial match
    const nameMatch = (name: string, list?: string[]) => {
      if (!list) return false;
      const lowerName = name.toLowerCase();
      const firstPart = lowerName.split(' ')[0];
      return list.some(item => {
        const lowerItem = item.toLowerCase();
        return lowerItem.includes(firstPart) || lowerName.includes(lowerItem);
      });
    };

    return projetos.filter(p => nameMatch(userName, p.responsavel) || nameMatch(userName, p.casting));
  }, [projetos, userName]);

  // Group by status (Atrasados, Hoje/Esta Semana, Futuros)
  const grouped = useMemo(() => {
    const today = startOfDay(new Date());
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);

    const atrasados: Projeto[] = [];
    const semana: Projeto[] = [];
    const futuros: Projeto[] = [];

    myProjects.forEach(p => {
      // Find the most relevant current phase
      let activeDate: Date | null = null;
      if (p.fases.publicacao?.data) activeDate = p.fases.publicacao.data;
      else if (p.fases.edicao?.fim) activeDate = p.fases.edicao.fim;
      else if (p.fases.gravacao?.fim) activeDate = p.fases.gravacao.fim;
      
      if (!activeDate) {
        futuros.push(p);
        return;
      }

      if (isBefore(activeDate, today)) {
        // Simple logic: if it has publicacao data and it's past, it's done. Don't show in atrasados.
        // Wait, if it's done, we shouldn't show it? Let's just say if it's published, skip.
        // Actually, let's keep it simple: if it's past, it's "concluído/atrasado"
        // Let's just group them.
        atrasados.push(p);
      } else if (isWithinInterval(activeDate, { start: today, end: weekEnd })) {
        semana.push(p);
      } else {
        futuros.push(p);
      }
    });

    // We can also just categorize as "A Fazer" based on missing phase dates.
    // Let's use a simpler Kanban approach: 
    // To Do (Sem datas ou muito no futuro), Doing (Esta semana), Done (Passado/Publicado)

    return { atrasados, semana, futuros };
  }, [myProjects]);

  if (!userName) {
    return (
      <div style={{ padding: '32px', height: '100%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Você precisa estar logado para ver suas demandas.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto', background: 'var(--bg-main)' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' }}>
            <ClipboardList size={28} color="var(--accent)" />
            Minhas Demandas
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0 0', fontSize: '14px', fontWeight: 500 }}>
            Olá, {userName}. Aqui estão os projetos sob sua responsabilidade.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Coluna 1: Urgente / Esta Semana */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 700, paddingBottom: '8px', borderBottom: '2px solid var(--border-subtle)' }}>
            <CalendarDays size={18} color="#FF9500" /> Para esta Semana ({grouped.semana.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {grouped.semana.map(p => <ProjectCard key={p.id} projeto={p} onClick={() => onSelectProject(p)} />)}
            {grouped.semana.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Nada urgente para esta semana.</p>}
          </div>
        </div>

        {/* Coluna 2: Futuros */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 700, paddingBottom: '8px', borderBottom: '2px solid var(--border-subtle)' }}>
            <CalendarDays size={18} color="#007AFF" /> Próximos ({grouped.futuros.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {grouped.futuros.map(p => <ProjectCard key={p.id} projeto={p} onClick={() => onSelectProject(p)} />)}
            {grouped.futuros.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Nenhum projeto futuro alocado.</p>}
          </div>
        </div>

        {/* Coluna 3: Atrasados ou Concluídos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 700, paddingBottom: '8px', borderBottom: '2px solid var(--border-subtle)' }}>
            <CheckCircle2 size={18} color="#34C759" /> Concluídos ou Pendentes Antigos ({grouped.atrasados.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: 0.7 }}>
            {grouped.atrasados.map(p => <ProjectCard key={p.id} projeto={p} onClick={() => onSelectProject(p)} />)}
            {grouped.atrasados.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Nenhum histórico recente.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ projeto, onClick }: { projeto: Projeto, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      style={{ 
        background: 'var(--bg-card)', 
        padding: '16px', 
        borderRadius: '12px', 
        border: '1px solid var(--border-subtle)', 
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <strong style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: '1.2' }}>{projeto.titulo}</strong>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>#{projeto.numero}</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{Array.isArray(projeto.canal) ? projeto.canal.join(', ') : projeto.canal}</div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {projeto.fases.publicacao?.data && (
          <span style={{ fontSize: '11px', background: 'rgba(52,199,89,0.1)', color: '#34C759', padding: '2px 8px', borderRadius: '100px', fontWeight: 600 }}>
            Pub: {projeto.fases.publicacao.data.toLocaleDateString('pt-BR')}
          </span>
        )}
        {projeto.fases.edicao?.fim && (
          <span style={{ fontSize: '11px', background: 'rgba(255,149,0,0.1)', color: '#FF9500', padding: '2px 8px', borderRadius: '100px', fontWeight: 600 }}>
            Edição: {projeto.fases.edicao.fim.toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>
    </div>
  );
};
