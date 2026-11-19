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

*All data in this file is synthetic and labelled as made up.*
