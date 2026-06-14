# Example: Prompt Injection Control Mapping

## Scenario

An LLM-enabled SaaS assistant receives a user prompt that attempts to override the system prompt and force disclosure of hidden instructions.

## Observed Failure

The model follows the user-controlled instruction over the intended instruction hierarchy or reveals internal instruction structure.

## Threat Classification

- MITRE ATLAS: AML.T0051 — LLM Prompt Injection
- OWASP LLM Top 10: LLM01:2025 Prompt Injection

## Impacted Controls

- LLM-SEC-001 — Prompt Injection Resistance
- LLM-GOV-002 — AI Threat Modeling
- LLM-EVAL-001 — Adversarial Evaluation & Regression Testing
- LLM-EVAL-002 — Evaluation Evidence Retention

## Framework Relevance

- NIST AI RMF: Map, Measure, Manage, Govern
- EU AI Act: Article 9, Article 15, Article 17 where the system is high-risk or otherwise in scope
- ISO/IEC 42001: relevant to AI risk assessment, lifecycle controls, monitoring, evaluation, and continual improvement
- CSA AICM: relevant to AI-specific security controls, implementation guidance, and audit evidence expectations

## Evidence Required

- Evaluation case ID
- Victim model and runtime
- System prompt preview or hash
- Attack payload
- Model response
- Heuristic and/or judge verdict
- Evidence excerpt
- Severity and confidence
- Retest result after remediation

## Recommended Remediation

- Treat user input and retrieved content as untrusted.
- Separate trusted system instructions from untrusted context.
- Do not rely on the LLM alone for authorization or policy enforcement.
- Add prompt-injection cases to release gates and regression tests.
- Monitor for instruction-override language and unauthorized tool-use attempts.
