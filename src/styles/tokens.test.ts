import { readFileSync, readdirSync } from 'node:fs';

describe('approved design tokens', () => {
  it('ships canvas, divider, accent and token utility CSS', () => {
    const asset = readdirSync('dist/assets').find((name) => name.endsWith('.css'));
    expect(asset).toBeDefined();
    const css = readFileSync(`dist/assets/${asset}`, 'utf8');
    expect(css).toContain('--tmw-canvas: #FFFFFF');
    expect(css).toContain('--tmw-divider: #D8E1EB');
    expect(css).toContain('--tmw-accent: #1672F4');
    expect(css).toContain('.bg-canvas');
  });
});
