import React, { useMemo } from 'react';
import { type Projeto } from '../../types';
import { ShieldAlert, Users, Activity, FileText } from 'lucide-react';

interface Props {
  projetos: Projeto[];
}

export const AdminPanelView: React.FC<Props> = ({ projetos }) => {
  // Aggregate data from projects to see who has been active
  const analytics = useMemo(() => {
    const editCounts: Record<string, number> = {};
    const descriptionEditCounts: Record<string, number> = {};
    let totalEdits = 0;

    projetos.forEach(p => {
      if (p.updatedBy) {
        editCounts[p.updatedBy] = (editCounts[p.updatedBy] || 0) + 1;
        totalEdits++;
      }
      if (p.descricaoUpdatedBy) {
        descriptionEditCounts[p.descricaoUpdatedBy] = (descriptionEditCounts[p.descricaoUpdatedBy] || 0) + 1;
      }
    });

    // Convert to sorted arrays
    const topEditors = Object.entries(editCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const topDescEditors = Object.entries(descriptionEditCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      topEditors,
      topDescEditors,
      totalEdits,
      activeUsersCount: topEditors.length
    };
  }, [projetos]);

  return (
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto', background: 'var(--bg-main)' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.5px' }}>
            <ShieldAlert size={28} color="#A855F7" />
            Kaique Analytics (Admin)
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0 0', fontSize: '14px', fontWeight: 500 }}>
            Painel exclusivo com métricas de uso e engajamento da plataforma.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Users size={16} /> <span style={{ fontSize: '13px', fontWeight: 600 }}>Usuários Ativos</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>{analytics.activeUsersCount}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <Activity size={16} color="#007AFF" /> <span style={{ fontSize: '13px', fontWeight: 600 }}>Total de Edições</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>{analytics.totalEdits}</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <FileText size={16} color="#FF9500" /> <span style={{ fontSize: '13px', fontWeight: 600 }}>Links de Servidor Adicionados</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>{analytics.topDescEditors.reduce((acc, curr) => acc + curr.count, 0)}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} /> Quem mais edita projetos?
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analytics.topEditors.map((editor, i) => (
              <div key={editor.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', width: '20px' }}>{i + 1}º</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{editor.name}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>{editor.count} mods</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--accent)', width: `${(editor.count / analytics.totalEdits) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
            {analytics.topEditors.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Nenhum dado de edição ainda.</p>}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} /> Quem mais adiciona Caminho de Servidor?
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analytics.topDescEditors.map((editor, i) => (
              <div key={editor.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-main)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>{i + 1}º</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{editor.name}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FF9500', background: 'rgba(255,149,0,0.1)', padding: '4px 10px', borderRadius: '100px' }}>{editor.count} links</span>
              </div>
            ))}
            {analytics.topDescEditors.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Nenhum dado ainda.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
