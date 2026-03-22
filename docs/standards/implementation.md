# implementation.md

## Review Checks

### Completeness

- If the file is empty or a stub, flag as **Critical**.
- Must have a clear overview section describing the implementation approach — flag as **Warning** if missing.
- Must list all files created or modified — flag as **Warning** if missing.
- Must document key implementation decisions and their rationale — flag as **Warning** if missing.
- New dependencies introduced must be documented — flag as **Warning** if missing.
- Error handling approach should be described for non-trivial features — flag as **Suggestion** if missing.

### Content Accuracy

- File paths referenced must exist in the codebase — flag as **Critical** if not found.
- Function, class, or component names mentioned must exist in the codebase — flag as **Warning** if not found.
- Described patterns or approaches must match what is actually in the code — flag as **Critical** on mismatch.

### Traceability

- Must trace back to requirements: every functional requirement should have corresponding implementation notes — flag as **Warning** on gaps.
- Must align with `plan.md` phases and steps — flag deviations as **Warning** unless rationale is provided.
- Any deviations from the original plan must be noted with justification — flag as **Warning** if missing.

### Technical Quality

- Should not contain vague or hand-wavy descriptions (e.g., "handle errors appropriately") — flag as **Suggestion**.
- Should reference specific code locations, not just general descriptions — flag as **Suggestion**.
