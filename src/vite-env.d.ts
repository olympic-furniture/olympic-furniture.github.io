/// <reference types="vite/client" />

declare module 'virtual:olympic-content' {
  export const site: import('./content/schema').SiteContent;
  export const products: import('./content/schema').Product[];
}
