# Agent Control Panel: ServiceSG Enquiry Reply Drafter

All data in this file is synthetic and labelled as made up.

---

## What the agent is doing

The agent drafts first replies to resident enquiries about CPF policy. It retrieves policy sources, checks their currency, and composes a response with inline citations. An officer reviews every draft before it reaches a resident.

**Current state:** Prototype with hardcoded drafts. Not yet connected to real LLM or policy source API.

**Active hours:** Office hours only (when officers are available to review)

**Volume:** Estimated 50–100 enquiries/day across 7 topic categories (made up)

---

## Opportunity portfolio

| Step | Type | Autonomy | Value | Status |
|------|------|----------|-------|--------|
| Classify enquiry by topic | Workflow | Decides alone | Saves officer from manual tagging | Ready |
| Look up policy source | Workflow | Decides alone | Saves 12 min search time per enquiry | Ready |
| Check source currency | Workflow | Decides alone | Prevents citing outdated info | Ready |
| Draft reply with citations | Agent | Proposes and waits | Officer reviews instead of writing from scratch | Not ready (needs LLM) |
| Send reply to resident | Human action | Person reviews | Resident gets correct answer | Ready (gated by officer) |

**Next to build:** Draft reply with citations (Step 4) — highest value, medium risk, requires LLM integration.

---

## Rules of engagement

### Decides alone (no human in the loop)

| Action | Condition | Why it's safe |
|--------|-----------|---------------|
| Classify topic | Keyword match to one of 7 topics | Wrong topic → wrong source → officer sees and corrects |
| Look up source | Topic maps to source ID | Deterministic; failure = "no source found" message |
| Check currency | Date comparison (< 90 days) | Math; no judgment needed |
| Add outdated warning | Source > 90 days old | Visible to officer; they decide whether to proceed |
| Log metrics | After officer action | No resident impact; internal only |

### Proposes and waits (human reviews before action)

| Action | What officer sees | Officer options |
|--------|-------------------|-----------------|
| Draft reply | Full draft with inline citations | Send / Edit / Rewrite |
| Outdated source warning | Banner: "may be outdated" | Send anyway / Wait for update |
| Low-confidence claim | Dotted underline on uncertain text | Verify / Remove / Rewrite |

### A person reviews (human makes the final call)

| Decision | Who decides | Agent role |
|----------|-------------|------------|
| Send reply to resident | Officer | Provides draft; cannot send |
| Edit draft content | Officer | Preserves edits; does not override |
| Escalate to policy team | Officer | Flags issue; officer routes |
| Update policy source | Policy team | Agent uses updated source next time |
| Stop using the tool | Product owner | Agent has no say |

---

## Stop conditions

### Agent stops and routes to human when:

| Condition | Agent action | Why |
|-----------|--------------|-----|
| No source covers the topic | Say "I don't have information on this" | Scope boundary — no unsourced claims |
| Two sources contradict | Flag both; do not draft | No inference across sources |
| Enquiry contains image/attachment | Route to human | Cannot read images |
| Resident asks for account info | Route to human | No access to personal data |
| Source older than 90 days | Draft with warning; officer decides | Currency window |
| Confidence below threshold | Mark uncertain text; officer verifies | Trust mechanism |

### Project stops (kill switch) when:

| Signal | Threshold | Action |
|--------|-----------|--------|
| Officers stuck on core action | > 3 minutes | Check draft quality first |
| Officers rewrite most drafts | > 50% rewrites | Revisit whether AI drafts solve the problem |
| Drafts usable after light edit | < 5 in 10 | Stop or pivot |
| Source staleness rate | > 50% sources outdated | Pause until policy team catches up |

---

## What stays human

These actions are never automated, regardless of agent capability or confidence.

| Action | Why it stays human |
|--------|-------------------|
| **Send reply to resident** | Policy requirement. Every reply needs officer approval. |
| **Access resident account data** | Privacy. Agent has no access to personal information. |
| **Override policy source** | Authority. Only policy team can change the source of truth. |
| **Decide continue/pivot/stop** | Accountability. Product owner makes project decisions. |
| **Handle complaints about AI errors** | Trust. Human contact required for service recovery. |
| **Approve new policy sources** | Governance. Sources must be vetted before agent can use them. |

**Principle:** The agent proposes; humans dispose. No action that reaches a resident happens without an officer's explicit approval.

---

## Permissions

One row per tool the agent uses. Tier and setting based on stress test results.

| Tool | Purpose | Tier | Setting | Stress test evidence |
|------|---------|------|---------|---------------------|
| `lookup_policy` | Retrieve policy source by topic | Read | Auto | Stress 2: correctly refused to look up CPF-099 (not in approved list) |
| `check_currency` | Verify source is within 90-day window | Read | Auto | Input 2: correctly flagged CPF-004 as outdated (132 days) |
| `draft_reply` | Compose reply with inline citations | Draft | Confirm | Stress 2: drafted correction without citing fake source; officer reviews before send |
| `flag_for_review` | Route to human when agent cannot proceed | Write | Auto | Stress 1, 3: correctly routed empty enquiry and no-source enquiry to human |
| `log_action` | Record metrics after officer action | Write | Auto | No resident impact; internal only |

### Tier definitions

- **Read:** Retrieve information without modification
- **Draft:** Create content for human review
- **Write:** Modify system state (logs, flags, routing)
- **Send:** Deliver content to external recipient (not used by any tool — officer sends)

### Setting definitions

- **Auto:** Agent proceeds without confirmation
- **Confirm:** Agent proposes; human approves before action
- **Block:** Agent cannot perform this action (no tools blocked; blocked actions are in "What stays human")

### What the stress tests showed

| Stress test | Tool used | What happened | Setting justified? |
|-------------|-----------|---------------|-------------------|
| Empty enquiry | `flag_for_review` | Routed to human immediately | Auto ✓ — fails safe |
| Fake source (CPF-099) | `lookup_policy`, `draft_reply` | Refused to cite fake source; drafted correction | Auto + Confirm ✓ |
| No source (fees) | `flag_for_review` | Routed to human with explanation | Auto ✓ — fails safe |

---

## Business owner questions (answered)

*A business owner asked to fund this would want to know:*

### 1. What does it cost?

| Item | Cost | Notes |
|------|------|-------|
| LLM API calls | ~$0.02/enquiry (made up) | 50–100 enquiries/day = $1–2/day |
| Policy source API | Internal system | No additional cost |
| Officer time for review | ~2 min/enquiry | Down from 12 min (search + write) |
| Build cost | 4 weeks engineering (made up) | One-time |
| Maintenance | 0.5 day/week (made up) | Monitor, update context-skill |

**Total:** ~$500/month API + 4 weeks build + ongoing maintenance (all made up)

### 2. What's the return?

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Time per enquiry | 15 min | 5 min | 10 min/enquiry |
| Enquiries/day | 50–100 | Same | 500–1000 min/day saved |
| Officer hours saved | — | 8–17 hrs/day | ~1–2 FTE equivalent |
| SLA compliance | 72% | Target 90%+ | Fewer escalations |

**Payback:** If officer time costs $30/hr (made up), saving 10 hrs/day = $300/day = ~$6,000/month. Covers API cost + build cost in <2 months.

### 3. How long until we see results?

| Phase | Duration | Outcome |
|-------|----------|---------|
| Prototype testing | Week 1–2 | Know if officers trust drafts |
| Build MVP | Week 3–4 | Real LLM + policy API |
| Pilot | Week 5–6 | Measure time savings, edit rate |
| Decision | Week 7 | Continue, pivot, or stop |

**First signal:** 2 weeks (prototype testing with officers)  
**Full results:** 7 weeks (end of pilot)

### 4. What if it goes wrong?

| Failure mode | Impact | Mitigation |
|--------------|--------|------------|
| Wrong info in draft | Officer catches before send | Human approval on every reply |
| Wrong info reaches resident | 1 resident affected; correction email needed | Audit trail; service recovery process |
| Officers don't trust it | Tool unused; investment wasted | Kill switch at 5 in 10 usable drafts |
| Policy sources outdated | Drafts cite stale info | 90-day currency window; staleness alerts |
| LLM hallucinates | Unsourced claim in draft | Citation requirement; officer review |

**Worst case:** Wrong info reaches a resident. Damage is 1 resident + correction effort + reputation risk. Mitigated by mandatory officer review.

### 5. Who's accountable?

| Role | Person | Accountable for |
|------|--------|-----------------|
| Product owner | (add name) | Success metrics, continue/pivot/stop decision |
| Technical owner | (add name) | System reliability, LLM integration |
| Policy team lead | (add name) | Source accuracy, timely updates |
| ServiceSG ops lead | (add name) | Officer adoption, feedback collection |
| Sponsor (you) | (add name) | Funding decision, escalation path |

**Decision rights:** Product owner recommends; sponsor approves funding continuation at Week 7.

### 6. What's the exit plan?

| Scenario | Trigger | Action | Cost |
|----------|---------|--------|------|
| Success | 7+ in 10 drafts usable | Scale to more topics/teams | Continue funding |
| Pivot | Drafts useful but trust gap | Add features (e.g., passage highlighting) | Extend pilot 2 weeks |
| Stop | < 5 in 10 usable | Shut down; document learnings | Sunk cost only (~$10k made up) |
| Pause | > 50% sources outdated | Wait for policy team to catch up | Hold funding; resume when ready |

**Sunk cost if stopped:** ~4 weeks engineering + 6 weeks pilot = ~$10–15k (made up). No ongoing liability — agent cannot act without officers.

---

*All data in this file is synthetic and labelled as made up.*
