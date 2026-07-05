---
version: alpha
name: FotMob Light
description: A bright, sports-first dashboard system with compact cards, soft borders, and restrained color used to keep live match data scannable.
colors:
  primary: "#0f356e"
  secondary: "#6b7280"
  tertiary: "#e5e7eb"
  neutral: "#fafafa"
  surface: "#ffffff"
  on-surface: "#000000"
  error: "#d92d20"
  border: "#e8e8e8"
  border-subtle: "#e5e7eb"
  muted-text: "#222222"
typography:
  headline-display:
    fontFamily: __walsheim_e6bd29
    fontSize: 32px
    fontWeight: 700
    lineHeight: 38px
    letterSpacing: 0px
  headline-lg:
    fontFamily: __walsheim_e6bd29
    fontSize: 26px
    fontWeight: 500
    lineHeight: 31px
    letterSpacing: 0px
  headline-md:
    fontFamily: __walsheim_e6bd29
    fontSize: 21px
    fontWeight: 500
    lineHeight: 25px
    letterSpacing: 0px
  headline-sm:
    fontFamily: __walsheim_e6bd29
    fontSize: 17px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: 0px
  body-lg:
    fontFamily: __walsheim_e6bd29
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-md:
    fontFamily: __walsheim_e6bd29
    fontSize: 14px
    fontWeight: 400
    lineHeight: 21px
    letterSpacing: 0px
  body-sm:
    fontFamily: __walsheim_e6bd29
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0px
  label-lg:
    fontFamily: __walsheim_e6bd29
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: 0px
  label-md:
    fontFamily: __walsheim_e6bd29
    fontSize: 13px
    fontWeight: 500
    lineHeight: 18px
    letterSpacing: 0px
  label-sm:
    fontFamily: __walsheim_e6bd29
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0px
  caption:
    fontFamily: __walsheim_e6bd29
    fontSize: 11px
    fontWeight: 400
    lineHeight: 14px
    letterSpacing: 0px
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 20px
  xl: 25px
  gutter: 32px
  page: 40px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.muted-text}"
    typography: "{typography.label-md}"
    rounded: "{rounded.xl}"
    padding: 25px 32px
    height: 64px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-text}"
    typography: "{typography.label-md}"
    rounded: "{rounded.xl}"
    padding: 25px 32px
    height: 64px
  button-tertiary:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 0px
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: 16px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 12px 16px
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-text}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 8px 14px
  list-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    padding: 12px 16px
  badge:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: 4px 8px
# FotMob Light

## Overview
FotMob feels fast, utility-driven, and highly scannable, tuned for people checking live scores, schedules, and transfer data at a glance. The tone is professional but friendly, with a bright white canvas, compact information density, and just enough contrast to keep attention on match state rather than decoration. The system favors lightweight surfaces, rounded containers, and minimal visual noise so dense sports data remains easy to parse.

## Colors
- **Primary (#0F356E):** A deep navy accent used sparingly for primary actions, active states, and brand anchors. It feels trustworthy and editorial without overpowering the interface.
- **Secondary (#6B7280):** A muted slate for supporting text, secondary metadata, and low-emphasis labels. It helps hierarchy stay calm in a data-dense layout.
- **Tertiary (#E5E7EB):** A soft neutral divider tone used for borders, separators, and quiet structure. It keeps cards and rows distinct without adding heaviness.
- **Neutral (#FAFAFA):** The page background and broad canvas tone. It reads as clean white with a faint warmth, supporting a bright, airy sports dashboard.
- **Surface (#FFFFFF):** The pure card and control surface color. Use it for panels, inputs, chips, and any elevated content blocks.
- **On-surface (#000000):** The strongest text and icon color for high-contrast reading. It is reserved for titles, scores, and key navigation items.
- **Error (#D92D20):** A reserved alert color for negative states, missing data, and destructive actions. It should remain rare so it preserves its urgency.
- **Border (#E8E8E8) and Border-subtle (#E5E7EB):** Two near-white border tones that define shape without creating a heavy frame. They are essential to the system’s quiet, outlined card language.

## Typography
FotMob uses a single sans-serif family, __walsheim_e6bd29, across the interface, which gives the product a consistent, modern, and slightly rounded editorial feel. Headlines use heavier weights at larger sizes to mark hierarchy, while body text stays compact and readable for high-density tables and lists. Labels are typically medium-weight and can be used for pills, tabs, and button text where clarity matters more than emphasis.

The typography scale is deliberately tight: 32px and 26px titles for page and card headers, then 21px and 17px for secondary headings, followed by 14px body copy and smaller 12px/13px label treatments. Letter spacing is neutral and uppercase treatment is not a defining pattern in the source; emphasis comes from weight, size, and placement rather than all-caps styling.

## Layout
The layout is a fluid, multi-column dashboard with a fixed-max-width feel on desktop, centered within a very light page background. Content is grouped into narrow left navigation, a large central feed, and right-side utility cards, creating a classic information hierarchy for quick scanning. Spacing follows a compact rhythm based on 4px, 8px, 16px, 20px, and 25px steps, with larger gutters used between major columns and sections.

Cards and panels use generous internal padding of 16px or larger for readable blocks, while rows inside lists are tighter to maximize information density. Search, tabs, and filter controls sit close together with rounded containment, signaling a functional, app-like structure rather than an editorial landing page.

## Elevation & Depth
The system is intentionally flat. Depth is created with white surfaces, subtle borders, and strong contrast rather than shadows or layered blur. This keeps the interface fast and legible, especially in tables and live match listings where shadows would add unnecessary visual clutter.

Hierarchy comes from grouping, spacing, and occasional background tinting in headers rather than physical elevation. Use borders and tonal separation to define containers; avoid heavy shadows unless introducing a special promotional surface.

## Shapes
The shape language is soft and practical. Small cards and content blocks use an 8px radius, while interactive controls such as buttons, chips, and inputs lean into 24px full-pill rounding. This creates a friendly sports-app feel without becoming playful or cartoonish.

Overall, the system combines crisp rectangular structure with rounded affordances: structured content areas for data, and smooth pills for action and filtering.

## Components
Buttons are broad, pill-shaped, and understated. Use `button-primary` for the main action and `button-secondary` for alternative actions; both should keep the 64px height, 25px 32px padding, and medium-sized label typography. The primary button uses the navy `backgroundColor` from `colors.primary`, while the secondary button stays on white with subtle border treatment. `button-tertiary` is best reserved for inline actions and text links where a block button would feel too heavy.

Cards follow the `card` token: white or near-white surfaces, 1px subtle borders, 8px radius, and 16px padding. They should remain visually quiet so match data, tables, and headers carry the hierarchy. Card headers can use `headline-sm` or `label-lg` depending on density.

Inputs should be pill-shaped, lightly bordered, and compact enough to sit comfortably in toolbars. The search field is the reference pattern: subtle fill, soft border, and left-aligned icon plus placeholder text. Keep input states restrained; focus should be visible but not flashy.

Chips and filters are similarly minimal. Use `chip` for tabs, pill filters, and small status selectors; they should feel selectable without competing with the content. Badges and status tags should stay tiny and low-contrast unless they represent an important live state.

List rows are the workhorse component in this system. Keep them clean, horizontally aligned, and separated by subtle dividers or spacing rather than heavy containers. Use compact typography, aligned icons, and enough padding to support quick vertical scanning.

## Do's and Don'ts
- Do keep typography compact and highly readable for dense sports data.
- Do use white and near-white surfaces with subtle borders as the main organizing system.
- Do prefer rounded pills for controls and 8px corners for cards and panels.
- Do keep the primary navy accent reserved for emphasis, not for large fills across the page.
- Don't add heavy shadows, glows, or glass effects.
- Don't introduce bright secondary brand colors unless they map to live status or team-specific content.
- Don't overpad list rows or cards; the interface should remain information-rich.
- Don't use uppercase or wide letter spacing as a default style.