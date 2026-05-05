import React from 'react';
import { type Projeto } from '../../types';
import { getProjectsDueThisWeek, getTeamWorkload, getProjectsMissingAllocation, getProductionFunnel, getMonthlyStats } from '../../utils/dashboardHelpers';
import { detectConflicts } from '../../utils/dateHelpers';
import { AlertTriangle, CalendarDays, CheckCircle2, Users, PieChart, Activity, Video, Scissors, Send, CalendarRange } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  projetos: Projeto[];
  onSelectProject: (p: Projeto) => void;
}

export const OverviewView: React.FC<Props> = ({ projetos, onSelectProject }) => {
  const dueThisWeek = getProjectsDueThisWeek(projetos);
  const missingAllocation = getProjectsMissingAllocation(projetos);
  const conflicts = detectConflicts(projetos);
  const workload = getTeamWorkload(projetos);
  const funnel = getProductionFunnel(projetos);
  const monthlyStats = getMonthlyStats(projetos);
  const currentMonthName = format(new Date(), 'MMMM yyyy', { locale: ptBR });

  return (
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto', background: 'var(--bg-main)' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' }}>
            <Activity size={28} color="var(--accent)" />
            Production Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0 0', fontSize: '14px', fontWeight: 500 }}>
            Visão geral de dados operacionais e produtividade da equipe.
          </p>
        </div>
        <div style={{ padding: '8px 16px', background: 'var(--bg-elevated)', borderRadius: '100px', border: '1px solid var(--border-subtle)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          Mês atual: <span style={{ color: 'var(--accent)', textTransform: 'capitalize' }}>{currentMonthName}</span>
        </div>
      </div>

      {/* BI Monthly Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Gravações no Mês', count: monthlyStats.gravacoes, icon: <Video size={20} />, color: '#007AFF', bg: 'rgba(0,122,255,0.08)' },
          { label: 'Edições no Mês', count: monthlyStats.edicoes, icon: <Scissors size={20} />, color: '#FF9500', bg: 'rgba(255,149,0,0.08)' },
          { label: 'Publicações no Mês', count: monthlyStats.publicacoes, icon: <Send size={20} />, color: '#34C759', bg: 'rgba(52,199,89,0.08)' },
          { label: 'Eventos no Mês', count: monthlyStats.eventos, icon: <CalendarRange size={20} />, color: '#A855F7', bg: 'rgba(168,85,247,0.08)' }
        ].map((stat, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '80px', height: '80px', background: stat.bg, borderRadius: '50%', opacity: 0.5 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', position: 'relative', zIndex: 1, lineHeight: '1' }}>
              {stat.count}
            </div>
            {/* Fake Sparkline for BI aesthetic */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '24px', marginTop: '8px' }}>
              {[0.4, 0.7, 0.5, 0.9, 0.6, 1].map((h, idx) => (
                <div key={idx} style={{ flex: 1, background: stat.bg, height: `${h * 100}%`, borderRadius: '2px', opacity: idx === 5 ? 1 : 0.6 }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Funil de Producao */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <PieChart size={18} color="var(--accent)" /> Estado Atual da Esteira
            </h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>A Gravar</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#007AFF', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  {funnel.gravacao} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>projetos</span>
                </div>
              </div>
              <div style={{ flex: 1, background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Em Edição</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#FF9500', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  {funnel.edicao} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>projetos</span>
                </div>
              </div>
              <div style={{ flex: 1, background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prontos p/ Postar</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#34C759', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  {funnel.publicacao} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>projetos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Agenda Crítica */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <CalendarDays size={18} color="#34C759" /> Entregas da Semana
            </h3>
            {dueThisWeek.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', background: 'var(--bg-main)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
                <CheckCircle2 size={32} color="var(--text-muted)" style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0, fontWeight: 500 }}>Nenhuma publicação agendada para esta semana.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dueThisWeek.map(p => (
                  <div key={p.id} onClick={() => onSelectProject(p)} style={{ padding: '16px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateX(4px)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'none'; }}>
                    <div>
                      <strong style={{ fontSize: '15px', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>{p.titulo}</strong>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
                        {Array.isArray(p.canal) ? p.canal.join(', ') : p.canal}
                      </div>
                    </div>
                    <div style={{ padding: '6px 12px', background: 'rgba(52,199,89,0.1)', color: '#34C759', borderRadius: '6px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CalendarDays size={14} />
                      {p.fases.publicacao?.data?.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Alertas e Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {conflicts.length > 0 && (
              <div style={{ background: 'rgba(255,59,48,0.08)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,59,48,0.3)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <AlertTriangle size={24} color="#FF3B30" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#FF3B30', fontSize: '15px', display: 'block', marginBottom: '4px' }}>{conflicts.length} Conflitos de Agenda</strong>
                  <p style={{ color: 'var(--text-primary)', fontSize: '13px', margin: 0, opacity: 0.8, lineHeight: '1.4' }}>
                    Ajuste os responsáveis para evitar sobreposição de horários. Verifique o alerta no menu superior.
                  </p>
                </div>
              </div>
            )}

            {missingAllocation.length > 0 && (
              <div style={{ background: 'rgba(255,149,0,0.08)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,149,0,0.3)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Users size={24} color="#FF9500" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#FF9500', fontSize: '15px', display: 'block', marginBottom: '4px' }}>{missingAllocation.length} Projetos sem Dono</strong>
                  <p style={{ color: 'var(--text-primary)', fontSize: '13px', margin: 0, opacity: 0.8, lineHeight: '1.4' }}>
                    Existem projetos sem equipe ou casting alocado.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Carga de Trabalho */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', flex: 1 }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#007AFF" /> Carga de Trabalho
              </div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '4px 8px', borderRadius: '100px' }}>Equipe Ativa</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {workload.slice(0, 10).map(w => (
                <div key={w.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{w.name}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>{w.count} <span style={{ fontWeight: 500 }}>proj.</span></span>
                  </div>
                  <div style={{ width: '100%', background: 'var(--bg-main)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: w.count > 4 ? '#FF3B30' : w.count > 2 ? '#FF9500' : 'var(--accent)', width: `${Math.min(w.count * 10, 100)}%`, borderRadius: '3px' }} />
                  </div>
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
