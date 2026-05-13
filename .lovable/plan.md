

## Plan: Add Logo to Instructions Page

Replace the `ClipboardList` icon on the Instructions page with the same brain/mind network SVG logo + "16 TYPES TEST" text stack used in the IntroPage navbar.

### Changes

**`src/pages/InstructionsPage.tsx`**:
- Remove the `ClipboardList` import
- Replace the icon section (the rounded square with `ClipboardList`) with the SVG brain network icon and the two-line "16 TYPES TEST / Inspired by MBTI Theory" text, centered
- Scale the SVG slightly larger (e.g. 48x48 or 56x56) to suit the page's centered hero layout
- Keep the rest of the page (title, description, checklist, CTA) unchanged

