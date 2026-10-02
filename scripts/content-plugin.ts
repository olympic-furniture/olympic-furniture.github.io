import path from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import { readContent } from './read-content.ts';

const moduleId = 'virtual:olympic-content';
const resolvedId = `\0${moduleId}`;

export function furnitureContentPlugin(root: string = process.cwd()) {
  return {
    name: 'olympic-public-content',
    resolveId(id: string) {
      if (id === moduleId) return resolvedId;
    },
    async load(id: string) {
      if (id !== resolvedId) return;
      const { site, products } = await readContent(root);
      return `export const site = ${JSON.stringify(site)};\nexport const products = ${JSON.stringify(products)};\n`;
    },
    configureServer(server: ViteDevServer) {
      const contentDirectory = path.resolve(root, 'content');
      server.watcher.add(contentDirectory);
      const onContentChange = (_event: string, filename: string) => {
        const relative = path.relative(contentDirectory, path.resolve(filename));
        if (relative.startsWith('..') || path.isAbsolute(relative) || !relative.endsWith('.json')) return;
        const virtualModule = server.moduleGraph.getModuleById(resolvedId);
        if (virtualModule) server.moduleGraph.invalidateModule(virtualModule);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('all', onContentChange);
      server.httpServer?.once('close', () => server.watcher.off('all', onContentChange));
    },
  } satisfies Plugin;
}
