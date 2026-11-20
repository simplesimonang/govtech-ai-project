# One Pager

Use case: Scenario A · ServiceSG enquiry response (synthetic data only)

## Problem and user

**User:** ServiceSG officers working the shared enquiry inbox during office hours, busiest in the week after a policy change.

**Problem:** Officers search policy pages before they can reply, so first replies run well past the one-day target.

**Goal:** Residents get a correct first reply within one working day.

**Evidence (made up):**
- Enquiries answered within SLA: 72%
- Average first reply: 3 days
- Minutes per policy search: 12

**User quotes (made up):**
- "I spend longer finding the right policy page than writing the reply."
- "When an enquiry has a photo, I open it and retype what it says."

## Opportunity and evidence

**Opportunity:** Draft first replies automatically using AI that cites the policy page it used, so officers can review and send instead of searching and writing from scratch.

**Hypothesis:** Officers will send an AI-drafted first reply after a light edit when every draft cites the policy page it used.

**Success signal:** 7 in 10 drafts sent after a light edit in a two-week pilot. (made up)

**Kill switch:** Officers get stuck on the core action within 3 minutes, or rewrite most of the draft.

## Experience and trust

**Moment:** An officer opens an enquiry and sees a drafted first reply, with the policy pages it used.

**AI-UX level reached:** 1 of 3

**What we ship:** A Level-2 UI — a reliable validator the user can check in under three seconds. A reliable validator beats a magical liar.

**Trust gaps and moves:**
- Black box → Inline citation on every claim, linked to the passage
- Hallucination → Dotted underline and draft watermark on low-confidence lines
- Control → One-click restore original, every draft editable in place

**Constraints:** An officer approves every reply. Synthetic data only. Some enquiries include images the current tools cannot read.

## Risks (market, technical, team)

### Market risk
Officers don't trust AI drafts — they validate every line with the source, which slows them down instead of speeding them up.

**How we test:** Track citation clicks and time per enquiry in prototype testing. If more than 80% of officers click every citation before sending, the trust gap is too wide and the tool adds friction rather than removing it.

### Technical risk
Policy sources go stale — owners don't update them in the central repo, so AI drafts cite outdated information.

**How we test:** Track how many flagged sources get updated within 5 working days during the pilot. Fail if fewer than half are updated within two weeks. (See build-log.md for kill switch.)

### Team risk
Officers over-trust and send without reading — errors reach residents because officers assume the AI is always correct.

**How we test:** Add a "time before send" metric. If officers send in under 30 seconds without clicking any citation, flag those replies for review. If this happens often, add friction such as a confirmation step before sending.

## Build plan and handoff

**Phase 1 — Validate (current):**
1. Build clickable prototype with sample enquiries and AI drafts
2. Test with officers: do they edit or rewrite?
3. Pass/fail: 7 in 10 drafts sent after light edit

**Phase 2 — Build:**
1. Connect to policy source repository
2. Implement citation extraction and linking
3. Add staleness detection (90-day currency window)
4. Build officer-facing UI with edit and send controls

**Phase 3 — Pilot:**
1. Two-week pilot with ServiceSG officers
2. Track metrics: time to reply, edit rate, citation clicks
3. Collect feedback on draft quality

**Handoff:** If pilot passes, hand off to ServiceSG product team with documentation, context-skill.md, and metrics dashboard.

## Agent role and guardrails

**Agent role:** Draft first replies to policy enquiries by retrieving the relevant policy page and composing a response with inline citations. The agent proposes; humans dispose.

**What the agent decides alone:**
- Classify enquiry by topic (keyword match)
- Look up policy source (deterministic)
- Check source currency (date comparison)
- Add warnings for outdated sources

**What the agent proposes and waits:**
- Draft reply with citations → officer reviews before send
- Flag low-confidence claims → officer verifies or removes

**What stays human:**
- Send reply to resident (policy requirement)
- Access resident account data (privacy)
- Override policy sources (authority)
- Decide continue/pivot/stop (accountability)

**Guardrails:**
1. Cite every claim — every figure, deadline, or rule links to a source
2. One source per claim — multiple sources allowed for distinct claims, but no inference across sources
3. Scope boundary — if no source applies, route to human (never redirect citizen to another agency)
4. Currency window — flag sources older than 90 days as "may be outdated"
5. Human approval — an officer reviews and approves every reply before it is sent
6. Sensitive handling — route scams, distress, complaints, escalation threats to human immediately

**Stop conditions:** Agent routes to human when: no source covers the topic, sources contradict, enquiry has images, resident asks for account info, or sensitive indicators detected. Project stops if officers rewrite most drafts or get stuck >3 minutes.

## Roles and operating model

| Role | Responsibility |
|------|----------------|
| Officer | Reviews AI draft, edits if needed, approves and sends reply |
| Ops Lead | Day-to-day operations, incident commander, can pause agent up to 4 hours |
| Product Owner | Success metrics, scope decisions, continue/pivot/stop |
| Technical Owner | System reliability, LLM integration, root cause analysis |
| Policy Team Lead | Source accuracy, updates flagged sources within 5 days |
| Sponsor | Funding decisions, escalation path, pause authority >24 hours |

**Decision rights:**

| Decision | Who decides | Who is consulted |
|----------|-------------|------------------|
| Scope | Product Owner | Policy Team Lead, Ops Lead |
| Permissions | Product Owner | Policy Team Lead, Security Lead |
| Go-live | Product Owner | Ops Lead, Technical Owner |
| Incident | Ops Lead (service) / Technical Owner (system) | Product Owner |
| Retire | Sponsor | Product Owner, Ops Lead |

**Incident response:** Officer flags error → Ops Lead decides pause/continue → Product Owner notifies Sponsor within 4 hours. See `day3-build/operating-model.md` for full playbook.

**Review cadence:** Metrics weekly, sources monthly, permissions quarterly.

## Strategy and roadmap

**Diagnosis:** Officers waste time searching for policy pages instead of writing replies.

**Guiding policy:** Have a central place containing single sources of truth where officers can easily retrieve accurate, reliable, and current information.

**Coherent actions:**
1. Have validated sources
2. Check for currency and updates
3. Flag out inconsistencies

**Roadmap:**
- Week 1–2: Prototype testing with officers
- Week 3–4: Build MVP with real policy sources
- Week 5–6: Two-week pilot
- Week 7: Decision — continue, pivot, or stop

## Metrics plan and stop line

**Primary metric:** Share of drafts sent after a light edit (target: 7 in 10)

**Secondary metrics:**
- Time from enquiry opened to reply sent
- Citation click rate per draft
- Source staleness rate (% of sources older than 90 days)
- Officer-reported draft accuracy

**Stop line:** Below 5 in 10 drafts usable after light edit. If hit, revisit the model/algorithm first — check draft quality before concluding officers distrust the concept.

## Evals and gates

**Gate 1 — Prototype (current):**
- Pass: 7 in 10 officers send draft after light edit
- Fail: Officers rewrite most drafts, or stuck >3 minutes

**Gate 2 — Source feasibility:**
- Pass: Policy owners update 8 in 10 flagged pages within 5 working days
- Fail: Fewer than half updated within two weeks

**Gate 3 — Pilot:**
- Pass: Time to first reply drops, draft accuracy rated acceptable by officers
- Fail: Error rate increases, or officers bypass the tool

**Test cases:** 31 cases covering everyday (18), tricky (6), must-refuse (7). Nine deal-breakers that fail the whole eval if one fails. See `day4-measure/eval-cases.md`.

**Human rubric (5 dimensions):**
- D1: Citations (Yes/No) — deal-breaker
- D2: Scope (Yes/No) — deal-breaker
- D3: Sensitive handling (Yes/No/N/A) — deal-breaker
- D4: Usefulness (1-5) — target avg ≥ 3.5
- D5: Tone (1-5) — target avg ≥ 3.0

**Latest eval result:** 31/31 cases passed, 9/9 deal-breakers passed, D4 avg 4.8, D5 avg 4.8. See `day4-measure/eval-results.md`.

**Eval cadence:** Before go-live, before every change, weekly 10-case sample, monthly full 31-case. See `day4-measure/eval-plan.md`.

## Decision: continue, pivot or stop

**Current decision:** Continue to prototype testing.

**Decision criteria after prototype:**
- Continue: 7+ in 10 drafts sent after light edit, officers trust citations
- Pivot: Drafts useful but citations not trusted → add passage highlighting
- Stop: Officers rewrite most drafts → revisit whether AI-drafted replies solve the right problem

## Open issues

1. ~~How do we handle enquiries with images the AI cannot read?~~ → Route to human (stop condition)
2. ~~What happens when two policy pages contradict each other?~~ → Flag both, do not draft (stop condition)
3. ~~How do we measure "light edit" vs "major rewrite" objectively?~~ → D4 rubric: 4-5 = light edit, 1-2 = rewrite
4. Who owns the central policy repo long-term?
5. ~~What is the escalation path if the AI gives incorrect information that reaches a resident?~~ → Incident playbook in operating-model.md

**Resolved in Day 4:**
- Added no-redirect rule: agent never tells citizen to "check with another agency" — ServiceSG is the one-stop shop
- Added sensitive case handling: scam, distress, complaint, escalation threats route to human immediately
- Expanded scope from CPF-only to 5 agencies (CPF, HDB, LTA, ICA, IRAS) with 10 sources

## Notes

### Strategy Kernel

**Diagnosis:** Officers waste time searching for policy pages instead of writing replies.

**Guiding policy:** Have a central place containing single sources of truth where officers can easily retrieve accurate, reliable, and current information.

**Coherent actions:**
1. Have validated sources
2. Check for currency and updates
3. Flag out inconsistencies
