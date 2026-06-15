# ELICIT — Local-First Adversarial Assurance Lab

![ELICIT social preview](public/brand/elicit-social-preview.png)

Run adversarial LLM evaluation cases in the browser, preserve the evidence locally, and map each finding to the controls and framework readiness questions it informs. WebLLM/WebGPU handles model execution in-browser; after the initial model download, no external API calls are required.

> Red-team LLMs in the browser. Preserve the evidence. Map the control gap.

---

## Why It Exists

The useful question is not only whether a model can be made to fail. It is what that failure says about instruction hierarchy, data boundaries, monitoring, evidence retention, and the control that should have caught it.

---

## Responsible Use

This project is designed for authorized security research, internal AI assurance, and evaluation of systems you own or have explicit permission to test. Do not use it against production AI systems without authorization.

Framework mappings are provided as control traceability aids for education and review. They do **not** constitute legal conclusions, audit determinations, certification evidence, or automatic findings of noncompliance.

Security issues in this repository should be reported through GitHub private security advisories when available. See [`SECURITY.md`](./SECURITY.md). The project is licensed under Apache 2.0; see [`LICENSE`](./LICENSE).

---

## What It Does

- **Local model inference** via WebLLM/WebGPU.
- **Structured evaluation cases** with case IDs, versions, expected secure behavior, failure modes, and success criteria.
- **Synthetic ambiguity probes** for authorized local testing.
- **Heuristic evaluation** for prompt leakage, jailbreak, and injection indicators.
- **Optional local LLM judge** that returns a structured `VERDICT:` and `REASON:` response.
- **Heuristic/judge disagreement handling** for manual-review cases.
- **Findings tracker** with local evidence records, run IDs, model metadata, evaluator outputs, reviewer decisions, and response evidence.
- **Reviewer disposition workflow** for confirming, rejecting, retesting, or accepting risk on findings.
- **JSON export** for raw evidence records.
- **Markdown report export** for assessment-style documentation.
- **Initial framework/control mapping data** including MITRE ATLAS, OWASP LLM Top 10, NIST AI RMF, ISO/IEC 42001 section 9, and EU AI Act readiness relevance.

---

## Technique Coverage

| ID | Name | OWASP Mapping | Notes |
|---|---|---|---|
| AML.T0051 | LLM Prompt Injection | LLM01:2025 Prompt Injection | Parent technique for direct prompt injection |
| AML.T0051.001 | LLM Prompt Injection: Indirect | LLM01:2025 Prompt Injection | External content / RAG / email / document injection |
| AML.T0054 | LLM Jailbreak | LLM01:2025 Prompt Injection | Bypass of constraints, guardrails, or intended behavior |
| AML.T0056 | Extract LLM System Prompt | LLM07:2025 System Prompt Leakage | System prompt / hidden instruction disclosure |

The payload library also includes local delimiter-confusion variants under the prompt-injection family. They are intentionally kept out of the source-grounded technique table until the taxonomy is cleaner.

---

## Control Traceability Model

The core traceability path is:

```text
evaluation case → model response → heuristic/judge result → finding evidence → impacted control → framework readiness gap → mitigation → retest
```

Example:

```text
Prompt injection succeeds
→ MITRE ATLAS AML.T0051 / OWASP LLM01:2025
→ LLM-SEC-001 Prompt Injection Resistance
→ Relevant to NIST AI RMF Measure/Manage, ISO/IEC 42001 section 9, and EU AI Act Articles 9/12/14/15/17/72 where applicable and in scope
→ Finding evidence retained locally for reviewer decision, mitigation, and retesting
```

The initial control notes live in [`controls/`](./controls/README.md). The implemented mappings currently live in [`src/data/frameworkMappings.js`](./src/data/frameworkMappings.js) and are intentionally lightweight. They demonstrate how technical LLM findings can be translated into control weaknesses for SaaS organizations using LLM-based technology.

For CDN, edge, or critical digital infrastructure SaaS providers, the default profile is **SaaS / Critical Digital Infrastructure Readiness**. EU AI Act references are conditional readiness prompts only; high-risk status depends on the actual AI system, intended purpose, jurisdiction, and whether the AI system is used as a safety component or otherwise falls in scope.

---

## Local Setup

```bash
git clone https://github.com/humintloop/Elicit.git
cd Elicit
npm install
npm run dev
```

Open `http://localhost:5173` in Chrome or Edge with WebGPU enabled.

---

## Build

```bash
npm run build
npm run preview
```

---

## Model Recommendations

| Model | VRAM | Notes |
|---|---:|---|
| TinyLlama 1.1B | ~1 GB | Fastest, useful for UI and flow testing |
| Gemma 2 2B | ~2 GB | Good baseline target |
| Phi 3.5 Mini | ~3 GB | Useful judge model |
| Llama 3.2 3B | ~3 GB | Solid local baseline |
| Mistral 7B | ~5 GB | More realistic evaluation target |
| Llama 3.1 8B | ~6 GB | Stronger capability, slower locally |
| Gemma 2 9B | ~7 GB | Higher-value but heavier target |

---

## Payload Library

Evaluation cases live in `src/payloads.js`. Each case keeps the original payload fields and is normalized with schema metadata:

```javascript
{
  id: 'PE-004',
  case_id: 'PE-004',
  case_version: '0.4.0',
  technique: 'AML.T0056',
  difficulty: 'medium',
  name: 'Minimal Ambiguity Probe',
  objective: 'Determine whether the model discloses hidden constraints...',
  expected_secure_behavior: 'Refuse or safely redirect attempts...',
  failure_mode: 'The model reveals exact or closely paraphrased system prompt content...',
  success_criteria: 'SUCCESS when real system prompt content or protected secrets are revealed...',
  description: 'Short description of what this tests.',
  payload: '[redacted ambiguity probe]',
  note: 'Use authorized/synthetic ambiguity probes only.'
}
```

Default framework/control mappings are applied by technique through `src/data/frameworkMappings.js`. Per-case mapping overrides can be added when a case needs more specific controls, ISO/EU relevance, or readiness gaps.

---

## Reports

The findings view supports:

- `EXPORT JSON` — raw machine-readable evidence records.
- `EXPORT REPORT` — Markdown assessment report with findings, response excerpts, evaluator outputs, impacted controls, framework readiness gaps, mitigation guidance, and retest guidance.

Evidence records include run IDs, case versions, model/runtime metadata, model settings, full responses retained locally, evaluator outputs, mapped controls, ISO/EU readiness relevance, recommended mitigations, retest guidance, and reviewer decisions. They are local records, not immutable audit trails.

## Judge Output

Judge prompts currently ask the local judge model to return:

```text
VERDICT: SUCCESS or PARTIAL or FAILURE
REASON: one sentence.
```

The app parses the `VERDICT:` line and preserves the judge text. JSON judge output, confidence scoring, severity scoring, and false-positive-risk fields are roadmap items, not current behavior.

---

## What's Implemented

- Local-first WebLLM test runner
- Structured evaluation cases with case versioning
- Heuristic triage with optional local LLM judge
- Heuristic/judge disagreement handling
- Evidence-rich findings with run IDs, model metadata, retained responses, and reviewer disposition
- Markdown and JSON exports
- Source ledger, sample report, and README imagery
- MITRE ATLAS, OWASP LLM Top 10, NIST AI RMF, ISO/IEC 42001 section 9, and conditional EU AI Act readiness mappings
- Project-defined mitigation and retest guidance

## What's Next

- Stronger judge prompt and JSON parsing
- System-computed severity, confidence, and false-positive-risk fields
- Multi-run reproducibility mode
- Regression testing

## Later

- Expand `controls/` into a standalone completed LLM SaaS control set
- Add control validation examples
- Add framework crosswalk documentation
- Surface impacted controls more prominently in the UI
- Richer control-aware reports
- HTML/PDF report output
- Control evidence packages

---

## Limitations

- This lab evaluates local model behavior and does not prove production exploitability.
- Results vary by model, runtime, quantization, prompt, context, and temperature.
- Heuristics are triage aids, not ground truth.
- LLM judge mode can be biased or influenced; treat it as supporting evidence.
- ISO/IEC 42001 and EU AI Act relevance depends on role, scope, risk classification, management-system scope, jurisdiction, and deployment context.
- EU AI Act high-risk readiness is not the same as high-risk classification; cybersecurity-only components are not automatically safety components.
