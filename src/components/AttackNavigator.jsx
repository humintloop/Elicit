import { Search, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

const filterLabels = [
  ['ALL', 'All'],
  ['AML.T0051.000', 'Direct injection'],
  ['AML.T0051.001', 'Indirect injection'],
  ['AML.T0054', 'Jailbreak'],
  ['AML.T0056', 'Prompt extraction'],
];

export default function AttackNavigator({
  C,
  clusters,
  activeClusterId,
  activeProbeId,
  filter,
  setFilter,
  query,
  setQuery,
  onSelectProbe,
  open,
  setOpen,
}) {
  const totalProbes = clusters.reduce((n, cl) => n + cl.payloads.length, 0);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleClusters = clusters
    .filter(cl => filter === 'ALL' || cl.code === filter || cl.id === filter)
    .map(cl => ({
      ...cl,
      payloads: cl.payloads.filter(p => {
        if (!normalizedQuery) return true;
        return [p.name, p.description, p.technique, p.difficulty, p.owasp, p.objective, p.failure_mode]
          .filter(Boolean).join(' ').toLowerCase().includes(normalizedQuery);
      }),
    }))
    .filter(cl => cl.payloads.length > 0);

  if (!open) {
    return (
      <aside className="attack-nav" style={{
        width: 44, minWidth: 44, flexShrink: 0,
        borderRight: `1px solid ${C.border}`,
        background: 'rgba(10,12,22,.7)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 14, gap: 4, overflow: 'hidden',
      }}>
        <button onClick={() => setOpen(true)} title="Browse probes" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          padding: '10px 0', width: '100%', background: 'transparent', border: 'none',
          cursor: 'pointer', color: C.text3,
        }}>
          <Layers size={16} color={C.text3} />
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase',
            writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: C.text3, marginTop: 2,
          }}>Probes</span>
          <span style={{ fontSize: 11, color: C.amber, fontWeight: 800 }}>{totalProbes}</span>
        </button>
        <button onClick={() => setOpen(true)} style={{
          marginTop: 'auto', marginBottom: 14, padding: 8, background: 'transparent', border: 'none',
          cursor: 'pointer', color: C.text3,
        }}>
          <ChevronRight size={14} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="attack-nav" style={{
      width: 288, minWidth: 248, maxWidth: 340, flexShrink: 0,
      borderRight: `1px solid ${C.border}`,
      background: 'rgba(10,12,22,.7)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ padding: '11px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
          <div style={{ fontSize: 11, color: C.text2, letterSpacing: 1.4, fontWeight: 800, textTransform: 'uppercase' }}>
            Probes
          </div>
          <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.text3, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: 4 }}>
            <ChevronLeft size={13} /> Hide
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 9 }}>
          {filterLabels.map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} style={{
              padding: '4px 7px',
              background: filter === id ? C.amberBg : 'transparent',
              border: `1px solid ${filter === id ? C.amber : C.borderHi}`,
              color: filter === id ? C.amber : C.text3,
              borderRadius: 2, fontSize: 11, fontWeight: 700, cursor: 'pointer',
            }}>
              {label}
            </button>
          ))}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 3, padding: '6px 8px' }}>
          <Search size={12} color={C.text3} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="search probes, techniques, signals"
            style={{ width: '100%', minWidth: 0, background: 'transparent', border: 'none', color: C.text1, fontSize: 12 }} />
        </label>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {visibleClusters.map(cluster => {
          const clusterActive = activeClusterId === cluster.id;
          const color = C[cluster.colorKey] || C.amber;
          return (
            <section key={cluster.id} style={{ borderBottom: `1px solid ${C.border}` }}>
              <div style={{ padding: '9px 12px 5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 10, color, letterSpacing: 1, fontWeight: 800, fontFamily: C.mono }}>{cluster.code}</span>
                  <span style={{ fontSize: 10, color: C.text3 }}>{cluster.payloads.length}</span>
                </div>
                <div style={{ fontSize: 13, color: clusterActive ? C.text1 : C.text2, fontWeight: 600, marginTop: 2 }}>{cluster.name}</div>
              </div>
              <div style={{ display: 'grid', gap: 2, padding: '0 8px 8px' }}>
                {cluster.payloads.map((payload, index) => {
                  const active = activeProbeId === payload.id;
                  return (
                    <button key={payload.id} onClick={() => { onSelectProbe(cluster.id, payload.id); setOpen(false); }} style={{
                      textAlign: 'left',
                      background: active ? `${color}14` : 'transparent',
                      border: `1px solid ${active ? color : 'transparent'}`,
                      borderLeft: `3px solid ${active ? color : C.border}`,
                      borderRadius: 3, padding: '7px 9px', cursor: 'pointer',
                    }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: active ? color : C.text3, fontFamily: C.mono }}>{String(index + 1).padStart(2, '0')}</span>
                        <span style={{ fontSize: 12.5, color: active ? C.text1 : C.text2, fontWeight: active ? 700 : 500 }}>{payload.name}</span>
                      </div>
                      <div style={{ fontSize: 11, color: C.text3, marginTop: 2, lineHeight: 1.35 }}>
                        {payload.difficulty?.toUpperCase()} · {payload.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </aside>
  );
}
