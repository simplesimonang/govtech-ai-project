# Context Skill: ServiceSG Policy Knowledge

This file defines the context an AI needs to draft accurate replies to citizen enquiries across multiple agencies. All examples are synthetic and labelled as made up.

---

## Purpose

Enable the AI to draft first replies that cite the correct policy page, use current figures, and flag when information may be outdated or conflicting.

---

## Sources

| Source ID | Name | URL | Owner | Last reviewed |
|-----------|------|-----|-------|---------------|
| CPF-001 | CPF Retirement Sum | cpf.gov.sg/retirement-sum (made up) | CPF Policy Team (made up) | 2026-10-01 |
| CPF-002 | CPF Withdrawal at 55 | cpf.gov.sg/withdrawal-55 (made up) | CPF Policy Team (made up) | 2026-09-15 |
| CPF-003 | CPF LIFE Payouts | cpf.gov.sg/cpf-life (made up) | CPF Policy Team (made up) | 2026-08-20 |
| CPF-004 | Medisave Withdrawal | cpf.gov.sg/medisave (made up) | MOH Policy Unit (made up) | 2026-07-10 |
| HDB-001 | BTO Eligibility | hdb.gov.sg/bto-eligibility (made up) | HDB Policy Team (made up) | 2026-10-15 |
| HDB-002 | Housing Grants | hdb.gov.sg/housing-grants (made up) | HDB Policy Team (made up) | 2026-09-20 |
| LTA-001 | COE Bidding | lta.gov.sg/coe-bidding (made up) | LTA Policy Team (made up) | 2026-10-10 |
| LTA-002 | Driving Licence | lta.gov.sg/driving-licence (made up) | LTA Policy Team (made up) | 2026-09-25 |
| ICA-001 | Passport Renewal | ica.gov.sg/passport-renewal (made up) | ICA Policy Team (made up) | 2026-10-05 |
| IRAS-001 | Income Tax Filing | iras.gov.sg/income-tax (made up) | IRAS Policy Team (made up) | 2026-08-15 |

All source data above is made up.

---

## Rules

1. **Single source of truth:** Each policy topic maps to exactly one authoritative page. If two pages contradict, flag for human review.
2. **Currency window:** A source is current if reviewed within the last 90 days. Beyond that, flag as "may be outdated" in the draft.
3. **Cite every claim:** Every figure, deadline, or eligibility rule in the draft must link to a source. No unsourced statements.
4. **Scope boundary:** Only answer questions covered by a listed source. If no source applies, say "I don't have information on this" and route to a human.
5. **No inference:** Do not combine rules from two sources to infer a new rule. State only what each source explicitly says.

---

## Examples

### Good example 1 (made up)

**Enquiry:** "How much can I withdraw from CPF at 55?"

**Draft:**
> When you turn 55, you may withdraw CPF savings above the Full Retirement Sum (FRS). The FRS for members turning 55 in 2026 is $205,800. [CPF-001]
>
> To withdraw, apply online via the CPF website or visit a CPF Service Centre with your NRIC. [CPF-002]

**Why it's good:** Each sentence cites exactly one source. Figures match the source. No inferred rules.

---

### Good example 2 (made up)

**Enquiry:** "Can I use Medisave to pay for my parent's hospital bill?"

**Draft:**
> You may use your Medisave to pay for your parent's hospital bill if they are a Singapore Citizen or Permanent Resident. The claim limit depends on the type of treatment. [CPF-004]
>
> ⚠️ This source was last reviewed on 2026-07-10 and may be outdated. Please verify with the CPF website.

**Why it's good:** Cites the source. Flags that the source is older than 90 days. Does not guess at claim limits.

---

### Bad example (made up)

**Enquiry:** "If I withdraw my CPF at 55, will my Medisave be affected?"

**Draft:**
> Withdrawing CPF at 55 does not affect your Medisave balance, as Medisave is a separate account with its own withdrawal rules. [CPF-002, CPF-004]

**Why it's bad:** The draft infers a combined rule from two sources. Neither source explicitly says "withdrawal at 55 does not affect Medisave." This should instead say: "I don't have a single source that answers this. Please check with CPF directly."

---

## Source Content (made up)

### HDB-001: BTO Eligibility

- First-timer applicants have priority over second-timers
- Income ceiling: $14,000/month for families, $7,000/month for singles
- Minimum age: 21 (families), 35 (singles buying 2-room Flexi)
- Must be Singapore Citizen; at least one applicant if applying with spouse

### HDB-002: Housing Grants

- Enhanced CPF Housing Grant (EHG): Up to $80,000 for first-timer families with income ≤$9,000/month
- Proximity Housing Grant (PHG): Up to $30,000 for living near parents/children
- Singles can receive EHG up to $40,000 if income ≤$4,500/month

### LTA-001: COE Bidding

- COE categories: Cat A (cars ≤1600cc), Cat B (cars >1600cc), Cat C (goods vehicles), Cat D (motorcycles), Cat E (open)
- Bidding exercises: 1st and 3rd Monday of each month
- COE is valid for 10 years from registration date
- Prevailing Quota Premium (PQP) applies for COE renewal

### LTA-002: Driving Licence

- Renewal: Apply online via LTA website, 1-3 working days processing
- Conversion from foreign licence: Depends on country; some require test
- Provisional Driving Licence (PDL) valid for 2 years during learning

### ICA-001: Passport Renewal

- Apply online via ICA website or at ICA Building
- Processing time: 4-6 weeks (standard), 1-2 weeks (express, additional fee)
- Adult passport valid for 10 years; child passport (under 16) valid for 5 years
- Biometric photo required

### IRAS-001: Income Tax Filing

- Filing deadline: 15 April (paper), 18 April (e-filing)
- Tax reliefs: CPF contributions, NSman relief, parent relief, spouse relief
- No-Filing Service (NFS): Some taxpayers auto-included, no action needed
- First $20,000 of chargeable income is tax-free

---

## Owner

**Policy owners:** CPF Policy Team, HDB Policy Team, LTA Policy Team, ICA Policy Team, IRAS Policy Team (all made up)
**Technical owner:** ServiceSG AI Team (made up)
**Review cadence:** Monthly, or within 3 days of a policy change announcement

---

## Review Trigger

Flag a source for review when:
- It is older than 90 days
- A news article or government announcement mentions a change to that policy
- An officer marks a draft as "incorrect" and cites a different figure
- Two sources contradict each other on the same topic

---

## Test Questions

Use these to check if the AI applies the rules correctly. All answers are made up.

| # | Question | Expected answer | Source |
|---|----------|-----------------|--------|
| 1 | What is the Full Retirement Sum for 2026? | $205,800 (made up) | CPF-001 |
| 2 | How do I apply to withdraw CPF at 55? | Online via CPF website or at a Service Centre with NRIC (made up) | CPF-002 |
| 3 | What is the monthly payout under CPF LIFE? | Depends on Retirement Account balance at payout start (made up) | CPF-003 |
| 4 | Can I withdraw CPF to buy a car? | "I don't have information on this" — no source covers vehicle purchase (made up) | None |
| 5 | Is the Medisave withdrawal limit still $300 per day? | Flag: source CPF-004 is older than 90 days, may be outdated (made up) | CPF-004 |
| 6 | What is the income ceiling for BTO? | $14,000/month for families, $7,000/month for singles (made up) | HDB-001 |
| 7 | How much is the Enhanced Housing Grant? | Up to $80,000 for first-timer families with income ≤$9,000/month (made up) | HDB-002 |
| 8 | When is the next COE bidding? | 1st and 3rd Monday of each month (made up) | LTA-001 |
| 9 | How do I renew my driving licence? | Apply online via LTA website, 1-3 working days processing (made up) | LTA-002 |
| 10 | How long does passport renewal take? | 4-6 weeks standard, 1-2 weeks express (made up) | ICA-001 |
| 11 | When is the tax filing deadline? | 15 April (paper), 18 April (e-filing) (made up) | IRAS-001 |
