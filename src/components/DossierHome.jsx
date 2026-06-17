import { useState } from 'react';
import { ChevronRight, FileText, FolderOpen, ShieldCheck } from 'lucide-react';
import { ASSURANCE_PROFILE, CONTROL_SET, FRAMEWORK_REFERENCES } from '../data/frameworkMappings';
import { getVerdictColor, getVerdictLabel } from './VerdictBanner';

function groupFindingsByCase(findings = []) {
  const grouped = new Map();
  findings.forEach(finding => {
    const caseFileId = finding.caseFileId || finding.caseId || 'unassigned-case';
    const entry = grouped.get(caseFileId) || {
      caseFileId,
      count: 0,
      latestTimestamp: finding.timestamp,
      verdictCounts: {},
      analyst: finding.analyst || 'unassigned',
    };
    entry.count += 1;
    entry.latestTimestamp = !entry.latestTimestamp || new Date(finding.timestamp) > new Date(entry.latestTimestamp)
      ? finding.timestamp
      : entry.latestTimestamp;
    entry.verdictCounts[finding.verdict || 'REVIEW'] = (entry.verdictCounts[finding.verdict || 'REVIEW'] || 0) + 1;
    if (finding.analyst) entry.analyst = finding.analyst;
    grouped.set(caseFileId, entry);
  });
  return [...grouped.values()].sort((a, b) => new Date(b.latestTimestamp || 0) - new Date(a.latestTimestamp || 0));
}

export default function DossierHome({ C, findings, clusters, activeCase, onEnter, onResume, onReport }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const cases = groupFindingsByCase(findings);
  const controls = Object.values(CONTROL_SET);
  const frameworkFamilies = [
    ['MITRE ATLAS', Object.keys(FRAMEWORK_REFERENCES.mitre_atlas).length, 'Technique traceability for adversarial behavior.'],
    ['OWASP LLM Top 10', Object.keys(FRAMEWORK_REFERENCES.owasp).length, 'Application-risk categories for LLM systems.'],
    ['ISO/IEC 42001', Object.keys(FRAMEWORK_REFERENCES.iso_42001).length, 'Monitoring, audit, and management-review evidence prompts.'],
    ['EU AI Act readiness', Object.keys(FRAMEWORK_REFERENCES.eu_ai_act).length, 'Conditional high-risk readiness prompts, not classification decisions.'],
    ['NIST AI RMF', Object.keys(FRAMEWORK_REFERENCES.nist_ai_rmf).length, 'Govern, Map, Measure, and Manage context.'],
  ];

  return (
    <main className="es-card" style={{ width: '100%', maxWidth: 1160, margin: '0 auto', padding: '34px 22px 56px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {activeCase?.caseId && (
        <section style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: C.amberBg, border: `1px solid ${C.amber}55`, borderLeft: `3px solid ${C.amber}`, borderRadius: 5, padding: '12px 14px' }}>
          <div style={{ flex: 1, minWidth: 260, color: C.text1, fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>
            &gt; RESUME {activeCase.caseId} — Probe {Math.min((activeCase.probeIndex || 0) + 1, activeCase.total || 1)}/{activeCase.total || 0} · {activeCase.findingsCount || 0} finding{activeCase.findingsCount === 1 ? '' : 's'}
          </div>
          <button onClick={onResume} style={primaryButton(C)}>
            CONTINUE CASE <ChevronRight size={14} />
          </button>
        </section>
      )}

      <section className="home-hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(260px, .8fr)', gap: 14 }}>
        <div style={{ background: C.panel, border: `1px solid ${C.borderHi}`, borderLeft: `3px solid ${C.amber}`, borderRadius: 5, padding: 22 }}>
          <div style={{ fontSize: 10, color: C.text3, letterSpacing: 2, textTransform: 'uppercase' }}>Local-first adversarial assurance</div>
          <div style={{ fontSize: 34, color: C.amber, fontWeight: 900, letterSpacing: 4, marginTop: 8 }}>ELICIT</div>
          <div style={{ fontSize: 15, color: C.text2, lineHeight: 1.65, maxWidth: 660, marginTop: 10 }}>
            Run browser-local LLM probes, preserve the evidence, and map findings to controls, mitigations, and readiness questions.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
            <button onClick={onEnter} style={primaryButton(C)}>
              BEGIN ASSESSMENT <ChevronRight size={14} />
            </button>
            <button onClick={onReport} disabled={!findings.length} style={{ ...ghostButton(C), opacity: findings.length ? 1 : .45, cursor: findings.length ? 'pointer' : 'not-allowed' }}>
              <FileText size={13} /> OPEN REPORT
            </button>
          </div>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 5, padding: 18 }}>
          <div style={{ fontSize: 11, color: C.text3, letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 12 }}>Assurance profile</div>
          <div style={{ fontSize: 15, color: C.text1, fontWeight: 800, lineHeight: 1.45 }}>{ASSURANCE_PROFILE.label}</div>
          <div style={{ fontSize: 12.5, color: C.text2, lineHeight: 1.6, marginTop: 10 }}>
            {profileOpen
              ? ASSURANCE_PROFILE.scope_note
              : 'For CDN, edge, cybersecurity, cloud, or critical digital infrastructure SaaS providers where AI features may support security operations.'}
          </div>
          <button onClick={() => setProfileOpen(v => !v)} style={{ marginTop: 8, background: 'transparent', border: 'none', color: C.amber, cursor: 'pointer', fontSize: 12, fontWeight: 800 }}>
            {profileOpen ? 'collapse' : 'expand'}
          </button>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
        <Metric C={C} label="Technique clusters" value={clusters.length} detail="Attack families available" />
        <Metric C={C} label="Probe cases" value={clusters.reduce((sum, cluster) => sum + cluster.payloads.length, 0)} detail="From local payload schema" />
        <Metric C={C} label="Local findings" value={findings.length} detail="Stored in this browser" />
        <Metric C={C} label="Controls" value={controls.length} detail="ELICIT control library" />
      </section>

      <section className="home-hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, .9fr)', gap: 14 }}>
        <Panel C={C} title="Past Cases / Evidence Dossiers" icon={<FolderOpen size={13} />}>
          {cases.length === 0 ? (
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ fontSize: 13, color: C.text3, lineHeight: 1.55 }}>No previous cases yet.</div>
              <button onClick={onEnter} style={{ ...ghostButton(C), justifyContent: 'center' }}>
                START YOUR FIRST INVESTIGATION <ChevronRight size={13} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {cases.slice(0, 6).map(item => (
                <button key={item.caseFileId} onClick={onReport} style={{ textAlign: 'left', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 4, padding: '10px 12px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, color: C.amber, fontWeight: 800 }}>{item.caseFileId}</span>
                    <span style={{ fontSize: 12, color: C.text3 }}>{item.count} finding{item.count !== 1 ? 's' : ''}</span>
                    <span style={{ fontSize: 12, color: C.text3, marginLeft: 'auto' }}>{new Date(item.latestTimestamp).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 7 }}>
                    {Object.entries(item.verdictCounts).map(([verdict, count]) => (
                      <span key={verdict} style={{ fontSize: 11, color: getVerdictColor(verdict, C), border: `1px solid ${getVerdictColor(verdict, C)}55`, padding: '1px 5px', borderRadius: 2 }}>
                        {getVerdictLabel(verdict)} {count}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Panel>

        <Panel C={C} title="Frameworks" icon={<ShieldCheck size={13} />}>
          <div style={{ display: 'grid', gap: 8 }}>
            {frameworkFamilies.map(([label, count, detail]) => (
              <div key={label} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 4, padding: '9px 10px' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, color: C.text1, fontWeight: 800 }}>{label}</span>
                  <span style={{ fontSize: 11, color: C.text3 }}>{count} refs</span>
                </div>
                <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.45, marginTop: 3 }}>{detail}</div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <Panel C={C} title="Control Library" icon={<ShieldCheck size={13} />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
          {controls.map(control => (
            <div key={control.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 4, padding: '10px 11px' }}>
              <div style={{ fontSize: 11, color: C.amber, letterSpacing: 1, fontWeight: 800 }}>{control.id}</div>
              <div style={{ fontSize: 13, color: C.text1, fontWeight: 800, marginTop: 3 }}>{control.name}</div>
              <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{control.domain}</div>
              <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.45, marginTop: 7 }}>{control.objective}</div>
            </div>
          ))}
        </div>
      </Panel>
    </main>
  );
}

function Metric({ C, label, value, detail }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: `2px solid ${C.amberDim}`, borderRadius: 4, padding: '12px 14px' }}>
      <div style={{ fontSize: 24, color: C.amber, fontWeight: 900 }}>{value}</div>
      <div style={{ fontSize: 11, color: C.text3, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 12, color: C.text2, marginTop: 5 }}>{detail}</div>
    </div>
  );
}

function Panel({ C, title, icon, children }) {
  return (
    <section style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 5, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: C.text2, letterSpacing: 1.3, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>
        {icon} {title}
      </div>
      {children}
    </section>
  );
}

function primaryButton(C) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    padding: '11px 15px',
    background: C.amber,
    color: C.ink,
    border: `1px solid ${C.amber}`,
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.4,
  };
}

function ghostButton(C) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    padding: '11px 15px',
    background: 'transparent',
    color: C.text2,
    border: `1px solid ${C.borderHi}`,
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
  };
}
