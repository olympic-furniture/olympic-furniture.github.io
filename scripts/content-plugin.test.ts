// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createServer } from 'vite';
import siteFixture from '../content/site.json';
import { furnitureContentPlugin } from './content-plugin';

const furniture = {
  title: 'ארון תצוגה', category: 'wardrobes', image: '/images/furniture.webp',
  description: 'ארון בגוון בהיר.', published: true, order: 2,
};
let root: string;

async function writeProduct(id: string, data: unknown) {
  await writeFile(path.join(root, `content/products/${id}.json`), JSON.stringify(data));
}

function exportedProducts(code: string | undefined) {
  const serialized = code?.match(/export const products = (.*);/u)?.[1];
  if (!serialized) throw new Error('Virtual module did not export products');
  return JSON.parse(serialized);
}

describe('public virtual content module', () => {
  beforeEach(async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'olympic-content-'));
    await mkdir(path.join(root, 'content/products'), { recursive: true });
    await mkdir(path.join(root, 'public/images'), { recursive: true });
    await writeFile(path.join(root, 'content/site.json'), JSON.stringify({
      ...siteFixture, heroImage: '/images/hero.webp', storyImage: '/images/founders.webp',
    }));
    await Promise.all(['hero.webp', 'founders.webp', 'furniture.webp'].map((file) =>
      writeFile(path.join(root, `public/images/${file}`), 'fixture asset')));
  });

  afterEach(async () => { await rm(root, { recursive: true, force: true }); });

  it('omits private draft data from the actual browser module output', async () => {
    await writeProduct('public', furniture);
    await writeProduct('draft', {
      ...furniture, published: false, description: 'PRIVATE_DRAFT_SENTINEL_92',
    });
    const code = await furnitureContentPlugin(root).load('\0virtual:olympic-content');
    expect(code).not.toContain('PRIVATE_DRAFT_SENTINEL_92');
    expect(exportedProducts(code).map((product: { id: string }) => product.id)).toEqual(['public']);
  });

  it('serializes fresh editor changes and stable display order', async () => {
    await writeProduct('a-last', furniture);
    await writeProduct('z-first', { ...furniture, order: 0 });
    const plugin = furnitureContentPlugin(root);
    await plugin.load('\0virtual:olympic-content');
    await writeProduct('a-last', { ...furniture, title: 'הארון הערוך' });
    const output = exportedProducts(await plugin.load('\0virtual:olympic-content'));
    expect(output.map((product: { id: string }) => product.id)).toEqual(['z-first', 'a-last']);
    expect(output[1]).toMatchObject({ title: 'הארון הערוך' });
  });

  it('fails invalid draft content before stripping it out of the browser output', async () => {
    await writeProduct('bad-draft', { ...furniture, published: false, price: -1 });
    await expect(furnitureContentPlugin(root).load('\0virtual:olympic-content'))
      .rejects.toThrow(/bad-draft.json/);
  });

  it('rejects a missing draft image before stripping the draft from browser output', async () => {
    await writeProduct('draft-missing-image', {
      ...furniture, published: false, image: '/images/missing.webp',
    });
    await expect(furnitureContentPlugin(root).load('\0virtual:olympic-content'))
      .rejects.toThrow(/furniture draft-missing-image: \/images\/missing.webp/);
  });

  it('reloads cached development content after the editor changes a JSON file', async () => {
    await writeProduct('public', furniture);
    const server = await createServer({
      configFile: false, root, plugins: [furnitureContentPlugin(root)],
      server: { port: 0, host: '127.0.0.1' },
    });
    try {
      await server.listen();
      const before = await server.transformRequest('virtual:olympic-content');
      expect(before?.code).toContain('ארון תצוגה');
      await new Promise<void>((resolve) => {
        if (server.watcher.options.ignoreInitial && server.watcher.getWatched()[path.join(root, 'content/products')]) resolve();
        else server.watcher.once('ready', resolve);
      });
      const changeSeen = new Promise<void>((resolve) => {
        server.watcher.once('change', () => resolve());
      });
      await writeProduct('public', { ...furniture, title: 'עדכון מהעורך' });
      await changeSeen;
      const after = await server.transformRequest('virtual:olympic-content');
      expect(after?.code).toContain('עדכון מהעורך');
    } finally {
      await server.close();
    }
  });
});
