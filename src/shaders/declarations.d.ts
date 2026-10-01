declare module '../sylva-living-world/sources/inner-green-3d.html?raw' {
  const content: string;
  export default content;
}
declare module '../tidecrest-hero/tidecrestDocument.js' {
  export const buildTidecrestDocument: (variant: any) => string;
}
declare module '../meridian-landing-page/meridianDocument.js' {
  export const buildMeridianDocument: (variant: any, presentation?: any) => string;
}
declare module '../ascii-field/asciiFieldDocuments.js' {
  export const buildAsciiFieldDocument: (variant: any) => string;
}
declare module '../betawise-globe/betawiseGlobeDocument.js' {
  export const buildBetawiseGlobeDocument: (variant: any) => string;
}
declare module '../axonis-field/axonis-arbor.html?raw' {
  const content: string;
  export default content;
}
declare module '../axonis-field/axonis-vortex.html?raw' {
  const content: string;
  export default content;
}
declare module '../axonis-field/axonis-tide.html?raw' {
  const content: string;
  export default content;
}
declare module '../axonis-field/axonis-dune.html?raw' {
  const content: string;
  export default content;
}
declare module '../nocturne-hero/NocturneScene' {
  export const NOCTURNE_TITLES: Record<string, string>;
  export const NOCTURNE_VARIANTS: readonly string[];
  export type NocturneVariant = string;
  export const buildNocturneDocument: (variant: any) => string;
}
declare module './sandboxedPageDocument' {
  export const buildSandboxedPageDocument: (source: string, options?: any) => string;
}
declare module '../sylva-living-world/SylvaLivingWorldScene' {
  export const MAPLE_AUTUMN_STYLE: string;
  export const SAKURA_SUNSET_STYLE: string;
  export const SEQUOIA_MIST_STYLE: string;
  export const applyMapleAutumnVariant: (source: string) => string;
  export const applySakuraSunsetVariant: (source: string) => string;
  export const applySequoiaMistVariant: (source: string) => string;
}
