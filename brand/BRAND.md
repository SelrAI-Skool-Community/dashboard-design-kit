# Your brand profile

This file is what makes every screen look like YOUR business instead of a template.
Claude fills it in once (see "First build? Capture their brand" in SKILL.md), then
reads it before every build. Edit it any time — the next build picks it up.

Until it's filled in, screens ship in the kit's default purple.

---

## The business

- **Business name:** (not set)
- **What it does, one line:** (not set)

## Colours

- **Primary brand colour:** (not set — hex code, e.g. #0E7C5A)
- **Darker shade for hover/pressed:** (not set — Claude can derive one)
- **Accent / secondary:** (optional)
- **Where these came from:** (their logo / their website / they chose)

Once set, Claude applies them in the marked "YOUR BRAND" block at the bottom of
`templates/tokens.css` — never scattered through the files. Delete that block to
return to the default purple.

## Logo

- **File:** drop it in this folder (`brand/logo.png` or `logo.svg`) — or write
  "text" to use the business name as a wordmark, which looks clean and is the default.
- When building a page, Claude copies the logo file next to the finished page and
  points at it relatively (or inlines an SVG), so the page still works when moved.

## Look references

- **Their website / Instagram:** (none)
- **1–2 sites whose look they like:** (none)
- **Feel in three words:** (e.g. clean, warm, premium)

## Type

The kit ships Manrope and stays with it unless they feel strongly — consistent
type is most of what makes screens look professional.

---

*After any colour change, run `node scripts/verify.mjs` — it checks the new
palette still passes contrast in both light and dark mode.*
