# Living PRD: Prototype Review Notes

**Scenario:** A · ServiceSG enquiry response

These notes capture what an engineer would inherit from the prototype.

---

## Solid

**The scenario data contract** (`prototype/index.html` lines 610–1050)

Each scenario is a well-structured object:
```js
{
  id, email, date, topic, preview, enquiry,
  lookupSuccess, draftLabel, draftHtml, draftPlain, citationCount
}
```

Why it's solid:
- Complete specification of what the backend API would return
- Separates `draftHtml` (display) from `draftPlain` (editing) — shows designer thought about both views
- `lookupSuccess: false` with `failureMessage` cleanly models failure case
- An engineer can build the real API by matching this shape exactly

---

## Fragile

**The citation click handler** (`prototype/index.html` lines 1218–1226)

```js
document.querySelectorAll('.citation').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const policyId = el.dataset.policy;
    citationsViewed.add(policyId);
    showPolicy(policyId);
  });
});
```

Why it's fragile:
- Runs after `innerHTML` is set, attaching handlers to existing elements
- If `showDraft()` called twice without clearing listeners, handlers stack — one click fires multiple times
- If draft HTML malformed or `data-policy` missing, `showPolicy(undefined)` fails silently
- No event delegation — dynamically updated drafts (e.g., streaming) wouldn't work

**Fix for production:** Use event delegation on the parent container instead of attaching to each element.

---

## Surprising (positive)

**The prototype tracks the right metric** (`prototype/index.html` lines 1275–1295)

```js
function sendReply() {
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  const currentText = document.getElementById('edit-textarea').value;
  const wasEdited = currentText !== originalDraft;

  let action = 'Sent without changes';
  if (isEditing && wasEdited) {
    action = 'Sent after editing';
  }
  showResult(action, timeSpent);
}
```

Why it's surprising:
- Most prototypes skip metrics or track vanity numbers
- This tracks exactly what the hypothesis cares about: "did they edit or send as-is?"
- Comparing `currentText !== originalDraft` is the right way to detect meaningful edits
- Also counts citation clicks — directly tied to the trust question in one-pager

An engineer inheriting this knows what success looks like without reading any docs.

---

All data in the prototype is synthetic and labelled as made up.
