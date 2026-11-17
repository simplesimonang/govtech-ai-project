# AI-UX Flow

## AI-UX readiness

**Scenario:** A · ServiceSG enquiry response
**Moment:** An officer opens an enquiry and sees a drafted first reply, with the policy pages it used.
**Level reached:** 1 of 3
**What we ship:** You cannot pass Level 2 yet, so ship a Level-2 UI: a reliable validator the user can check in under three seconds. A reliable validator beats a magical liar.

### Levels

- Level 01 · Trigger Accuracy: Pass. Drafts start only when the enquiry matches a policy topic with at least 90% confidence. Anything else goes to the officer with no draft. (made up)
- Level 02 · System Transparency: Not yet. Each draft cites a policy page, but officers still open the full page to check it. Next: highlight the exact passage next to each line.
- Level 03 · Invisible Integration: Not yet. Track the share of drafts officers rewrite, every week. Until it drops, keep the validator UI.

### Trust gaps

- Black box: The officer cannot see which policy page a sentence came from. Move: An inline citation on every claim, linked to the passage.
- Hallucination: A draft states a fee or a deadline the policy page does not mention. Move: Dotted underline and a draft watermark on low-confidence lines.
- Control: The officer cannot undo an AI change to their own wording. Move: One-click restore original, and every draft editable in place.
