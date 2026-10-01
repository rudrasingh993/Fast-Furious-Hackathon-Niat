const fs = require('fs');
const path = require('path');

function ensure(relPath, content) {
  const p = path.resolve('src/shaders', relPath);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
}

ensure('landing-pages/sandboxedPageDocument.ts', 'export function buildSandboxedPageDocument(source: string, options?: any) { return source; }\n');
ensure('tidecrest-hero/tidecrestDocument.js', 'export function buildTidecrestDocument(variant) { return ""; }\n');
ensure('meridian-landing-page/meridianDocument.js', 'export function buildMeridianDocument(variant, presentation) { return ""; }\n');
ensure('ascii-field/asciiFieldDocuments.js', 'export function buildAsciiFieldDocument(variant) { return ""; }\n');
ensure('betawise-globe/betawiseGlobeDocument.js', 'export function buildBetawiseGlobeDocument(variant) { return ""; }\n');
ensure('sylva-living-world/sources/inner-green-3d.html', '<!-- inner-green-3d stub -->\n');
ensure('axonis-field/axonis-arbor.html', '<!-- stub -->\n');
ensure('axonis-field/axonis-vortex.html', '<!-- stub -->\n');
ensure('axonis-field/axonis-tide.html', '<!-- stub -->\n');
ensure('axonis-field/axonis-dune.html', '<!-- stub -->\n');
ensure('nocturne-hero/NocturneScene.ts', `
export const NOCTURNE_TITLES: Record<string, string> = {};
export const NOCTURNE_VARIANTS = ['midnight'] as const;
export type NocturneVariant = (typeof NOCTURNE_VARIANTS)[number];
export function buildNocturneDocument(variant: NocturneVariant): string { return ''; }
`);
ensure('sylva-living-world/SylvaLivingWorldScene.ts', `
export const MAPLE_AUTUMN_STYLE = '';
export const SAKURA_SUNSET_STYLE = '';
export const SEQUOIA_MIST_STYLE = '';
export function applyMapleAutumnVariant(source: string): string { return source; }
export function applySakuraSunsetVariant(source: string): string { return source; }
export function applySequoiaMistVariant(source: string): string { return source; }
`);

console.log('ThreeUI catalog stubs created successfully!');
