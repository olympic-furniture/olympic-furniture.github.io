# Olympic furniture website implementation plan

> **For agentic workers:** Use subagent-driven-development to implement this plan task by task. Review each deliverable and verify the finished site in the T3 collaborative browser.

**Goal:** Publish the approved Hebrew furniture website and configure its GitHub-backed editing dashboard.

**Architecture:** A Vite React application imports validated JSON content at build time. Furniture content and local images are editable through Pages CMS, and GitHub Actions builds and deploys the site to GitHub Pages. Separate content contracts, visitor-facing components, and publication configuration.

**Tech stack:** React, TypeScript, Tailwind CSS v4 with its Vite plugin, Zod, Vitest, React Testing Library, Phosphor icons, self-hosted Hebrew font.

**Spec:** `docs/site-brief.md`

## Global constraints

- Name: רהיטי אולימפיק. Founders: מושה אבן ימין וגילה אבן ימין.
- Address: האורזים 6, נתניה. Telephone: 09-861-8985. Established in 1980.
- Brand colors: #e21c23 and #485e88. Approved warm off-white modern layout.
- Real business images only. Landing-page images and the supplied founders photograph are authorized. Facebook banner and photos dated November 15, 2023 through November 17, 2025, inclusive, are authorized only after their dates are verified.
- No cart, checkout, payment, quote form, invented reviews, current promotional prices, unverified hours, or invented fulfillment claims.
- Omit unknown email, WhatsApp, and opening hours from public content. Preserve exact Hebrew names supplied by the user.
- Every external action remains within the approved organization and repository. Never include GitHub credentials in website files or browser JavaScript.
- Destination: olympic-furniture/olympic-furniture.github.io. Root URL: https://olympic-furniture.github.io/.
- Use the T3 collaborative browser for browser tests. Do not replace it with another browser framework unless it explicitly reports unsupported/unavailable.

## Task 1: build foundation, real media, and content contract

**Files:** package.json, package-lock.json, vite.config.ts, tsconfig.json, tsconfig.app.json, tsconfig.node.json, src/vite-env.d.ts, src/content/schema.ts, src/content/index.ts, src/content/schema.test.ts, content/site.json, content/products/*.json, public/images/*, public/fonts/*, scripts/validate-content.ts, docs/image-sources.md.

**Produces:** exported `site`, `products`, `categories`, `SiteContent`, and `Product` from `src/content/index.ts`. `categories` is an array of `{ id, label, description }` objects. IDs: wardrobes, bedrooms, children, sofas, dining, mattresses, office. `Product` is validated furniture data plus an `id` derived from its JSON filename.

**Site fields:** name, phone, address, mapsUrl, wazeUrl, facebookUrl, heroTitle, heroDescription, heroImage, storyTitle, storyParagraphs, storyImage, founders, customTitle, customDescription, customOptions. Optional strings: email, whatsapp, hoursText. `customOptions` is an array of `{title, description}`. `founders` is the exact confirmed names. Do not expose implementation text in visitor copy.

**Furniture fields:** title, category, image, description, published, order; optional price and priceFrom. CMS can write null or blank to optional fields; normalize empty optional values. A price must be a finite positive number when present. `image` must be a local `/images/` path. React must render descriptions as text, never HTML.

- [ ] Install dependencies and establish the Node/Vite/TypeScript test environment. Use a system-compatible current package version and a lockfile. No generated demo application.
- [ ] Write meaningful tests for content validation before implementation. Required behaviors: malformed required phone rejected; negative/non-finite price rejected; unsafe image path rejected; CMS blank optional fields normalized; drafts excluded from public products; ordering stable; broken asset references fail validation. Sample test shape:

```ts
expect(() => productSchema.parse({ ...validProduct, price: -1 })).toThrow();
expect(() => productSchema.parse({ ...validProduct, image: 'javascript:alert(1)' })).toThrow();
```

- [ ] Run the tests and record the expected failures before implementing the schema and loader.
- [ ] Download and inspect actual business photographs and the existing logo. Use authorized landing-page images as the initial set. Save original-source provenance, dates where available, and image roles in `docs/image-sources.md`. Optimize media without generating or changing the photographed furniture. Copy the supplied founders photograph from `/home/idan/.t3/userdata/attachments/2e751f78-a04d-4178-85a5-48de61056aa1-30de8f1b-669a-441a-a8fc-6e4fa22de97b.jpg`.
- [ ] Self-host a Hebrew font with license documentation. Keep dependencies economical and omit animation libraries for this restrained design.
- [ ] Implement schemas, loader, seed content, and a build-time asset validator. Use authentic descriptions without invented dimensions, brands, or price promises. Seed only actual photographed furniture.
- [ ] Run the content tests and validation, type-check this deliverable, self-review, and commit only Task 1 files.

## Task 2: build the public Hebrew website

**Files:** index.html, src/main.tsx, src/App.tsx, src/styles.css, src/components/Header.tsx, src/components/Hero.tsx, src/components/FurnitureGallery.tsx, src/components/ImageDialog.tsx, src/components/CustomFurniture.tsx, src/components/FamilyStory.tsx, src/components/Visit.tsx, src/components/Footer.tsx, src/components/BusinessImage.tsx, src/components/FurnitureGallery.test.tsx, src/components/Header.test.tsx, src/test/setup.ts.

**Consumes:** Task 1 exports from `src/content/index.ts`. No runtime CMS requests. Use content site hero/story media rather than hard-coded imported image URLs.

**Produces:** complete mobile/desktop right-to-left landing page, category browsing, keyboard-accessible image viewing, calls and directions. `FurnitureGallery` may own its category selection state. If category entry cards outside it control filters, lift the selected category to App and use `{ selectedCategory, onSelectCategory }` props.

- [ ] Write interaction tests before components. Filtering must show only published items in the selected category; choosing another category must reset its visible selection. An empty category must invite contact without invented products. Gallery opens a dialog with the selected furniture's name and closes with Escape, restoring trigger focus. Mobile menu closes after choosing an anchor.
- [ ] Run the tests to see expected failures for absent interactions.
- [ ] Implement a cohesive modern furniture layout. Use a readable self-hosted Hebrew sans-serif font; an asymmetric hero on desktop; warm off-white surfaces; red primary buttons and blue navigation. Header is one line and at most 80px high on desktop. Keep image and text hierarchy strong rather than using repetitive boxed cards.
- [ ] Implement category navigation, filtered gallery, large image dialog, custom options, founders story, address, telephone, map links, optional confirmed contact fields, and a discreet Pages CMS link. Native dialog is acceptable when focus, Escape, outside dismissal, and scroll locking are implemented correctly.
- [ ] Images reserve dimensions and show an intelligible failure fallback. Hero image loads eagerly, remaining photographs lazily. Keep the actual visible photos as the focus. Avoid decorative generated assets and unverified reviews.
- [ ] Add focus styles, skip link, semantic headings, ARIA labels, 44px mobile targets, safe external links, mixed-script telephone direction, mobile call/directions bar, reduced-motion support, and page-level dark preference tokens if practical within the approved identity.
- [ ] Type-check, run interaction tests and production build, inspect the site in the T3 browser at desktop and mobile dimensions, self-review, and commit Task 2 files.

## Task 3: connect editing, deployment, and maintenance documentation

**Files:** .pages.yml, .github/workflows/deploy.yml, README.md, docs/editing-guide.he.md, scripts/generate-metadata.ts, public/robots.txt, public/sitemap.xml, public/favicon.*, .github/workflows/ci.yml if separate verification is justified. Update package.json scripts and index.html metadata as necessary.

**Consumes:** the content schemas and public site from Tasks 1 and 2. Keep CMS field names identical to site and product schemas. Use a JSON collection at content/products and a JSON file at content/site.json. Uploaded photos go in public/images and expose `/images/` paths.

**Produces:** Hebrew-labeled content editor configuration; reproducible verified Pages deployment; generated SEO metadata; a practical Hebrew editing guide with instructions for new entries and prices.

- [ ] Configure Pages CMS using the current official configuration docs. Define labels, required fields, category select options, optional positive price, priceFrom, publication toggle, order, optional contacts, business text, and image uploads. Use separate furniture files rather than a monolithic editable array.
- [ ] Validate that configuration paths and field names match the production content. Test the contract by editing a controlled content fixture and building it, not by asserting exact YAML strings.
- [ ] Add a GitHub Actions workflow that runs npm ci, tests, content validation, TypeScript checking, and the production build before deploying the dist artifact. Use least necessary permissions and root-site base paths. Support push to main and workflow_dispatch. An editable draft must not leak into the site.
- [ ] Generate Hebrew metadata, canonical link, sitemap, robots rules, and FurnitureStore structured data from current content at build time. Do not write unconfirmed opening hours or reviews into structured data. Required JSON-LD output:

```json
{
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "name": "רהיטי אולימפיק",
  "url": "https://olympic-furniture.github.io/",
  "telephone": "09-861-8985",
  "address": { "@type": "PostalAddress", "streetAddress": "האורזים 6", "addressLocality": "נתניה", "addressCountry": "IL" }
}
```

- [ ] Document local commands, content ownership, current missing business details, approved image sources, and the Pages CMS GitHub App installation step. Write Hebrew editing instructions suitable for the family. Site link should lead to the real editor login, not a fabricated in-page login.
- [ ] Run all checks, review the complete change against the approved spec, and resolve findings.
- [ ] Push the reviewed site to the empty approved repository, set GitHub Pages to GitHub Actions, wait for the real deployment, and verify the public URL in the T3 browser. Publishing this site is authorized by the user's destination request and approval of the brief.
- [ ] Configure Pages CMS access if available through the authenticated browser; otherwise present the single remaining GitHub App installation step with the exact link. Do not claim the live editor was connected if user installation is still needed.

## Completion evidence

Record actual commands and results in the final handoff: tests, type-check, content validation, production build, deployed Actions run, public URL, browser interactions, and any editor setup step still requiring user login. Do not claim confirmed prices, contacts, or fulfillment policies that have not been supplied.
