# רהיטי אולימפיק: proposed website brief

Status: approved by the user on October 2, 2026. The site, editor configuration and deployment workflow implement this brief. Check the [publishing workflow status](https://github.com/olympic-furniture/olympic-furniture.github.io/actions/workflows/deploy.yml) for verification and deployment results.

## Purpose

Create a Hebrew website for the family furniture business at האורזים 6, נתניה. Help visitors browse furniture, understand custom-build options, call the shop, and visit the showroom. The confirmed telephone number is 09-861-8985.

Built with React, TypeScript, and Tailwind CSS. The approved publishing destination is https://olympic-furniture.github.io/; the GitHub organization and repository exist.

## Confirmed information

- Public business name: רהיטי אולימפיק.
- Established in 1980. The user confirmed the older landing page describes the correct business and founding story.
- Use the names exactly as supplied by the user: מושה אבן ימין וגילה אבן ימין. Both founders may appear in the supplied photograph.
- Custom builds and a large selection are the main selling points.
- Customization includes dimensions, materials, colors, doors, handles, and internal storage.
- Offer wardrobes, bedrooms, children's furniture, sofas, dining furniture, mattresses, and office furniture.
- Write Hebrew copy for the grandfather to review.
- Brand colors: red #e21c23 and blue #485e88.
- Use existing business website images and the supplied founders photograph. Facebook permissions include the banner and photographs dated November 15, 2023 through November 17, 2025, inclusive.

## Information requiring confirmation

WhatsApp, email, current opening hours, current prices, product specifications, delivery coverage, delivery times and costs, installation terms, warranty, and the detailed order process are not confirmed.

The user thinks the business serves Israel nationwide and makes all furniture itself. These are provisional statements. The older landing page also mentions other furniture brands, so public copy should say the business manufactures and sells furniture rather than assert every item is made in its factory.

Unknown contact channels will stay out of the public interface until supplied. Do not create a WhatsApp link from the landline. Do not invent reviews, delivery promises, manufacturing claims, or opening hours.

## Proposed visitor experience

Use a main page with anchored navigation and a furniture gallery visitors can filter by category. This combines a welcoming introduction and showroom information with enough browsing detail to invite a conversation. A minimal contact-only page would give the furniture too little space; a full store would require unconfirmed product, pricing, and fulfillment information.

1. Header: original business logo if usable, category navigation, the story, directions, and a telephone link. A compact mobile menu keeps these reachable on smaller screens.
2. Opening section: a strong real furniture image, a short Hebrew message, and buttons for browsing furniture and visiting the shop.
3. Furniture categories: visual entry points into the available selection, with wardrobes first because the existing business pages emphasize them. This is an editorial choice, not a claim about best sellers.
4. Gallery: real business photographs with descriptive Hebrew labels and category filters. Images can open in a keyboard-accessible larger view. Keep product information limited to verified details. An empty category should offer a conversation with the shop rather than invented products.
5. Custom builds: explain the confirmed choices of size, material, color, and storage. Invite customers to bring their needs and measurements for discussion. Do not imply a measurement visit or installation service is included.
6. Family story: the supplied founders photograph and a short account of the business since 1980.
7. Visit and contact: confirmed address, click-to-call, Google Maps and Waze directions. Add hours and other contact channels when confirmed.
8. Footer: business details and an unobtrusive link to the editing dashboard.

No cart, checkout, payment, or quote submission in the initial version. The accessible older landing pages have inquiry forms and no visible checkout. Facebook's logged-out view is limited, and the legacy olimpic.co.il domain could not be reached, so their full functionality has not been verified. Keep the initial purchase discussion with the shop as the user requested.

Suggested opening copy, subject to the grandfather's review:

> ריהוט לבית, בדיוק כמו שרציתם.
>
> מבחר רהיטים והתאמה אישית, מעסק משפחתי בנתניה מאז 1980.

Suggested buttons: לצפייה ברהיטים, בואו לבקר בחנות, דברו איתנו.

## Visual direction

Combine family warmth with a clean, modern layout. Use warm off-white backgrounds, dark readable text, blue navigation and supporting elements, and red primary buttons. Furniture and the founders should dominate the photography. Use spacious sections and comfortably sized Hebrew typography, informed by the user's Oren Bechor reference site.

Retain the recognizable business identity rather than redesigning the logo. Test text contrast when applying the supplied colors. Support right-to-left layout, keyboard navigation, visible focus, meaningful image descriptions, and reduced motion. Mobile visitors should have a persistent, accessible call-and-directions shortcut.

## Proposed editing dashboard

Recommend the hosted Pages CMS editor for this first version. Its editor works with content and photographs stored in a GitHub repository. This fits a static React site hosted on GitHub Pages without adding a separate content database.

Configure clearly named Hebrew fields for:

- Business settings: name, address, telephone, optional WhatsApp and email, optional opening hours, and map links.
- Main-page content: opening message, story, custom-build explanation, and featured images.
- Furniture entries: descriptive title, category, image, optional verified specifications, optional current price in shekels, price wording, display order, and publication status.
- Image uploads.

The user approved the external Pages CMS editor and GitHub Pages publishing. The Hebrew forms are configured in `.pages.yml`. The family edits through forms and saves to `main`; the GitHub workflow checks the content and republishes successful builds. Content and media changes remain in Git history. The Pages CMS GitHub App installation was confirmed on October 2, 2026 for `olympic-furniture`, with **Only select repositories** selected. The organization contained only the target repository at that check. Installation is complete; the authenticated editing forms have not been verified. See [the editing guide](editing-guide.he.md) for sign-in, conditional installation and saving instructions.

## Content and deployment structure

Use Vite to build the React application. Keep typed content models separate from presentation components. Store business settings and furniture entries as editable structured files and photographs as repository assets. Validate content during the build so malformed prices, broken local image references, or invalid required contact fields produce useful errors.

Use reusable components for navigation, category browsing, the gallery, the family story, and contact links. Bundle the initial content with the site so the public page does not depend on a runtime CMS API. Organize Hebrew copy separately from components to support future Russian, English, Arabic, and French versions without adding those languages now.

Deploy with GitHub Actions to GitHub Pages. The organization must be named olympic-furniture, and its root-site repository must be olympic-furniture.github.io. Transfer an existing repository if the user identifies one; otherwise create the new repository directly in the organization.

The user supplied https://github.com/olympic-furniture/olympic-furniture.github.io after organization setup. The organization and public repository exist. Organization administrator membership and repository ADMIN permission were confirmed on October 2, 2026. No repository transfer is necessary. The repository includes the publishing workflow; its [run history](https://github.com/olympic-furniture/olympic-furniture.github.io/actions/workflows/deploy.yml) records verification and deployment results.

## Image and price handling

The old landing pages expose real images of the factory, wardrobes, beds, sofas, dining furniture, bedroom furniture, and the business logo. Their dimensions vary, so select images after inspecting their quality. Use local copies for the published site rather than expiring Facebook CDN links.

The Facebook public view exposes the banner and some photographs, but does not expose the complete requested date range. Verify the dates of individual photographs before using them. The authorized landing-page images and founders photograph can support the first layout while additional Facebook images are obtained.

One older landing page advertises a wardrobe at ₪1,400. Another image filename mentions a ₪1,190 promotion. These are historical promotions, not verified current prices. Do not present them as current offers. The dashboard will support prices once the family confirms them.

## Validation before handoff

- Type checking and production build pass.
- Verify real image loading and all telephone and navigation links.
- Check category filtering, image viewing, keyboard operation, and mobile navigation.
- Inspect the Hebrew layout on desktop and mobile, including mixed Hebrew and telephone numbers.
- Verify that editing the configured content changes the built site.
- Check the deployed site and deployment workflow once the organization, repository, and Pages setup exist.
- The grandfather's review of Hebrew business copy is a follow-up to initial publication. Publishing is authorized by the user's destination request and approved brief; add prices and other unconfirmed details only after business approval.

## Sources

- Confirmed business landing page: https://lp.vp4.me/gqio
- Wardrobe landing page: https://lp.vp4.me/8pdw
- Facebook page: https://www.facebook.com/olimpicfurniture/
- Google Maps listing: https://maps.app.goo.gl/Rmt7VBAiNX9wAXhS8
- User's visual reference: https://oren-bechor-drive.github.io/
- Pages CMS overview: https://pagescms.org/docs/
- Pages CMS setup: https://pagescms.org/docs/quick-start/
- Pages CMS configuration: https://pagescms.org/docs/configuration/
- GitHub organization setup: https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/creating-a-new-organization-from-scratch
