---
name: Olympic Furniture — Walnut Showroom
description: The approved Hebrew wood homepage and its unindexed preview alias.
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
    fontSize: "clamp(40px, 4.5vw, 64px)"
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
  phone-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.blue}"
    rounded: "999px"
    padding: "0 14px"
    height: "46px"
  carousel-control:
    textColor: "{colors.blue}"
    padding: "0"
  furniture-card:
    textColor: "{colors.ink}"
    padding: "0"
---

# Design System: Olympic Furniture — Walnut Showroom

## Overview

**Creative North Star: "The Contemporary Walnut Showroom"**

Warm cream, walnut ink and olive controls surround real furniture photographs and a softly lit room illustration. Self-hosted Hebrew Heebo and RTL reading order keep the family business direct and familiar. Wooden planks and screws give the hero initials a material identity, echoed by the corresponding letters in the recognizable original logo.

This is the canonical system for the approved homepage at `/`. The unindexed `/wood-preview/` alias uses the same system with an additional utility toolbar. It supersedes the former light-blue, red and pale-yellow homepage identity; retained base stylesheet declarations are implementation history, not the current visual authority. The durable brand commitments are in [PRODUCT.md](PRODUCT.md); the page direction and visitor path are in [the surface brief](docs/design/wood-preview.md). This document records the finished implementation, reviewed with a ship disposition on 2026-10-02.

Broad section grounds and open furniture displays provide structure. A single staged assembly explains the fixed living room; the photo strip’s local pause control and reduced-motion behavior preserve access to the content. Generated lettering and scene renders serve the illustration and identity, while the catalog remains real business photography.

**Key Characteristics:**

- Cream grounds, walnut emphasis and olive navigation.
- One Hebrew type family with medium headings and generous paragraph leading.
- Complete furniture photographs on an open canvas with thin wooden ledges.
- Solid room geometry and matching animated raster fallback.
- Recognizable original logo with matching wooden initials and screw details.
- Local photo-strip pause, reduced-motion support and native category selection, disclosure and dialog controls.

## Colors

Warm neutrals carry the page; walnut and olive distinguish actions without competing with furniture photographs. Frontmatter preserves the CSS token names: `blue` now means olive, `red` walnut and `yellow` sand.

### Primary

- **Warm Walnut** (`red`): primary gallery and telephone actions, the scroll-position indicator and deeper hover treatment.

### Secondary

- **Muted Olive** (`blue`): navigation, text links, paging and visible focus outlines.

### Neutral

- **Warm Paper** (`paper`): hero, catalog and visit canvas.
- **Cream Surface** (`surface`): utility controls, outlined telephone pill and image dialog.
- **Wood Tint** (`tint`): subdued empty and unavailable-image states.
- **Walnut Ink** (`ink`): headings and selected controls.
- **Muted Timber** (`muted`): supporting copy, captions and unselected controls.
- **Fine Grain** (`line`): separators and circular control borders.
- **Sand** (`yellow`): text selection.

Section grounds vary within this material family: a warmer showcase, pale custom section and inverse walnut family section. These local grounds and scene material swatches are not additional action colors.

**The Material Roles Rule.** Use walnut for primary actions and olive for navigation and focus; keep the page ground quiet enough for the actual furniture photographs.

## Typography

**Display Font:** self-hosted Heebo, with sans-serif fallback.
**Body Font:** self-hosted Heebo, with sans-serif fallback.

**Character:** Medium, closely spaced Hebrew headings make a clear hierarchy. Generous paragraph leading and compact control labels support browsing. Varela Round remains loaded in the shared entry infrastructure but does not define the wood page headings.

### Hierarchy

- **Display:** hero headline; its desktop scale is in frontmatter. It becomes (52px) at the intermediate breakpoint and `clamp(34px, 8.5vw, 46px)` on mobile. The wooden ר in ריהוט and ל in לבית are transparent PNG illustrations with visible grain and screws, absolutely positioned within the live heading, with bottom-aligned images sharing the surrounding text baseline.
- **Headline:** section titles. The showcase has a local `clamp(32px, 3.3vw, 49px)` size, becoming (32px) on mobile; shared section titles become (34px).
- **Title:** medium gallery item headings. Contact and disclosure titles use larger local sizes where their functions warrant them.
- **Body:** recurring section copy. Supporting prose ranges from (16px) mobile copy through (20px) hero copy, with widths set to the content rather than a universal line-length token.
- **Label:** supporting controls and captions. Image captions and utility labels range from (12–15px).

The full CMS headline remains the heading's accessible name; decorative letter pieces and visible split spans are hidden from assistive technology.

**The Hebrew Continuity Rule.** Preserve Heebo and RTL reading order across headings, captions and controls. The conveyor's LTR movement is local; its captions remain RTL, and telephone numerals stay isolated from surrounding Hebrew.

## Layout

The centered shell is `min(1320px, calc(100% - 112px))`, narrowing to `calc(100% - 64px)` at (1100px) and `calc(100% - 40px)` at (767px). The sticky header occupies (77px) desktop and (71px) mobile. Main-page anchor offsets are (100px) desktop and (94px) mobile. The preview alias adds a (42px) toolbar above the header and uses (142px / 130px) anchor offsets.

The hero fills at least the viewport below the header and any alias toolbar. Its RTL copy and room share a (0.8fr / 1.2fr) grid with (40px) separation, reducing to (32px) at the intermediate breakpoint. At the widest shell the room spans (768px). It stacks at (767px), with the room capped at (500px) and retaining its (640 / 470) aspect ratio. Custom and family sections use broad two-column layouts and stack on mobile.

The complete gallery contains the existing (83) published photographs across six categories. It uses four columns from (1024px), two from (768px) and one below that. Two rows maximum means (8 / 4 / 2) entries per page; category changes reset paging, and paging controls remain below the grid. Gallery gaps are (28px), becoming (32px) on mobile. Image regions are (320px) tall on desktop and (340px) on mobile, with contained pictures aligned above the ledge.

The conveyor uses natural image proportions and variable widths at (230px) image height, capped at (620px) width. Mobile uses (190px) height and a (480px) cap. No filled rectangular photo mat is added around those images. Section spacing varies with density, generally (96–112px) desktop and (66–72px) mobile; repeated small spacing is in frontmatter.

## Elevation & Depth

Buttons and gallery articles are flat. Depth comes from real photography, the narrow walnut catalog ledges and the room's solid geometry, matte materials and soft cast light. The illustration uses transparent rendering and an orthographic camera. The shared mobile menu and dialog close control retain utility shadows; the storefront photograph also retains the shared image shadow even though its outer frame is flat.

**The Material Depth Rule.** Keep catalog articles flat and unfilled. Convey furniture depth through photographs, restrained ledges and room lighting; inherited utility and storefront-image shadows are not general card treatments.

## Shapes

Primary controls use restrained corners (`control`), photography uses softly rounded corners (`photo`), and menu and paging controls are circular, while the telephone link is an outlined pill. Category selectors use text and an active underline rather than filled pills. Gallery ledges are thin (5px) with small (2px) corners. Large section grounds remain full-width and unboxed. Custom and shop photography can use a padded outer frame; this treatment does not extend to catalog image backgrounds.

## Components

### Buttons

Primary actions pair white text with walnut and a (54px) minimum height. Hover deepens walnut and lifts by (2px); a fine-pointer press scales to (0.97). Mobile hero actions use a (50px) minimum height and (15px) horizontal padding. Text links are olive with a (44px) minimum height and an underline on hover. Focus uses an olive (3px) outline with (5px) offset. Reduced motion removes transition effects.

### Navigation

The main sticky header has right-side navigation and a left-side outlined telephone pill. The phone icon sits to the left of isolated numerals; the pill and circular menu control both measure (46px) high. The header has no logo, preview banner or global motion button. At (1023px), navigation becomes a native menu toggle and mobile panel. Escape closes the panel and returns focus to the toggle; outside pointer input and desktop resizing also close it. The alias toolbar contains only its title and a link to `/`.

A decorative (2px) walnut line below the header tracks scroll position from the right. It remains an orientation aid under reduced motion; it is hidden from assistive technology.

### Category Selectors

Native buttons communicate selection with `aria-pressed`, walnut ink and a (2px) warm-brown underline. Category targets retain (50px) desktop and (44px) mobile minimums. The fixed hero illustration has no room selectors, finish selectors, replay or visible disclaimer text; its figure carries the accessible illustration label.

### Cards / Containers

Catalog articles have no fill, shadow or padding. Complete photographs sit directly on the open cream canvas with narrow walnut ledges below them; there are no pale filled letterbox frames. Titles and captions sit outside the image region. Fine image hover scales to (1.025) over (250ms). Real photo buttons in the gallery and conveyor open a native image dialog, which names the image, moves focus to its close button, closes on Escape and returns focus to the trigger.

The gallery's (260ms) horizontal page-change transition is disabled for keyboard category changes and keyboard paging. A live status announces category count and page. Decorative conveyor copies are hidden from assistive technology and removed from the keyboard order.

### Disclosure Rows

Native `details` and `summary` rows use fine dividers, (17px) vertical summary padding and (19px) labels. The first row starts open. Its SVG plus rotates over (160ms); open body content enters over (220ms). Focus uses an olive outline with (4px) offset. Reduced motion removes both effects. Native disclosure semantics remain intact.

### Room Assembly and Photo Strip

The figure identifies one fixed walnut living room as an illustration. Its single (4600ms) assembly uses furniture-root delays of (250ms + index × 450ms), (1800ms) root movement and quartic ease-out. Cabinet doors, sofa arms, back and seat cushions, tabletop, throw and book assemble in stages ending at (4500ms). A mild camera orbit and (8%) zoom keep the room centered at a (1.23) look-at height. The renderer is imported lazily, caps pixel ratio at (2), suspends offscreen or when the document is hidden, stops frames when assembled and disposes resources on unmount.

If WebGL is unavailable, initialization fails or its context is lost, one matching native (48-frame, 8 × 6) sprite sheet assembles over the same (4600ms), suspending offscreen. An assembled transparent WebP is visible while the sprite loads. Reduced motion shows the final static room and does not request the sprite. [The current motion asset manifest](docs/design/wood-hero-motion-assets.json) records source files, rendering and framing; the previous nine room/finish sprite sheets remain archived assets.

The real-photo conveyor runs a constant-speed (22s) loop. A text-and-SVG pause/resume button beside its caption has a (44px) minimum height and an `aria-pressed` state. This local control affects only the strip and is hidden under reduced motion. Fine-pointer hover, keyboard focus, offscreen state and a hidden document also pause the strip. Reduced motion removes the loop and copies, exposing one horizontally scrollable photo group.

Reduced motion presents assembled/static content and removes transitions. Wooden initials arrive over (850ms), with the ל delayed (140ms). Gallery and disclosure entries remain short independent effects. The family photograph has a (650ms) arrival only once, when it first intersects at a (0.2) threshold while motion is playing; otherwise it stays visible without that entrance.

### Footer

The footer contains business identity, address and Facebook. Direct contact actions remain in the header and visit section. There is no fixed bottom contact bar or public CMS link; mobile footer bottom padding is (28px). Editors use the direct Pages CMS address in the editing guide.

### Brand Signature

The signature before the footer uses the adapted original logo, retaining its chair, Hebrew wording, layout and red tagline. Only the requested ר and ל become wooden planks with screws, matching the hero initials. The original asset and favicon remain available; the adapted mark has the business name as alternative text.

## Do's and Don'ts

### Do:

- **Do** use this wood system for the approved homepage and its unindexed preview alias.
- **Do** keep real furniture photographs complete, contained and available in native image dialogs.
- **Do** preserve Hebrew reading order, visible focus and native selection, disclosure and dialog semantics.
- **Do** retain equivalent animated room fallback when WebGL fails and assembled/static content under reduced motion.
- **Do** keep continuous motion pausable and decorative copies outside keyboard and assistive-technology order.
- **Do** keep the original logo recognizable and contact actions direct.

### Don't:

- **Don't** treat the room illustration as catalog products or promised inventory.
- **Don't** put pale filled mats or elevated cards around the catalog furniture photographs.
- **Don't** hide functional content behind an entrance animation or require WebGL to browse the page.
- **Don't** add continuous movement without a local pause control and a complete reduced-motion presentation.
- **Don't** introduce unsupported prices, delivery promises, reviews or checkout through visual examples.

Not canonized: obsolete base palette/display styling, inherited utility and storefront-image shadows, local scene/material colors and the unused wood ease-in-out property are not new reusable house tokens. The ship review identifies no craft-floor defect to canonize.
