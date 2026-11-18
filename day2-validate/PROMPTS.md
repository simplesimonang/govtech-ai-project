# Prompt chain

**Scenario:** A · ServiceSG enquiry response
**Prototype today:** Shows the ServiceSG enquiry inbox with made-up enquiries and a drafted first reply for each one should the officers choose to initiate an action for AI to draft the reply.

All data is synthetic and labelled as made up.

## 1. Expand

**Prompt:** Let the officer filter the inbox by policy topic, and show the topic on each enquiry.

**Business rules:**
- Topics come from a fixed made-up list of 6.
- An enquiry can have one topic only.

**Edge cases:**
- An enquiry that matches no topic goes under Other.
- The filter shows a count of 0 without breaking.

**Result:**

**What worked:**
- Topic filter shows 6 topics (Retirement, Withdrawal, CPF LIFE, Medisave, Housing, Fees) plus "Other" and "All"
- Each enquiry displays exactly one topic label with color coding
- Counts update correctly: Retirement (3), Withdrawal (2), CPF LIFE (2), Medisave (3), Housing (2), Fees (2), Other (2)
- Clicking a topic filters the inbox instantly
- "Other" catches enquiries with no matching topic (e.g., CPF for car, cross-source inference)
- Empty filter shows "No enquiries for this topic" message without breaking

**What broke:**
- Nothing. All 15 test cases load and filter correctly.

## 2. Behavior

**Prompt:** Handle a failed policy lookup: show a clear message, keep the officer's draft, and offer a retry.

**Forced failure:** Make the policy lookup return nothing for every enquiry about fees.

**Business rules:**
- Never show a draft that cites no policy page.
- Never lose text the officer typed.

**Edge cases:**
- The lookup fails twice in a row.
- The officer edits the draft while the retry runs.

**Result:**

**What worked:**
- Fees enquiries (2 of them) trigger forced failure as expected
- Error UI shows warning icon, "Policy lookup failed" heading, and specific message
- "Retry Lookup" button increments counter: "Retry 1: Still no matching...", "Retry 2: Still no matching..."
- "Write Manually" button switches to edit mode with template, preserving officer's draft
- No draft with citations shown when lookup fails — only error UI appears
- Officer's draft saved when toggling edit mode and displayed in "Your draft is saved" section

**What broke:**
- Edge case: Retry is instant (not async), so "officer edits while retry runs" cannot be tested. Production would need async handling with loading state.

## 3. Refine

**Prompt:** Make labels, spacing and button names consistent on the reply screen.

**Business rules:**
- Do not change how drafts are generated or approved.

**Edge cases:**
- Long enquiries still fit on a laptop screen.

**Result:**

**What worked:**
- Button names consistent: "Generate AI Draft", "Send Reply", "Edit Draft", "Retry Lookup", "Write Manually", "Rewrite from scratch"
- All buttons use same styling classes (btn-primary, btn-secondary, btn-text)
- Section titles use consistent uppercase style ("RESIDENT'S ENQUIRY", "REPLY")
- Spacing uses consistent values (padding: 12-16px, gap: 8-16px)
- Draft labels show status clearly with color coding (blue for citations, yellow for warnings)
- Long enquiries scroll within their container (max-height: 120px with overflow-y: auto)
- Inbox panel and detail panel both have max-height with scroll, fitting on laptop screen
- Timer display consistent in bottom action bar

**What broke:**
- Nothing. UI elements are consistent across all screens and states.
