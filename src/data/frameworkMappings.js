// Framework and control mapping metadata used by the lab and report generator.
// These mappings are designed as traceability aids, not legal or certification conclusions.

export const CONTROL_SET_VERSION = '0.1.0';

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
    objective: 'Retain sufficient evidence to support review and retesting, including test case ID, model/runtime, prompt, response, judge verdict, severity, confidence, and remediation status.',
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
    'Article 14': 'Human oversight for high-risk AI systems.',
    'Article 15': 'Accuracy, robustness, and cybersecurity for high-risk AI systems.',
    'Article 17': 'Quality management system for high-risk AI system providers.',
  },
};

export const TECHNIQUE_CONTROL_MAP = {
  'AML.T0051': {
    controls: ['LLM-SEC-001', 'LLM-GOV-002', 'LLM-EVAL-001', 'LLM-EVAL-002'],
    nist_ai_rmf: ['Map', 'Measure', 'Manage', 'Govern'],
    eu_ai_act_relevance: ['Article 9', 'Article 15', 'Article 17'],
  },
  'AML.T0051.001': {
    controls: ['LLM-SEC-001', 'LLM-SEC-003', 'LLM-GOV-002', 'LLM-EVAL-001', 'LLM-MON-001'],
    nist_ai_rmf: ['Map', 'Measure', 'Manage', 'Govern'],
    eu_ai_act_relevance: ['Article 9', 'Article 15', 'Article 17'],
  },
  'AML.T0051.DC': {
    controls: ['LLM-SEC-001', 'LLM-EVAL-001', 'LLM-EVAL-002'],
    nist_ai_rmf: ['Measure', 'Manage'],
    eu_ai_act_relevance: ['Article 9', 'Article 15'],
  },
  'AML.T0054': {
    controls: ['LLM-SEC-001', 'LLM-GOV-002', 'LLM-EVAL-001', 'LLM-MON-001'],
    nist_ai_rmf: ['Map', 'Measure', 'Manage'],
    eu_ai_act_relevance: ['Article 9', 'Article 15'],
  },
  'AML.T0056': {
    controls: ['LLM-SEC-002', 'LLM-SEC-005', 'LLM-EVAL-001', 'LLM-EVAL-002'],
    nist_ai_rmf: ['Map', 'Measure', 'Manage'],
    eu_ai_act_relevance: ['Article 9', 'Article 15', 'Article 17'],
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
  };
}

export function buildCaseMapping(techniqueId, overrides = {}) {
  const base = getTechniqueMapping(techniqueId);
  return {
    mapped_controls: overrides.mapped_controls || base.controls,
    nist_ai_rmf: overrides.nist_ai_rmf || base.nist_ai_rmf,
    eu_ai_act_relevance: overrides.eu_ai_act_relevance || base.eu_ai_act_relevance,
  };
}
