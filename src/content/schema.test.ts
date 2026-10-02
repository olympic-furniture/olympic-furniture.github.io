import { describe, expect, it } from 'vitest';
import {
  assertImageAssets,
  loadProductEntries,
  productSchema,
  siteSchema,
} from './schema';

const validProduct = {
  title: 'ארון הזזה לבן',
  category: 'wardrobes' as const,
  image: '/images/wardrobe.webp',
  description: 'ארון הזזה עם דלתות לבנות.',
  published: true,
  order: 1,
};

const validSite = {
  name: 'רהיטי אולימפיק',
  phone: '09-861-8985',
  address: 'האורזים 6, נתניה',
  mapsUrl: 'https://maps.app.goo.gl/Rmt7VBAiNX9wAXhS8',
  wazeUrl: 'https://www.waze.com/ul?q=האורזים%206%20נתניה&navigate=yes',
  facebookUrl: 'https://www.facebook.com/olimpicfurniture/',
  heroTitle: 'ריהוט לבית, בדיוק כמו שרציתם.',
  heroDescription: 'מבחר רהיטים והתאמה אישית.',
  heroImage: '/images/hero.webp',
  storyTitle: 'עסק משפחתי מאז 1980',
  storyParagraphs: ['רהיטי אולימפיק הוא עסק משפחתי בנתניה.'],
  storyImage: '/images/founders.webp',
  founders: 'מושה אבן ימין וגילה אבן ימין',
  customTitle: 'התאמה לבית שלכם',
  customDescription: 'בוחרים מידות, חומרים וצבעים.',
  customOptions: [{ title: 'מידות', description: 'לפי המקום בבית.' }],
};

describe('editable furniture validation', () => {
  it.each([-1, 0, Infinity, -Infinity, NaN])('rejects invalid price %s', (price) => {
    expect(() => productSchema.parse({ ...validProduct, price })).toThrow();
  });

  it('keeps a confirmed positive price and its starting-price flag', () => {
    expect(productSchema.parse({ ...validProduct, price: 1800, priceFrom: true }))
      .toMatchObject({ price: 1800, priceFrom: true });
  });

  it.each(['javascript:alert(1)', 'https://example.com/image.jpg', '/images/../secret.jpg',
    '/images/%2e%2e/secret.jpg', '/images/photo.webp?price=1', '/other/photo.jpg'])
    ('rejects unsafe or nonlocal image %s', (image) => {
      expect(() => productSchema.parse({ ...validProduct, image })).toThrow();
    });

  it('rejects an unsupported category instead of hiding the furniture silently', () => {
    expect(() => productSchema.parse({ ...validProduct, category: 'unknown' })).toThrow();
  });

  it('accepts CMS filenames with spaces and Hebrew', () => {
    const image = '/images/ארון הזזה לבן.webp';
    expect(productSchema.parse({ ...validProduct, image }).image).toBe(image);
  });

  it.each(['/images/photo.txt', '/images/folder\\photo.jpg', '/images/photo.webp#preview'])
    ('rejects non-image extensions and URL ambiguity in %s', (image) => {
      expect(() => productSchema.parse({ ...validProduct, image })).toThrow();
    });

  it.each([null, '', '   '])('normalizes CMS empty optional fields %s', (empty) => {
    const parsed = productSchema.parse({ ...validProduct, price: empty, priceFrom: empty });
    expect(parsed.price).toBeUndefined();
    expect(parsed.priceFrom).toBeUndefined();
  });

  it('preserves descriptions as text for React to escape', () => {
    const description = '<b>ארון לבן</b>';
    expect(productSchema.parse({ ...validProduct, description }).description).toBe(description);
  });
});

describe('business settings validation', () => {
  it.each(['', 'call us', '123', '+972<script>'])('rejects malformed required phone %s', (phone) => {
    expect(() => siteSchema.parse({ ...validSite, phone })).toThrow();
  });

  it('normalizes optional contact fields from the CMS', () => {
    const parsed = siteSchema.parse({ ...validSite, email: null, whatsapp: '', hoursText: '  ' });
    expect(parsed.email).toBeUndefined();
    expect(parsed.whatsapp).toBeUndefined();
    expect(parsed.hoursText).toBeUndefined();
  });

  it('rejects unsafe navigation links', () => {
    expect(() => siteSchema.parse({ ...validSite, mapsUrl: 'javascript:alert(1)' })).toThrow();
  });
});

describe('public furniture loader', () => {
  it('excludes drafts and derives the public id from the filename', () => {
    const result = loadProductEntries({
      '../../content/products/wardrobe.json': validProduct,
      '../../content/products/draft.json': { ...validProduct, published: false },
    });
    expect(result.map((product) => product.id)).toEqual(['wardrobe']);
  });

  it('uses display order and filename tie breaking regardless of object insertion order', () => {
    const result = loadProductEntries({
      '../../content/products/z.json': { ...validProduct, order: 2 },
      '../../content/products/c.json': { ...validProduct, order: 1 },
      '../../content/products/a.json': { ...validProduct, order: 1 },
    });
    expect(result.map((product) => product.id)).toEqual(['a', 'c', 'z']);
  });

  it('validates drafts too and identifies the source file on failure', () => {
    expect(() => loadProductEntries({
      '../../content/products/bad-draft.json': { ...validProduct, published: false, price: -1 },
    })).toThrow(/bad-draft.json/);
  });
});

describe('local image references', () => {
  const available = new Set(['/images/hero.webp', '/images/founders.webp', '/images/wardrobe.webp']);

  it('accepts existing site and furniture assets', () => {
    expect(() => assertImageAssets(validSite, [{ ...validProduct, id: 'wardrobe' }], available))
      .not.toThrow();
  });

  it('rejects a missing product image with an actionable filename', () => {
    expect(() => assertImageAssets(validSite,
      [{ ...validProduct, id: 'broken', image: '/images/missing.webp' }], available))
      .toThrow(/broken.*\/images\/missing.webp/);
  });

  it('rejects a missing opening or family image', () => {
    expect(() => assertImageAssets({ ...validSite, storyImage: '/images/missing.webp' }, [], available))
      .toThrow(/storyImage.*\/images\/missing.webp/);
  });
});
