import { readFileSync, readdirSync } from 'node:fs';

describe('approved design tokens', () => {
  it('ships canvas, divider, accent and token utility CSS', () => {
    const asset = readdirSync('dist/assets').find((name) => name.endsWith('.css'));
    expect(asset).toBeDefined();
    const css = readFileSync(`dist/assets/${asset}`, 'utf8');
    expect(css).toMatch(/--tmw-canvas:\s*#(?:fff|ffffff)(?=;|})/i);
    expect(css).toMatch(/--tmw-divider:\s*#d8e1eb(?=;|})/i);
    expect(css).toMatch(/--tmw-accent:\s*#1672f4(?=;|})/i);
    expect(css).toContain('.bg-canvas');
  });
});
