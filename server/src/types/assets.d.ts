// Wrangler bundles *.jpg as Data modules (see "rules" in wrangler.jsonc).
declare module '*.jpg' {
  const content: ArrayBuffer;
  export default content;
}
