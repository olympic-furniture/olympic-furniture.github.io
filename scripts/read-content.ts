import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { assertImageAssets, parseProductEntries, selectPublicProducts, siteSchema } from '../src/content/schema.ts';

/** Shared Node-only validation for CLI checks and Vite's public content module. */
export async function readContent(root: string) {
  async function readJson(relativePath: string): Promise<unknown> {
    try {
      return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
    } catch (error) {
      throw new Error(`Cannot read ${relativePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const parsedSite = siteSchema.safeParse(await readJson('content/site.json'));
  if (!parsedSite.success) throw new Error(`Invalid content/site.json: ${parsedSite.error.message}`);
  const site = parsedSite.data;
  const files = (await readdir(path.join(root, 'content/products'))).filter((file) => file.endsWith('.json'));
  const entries = Object.fromEntries(await Promise.all(files.map(async (filename) => {
    const relativePath = `content/products/${filename}`;
    return [relativePath, await readJson(relativePath)];
  })));
  const allProducts = parseProductEntries(entries);
  const products = selectPublicProducts(allProducts);
  const imageEntries = await readdir(path.join(root, 'public/images'), { recursive: true, withFileTypes: true });
  const available = new Set(imageEntries.filter((entry) => entry.isFile()).map((entry) =>
    `/${path.relative(path.join(root, 'public'), path.join(entry.parentPath, entry.name)).split(path.sep).join('/')}`));
  // A missing image in a draft also needs correction before publication.
  assertImageAssets(site, allProducts, available);
  return { site, products, totalProducts: allProducts.length };
}
