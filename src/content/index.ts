// The Vite plugin validates in Node and serializes published content only.
export { site, products } from 'virtual:olympic-content';
export { categories } from './categories';
export type { CategoryId, Product, SiteContent } from './schema';
