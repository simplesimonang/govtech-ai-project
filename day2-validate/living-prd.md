# Living PRD: ServiceSG Enquiry Response

Extracted from the working prototype at `day2-validate/prototype/index.html`.

All data is synthetic and labelled as made up.

---

## 1. Product Overview

**What it is:** An AI-assisted reply tool for ServiceSG officers handling the shared enquiry inbox.

**How it works:**
1. Officer opens the inbox and sees enquiries tagged by policy topic
2. Officer selects an enquiry and clicks "Generate AI Draft"
3. AI returns a drafted reply with inline citations to policy sources
4. Officer reviews, edits if needed, and sends

**Key screens (from prototype):**
- **Inbox panel** (340px left sidebar): topic filter buttons, enquiry list with preview and topic labels
- **Detail panel** (flex right): enquiry text, draft area with citations, action buttons
- **Result modal**: shows metrics after send (time, action taken, citations viewed)

**Current state:** Clickable HTML prototype with 15 synthetic test cases across 7 topic categories.

---

## 2. Problem and Riskiest Assumption

**Problem:** Officers search policy pages before they can reply, so first replies run well past the one-day target.

**Evidence (from one-pager, made up):**
- Enquiries answered within SLA: 72%
- Average first reply: 3 days
- Minutes per policy search: 12

**Riskiest assumption:** Officers will trust a cited AI draft enough to edit it, rather than rewrite from scratch.

**Why it's risky:** If officers don't trust the draft, they'll spend time validating every line against the source — adding friction instead of removing it.

**Kill switch:** Officers get stuck >3 minutes, or rewrite most drafts. If hit, check draft quality before concluding officers distrust the concept.

---

## 3. User Flow and Screen Map

```
┌─────────────────────────────────────────────────────────────────┐
│  INBOX PANEL (340px)         │  DETAIL PANEL                   │
│                              │                                  │
│  [Topic Filter Buttons]      │  Header: Enquiry #ID            │
│  All(15) Retirement(3)...    │  Meta: email, date              │
│                              │                                  │
│  ┌────────────────────┐      │  ┌─────────────────────────┐    │
│  │ #SG-2026-11847     │      │  │ RESIDENT'S ENQUIRY      │    │
│  │ Preview text...    │ ───► │  │ [enquiry text box]      │    │
│  │ [Retirement]       │      │  └─────────────────────────┘    │
│  └────────────────────┘      │                                  │
│  ┌────────────────────┐      │  ┌─────────────────────────┐    │
│  │ #SG-2026-11923     │      │  │ REPLY                   │    │
│  │ Preview text...    │      │  │ [Generate AI Draft]     │    │
│  │ [Medisave]         │      │  └─────────────────────────┘    │
│  └────────────────────┘      │                                  │
│  ...                         │  After generate:                 │
│                              │  ┌─────────────────────────┐    │
│                              │  │ AI-drafted reply        │    │
│                              │  │ with [CPF-001] citations│    │
│                              │  │ [outdated warning]      │    │
│                              │  └─────────────────────────┘    │
│                              │                                  │
│                              │  [Send Reply] [Edit] [Rewrite]  │
│                              │  Time: 0:00                      │
└─────────────────────────────────────────────────────────────────┘
```

**States implemented:**
1. Empty state → "Select an enquiry"
2. Enquiry selected → shows enquiry text + "Generate AI Draft" button
3. Draft generated → shows draft with citations, action bar appears
4. Lookup failed → error UI with "Retry Lookup" and "Write Manually"
5. Edit mode → textarea replaces draft display
6. Result modal → shows metrics, "Continue Testing" button

---

## 4. Success Metrics

**Tracked in prototype (`showResult` function, lines 1340–1361):**

| Metric | How it's captured | Why it matters |
|--------|-------------------|----------------|
| Action taken | `Sent without changes` / `Sent after editing` / `Rewrote from scratch` | Primary signal: do officers trust the draft? |
| Time spent | `Date.now() - startTime` (starts on generate, not on open) | Secondary: does it save time? |
| Citations viewed | `citationsViewed.size` of `citationCount` | Trust proxy: do they verify? |
| Topic | From scenario data | Segment by policy area |

**Success threshold (from build-log.md):**
- Pass: 7 in 10 drafts sent after a light edit
- Fail: Officers rewrite most drafts, or stuck >3 minutes

**What's NOT tracked yet:**
- Time from enquiry open to generate click (reading time)
- Edit distance (how much they changed)
- Which specific edits they made

---

## 5. Technical Reality

**File structure:**
```
day2-validate/prototype/
├── index.html          # 1,388 lines — CSS, HTML, JS all inline
└── sample-policy-sources.md  # Documentation only, not used by code
```

**Data model (from JS, lines 610–1057):**

```js
// Scenario shape (15 instances)
{
  id: 'SG-2026-11847',
  email: 'tan_ah_kow@example.com',
  date: '18 Nov, 9:32 AM',
  topic: 'retirement',           // one of 7 topics
  preview: 'Hi, I recently...',
  enquiry: `Full enquiry HTML...`,
  lookupSuccess: true,           // false triggers failure flow
  failureMessage: '...',         // shown when lookup fails
  draftLabel: 'AI-drafted reply with citations',
  draftLabelClass: 'warning',    // optional styling
  draftHtml: `<p>Draft with <a class="citation">CPF-001</a>...</p>`,
  draftPlain: `Plain text version for editing...`,
  citationCount: 3
}

// Policy shape (4 instances)
{
  'cpf-frs': {
    title: 'CPF-001: CPF Retirement Sum (made up)',
    content: 'The Full Retirement Sum...',
    lastReviewed: '2026-10-01'
  }
}

// Topics (7 total)
['all', 'retirement', 'withdrawal', 'cpf-life', 'medisave', 'housing', 'fees', 'other']
```

**State variables (lines 1083–1091):**
```js
let currentFilter = 'all';
let selectedEnquiry = null;
let startTime = null;
let citationsViewed = new Set();
let isEditing = false;
let originalDraft = '';
let officerDraft = '';    // preserved across retry
let retryCount = 0;
```

---

## 6. Assumptions and Risks

### Assumptions baked into the prototype

| Assumption | Where it shows | Risk if wrong |
|------------|----------------|---------------|
| One topic per enquiry | `topic` is a string, not array | Multi-topic enquiries misclassified |
| Draft is instant | No loading state | Real LLM latency = bad UX |
| Policy sources exist | Hardcoded 4 sources | Real system needs source API |
| Officer reads before generate | Timer starts on generate, not open | Time metric underestimates |
| Single officer per enquiry | No assignment/lock | Concurrent edits lost |

### Known fragility

**Citation click handler (lines 1218–1226):**
- Attaches listeners after innerHTML set
- Stacks if `showDraft()` called twice
- No event delegation — won't work with streaming drafts

**Fix:** Use `document.addEventListener('click', ...)` with delegation on `.draft-reply`.

### What the prototype doesn't test

- Real LLM integration (latency, errors, rate limits)
- Multi-officer concurrency
- Source staleness detection (90-day rule)
- Image-based enquiries
- Reply threading / conversation history

---

## 7. In and Out of Scope

### In scope for prototype

| Feature | Status |
|---------|--------|
| Inbox with topic filter | ✅ Working |
| AI draft with citations | ✅ Working (hardcoded) |
| Citation click → policy panel | ✅ Working |
| Outdated source warning | ✅ Working (CPF-004) |
| Failed lookup flow | ✅ Working (fees topic) |
| Edit draft in place | ✅ Working |
| Rewrite from scratch | ✅ Working |
| Metrics tracking | ✅ Working |
| 15 test scenarios | ✅ Working |

### Out of scope for prototype

| Feature | Why excluded |
|---------|--------------|
| Real LLM integration | Prototype tests UX, not AI quality |
| User authentication | Not needed for officer testing |
| Persistent storage | Single-session prototype |
| Mobile responsive | Officers use desktop |
| Accessibility audit | Future work |
| Analytics backend | Manual observation for now |

### Out of scope for v1 (even after prototype)

| Feature | Reason |
|---------|--------|
| Image/attachment handling | Current tools can't read images |
| Multi-turn conversation | Reply to reply out of scope |
| Auto-send without review | Human approval required |

---

## 8. Engineering Recommendation

### Before handing to engineering

1. **Split the file:**
   - `styles.css` (480 lines)
   - `app.js` (790 lines)
   - `index.html` (107 lines)

2. **Extract data:**
   - `scenarios.json` — test cases
   - `policies.json` — policy sources
   - Makes it easier to swap real API later

3. **Add one smoke test:**
   - Playwright or Cypress
   - "Select enquiry → generate → send → modal shows"

4. **Document the API contract:**
   ```
   GET /api/enquiries → Scenario[]
   GET /api/draft?enquiryId=X → { draftHtml, draftPlain, citations[] }
   GET /api/policy/:id → Policy
   POST /api/send → { enquiryId, finalText, metrics }
   ```

### Fix before production

| Issue | Fix |
|-------|-----|
| Citation handler stacks | Event delegation |
| No loading state | Add spinner on generate |
| Timer starts late | Start on enquiry open, not generate |
| `officerDraft` lost on refresh | localStorage or session |
| No error handling | try/catch + fallback UI |

### What's production-ready now

- **Data contract:** The scenario shape is a clean API spec
- **Metric tracking:** `showResult` captures exactly what hypothesis needs
- **UI patterns:** Topic filter, inline citations, edit toggle — all work

---

## Prototype Review Notes

### Solid

**The scenario data contract** — complete specification of what backend returns. Engineer can build API by matching this shape.

### Fragile

**Citation click handler** — stacks listeners, no delegation. Needs rewrite for production.

### Surprising (positive)

**Tracks the right metric** — "sent as-is vs edited" directly answers the hypothesis. Most prototypes skip this.

---

*Extracted from working code. Last updated: 2026-11-18.*
