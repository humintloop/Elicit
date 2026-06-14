# LLM SaaS Security & Assurance Control Set

This folder contains a lightweight control set for SaaS organizations building, integrating, or operating LLM-based technology.

The control set is intentionally practical. It is designed to connect adversarial test evidence to control weaknesses and framework relevance without claiming that a single model failure automatically proves legal noncompliance.

## Traceability Chain

```text
Threat → Technique → Evaluation Case → Evidence → Control Weakness → Framework Relevance → Remediation / Retest
```

## Source Frameworks Used as Inputs

- OWASP Top 10 for LLM Applications 2025
- MITRE ATLAS
- NIST AI RMF 1.0 and NIST AI 600-1 Generative AI Profile
- ISO/IEC 42001 management-system concepts
- CSA AI Controls Matrix concepts
- EU AI Act relevance for high-risk AI systems where applicable

## Important Wording

Use:

> This finding is relevant to controls and obligations associated with AI risk management, robustness, cybersecurity, quality management, and lifecycle testing where the system is in scope.

Avoid:

> This finding violates ISO 42001 or the EU AI Act.

Why: ISO/IEC 42001 is a management-system standard, and EU AI Act obligations depend on role, risk classification, jurisdiction, and system context.

## Initial Control Catalog

| Control ID | Control Name | Domain |
|---|---|---|
| LLM-GOV-001 | AI System Inventory & Use-Case Classification | AI Governance |
| LLM-GOV-002 | AI Threat Modeling | AI Governance |
| LLM-SEC-001 | Prompt Injection Resistance | LLM Application Security |
| LLM-SEC-002 | System Prompt Leakage Prevention | LLM Application Security |
| LLM-SEC-003 | RAG and External Content Trust Boundaries | LLM Application Security |
| LLM-SEC-004 | Tool-Use Authorization & Containment | Agentic AI Security |
| LLM-SEC-005 | Sensitive Data Handling | Data Protection |
| LLM-EVAL-001 | Adversarial Evaluation & Regression Testing | AI Evaluation |
| LLM-EVAL-002 | Evaluation Evidence Retention | AI Evaluation |
| LLM-MON-001 | AI Output Monitoring & Incident Detection | AI Operations |
| LLM-OPS-001 | AI Incident Response | AI Operations |
| LLM-TPRM-001 | AI Vendor / Model Provider Risk | Third-Party Risk |

The machine-readable control metadata is currently implemented in `src/data/frameworkMappings.js` so the UI and report generator can reference the same IDs.
