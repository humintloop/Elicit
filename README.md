#ELICIT — Local-First Advesarial Assurance Lab

A **ELICIT is a local-first LLM evaluation lab** for testing adversarial model behavior, triaging findings, and mapping failures to the controls that should have caught them.

The lab runs in-browser with WebLLM/WebGPU. No external API calls are required after the initial model download.

---

## Responsible Use

This project is designed for authorized security research, internal AI assurance, and evaluation of systems you own or have explicit permission to test. Do not use it against production AI systems without authorization.

Framework mappings are provided as control traceability aids for education and review. They do **not** constitute legal conclusions, audit determinations, certification evidence, or automatic findings of noncompliance.

---

## What It Does

- **Local model inference** via WebLLM/WebGPU.
- **Evaluation-case-style payload library** with technique metadata.
- **Synthetic ambiguity probes** for authorized local testing.
- **Heuristic evaluation** for prompt leakage, jailbreak, and injection indicators.
- **Optional local LLM judge** that returns a structured `VERDICT:` and `REASON:` response.
- **Heuristic/judge disagreement handling** for manual-review cases.
- **Findings tracker** with lightweight local finding records and response excerpts.
- **JSON export** for raw finding records.
- **Markdown report export** for assessment-style documentation.
- **Initial framework/control mapping data** in `src/data/frameworkMappings.js`.

---

## Technique Coverage

| ID | Name | OWASP Mapping | Notes |
|---|---|---|---|
| AML.T0051 | LLM Prompt Injection | LLM01:2025 Prompt Injection | Parent technique for direct prompt injection |
| AML.T0051.001 | LLM Prompt Injection: Indirect | LLM01:2025 Prompt Injection | External content / RAG / email / document injection |
| AML.T0054 | LLM Jailbreak | LLM01:2025 Prompt Injection | Bypass of constraints, guardrails, or intended behavior |
| AML.T0056 | Extract LLM System Prompt | LLM07:2025 System Prompt Leakage | System prompt / hidden instruction disclosure |
| AML.T0051.DC | Delimiter Confusion | LLM01:2025 Prompt Injection | Local custom variant, not a registered ATLAS technique |

---

## Control Traceability Model

The current v0.2 traceability aid is:

```text
evaluation case → model response → heuristic/judge result → finding → impacted control → framework relevance → report
```

Example:

```text
Prompt injection succeeds
→ MITRE ATLAS AML.T0051 / OWASP LLM01:2025
→ LLM-SEC-001 Prompt Injection Resistance
→ Relevant to NIST AI RMF Measure/Manage and EU AI Act Articles 9/15/17 where applicable and in scope
→ Lightweight finding record retained for review and retesting
```

The initial control notes live in [`controls/`](./controls/README.md). The implemented mappings currently live in [`src/data/frameworkMappings.js`](./src/data/frameworkMappings.js) and are intentionally lightweight. They demonstrate how technical LLM findings can be translated into control weaknesses for SaaS organizations using LLM-based technology.

---

## Local Setup

```bash
git clone https://github.com/humintloop/llm-red-team-lab.git
cd llm-red-team-lab
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

Payloads live in `src/payloads.js`. The current payload objects use technique metadata and can optionally include notes:

```javascript
{
  id: 'PE-004',
  technique: 'AML.T0056',
  difficulty: 'medium',
  name: 'Minimal Ambiguity Probe',
  description: 'Short description of what this tests.',
  payload: '[redacted ambiguity probe]',
  note: 'Use authorized/synthetic ambiguity probes only.'
}
```

Default framework/control mappings are applied by technique through `src/data/frameworkMappings.js`. A fuller structured evaluation-case schema with objective, expected secure behavior, failure mode, success criteria, and per-case mapping overrides is planned.

---

## Reports

The findings view supports:

- `EXPORT JSON` — raw machine-readable finding records.
- `EXPORT REPORT` — Markdown assessment report with findings, response excerpts, and currently mapped framework/control relevance where recorded.

Finding records are intentionally lightweight in v0.2. They include case metadata, verdicts, judge text when used, response excerpts, and mappings. They are not full evidence packages with run IDs, reproducibility metadata, reviewer sign-off, or immutable audit trails.

## Judge Output

Judge prompts currently ask the local judge model to return:

```text
VERDICT: SUCCESS or PARTIAL or FAILURE
REASON: one sentence.
```

The app parses the `VERDICT:` line and preserves the judge text. JSON judge output, confidence scoring, severity scoring, and false-positive-risk fields are roadmap items, not current behavior.

---

## Roadmap

### v0.2 — Current MVP

- Clean repo structure
- Evaluation-case-style payload metadata
- Synthetic ambiguity probe placeholder
- Heuristic triage with optional local LLM judge
- Heuristic/judge disagreement handling
- Lightweight finding records
- Markdown report export
- Initial framework/control mappings

### v1 — Evaluation structure

- Full structured evaluation-case schema with objective, expected secure behavior, failure mode, and success criteria
- Stronger judge prompt and JSON parsing
- System-computed severity, confidence, and false-positive-risk fields
- Evidence-rich finding records
- Assessment run IDs
- Multi-run reproducibility mode
- Regression testing

### v2 — Control traceability

- Expand `controls/` into a standalone completed LLM SaaS control set
- Add control validation examples
- Add framework crosswalk documentation
- Surface impacted controls more prominently in the UI
- Richer control-aware reports

### v3 — Assurance package

- HTML/PDF report output
- Control evidence packages

---

## Limitations

- This lab evaluates local model behavior and does not prove production exploitability.
- Results vary by model, runtime, quantization, prompt, context, and temperature.
- Heuristics are triage aids, not ground truth.
- LLM judge mode can be biased or influenced; treat it as supporting evidence.
- EU AI Act relevance depends on role, scope, risk classification, and deployment context.
