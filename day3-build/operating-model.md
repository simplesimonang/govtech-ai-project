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
