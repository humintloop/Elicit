import { useState } from 'react';
import { Trash2, ChevronUp, ChevronRight } from 'lucide-react';
import { getVerdictColor, getVerdictLabel } from './VerdictBanner';
import { getMitigationMapping } from '../data/mitigationMappings';
import { CONTROL_SET } from '../data/frameworkMappings';
import FrameworkMappingExplainer from './FrameworkMappingExplainer';

const dispositionHelp = {
  UNREVIEWED: 'Not reviewed by a human yet',
  CONFIRMED: 'Attack worked; finding is valid',
  MITIGATED: 'Fix applied or control strengthened',
  NEEDS_RETEST: 'Queue for another run',
  FALSE_POSITIVE: 'Heuristic was wrong; mark as noise',
  ACCEPTED_RISK: 'Documented and accepted as-is',
};

const effectivenessOptions = [
  { value: 'ABSENT', label: 'ABSENT', help: 'Control does not exist or was never implemented', colorKey: 'red' },
  { value: 'INEFFECTIVE', label: 'INEFFECTIVE', help: 'Control exists but failed completely under testing', colorKey: 'amber' },
  { value: 'PARTIAL', label: 'PARTIAL', help: 'Control exists and partially functions but has exploitable gaps', colorKey: 'ochre' },
];

const normalizeEffectiveness = value => {
  if (value === 'PARTIALLY_EFFECTIVE') return 'PARTIAL';
  if (value === 'EFFECTIVE') return '';
  return value || '';
};

const effectivenessColorFor = (C, value) => {
  if (value === 'ABSENT') return C.red;
  if (value === 'INEFFECTIVE') return C.amber;
  if (value === 'PARTIAL') return C.ochre || C.amberDim;
  return C.text3;
};

const draftGapStatement = (finding, effectiveness) => {
  const controlIds = finding.selectedControlIds || finding.mappedControls || finding.mapped_controls || [];
  const control = CONTROL_SET[controlIds[0]] || CONTROL_SET['LLM-EVAL-001'];
  const observed = (finding.responseFull || finding.response)
    ? 'produced behavior that requires reviewer assessment against the expected secure behavior'
    : 'has captured evidence requiring reviewer assessment';
  const technique = finding.payloadName || finding.techniqueName || finding.techniqueId || 'the selected probe';
  return `Control ${control.id} (${control.name}) requires the system to ${control.objective}. This probe demonstrates the system ${observed} under ${technique}, indicating the control is ${effectiveness.toLowerCase()}.`;
};

export default function FindingCard({ C, finding: f, auditorView, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState('evidence');
  const vc = getVerdictColor(f.verdict, C);
  const reviewerDecision = f.reviewerDecision || 'UNREVIEWED';
  const mitigation = getMitigationMapping(f.techniqueId);
  const officialMitigations = f.officialMitigations || f.official_mitigations || mitigation.official_mitigations || [];
  const recommendedMitigations = f.recommendedMitigations || f.recommended_mitigations || mitigation.recommended_mitigations || [];
  const retestGuidance = f.retestGuidance || f.retest_guidance || mitigation.retest_guidance || [];
  const assessedEffectiveness = normalizeEffectiveness(f.effectivenessAssessment || f.effectiveness_assessment);
  const effectiveness = assessedEffectiveness || 'NOT_ASSESSED';
  const effectivenessColor = effectivenessColorFor(C, assessedEffectiveness);
  const updateEffectiveness = (value) => onUpdate({
    effectivenessAssessment: value,
    controlGapStatement: f.controlGapStatement || draftGapStatement(f, value),
    reviewerReviewedAt: new Date().toISOString(),
  });

  const decisionColor = reviewerDecision === 'CONFIRMED' ? C.red : reviewerDecision === 'FALSE_POSITIVE' ? C.green : reviewerDecision === 'UNREVIEWED' ? C.amber : C.text2;
  const auditReady = Boolean(assessedEffectiveness && f.controlGapStatement);
  const hasRemediation = officialMitigations.length > 0 || recommendedMitigations.length > 0 || retestGuidance.length > 0;
  const tabs = [
    ['evidence', 'Evidence'],
    ['control', 'Control Impact'],
    hasRemediation && ['remediation', 'Remediation'],
    ['details', 'Details'],
  ].filter(Boolean);

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderLeft: `3px solid ${vc}`, borderRadius: 4, animation: 'fadeUp .2s ease' }}>
      {/* Summary row */}
      <div style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }} onClick={() => setExpanded(p => !p)}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: vc, fontWeight: 800, letterSpacing: .5 }}>{getVerdictLabel(f.verdict)}</span>
            <span style={{ fontSize: 11, color: C.text3, fontFamily: C.mono, padding: '1px 6px', background: C.bg, borderRadius: 2, border: `1px solid ${C.border}` }}>{f.techniqueId}</span>
            {f.owasp && <span style={{ fontSize: 11, color: C.text3, fontFamily: C.mono, padding: '1px 6px', background: C.bg, borderRadius: 2, border: `1px solid ${C.border}` }}>{f.owasp}</span>}
            <span style={{ fontSize: 13, color: C.text3, marginLeft: 'auto', whiteSpace: 'nowrap' }}>{new Date(f.timestamp).toLocaleDateString()}</span>
          </div>
          <div style={{ fontSize: 16, color: C.text1, fontWeight: 600, marginBottom: 6 }}>{f.payloadName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <StatusChip C={C} color={decisionColor} label={reviewerDecision.replaceAll('_', ' ')} />
            <StatusChip C={C} color={assessedEffectiveness ? effectivenessColor : C.text3} label={assessedEffectiveness ? effectiveness.replaceAll('_', ' ') : 'NOT ASSESSED'} outline />
            <StatusChip C={C} color={auditReady ? C.teal : C.amber} label={auditReady ? 'AUDIT-READY' : 'NEEDS REVIEW'} dot />
          </div>
        </div>
        <button style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: expanded ? C.surface : 'transparent', border: `1px solid ${C.borderHi}`, color: C.text2, fontSize: 12, fontWeight: 700, letterSpacing: .8, borderRadius: 3, cursor: 'pointer' }}>
          {expanded ? <>CLOSE <ChevronUp size={13} /></> : <>REVIEW <ChevronRight size={13} /></>}
        </button>
      </div>

      {expanded && (
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {/* Persistent review-action area */}
          <div style={{ padding: '14px 16px', background: C.bg, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 200, flex: '0 1 240px' }}>
                <FieldLabel C={C}>Reviewer decision</FieldLabel>
                <select value={reviewerDecision} onChange={e => onUpdate({ reviewerDecision: e.target.value, reviewerReviewedAt: new Date().toISOString() })}
                  style={{ width: '100%', background: C.surface, border: `1px solid ${C.borderHi}`, color: C.text1, fontSize: 14, padding: '7px 9px', borderRadius: 3, fontFamily: C.sans }}>
                  <option value="UNREVIEWED">Unreviewed</option>
                  <option value="CONFIRMED">Confirm finding</option>
                  <option value="MITIGATED">Mitigated</option>
                  <option value="NEEDS_RETEST">Needs retest</option>
                  <option value="FALSE_POSITIVE">False positive</option>
                  <option value="ACCEPTED_RISK">Accept risk</option>
                </select>
                <div style={{ fontSize: 12, color: C.text3, lineHeight: 1.4, marginTop: 5 }}>{dispositionHelp[reviewerDecision]}</div>
              </div>
              <div style={{ flex: '1 1 320px' }}>
                <FieldLabel C={C}>Effectiveness assessment</FieldLabel>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {effectivenessOptions.map(option => {
                    const color = C[option.colorKey] || C.amber;
                    const active = assessedEffectiveness === option.value;
                    return (
                      <button key={option.value} onClick={() => updateEffectiveness(option.value)} title={option.help} style={{
                        background: active ? `${color}22` : C.surface,
                        border: `1px solid ${active ? color : C.borderHi}`,
                        color: active ? color : C.text2,
                        borderRadius: 3, padding: '7px 11px', cursor: 'pointer',
                        fontSize: 11, fontWeight: 800, letterSpacing: 1, fontFamily: C.mono,
                      }}>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                <div style={{ fontSize: 12, color: C.text3, lineHeight: 1.4, marginTop: 5 }}>Required before this finding is audit-ready.</div>
              </div>
            </div>

            <div>
              <FieldLabel C={C}>Control gap statement</FieldLabel>
              <textarea
                value={f.controlGapStatement || ''}
                onChange={e => onUpdate({ controlGapStatement: e.target.value })}
                placeholder="Select an effectiveness assessment to draft the governance translation."
                rows={3}
                style={{ width: '100%', background: C.surface, border: `1px solid ${C.borderHi}`, color: C.text1, fontSize: 13, padding: '8px 10px', lineHeight: 1.55, resize: 'vertical', borderRadius: 3, fontFamily: C.sans }}
              />
            </div>

            <div>
              <FieldLabel C={C}>Reviewer notes</FieldLabel>
              <textarea value={f.reviewerNotes || ''} onChange={e => onUpdate({ reviewerNotes: e.target.value, notes: e.target.value })}
                placeholder="Add reviewer rationale, retest result, or disposition…" rows={2}
                style={{ width: '100%', background: C.surface, border: `1px solid ${C.borderHi}`, color: C.text1, fontSize: 13, padding: '8px 10px', lineHeight: 1.5, resize: 'vertical', borderRadius: 3, fontFamily: C.sans }} />
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2, padding: '0 12px', borderBottom: `1px solid ${C.border}`, background: C.panel }}>
            {tabs.map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
                color: tab === id ? C.text1 : C.text3, fontSize: 12.5, fontWeight: tab === id ? 700 : 500,
                borderBottom: `2px solid ${tab === id ? C.amber : 'transparent'}`, marginBottom: -1,
              }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tab === 'evidence' && (
              <>
                <Block C={C} label="PAYLOAD" mono>{f.payload}</Block>
                <Block C={C} label="RESPONSE EXCERPT" mono bright>{f.response}</Block>
                {f.evaluationDisagreement && (
                  <div style={{ background: C.amberBg, border: `1px solid ${C.amber}40`, padding: '9px 11px', borderRadius: 3 }}>
                    <div style={{ fontSize: 12, color: C.amber, letterSpacing: 1, marginBottom: 4, fontWeight: 800 }}>EVALUATORS DISAGREE</div>
                    <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.45 }}>{f.evaluationNote}</div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 240px' }}>
                    <FieldLabel C={C}>Heuristic{f.heuristicVerdict ? ` · ${getVerdictLabel(f.heuristicVerdict)}` : ''}</FieldLabel>
                    <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.5 }}>{f.evalReason}</div>
                  </div>
                  {f.judgeReason && (
                    <div style={{ flex: '1 1 240px' }}>
                      <FieldLabel C={C}>LLM judge{f.judgeVerdict ? ` · ${getVerdictLabel(f.judgeVerdict)}` : ''}</FieldLabel>
                      <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.5 }}>{f.judgeReason}</div>
                    </div>
                  )}
                </div>
              </>
            )}

            {tab === 'control' && (
              <>
                {auditorView && (
                  <div style={{ background: C.amberBg, border: `1px solid ${C.amber}44`, borderLeft: `3px solid ${C.amber}`, borderRadius: 3, padding: '11px 13px' }}>
                    <div style={{ fontSize: 12, color: C.amber, letterSpacing: 1, fontWeight: 800, marginBottom: 8 }}>AUDITOR VIEW</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8, marginBottom: 8 }}>
                      <Mini C={C} label="System" value={f.systemUnderTest || 'Not recorded'} />
                      <Mini C={C} label="Prompt hash" value={f.promptHash || 'Not recorded'} />
                      <Mini C={C} label="Control" value={(f.selectedControlIds || f.mappedControls || []).join(', ') || 'Not recorded'} />
                      <Mini C={C} label="Effectiveness" value={effectiveness.replaceAll('_', ' ')} />
                    </div>
                    <Block C={C} label="CONTROL GAP STATEMENT" bright>{f.controlGapStatement || 'Control gap statement not completed — finding is not audit-ready.'}</Block>
                  </div>
                )}
                <FrameworkMappingExplainer
                  C={C}
                  techniqueId={f.techniqueId}
                  techniqueName={f.techniqueName}
                  owasp={f.owasp}
                  finding={f}
                />
                {f.readinessGaps?.length > 0 && <ListBlock C={C} label="READINESS GAPS" items={f.readinessGaps} />}
              </>
            )}

            {tab === 'remediation' && (
              <>
                {officialMitigations.length > 0 && <ListBlock C={C} label="OFFICIAL MITIGATION REFERENCES" items={officialMitigations.map(i => `${i.source}: ${i.id} — ${i.name}`)} />}
                {recommendedMitigations.length > 0 && <ListBlock C={C} label="ELICIT RECOMMENDED ACTIONS" items={recommendedMitigations} />}
                {retestGuidance.length > 0 && <ListBlock C={C} label="RETEST GUIDANCE" items={retestGuidance} />}
              </>
            )}

            {tab === 'details' && (
              <>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {f.caseFileId && <span style={{ fontSize: 12, color: C.text3, fontFamily: C.mono, background: C.bg, border: `1px solid ${C.border}`, padding: '3px 7px', borderRadius: 2 }}>CASE {f.caseFileId}</span>}
                  {f.runId && <span style={{ fontSize: 12, color: C.text3, fontFamily: C.mono, background: C.bg, border: `1px solid ${C.border}`, padding: '3px 7px', borderRadius: 2 }}>RUN {f.runId}</span>}
                  {f.reviewerReviewedAt && <span style={{ fontSize: 12, color: C.text3, background: C.bg, border: `1px solid ${C.border}`, padding: '3px 7px', borderRadius: 2 }}>REVIEWED {new Date(f.reviewerReviewedAt).toLocaleString()}</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8 }}>
                  <Mini C={C} label="Model" value={f.victimModel?.split('-q')[0] || 'Not recorded'} />
                  {f.analyst && <Mini C={C} label="Analyst" value={f.analyst} />}
                  <Mini C={C} label="Logged" value={new Date(f.timestamp).toLocaleString()} />
                </div>
                <button onClick={onDelete} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'transparent', border: `1px solid ${C.red}44`, color: C.red, fontSize: 12, cursor: 'pointer', letterSpacing: 1, borderRadius: 3, fontWeight: 700 }}>
                  <Trash2 size={11} /> DELETE FINDING
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusChip({ C, color, label, outline, dot }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color,
      background: outline ? 'transparent' : `${color}1A`,
      border: `1px solid ${color}${outline ? '55' : '33'}`,
      padding: '2px 8px', borderRadius: 3, fontWeight: 700, letterSpacing: .5,
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: 999, background: color }} />}
      {label}
    </span>
  );
}

function FieldLabel({ C, children }) {
  return <div style={{ fontSize: 11, color: C.text3, letterSpacing: 1.2, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>{children}</div>;
}

function Block({ C, label, children, mono, bright }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: C.text3, letterSpacing: 1.2, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: mono ? 13 : 14, color: bright ? C.text1 : C.text2, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 3, padding: '9px 11px', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: mono ? C.mono : C.sans }}>{children}</div>
    </div>
  );
}

function ListBlock({ C, label, items }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: C.text3, letterSpacing: 1.2, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13.5, color: C.text2, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 3, padding: '9px 11px', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item, idx) => <div key={idx} style={{ display: 'flex', gap: 7 }}><span style={{ color: C.text3 }}>·</span><span>{item}</span></div>)}
      </div>
    </div>
  );
}

function Mini({ C, label, value }) {
  return (
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, padding: '8px 9px', borderRadius: 3 }}>
      <div style={{ fontSize: 10, color: C.text3, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 12.5, color: C.text1, lineHeight: 1.4, wordBreak: 'break-word' }}>{value}</div>
    </div>
  );
}
