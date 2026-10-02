# רהיטי אולימפיק

Hebrew, right-to-left furniture website built with React, TypeScript, Tailwind CSS and Vite. The approved destination is [olympic-furniture.github.io](https://olympic-furniture.github.io/). Check the [publishing workflow status](https://github.com/olympic-furniture/olympic-furniture.github.io/actions/workflows/deploy.yml) for the latest verification and deployment results.

## Development

Use Node 24 LTS, version 24.15.0 or newer within 24.x. The package engine also accepts Node 22.22.2+ within 22.x and Node 26+ to match the installed dependencies. Dependencies are locked in `package-lock.json`.

```sh
npm ci
npm run dev
npm test
npm run validate:content
npm run typecheck
npm run build
npm run preview
```

`npm run build` validates all content, checks TypeScript, and creates `dist`. The publishing fixture test makes an isolated editor save, adds an image and furniture entry, builds the real application, and checks that updated content appears and draft text does not. Temporary fixture changes never touch the business content.

## Editing and content ownership

The family owns the business descriptions, furniture information, photographs and confirmed prices. Use the [Hebrew editing guide](docs/editing-guide.he.md). The footer links to the real [Pages CMS editor](https://app.pagescms.org/).

- `content/site.json` contains business details and homepage text.
- `content/products/*.json` contains one furniture entry per file. The filename determines its public identifier.
- `public/images` contains uploaded photographs. Content references `/images/...`.
- `.pages.yml` defines the Hebrew editing forms and media source.
- `src/content/schema.ts` validates the editable contract. Optional empty strings and null values normalize to absent values.
- `src/content/categories.ts` defines the seven fixed categories. Changing category IDs requires a code change and migration of existing records.

Descriptions are plain text. Prices are optional positive numbers in shekels. `priceFrom` selects the starting-price wording. `published: false` removes a furniture record from the public application bundle. Drafts still need valid fields and existing images. The repository is public, so draft files and uploaded photographs are visible on GitHub even when the furniture record is hidden on the website.

The business telephone and address are confirmed. WhatsApp, email, hours, current prices, detailed product specifications, fulfillment coverage, times, costs, installation, warranty and the detailed order process await confirmation. Do not fill these gaps with historical promotions or assumptions. The grandfather's review of Hebrew copy is a follow-up to the user-authorized initial publication.

Approved image sources and the self-hosted Heebo license are recorded in [docs/image-sources.md](docs/image-sources.md). The favicon is an unchanged copy of the original square business logo. Additional Facebook photographs require date verification within November 15, 2023 through November 17, 2025, inclusive. Use local image files, not expiring CDN URLs.

## Publishing and editor access

The [deployment workflow](.github/workflows/deploy.yml) verifies pull requests and deploys pushes to `main` or manual runs on `main`. It runs installation, tests, content validation, type checking and the production build before uploading `dist`. The build has read-only repository permissions. Only the deployment job receives Pages and OIDC write permissions. Configure repository Settings → Pages → Source as GitHub Actions before the first deployment.

`scripts/generate-metadata.ts` reads validated site content during Vite's HTML transformation. It generates the title, description, canonical URL, Open Graph tags and FurnitureStore JSON-LD. The address field uses `street and number, city`; the last comma separates the city. It emits `dist/robots.txt` and `dist/sitemap.xml` during each build so checked-in copies cannot become stale. The site uses the root base `/`. Assets and fonts are self-hosted; no application secrets or runtime CMS API are needed.

The Pages CMS GitHub App installation was confirmed on October 2, 2026 for `olympic-furniture`, with **Only select repositories** selected. The organization contained only `olympic-furniture.github.io` at that check. Installation is complete; the authenticated editing forms have not been verified. Sign in at [app.pagescms.org](https://app.pagescms.org/) with an authorized GitHub account and select this repository's `main` branch. If the App needs to be installed again, an organization administrator can [install Pages CMS](https://github.com/apps/pages-cms/installations/new), choose `olympic-furniture`, select **Only select repositories**, and grant access only to `olympic-furniture.github.io`. Grant family editors suitable GitHub repository access. The public site has no account login or password storage.

Configuration references: [content](https://pagescms.org/docs/configuration/content/), [media](https://pagescms.org/docs/configuration/media/), [filename](https://pagescms.org/docs/configuration/content/filename/), [select](https://pagescms.org/docs/configuration/fields/select/), [number](https://pagescms.org/docs/configuration/fields/number/), [image](https://pagescms.org/docs/configuration/fields/image/), [object](https://pagescms.org/docs/configuration/fields/object/).
