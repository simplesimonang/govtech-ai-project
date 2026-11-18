# Build Log

## Riskiest Assumption

**Assumption:** It is feasible to have single sources of truth updated and contributing to a central repo.

**Risk type:** Feasibility (technical) — we do not yet know if policy owners will keep their pages current in a shared system.

**Kill switch:** Policy owners cannot or will not update their pages in the central repo within a reasonable turnaround. If fewer than half of flagged pages get updated within two weeks, stop and revisit the operating model.

**Success signal:** Policy owners update 8 in 10 flagged pages within 5 working days during a two-week pilot. (made up)

---

## Prototype

**Location:** [prototype/index.html](prototype/index.html)

**What it tests:** Whether officers trust a cited AI draft enough to edit it, or rewrite from scratch.

**How to run the test:**
1. Open `prototype/index.html` in a browser
2. Ask an officer to respond to the enquiry as they normally would
3. Note the action taken (sent as-is, edited, or rewrote) and time spent

**What to watch for:**
- Do they click the citations to check the policy source?
- Do they edit the draft or clear it and start over?
- How long does it take?

**Pass:** 7 in 10 drafts sent after a light edit. (made up)
**Fail:** Officers rewrite most drafts from scratch, or get stuck for more than 30 seconds.
