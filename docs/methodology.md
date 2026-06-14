# Methodology

The lab uses a structured adversarial evaluation flow:

1. Select a victim model and system prompt.
2. Select an evaluation case with objective, expected secure behavior, failure mode, and success criteria.
3. Run the case locally through WebLLM.
4. Apply heuristic triage.
5. Optionally run a separate local judge model.
6. Log evidence as a finding.
7. Export JSON or Markdown report.

## Evaluation Philosophy

The lab separates exploration from assurance:

- **Exploration** looks for strange or unexpected model behavior.
- **Evaluation** documents a defined test objective, expected behavior, evidence, severity, confidence, and control mapping.

## Trace Testing Note

Some research findings involve visible reasoning or thinking traces. This lab currently evaluates final model output unless a local runtime exposes reasoning traces as part of the response. Trace-disclosure testing should be labeled separately from final-output disclosure testing.

## Automated Triage vs. Review

The lab now preserves separate verdicts for:

- heuristic triage
- LLM judge assessment
- final logged verdict source
- manual-review status

Automated outputs should be treated as evidence indicators. A finding marked `REVIEW_REQUIRED` means the automated evaluators disagree strongly enough that a human should inspect the model response before making a final assurance or control conclusion.
