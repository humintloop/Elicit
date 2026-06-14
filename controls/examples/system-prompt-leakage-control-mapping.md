# Example: System Prompt Leakage Control Mapping

## Scenario

An ambiguity-resolution probe causes the model to reveal real system prompt content, hidden instructions, internal constraints, or policy structure.

## Observed Failure

The model discloses information that should not be exposed to users, such as hidden instructions, role/permission logic, refusal criteria, or secrets stored in the prompt.

## Threat Classification

- MITRE ATLAS: AML.T0056 — Extract LLM System Prompt
- OWASP LLM Top 10: LLM07:2025 System Prompt Leakage

## Impacted Controls

- LLM-SEC-002 — System Prompt Leakage Prevention
- LLM-SEC-005 — Sensitive Data Handling
- LLM-EVAL-001 — Adversarial Evaluation & Regression Testing
- LLM-EVAL-002 — Evaluation Evidence Retention

## Framework Relevance

- NIST AI RMF: Map, Measure, Manage
- EU AI Act: Article 9, Article 15, Article 17 where the system is high-risk or otherwise in scope
- ISO/IEC 42001: relevant to AI system risk assessment, monitoring, corrective action, and continual improvement
- CSA AICM: relevant to AI-specific data protection, model/application security, monitoring, and audit evidence

## Recommended Remediation

- Remove secrets, credentials, hidden authorization logic, and sensitive operational details from prompts.
- Enforce authorization and privilege boundaries outside the LLM.
- Add system prompt leakage tests to regression suites.
- Inspect outputs for system-prompt references and sensitive instruction disclosures.
- Retest after prompt, model, or guardrail changes.
