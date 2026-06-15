// Framework and control mapping metadata used by the lab and report generator.
// These mappings are designed as traceability aids, not legal or certification conclusions.

export const CONTROL_SET_VERSION = '0.1.0';
export const FRAMEWORK_MAPPING_VERSION = '0.2.0';

export const ASSURANCE_PROFILE = {
  id: 'saas-critical-digital-infrastructure-readiness',
  label: 'SaaS / Critical Digital Infrastructure Readiness',
  company_category: 'AI-enabled SaaS, cybersecurity, edge, cloud, or critical digital infrastructure provider',
  scope_note: 'Use this profile for CDN, edge, cybersecurity, cloud, or critical digital infrastructure SaaS providers where AI features may support SaaS, security, network, cloud, or critical digital infrastructure operations. EU AI Act high-risk relevance depends on the actual system role, intended purpose, jurisdiction, and whether the AI system is used as a safety component. Cybersecurity-only components are not automatically safety components.',
  eu_ai_act_scope: {
    default_status: 'conditional-readiness',
    classification_required: true,
    note: 'Treat EU AI Act mappings as readiness prompts until the assessed AI system has a documented intended purpose, role, jurisdiction, and high-risk classification decision.',
  },
};

export const CONTROL_SET = {
  'LLM-GOV-001': {
    id: 'LLM-GOV-001',
    name: 'AI System Inventory & Use-Case Classification',
    domain: 'AI Governance',
    objective: 'Maintain an inventory of LLM-enabled features, data flows, model/provider dependencies, tool access, and intended use cases so risk can be assessed at the system level.',
  },
  'LLM-GOV-002': {
    id: 'LLM-GOV-002',
    name: 'AI Threat Modeling',
    domain: 'AI Governance',
    objective: 'Identify reasonably foreseeable misuse, adversarial inputs, abuse paths, and control assumptions for LLM-enabled systems before deployment and after material changes.',
  },
  'LLM-SEC-001': {
    id: 'LLM-SEC-001',
    name: 'Prompt Injection Resistance',
    domain: 'LLM Application Security',
    objective: 'Design, test, and monitor LLM-enabled systems to resist direct and indirect prompt injection that could override intended instructions, alter behavior, disclose sensitive information, or trigger unauthorized actions.',
  },
  'LLM-SEC-002': {
    id: 'LLM-SEC-002',
    name: 'System Prompt Leakage Prevention',
    domain: 'LLM Application Security',
    objective: 'Avoid storing secrets or authorization logic in system prompts, and test whether model outputs expose hidden instructions, policy structure, internal rules, or sensitive operational details.',
  },
  'LLM-SEC-003': {
    id: 'LLM-SEC-003',
    name: 'RAG and External Content Trust Boundaries',
    domain: 'LLM Application Security',
    objective: 'Treat retrieved documents, web content, emails, tickets, and tool outputs as untrusted data, not instructions, and validate behavior under indirect prompt-injection conditions.',
  },
  'LLM-SEC-004': {
    id: 'LLM-SEC-004',
    name: 'Tool-Use Authorization & Containment',
    domain: 'Agentic AI Security',
    objective: 'Ensure tools, plugins, agents, and workflow actions are authorized through deterministic controls outside the LLM and constrained by least privilege.',
  },
  'LLM-SEC-005': {
    id: 'LLM-SEC-005',
    name: 'Sensitive Data Handling',
    domain: 'Data Protection',
    objective: 'Prevent exposure of customer data, secrets, credentials, internal policies, system prompts, and regulated data through prompts, context, logs, model responses, or tool outputs.',
  },
  'LLM-EVAL-001': {
    id: 'LLM-EVAL-001',
    name: 'Adversarial Evaluation & Regression Testing',
    domain: 'AI Evaluation',
    objective: 'Run adversarial test cases before release and after changes to prompts, models, tools, retrieval sources, policies, or guardrails; track results over time.',
  },
  'LLM-EVAL-002': {
    id: 'LLM-EVAL-002',
    name: 'Evaluation Evidence Retention',
    domain: 'AI Evaluation',
    objective: 'Retain sufficient evidence indicators to support review and retesting, including test case ID, model/runtime, prompt, response excerpt, evaluator outputs, and mapped controls.',
  },
  'LLM-MON-001': {
    id: 'LLM-MON-001',
    name: 'AI Output Monitoring & Incident Detection',
    domain: 'AI Operations',
    objective: 'Monitor production outputs and telemetry for prompt injection, system prompt leakage, unauthorized tool-use attempts, sensitive-data exposure, and unexpected model behavior.',
  },
  'LLM-OPS-001': {
    id: 'LLM-OPS-001',
    name: 'AI Incident Response',
    domain: 'AI Operations',
    objective: 'Define triage, containment, remediation, disclosure, and retesting procedures for LLM incidents such as prompt injection, leakage, tool abuse, or unsafe model behavior.',
  },
  'LLM-TPRM-001': {
    id: 'LLM-TPRM-001',
    name: 'AI Vendor / Model Provider Risk',
    domain: 'Third-Party Risk',
    objective: 'Assess model providers, hosted inference APIs, AI-enabled vendors, and plugins for AI-specific security, data protection, logging, transparency, and incident-response requirements.',
  },
};

export const FRAMEWORK_REFERENCES = {
  owasp: {
    'LLM01:2025': 'Prompt Injection',
    'LLM02:2025': 'Sensitive Information Disclosure',
    'LLM06:2025': 'Excessive Agency',
    'LLM07:2025': 'System Prompt Leakage',
    'LLM08:2025': 'Vector and Embedding Weaknesses',
  },
  mitre_atlas: {
    'AML.T0051': 'LLM Prompt Injection',
    'AML.T0051.000': 'LLM Prompt Injection: Direct',
    'AML.T0051.001': 'LLM Prompt Injection: Indirect',
    'AML.T0051.DC': 'Delimiter Confusion (local variant of AML.T0051)',
    'AML.T0054': 'LLM Jailbreak',
    'AML.T0056': 'Extract LLM System Prompt',
  },
  nist_ai_rmf: {
    Govern: 'Cross-cutting AI risk governance roles, policies, accountability, and risk culture.',
    Map: 'Context, intended purpose, risk identification, and system impact understanding.',
    Measure: 'Analysis, assessment, testing, benchmarking, and monitoring of AI risks.',
    Manage: 'Risk response, prioritization, treatment, documentation, and continuous improvement.',
  },
  eu_ai_act: {
    'Article 9': 'Risk management system for high-risk AI systems.',
    'Article 12': 'Record-keeping and logging capabilities for high-risk AI systems.',
    'Article 14': 'Human oversight for high-risk AI systems.',
    'Article 15': 'Accuracy, robustness, and cybersecurity for high-risk AI systems.',
    'Article 17': 'Quality management system for high-risk AI system providers.',
    'Article 72': 'Post-market monitoring by providers and post-market monitoring plan for high-risk AI systems.',
    'Annex III.2': 'Critical infrastructure category, including safety components in management and operation of critical digital infrastructure where in scope.',
  },
  iso_42001: {
    'Clause 9.1': 'Monitoring, measurement, analysis, and evaluation of the AI management system and AI-related performance.',
    'Clause 9.2': 'Internal audit evidence for whether AI management system requirements and organizational requirements are met.',
    'Clause 9.3': 'Management review inputs for AI management system suitability, adequacy, effectiveness, risks, opportunities, and improvement.',
  },
};

export const TECHNIQUE_CONTROL_MAP = {
  'AML.T0051': {
    controls: ['LLM-SEC-001', 'LLM-GOV-002', 'LLM-EVAL-001', 'LLM-EVAL-002'],
    nist_ai_rmf: ['Map', 'Measure', 'Manage', 'Govern'],
    eu_ai_act_relevance: ['Article 9', 'Article 12', 'Article 14', 'Article 15', 'Article 17', 'Article 72'],
    eu_ai_act_scope: 'conditional-readiness',
    iso_42001_relevance: ['Clause 9.1', 'Clause 9.2', 'Clause 9.3'],
    readiness_gaps: [
      'Monitoring and measurement gap: successful or partial prompt injection suggests the control may be ineffective or degrading and should be tracked as evaluation evidence.',
      'Robustness and cybersecurity gap: adversarial input may alter system behavior outside the intended instruction hierarchy.',
      'Audit and management-review input: repeated findings should feed internal audit scope, risk treatment decisions, and management review.',
    ],
  },
  'AML.T0051.001': {
    controls: ['LLM-SEC-001', 'LLM-SEC-003', 'LLM-GOV-002', 'LLM-EVAL-001', 'LLM-MON-001'],
    nist_ai_rmf: ['Map', 'Measure', 'Manage', 'Govern'],
    eu_ai_act_relevance: ['Article 9', 'Article 12', 'Article 14', 'Article 15', 'Article 17', 'Article 72'],
    eu_ai_act_scope: 'conditional-readiness',
    iso_42001_relevance: ['Clause 9.1', 'Clause 9.2', 'Clause 9.3'],
    readiness_gaps: [
      'External-content trust-boundary gap: retrieved or processed content may be treated as instruction rather than untrusted evidence.',
      'Post-market monitoring gap: indirect attacks are likely to appear through real documents, tickets, webpages, or tool outputs and need operational detection paths.',
      'Management-review input: repeated indirect-injection findings indicate a systemic RAG, tool-output, or content-processing control weakness.',
    ],
  },
  'AML.T0051.DC': {
    controls: ['LLM-SEC-001', 'LLM-EVAL-001', 'LLM-EVAL-002'],
    nist_ai_rmf: ['Measure', 'Manage'],
    eu_ai_act_relevance: ['Article 9', 'Article 12', 'Article 15', 'Article 72'],
    eu_ai_act_scope: 'conditional-readiness',
    iso_42001_relevance: ['Clause 9.1', 'Clause 9.2'],
    readiness_gaps: [
      'Interface and parsing gap: message formatting or delimiter handling may allow user-controlled text to appear authoritative.',
      'Traceability gap: evidence should preserve exact input boundaries, output, and parser assumptions for audit and retest.',
    ],
  },
  'AML.T0054': {
    controls: ['LLM-SEC-001', 'LLM-GOV-002', 'LLM-EVAL-001', 'LLM-MON-001'],
    nist_ai_rmf: ['Map', 'Measure', 'Manage'],
    eu_ai_act_relevance: ['Article 9', 'Article 14', 'Article 15', 'Article 17', 'Article 72'],
    eu_ai_act_scope: 'conditional-readiness',
    iso_42001_relevance: ['Clause 9.1', 'Clause 9.2', 'Clause 9.3'],
    readiness_gaps: [
      'Risk-treatment gap: jailbreak success suggests intended constraints are not reliably enforced by the current prompt, model, or guardrail design.',
      'Human-oversight gap: high-impact uses may require reviewer intervention, escalation criteria, or deterministic controls outside the model.',
      'Management-review input: jailbreak trend data should inform risk appetite, release gates, and control improvement decisions.',
    ],
  },
  'AML.T0056': {
    controls: ['LLM-SEC-002', 'LLM-SEC-005', 'LLM-EVAL-001', 'LLM-EVAL-002'],
    nist_ai_rmf: ['Map', 'Measure', 'Manage'],
    eu_ai_act_relevance: ['Article 9', 'Article 12', 'Article 15', 'Article 17', 'Article 72'],
    eu_ai_act_scope: 'conditional-readiness',
    iso_42001_relevance: ['Clause 9.1', 'Clause 9.2', 'Clause 9.3'],
    readiness_gaps: [
      'Evidence-retention gap: prompt or policy leakage should be captured with enough context for review while minimizing sensitive content.',
      'Robustness and cybersecurity gap: sensitive operational logic in prompts may be exposed or bypassed by adversarial interaction.',
      'Management-review input: leakage findings should drive prompt-content minimization, data-handling review, and control owner action.',
    ],
  },
};

export function getMappedControls(controlIds = []) {
  return controlIds.map(id => CONTROL_SET[id]).filter(Boolean);
}

export function getTechniqueMapping(techniqueId) {
  return TECHNIQUE_CONTROL_MAP[techniqueId] || {
    controls: ['LLM-EVAL-001', 'LLM-EVAL-002'],
    nist_ai_rmf: ['Measure'],
    eu_ai_act_relevance: [],
    eu_ai_act_scope: 'not-assessed',
    iso_42001_relevance: ['Clause 9.1'],
    readiness_gaps: ['Evaluation evidence should be reviewed against the AI management system monitoring and measurement process.'],
  };
}

export function buildCaseMapping(techniqueId, overrides = {}) {
  const base = getTechniqueMapping(techniqueId);
  return {
    mapped_controls: overrides.mapped_controls || base.controls,
    nist_ai_rmf: overrides.nist_ai_rmf || base.nist_ai_rmf,
    eu_ai_act_relevance: overrides.eu_ai_act_relevance || base.eu_ai_act_relevance,
    eu_ai_act_scope: overrides.eu_ai_act_scope || base.eu_ai_act_scope || ASSURANCE_PROFILE.eu_ai_act_scope.default_status,
    iso_42001_relevance: overrides.iso_42001_relevance || base.iso_42001_relevance,
    readiness_profile: overrides.readiness_profile || ASSURANCE_PROFILE.id,
    readiness_gaps: overrides.readiness_gaps || base.readiness_gaps,
  };
}
