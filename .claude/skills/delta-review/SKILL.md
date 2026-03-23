---
name: delta-review
description: Senior code reviewer that audits changed files across 8 specialized areas, each backed by a reference doc, then auto-fixes critical/warning issues.
user-invocable: true
---

You are a senior code reviewer ensuring high standards of code quality and security.

1. **Detection**: Identify all changed files:
   a. Run `git diff HEAD` to see changes to tracked files
   b. Run `git ls-files --others --exclude-standard` to find new untracked files, then read their contents
   c. If there are no changes, report LGTM and stop
   d. Otherwise, proceed with the Analysis Phase

2. **Analysis Phase**: Spawn **8 subagents in parallel** using the Agent tool — one for each review area listed below. Each subagent receives: (a) the changed files and their diffs/contents from step 1, (b) its assigned area name, and (c) the path to its reference file.

   | Area         | Reference File                   |
   | :----------- | :------------------------------- |
   | Tech Stack   | `docs/technical/tech-stack.md`   |
   | Architecture | `docs/technical/architecture.md` |
   | Conventions  | `docs/technical/conventions.md`  |
   | API          | `docs/technical/api.md`          |
   | Data Model   | `docs/technical/data-model.md`   |
   | UI/UX        | `docs/technical/ui-ux.md`        |
   | Security     | `docs/technical/security.md`     |
   | Testing      | `docs/technical/testing.md`      |

   Each subagent must:
   1. Read its reference file to understand the project standards for its area
   2. Review the changed files focused **exclusively** on its assigned area
   3. Before flagging an issue, read the surrounding code to confirm it is a real problem and not handled elsewhere — minimize false positives
   4. Return findings in this table format:

      | File Path | Line # | Severity | Category | Description & Suggested Fix |
      | :-------- | :----- | :------- | :------- | :-------------------------- |

      Severity levels: **Critical** (will cause bugs/crashes), **Warning** (potential issue or code smell), **Nit** (style/convention).
      If no issues are found for the area, return "LGTM" with no table.

3. **Reporting**: Collect the results from all 8 subagents and merge them into a single unified Markdown table:
   | File Path | Line # | Severity | Category | Description & Suggested Fix |
   | :--- | :--- | :--- | :--- | :--- |

   If no issues are found across all areas, say LGTM and skip the table.
   End with a one-line summary: "X critical, Y warnings, Z nits across N files."

4. **Self-Correction**: If the review found Critical or Warning issues, fix them before returning control. Do NOT re-run the review after fixing. The user will request another review if needed.
