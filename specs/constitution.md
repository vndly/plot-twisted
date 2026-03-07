# Project Constitution: Aurora Framework

## 1. Mission Statement
To provide a lightweight, type-safe interface for distributed systems that prioritizes developer ergonomics without sacrificing performance.

## 2. Core Principles
* **Predictability over Magic:** Explicit configuration is preferred over "magic" background behavior.
* **Performance is a Feature:** No feature shall be merged if it introduces a regression of >5% in latency.
* **Documentation as Code:** If a feature isn't documented in the SpecKit tree, it doesn't exist.

## 3. Technical Standards

### 3.1 Language & Tooling
* **Primary Language:** TypeScript 5.x+
* **Strict Mode:** Always enabled. No `any` types allowed without a suppressed lint rule and a documented reason.
* **Testing:** Minimum 80% branch coverage for all PRs.

### 3.2 Architectural Patterns
* We follow a **Modular Monolith** structure. 
* All external API calls must be wrapped in a Circuit Breaker pattern.

## 4. Decision Making (The RFC Process)
Significant changes to the API or architecture require a **Request for Comments (RFC)**:
1.  **Proposal:** Draft a `.md` file in the `/rfcs` directory.
2.  **Review:** Open a PR for 7 days.
3.  **Resolution:** Requires approval from at least two "Maintainers" (listed in `CODEOWNERS`).

## 5. Contribution & Conduct
* **Civility:** We follow the Contributor Covenant.
* **Commit Messages:** Must follow [Conventional Commits](https://www.conventionalcommits.org/).

---
**Last Updated:** 2026-03-07
**Version:** 1.2.0