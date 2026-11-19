# AI PRD: ServiceSG Enquiry Reply Drafter

All data in this file is synthetic and labelled as made up.

---

## Problem and user

**User:** ServiceSG officers working the shared enquiry inbox during office hours.

**Problem:** Officers search policy pages before they can reply, so first replies run well past the one-day target.

**Evidence (made up):**
- Enquiries answered within SLA: 72%
- Average first reply: 3 days
- Minutes per policy search: 12

**Goal:** Residents get a correct first reply within one working day.

**Volume:** 50–100 enquiries/day across 7 topic categories (made up)

---

## Instructions

The agent drafts first replies to resident enquiries about CPF policy.

**Core task:** Retrieve the relevant policy source, check its currency, and compose a response with inline citations. Present the draft to an officer for review.

**Success signal:** 7 in 10 drafts sent after a light edit.

**Tone:** Professional, helpful, clear. Match ServiceSG house style.

**Format:**
- Opening: Thank the resident
- Body: Answer the question with inline citations
- Closing: Point to official source URL

**Citation rule:** Every figure, deadline, or eligibility rule must link to a source. One source per claim; multiple sources allowed for distinct claims. No inference across sources.

**Scope boundary:** Only answer questions covered by a listed source. If no source applies, say "I don't have information on this" and route to human.

---

## Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `lookup_policy` | Retrieve policy source by topic | `topic: string` | `{ sourceId, title, content, lastReviewed, url }` |
| `check_currency` | Verify source is within 90-day window | `lastReviewed: date` | `{ isCurrent: boolean, daysSinceReview: number }` |
| `draft_reply` | Compose reply with inline citations | `enquiry: string, sources: Source[]` | `{ draftHtml, draftPlain, citations: Citation[] }` |
| `flag_for_review` | Route to human when agent cannot proceed | `enquiryId: string, reason: string` | `void` |
| `log_action` | Record metrics after officer action | `enquiryId: string, action: string, timeSpent: number` | `void` |

**Tool not available:**
- No web browsing
- No access to resident account systems
- No external APIs beyond approved policy sources

---

## API contracts (for engineering)

### Enquiry input schema

```json
{
  "id": "SG-2026-11847",
  "email": "tan_ah_kow@example.com",
  "date": "18 Nov, 9:32 AM",
  "topic": "retirement",
  "preview": "Hi, I recently turned 55...",
  "enquiry": "<p>Full enquiry HTML...</p>"
}
```

### Draft output schema

```json
{
  "draftHtml": "<p>Dear Resident...</p>",
  "draftPlain": "Dear Resident...",
  "citations": [
    { "id": "CPF-001", "count": 2 },
    { "id": "CPF-002", "count": 1 }
  ],
  "warnings": ["source_outdated"],
  "lowConfidenceSpans": [12, 45]
}
```

### Citation HTML format

```html
<a href="#" class="citation" data-policy="cpf-frs">CPF-001</a>
```

Low-confidence text:
```html
<span class="low-confidence">Text here</span><span class="low-confidence-tag">(verify)</span>
```

Outdated warning:
```html
<div class="outdated-warning">This source was last reviewed on 2026-07-10 and may be outdated.</div>
```

### Policy source location

Sources are defined in `day2-validate/context-skill.md`:

| Source ID | Topic mapping | URL (made up) |
|-----------|---------------|---------------|
| CPF-001 | retirement | cpf.gov.sg/retirement-sum |
| CPF-002 | withdrawal | cpf.gov.sg/withdrawal-55 |
| CPF-003 | cpf-life | cpf.gov.sg/cpf-life |
| CPF-004 | medisave | cpf.gov.sg/medisave |

**Note:** Housing and Fees topics have no source. Enquiries on these topics trigger "no source found" flow.

### Topic classification

One topic per enquiry. Classification is done upstream (inbox system) before agent sees it. Agent does not reclassify.

| Topic ID | Display name |
|----------|--------------|
| retirement | Retirement |
| withdrawal | Withdrawal |
| cpf-life | CPF LIFE |
| medisave | Medisave |
| housing | Housing |
| fees | Fees |
| other | Other |

---

## Context and memory

### What the agent knows at start

- Policy sources: 4 CPF-related sources (CPF-001 to CPF-004)
- Topic mapping: Retirement, Withdrawal, CPF LIFE, Medisave, Housing, Fees, Other
- Citation rules from context-skill.md
- 90-day currency window

### What the agent retrieves per request

- Enquiry text from inbox
- Policy source content via `lookup_policy`
- Source currency status via `check_currency`

### What the agent does NOT have

- Resident personal data or account information
- Previous conversation history with the resident
- Officer identity or authentication
- Access to sources outside the approved list

### Memory across requests

- None. Each enquiry is stateless. The agent does not remember previous drafts or officer feedback.

---

## Permissions

Every action the agent takes, with tier and proposed setting.

| Action | Tier | Setting | Reason |
|--------|------|---------|--------|
| **Read enquiry text** | Read | Auto | Input to the task; no modification |
| **Look up policy source** | Read | Auto | Retrieves from approved list only |
| **Check source currency** | Read | Auto | Date comparison; no judgment |
| **Classify enquiry by topic** | Draft | Auto | Wrong topic is visible to officer, correctable |
| **Draft reply with citations** | Draft | Confirm | Core output; officer reviews before send |
| **Add outdated source warning** | Draft | Auto | Warning only; officer decides action |
| **Flag low-confidence claim** | Draft | Auto | Visual marker; officer verifies |
| **Route enquiry to human** | Write | Auto | Fails safe; officer handles manually |
| **Flag source for policy team** | Write | Confirm | Creates work for another team |
| **Log metrics (anonymised)** | Write | Auto | Internal only; no resident impact |
| **Send reply to resident** | Send | Block | Policy requirement; officer must approve |
| **Access resident account data** | Read | Block | Privacy; agent has no access |
| **Override policy source content** | Write | Block | Authority; only policy team can change |
| **Combine sources to infer new rule** | Draft | Block | No inference across sources |

**Tier definitions:**
- **Read:** Retrieve information without modification
- **Draft:** Create content for human review
- **Write:** Modify system state (logs, flags, routing)
- **Send:** Deliver content to external recipient (resident)

**Setting definitions:**
- **Auto:** Agent proceeds without confirmation
- **Confirm:** Agent proposes; human approves before action
- **Block:** Agent cannot perform this action

---

## Human checkpoints

| Checkpoint | Who decides | What they see | Agent role |
|------------|-------------|---------------|------------|
| Before send | Officer | Full draft with citations, edit option | Proposes draft; cannot send |
| Source conflict | Officer + Policy team | Both sources, conflict flag | Flags issue; does not resolve |
| No source found | Officer | "I don't have information" message | Routes to human; officer writes manually |
| Outdated source | Officer | Warning banner on draft | Shows warning; officer decides whether to proceed |
| Low-confidence claim | Officer | Dotted underline on uncertain text | Marks text; officer verifies or removes |
| Escalate to policy team | Officer | Officer routes; agent flags | Provides flag; officer routes |

**Escalation path:**
1. Agent flags issue → Officer reviews
2. Officer unsure → Routes to Policy team
3. Policy team updates source → Agent uses updated source next time

---

## Stop conditions

### Agent-level stops

| Condition | Agent action | Reason |
|-----------|--------------|--------|
| No source covers the topic | Say "I don't have information on this" | Scope boundary |
| Two sources contradict | Flag both for review; do not draft | No inference rule |
| Source older than 90 days | Draft with warning; let officer decide | Currency window |
| Enquiry contains image/attachment | Route to human | Cannot read images |
| Resident asks for personal account info | Route to human | No access to accounts |
| Confidence below threshold | Add dotted underline; let officer verify | Trust mechanism |

### Project-level stops (kill switch)

| Signal | Threshold | Action |
|--------|-----------|--------|
| Officers stuck on core action | > 3 minutes | Check draft quality before concluding distrust |
| Officers rewrite most drafts | > 50% rewrites | Revisit whether AI drafts solve the problem |
| Drafts usable after light edit | < 5 in 10 | Stop or pivot |
| Source staleness rate | > 50% sources outdated | Pause until policy team catches up |

---

## Logs

### What to log

| Event | Fields | Example |
|-------|--------|---------|
| Draft generated | enquiryId, topic, sources used, timestamp | SG-2026-11847, retirement, [CPF-001], 2026-11-19T09:32:00Z |
| Citation clicked | enquiryId, sourceId, timestamp | SG-2026-11847, CPF-001, 2026-11-19T09:33:15Z |
| Action taken | enquiryId, action, timeSpent | SG-2026-11847, edited, 45s |
| Source flagged | sourceId, reason, flaggedBy | CPF-004, outdated, system |
| Routed to human | enquiryId, reason | SG-2026-11923, no_source_found |

### What NOT to log

- Resident personal information (name, NRIC, email content)
- Officer identity (unless anonymised)
- Full enquiry text (store ID only)
- Full draft content (store citation IDs only)

### Log retention

| Type | Retention |
|------|-----------|
| Metrics | 90 days |
| Audit trail | 1 year |
| Personal data | Do not store |

---

## Business rules

| Rule | Source | Consequence if broken |
|------|--------|----------------------|
| Officer approves every reply | Policy requirement | Compliance violation; resident receives unreviewed content |
| Cite every claim | Trust mechanism | Hallucination risk; officer cannot verify |
| One source per claim | context-skill.md Rule 5 | Inference across sources; potential contradiction |
| Multiple sources for distinct claims | context-skill.md Rule 5 (updated) | Agent can answer multi-part questions |
| 90-day currency window | context-skill.md Rule 2 | Resident receives outdated information |
| No access to account data | Privacy policy | Privacy violation; data breach |
| Synthetic data only (prototype) | Project constraint | Real data exposed in testing |

---

## What engineering decides

These are implementation choices, not product or policy decisions. Engineering may change them without asking product.

| Decision | Options | Default |
|----------|---------|---------|
| LLM model selection | Claude, GPT-4, etc. | Engineering choice based on cost/quality |
| Response latency target | 2s, 5s, 10s | Engineering decides SLA |
| Retry logic for API failures | Exponential backoff, fixed, none | Engineering choice |
| Cache strategy for policy sources | TTL, on-demand, none | Engineering decides based on update frequency |
| Log storage backend | CloudWatch, Datadog, ELK, etc. | Engineering choice |
| Error message wording | Varies | Engineering writes user-facing error text |
| Loading spinner design | Varies | Engineering/design choice |
| Mobile responsiveness | Yes/No | Out of scope for v1 per handoff-note |

---

## Open decisions

Decisions that need input before engineering can build.

| # | Decision | Options | Who decides | Impact if deferred |
|---|----------|---------|-------------|-------------------|
| 1 | **Confidence threshold** | 0.7 / 0.8 / 0.9 / none | Product + Policy | Too high = everything marked uncertain; too low = false confidence |
| 2 | **What counts as "light edit"?** | < 20% characters changed / < 30 sec editing / officer self-report | Product | Affects success metric (7 in 10) interpretation |
| 3 | **Multi-topic enquiries** | Primary topic only / split drafts / refuse | Product + Policy | Agent currently assumes one topic per enquiry |
| 4 | **LLM timeout handling** | Retry once / show error / fall back to template | Engineering + Product | Affects UX when LLM is slow |
| 5 | **Rate limit handling** | Queue / reject / degrade | Engineering + Product | Affects peak load behavior |
| 6 | **Image-based enquiries** | Route to human / attempt OCR | Product + Engineering | OCR adds cost and complexity |
| 7 | **Concurrent editing** | Lock enquiry / last-write-wins / merge | Engineering + Product | Affects multi-officer scenarios |

---

*All data in this file is synthetic and labelled as made up.*
