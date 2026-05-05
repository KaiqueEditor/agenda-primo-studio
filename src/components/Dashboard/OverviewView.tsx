import React from 'react';
import { type Projeto } from '../../types';
import { getProjectsDueThisWeek, getTeamWorkload, getActiveProjects, getProjectsMissingAllocation, getProductionFunnel } from '../../utils/dashboardHelpers';
import { detectConflicts } from '../../utils/dateHelpers';
import { AlertTriangle, CalendarDays, CheckCircle2, LayoutDashboard, Users, PieChart, Activity } from 'lucide-react';

interface Props {
  projetos: Projeto[];
  onSelectProject: (p: Projeto) => void;
}

export const OverviewView: React.FC<Props> = ({ projetos, onSelectProject }) => {
  const dueThisWeek = getProjectsDueThisWeek(projetos);
  const activeProjects = getActiveProjects(projetos);
  const missingAllocation = getProjectsMissingAllocation(projetos);
  const conflicts = detectConflicts(projetos);
  const workload = getTeamWorkload(projetos);
  const funnel = getProductionFunnel(projetos);

  return (
    <div style={{ padding: '24px 32px', height: '100%', overflowY: 'auto', background: 'var(--bg-main)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LayoutDashboard size={24} />
          Visão Geral
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Acompanhamento em tempo real da produtora.</p>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Activity size={16} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Projetos Ativos</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>{activeProjects.length}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <CheckCircle2 size={16} color="#34C759" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Entregas na Semana</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>{dueThisWeek.length}</div>
        </div>

        <div style={{ background: conflicts.length > 0 ? 'rgba(255,59,48,0.08)' : 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: `1px solid ${conflicts.length > 0 ? 'rgba(255,59,48,0.3)' : 'var(--border-subtle)'}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: conflicts.length > 0 ? '#FF3B30' : 'var(--text-secondary)', marginBottom: '8px' }}>
            <AlertTriangle size={16} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Conflitos de Agenda</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: conflicts.length > 0 ? '#FF3B30' : 'var(--text-primary)' }}>{conflicts.length}</div>
        </div>

        <div style={{ background: missingAllocation.length > 0 ? 'rgba(255,149,0,0.08)' : 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: `1px solid ${missingAllocation.length > 0 ? 'rgba(255,149,0,0.3)' : 'var(--border-subtle)'}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: missingAllocation.length > 0 ? '#FF9500' : 'var(--text-secondary)', marginBottom: '8px' }}>
            <Users size={16} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Falta Alocar Equipe/Casting</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: missingAllocation.length > 0 ? '#FF9500' : 'var(--text-primary)' }}>{missingAllocation.length}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Funil de Producao */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChart size={18} /> Funil de Produção
            </h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, background: 'rgba(0,122,255,0.1)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #007AFF' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>A Gravar</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#007AFF', marginTop: '4px' }}>{funnel.gravacao}</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,149,0,0.1)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #FF9500' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Em Edição</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#FF9500', marginTop: '4px' }}>{funnel.edicao}</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(52,199,89,0.1)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #34C759' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Prontos p/ Postar</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#34C759', marginTop: '4px' }}>{funnel.publicacao}</div>
              </div>
            </div>
          </div>

          {/* Agenda Crítica */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={18} /> Projetos para Postar na Semana
            </h3>
            {dueThisWeek.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Nenhuma publicação agendada para esta semana.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dueThisWeek.map(p => (
                  <div key={p.id} onClick={() => onSelectProject(p)} style={{ padding: '12px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{p.titulo}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{Array.isArray(p.canal) ? p.canal.join(', ') : p.canal}</div>
                    </div>
                    <div style={{ padding: '4px 8px', background: 'rgba(52,199,89,0.1)', color: '#34C759', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                      Postagem: {p.fases.publicacao?.data?.toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Carga de Trabalho */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} /> Carga de Trabalho (Equipe)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {workload.slice(0, 10).map(w => (
                <div key={w.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '80px', fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.name}</div>
                  <div style={{ flex: 1, background: 'var(--bg-main)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--accent)', width: `${Math.min(w.count * 10, 100)}%`, borderRadius: '4px' }} />
                  </div>
                  <div style={{ width: '24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>{w.count}</div>
                </div>
              ))}
              {workload.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Nenhuma equipe alocada.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
