// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { cp, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { parse } from 'yaml';
import { JSDOM } from 'jsdom';
import { categories } from '../src/content/categories';
import { productSchema, siteSchema } from '../src/content/schema';

const projectRoot = process.cwd();
type Field = { name: string; type: string; required?: boolean; list?: boolean; fields?: Field[]; options?: { values?: { name: string; label: string }[]; media?: string; min?: number } };
type Entry = { name: string; path: string; format: string; type: string; fields: Field[] };
let root: string;
let html: string;
let config: { content: Entry[]; media: { name: string; input: string; output: string; rename: string; extensions: string[] }[] };
let output: string;

describe('editor contract and production output', () => {
  beforeAll(async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'olympic-publishing-'));
    await Promise.all(['content', 'public', 'src', 'scripts', 'index.html', 'wood-preview', 'vite.config.ts', 'package.json'].map((file) =>
      cp(path.join(projectRoot, file), path.join(root, file), { recursive: true })));
    await symlink(path.join(projectRoot, 'node_modules'), path.join(root, 'node_modules'), 'dir');
    // This is an isolated editor save. Production business content stays unchanged.
    const site = JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf8'));
    site.name = 'בדיקת עריכה </script><script>alert("cms")</script> & חנות';
    site.heroTitle = 'כותרת בדיקת עריכה';
    site.heroDescription = 'תיאור בדיקה "חדש" <img src=x onerror=alert(1)>';
    site.heroImage = '/images/cms-added.webp';
    site.address = 'רחוב בדיקה 12, עיר בדיקה';
    site.email = null;
    site.whatsapp = '';
    site.hoursText = null;
    await writeFile(path.join(root, 'content/site.json'), JSON.stringify(site));
    const product = {
      title: 'כותרת רהיט ערוכה', category: 'wardrobes', image: '/images/cms-added.webp',
      description: 'תיאור טקסט חדש', published: true, order: 0, price: 2345.5, priceFrom: true,
    };
    await cp(path.join(root, 'public/images/white-wardrobe.webp'), path.join(root, 'public/images/cms-added.webp'));
    await writeFile(path.join(root, 'content/products/white-wardrobe.json'), JSON.stringify(product));
    await writeFile(path.join(root, 'content/products/cms-new.json'), JSON.stringify({ ...product, title: 'רהיט חדש מהעורך', category: 'office' }));
    await writeFile(path.join(root, 'content/products/cms-draft.json'), JSON.stringify({ ...product, published: false, description: 'PRIVATE_EDITOR_DRAFT_742' }));
    execFileSync(process.execPath, [path.join(projectRoot, 'node_modules/vite/bin/vite.js'), 'build'], { cwd: root, stdio: 'pipe' });
    html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
    const assets = (await readdir(path.join(root, 'dist/assets'))).filter((file) => file.endsWith('.js'));
    output = html + (await Promise.all(assets.map((file) => readFile(path.join(root, 'dist/assets', file), 'utf8')))).join('\n');
    config = parse(await readFile(path.join(projectRoot, '.pages.yml'), 'utf8').catch(() => 'content: []\nmedia: []'));
  }, 30000);
  afterAll(async () => { if (root) await rm(root, { recursive: true, force: true }); });

  it('maps every editable field to the content schema and local media source', () => {
    const furniture = config.content.find(({ name }) => name === 'products');
    const site = config.content.find(({ name }) => name === 'site');
    expect(furniture).toBeDefined();
    expect(site).toBeDefined();
    expect(furniture).toMatchObject({ type: 'collection', format: 'json', path: 'content/products' });
    expect(site).toMatchObject({ type: 'file', format: 'json', path: 'content/site.json' });
    expect(furniture!.fields.map(({ name }) => name).sort()).toEqual(Object.keys(productSchema.shape).sort());
    expect(site!.fields.map(({ name }) => name).sort()).toEqual(Object.keys(siteSchema.shape).sort());
    const field = (entry: Entry, name: string) => entry.fields.find((value) => value.name === name)!;
    expect(field(furniture!, 'category').options?.values).toEqual(categories.map(({ id, label }) => ({ name: id, label })));
    expect(field(furniture!, 'description').type).toBe('text');
    expect(field(furniture!, 'published')).toMatchObject({ type: 'boolean', required: true });
    expect(field(furniture!, 'price')).toMatchObject({ type: 'number', options: { min: 0.01 } });
    expect(field(furniture!, 'priceFrom').type).toBe('boolean');
    expect(field(site!, 'storyParagraphs')).toMatchObject({ type: 'text', list: true });
    expect(field(site!, 'customOptions')).toMatchObject({ type: 'object', list: true });
    expect(field(site!, 'customOptions').fields?.map(({ name }) => name)).toEqual(['title', 'description']);
    expect(config.media).toContainEqual(expect.objectContaining({ name: 'images', input: 'public/images', output: '/images', rename: 'safe' }));
    for (const entry of config.content) {
      for (const image of entry.fields.filter(({ type }) => type === 'image')) expect(image.options?.media).toBe('images');
    }
  });

  it('publishes edited fields, a new record, price and uploaded image while excluding drafts', async () => {
    for (const value of ['כותרת בדיקת עריכה', 'כותרת רהיט ערוכה', 'תיאור טקסט חדש', 'רהיט חדש מהעורך', '2345.5', '/images/cms-added.webp']) expect(output).toContain(value);
    expect(output).not.toContain('PRIVATE_EDITOR_DRAFT_742');
    expect(await readFile(path.join(root, 'dist/images/cms-added.webp'))).toEqual(await readFile(path.join(root, 'public/images/cms-added.webp')));
  });

  it('generates current metadata and safely embeds the store JSON-LD', async () => {
    const document = new JSDOM(html).window.document;
    const name = 'בדיקת עריכה </script><script>alert("cms")</script> & חנות';
    expect(document.title).toContain(name);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://olympic-furniture.github.io/');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('תיאור בדיקה "חדש" <img src=x onerror=alert(1)>');
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toContain(name);
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe('https://olympic-furniture.github.io/images/cms-added.webp');
    expect(document.querySelectorAll('script:not([src])')).toHaveLength(1);
    expect(document.querySelector('img')).toBeNull();
    const json = document.querySelector('script[type="application/ld+json"]')?.textContent;
    expect(json).toBeDefined();
    expect(json).not.toContain('<');
    expect(JSON.parse(json!)).toEqual({
      '@context': 'https://schema.org', '@type': 'FurnitureStore', name, url: 'https://olympic-furniture.github.io/', telephone: '09-861-8985',
      address: { '@type': 'PostalAddress', streetAddress: 'רחוב בדיקה 12', addressLocality: 'עיר בדיקה', addressCountry: 'IL' },
    });
    expect(await readFile(path.join(root, 'dist/robots.txt'), 'utf8')).toContain('Sitemap: https://olympic-furniture.github.io/sitemap.xml');
    const sitemap = new JSDOM(await readFile(path.join(root, 'dist/sitemap.xml'), 'utf8'), { contentType: 'text/xml' }).window.document;
    expect(sitemap.querySelector('loc')?.textContent).toBe('https://olympic-furniture.github.io/');
  });

  it('builds the separate design preview without indexing it or changing the homepage identity', async () => {
    const preview = new JSDOM(await readFile(path.join(root, 'dist/wood-preview/index.html'), 'utf8')).window.document;
    expect(preview.documentElement.getAttribute('dir')).toBe('rtl');
    expect(preview.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow');
    expect(preview.querySelector('link[rel="canonical"]')).toBeNull();
    expect(preview.querySelector('script[type="module"][src]')).not.toBeNull();
    expect(new JSDOM(html).window.document.title).toContain('כותרת בדיקת עריכה');
  });
});
