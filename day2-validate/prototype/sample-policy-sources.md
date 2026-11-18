# Sample Policy Sources (made up)

This file contains synthetic sample data to test whether policy owners can keep single sources of truth updated in a central repo.

## Policy pages in scope

| Page ID | Topic | Owner | Last updated | Status |
|---------|-------|-------|--------------|--------|
| POL-001 | CPF contribution rates | CPF Board (made up) | 2026-10-15 | Current |
| POL-002 | HDB resale procedures | HDB Policy Team (made up) | 2026-09-20 | Flagged — out of date |
| POL-003 | Passport renewal fees | ICA Policy Unit (made up) | 2026-11-01 | Current |
| POL-004 | SingPass 2FA setup | GovTech Identity (made up) | 2026-08-10 | Flagged — out of date |

All data above is synthetic and labelled as made up.

## Test scenario

**Goal:** Check if policy owners respond to a "flagged as out of date" notification within 5 working days.

### Steps

1. System flags POL-002 and POL-004 as out of date (based on a 60-day staleness rule). (made up)
2. Notification sent to owner on Day 0.
3. Owner updates the page or confirms it is still correct.
4. System logs the response time.

### Expected outcome

- Pass: 8 in 10 flagged pages updated within 5 working days. (made up)
- Fail: Fewer than 5 in 10 updated within two weeks. (made up)

## Sample update log (made up)

| Page ID | Flagged on | Owner notified | Updated on | Days to update |
|---------|------------|----------------|------------|----------------|
| POL-002 | 2026-11-10 | 2026-11-10 | 2026-11-13 | 3 |
| POL-004 | 2026-11-10 | 2026-11-10 | pending | — |

All data above is synthetic and labelled as made up.
