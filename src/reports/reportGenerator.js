import { CONTROL_SET, CONTROL_SET_VERSION, FRAMEWORK_REFERENCES, getMappedControls } from '../data/frameworkMappings';

const truncate = (value = '', max = 1800) => {
  const text = String(value || '');
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

const list = (items = []) => items.length ? items.map(item => `- ${item}`).join('\n') : '- None recorded';

const controlList = (ids = []) => {
  const controls = getMappedControls(ids);
  return controls.length
    ? controls.map(c => `- ${c.id} — ${c.name}: ${c.objective}`).join('\n')
    : '- None mapped';
};

const frameworkList = (finding = {}) => {
  const lines = [];
  if (finding.techniqueId) lines.push(`- MITRE ATLAS: ${finding.techniqueId} — ${finding.techniqueName || FRAMEWORK_REFERENCES.mitre_atlas[finding.techniqueId] || 'Mapped technique'}`);
  if (finding.owasp) lines.push(`- OWASP LLM Top 10: ${finding.owasp} — ${FRAMEWORK_REFERENCES.owasp[finding.owasp] || 'Mapped risk category'}`);
  (finding.nistAiRmf || finding.nist_ai_rmf || []).forEach(fn => lines.push(`- NIST AI RMF: ${fn}`));
  (finding.euAiActRelevance || finding.eu_ai_act_relevance || []).forEach(article => lines.push(`- EU AI Act relevance: ${article} — ${FRAMEWORK_REFERENCES.eu_ai_act[article] || 'Relevant obligation if system is in scope'}`));
  return lines.length ? lines.join('\n') : '- None mapped';
};

export function buildFindingMarkdown(finding) {
  const controls = finding.mappedControls || finding.mapped_controls || [];
  return `## Finding: ${finding.payloadName || finding.caseName || 'Untitled Evaluation Case'}

**Verdict:** ${finding.verdict || 'Unknown'}  
**Review Status:** ${finding.reviewStatus || 'Not recorded'}  
**Verdict Source:** ${finding.finalVerdictSource || 'Not recorded'}  
**Severity:** ${finding.severity || 'Not assessed'}  
**Confidence:** ${finding.confidence || 'Not assessed'}  
**Test Case:** ${finding.caseId || finding.payloadId || 'custom'}  
**Technique:** ${finding.techniqueId || 'Unmapped'} — ${finding.techniqueName || ''}  
**OWASP:** ${finding.owasp || 'Unmapped'}  
**Victim Model:** ${finding.victimModel || 'Not recorded'}  
**Timestamp:** ${finding.timestamp || 'Not recorded'}

### Objective
${finding.objective || 'Not recorded'}

### Expected Secure Behavior
${finding.expectedSecureBehavior || finding.expected_secure_behavior || 'Not recorded'}

### Failure Mode
${finding.failureMode || finding.failure_mode || 'Not recorded'}

### Evidence Excerpt
> ${truncate(finding.evidenceExcerpt || finding.responseExcerpt || finding.response || '', 1000).replace(/\n/g, '\n> ')}

### Evaluation Rationale
- Heuristic Verdict: ${finding.heuristicVerdict || 'Not recorded'}${finding.heuristicLabel ? ` (${finding.heuristicLabel})` : ''}
- Heuristic Rationale: ${finding.evalReason || 'Not recorded'}
- LLM Judge Verdict: ${finding.judgeVerdict || 'Not used'}
- LLM Judge Rationale: ${finding.judgeRationale || finding.judgeReason || 'Not used or not recorded'}
- Evaluation Disagreement: ${finding.evaluationDisagreement ? 'Yes — manual review required' : 'No material disagreement recorded'}
- Evaluation Note: ${finding.evaluationNote || 'None'}
- False Positive Risk: ${finding.falsePositiveRisk || 'Not assessed'}

### Impacted Controls
${controlList(controls)}

### Framework Relevance
${frameworkList(finding)}

### Prompt Payload
\`\`\`text
${truncate(finding.payload || '', 1800)}
\`\`\`

### Response Evidence
\`\`\`text
${truncate(finding.responseFull || finding.response || '', 2500)}
\`\`\`
`;
}

export function generateAssessmentReport(findings = [], metadata = {}) {
  const date = new Date().toISOString();
  const successful = findings.filter(f => ['SUCCESS', 'PARTIAL'].includes(f.verdict)).length;
  const controlIds = [...new Set(findings.flatMap(f => f.mappedControls || f.mapped_controls || []))];
  const controls = controlIds.map(id => CONTROL_SET[id]).filter(Boolean);

  return `# LLM Adversarial Evaluation Report

Generated: ${date}  
Assessment ID: ${metadata.assessmentId || `assessment-${date.slice(0, 10)}`}  
Control Set Version: ${CONTROL_SET_VERSION}

## Executive Summary

This report summarizes locally executed adversarial evaluation cases against one or more browser-hosted LLMs. The lab treats findings as **evidence indicators**: a successful or partial adversarial result indicates a potential control weakness that should be reviewed, reproduced, remediated, and retested. Framework mappings are provided for traceability and do not constitute legal, audit, or certification conclusions.

- Findings logged: ${findings.length}
- Successful or partial findings: ${successful}
- Unique impacted controls: ${controlIds.length}

## Scope and Methodology

The evaluation workflow is:

1. Select a victim system prompt and local WebLLM model.
2. Run a structured adversarial evaluation case.
3. Capture the model response and local heuristic result.
4. Optionally run a separate local judge model.
5. Log the finding with evidence, severity, confidence, control mapping, and framework relevance.

## Impacted Control Summary

${controls.length ? controls.map(c => `- ${c.id} — ${c.name} (${c.domain})`).join('\n') : '- No mapped controls recorded'}

## Findings

${findings.length ? findings.map(buildFindingMarkdown).join('\n---\n\n') : 'No findings logged.'}

## Limitations

- This lab evaluates local model behavior and does not prove exploitability against production systems.
- Results can vary by model, quantization, prompt, temperature, context, and runtime.
- The heuristic evaluator is triage-oriented; \`REVIEW\` or \`PARTIAL\` should not be treated as a final pass/fail conclusion.
- LLM-as-judge mode can introduce evaluator bias or prompt-injection risk; judge outputs should be treated as supporting evidence, not ground truth.
- Material disagreement between heuristic and judge results is intentionally preserved as a manual-review signal.
- EU AI Act references are relevance mappings only and depend on system role, risk classification, and jurisdictional scope.
`;
}

export function downloadMarkdown(filename, markdown) {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
