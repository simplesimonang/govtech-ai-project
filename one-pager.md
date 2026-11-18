# One Pager

Use case: [your chosen scenario (A, B, or C), written with synthetic data only]

## Problem and user
## Opportunity and evidence
## Experience and trust
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
## Agent role and guardrails
## Roles and operating model
## Strategy and roadmap
## Metrics plan and stop line
## Evals and gates
## Decision: continue, pivot or stop
## Open issues

## Notes

### Strategy Kernel

**Diagnosis:** Officers waste time searching for policy pages instead of writing replies.

**Guiding policy:** Have a central place containing single sources of truth where officers can easily retrieve accurate, reliable, and current information.

**Coherent actions:**
1. Have validated sources
2. Check for currency and updates
3. Flag out inconsistencies
