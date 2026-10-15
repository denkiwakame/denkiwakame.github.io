---
name: add-talk
description: Add a talk to the Talks section. Use when the user says "トーク追加", "add this talk", or pastes a Speaker Deck URL.
---

# add-talk

Append to `src/data/talks.yaml` (file order = display order; newest first).

```yaml
- id: <short-slug>
  title: <talk title>
  venue: <short venue label shown in the orange tag, e.g. "JST PRESTO", "CoRL WS">
  date: "2025"            # string; year or "2025-11"
  deckId: <id>            # optional; Speaker Deck embed id → iframe. Omit → "スライド準備中"
  link: https://speakerdeck.com/denkiwakame/<slug>
```

The Speaker Deck embed id is the `data-id` in the deck's embed code (not the URL slug). If you cannot get it, omit `deckId` and tell the user.

Verify with `npm run check && npm run build`.
