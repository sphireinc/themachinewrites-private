import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('website CI security policy', () => {
  const workflow = readFileSync('.github/workflows/security.yml', 'utf8');
  const ci = readFileSync('.github/workflows/ci.yml', 'utf8');

  it('uses read-only contents permissions and high-severity dependency review', () => {
    expect(workflow).toMatch(/permissions:\n\s+contents: read/);
    expect(workflow).toContain('gitleaks/gitleaks-action@v2');
    expect(workflow).toContain('actions/dependency-review-action@v4');
    expect(workflow).toContain('fail-on-severity: high');
    expect(workflow).toContain('npm audit --audit-level=high');
    expect(workflow).toContain('schedule:');
  });

  it('keeps the build workflow tokenless and reproducible from the lockfile', () => {
    expect(ci).toContain('node-version: \'22\'');
    expect(ci).toContain('npm ci');
    expect(ci).not.toMatch(/secrets\.|write-all|contents:\s*write/);
  });
});
