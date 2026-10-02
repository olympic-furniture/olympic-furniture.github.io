---
name: Olympic Furniture — Wood Preview Alias
description: Scope notes for the unindexed alias of the canonical wood homepage.
---

# Design System: Olympic Furniture — Wood Preview Alias

## Overview

**Creative North Star: "The Contemporary Walnut Showroom"**

The approved wood design now defines `/`. This directory implements that homepage and the unindexed `/wood-preview/` alias; it is not a separate visual identity. [Root DESIGN.md](../../DESIGN.md) is the normative source for colors, typography, spacing, shapes, components, motion and accessibility. [Root .impeccable/design.json](../../.impeccable/design.json) carries the current component samples and extensions.

**Key Characteristics:**

- One canonical cream, walnut and olive system shared with the homepage.
- An additional utility toolbar only on the preview alias.
- The same room assembly, animated fallback, catalog and recognizable logo.

## Layout

The homepage has no preview toolbar. The alias adds a sticky (42px) toolbar above the same header; header position, hero viewport height and scroll indicator account for it. Alias anchor offsets are (142px) desktop and (130px) mobile. The toolbar provides only its title and a link to `/`; root layout and responsive rules otherwise apply.

## Components

Use the root system's actual components. The alias does not define alternate tokens or a separate catalog treatment. Its local sidecar supplies a standalone alias-toolbar sample; all primitive token authority and detailed behavior remain at the root.

## Do's and Don'ts

### Do:

- **Do** apply the root wood system to both `/` and `/wood-preview/`.
- **Do** keep the preview alias unindexed and account for its extra toolbar.
- **Do** preserve the root local photo-strip pause control, reduced-motion presentation and animated WebGL fallback.

### Don't:

- **Don't** restore the former prohibition against using this system on the homepage.
- **Don't** maintain independent palette or component rules that drift from the root canon.
