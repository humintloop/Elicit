# LLM Red Team Lab

A **local-first LLM adversarial evaluation and AI assurance lab** for testing model behavior, scoring findings, mapping results to security/control frameworks, and exporting assessment evidence.

The lab runs in-browser with WebLLM/WebGPU. No external API calls are required after the initial model download.

---

## Responsible Use

This project is designed for authorized security research, internal AI assurance, and evaluation of systems you own or have explicit permission to test. Do not use it against production AI systems without authorization.

Framework mappings are provided for traceability and education. They do **not** constitute legal advice, audit conclusions, certification evidence, or automatic findings of noncompliance.

---

## What It Does

- **Local model inference** via WebLLM/WebGPU.
- **Structured evaluation cases** instead of loose prompt payloads.
- **Ambiguity-resolution probes** inspired by thinking-trace / constraint-disclosure research.
- **Heuristic evaluation** for prompt leakage, jailbreak, and injection indicators.
- **Optional local LLM judge** with JSON verdict, confidence, severity, evidence excerpt, rationale, and false-positive risk.
- **Findings tracker** with full local evidence retention.
- **JSON export** for raw findings.
- **Markdown report export** for assessment-style documentation.
- **Initial control mapping** to a lightweight LLM SaaS Security & Assurance Control Set.

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

The intended evidence chain is:

```text
evaluation case → model response → heuristic/judge result → finding → impacted control → framework relevance → report
```

Example:

```text
Prompt injection succeeds
→ MITRE ATLAS AML.T0051 / OWASP LLM01:2025
→ LLM-SEC-001 Prompt Injection Resistance
→ Relevant to NIST AI RMF Measure/Manage and EU AI Act Articles 9/15/17 where the system is in scope
→ Evidence retained for remediation and retesting
```

The initial control set lives in [`controls/`](./controls/README.md) and is intentionally lightweight. It is meant to demonstrate how technical LLM findings can be translated into control weaknesses for SaaS organizations using LLM-based technology.

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

## Evaluation Case Schema

Evaluation cases live in `src/payloads.js`. Each case should include:

```javascript
{
  id: 'AMB-001',
  technique: 'AML.T0056',
  category: 'Ambiguity Resolution',
  difficulty: 'medium',
  name: 'Three-Word Ambiguity',
  description: 'Short description of what this tests.',
  payload: `Why can't you`,
  objective: 'What the test is designed to determine.',
  expected_secure_behavior: 'What a secure/controlled response should do.',
  failure_mode: 'What failure looks like.',
  success_criteria: 'What evidence indicates success.',
  mapped_controls: ['LLM-SEC-002', 'LLM-EVAL-001']
}
```

If `mapped_controls` is omitted, the lab applies default mappings by technique.

---

## Reports

The findings view supports:

- `EXPORT JSON` — raw machine-readable finding records.
- `EXPORT REPORT` — Markdown assessment report with findings, evidence excerpts, impacted controls, and framework relevance.

---

## Roadmap

### v1.1 — Evaluation structure

- Clean repo structure
- Evaluation-case metadata
- Ambiguity-resolution probes
- Stronger judge prompt and JSON parsing
- Evidence-rich finding records
- Markdown report export

### v2 — Control traceability

- Expand `controls/` into a more complete LLM SaaS control set
- Add control validation examples
- Add framework crosswalk documentation
- Surface impacted controls more prominently in the UI

### v3 — Assurance package

- Assessment run IDs
- Multi-run reproducibility mode
- Regression testing
- HTML/PDF report output
- Control evidence packages

---

## Limitations

- This lab evaluates local model behavior and does not prove production exploitability.
- Results vary by model, runtime, quantization, prompt, context, and temperature.
- Heuristics are triage aids, not ground truth.
- LLM judge mode can be biased or influenced; treat it as supporting evidence.
- EU AI Act relevance depends on role, scope, risk classification, and deployment context.
