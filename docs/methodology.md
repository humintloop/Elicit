# Evaluation Methodology

This lab separates two activities that are often conflated in AI red teaming.

## Exploration vs. assurance

Exploration is finding behavior: running adversarial payloads against a model to see what it does. Assurance is making a defensible claim about that behavior and mapping it to a control or framework. The lab supports both but keeps the line visible. An automated verdict is exploration output. An assurance claim requires a human to confirm it.

## Three evaluators, one human

Each run produces up to three signals.

1. Heuristic triage is deterministic and pattern based. It is fast, explainable, and intentionally conservative. It is right on the clear cases (explicit refusal, verbatim leakage, confabulated content that matches nothing real) and it routes ambiguous cases to review rather than guessing.
2. The LLM judge is an optional second local model that assesses the response semantically. It can recognize instruction hierarchy compliance that pattern matching misses, but it can also be biased by the text it reviews, and it is weaker on small local models.
3. Reconciliation compares the two. When they agree, confidence is higher. When they materially disagree (two or more steps apart on the verdict scale), the finding is marked REVIEW_REQUIRED and both signals are preserved.

The final assurance or control conclusion is made by a human, using the preserved signals as evidence. Automated outputs are evidence indicators, not verdicts.

## Trace testing note

Some research findings involve visible reasoning or thinking traces. This lab evaluates final model output unless a runtime exposes reasoning traces as part of the response. Trace disclosure testing is labeled separately from final output disclosure testing.

## Scope and limits

The lab evaluates local model behavior and does not prove exploitability against a production system. Results vary by model, quantization, prompt, temperature, context, and runtime. Framework mappings (MITRE ATLAS, OWASP LLM Top 10, ISO 42001, EU AI Act) are relevance mappings for traceability and education. They are not audit conclusions, certification evidence, or findings of noncompliance.
