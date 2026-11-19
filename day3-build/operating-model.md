# Operating Model: ServiceSG Enquiry Reply Drafter

All data in this file is synthetic and labelled as made up.

---

## Roles

| Role | Responsibility |
|------|----------------|
| **Product Owner** | Owns success metrics, decides continue/pivot/stop, approves scope changes |
| **Technical Owner** | Owns system reliability, LLM integration, API contracts, incident response |
| **Policy Team Lead** | Owns source accuracy, approves new sources, updates flagged sources within SLA |
| **Ops Lead** | Owns officer adoption, collects feedback, manages day-to-day operations |
| **Officer** | Reviews every draft, edits if needed, approves and sends replies |
| **Sponsor** | Approves funding, escalation path for cross-team blockers |
| **Security/Privacy Lead** | Approves data handling, reviews access controls, incident escalation |
| **Vendor Manager** | Manages LLM vendor relationship, contract terms, SLA enforcement |

---

## Decision rights

| Harness part | Who decides | Who is consulted | Who is told |
|--------------|-------------|------------------|-------------|
| **Scope** — what the agent can and cannot do | Product Owner | Policy Team Lead, Ops Lead, Technical Owner | Officers, Sponsor |
| **Permissions** — Auto / Confirm / Block settings | Product Owner | Policy Team Lead, Security/Privacy Lead | Technical Owner, Officers |
| **Vendor and model** — which LLM, which version | Technical Owner | Product Owner, Vendor Manager, Security/Privacy Lead | Ops Lead, Sponsor |
| **Go-live** — when to launch or expand | Product Owner | Ops Lead, Technical Owner, Policy Team Lead | Officers, Sponsor |
| **Incident** — what to do when something goes wrong | Technical Owner (system) / Ops Lead (service) | Product Owner, Security/Privacy Lead | Sponsor, Officers |
| **Retire** — when to shut down or pause | Sponsor | Product Owner, Ops Lead, Technical Owner | Officers, Policy Team Lead |

---

## How to read this table

- **Who decides:** Has final authority. One role only.
- **Who is consulted:** Must be asked before the decision. Their input shapes it, but they don't have veto.
- **Who is told:** Informed after the decision is made. No input required, but they need to know.

---

## Decision examples

### Scope

*"Should the agent handle enquiries about HDB grants?"*

- **Decides:** Product Owner — it's a scope expansion
- **Consulted:** Policy Team Lead (do we have a source?), Ops Lead (do officers want it?), Technical Owner (is it feasible?)
- **Told:** Officers (new capability coming), Sponsor (scope is growing)

### Permissions

*"Should 'Draft reply' move from Confirm to Auto?"*

- **Decides:** Product Owner — it changes the human-in-the-loop model
- **Consulted:** Policy Team Lead (policy compliance), Security/Privacy Lead (risk assessment)
- **Told:** Technical Owner (implementation change), Officers (their workflow changes)

### Vendor and model

*"Should we switch from Claude to GPT-4?"*

- **Decides:** Technical Owner — it's a technical implementation choice
- **Consulted:** Product Owner (cost/quality tradeoff), Vendor Manager (contract implications), Security/Privacy Lead (data handling)
- **Told:** Ops Lead (may affect draft quality), Sponsor (cost may change)

### Go-live

*"Are we ready to launch the pilot?"*

- **Decides:** Product Owner — owns the launch decision
- **Consulted:** Ops Lead (officers ready?), Technical Owner (system stable?), Policy Team Lead (sources current?)
- **Told:** Officers (it's happening), Sponsor (pilot is starting)

### Incident

*"Wrong information reached a resident."*

- **Decides:** Technical Owner (if system bug) / Ops Lead (if process issue) — depends on root cause
- **Consulted:** Product Owner (comms strategy), Security/Privacy Lead (if data involved)
- **Told:** Sponsor (escalation), Officers (what to do next)

### Retire

*"Should we shut down after pilot fails?"*

- **Decides:** Sponsor — owns funding decision
- **Consulted:** Product Owner (what did we learn?), Ops Lead (officer impact), Technical Owner (shutdown process)
- **Told:** Officers (tool going away), Policy Team Lead (no more source update requests)

---

## Escalation paths

| Situation | First contact | Escalates to |
|-----------|---------------|--------------|
| Agent gives wrong answer | Officer flags → Ops Lead | Product Owner if pattern emerges |
| Policy source is wrong | Officer flags → Policy Team Lead | Product Owner if not updated within 5 days |
| System is down | Technical Owner | Sponsor if >4 hours |
| Officer refuses to use tool | Ops Lead | Product Owner |
| Kill switch triggered | Product Owner | Sponsor for continue/pivot/stop |
| Privacy incident | Security/Privacy Lead | Sponsor immediately |

---

## Incident playbook: wrong answer reached resident

*Scenario: At 08:00 Monday, an officer discovers the agent drafted a reply with incorrect information, and the officer sent it to a resident.*

### How the error is discovered

| Trigger | Who notices | Action |
|---------|-------------|--------|
| Resident replies pointing out error | Officer reading inbox | Flags immediately |
| Officer spots error after sending | Officer | Flags immediately |
| Another officer notices during review | Officer | Flags immediately |
| Supervisor spot-checks sent replies | Ops Lead | Starts at T+5 min |

### Severity levels

| Level | Definition | Response |
|-------|------------|----------|
| **Low** | Minor wording issue, correct info | Log only; no correction needed |
| **Medium** | Wrong figure or date, resident not yet acted | Correction email within 30 min |
| **High** | Wrong eligibility advice, resident may act on it | Correction email + phone call; pause agent |
| **Critical** | Financial harm possible, multiple residents affected | Pause agent immediately; escalate to Sponsor |

### On-call contacts (made up)

| Role | Primary | Backup | Hours |
|------|---------|--------|-------|
| Ops Lead | (add name) | (add name) | Office hours (Mon–Fri 08:00–18:00) |
| Technical Owner | (add name) | (add name) | Office hours + on-call for Critical |
| Product Owner | (add name) | — | Office hours; reachable for High/Critical |

**Outside office hours:** Critical incidents only. Technical Owner on-call handles pause decision; Product Owner notified next business day for Medium/High.

### Timeline

| Time | Who | Action |
|------|-----|--------|
| T+0 min | **Officer** | Discovers error. Flags in system. Notifies Ops Lead immediately (Slack/call). |
| T+5 min | **Ops Lead** | Acknowledges. Assesses: one-off or pattern? Notifies Technical Owner. |
| T+15 min | **Ops Lead** | Decides: pause agent (if pattern) or continue (if one-off). Has authority to pause for up to 4 hours. |
| T+30 min | **Officer** | Sends correction email to resident. Uses standard template. Ops Lead reviews before send. |
| T+1 hr | **Ops Lead** | Notifies Product Owner with summary: what happened, who affected, action taken. |
| T+2 hr | **Technical Owner** | Completes root cause analysis (RCA). Was it source, model, or process? |
| T+4 hr | **Product Owner** | Decides: resume agent, keep paused, or escalate to Sponsor. Notifies Sponsor either way. |
| T+24 hr | **Product Owner** | Posts incident summary to team. Updates metrics dashboard if needed. |

### Who does what

| Role | Responsibility in this incident |
|------|--------------------------------|
| **Officer** | First to know. Flags error. Sends correction to resident. |
| **Ops Lead** | Incident commander. Decides pause/continue. Coordinates response. |
| **Technical Owner** | Root cause analysis. Fixes system if needed. |
| **Product Owner** | Comms to Sponsor. Decides whether to resume or escalate. |
| **Sponsor** | Told within 4 hours. Decides if incident triggers kill switch review. |
| **Policy Team Lead** | Consulted if source was wrong. Updates source if needed. |

### Kill switch authority

| Duration | Who can pause | Who must approve resume |
|----------|---------------|------------------------|
| Up to 4 hours | Ops Lead | Ops Lead (own judgment) |
| 4–24 hours | Product Owner | Product Owner |
| >24 hours | Sponsor | Sponsor |

### Correction template (made up)

```
Subject: Correction to our earlier reply – [Enquiry #ID]

Dear [Resident],

We wrote to you earlier about [topic]. We have since found that 
the information we provided was not correct.

The correct information is: [corrected statement with source].

We apologise for any confusion. If you have already acted on our 
earlier reply, please [specific guidance].

If you have questions, please reply to this email or call us at [number].

Warm regards,
ServiceSG
```

### Post-incident

| Action | Owner | Deadline |
|--------|-------|----------|
| Log incident in tracker | Ops Lead | Same day |
| Root cause analysis | Technical Owner | 24 hours |
| Update context-skill.md if source issue | Policy Team Lead | 48 hours |
| Review: should permission move from Auto to Confirm? | Product Owner | 1 week |
| Share learnings with team | Product Owner | 1 week |

---

## Review cadence

| What | How often | Who |
|------|-----------|-----|
| Metrics review | Weekly | Product Owner, Ops Lead |
| Source currency check | Monthly | Policy Team Lead |
| Model performance review | Monthly | Technical Owner, Product Owner |
| Continue/pivot/stop decision | At gate milestones | Product Owner, Sponsor |
| Permission settings review | Quarterly | Product Owner, Security/Privacy Lead |

---

*All data in this file is synthetic and labelled as made up.*
