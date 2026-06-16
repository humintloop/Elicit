import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { getVerdictColor, getVerdictLabel } from './VerdictBanner';
import { getMitigationMapping } from '../data/mitigationMappings';

const dispositionHelp = {
  UNREVIEWED: 'Not reviewed by a human yet',
  CONFIRMED: 'Attack worked; finding is valid',
  MITIGATED: 'Fix applied or control strengthened',
  NEEDS_RETEST: 'Queue for another run',
  FALSE_POSITIVE: 'Heuristic was wrong; mark as noise',
  ACCEPTED_RISK: 'Documented and accepted as-is',
};

const reviewStatusLabel = (status = '') => String(status)
  .replace('REVIEW_REQUIRED', 'REVIEW REQUIRED')
  .replace('NEEDS_REVIEW', 'NEEDS REVIEW')
  .replace('AUTO_TRIAGED', 'AUTO TRIAGED')
  .replaceAll('_', ' ');

export default function FindingCard({ C, finding: f, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [frameworkOpen, setFrameworkOpen] = useState(false);
  const vc = getVerdictColor(f.verdict, C);
  const reviewerDecision = f.reviewerDecision || 'UNREVIEWED';
  const mitigation = getMitigationMapping(f.techniqueId);
  const officialMitigations = f.officialMitigations || f.official_mitigations || mitigation.official_mitigations || [];
  const recommendedMitigations = f.recommendedMitigations || f.recommended_mitigations || mitigation.recommended_mitigations || [];
  const retestGuidance = f.retestGuidance || f.retest_guidance || mitigation.retest_guidance || [];

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderLeft: `3px solid ${vc}`, borderRadius: 3, animation: 'fadeUp .2s ease' }}>
      <div style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10 }} onClick={() => setExpanded(p => !p)}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: vc, fontWeight: 700 }}>{getVerdictLabel(f.verdict)}</span>
            <span style={{ fontSize: 12, color: C.text2, background: C.hover, padding: '1px 6px', borderRadius: 2, border: `1px solid ${C.border}` }}>{f.techniqueId}</span>
            {f.owasp && <span style={{ fontSize: 12, color: C.text2, padding: '1px 6px', background: C.hover, borderRadius: 2 }}>{f.owasp}</span>}
            {f.reviewStatus && f.reviewStatus !== 'AUTO_TRIAGED' && <span style={{ fontSize: 12, color: f.reviewStatus === 'REVIEW_REQUIRED' ? C.amber : C.warmDim, padding: '1px 6px', background: C.hover, borderRadius: 2 }}>{reviewStatusLabel(f.reviewStatus)}</span>}
            <span style={{ fontSize: 12, color: reviewerDecision === 'CONFIRMED' ? C.red : reviewerDecision === 'FALSE_POSITIVE' ? C.green : C.text2, padding: '1px 6px', background: C.hover, borderRadius: 2 }}>{reviewerDecision.replaceAll('_', ' ')}</span>
            <span style={{ fontSize: 13, color: C.text3, marginLeft: 'auto' }}>{new Date(f.timestamp).toLocaleString()}</span>
          </div>
          <div style={{ fontSize: 15, color: C.text1, fontWeight: 600, marginBottom: 3 }}>{f.payloadName}</div>
          <div style={{ fontSize: 14, color: C.text2 }}>{f.victimModel?.split('-q')[0]}{f.analyst ? ` · ${f.analyst}` : ''}</div>
        </div>
        <div style={{ color: C.text3, flexShrink: 0 }}>{expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</div>
      </div>

      {expanded && (
        <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 220, flex: '0 1 280px' }}>
              <div style={{ fontSize: 13, color: C.text3, letterSpacing: 1, marginBottom: 4 }}>REVIEWER DECISION</div>
              <select value={reviewerDecision} onChange={e => onUpdate({ reviewerDecision: e.target.value, reviewerReviewedAt: new Date().toISOString() })}
                style={{ width: '100%', background: C.surface, border: `1px solid ${C.borderHi}`, color: C.text1, fontSize: 14, padding: '5px 8px', borderRadius: 2 }}>
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
              <div style={{ fontSize: 13, color: C.text3, letterSpacing: 1, marginBottom: 4 }}>REVIEWER NOTES</div>
              <textarea value={f.reviewerNotes || ''} onChange={e => onUpdate({ reviewerNotes: e.target.value, notes: e.target.value })}
                placeholder="Add reviewer rationale, retest result, or disposition…" rows={2}
                style={{ width: '100%', background: C.surface, border: `1px solid ${C.borderHi}`, color: C.text1, fontSize: 14, padding: '6px 8px', lineHeight: 1.45, resize: 'vertical', borderRadius: 2 }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {f.caseFileId && <span style={{ fontSize: 12, color: C.text3, background: C.bg, border: `1px solid ${C.border}`, padding: '2px 6px', borderRadius: 2 }}>CASE {f.caseFileId}</span>}
            {f.runId && <span style={{ fontSize: 12, color: C.text3, background: C.bg, border: `1px solid ${C.border}`, padding: '2px 6px', borderRadius: 2 }}>RUN {f.runId}</span>}
            {f.reviewerReviewedAt && <span style={{ fontSize: 12, color: C.text3, background: C.bg, border: `1px solid ${C.border}`, padding: '2px 6px', borderRadius: 2 }}>REVIEWED {new Date(f.reviewerReviewedAt).toLocaleString()}</span>}
          </div>

          <div style={{ border: `1px solid ${C.border}`, background: C.bg, borderRadius: 2 }}>
            <button onClick={() => setFrameworkOpen(p => !p)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 9px', background: 'transparent', border: 'none', color: C.text2, fontSize: 13, fontWeight: 700, letterSpacing: .6, cursor: 'pointer' }}>
              <span>Framework & compliance mapping · {f.techniqueId}{f.owasp ? ` · ${f.owasp}` : ''}</span>
              {frameworkOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {frameworkOpen && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '0 9px 9px' }}>
                {f.iso42001Relevance?.length > 0 && <span style={{ fontSize: 12, color: C.text3, border: `1px solid ${C.border}`, padding: '2px 6px', borderRadius: 2 }}>ISO {f.iso42001Relevance.join(', ')}</span>}
                {f.euAiActRelevance?.length > 0 && <span style={{ fontSize: 12, color: C.text3, border: `1px solid ${C.border}`, padding: '2px 6px', borderRadius: 2 }}>EU {f.euAiActRelevance.join(', ')}</span>}
                {f.mappedControls?.map((control, idx) => <span key={idx} style={{ fontSize: 12, color: C.text3, border: `1px solid ${C.border}`, padding: '2px 6px', borderRadius: 2 }}>{control}</span>)}
              </div>
            )}
          </div>

          <Block C={C} label="PAYLOAD" mono>{f.payload}</Block>
          <Block C={C} label="RESPONSE EXCERPT" mono bright>{f.response}</Block>
          {f.readinessGaps?.length > 0 && <ListBlock C={C} label="READINESS GAPS" items={f.readinessGaps} />}
          {officialMitigations.length > 0 && <ListBlock C={C} label="OFFICIAL MITIGATION REFERENCES" items={officialMitigations.map(i => `${i.source}: ${i.id} — ${i.name}`)} />}
          {recommendedMitigations.length > 0 && <ListBlock C={C} label="ELICIT RECOMMENDED ACTIONS" items={recommendedMitigations} />}
          {retestGuidance.length > 0 && <ListBlock C={C} label="RETEST GUIDANCE" items={retestGuidance} />}

          {f.evaluationDisagreement && (
            <div style={{ background: C.amberBg, border: `1px solid ${C.amber}40`, padding: '8px 10px', borderRadius: 2 }}>
              <div style={{ fontSize: 13, color: C.amber, letterSpacing: 1, marginBottom: 4, fontWeight: 700 }}>EVALUATION DISAGREEMENT</div>
              <div style={{ fontSize: 14, color: C.text2, lineHeight: 1.45 }}>{f.evaluationNote}</div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: C.text3, letterSpacing: 1, marginBottom: 4 }}>HEURISTIC</div>
              {(f.heuristicLabel || f.heuristicVerdict) && <div style={{ fontSize: 12, color: C.text2, marginBottom: 3 }}>{f.heuristicVerdict ? getVerdictLabel(f.heuristicVerdict) : 'HEURISTIC'}{f.heuristicLabel ? ` · ${f.heuristicLabel}` : ''}</div>}
              <div style={{ fontSize: 14, color: C.text2 }}>{f.evalReason}</div>
            </div>
            {f.judgeReason && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.text3, letterSpacing: 1, marginBottom: 4 }}>LLM JUDGE {f.judgeVerdict && `(${getVerdictLabel(f.judgeVerdict)})`}</div>
                <div style={{ fontSize: 14, color: C.text2 }}>{f.judgeReason}</div>
              </div>
            )}
          </div>

          <button onClick={onDelete} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'transparent', border: `1px solid ${C.border}`, color: C.text3, fontSize: 13, cursor: 'pointer', letterSpacing: 1, borderRadius: 2 }}>
            <Trash2 size={9} /> DELETE
          </button>
        </div>
      )}
    </div>
  );
}

function Block({ C, label, children, mono, bright }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: C.text3, letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, color: bright ? C.text1 : C.text2, background: C.bg, padding: '8px 10px', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: mono ? C.mono : 'inherit' }}>{children}</div>
    </div>
  );
}

function ListBlock({ C, label, items }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: C.text3, letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, color: C.text2, background: C.bg, padding: '8px 10px', lineHeight: 1.55 }}>
        {items.map((item, idx) => <div key={idx}>- {item}</div>)}
      </div>
    </div>
  );
}
