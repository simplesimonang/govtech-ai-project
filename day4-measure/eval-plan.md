# Eval Plan: ServiceSG Enquiry Reply Drafter

All data in this file is synthetic and labelled as made up.

---

## Who owns what

*Proposed*

| Responsibility | Role | Backup |
|----------------|------|--------|
| **Signs the pass bar** | Product Owner | Sponsor (for kill switch decisions) |
| **Writes new test cases** | Ops Lead (from officer feedback) | Product Owner (for tricky/deal-breaker cases) |
| **Refreshes test cases** | Policy Team Lead (when sources change) | Technical Owner (when agent rules change) |
| **Runs the eval** | Technical Owner | Ops Lead (manual fallback) |
| **Grades D1, D2, D3** | AI (automated) | Technical Owner (spot check) |
| **Grades D4, D5** | Ops Lead + one Officer (2 graders) | Product Owner (tie-breaker) |
| **Reviews weekly sample** | Ops Lead | Product Owner (if escalated) |
| **Approves case additions** | Product Owner | — |
| **Calibrates new graders** | Ops Lead | — |

---

## When it runs

*Proposed*

| Trigger | What runs | Who runs it | Turnaround |
|---------|-----------|-------------|------------|
| **Before go-live** | Full 31-case eval | Technical Owner | Pass required before launch |
| **Before every change to CLAUDE.md** | Full 31-case eval | Technical Owner | Within 1 working day of change |
| **Before every change to context-skill.md** | Cases using changed sources only | Policy Team Lead | Within 1 working day of change |
| **Weekly (Mondays)** | 10-case sample (3 everyday, 3 tricky, 4 deal-breaker) | Technical Owner | Results by Tuesday EOD |
| **Monthly (first Monday)** | Full 31-case eval | Technical Owner | Results within 3 working days |
| **When policy changes announced** | Cases using affected sources | Policy Team Lead | Within 48 hours of announcement |
| **After any deal-breaker failure** | Failed case + related cases | Technical Owner | Within 3 working days |

### Weekly sample selection

*Proposed*

Rotate through cases so all 31 are covered every 4 weeks:

| Week | Everyday | Tricky | Deal-breaker |
|------|----------|--------|--------------|
| 1 | 1, 2, 3 | 7, 8 | 10, 11, 13, 16, 25 |
| 2 | 4, 5, 6 | 9, 26 | 7, 14, 28, 31 |
| 3 | 17, 18, 19 | 27 | 10, 11, 13, 16, 25 |
| 4 | 20, 21, 22, 23, 24 | 7, 8 | 14, 28, 31 |

---

## How I'll know it's working

*Proposed*

### Goal

Officers send correct first replies faster because the agent drafts and cites policy sources for them.

### Baseline (before pilot)

| Metric | Baseline | Source |
|--------|----------|--------|
| Enquiries answered within SLA | 72% | ai-prd.md (made up) |
| Average first reply time | 3 days | ai-prd.md (made up) |
| Minutes per policy search | 12 | ai-prd.md (made up) |

### Target and review date

*Proposed*

| Metric | Target | Review date |
|--------|--------|-------------|
| Drafts sent after light edit | ≥ 70% (7 in 10) | 30 days after go-live |
| D4 average (usefulness) | ≥ 3.5 | Weekly |
| D5 average (tone) | ≥ 3.0 | Weekly |
| Deal-breaker pass rate | 100% | Every eval |
| Enquiries answered within SLA | ≥ 85% | 30 days after go-live |
| Average first reply time | ≤ 1 day | 30 days after go-live |

### Usage metric

*Proposed*

| Metric | What it measures | Target |
|--------|------------------|--------|
| **Adoption rate** | % of eligible enquiries where agent draft is generated | ≥ 90% within 2 weeks |
| **Edit rate** | % of drafts edited before send | Track trend (lower is better) |
| **Rewrite rate** | % of drafts rewritten from scratch | < 30% (kill switch if exceeded) |
| **Skip rate** | % of drafts where officer ignores and writes manually | < 20% |

### Pattern to watch first

*Proposed*

**Watch for:** Officers consistently rewriting drafts for one topic or source.

| Signal | What it means | Action |
|--------|---------------|--------|
| >50% rewrite rate on one topic | Source may be wrong or incomplete | Policy Team Lead reviews source |
| >50% rewrite rate on one case type | Agent rule may be wrong | Technical Owner reviews CLAUDE.md |
| Officers adding the same information every time | Source is missing common detail | Policy Team Lead updates source |
| Officers deleting the same phrase every time | Agent tone is off | Product Owner reviews tone guidelines |

### Stop line (kill switch)

*Proposed*

| Condition | Threshold | Who decides | Action |
|-----------|-----------|-------------|--------|
| Any deal-breaker case fails | 1 failure | Product Owner | Stop and fix within 3 days |
| D4 average drops below threshold | < 3.5 on everyday cases | Product Owner | Review draft quality |
| Rewrite rate too high | > 50% | Product Owner | Stop or pivot |
| Officers stuck on core action | > 3 minutes average | Ops Lead | Check draft quality |
| Source staleness rate | > 50% sources outdated | Policy Team Lead | Pause until sources updated |
| Wrong information sent to resident | 1 incident | Technical Owner / Ops Lead | Incident playbook (see operating-model.md) |

---

## First 30 days

*Proposed*

### Week 0 (before go-live)

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| -5 | Run full 31-case eval | Technical Owner | eval-results.md with pass |
| -5 | Calibrate graders (Ops Lead + 1 Officer) | Ops Lead | Graders aligned within 1 point on 80%+ cases |
| -3 | Product Owner signs pass bar | Product Owner | Approval recorded |
| -2 | Brief officers on agent and eval process | Ops Lead | Officers know how to flag issues |
| -1 | Confirm all 10 sources are current (<90 days) | Policy Team Lead | Source currency check complete |

### Week 1

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 1 | Go-live (soft launch to 3 officers) | Product Owner | Agent enabled |
| 2 | Daily check-in with pilot officers | Ops Lead | Feedback logged |
| 3 | Review first 20 drafts for patterns | Ops Lead | Issues flagged if any |
| 5 | Weekly 10-case eval (Week 1 sample) | Technical Owner | Results by EOD |
| 5 | Metrics review: adoption, edit rate, skip rate | Product Owner + Ops Lead | Dashboard updated |

### Week 2

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 8 | Expand to 5 more officers (8 total) | Product Owner | Approval documented |
| 10 | Weekly 10-case eval (Week 2 sample) | Technical Owner | Results by EOD |
| 10 | Review officer feedback, add new test cases if needed | Ops Lead | eval-cases.md updated (if needed) |
| 12 | Check source currency | Policy Team Lead | Flag any sources >90 days |

### Week 3

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 15 | Expand to all officers (full rollout) | Product Owner | Approval documented |
| 17 | Weekly 10-case eval (Week 3 sample) | Technical Owner | Results by EOD |
| 19 | Inter-rater reliability check | Ops Lead | Graders still aligned? Recalibrate if needed |

### Week 4

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 22 | Full 31-case eval (monthly) | Technical Owner | eval-results-YYYY-MM-DD.md |
| 24 | Weekly 10-case eval (Week 4 sample) | Technical Owner | Results by EOD |
| 26 | 30-day review: metrics vs targets | Product Owner | Continue/pivot/stop recommendation |
| 28 | Present results to Sponsor | Product Owner | Decision documented |
| 30 | Retrospective with team | Ops Lead | Lessons learned, process improvements |

### Success criteria at Day 30

*Proposed*

| Metric | Target | Status |
|--------|--------|--------|
| Deal-breaker pass rate | 100% | ☐ |
| D4 average (usefulness) | ≥ 3.5 | ☐ |
| D5 average (tone) | ≥ 3.0 | ☐ |
| Drafts sent after light edit | ≥ 70% | ☐ |
| Rewrite rate | < 30% | ☐ |
| Zero wrong-information incidents | 0 | ☐ |

**If all pass:** Continue to steady-state operations.

**If any fail:** Product Owner decides continue/pivot/stop with Sponsor input.

---

*All data in this file is synthetic and labelled as made up.*
