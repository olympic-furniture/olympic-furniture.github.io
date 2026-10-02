import type { Plugin } from 'vite';
import type { SiteContent } from '../src/content/schema.ts';
import { readContent } from './read-content.ts';

const siteUrl = 'https://olympic-furniture.github.io/';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
}

function metadata(site: SiteContent): string {
  const title = `${site.name} | ${site.heroTitle}`;
  const description = `${site.heroDescription} ${site.address}. ${site.phone}.`;
  const parts = site.address.split(',').map((part) => part.trim());
  const locality = parts.length > 1 ? parts.pop() : undefined;
  const store = {
    '@context': 'https://schema.org', '@type': 'FurnitureStore',
    name: site.name, url: siteUrl, telephone: site.phone,
    address: {
      '@type': 'PostalAddress', streetAddress: parts.join(', '),
      ...(locality ? { addressLocality: locality } : {}), addressCountry: 'IL',
    },
  };
  // JSON string escaping alone does not stop an HTML parser closing a script.
  const structuredData = JSON.stringify(store).replace(/</g, '\\u003c');
  return `<title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${siteUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="he_IL" />
    <meta property="og:site_name" content="${escapeHtml(site.name)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${siteUrl}" />
    <meta property="og:image" content="${escapeHtml(new URL(site.heroImage, siteUrl).href)}" />
    <meta property="og:image:alt" content="${escapeHtml(site.heroTitle)}" />
    <script type="application/ld+json">${structuredData}</script>`;
}

/** Generate SEO files and HTML from the same validated source as the public UI. */
export function furnitureMetadataPlugin(root: string = process.cwd()): Plugin {
  return {
    name: 'olympic-metadata',
    async transformIndexHtml(html) {
      const { site } = await readContent(root);
      return html.replace('<!-- site-metadata -->', metadata(site));
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n` });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}</loc></url></urlset>\n` });
    },
  };
}
