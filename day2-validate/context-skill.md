# Context Skill: CPF Policy Knowledge

This file defines the context an AI needs to draft accurate replies to CPF-related enquiries. All examples are synthetic and labelled as made up.

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

## Owner

**Policy owner:** CPF Policy Team (made up)
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
