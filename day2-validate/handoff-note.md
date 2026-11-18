# Handoff Note: ServiceSG Enquiry Response Prototype

**Date:** 2026-11-18  
**From:** Product / AI Team  
**To:** Engineering

---

## What It Does

An AI-assisted reply tool for ServiceSG officers handling the shared enquiry inbox.

**User flow:**
1. Officer opens inbox, sees enquiries tagged by policy topic (Retirement, Withdrawal, CPF LIFE, Medisave, Housing, Fees, Other)
2. Officer selects an enquiry, clicks "Generate AI Draft"
3. AI returns a drafted reply with inline citations to policy sources
4. Officer reviews, edits if needed, sends
5. System records: action taken (sent as-is / edited / rewrote), time spent, citations viewed

**Key screens:**
- **Inbox panel** (340px sidebar): topic filter buttons, enquiry list with preview
- **Detail panel**: enquiry text, draft area with clickable citations, action buttons
- **Result modal**: shows metrics after send

**Prototype location:** `day2-validate/prototype/`

---

## How to Run the Prototype

```bash
cd day2-validate/prototype
python3 -m http.server 8080
```

Then open http://localhost:8080 in a browser.

**Quick test:**
1. Click any enquiry in the inbox
2. Click "Generate AI Draft"
3. Click a citation (e.g., CPF-001) → policy panel opens
4. Click "Send Reply" → result modal shows metrics
5. Try a "fees" enquiry → triggers failed lookup flow

---

## What Is Synthetic

Everything in this prototype is made up. Do not use any of this data in production.

| Item | Example | Status |
|------|---------|--------|
| Enquiry IDs | SG-2026-11847 | Made up |
| Resident emails | tan_ah_kow@example.com | Made up |
| Policy figures | FRS $205,800 | Made up |
| Source IDs | CPF-001, CPF-002, CPF-003, CPF-004 | Made up |
| Source URLs | cpf.gov.sg/retirement-sum | Made up |
| Review dates | 2026-10-01 | Made up |
| Enquiry text | All 16 scenarios | Made up |
| Draft replies | All hardcoded HTML | Made up |

The prototype tests UX and officer behavior, not AI quality or real policy accuracy.

---

## Data Contracts

Data is loaded from `data/*.json` via fetch. Swap these URLs to point at real APIs.

**Scenario shape** (`data/scenarios.json`):
```js
{
  id: 'SG-2026-11847',
  email: 'tan_ah_kow@example.com',
  date: '18 Nov, 9:32 AM',
  topic: 'retirement',           // one of 7 topic IDs
  preview: 'Hi, I recently...',
  enquiry: '<p>Full HTML...</p>',
  lookupSuccess: true,           // false → failed lookup UI
  failureMessage: '...',         // shown when lookup fails
  draftLabel: 'AI-drafted reply with citations',
  draftLabelClass: 'warning',    // optional
  draftHtml: '<p>Draft...</p>',
  draftPlain: 'Plain text...',
  citationCount: 3
}
```

**Policy shape** (`data/policies.json`):
```js
{
  'cpf-frs': {
    title: 'CPF-001: CPF Retirement Sum',
    content: 'The Full Retirement Sum...',
    lastReviewed: '2026-10-01'
  }
}
```

**Topic shape** (`data/topics.json`):
```js
{ id: 'retirement', name: 'Retirement' }
```

---

## What Is Missing for Production

### Must have before launch

| Gap | Why it matters | Effort |
|-----|----------------|--------|
| Real LLM integration | Drafts are hardcoded; need actual generation | High |
| Policy source API | 4 hardcoded sources → real policy repo | Medium |
| Loading state | No spinner on generate; real LLM has latency | Low |
| Error handling | No try/catch; API failures will crash | Low |
| Authentication | No login; need officer identity for audit | Medium |
| Persistent storage | Metrics lost on refresh; need backend | Medium |
| Staleness detection | 90-day rule is visual only; needs real date check | Low |

### Should have

| Gap | Why it matters |
|-----|----------------|
| Timer starts on enquiry open | Current timer underestimates total time |
| Edit distance tracking | "Light edit" vs "major rewrite" is subjective |
| Analytics backend | Manual observation won't scale |
| Accessibility audit | Not tested with screen readers |

### Out of scope for v1

| Feature | Reason |
|---------|--------|
| Image/attachment handling | Current tools can't read images |
| Multi-turn conversation | Reply threading out of scope |
| Auto-send without review | Human approval required |

---

## Decisions an Engineer Must Not Change Without Asking

These are deliberate product/policy choices, not technical debt.

### 1. Officer approves every reply
**Why:** Policy requirement. No auto-send, even if AI confidence is high.  
**Ask:** Product owner

### 2. Cite every claim
**Why:** Trust mechanism. Every figure, deadline, or rule must link to a source.  
**Ask:** Product owner, policy team

### 3. Single source per claim
**Why:** No inference. If a question spans two sources, say "I don't have a single source" instead of combining.  
**Ask:** Policy team (see context-skill.md Rule 5)

### 4. 90-day currency window
**Why:** Sources older than 90 days show "may be outdated" warning.  
**Ask:** Policy team (see context-skill.md Rule 2)

### 5. "Sent as-is / Edited / Rewrote" metric
**Why:** Primary success signal. Directly tests the hypothesis.  
**Ask:** Product owner

### 6. Three action buttons: Send, Edit, Rewrite
**Why:** Captures officer intent. "Rewrite from scratch" is a different signal than "Edit."  
**Ask:** Product owner

### 7. Topic filter categories
**Why:** Fixed list of 6 topics + Other. One topic per enquiry.  
**Ask:** Policy team

---

## Success Criteria and Kill Switch

**Pass:** 7 in 10 drafts sent after a light edit in officer testing.

**Fail (kill switch):**
- Officers get stuck >3 minutes on the core action, OR
- Officers rewrite most drafts from scratch

If kill switch is hit: check draft quality first before concluding officers distrust the concept.

---

## Known Quirks

| Quirk | Why it exists |
|-------|---------------|
| "fees" enquiries always fail lookup | Forced failure for testing error UI |
| CPF-004 shows "may be outdated" | lastReviewed is >90 days ago by design |
| Timer starts on Generate, not on open | Deliberate; tracks drafting time only |
| 16 scenarios but UI says "15" | Off-by-one in living-prd; code has 16 |

---

## Handoff Decision

**Decision:** Keep prototyping

**Why:** Haven't tested with real officers yet. Need their feedback before committing to a production spec.

**What we need to learn:**
- Do officers actually trust the cited drafts?
- How long do they spend reading before clicking Generate?
- Which citation formats work best (inline tags, sidebar panel, both)?
- What breaks when they hit edge cases?

**Next step:** Schedule 5–10 officer testing sessions with the current prototype. Observe behavior, collect feedback, then decide whether to proceed to production spec or iterate further.

---

## Files to Read

| File | What it contains |
|------|------------------|
| `day2-validate/living-prd.md` | Full PRD with 8 building blocks, extracted from code |
| `day2-validate/context-skill.md` | AI rules, sources, good/bad examples |
| `day2-validate/PROMPTS.md` | Prompt chain with test results |
| `day2-validate/prototype/` | Working prototype (index.html, app.js, styles.css, data/) |
| `one-pager.md` | Problem statement, hypothesis, success criteria |

---

## Contacts

| Role | Who | Ask about |
|------|-----|-----------|
| Product owner | (add name) | Success criteria, UX decisions, scope |
| Policy team | (add name) | Citation rules, source accuracy, topic list |
| Technical owner | (add name) | API contracts, integration approach |
| Original builder | (add name) | Why something was built a certain way |

---

*All data in this project is synthetic and labelled as made up.*
