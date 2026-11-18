# Opportunity: First replies to ServiceSG enquiries that need a policy lookup

**Scenario:** A · ServiceSG enquiry response

All quotes and metrics are synthetic and labelled as made up.

## Problem Framework

### 1. Goal

Residents get a correct first reply within one working day.

### 2. Problem

Officers search policy pages before they can reply, so first replies run well past the one-day target.

### 3. Context

ServiceSG officers working the shared enquiry inbox during office hours, busiest in the week after a policy change.

### 4. Constraints

An officer approves every reply. Synthetic data only. Some enquiries include images the current tools cannot read.

### 5. Success

Pass if officers send 7 in 10 drafted replies after a light edit in a two-week pilot. Fail below 5 in 10. (made up)

### 6. Explore

Will officers edit a cited draft, or rewrite it from scratch?

## Evidence (synthetic)

### User quotes

- "I spend longer finding the right policy page than writing the reply." (made up)
- "When an enquiry has a photo, I open it and retype what it says." (made up)

### Metrics

- Enquiries answered within SLA: 72% (made up)
- Average first reply: 3 days (made up)
- Enquiries with an image: 1 in 5 (made up)
- Minutes per policy search: 12 (made up)

## Hypothesis

I'm testing whether officers will send an AI-drafted first reply after a light edit when every draft cites the policy page it used.

- Risk type: Usability (build a clickable mockup first)
- Kill switch: Officers trust a cited draft enough to edit it instead of starting over.
- Kill-switch signal: Officers get stuck on the core action within 3 minutes, or rewrite most of the draft. (Starting threshold — adjust based on query complexity during testing.)
- If kill switch is met: Revisit the model or algorithm first — the AI-generated reply may be inaccurate, incomplete, or poorly structured. Check draft quality before concluding that officers distrust the concept itself.
- Success signal: 7 in 10 drafts sent after a light edit by 20 Nov (made up)
