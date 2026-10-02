import { z } from 'zod';
import { categories } from './categories.ts';

const categoryIds = categories.map(({ id }) => id);
const requiredText = z.string().trim().min(1, 'Required text cannot be blank');
const phone = requiredText.refine((value) =>
  /^(?:0(?:[23489]\d{7}|5\d{8})|\+972(?:[23489]\d{7}|5\d{8}))$/
    .test(value.replace(/[ ()-]/g, '')), 'Use a valid Israeli telephone number');
const httpsUrl = z.string().url().refine((value) => new URL(value).protocol === 'https:',
  'Use an HTTPS link');
const localImage = requiredText.refine((value) => {
  if (!value.startsWith('/images/') || /[\\%?#\u0000-\u001f]/.test(value)) return false;
  const segments = value.slice('/images/'.length).split('/');
  return segments.every((segment) => segment !== '' && segment !== '.' && segment !== '..')
    && /\.(?:jpe?g|png|webp|avif|gif|svg)$/i.test(value);
}, 'Image must be a local /images/ file without traversal or URL parameters');

// Pages CMS may serialize an unset field as null or a blank string.
function normalizeEmpty(value: unknown): unknown {
  return value === null || (typeof value === 'string' && value.trim() === '') ? undefined : value;
}

function optional<T extends z.ZodType>(schema: T) {
  return z.preprocess(normalizeEmpty, schema.optional());
}

export const productSchema = z.object({
  title: requiredText,
  category: z.enum(categoryIds),
  image: localImage,
  description: requiredText,
  published: z.boolean(),
  order: z.number().int().nonnegative(),
  price: optional(z.number().finite().positive()),
  priceFrom: optional(z.boolean()),
});

export const siteSchema = z.object({
  name: requiredText,
  phone,
  address: requiredText,
  mapsUrl: httpsUrl,
  wazeUrl: httpsUrl,
  facebookUrl: httpsUrl,
  heroTitle: requiredText,
  heroDescription: requiredText,
  heroImage: localImage,
  storyTitle: requiredText,
  storyParagraphs: z.array(requiredText).min(1),
  storyImage: localImage,
  founders: requiredText,
  customTitle: requiredText,
  customDescription: requiredText,
  customOptions: z.array(z.object({ title: requiredText, description: requiredText })).min(1),
  email: optional(z.string().trim().email()),
  whatsapp: optional(phone),
  hoursText: optional(requiredText),
});

export type SiteContent = z.infer<typeof siteSchema>;
export type Product = z.infer<typeof productSchema> & { id: string };
export type CategoryId = Product['category'];

/** Validate every record, including drafts, with filename context for the editor. */
export function parseProductEntries(entries: Record<string, unknown>): Product[] {
  return Object.entries(entries).map(([filename, value]) => {
    const parsed = productSchema.safeParse(value);
    if (!parsed.success) throw new Error(`Invalid furniture in ${filename}: ${parsed.error.message}`);
    const id = filename.split('/').at(-1)?.replace(/\.json$/, '');
    if (!id) throw new Error(`Missing furniture filename: ${filename}`);
    return { ...parsed.data, id };
  });
}

/** Public visibility and stable sorting are shared by the application and build checks. */
export function loadProductEntries(entries: Record<string, unknown>): Product[] {
  return parseProductEntries(entries)
    .filter(({ published }) => published)
    .sort((a, b) => a.order - b.order || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

export function assertImageAssets(site: SiteContent, products: Product[], available: Set<string>): void {
  const references = [
    { source: 'site.heroImage', image: site.heroImage },
    { source: 'site.storyImage', image: site.storyImage },
    ...products.map(({ id, image }) => ({ source: `furniture ${id}`, image })),
  ];
  const missing = references.filter(({ image }) => !available.has(image));
  if (missing.length) {
    throw new Error(`Missing local images:\n${missing.map(({ source, image }) => `${source}: ${image}`).join('\n')}`);
  }
}
