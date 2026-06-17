import { ChevronRight, FileText, FolderOpen, RefreshCw } from 'lucide-react';
import { getVerdictColor, getVerdictLabel } from './VerdictBanner';

function groupFindingsByCase(findings = []) {
  const grouped = new Map();
  findings.forEach(finding => {
    const key = finding.caseFileId || finding.caseId || 'unassigned';
    const entry = grouped.get(key) || { caseFileId: key, count: 0, latestTimestamp: finding.timestamp, verdictCounts: {}, needsReview: false };
    entry.count += 1;
    if (!entry.latestTimestamp || new Date(finding.timestamp) > new Date(entry.latestTimestamp)) entry.latestTimestamp = finding.timestamp;
    entry.verdictCounts[finding.verdict || 'REVIEW'] = (entry.verdictCounts[finding.verdict || 'REVIEW'] || 0) + 1;
    if (!finding.reviewerDecision || finding.reviewerDecision === 'UNREVIEWED') entry.needsReview = true;
    grouped.set(key, entry);
  });
  return [...grouped.values()].sort((a, b) => new Date(b.latestTimestamp || 0) - new Date(a.latestTimestamp || 0));
}

function groupFindingsByCluster(findings = [], clusters = []) {
  const counts = {};
  findings.forEach(f => {
    const technique = f.techniqueId || '';
    const cluster = clusters.find(cl => cl.payloads.some(p => p.technique === technique || p.id === f.probeId));
    const label = cluster?.name || 'Other';
    counts[label] = (counts[label] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export default function DossierHome({ C, findings, clusters, activeCase, onEnter, onResume, onReport }) {
  const cases = groupFindingsByCase(findings);
  const coverage = groupFindingsByCluster(findings, clusters);
  const hasFindingsNeedingReview = cases.some(c => c.needsReview);
  const totalProbes = clusters.reduce((n, cl) => n + cl.payloads.length, 0);

  return (
    <main style={{ width: '100%', maxWidth: 860, margin: '0 auto', padding: '48px 24px 72px', display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Resume banner */}
      {activeCase?.caseId && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: C.amberBg, border: `1px solid ${C.amber}55`, borderLeft: `3px solid ${C.amber}`, borderRadius: 5, padding: '12px 16px' }}>
          <div style={{ flex: 1, minWidth: 220, fontSize: 14, color: C.text1, fontWeight: 600 }}>
            Resume <span style={{ color: C.amber, fontFamily: C.mono }}>{activeCase.caseId}</span> — probe {Math.min((activeCase.probeIndex || 0) + 1, activeCase.total || 1)}/{activeCase.total || 0} · {activeCase.findingsCount || 0} findings
          </div>
          <button onClick={onResume} style={primaryBtn(C)}>
            <RefreshCw size={13} /> CONTINUE <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* Hero */}
      <section>
        <div style={{ fontSize: 11, color: C.text3, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
          Local-first adversarial assurance
        </div>
        <h1 style={{ fontSize: 38, color: C.amber, fontWeight: 900, letterSpacing: 3, lineHeight: 1, margin: 0 }}>ELICIT</h1>
        <p style={{ fontSize: 16, color: C.text2, lineHeight: 1.7, maxWidth: 540, marginTop: 14, marginBottom: 0 }}>
          Red-team LLMs in the browser. Preserve the evidence. Map the control gap.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
          <button onClick={onEnter} style={primaryBtn(C)}>
            BEGIN ASSESSMENT <ChevronRight size={15} />
          </button>
          {findings.length > 0 && (
            <button onClick={onReport} style={ghostBtn(C)}>
              <FileText size={13} /> VIEW REPORT
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
          <Stat C={C} value={clusters.length} label="technique clusters" />
          <Stat C={C} value={totalProbes} label="probes available" />
          <Stat C={C} value={findings.length} label="findings captured" />
        </div>
      </section>

      {/* Recent assessments */}
      {cases.length > 0 && (
        <section>
          <SectionHeading C={C} icon={<FolderOpen size={14} />} label="Recent Assessments" />
          <div style={{ display: 'grid', gap: 8 }}>
            {cases.slice(0, 8).map(item => (
              <button key={item.caseFileId} onClick={onReport} style={{
                textAlign: 'left', background: C.panel, border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${item.needsReview ? C.amber : C.teal}`,
                borderRadius: 4, padding: '12px 14px', cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, color: C.amber, fontWeight: 700, fontFamily: C.mono }}>{item.caseFileId}</span>
                  <span style={{ fontSize: 13, color: C.text3 }}>{item.count} finding{item.count !== 1 ? 's' : ''}</span>
                  {item.needsReview && <span style={{ fontSize: 12, color: C.amber }}>needs review</span>}
                  <span style={{ fontSize: 13, color: C.text3, marginLeft: 'auto' }}>{new Date(item.latestTimestamp).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {Object.entries(item.verdictCounts).map(([verdict, count]) => (
                    <span key={verdict} style={{ fontSize: 11, color: getVerdictColor(verdict, C), border: `1px solid ${getVerdictColor(verdict, C)}44`, padding: '2px 7px', borderRadius: 2 }}>
                      {getVerdictLabel(verdict)} {count}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Evidence coverage */}
      {coverage.length > 0 && (
        <section>
          <SectionHeading C={C} label="Evidence Coverage" />
          <div style={{ display: 'grid', gap: 6 }}>
            {coverage.map(([label, count]) => {
              const cluster = clusters.find(cl => cl.name === label);
              const color = cluster ? (C[cluster.colorKey] || C.amber) : C.text3;
              const pct = Math.round((count / findings.length) * 100);
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: C.panel, border: `1px solid ${C.border}`, borderRadius: 4 }}>
                  <div style={{ flex: 1, fontSize: 14, color: C.text1, fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: 13, color, fontWeight: 700, fontFamily: C.mono }}>{count} {count === 1 ? 'finding' : 'findings'}</div>
                  <div style={{ width: 80, height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state hint */}
      {findings.length === 0 && (
        <div style={{ fontSize: 13, color: C.text3, lineHeight: 1.6 }}>
          No findings yet — hit Begin Assessment above to start building an evidence record.
        </div>
      )}
    </main>
  );
}

function SectionHeading({ C, icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: C.text3, letterSpacing: 1.6, fontWeight: 700, textTransform: 'uppercase', marginBottom: 14 }}>
      {icon}{label}
    </div>
  );
}

function Stat({ C, value, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{ fontSize: 22, color: C.text1, fontWeight: 800 }}>{value}</span>
      <span style={{ fontSize: 12, color: C.text3 }}>{label}</span>
    </div>
  );
}

function primaryBtn(C) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '11px 18px', background: C.amber, color: C.ink,
    border: `1px solid ${C.amber}`, borderRadius: 4, cursor: 'pointer',
    fontSize: 13, fontWeight: 800, letterSpacing: 1.2,
  };
}

function ghostBtn(C) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '11px 16px', background: 'transparent', color: C.text2,
    border: `1px solid ${C.borderHi}`, borderRadius: 4, cursor: 'pointer',
    fontSize: 13, fontWeight: 600, letterSpacing: .5,
  };
}
