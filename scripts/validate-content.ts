import { fileURLToPath } from 'node:url';
import { readContent } from './read-content';

const root = fileURLToPath(new URL('../', import.meta.url));

try {
  const { totalProducts, products } = await readContent(root);
  console.log(`Content valid: ${totalProducts} furniture records, ${products.length} published; all referenced images exist.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
