# WISH-XXX — [Feature Name]

> **Template usage:** Copy this folder to `docs/features/WISH-XXX-slug/` and replace every `[bracketed]` section. Delete this callout. The whole spec folder is **disposable** — at retrospective, lessons are promoted to `colin-glossary.md` / `colin-preferences.md` and this folder is deleted. Don't write anything here you'd want to keep long-term.

---

## 1. Problem Statement

[What problem does this solve? Who has it? What do they do today (without this) to work around it?]

---

## 2. Solution Overview

[What we're building, in 2–3 sentences. Plain English. Analogy welcome.]

---

## 3. User Journey

[Step-by-step walkthrough — what does the user click, fill in, see? Cover the golden path first, then the obvious branches.]

1. [step]
2. [step]
3. [step]

---

## 4. Acceptance Criteria

- [ ] [When the user does X, the system does Y.]
- [ ] [criterion]
- [ ] [criterion]

---

## 5. Out of Scope

- [out-of-scope item]
- [out-of-scope item]

---

## 6. Edge Cases & Error States

| Scenario | Expected behavior |
|---|---|
| [edge case] | [what should happen] |

---

## 7. Ubiquitous Language Check

> Consult `.claude/references/UBIQUITOUS_LANGUAGE.md`. List every domain term this feature uses.

| Term used in this spec | Canonical form | Notes |
|---|---|---|
| [term] | [canonical] | |
| **Missing from glossary:** [term] | — | Propose definition before implementation |

---

## 8. Colin's Preferences Walkthrough

> Consult `.claude/references/colin-preferences.md`. For each principle that could apply, note how this spec addresses it.

| # | Principle | Applies? | How this spec addresses it |
|---|---|---|---|
| [n] | [principle] | yes/no | [explanation] |

---

## 9. Schema / Data Up-Front

> List every new data structure, database table, or persistent state this feature requires before implementation begins. No mid-build schema additions.

[Describe any new tables, columns, local storage keys, API shapes, or data files needed.]

---

## 10. Files That Will Change

| File | Change | Why |
|---|---|---|
| `[path/to/file]` | [change] | [reason] |

**Existing utilities being reused** (from `core-libraries.md`): [list]

**New utilities being created** (justify each): [list, or "none"]

---

## 11. Access Control

[Who can use this feature? Public? Logged-in only? Admin only?]

---

## 12. Third-Party / Cost Considerations

[Only if the feature calls an external service or paid API. Otherwise delete this section.]

- **Service:** [name]
- **Endpoints used:** [list]
- **Cost impact:** [estimate, or "none"]
- **Failure handling:** [what happens when the API is down]

---

## 13. Open Questions

- [ ] [question to resolve before implementation]

---

## 14. Notes for Implementation

[Free-form notes — gotchas, patterns to mimic, prior similar features to reference.]
