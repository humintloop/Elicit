# Control Mapping Matrix

This matrix connects ELICIT's project-defined controls to MITRE ATLAS, OWASP LLM Top 10, ISO/IEC 42001 section 9, and EU AI Act high-risk readiness references.
Mappings are traceability aids and should be treated as inferred unless noted otherwise.

| Control | Control Name | Primary MITRE / OWASP Relevance | ISO/IEC 42001 Section 9 Relevance | EU AI Act Readiness Relevance | Evidence the Lab Can Produce |
|---|---|---|---|---|---|
| `LLM-GOV-001` | AI System Inventory and Use-Case Classification | System boundary context for all evaluated techniques and categories | 9.1, 9.2, 9.3 | Articles 9, 17 | Model/runtime metadata, prompt profile, system inventory notes |
| `LLM-GOV-002` | AI Threat Modeling | `AML.T0051`, `AML.T0054`, `AML.T0056`; `LLM01`, `LLM02`, `LLM06`, `LLM07`, `LLM08` | 9.1, 9.2, 9.3 | Articles 9, 15, 17 | Evaluation case rationale, mapped threats, tested assumptions |
| `LLM-SEC-001` | Prompt Injection Resistance | `AML.T0051`, `AML.T0051.001`; `LLM01` | 9.1, 9.2 | Articles 9, 12, 14, 15, 72 | Prompt injection result, full local response, evaluator decision, readiness gap |
| `LLM-SEC-002` | System Prompt Leakage Prevention | `AML.T0056`; `LLM07`, `LLM02` | 9.1, 9.2, 9.3 | Articles 9, 12, 15, 17, 72 | Prompt extraction result, leaked-fragment evidence, reviewer decision |
| `LLM-SEC-003` | RAG and External Content Trust Boundaries | `AML.T0051.001`; `LLM01`, `LLM08`, `LLM02` | 9.1, 9.2 | Articles 9, 12, 15, 72 | Indirect injection result, retrieved-content notes, source trust label |
| `LLM-SEC-004` | Tool-Use Authorization and Containment | `AML.T0053`, `AML.T0051`, `AML.T0054`; `LLM06`, `LLM01` | 9.1, 9.2, 9.3 | Articles 9, 14, 15, 17 | Unauthorized tool-use attempt, authorization evidence, approval record |
| `LLM-SEC-005` | Sensitive Data Handling | `AML.T0057`, `AML.T0056`; `LLM02`, `LLM07`, `LLM08` | 9.1, 9.2 | Articles 9, 12, 15, 17 | Sensitive-output finding, redaction check, retrieval/access-control evidence |
| `LLM-EVAL-001` | Adversarial Evaluation and Regression Testing | `AML.T0051`, `AML.T0054`, `AML.T0056`; LLM risk categories under test | 9.1, 9.2, 9.3 | Articles 9, 12, 15, 72 | Evaluation suite run, baseline result, regression result |
| `LLM-EVAL-002` | Evaluation Evidence Retention | Evidence-retention support for all evaluated techniques | 9.1, 9.2, 9.3 | Articles 12, 17, 72 | Run ID, case ID/version, model metadata, full local response, mapped controls |
| `LLM-MON-001` | AI Output Monitoring and Incident Detection | `AML.T0051`, `AML.T0054`, `AML.T0056`, `AML.T0057`; `LLM01`, `LLM02`, `LLM06`, `LLM07` | 9.1, 9.3 | Articles 12, 15, 72 | Detection indicator, flagged output, incident ticket reference |
| `LLM-OPS-001` | AI Incident Response | `AML.T0051`, `AML.T0054`, `AML.T0056`, `AML.T0057`; `LLM01`, `LLM02`, `LLM06`, `LLM07`, `LLM08` | 9.2, 9.3 | Articles 9, 17, 72 | Containment note, remediation action, retest evidence |
| `LLM-TPRM-001` | AI Vendor and Model Provider Risk | Provider and dependency context; `LLM03`, `LLM02`, `LLM06` | 9.1, 9.2, 9.3 | Articles 9, 17 | Vendor review notes, provider data-use terms, model change record |

## SaaS / Critical Digital Infrastructure Readiness Note

For CDN, edge, cybersecurity, cloud, or critical digital infrastructure SaaS providers, ELICIT uses a SaaS / critical digital infrastructure readiness lens. This does not classify a system as high-risk by itself. EU AI Act relevance depends on the actual AI system, intended use, jurisdiction, and whether the AI system is used as a safety component in critical digital infrastructure or another high-risk category.

## Example Traceability Paths

### Direct Prompt Injection

```text
Evaluation case DI-001
-> MITRE ATLAS AML.T0051 / AML.T0051.000
-> OWASP LLM01:2025 Prompt Injection
-> LLM-SEC-001 Prompt Injection Resistance
-> LLM-EVAL-001 Adversarial Evaluation and Regression Testing
-> Finding evidence + retest guidance
```

### Indirect Prompt Injection / RAG

```text
Evaluation case IND-001
-> MITRE ATLAS AML.T0051.001
-> OWASP LLM01:2025 Prompt Injection
-> OWASP LLM08:2025 Vector and Embedding Weaknesses
-> LLM-SEC-003 RAG and External Content Trust Boundaries
-> LLM-SEC-001 Prompt Injection Resistance
-> Finding evidence + source trust-boundary review
```

### System Prompt Leakage

```text
Evaluation case PE-001
-> MITRE ATLAS AML.T0056
-> OWASP LLM07:2025 System Prompt Leakage
-> LLM-SEC-002 System Prompt Leakage Prevention
-> LLM-SEC-005 Sensitive Data Handling
-> Finding evidence + prompt hygiene review
```
