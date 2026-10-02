---
name: Olympic Furniture — Wood Preview
description: A Hebrew walnut showroom system scoped to the alternate /wood-preview/ route.
colors:
  paper: "#f5efe5"
  surface: "#fcf8f1"
  tint: "#e9e0d3"
  ink: "#332a20"
  muted: "#716452"
  line: "#d8cbbb"
  blue: "#526047"
  red: "#73503b"
  yellow: "#dfcfad"
typography:
  display:
    fontFamily: "Heebo, sans-serif"
    fontSize: "clamp(40px, 4.5vw, 72px)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Heebo, sans-serif"
    fontSize: "clamp(2rem, 3.2vw, 3.15rem)"
    fontWeight: 500
    lineHeight: 1.24
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Heebo, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Heebo, sans-serif"
    fontSize: "18px"
    lineHeight: 1.8
  label:
    fontFamily: "Heebo, sans-serif"
    fontSize: "13px"
rounded:
  control: "6px"
  photo: "12px"
  round: "50%"
spacing:
  compact: "16px"
  group: "24px"
  medium: "32px"
  section-mobile: "72px"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "#fff"
    rounded: "{rounded.control}"
    padding: "13px 23px"
  button-primary-hover:
    backgroundColor: "#5d3f2e"
  text-link:
    textColor: "{colors.blue}"
  room-tab:
    textColor: "{colors.muted}"
    padding: "8px 0"
  room-tab-selected:
    textColor: "{colors.ink}"
  replay:
    textColor: "{colors.ink}"
    rounded: "{rounded.round}"
    width: "44px"
    height: "44px"
  furniture-card:
    textColor: "{colors.ink}"
    padding: "0"
---

# Design System: Olympic Furniture — Wood Preview

## Overview

**Creative North Star: "The Contemporary Walnut Showroom"**

This system applies only to `/wood-preview/`. Warm paper, walnut ink and olive controls surround real furniture photographs and a softly lit, solid 3D room. Hebrew Heebo and RTL reading order keep the experience direct and familiar. The original business logo remains recognizable.

The built preview follows the user's modern wood and room-assembly direction. Broad section surfaces and restrained photo frames provide the visual structure. Furniture motion explains how a room comes together; native controls preserve a complete static experience. This document records the finished source, with no approved comparison image or QUALITYBAR implied. The established homepage retains its light blue, red and pale yellow identity; consult the [root scope index](../../DESIGN.md) before applying these rules elsewhere.

**Key Characteristics:**

- Warm neutral surfaces with walnut emphasis and olive actions.
- One Hebrew type family, medium headings and generous paragraph leading.
- Flat controls and rounded photography; spatial depth belongs to the room model.
- Explicit motion controls and an equivalent assembled fallback scene.

## Colors

Warm neutrals carry the page; walnut and olive distinguish actions without competing with furniture photographs. Frontmatter keys preserve the inherited CSS variable names: `blue` is olive, `red` is walnut and `yellow` is sand on this route.

### Primary

- **Warm Walnut** (`red`): primary gallery and contact actions; hover deepens the same material tone.
- **Muted Olive** (`blue`): text links, navigation, paging and visible focus outlines.

### Neutral

- **Warm Paper** (`paper`): page canvas and hero.
- **Cream Surface** (`surface`): floating utility controls and image dialog surface.
- **Wood Tint** (`tint`): subdued empty states and tonal surfaces.
- **Walnut Ink** (`ink`): headings and selected controls.
- **Muted Timber** (`muted`): supporting copy, captions and unselected controls.
- **Fine Grain** (`line`): separators and circular control borders.
- **Sand** (`yellow`): selection highlight.

The showcase and framed photographs also use the repeated warm backing `#e8dfd1`; the family section uses an inverse walnut surface with cream text. These section treatments do not introduce additional action colors.

**The Route Boundary Rule.** Apply these color overrides only under the wood route's `html[data-design="wood"]` and preview wrapper. Never propagate its inherited variable values to the homepage.

## Typography

**Display Font:** self-hosted Heebo, with sans-serif fallback.
**Body Font:** self-hosted Heebo, with sans-serif fallback.

**Character:** Medium, closely spaced headings make a clear Hebrew hierarchy. Paragraphs have generous leading; control labels stay compact and readable. Varela Round is loaded by the shared entry infrastructure but does not define preview headings.

### Hierarchy

- **Display:** hero title; the desktop clamp is in frontmatter. It becomes (52px) at the intermediate breakpoint and `clamp(34px, 8.5vw, 46px)` on mobile.
- **Headline:** shared section titles; the showcase uses its own `clamp(32px, 3.3vw, 49px)` and becomes (32px) on mobile. Other shared section titles become (34px).
- **Title:** gallery item headings, medium weight.
- **Body:** section introductions and explanatory prose; implemented supporting sizes range from (16px) mobile copy through (20px) hero copy. Frontmatter records the recurring section-body size.
- **Label:** utility bar and supporting controls. Room tabs use (15px), then (14px) on mobile; captions use (13–15px).

**The Hebrew Continuity Rule.** Preserve Heebo and RTL reading order across headings, captions and controls. The photo conveyor's LTR movement is local; its captions remain RTL.

## Layout

The shared centered shell is `min(1320px, calc(100% - 112px))`, narrowing to `calc(100% - 64px)` at (1100px) and `calc(100% - 40px)` at (767px). The preview toolbar occupies (42px) above the sticky header. Anchor offsets account for both layers: (142px) desktop and (130px) mobile.

The hero places copy and room in a (0.9fr / 1.1fr) grid with (64px) separation, reducing to (32px) at the intermediate breakpoint. It stacks at (767px); the room then caps at (430px). The room retains a (640 / 470) aspect ratio. Custom and family sections use two-column editorial layouts and stack on mobile.

The gallery preserves four columns from (1024px), two from (768px), and one below that, with at most two rows per page. Pagination stays below the images. Section padding varies with content density, generally (96–112px) desktop and (66–72px) mobile. Reused small gaps and padding are in frontmatter; do not force every section onto identical spacing.

## Elevation & Depth

The preview's buttons, furniture cards and shop frame are flat. Depth comes from warm tonal backing, true photographs and the room's solid geometry, matte materials and soft light. The WebGL scene uses transparent rendering, an orthographic camera and soft cast shadows; these are material cues within the illustration rather than CSS card elevation. The shared mobile navigation and image-dialog close control retain their existing utility shadows.

**The Material Depth Rule.** Keep catalog containers flat; use photographs and the room's lighting to communicate furniture depth. Utility overlay shadows are not a general card treatment.

## Shapes

Controls and nested photos use restrained corners (`control`); photographs and broad image frames use `photo`. Replay, finish selectors and pagination are circular. Category and room selectors are plain text with an active underline, rather than filled pills. Large section surfaces remain full-width and unboxed.

## Components

### Buttons

Primary actions pair white text with walnut, a (54px) minimum height and the frontmatter padding. Their hover deepens walnut and lifts by (2px); pointer press scales to (0.97). Mobile hero actions use a (50px) minimum height and (15px) horizontal padding. Text links are olive with a (44px) minimum height and underline on hover. Focus uses an olive (3px) outline with (5px) offset.

### Navigation

The preview toolbar remains visible above the shared header and offers motion control plus the homepage link. Desktop navigation uses medium Heebo and olive text; at (1023px) it switches to the shared menu toggle and mobile panel. Keep the original business logo and phone action.

### Room and Category Selectors

Native buttons communicate selection through `aria-pressed`, walnut ink and a (2px) warm-brown underline. Room buttons have a (44px) minimum height; category buttons retain (50px) desktop and (44px) mobile minimums. Finish selectors have (44px) circular targets around (29px) material swatches, with an ink border on selection. Replay is a circular outlined control and disables when motion is paused or off.

### Cards / Containers

Gallery cards have no surrounding fill, shadow or padding. Contained photographs sit on warm backing in rounded frames; titles and captions align outside the frame. Image hover scales gently to (1.025) over (250ms). Actual photo buttons open the native image dialog. Custom and shop imagery use a padded outer frame with smaller inner corners.

### Disclosure Rows

Native `details` and `summary` rows use fine dividers, (17px) vertical summary padding and (19px) labels. The plus icon rotates when expanded over (160ms) with the wood ease-out curve. Focus uses an olive outline with (4px) offset. Reduced motion removes the icon transition.

### Room Assembly and Photo Strip

The room is explicitly illustrative. Living room, bedroom and office presets share three finish choices and replay. Solid models slide into place with staggered starts (170ms), piece duration (1150ms), quartic ease-out and a completed cycle at (1750ms). Rendering stops when assembled, paused or offscreen; reduced motion displays the assembled room. Nine matching assembled transparent WebP renders cover every room/finish combination when WebGL cannot initialize.

The strip displays real published furniture images, with a constant-speed (36s) loop. Hover, keyboard focus and the toolbar control pause it. Reduced motion exposes a static horizontally scrollable strip and hides decorative copies. Loop copies stay out of keyboard and assistive-technology order.

## Do's and Don'ts

### Do:

- **Do** scope this system to `/wood-preview/` and preserve the established homepage identity.
- **Do** keep real furniture photographs contained, readable and available in native image dialogs.
- **Do** preserve Hebrew reading order, visible focus and native selection or disclosure semantics.
- **Do** provide static room and photo-strip experiences when motion is reduced or unavailable.
- **Do** keep the original logo recognizable and contact actions direct.

### Don't:

- **Don't** treat illustrative room models or finish options as catalog products or promised inventory.
- **Don't** add movement without pause controls and a complete static presentation.
- **Don't** add card elevation to the flat catalog treatment.
- **Don't** introduce prices, delivery promises, reviews or checkout through visual examples.

Not canonized: incidental inherited utility shadows and route-specific headline color variations are not new general-purpose tokens; the unused wood ease-in-out custom property is not an active motion rule. No craft-floor defect was identified by the final review supplied to this documentation pass.
